# AI Language Learning Platform - MVP Development Plan

## Executive Summary

An AI-powered language tutoring platform that provides personalized, voice-enabled instruction through a two-panel web interface. The left panel features an animated AI tutor with voice interaction, while the right panel displays visual learning materials, exercises, and curriculum. The MVP focuses on French language instruction with a 15-20 minute demo experience.

---

## 1. MVP Scope Summary

### What We're Building
A web application where users can:
- Create an account and log in
- Complete a 2-minute onboarding to customize their learning experience
- Interact with a voice-enabled AI tutor that introduces itself and proposes a curriculum
- Complete an engaging 15-minute first lesson
- Have all progress automatically tracked in their personal knowledge base

### What We're NOT Building (v1)
- Video avatar (using animated speaking indicator instead)
- Multiple languages (French only)
- Payment/subscription system
- Mobile applications
- Advanced homework tracking beyond first lesson
- Community features or social elements

### Success Criteria
A user can complete the entire flow in 15-20 minutes and feel they:
1. Had a "wow" moment within first 2 minutes
2. Connected with a personalized AI tutor
3. Learned something practical and interesting
4. Want to continue to lesson 2

---

## 2. Technical Architecture

### Frontend Stack
- **Framework:** React (with TypeScript recommended)
- **Styling:** Tailwind CSS for responsive design
- **State Management:** React Context or Zustand for global state
- **Routing:** React Router for navigation
- **Voice Output:** 11 Labs API for text-to-speech
- **Voice Input:** Web Speech API (browser native) for speech recognition
- **HTTP Client:** Axios or Fetch for API calls
- **Form Validation:** React Hook Form + Zod

### Backend Stack
- **Framework:** Node.js with Express OR Python with FastAPI
- **Database:** PostgreSQL for user data and progress tracking
- **ORM:** Prisma (Node.js) or SQLAlchemy (Python)
- **Authentication:** JWT tokens with bcrypt password hashing
- **AI Integration:** Anthropic Claude API
- **File Storage:** JSON storage for curriculum and lesson content initially
- **Environment Management:** dotenv for configuration

### External Services
- **11 Labs API:** Voice synthesis for AI tutor
- **Claude API:** Core AI tutoring intelligence
- **Email Service:** SendGrid or similar for password reset (optional for MVP)

### Hosting & Infrastructure
- **Frontend:** Vercel or Netlify
- **Backend:** Railway, Render, or AWS
- **Database:** Railway PostgreSQL or Supabase
- **Domain:** Custom domain for demo

---

## 3. Database Schema

### Users Table
```
users
- id: UUID (primary key)
- email: STRING (unique, indexed)
- password_hash: STRING
- created_at: TIMESTAMP
- last_login: TIMESTAMP
- onboarding_completed: BOOLEAN
```

### User Profiles Table
```
user_profiles
- id: UUID (primary key)
- user_id: UUID (foreign key to users)
- target_language: STRING (default: "french")
- current_level: STRING (beginner, A1, A2, B1, B2, C1, C2)
- learning_goal: STRING (business_trip, tourism, conversation, academic, fluency)
- timeline_weeks: INTEGER
- study_frequency: STRING (daily, 3x_week, 2x_week, weekly)
- session_duration: INTEGER (minutes)
- includes_homework: BOOLEAN
- tutor_personality: STRING (encouraging, sarcastic, detail_oriented, fun, formal)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Curriculum Table
```
curriculum
- id: UUID (primary key)
- user_id: UUID (foreign key to users)
- total_lessons: INTEGER
- weeks_duration: INTEGER
- lessons_per_week: INTEGER
- curriculum_summary: TEXT (JSON or TEXT describing full plan)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Lessons Table
```
lessons
- id: UUID (primary key)
- curriculum_id: UUID (foreign key to curriculum)
- lesson_number: INTEGER
- title: STRING
- description: TEXT
- objectives: TEXT (JSON array)
- content: TEXT (JSON with lesson structure)
- duration_minutes: INTEGER
- completed: BOOLEAN
- completed_at: TIMESTAMP
- created_at: TIMESTAMP
```

