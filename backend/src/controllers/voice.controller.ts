import { Request, Response } from 'express';
import voiceService from '../services/voice.service';
import { z } from 'zod';

// Validation schema
const textToSpeechSchema = z.object({
  text: z.string().min(1).max(5000),
  language: z.enum(['en', 'fr']).optional().default('en'),
  voiceId: z.string().optional(),
});

/**
 * Convert text to speech
 * Returns audio buffer as response
 */
export async function textToSpeech(req: Request, res: Response) {
  try {
    const { text, language, voiceId } = textToSpeechSchema.parse(req.body);

    // Check if 11 Labs is available
    if (!voiceService.isElevenLabsAvailable()) {
      return res.status(503).json({
        error: '11 Labs not available',
        fallback: 'browser-tts',
        message: 'Please use browser text-to-speech as fallback',
      });
    }

    const audioBuffer = await voiceService.textToSpeech({
      text,
      language,
      voiceId,
    });

    if (!audioBuffer) {
      return res.status(500).json({
        error: 'Failed to generate speech',
        fallback: 'browser-tts',
      });
    }

    // Set appropriate headers for audio streaming
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'no-cache',
    });

    res.send(audioBuffer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }

    console.error('Text-to-speech error:', error);
    res.status(500).json({
      error: 'Failed to generate speech',
      fallback: 'browser-tts',
    });
  }
}

/**
 * Stream text to speech
 * Returns audio stream
 */
export async function textToSpeechStream(req: Request, res: Response) {
  try {
    const { text, language, voiceId } = textToSpeechSchema.parse(req.body);

    if (!voiceService.isElevenLabsAvailable()) {
      return res.status(503).json({
        error: '11 Labs not available',
        fallback: 'browser-tts',
      });
    }

    const audioStream = await voiceService.textToSpeechStream({
      text,
      language,
      voiceId,
    });

    if (!audioStream) {
      return res.status(500).json({
        error: 'Failed to generate speech stream',
        fallback: 'browser-tts',
      });
    }

    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    });

    // Stream the audio to the client
    const reader = audioStream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      res.end();
    } catch (streamError) {
      console.error('Streaming error:', streamError);
      res.end();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }

    console.error('Text-to-speech stream error:', error);
    res.status(500).json({
      error: 'Failed to stream speech',
      fallback: 'browser-tts',
    });
  }
}

/**
 * Get available voices
 */
export async function getVoices(req: Request, res: Response) {
  try {
    const voicesData = await voiceService.getVoices();
    res.json(voicesData);
  } catch (error) {
    console.error('Get voices error:', error);
    res.status(500).json({ error: 'Failed to fetch voices' });
  }
}

/**
 * Get voice service status
 */
export async function getStatus(req: Request, res: Response) {
  try {
    const status = voiceService.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
}
