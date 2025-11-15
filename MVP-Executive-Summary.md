# AI Language Learning Platform - Executive Summary

## What We're Building

A web-based AI tutoring platform where users learn French through voice-enabled conversations with a personalized AI tutor. The interface features a two-panel design: left panel shows an animated AI tutor with voice interaction, right panel displays learning materials and exercises.

---

## MVP Target Experience (15-20 minutes)

1. **User arrives** → Quick signup (no password complexity, just email + password)
2. **Onboarding** (2 min) → 5 simple questions about goals, level, schedule, personality preference
3. **"Wow" moment** → AI tutor immediately introduces itself with voice, asks follow-up question
4. **Curriculum reveal** → AI presents personalized learning plan visually
5. **First lesson** (15 min) → Engaging, practical introduction lesson in French
6. **Progress saved** → Everything tracked to user's knowledge base
7. **User wants more** → Excited to continue to lesson 2

---

## Technical Stack

**Frontend:**
- React + TypeScript
- Tailwind CSS
- Web Speech API (browser voice recognition)

**Backend:**
- Node.js/Express or Python/FastAPI
- PostgreSQL database
- JWT authentication

**AI & Voice:**
- Claude API (Anthropic) - Core tutor intelligence
- 11 Labs API - High-quality text-to-speech ⚠️ *[Requires research - see placeholder in main plan]*
- Web Speech API - User voice input (free, built-in)
- *Fallback:* Browser TTS during development/testing

**Hosting:**
- Frontend: Vercel/Netlify
- Backend: Railway/Render
- Database: Railway PostgreSQL or Supabase

---

## Core Features (MVP Only)

✅ Account system (signup, login, password reset)
✅ 2-minute onboarding flow
✅ Voice-enabled AI tutor
✅ Personalized curriculum generation
✅ First lesson (15 min, French greetings & introductions)
✅ Knowledge base tracking (what user has learned)
✅ Progress dashboard
✅ Two-panel UI (tutor visual + content display)

❌ Video avatar (animated circle instead)
❌ Multiple languages (French only)
❌ Payment system
❌ Mobile apps
❌ Homework system beyond first lesson
❌ Social/community features

---

## Database Schema (6 Core Tables)

1. **users** - Authentication & account info
2. **user_profiles** - Learning goals, preferences, tutor personality
3. **curriculum** - Generated learning plan for each user
4. **lessons** - Individual lesson content
5. **user_knowledge** - Everything user has learned (vocabulary, grammar, skills)
6. **lesson_sessions** - Track completion, performance, transcripts

---

## User Journey

```
Landing Page
    ↓
Sign Up (email + password)
    ↓
Onboarding (5 questions, 2 min)
    ↓
AI Tutor Introduction (voice greeting, 30 sec)
    ↓
Follow-up Question (personalization, 30 sec)
    ↓
Curriculum Generation (loading, 15 sec)
    ↓
Curriculum Presentation (visual plan, 1 min)
    ↓
First Lesson Begins (15 min, interactive)
    ↓
Lesson Summary (what you learned, 1 min)
    ↓
Dashboard (progress tracking, next lesson)
```

---

## First Lesson Structure (15 minutes)

**Lesson 1: Greetings & Self-Introduction**

1. **Opening** (1 min) - AI explains what we'll learn
2. **Listening & Modeling** (3 min) - AI demonstrates, breaks down phrases
3. **Personalization** (3 min) - User practices with their own name/location
4. **Conversational Practice** (5 min) - 3 scenarios (café, office, party)
5. **Mini-Quiz** (2 min) - Quick comprehension check
6. **Real-World Challenge** (2 min) - User initiates conversation
7. **Wrap-Up** (1 min) - Summary of what was learned

**User Outcome:** Can introduce themselves in French confidently

---

## Key Differentiators vs Competition

**vs Duolingo:**
- True conversational AI tutor (not multiple choice exercises)
- Personalized curriculum (not one-size-fits-all)
- Voice interaction (practice speaking)
- Adaptive to individual goals

**vs Preply/iTalki:**
- 24/7 availability (no scheduling)
- 10x cheaper (AI vs $40-60/hour human)
- Comprehensive progress tracking
- Consistent quality

**vs Babbel:**
- AI-generated personalized lessons (not pre-recorded)
- Real-time conversation practice
- Adapts to user's pace and style
- More engaging and interactive

---

## Cost Structure (Estimates)

**Per User Per Lesson:**
- Claude API: $0.01-0.05
- 11 Labs voice: $0.10-0.30
- Infrastructure: $0.05-0.10
- **Total: ~$0.20-0.50 per completed lesson**

**Target for MVP:**
- Support 50-100 demo users
- Total AI costs: $500-1,000
- Infrastructure: $100-200/month

---

## Success Metrics

**Must-Have for Launch:**
1. ✅ 70%+ complete first lesson
2. ✅ 50%+ return for lesson 2
3. ✅ < 2s average page load time
4. ✅ Voice works 80%+ of the time
5. ✅ User rating 4+ / 5

**Nice-to-Have:**
1. 80%+ onboarding completion
2. 30+ min average session duration
3. Users share on social media
4. Positive word-of-mouth

---

## Development Timeline

**Week 1-2:** Foundation (auth, database, basic UI)
**Week 3-4:** Core features (onboarding, AI integration)
**Week 5-6:** Voice & AI tutor (11 Labs, conversation flow)
**Week 7-8:** First lesson (content, exercises, tracking)
**Week 9-10:** Testing & polish (bugs, UX, performance)
**Week 11-12:** Launch (deployment, monitoring, docs)

**Total: 12 weeks to MVP**

---

## Risks & Mitigation

**Risk: AI costs too high**
→ Set strict rate limits, use smaller models where possible

**Risk: Voice recognition doesn't work**
→ Always offer text input as backup

**Risk: Users drop off after onboarding**
→ Make first lesson AMAZING and engaging

**Risk: Lesson quality isn't good enough**
→ Hand-craft first 3 lessons, iterate on prompts

---

## Next Steps

1. ✅ Finalize MVP scope (DONE)
2. ✅ Create detailed development plan (DONE)
3. ⏳ Research 11 Labs API implementation (1-2 days)
4. ⏳ Build AI Tutor system prompt (NEXT)
5. ⏳ Set up development environment
6. ⏳ Begin Week 1-2 development (foundation)

---

## Contact & Resources

**Documentation:**
- Full MVP Plan: `MVP-Development-Plan.md`
- Product Spec: `AI-Language-Learning-Platform-Spec.docx`
- Market Research: `AI_Learning_Platforms_Reach_Inflection_Point.md`

**APIs to Set Up:**
- Anthropic Claude API: https://console.anthropic.com
- 11 Labs API: https://elevenlabs.io
- GitHub repo (to be created)

---

**Last Updated:** [Current Date]
**Status:** Ready for Development
**Target Launch:** 12 weeks from start