### User Knowledge Base Table
```
user_knowledge
- id: UUID (primary key)
- user_id: UUID (foreign key to users)
- knowledge_type: STRING (vocabulary, grammar, phrase, skill)
- content: TEXT (the actual word/phrase/concept)
- context: TEXT (where/how it was learned)
- confidence_score: DECIMAL (0-1 scale)
- last_reviewed: TIMESTAMP
- times_practiced: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Lesson Sessions Table
```
lesson_sessions
- id: UUID (primary key)
- user_id: UUID (foreign key to users)
- lesson_id: UUID (foreign key to lessons)
- started_at: TIMESTAMP
- completed_at: TIMESTAMP
- duration_minutes: INTEGER
- performance_summary: TEXT (JSON with metrics)
- conversation_transcript: TEXT (full interaction log)
```

### Password Reset Tokens Table (Optional for MVP)
```
password_reset_tokens
- id: UUID (primary key)
- user_id: UUID (foreign key to users)
- token: STRING (unique, indexed)
- expires_at: TIMESTAMP
- used: BOOLEAN
- created_at: TIMESTAMP
```

---

## 4. User Interface Specifications

### Layout Structure

**Two-Panel Split-Screen Design:**

```
┌─────────────────────────────────────────────────────────┐
│                    Header / Nav Bar                      │
├──────────────────────────┬──────────────────────────────┤
│                          │                              │
│    LEFT PANEL (40%)      │    RIGHT PANEL (60%)        │
│                          │                              │
│  - AI Tutor Visual       │  - Content Display          │
│  - Speaking Indicator    │  - Exercises                │
│  - Voice Controls        │  - Text Materials           │
│                          │  - Forms                    │
│                          │                              │
│                          │                              │
│                          │                              │
└──────────────────────────┴──────────────────────────────┘
```

### Left Panel Components

**AI Tutor Visual:**
- Black/dark gradient background
- Centered animated circle (150-200px diameter)
- Circle should pulse/animate when AI is speaking
- Voice wave visualization inside circle (optional enhancement)
- Tutor name display below circle
- Status text: "Listening...", "Speaking...", "Thinking..."

**Voice Controls:**
- Large microphone button (toggle mute/unmute)
- Volume control slider
- "Interrupt" button to stop AI mid-sentence if needed
- Connection status indicator

**Design Details:**
- Modern, minimalist aesthetic
- Smooth animations (CSS transitions)
- Clear visual feedback for all states
- Accessible color contrast

### Right Panel Components

**Dynamic Content Area:**
Content changes based on current flow state:

1. **Onboarding Form:**
   - Clean, single-column form
   - Progressive disclosure (show questions one at a time OR all at once)
   - Large, clear input fields
   - Helpful placeholder text
   - Visual progress indicator

2. **Curriculum Display:**
   - Structured list or timeline view
   - Week-by-week breakdown
   - Lesson topics and objectives
   - Estimated time per lesson
   - Visual "confirm" button

3. **Lesson Content:**
   - Lesson title and objectives at top
   - Scrollable content area
   - Mixed content types:
     - Text explanations
     - Example sentences with translations
     - Interactive exercises (fill-in-blank, multiple choice)
     - Images/visual aids
     - Progress indicator
   - "Complete Lesson" button at bottom

4. **Progress Summary:**
   - What was learned today (bullet points)
   - New vocabulary acquired
   - Grammar concepts covered
   - Next lesson preview
   - Encouragement message

### Responsive Behavior
- Desktop (>1024px): Side-by-side panels
- Tablet (768-1024px): Stacked panels, left on top
- Mobile (< 768px): Single panel view with toggle between tutor and content

---

## 5. Core User Flows

### Flow 1: Account Creation & Authentication

**Sign Up Flow:**
1. User lands on homepage
2. Click "Get Started" or "Sign Up"
3. Form appears:
   - Email address (validated)
   - Password (min 8 chars, show strength meter)
   - Confirm password
   - "Create Account" button
4. System validates:
   - Email not already registered
   - Password meets requirements
   - Passwords match
5. On success:
   - Create user record with hashed password
   - Generate JWT token
   - Redirect to onboarding
6. On error:
   - Show inline validation errors
   - Don't clear form

**Login Flow:**
1. User clicks "Login" from homepage
2. Form appears:
   - Email address
   - Password
   - "Forgot Password?" link
   - "Login" button
3. System validates credentials:
   - Check email exists
   - Verify password hash
4. On success:
   - Generate JWT token
   - Store token in localStorage/cookie
   - Redirect to dashboard or onboarding (if incomplete)
5. On error:
   - Generic error: "Invalid email or password"
   - Don't reveal which field is wrong (security)

**Password Reset Flow (Optional for MVP):**
1. User clicks "Forgot Password?"
2. Form to enter email
3. System sends reset link to email
4. User clicks link, enters new password
5. Password updated, redirect to login

**Session Management:**
- JWT token valid for 7 days
- Automatic token refresh on activity
- Logout clears token
- Protected routes redirect to login if no valid token

---

### Flow 2: Onboarding Experience

**Goal:** Collect essential information in under 2 minutes while building excitement.

**Step 1: Welcome Screen**
- Friendly greeting
- Brief value proposition: "Your personal AI tutor, available 24/7"
- "Let's personalize your learning journey" CTA
- Progress: Step 1 of 5

**Step 2: Language & Level**
- Question: "Which language would you like to learn?"
- Options: [French] (only option for MVP, but design for future expansion)
- Question: "What's your current level?"
- Dropdown: Complete Beginner, A1, A2, B1, B2, C1, C2
- Helpful hover tooltips explaining each level
- "Next" button

**Step 3: Learning Goal**
- Question: "What's your main goal?"
- Radio buttons:
  - 🏢 Business/Work
  - ✈️ Travel/Tourism
  - 💬 Conversational Fluency
  - 📚 Academic Study
  - 🎯 General Fluency
- Optional text field: "Tell us more (optional)"
- "Next" button

**Step 4: Schedule & Timeline**
- Question: "How long do you want to reach your goal?"
- Dropdown: 2 weeks, 1 month, 3 months, 6 months, 1 year
- Question: "How often can you study?"
- Radio buttons:
  - 🔥 Daily (30-60 min sessions)
  - 📅 3x per week
  - 📅 2x per week
  - 🐌 Weekly
- Question: "Will you do homework between sessions?"
- Toggle: Yes / No
- "Next" button

**Step 5: Tutor Personality**
- Question: "Choose your AI tutor's personality:"
- Card selection (visual cards with icons):
  - 😊 Encouraging & Supportive
  - 😄 Fun & Playful
  - 🎯 Direct & Efficient
  - 🤓 Detail-Oriented & Thorough
  - 😏 Sarcastic & Humorous
  - 🎓 Formal & Academic
- Note: "You can change this anytime"
- "Complete Setup" button

**On Submit:**
- Show loading state: "Creating your personalized curriculum..."
- Save user profile to database
- Trigger AI curriculum generation
- Transition to AI tutor introduction

**Design Principles:**
- One clear action per screen
- Visual progress indicator
- No more than 3 questions per screen
- Large, thumb-friendly tap targets
- Instant validation feedback
- Ability to go back and change answers

---

### Flow 3: AI Tutor Introduction & Curriculum Presentation

**This is the "WOW" moment - must happen within 2 minutes of onboarding completion.**

**Phase 1: Tutor Greets User (30-45 seconds)**

*Left Panel:*
- AI tutor circle appears with entrance animation
- Tutor name displays: "Amélie" (or user-selected name)
- Circle pulses as voice speaks

*Right Panel:*
- Clean slate with subtle animation
- Text appears in sync with speech (optional, for accessibility)

*AI Tutor Says (via 11 Labs voice):*
"Bonjour! Hello! I'm Amélie, and I'm thrilled to be your French tutor. I can see you're [learning goal recap] and want to [level goal] in [timeline]. That's fantastic! I've been thinking about the best way to help you achieve this..."

**Phase 2: Quick Clarification (30 seconds)**

*AI Tutor Asks Follow-up:*
"Before I create your perfect curriculum, I have just one quick question: [personalized question based on their profile]"

Examples:
- "For your business trip, will you need formal business French or more casual conversation?"
- "Are there specific situations you want to focus on, like ordering food or asking for directions?"

*Right Panel:*
- Display question in text
- Show 2-3 quick response buttons OR
- Voice response option (user speaks answer)

*User Responds:*
- Either clicks button or speaks
- AI acknowledges: "Perfect! That helps me a lot."

**Phase 3: Curriculum Generation (15-20 seconds)**

*Left Panel:*
- AI circle shows "thinking" animation (rotating, pulsing differently)
- Status text: "Creating your curriculum..."

*Right Panel:*
- Loading animation
- Engaging progress text:
  - "Analyzing your goals..."
  - "Designing lesson sequence..."
  - "Personalizing content..."

*Behind the scenes:*
- API call to Claude to generate curriculum outline
- Structure returned as JSON
- Saved to database

**Phase 4: Curriculum Presentation (60-90 seconds)**

*AI Tutor Says:*
"Okay! I've created a [X]-week program designed specifically for you. Here's how we'll work together..."

*Right Panel:*
Displays visual curriculum:

```
Week 1: Foundations & Essentials
├─ Lesson 1: Greetings & Introduction (Today!) - 30 min
├─ Lesson 2: Numbers & Basic Questions - 30 min
└─ Lesson 3: Ordering Food & Drinks - 45 min

