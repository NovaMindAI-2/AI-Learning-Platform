import api from './api';

interface SpeechOptions {
  text: string;
  language?: 'en' | 'fr';
  voiceId?: string;
}

/**
 * Voice service for text-to-speech
 * Uses 11 Labs API if available, falls back to browser TTS
 */
class VoiceService {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying = false;

  /**
   * Check if 11 Labs is available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const { data } = await api.get('/voice/status');
      return data.available;
    } catch {
      return false;
    }
  }

  /**
   * Speak text using 11 Labs or browser TTS fallback
   */
  async speak(options: SpeechOptions): Promise<void> {
    const { text, language = 'en' } = options;

    // Stop any currently playing audio
    this.stop();

    try {
      // Try 11 Labs first
      const audioUrl = await this.generateSpeech(options);

      if (audioUrl) {
        return this.playAudio(audioUrl);
      } else {
        // Fallback to browser TTS
        return this.speakWithBrowserTTS(text, language);
      }
    } catch (error) {
      console.error('Speech error, using browser TTS:', error);
      return this.speakWithBrowserTTS(text, language);
    }
  }

  /**
   * Generate speech using 11 Labs API
   * Returns blob URL or null if not available
   */
  private async generateSpeech(options: SpeechOptions): Promise<string | null> {
    try {
      const response = await api.post(
        '/voice/tts',
        {
          text: options.text,
          language: options.language || 'en',
          voiceId: options.voiceId,
        },
        {
          responseType: 'blob',
        }
      );

      if (response.status === 503) {
        // 11 Labs not available
        return null;
      }

      // Create blob URL for audio
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      return audioUrl;
    } catch (error: any) {
      // Check if it's a 503 (service unavailable)
      if (error.response?.status === 503) {
        console.log('11 Labs not available, using browser TTS');
        return null;
      }
      throw error;
    }
  }

  /**
   * Play audio from URL
   */
  private playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.currentAudio = new Audio(audioUrl);
      this.isPlaying = true;

      this.currentAudio.onended = () => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl); // Clean up blob URL
        resolve();
      };

      this.currentAudio.onerror = (error) => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };

      this.currentAudio.play().catch(reject);
    });
  }

  /**
   * Fallback to browser text-to-speech
   */
  private speakWithBrowserTTS(text: string, language: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Browser TTS not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.9;

      utterance.onend = () => {
        this.isPlaying = false;
        resolve();
      };

      utterance.onerror = (error) => {
        this.isPlaying = false;
        reject(error);
      };

      this.isPlaying = true;
      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Stop any currently playing speech
   */
  stop(): void {
    // Stop 11 Labs audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    // Stop browser TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.isPlaying = false;
  }

  /**
   * Check if speech is currently playing
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Get available voices from 11 Labs
   */
  async getVoices() {
    try {
      const { data } = await api.get('/voice/voices');
      return data;
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      return { available: false, voices: [] };
    }
  }
}

export default new VoiceService();
