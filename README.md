# AI Language Learning Platform

An AI-powered language tutoring platform that provides personalized, voice-enabled French instruction through conversational AI.

## Overview

This MVP delivers a complete 15-20 minute demo experience where users:
- Create an account and complete 2-minute onboarding
- Meet their personalized AI tutor (with voice)
- Receive a custom-generated curriculum
- Complete an engaging first lesson in French
- Track all progress in their knowledge base

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS for styling
- Vite for fast development
- React Router for navigation
- Zustand for state management
- Axios for API calls

### Backend
- Node.js + Express + TypeScript
- PostgreSQL database
- Prisma ORM
- JWT authentication
- bcrypt for password hashing

### AI & Voice (Placeholders for now)
- Claude API (Anthropic) - Core tutoring intelligence
- 11 Labs API - Text-to-speech
- Web Speech API - Voice recognition

## Project Structure

```
AI-Learning-Platform/
├── backend/              # Node.js/Express backend
│   ├── prisma/          # Database schema and migrations
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Auth and other middleware
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Helper functions
│   └── package.json
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   ├── stores/      # Zustand state management
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Helper functions
│   └── package.json
│
└── MVP-Development-Plan.md  # Detailed implementation plan
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- API keys for Claude and 11 Labs (optional for initial development)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AI-Learning-Platform
```

### 2. Set Up the Database

Create a PostgreSQL database:

```bash
createdb ai_learning_platform
```

Or use a hosted solution like Railway, Supabase, or Heroku Postgres.

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env and update DATABASE_URL with your database connection string
# Example: postgresql://username:password@localhost:5432/ai_learning_platform

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The backend will run on `http://localhost:3001`

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/me` - Get current user (protected)

### User Profile
- `POST /api/profile` - Create/update user profile (onboarding)
- `GET /api/profile` - Get user profile (protected)

## Database Schema

The application uses 6 core tables:

1. **users** - Authentication and account info
2. **user_profiles** - Learning preferences and goals
3. **curriculum** - Personalized learning plans
4. **lessons** - Individual lesson content
5. **user_knowledge** - Vocabulary, grammar, skills learned
6. **lesson_sessions** - Session tracking and transcripts

See `backend/prisma/schema.prisma` for the complete schema.

## Development Workflow

### Current Implementation Status

✅ **Completed:**
- Project structure and configuration
- Backend API (auth, profiles)
- Database schema with Prisma
- Frontend pages (Login, Signup, Onboarding)
- JWT authentication
- Protected routes
- Onboarding flow (5 questions)

🚧 **Next Steps:**
1. AI Tutor introduction page with placeholder
2. Curriculum generation (Claude API integration)
3. Voice integration (11 Labs + Web Speech API)
4. First lesson implementation
5. Knowledge base tracking
6. Progress dashboard

### Running Database Migrations

```bash
cd backend
npm run prisma:migrate
```

### Viewing Database in Prisma Studio

```bash
cd backend
npm run prisma:studio
```

Opens a visual database browser at `http://localhost:5555`

## Environment Variables

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
CLAUDE_API_KEY="sk-ant-api03-..."
ELEVENLABS_API_KEY="your-key-here"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

## Testing the Application

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Click "Sign up" and create an account
4. Complete the onboarding flow
5. You'll be redirected to the AI intro page (placeholder for now)

## API Integration Guide

### Adding Claude API

1. Sign up at https://console.anthropic.com
2. Generate an API key
3. Add to `backend/.env` as `CLAUDE_API_KEY`
4. Implementation will be in `backend/src/services/ai.service.ts`

### Adding 11 Labs API

1. Sign up at https://elevenlabs.io
2. Generate an API key
3. Add to `backend/.env` as `ELEVENLABS_API_KEY`
4. Research integration details (see MVP plan section 7)

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set root directory to `backend`
3. Add PostgreSQL database
4. Add environment variables
5. Deploy

## Contributing

This is an MVP project. See `MVP-Development-Plan.md` for the complete roadmap and feature specifications.

## License

MIT

## Resources

- [MVP Development Plan](./MVP-Development-Plan.md) - Complete implementation guide
- [Executive Summary](./MVP-Executive-Summary.md) - Product overview
- [Claude API Docs](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [11 Labs API Docs](https://elevenlabs.io/docs/api-reference)
- [Prisma Docs](https://www.prisma.io/docs)