Week 2: Building Conversations
├─ Lesson 4: Directions & Transportation - 30 min
├─ Lesson 5: Shopping & Bargaining - 45 min
└─ Lesson 6: Review & Practice - 30 min

[... continues for full timeline]

Total: X lessons over X weeks
Estimated total time: X hours
```

*AI Tutor Explains:*
"Each week builds on the last. We'll focus on [practical situations based on goal]. You'll learn through conversation, not just memorization. And don't worry - I'll adjust as we go based on what you find easy or challenging."

**Phase 5: User Confirmation (15 seconds)**

*AI Tutor Asks:*
"How does this look? Ready to start your first lesson right now?"

*Right Panel:*
- Large green button: "Let's Start!"
- Small link: "I'd like to adjust something"

*If user clicks "Let's Start":*
- Save curriculum approval
- Transition to Lesson 1

*If user wants adjustments:*
- Show quick form to modify (fewer lessons per week, different pacing, etc.)
- AI acknowledges changes and updates curriculum

---

### Flow 4: First Lesson Experience

**Goal:** User completes first lesson feeling they learned something practical and fun in 15 minutes.

**Lesson 1 Structure: "Greetings & Self-Introduction"**

This lesson should be conversational, practical, and give immediate usable skills.

---

**Lesson Opening (1 minute)**

*AI Tutor:*
"Alright! Let's dive into your first lesson. Today we're going to learn how to introduce yourself in French - the absolute essential skill. By the end of this lesson, you'll be able to confidently say who you are, where you're from, and ask someone the same. Ready? Let's go!"

*Right Panel:*
- Lesson title: "Lesson 1: Greetings & Self-Introduction"
- Learning objectives appear:
  ✓ Say hello and goodbye appropriately
  ✓ Introduce yourself with name and origin
  ✓ Ask someone their name
  ✓ Understand basic greetings

---

**Section 1: Listening & Modeling (3 minutes)**

*AI Tutor:*
"First, let me show you how a typical French greeting goes. Listen carefully..."

*AI speaks in French (slower, clear pronunciation):*
"Bonjour! Je m'appelle Amélie. Je suis de Paris. Et vous?"

*AI explains in English:*
"That means: Hello! My name is Amélie. I'm from Paris. And you?"

*Right Panel shows:*
```
French: Bonjour! Je m'appelle Amélie. Je suis de Paris. Et vous?
Pronunciation: bon-ZHOOR! zhuh mah-PELL ah-may-LEE. zhuh swee duh pah-REE. ay voo?
English: Hello! My name is Amélie. I'm from Paris. And you?
```

*AI continues:*
"Let's break this down..."

*Right Panel shows each phrase separately with pronunciation:*

1. **Bonjour** (bon-ZHOOR) - Hello
2. **Je m'appelle...** (zhuh mah-PELL) - My name is...
3. **Je suis de...** (zhuh swee duh) - I'm from...
4. **Et vous?** (ay voo) - And you? (formal)

*AI:*
"Now, let's practice each piece together. Repeat after me..."

*AI says each phrase, pausing for user repetition:*
- "Bonjour" [pause for user]
- "Je m'appelle..." [pause]
- "Je suis de..." [pause]
- "Et vous?" [pause]

*Voice recognition captures user attempts, gives feedback:*
- "Great pronunciation!"
- "Try to emphasize the 'ZHOOR' sound more"
- "Perfect! You've got it!"

---

**Section 2: Personalization (3 minutes)**

*AI Tutor:*
"Excellent! Now let's make this about YOU. What's your name?"

*User responds (voice):*
User: "My name is [Name]"

*AI:*
"Perfect! In French, you would say: Je m'appelle [Name]. Try saying that."

*Right Panel shows:*
```
Je m'appelle [User's Name]
(zhuh mah-PELL [Name])
```

*User practices pronunciation*

*AI:*
"Great! Now, where are you from?"

*User responds:*
User: "I'm from [City/Country]"

*AI:*
"Wonderful! In French: Je suis de [Location]. Let's practice..."

*Right Panel shows:*
```
Je suis de [User's Location]
(zhuh swee duh [Location])
```

*User practices*

*AI:*
"Excellent! Now let's put it all together. I want you to introduce yourself to me in French. Ready? Start with Bonjour..."

*User attempts full introduction:*
User: "Bonjour, je m'appelle [Name]. Je suis de [Location]."

*AI provides enthusiastic feedback:*
"That was AMAZING! You just introduced yourself in French! Do you realize that? On your first lesson! Let's practice this a few more times so it really sticks..."

---

**Section 3: Conversational Practice (5 minutes)**

*AI Tutor:*
"Now I'm going to act as different people you might meet. You're going to introduce yourself to each of them. Pay attention to how they respond - you'll start recognizing patterns!"

*Scenario 1: Meeting someone at a café*

*Right Panel shows:*
```
Scenario: You're sitting at a Parisian café. Someone sits next to you.

[Café background image appears]
```

*AI (as different character, slightly different voice):*
"Bonjour! Je m'appelle Marc. Et vous?"

*User responds:*
User: "Bonjour! Je m'appelle [Name]. Je suis de [Location]."

*AI (as Marc):*
"Enchanté! Nice to meet you!" [teaches new phrase]

*Right Panel shows:*
```
New phrase learned:
Enchanté (on-shon-TAY) - Nice to meet you / Pleased to meet you
```

*Scenario 2: Meeting a colleague*

*AI (formal, business context):*
"Bonjour, je suis Sophie, la directrice. Vous êtes...?"

*Right Panel shows:*
```
Scenario: First day at a French office

New phrases:
- la directrice = the director (female)
- Vous êtes...? = You are...? (formal "who are you?")
```

*User responds with introduction*

*Scenario 3: Making a new friend*

*AI (casual, friendly):*
"Salut! Moi c'est Thomas. Et toi?"

*Right Panel shows:*
```
Scenario: Meeting someone your age at a party

New phrases:
- Salut! = Hi! (casual)
- Moi c'est... = I'm... (casual form)
- Et toi? = And you? (informal)

Note: French has formal (vous) and informal (tu) - use "tu" with friends!
```

*After each scenario, AI gives specific feedback:*
"I noticed you're getting more confident! Your pronunciation of 'Je m'appelle' is really improving!"

---

**Section 4: Mini-Quiz (2 minutes)**

*AI:*
"Let's do a quick check to see what stuck. I'll show you some situations - you tell me what you'd say!"

*Right Panel shows multiple choice or fill-in-blank:*

```
Question 1: You meet your French teacher for the first time. What do you say?

A) Salut! Moi c'est [Name].
B) Bonjour! Je m'appelle [Name].
C) Hello! My name is [Name].

