import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { config } from '../config/env';
import { Readable } from 'stream';

interface VoiceOptions {
  text: string;
  language?: 'en' | 'fr';
  voiceId?: string;
  modelId?: string;
}

/**
 * Voice Service for 11 Labs Text-to-Speech Integration
 */
class VoiceService {
  private client: ElevenLabsClient | null = null;
  private isAvailable: boolean = false;

  // Default voice IDs (these are 11 Labs default voices)
  // You can customize these after testing different voices
  private defaultVoiceId = 'EXAVITQu4vr4xnSDxMaL'; // Sarah - female, warm
  private frenchVoiceId = 'EXAVITQu4vr4xnSDxMaL'; // Same voice works for both languages

  constructor() {
    this.initialize();
  }

  /**
   * Initialize 11 Labs client
   */
  private initialize() {
    const apiKey = config.elevenLabsApiKey;

    if (!apiKey || apiKey.includes('placeholder')) {
      console.log('⚠️  11 Labs API key not configured - voice features will use browser TTS fallback');
      this.isAvailable = false;
      return;
    }

    try {
      this.client = new ElevenLabsClient({
        apiKey: apiKey,
      });
      this.isAvailable = true;
      console.log('✅ 11 Labs voice service initialized');
    } catch (error) {
      console.error('Failed to initialize 11 Labs client:', error);
      this.isAvailable = false;
    }
  }

  /**
   * Check if 11 Labs is available
   */
  public isElevenLabsAvailable(): boolean {
    return this.isAvailable && this.client !== null;
  }

  /**
   * Convert text to speech using 11 Labs
   * Returns audio buffer or null if not available
   */
  public async textToSpeech(options: VoiceOptions): Promise<Buffer | null> {
    if (!this.isElevenLabsAvailable()) {
      console.log('11 Labs not available, client should use browser TTS');
      return null;
    }

    try {
      const { text, language = 'en', voiceId, modelId = 'eleven_multilingual_v2' } = options;

      // Select appropriate voice based on language
      const selectedVoiceId = voiceId || (language === 'fr' ? this.frenchVoiceId : this.defaultVoiceId);

      console.log(`🎤 Generating speech: "${text.substring(0, 50)}..." (${language})`);

      const audio = await this.client!.textToSpeech.convert(selectedVoiceId, {
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      });

      // Convert audio stream to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }

      const audioBuffer = Buffer.concat(chunks);
      console.log(`✅ Generated ${audioBuffer.length} bytes of audio`);

      return audioBuffer;
    } catch (error) {
      console.error('11 Labs text-to-speech error:', error);
      return null;
    }
  }

  /**
   * Stream text to speech using 11 Labs
   * Returns readable stream or null if not available
   */
  public async textToSpeechStream(options: VoiceOptions): Promise<ReadableStream | null> {
    if (!this.isElevenLabsAvailable()) {
      console.log('11 Labs not available, client should use browser TTS');
      return null;
    }

    try {
      const { text, language = 'en', voiceId, modelId = 'eleven_multilingual_v2' } = options;

      const selectedVoiceId = voiceId || (language === 'fr' ? this.frenchVoiceId : this.defaultVoiceId);

      console.log(`🎤 Streaming speech: "${text.substring(0, 50)}..." (${language})`);

      const audioStream = await this.client!.textToSpeech.convertAsStream(selectedVoiceId, {
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      });

      return audioStream;
    } catch (error) {
      console.error('11 Labs streaming error:', error);
      return null;
    }
  }

  /**
   * Get available voices from 11 Labs
   */
  public async getVoices() {
    if (!this.isElevenLabsAvailable()) {
      return { available: false, voices: [] };
    }

    try {
      const response = await this.client!.voices.getAll();
      return {
        available: true,
        voices: response.voices.map((v: any) => ({
          voice_id: v.voice_id,
          name: v.name,
          category: v.category,
          labels: v.labels,
        })),
      };
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      return { available: false, voices: [], error: 'Failed to fetch voices' };
    }
  }

  /**
   * Get service status
   */
  public getStatus() {
    return {
      available: this.isAvailable,
      provider: this.isAvailable ? '11 Labs' : 'Browser TTS (fallback)',
      model: this.isAvailable ? 'eleven_multilingual_v2' : 'N/A',
    };
  }
}

export default new VoiceService();
