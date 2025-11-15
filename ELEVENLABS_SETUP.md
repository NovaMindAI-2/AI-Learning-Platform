# 11 Labs Voice Integration Setup Guide

This guide explains how to set up 11 Labs API for high-quality text-to-speech in the AI Language Learning Platform.

## What is 11 Labs?

11 Labs provides state-of-the-art AI voice synthesis with:
- **Multilingual support** - All voices work in 70+ languages including French and English
- **Natural-sounding voices** - Emotionally rich, lifelike speech
- **Low latency** - Ultra-fast generation (< 75ms with Flash model)
- **Voice consistency** - Same voice characteristics across all languages

## Why We Use 11 Labs

1. **Bilingual Support** - Essential for our French/English tutoring
2. **Quality** - Far superior to browser TTS
3. **Consistency** - Same tutor voice across all lessons
4. **Professional** - Production-ready quality

## Fallback System

The app works without 11 Labs! We have a smart fallback:
- ✅ **With 11 Labs API key** → High-quality AI voice
- ✅ **Without API key** → Browser TTS (still works!)

## Getting Your API Key

### Step 1: Sign Up

1. Go to https://elevenlabs.io
2. Click "Sign Up" (free tier available)
3. Verify your email

### Step 2: Get API Key

1. Log in to your 11 Labs account
2. Click on your profile (top right)
3. Select "Profile + API Keys"
4. Click "Create API Key" or copy existing key
5. **Save it securely** - you'll need it in a moment

### Step 3: Add to Your App

**Backend (.env file):**

```bash
cd backend

# Edit .env file
nano .env  # or your preferred editor

# Replace this line:
ELEVENLABS_API_KEY="placeholder-get-from-elevenlabs-dashboard"

# With your actual key:
ELEVENLABS_API_KEY="your_actual_api_key_here"
```

**Restart backend:**

```bash
npm run dev
```

You should see: `✅ 11 Labs voice service initialized`

## Testing the Integration

### 1. Check API Status

```bash
curl http://localhost:3001/api/voice/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected response:
```json
{
  "available": true,
  "provider": "11 Labs",
  "model": "eleven_multilingual_v2"
}
```

### 2. Test in the App

1. Sign up / Log in
2. Complete onboarding
3. Go to AI Intro page
4. Listen for high-quality voice (not robotic browser TTS!)

## Voice Configuration

### Default Voice

We use a default voice ID in `backend/src/services/voice.service.ts`:

```typescript
private defaultVoiceId = 'EXAVITQu4vr4xnSDxMaL'; // Sarah - warm, female
```

### Customizing Voices

To use a different voice:

1. **List available voices:**

```bash
curl http://localhost:3001/api/voice/voices \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

2. **Choose a voice** from the response (note the `voice_id`)

3. **Update the service:**

Edit `backend/src/services/voice.service.ts`:

```typescript
private defaultVoiceId = 'YOUR_CHOSEN_VOICE_ID';
```

### Voice Settings

Adjust voice characteristics in `voice.service.ts`:

```typescript
voice_settings: {
  stability: 0.5,       // 0-1: Higher = more stable, predictable
  similarity_boost: 0.75, // 0-1: Higher = more similar to training
}
```

## API Endpoints

All endpoints require authentication (JWT token).

### POST /api/voice/tts

Convert text to speech, returns audio file.

**Request:**
```json
{
  "text": "Bonjour! Hello!",
  "language": "fr",  // "en" or "fr"
  "voiceId": "optional-voice-id"
}
```

**Response:**
- Audio file (audio/mpeg)
- Or 503 if 11 Labs unavailable (use browser TTS)

### POST /api/voice/tts/stream

Stream audio in real-time (lower latency).

**Same request format as /tts**

### GET /api/voice/voices

List all available voices.

**Response:**
```json
{
  "available": true,
  "voices": [
    {
      "voice_id": "EXAVITQu4vr4xnSDxMaL",
      "name": "Sarah",
      "category": "premade",
      "labels": {...}
    },
    ...
  ]
}
```

### GET /api/voice/status

Check if 11 Labs is available.

**Response:**
```json
{
  "available": true,
  "provider": "11 Labs",
  "model": "eleven_multilingual_v2"
}
```