[User selects B]
```

*AI:*
"Correct! You use 'Bonjour' and 'Je m'appelle' in formal situations!"

*Continue with 2-3 more quick questions covering material from lesson*

---

**Section 5: Real-World Challenge (2 minutes)**

*AI:*
"Alright, final challenge! I'm going to introduce myself in French, and I want you to respond naturally - introduce yourself AND ask me where I'm from. You can do this!"

*AI speaks in French:*
"Bonjour! Je m'appelle Amélie."

*User should respond:*
"Bonjour! Je m'appelle [Name]. Je suis de [Location]. Et vous, vous êtes de où?"

*If user struggles:*

*Right Panel shows hints:*
```
Hints:
- Start with your introduction
- Then ask: "Et vous?" (And you?)
- Or: "Vous êtes de où?" (Where are you from?)
```

*When user completes successfully:*

*AI (genuinely excited):*
"WOW! Did you hear yourself? You just had a real French conversation! You asked me a question, I understood you, and we communicated! That's incredible for day one!"

---

**Lesson Wrap-Up (1 minute)**

*AI:*
"You did such a great job today! Let me show you everything you learned..."

*Right Panel displays lesson summary:*

```
🎉 Lesson 1 Complete! 🎉

What You Learned Today:

Vocabulary (7 words/phrases):
✓ Bonjour - Hello
✓ Salut - Hi (casual)
✓ Je m'appelle - My name is
✓ Je suis de - I'm from
✓ Et vous? - And you? (formal)
✓ Et toi? - And you? (informal)
✓ Enchanté - Nice to meet you

Skills Practiced:
✓ Introducing yourself
✓ Asking someone's name
✓ Understanding formal vs informal
✓ Pronunciation of French 'J' and 'R' sounds

Time Spent: 15 minutes
Confidence Level: [visual meter showing progress]

