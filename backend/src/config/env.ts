import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  claudeApiKey: process.env.CLAUDE_API_KEY || 'placeholder-claude-key',
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || 'placeholder-elevenlabs-key',
};