## Frontend Usage

The frontend automatically uses 11 Labs if available:

```typescript
import voiceService from '@/services/voice.service';

// Speak text (automatically uses 11 Labs or browser TTS)
await voiceService.speak({
  text: "Bonjour! Comment allez-vous?",
  language: "fr"
});

// Stop speaking
voiceService.stop();

// Check if currently playing
if (voiceService.isCurrentlyPlaying()) {
  // ...
}
```

## Models

We use `eleven_multilingual_v2` (best quality):

| Model | Description | Languages | Latency | Cost |
|-------|-------------|-----------|---------|------|
| eleven_multilingual_v2 | Best quality, most natural | 29 | Normal | Standard |
| eleven_flash_v2.5 | Ultra-low latency | 32 | < 75ms | 50% cheaper |
| eleven_turbo_v2.5 | Balanced | Multiple | Low | Moderate |

To change models, update `voice.service.ts`:

```typescript
modelId = 'eleven_flash_v2.5'  // for faster, cheaper voice
```

## Pricing

11 Labs free tier includes:
- **10,000 characters/month** (~1,500 words)
- **3 custom voices**
- All languages

Paid tiers:
- **Starter**: $5/month - 30,000 characters
- **Creator**: $22/month - 100,000 characters
- **Pro**: $99/month - 500,000 characters

**Estimate for our app:**
- Average introduction: ~200 characters
- Curriculum presentation: ~500 characters
- Total per user onboarding: ~700 characters
- **Free tier supports: ~14 users/month**

## Troubleshooting

### "11 Labs not available"

1. Check your API key is correct in `.env`
2. Restart backend: `npm run dev`
3. Look for: `✅ 11 Labs voice service initialized`

### "Failed to generate speech"

1. Check your internet connection
2. Verify API key is still valid (check 11 Labs dashboard)
3. Check usage limits (free tier: 10,000 chars/month)

### Audio quality is poor

1. You're probably using browser TTS fallback
2. Add/verify your 11 Labs API key
3. Restart backend

### Voice is robotic

If the voice sounds robotic, you're using browser TTS (fallback).

**Solution:** Add your 11 Labs API key!

## Advanced Configuration

### Custom Voice Training

You can train custom voices in 11 Labs dashboard:

1. Go to Voice Lab
2. Upload voice samples (1+ minute of audio)
3. Train the voice
4. Get the `voice_id`
5. Use it in the app

### Voice Cloning

Clone specific voices for different tutor personalities:

```typescript
// In voice.service.ts
private getVoiceForPersonality(personality: string) {
  const voiceMap = {
    'encouraging': 'VOICE_ID_1',
    'fun': 'VOICE_ID_2',
    'formal': 'VOICE_ID_3',
    // ...
  };
  return voiceMap[personality] || this.defaultVoiceId;
}
```

### Streaming for Low Latency

For real-time feel, use the streaming endpoint:

```typescript
// Frontend
const response = await api.post('/voice/tts/stream', {
  text: "Long text here...",
  language: "en"
}, {
  responseType: 'stream'
});
```

## Security Best Practices

1. **Never expose API key in frontend**
   - ✅ Backend only
   - ❌ Don't put in frontend code

2. **Use environment variables**
   - ✅ `.env` file
   - ❌ Hard-coded in source

3. **Rate limiting**
   - Consider adding rate limits to voice endpoints
   - Prevent abuse of your API key

4. **Monitor usage**
   - Check 11 Labs dashboard regularly
   - Set up usage alerts

## Resources

- **11 Labs Dashboard**: https://elevenlabs.io/app
- **API Documentation**: https://elevenlabs.io/docs
- **Voice Library**: https://elevenlabs.io/voice-library
- **Pricing**: https://elevenlabs.io/pricing

## Support

Need help?
- 11 Labs support: support@elevenlabs.io
- Our docs: See README.md and SETUP.md

---

**Quick Start Checklist:**

- [ ] Sign up for 11 Labs account
- [ ] Get API key from dashboard
- [ ] Add key to `backend/.env`
- [ ] Restart backend server
- [ ] Test voice in AI intro page
- [ ] Enjoy high-quality AI voice! 🎉