Your Next Lesson:
Lesson 2: Numbers & Asking Questions
Recommended: Tomorrow or [next scheduled time]
```

*AI:*
"I'm really proud of you! You can already introduce yourself in French. Next time, we'll learn numbers and how to ask questions. You're going to be having full conversations before you know it! See you next time - Au revoir!"

*Right Panel shows:*
- Big green button: "Continue to Lesson 2"
- Button: "Review This Lesson"
- Button: "Back to Dashboard"

---

**Behind the Scenes (Technical):**

During this lesson, the system should:
1. Track every phrase the user practiced
2. Log pronunciation attempts and accuracy
3. Note which concepts needed repetition
4. Save quiz results
5. Update user knowledge base with:
   - 7 new vocabulary items (confidence score: 0.6)
   - 3 grammar concepts (greetings, introductions, formal/informal)
   - Speaking skill: basic introduction (confidence: 0.7)
6. Calculate engagement metrics (time spent, completion, attempts)
7. Save conversation transcript for review

This data informs lesson 2 generation.

---

**Key Success Factors for Lesson 1:**

✅ **Practical immediately:** User can introduce themselves after 15 min
✅ **Fun:** Varied scenarios, interactive, conversational
✅ **Not overwhelming:** Just 7 words, focused scope
✅ **Confidence building:** Lots of positive reinforcement
✅ **Real conversation:** Not just parroting, but actual dialogue
✅ **Cultural note:** Learned formal vs informal (practical tip)
✅ **Progress visible:** Clear summary of what was learned

---

### Flow 5: Post-Lesson & Progress Tracking

**Immediately After Lesson:**

*System Actions:*
1. Save lesson completion to database
2. Update user knowledge base with learned items
3. Generate performance metrics
4. Update curriculum progress (1/X lessons complete)
5. Trigger lesson summary generation

**Dashboard View:**

When user returns to platform, they see:

```
Dashboard Layout:

┌────────────────────────────────────────────────────┐
│  Welcome back, [Name]!                              │
│  🔥 3 day streak | 📈 15 minutes studied           │
└────────────────────────────────────────────────────┘

┌──────────────────────────┬─────────────────────────┐
│  Your Progress           │  Quick Stats            │
│  ═══════════════         │                         │
│  [█████░░░░░░] 8%        │  📚 7 words learned     │
│  Lesson 1 of 12 complete │  🎯 A2 Goal            │
│                          │  ⏱️ 3 months to go     │
│  Next Lesson:            │  ✅ 1 lesson complete  │
│  Lesson 2: Numbers       │                         │
│  [Start Lesson] button   │                         │
└──────────────────────────┴─────────────────────────┘

┌────────────────────────────────────────────────────┐
│  Recent Activity                                    │
│                                                     │
│  ✓ Lesson 1: Greetings - Completed 2 hours ago    │
│    Score: 90% | Time: 15 min                       │
│                                                     │
│  📝 Knowledge Base: 7 items added                  │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  Your Knowledge Base                                │
│                                                     │
│  Search: [_______] 🔍                              │
│                                                     │
│  Vocabulary (7)    Grammar (3)    Phrases (2)      │
│  ───────────────────────────────────────────────   │
│  • Bonjour ⭐⭐⭐                                   │
│  • Je m'appelle ⭐⭐                                │
│  • Je suis de ⭐⭐⭐                                │
│  [View All]                                         │
└────────────────────────────────────────────────────┘
```

**Knowledge Base Detail View:**

User can click any learned item:

```
Bonjour
═══════

Translation: Hello
Pronunciation: bon-ZHOOR
Type: Greeting
Confidence: ⭐⭐⭐ (High)

Learned in: Lesson 1 - Greetings
Times practiced: 5
Last reviewed: 2 hours ago

Example usage:
"Bonjour! Comment allez-vous?"
(Hello! How are you?)

