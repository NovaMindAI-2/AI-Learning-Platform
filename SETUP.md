# Setup Guide - AI Language Learning Platform

This guide will help you set up and run the AI Language Learning Platform locally.

## What We've Built

The platform now includes:

✅ **Complete Authentication System**
- User signup and login with JWT tokens
- Password validation and secure hashing
- Protected routes

✅ **Onboarding Flow**
- 5-question survey (2 minutes)
- Collects learning goals, level, schedule, and tutor personality
- Saves user profile to database

✅ **Two-Panel AI Tutor Interface**
- Left panel: Animated AI tutor visual with status indicators
- Right panel: Dynamic content display
- Voice controls (mute, volume, interrupt)
- Responsive design

✅ **AI Tutor Introduction Flow**
- Personalized greeting based on user profile
- Follow-up question about learning focus
- Curriculum generation (Claude API or mock data)
- Week-by-week curriculum presentation
- Call to action to start learning

✅ **Claude API Integration**
- Automatic curriculum generation
- Personalized tutor introduction
- Fallback to mock data for development

✅ **Database Schema**
- Complete PostgreSQL schema with 6 tables
- User profiles, curriculum, lessons, knowledge base

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and npm installed
- **PostgreSQL** database (local or hosted)
- (Optional) **Claude API key** from Anthropic
- (Optional) **11 Labs API key** for high-quality TTS

## Step-by-Step Setup

### 1. Set Up Database

#### Option A: Local PostgreSQL

```bash
# Create database
createdb ai_learning_platform

# Your database URL will be:
# postgresql://username:password@localhost:5432/ai_learning_platform
```

#### Option B: Hosted Database (Recommended for Quick Start)

Use a free hosted PostgreSQL service:
- **Supabase**: https://supabase.com (Free tier available)
- **Railway**: https://railway.app (Free tier available)
- **Neon**: https://neon.tech (Free tier available)

After creating your database, copy the connection string.

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use your preferred editor
```

**Update these values in `.env`:**

```env
# Server
PORT=3001
NODE_ENV=development

# Database - REPLACE THIS with your actual database URL
DATABASE_URL="postgresql://username:password@host:5432/ai_learning_platform"

# JWT Secret - Generate a random string for production
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Claude API (optional for development - mock data will be used)
CLAUDE_API_KEY="sk-ant-api03-your-key-here"

# 11 Labs (not used yet)
ELEVENLABS_API_KEY="your-key-here"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

**Generate Prisma Client and run migrations:**

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Verify database with Prisma Studio (optional)
npm run prisma:studio
```

**Start backend server:**

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📝 Environment: development
🌐 Frontend URL: http://localhost:3000
```

### 3. Frontend Setup

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

You should see:
```
  VITE vX.X.X  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

### 4. Test the Application

1. **Open browser**: Navigate to http://localhost:3000

2. **Sign up**:
   - Click "Sign up"
   - Enter email and password (min 8 chars, 1 uppercase, 1 number)
   - Click "Create Account"

3. **Complete Onboarding**:
   - Select your French level
   - Choose your learning goal
   - Set your study schedule
   - Pick your tutor personality
   - Click "Complete Setup"

4. **Meet Your AI Tutor**:
   - See the animated AI tutor on the left
   - Read the personalized introduction
   - Answer the follow-up question
   - Watch as curriculum is generated
   - View your personalized learning plan

5. **Explore**:
   - Click "Let's Start!" to go to dashboard
   - Check the voice controls (mute, volume)
   - Note: Voice uses browser TTS for now (11 Labs integration coming)

## Getting Claude API Key (Optional)

If you want real AI-generated curricula instead of mock data:

1. **Sign up** at https://console.anthropic.com
2. **Create API key** in the dashboard
3. **Add to backend/.env**:
   ```env
   CLAUDE_API_KEY="sk-ant-api03-your-actual-key-here"
   ```
4. **Restart backend server**

The app works perfectly with mock data for testing, so this is optional!

## Troubleshooting

### Backend won't start

**Error: "Can't reach database server"**
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running (if local)
- Verify credentials are correct

**Error: "Prisma Client not generated"**
```bash
cd backend
npm run prisma:generate
```

### Frontend won't start

**Error: Module not found**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error: Can't connect to backend**
- Ensure backend is running on port 3001
- Check `VITE_API_URL` in `frontend/.env`

### Database migrations fail

**Start fresh**:
```bash
cd backend
rm -rf prisma/migrations
npm run prisma:migrate
```

## Development Workflow

### Backend Development

```bash
cd backend

# Run dev server (auto-reload)
npm run dev

# View database
npm run prisma:studio

# Create new migration
npm run prisma:migrate
```

### Frontend Development

```bash
cd frontend

# Run dev server (auto-reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
AI-Learning-Platform/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── config/                # Database, env config
│   │   ├── controllers/           # Request handlers
│   │   ├── middleware/            # Auth middleware
│   │   ├── routes/                # API routes
│   │   ├── services/              # AI service (Claude)
│   │   ├── types/                 # TypeScript types
│   │   └── utils/                 # Helper functions
│   └── .env                       # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   ├── TutorLayout.tsx    # Two-panel layout
│   │   │   ├── AITutorVisual.tsx  # Animated AI tutor
│   │   │   └── VoiceControls.tsx  # Voice controls
│   │   ├── pages/                 # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Onboarding.tsx
│   │   │   ├── AIIntroNew.tsx     # AI tutor intro flow
│   │   │   └── Dashboard.tsx
│   │   ├── services/              # API client
│   │   ├── stores/                # State management
│   │   └── types/                 # TypeScript types
│   └── .env                       # Environment variables
│
└── README.md                      # Documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### User Profile
- `POST /api/profile` - Create/update profile
- `GET /api/profile` - Get profile

### Curriculum
- `POST /api/curriculum/generate` - Generate curriculum
- `GET /api/curriculum` - Get curriculum
- `GET /api/curriculum/intro` - Get tutor introduction

## Next Steps

Now that your app is running, here's what to build next:

1. **11 Labs Integration** - High-quality voice synthesis
2. **Lesson 1 Implementation** - French greetings & introductions
3. **Knowledge Base Tracking** - Track what users learn
4. **Progress Dashboard** - Show user progress
5. **Voice Recognition** - User can speak responses

## Need Help?

- Check the main [README.md](./README.md) for more details
- Review [MVP-Development-Plan.md](./MVP-Development-Plan.md) for full specifications
- Check backend logs for API errors
- Use browser DevTools Console for frontend errors

---

**Happy Learning! 🎓**