[Practice This] [Mark as Mastered]
```

---

## 6. AI Tutor System Prompt Architecture

*Note: Full prompt will be developed later, but here's the architectural approach.*

### Prompt Structure

The AI tutor will use a multi-part system prompt:

**Part 1: Role & Personality**
- Define tutor identity (name, personality based on user selection)
- Teaching philosophy (conversational, encouraging, practical)
- Communication style guidelines

**Part 2: Pedagogical Knowledge**
- Language teaching methodologies
- CEFR framework understanding
- Progression principles
- Error correction strategies
- Feedback delivery

**Part 3: User Context (Dynamic)**
- User profile data (goal, level, timeline, preferences)
- User knowledge base (what they've learned)
- Current lesson plan
- Previous session notes

**Part 4: Current Task**
- Specific instruction for current interaction
- Expected format of response
- Constraints (time, complexity)

**Part 5: Output Format**
- JSON structure for API responses
- Text for voice synthesis
- Content for right panel display

### Prompt Components to Develop:

1. **French Teaching Expertise Prompt**
   - Grammar instruction strategies
   - Vocabulary teaching approaches
   - Pronunciation coaching
   - Cultural context integration

2. **Curriculum Generation Prompt**
   - Takes user profile
   - Generates week-by-week breakdown
   - Ensures logical progression
   - Balances skills (speaking, listening, reading, writing)

3. **Lesson Delivery Prompt**
   - Structures lesson content
   - Generates exercises
   - Provides real-time feedback
   - Adapts to user performance

4. **Assessment Prompt**
   - Evaluates user responses
   - Scores pronunciation/grammar/vocabulary
   - Generates constructive feedback
   - Updates knowledge base

---

## 7. API Integrations

### Claude API Integration

**Purpose:** Core AI tutor intelligence

**Endpoints Needed:**

1. **Curriculum Generation**
   - Input: User profile JSON
   - Output: Structured curriculum (JSON)
   - Model: Claude Sonnet 4 or better
   - Max tokens: 4000

2. **Lesson Content Generation**
   - Input: Lesson number, user knowledge base, curriculum context
   - Output: Lesson structure with dialogue, exercises, examples
   - Model: Claude Sonnet 4
   - Max tokens: 6000

3. **Real-Time Tutoring**
   - Input: User message/response, conversation history, current lesson context
   - Output: AI tutor response (text for voice + visual content)
   - Model: Claude Sonnet 4 (or Haiku for speed if needed)
   - Max tokens: 1500
   - Streaming: Enabled for natural conversation flow

4. **Progress Assessment**
   - Input: Lesson transcript, user responses
   - Output: Performance analysis, knowledge base updates
   - Model: Claude Sonnet 4
   - Max tokens: 2000

**Error Handling:**
- Retry logic with exponential backoff
- Fallback to cached responses if API unavailable
- User-facing error: "I'm having trouble thinking right now, let me try again..."

**Rate Limiting:**
- Implement request queuing
- Monitor usage costs
- Set per-user rate limits to prevent abuse

---

### 11 Labs API Integration

**Purpose:** High-quality text-to-speech for AI tutor voice

---

**⚠️ IMPLEMENTATION PLACEHOLDER - REQUIRES RESEARCH**

This section requires detailed research into 11 Labs API implementation. The following outlines what we need to achieve and questions to answer during research phase.

---

**What We Need:**
- High-quality, natural-sounding text-to-speech
- Support for both French and English (bilingual)
- Low latency for real-time conversation feel
- Ability to convey appropriate emotion/tone
- Cost-effective for MVP scale (50-100 users)

**Key Questions to Research:**

1. **API Basics:**
   - How do we authenticate with 11 Labs?
   - What are the rate limits for free/paid tiers?
   - What's the pricing model? (per character, per request, per minute of audio?)
   - Do they have a sandbox/test environment?

2. **Voice Selection:**
   - Which voices are available that can speak both French and English naturally?
   - Can we preview voices before implementation?
   - Can we customize voice characteristics (pitch, speed, emotion)?
   - Should we use different voices for different tutor personalities?

3. **Integration Architecture:**
   - REST API vs. SDK vs. WebSocket?
   - Do they provide official JavaScript/Node.js SDKs?
   - Should we call API from frontend or backend?
   - How do we handle authentication securely?

4. **Audio Delivery:**
   - Do they support streaming audio (for faster playback start)?
   - What audio formats are supported? (MP3, WAV, WebM?)
   - Can we get audio chunks as they're generated?
   - How do we handle audio playback in the browser?

5. **Performance & Caching:**
   - What's the typical latency from request to first audio byte?
   - Can we cache frequently used phrases?
   - Should we pre-generate audio for fixed lesson content?
   - How do we handle queue management if multiple requests?

6. **Error Handling:**
   - What errors can occur? (rate limit, invalid voice, network failure)
   - How do we detect when 11 Labs is unavailable?
   - What's our fallback strategy? (browser TTS? cached audio? text only?)
   - How do we gracefully degrade the experience?

7. **Cost Management:**
   - How much will each lesson cost in API calls?
   - Are there ways to optimize to reduce costs?
   - Can we set spending limits or alerts?
   - What's included in free tier vs. paid?

**Implementation Checklist (To Be Completed After Research):**

- [ ] Sign up for 11 Labs account
- [ ] Get API key and test in sandbox
- [ ] Test voice quality for bilingual French/English
- [ ] Determine optimal voice settings (stability, similarity, style)
- [ ] Decide on frontend vs. backend API calls
- [ ] Implement authentication (secure API key storage)
- [ ] Build audio streaming/playback component
- [ ] Implement caching strategy for common phrases
- [ ] Create fallback mechanism (Web Speech API)
- [ ] Test latency and user experience
- [ ] Implement error handling
- [ ] Set up cost monitoring
- [ ] Document implementation details

**Temporary Fallback During Development:**

Until 11 Labs is fully integrated, use browser's built-in Web Speech API for text-to-speech:

```javascript
const speak = (text, lang = 'en-US') => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9; // Slightly slower for clarity
  window.speechSynthesis.speak(utterance);
};
```

This allows development to proceed on other features while 11 Labs integration is researched and implemented.

**Dependencies:**

Other parts of the system that depend on this component:
- AI tutor voice output (core feature)
- Lesson delivery flow (timing, synchronization)
- Right panel text display (should sync with audio)
- Error handling system (needs fallback path)
- Cost tracking (need to know pricing)

**Priority:** HIGH - Core feature, but can start with browser TTS fallback

**Estimated Research Time:** 1-2 days
**Estimated Implementation Time:** 2-3 days (after research complete)

---

**[TO BE FILLED IN AFTER RESEARCH]**

Once research is complete, this section should include:
- Exact API endpoints and request/response formats
- Code examples for integration
- Voice IDs and settings to use
- Caching strategy details
- Error handling code
- Cost per lesson calculations
- Performance benchmarks

---

### Web Speech API (Browser Native)

**Purpose:** User voice input (speech recognition)

**Implementation:**
```javascript
const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.lang = 'fr-FR'; // Set to French for lessons
recognition.continuous = false; // Stop after user finishes speaking
recognition.interimResults = false; // Only final results

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  // Send to backend for evaluation
};
```

**Language Support:**
- French: 'fr-FR'
- English: 'en-US'
- Switch based on context (lesson language vs UI language)

**Challenges:**
- Accuracy varies by accent
- Requires HTTPS
- Not supported in all browsers (Firefox needs polyfill)

**Fallback:**
- Always offer text input option
- "I prefer typing" button

---

## 8. Security & Authentication

### JWT Token Authentication

**Token Generation:**
- On successful login/signup
- Payload: { userId, email, createdAt }
- Secret key stored in environment variable
- Expiration: 7 days

**Token Storage:**
- Frontend: localStorage (or httpOnly cookie for added security)
- Sent in Authorization header: `Bearer {token}`

**Protected Routes:**
- All routes except: /, /login, /signup, /reset-password
- Backend middleware checks token on every request
- Frontend redirects to login if token invalid/expired

### Password Security

**Hashing:**
- Use bcrypt with salt rounds: 10-12
- Never store plain text passwords
- Hash comparison on login

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- No common passwords (check against list)

**Password Reset:**
1. User requests reset
2. Generate unique token (UUID)
3. Store token with expiration (1 hour)
4. Send email with reset link
5. Verify token, allow new password entry
6. Invalidate token after use

### Data Privacy

**User Data:**
- Encrypt sensitive data at rest
- Use HTTPS for all API calls
- Comply with GDPR (right to deletion, data export)

**Conversation Logs:**
- Store for lesson improvement
- Allow user to view/download
- Delete on account deletion

---

## 9. Error Handling & Edge Cases

### Voice/Audio Errors

**Scenario: 11 Labs API fails**
- Fallback to Web Speech API synthesis (lower quality)
- Display: "Using backup voice"
- Text remains visible

**Scenario: User microphone not working**
- Detect permission denial
- Show clear modal: "We need microphone access..."
- Offer text input alternative

**Scenario: Background noise/poor audio**
- Multiple recognition attempts
- "I didn't catch that, could you try again?"
- Visual hint: "Make sure you're in a quiet space"

### AI Response Errors

**Scenario: Claude API timeout**
- Show: "I'm thinking extra hard on this one..."
- Retry once
- If still fails: "Let's try something different. Can you rephrase?"

**Scenario: Inappropriate content generation**
- Content filter on AI responses
- Fallback to safe, generic response
- Log incident for review

**Scenario: User says something off-topic**
- AI gently redirects: "I love your curiosity! But let's focus on today's lesson about [topic]. We can explore that later!"

### Connection Issues

**Scenario: User loses internet mid-lesson**
- Detect connection loss
- Cache lesson progress locally
- On reconnect: "Welcome back! Let's pick up where we left off."
- Sync progress to server

**Scenario: Server error**
- Graceful error message
- Don't lose user progress
- Offer: "Try again" or "Continue later"

### User Behavior Edge Cases

**Scenario: User doesn't respond for 30+ seconds**
- AI prompts: "Are you still there? Take your time!"
- After 1 minute: "Let me know when you're ready to continue."
- Auto-save progress, allow resume later

**Scenario: User makes same mistake repeatedly**
- AI recognizes pattern
- Offers: "I notice you're struggling with [X]. Let me explain it differently..."
- Extra practice exercises on that specific item

**Scenario: User completes lesson too quickly (rushes)**
- Flag for review
- AI: "You're moving fast! Let's make sure this really stuck..."
- Quick review quiz before marking complete

---

## 10. Testing Strategy

### Unit Tests

**Backend:**
- User authentication (signup, login, token validation)
- Password hashing/comparison
- Database CRUD operations
- API endpoint responses

**Frontend:**
- Component rendering
- Form validation
- State management
- Voice API initialization

### Integration Tests

**User Flows:**
1. Complete signup → onboarding → first lesson
2. Login → resume progress → continue learning
3. Voice interaction → response evaluation → knowledge update
4. Lesson completion → progress save → dashboard update

**API Integrations:**
- Claude API: Mock responses, test error handling
- 11 Labs API: Test voice generation, streaming
- Database: Test concurrent users, data consistency

### User Acceptance Testing

**Test Scenarios:**
1. Can a new user complete onboarding in < 2 minutes?
2. Does the AI tutor feel responsive and natural?
3. Is the first lesson engaging and educational?
4. Can users navigate the interface intuitively?
5. Does voice recognition work in typical conditions?

**Test with:**
- 5-10 target users (language learners)
- Different devices (desktop, tablet)
- Different browsers (Chrome, Safari, Firefox)
- Various audio setups (headphones, speakers, AirPods)

### Performance Testing

**Load Testing:**
- Simulate 10-50 concurrent users
- Measure API response times
- Check database query performance
- Monitor voice streaming latency

**Metrics to Track:**
- Time to first interaction (< 3 seconds)
- Lesson load time (< 2 seconds)
- Voice response latency (< 1 second)
- API success rate (> 99%)

---

## 11. Deployment & DevOps

### Environment Setup

**Development:**
- Local database (PostgreSQL)
- Mock external APIs (Claude, 11 Labs)
- Hot reload enabled

**Staging:**
- Mirrors production infrastructure
- Real API keys (test accounts)
- Test data, not real users

**Production:**
- Separate database
- Production API keys
- Monitoring enabled
- Backups automated

### Deployment Pipeline

**Frontend (Vercel):**
1. Push to GitHub main branch
2. Automatic build triggered
3. Preview deployment created
4. Merge → production deployment
5. Rollback available

**Backend (Railway/Render):**
1. Push to GitHub
2. Docker image built
3. Deploy to staging
4. Run migration scripts
5. Deploy to production
6. Health check verification

### Monitoring & Logging

**Application Monitoring:**
- Sentry for error tracking
- LogRocket for session replay
- Custom analytics dashboard

**Infrastructure Monitoring:**
- Server CPU/memory usage
- Database performance
- API response times
- Voice streaming quality

**Alerts:**
- Error rate > 5%
- API latency > 2s
- Database connection failures
- High token usage (cost control)

### Backup Strategy

**Database Backups:**
- Automated daily backups
- Retention: 30 days
- Stored in separate region
- Test restore monthly

**Code Backups:**
- Git repository (GitHub)
- Tagged releases
- Branch protection rules

---

## 12. Success Metrics & KPIs

### User Acquisition
- Signups per day/week
- Conversion rate (landing page → signup)
- Signup completion rate
- Source tracking (where users come from)

### Engagement
- Daily active users (DAU)
- Weekly active users (WAU)
- Onboarding completion rate (target: > 80%)
- First lesson completion rate (target: > 70%)
- Average lessons per user
- Session duration
- Return rate (come back for lesson 2?)

### Learning Outcomes
- Knowledge base growth per user
- Lesson completion rate
- Quiz/exercise accuracy scores
- Self-reported confidence (surveys)
- Goal achievement rate

### Technical Performance
- API response times (< 500ms)
- Voice latency (< 1s)
- Error rate (< 1%)
- Uptime (> 99.5%)

### Business Metrics (Future)
- Cost per lesson (API costs)
- Server costs per user
- Retention rate
- Churn rate
- User feedback (NPS score)

---

## 13. Future Enhancements (Post-MVP)

These features are explicitly OUT OF SCOPE for MVP but documented for future development:

### Phase 2 Features
- Video avatar integration (replacing animated circle)
- Additional languages (Spanish, German, Italian)
- Homework assignments with async review
- Spaced repetition flashcard system
- Progress sharing (social features)
- Mobile apps (iOS/Android native)

### Phase 3 Features
- Live group classes (multiple users + AI tutor)
- Human tutor marketplace integration
- Advanced speech analysis (accent scoring)
- Cultural immersion content (videos, articles)
- Certification prep (DELF, DALF exams)
- Enterprise version (corporate training)

### Phase 4 Features
- AR/VR immersive environments
- Multi-language support (switch languages)
- Community features (forums, study groups)
- AI-generated custom content (based on interests)
- Gamification (badges, leaderboards, challenges)
- White-label version for schools

---

## 14. Development Timeline

### Week 1-2: Foundation
- Set up development environment
- Initialize frontend (React) and backend (Node.js/Python)
- Database schema implementation
- Authentication system (signup, login, JWT)
- Basic UI layout (two-panel structure)

### Week 3-4: Core Features
- Onboarding flow implementation
- User profile management
- AI integration (Claude API)
- Basic lesson structure
- Knowledge base system

### Week 5-6: Voice & AI Tutor
- 11 Labs integration
- Web Speech API integration
- Real-time conversation flow
- AI tutor personality implementation
- Lesson content generation

### Week 7-8: First Lesson
- Lesson 1 complete content creation
- Interactive exercises
- Progress tracking
- Dashboard implementation
- Performance optimization

### Week 9-10: Testing & Polish
- Bug fixes
- User testing
- Performance optimization
- Documentation
- Deployment preparation

### Week 11-12: Launch
- Staging deployment
- Final testing
- Production deployment
- Monitoring setup
- Launch preparation

**Total: 12 weeks to MVP**

---

## 15. Technical Constraints & Considerations

### Browser Compatibility
- Chrome/Edge: Full support (primary target)
- Safari: Test thoroughly (webkit quirks)
- Firefox: Web Speech API may need polyfill
- Mobile browsers: Limited voice support initially

### API Costs
- Claude API: ~$0.01-0.05 per lesson (estimate)
- 11 Labs: ~$0.10-0.30 per lesson (estimate)
- Target: < $0.50 per completed lesson
- Monitor usage closely

### Performance
- Initial load: < 3s
- Lesson content load: < 2s
- Voice response: < 1s
- Database queries: < 100ms

### Scalability
- Start with monolith (easier for MVP)
- Prepare for microservices if needed
- Use caching aggressively (Redis)
- Database connection pooling
- CDN for static assets

### Data Storage
- User data: Relational DB (PostgreSQL)
- Lesson content: Can be JSON files initially
- Conversation logs: Consider separate storage
- Audio files: Don't store, generate on-demand

---

## 16. Risk Mitigation

### Technical Risks

**Risk: AI API costs spiral out of control**
- Mitigation: Set strict rate limits, usage monitoring, token limits per request
- Fallback: Use smaller Claude model (Haiku) for non-critical interactions

**Risk: Voice recognition doesn't work well**
- Mitigation: Always offer text input option
- Fallback: Focus on text-based learning if voice fails

**Risk: Lesson quality isn't good enough**
- Mitigation: Hand-craft first 3 lessons, refine prompts iteratively
- Fallback: Hire language expert to review content

### Business Risks

**Risk: Users drop off after onboarding**
- Mitigation: Optimize first lesson to be amazing
- Measure: Track completion rates closely
- Action: A/B test different lesson approaches

**Risk: Users don't find it better than Duolingo**
- Mitigation: Focus on personalization as key differentiator
- Measure: Survey users on "What do you like best?"
- Action: Double down on unique strengths

**Risk: AI tutor feels robotic**
- Mitigation: Fine-tune personality, use Claude's best models
- Measure: User feedback on "Does this feel natural?"
- Action: Iterate on prompts and voice settings

---

## 17. Success Criteria for MVP

The MVP will be considered successful if:

✅ **Technical Success:**
1. 95%+ uptime
2. < 2s average lesson load time
3. Voice works in 80%+ of attempts
4. No critical bugs

✅ **User Success:**
1. 70%+ complete first lesson
2. 50%+ return for lesson 2
3. Average rating 4+ / 5
4. 60%+ say it's better than alternatives they've tried

✅ **Learning Success:**
1. Users can introduce themselves in French after lesson 1
2. Knowledge base accurately reflects what users learned
3. Users report feeling they made progress
4. Curriculum feels logical and well-paced

✅ **Business Success:**
1. Cost per user < $2 for full demo experience
2. 10+ users complete full demo in testing phase
3. Positive user feedback that validates concept
4. Clear path to monetization identified

---

## Conclusion

This MVP development plan provides a comprehensive roadmap for building an AI-powered language learning platform that combines personalized tutoring with voice-enabled conversation practice. The focus is on creating a delightful first experience that hooks users within the first 2 minutes and leaves them excited to continue learning.

The key success factors are:
1. **Fast "wow" moment** - No tedious tests, immediate value
2. **Natural conversation** - Feels like talking to a real tutor
3. **Personalization** - Every detail tailored to the user's goals
4. **Practical learning** - Users can use what they learn immediately
5. **Technical excellence** - Voice, AI, and UI work seamlessly together

By following this plan, we'll create a platform that stands out in a crowded market by truly delivering on the promise of personalized AI tutoring.
