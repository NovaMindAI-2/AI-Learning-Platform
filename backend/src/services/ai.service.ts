import { config } from '../config/env';

interface UserContext {
  level: string;
  goal: string;
  timelineWeeks: number;
  studyFrequency: string;
  sessionDuration: number;
  includesHomework: boolean;
  personality: string;
}

interface CurriculumResponse {
  totalLessons: number;
  weeksDuration: number;
  lessonsPerWeek: number;
  curriculumSummary: any;
}

/**
 * AI Service for Claude API integration
 */
class AIService {
  private apiKey: string;
  private apiUrl = 'https://api.anthropic.com/v1/messages';

  constructor() {
    this.apiKey = config.claudeApiKey;
  }

  /**
   * Generate personalized curriculum using Claude API
   */
  async generateCurriculum(userContext: UserContext): Promise<CurriculumResponse> {
    // For now, if API key is placeholder, return mock data
    if (this.apiKey.includes('placeholder')) {
      return this.generateMockCurriculum(userContext);
    }

    try {
      const prompt = this.buildCurriculumPrompt(userContext);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0].text;

      // Parse JSON response from Claude
      const curriculumData = JSON.parse(content);

      return {
        totalLessons: curriculumData.totalLessons,
        weeksDuration: curriculumData.weeksDuration,
        lessonsPerWeek: curriculumData.lessonsPerWeek,
        curriculumSummary: curriculumData,
      };
    } catch (error) {
      console.error('Error generating curriculum:', error);
      // Fallback to mock data on error
      return this.generateMockCurriculum(userContext);
    }
  }

  /**
   * Generate AI tutor introduction message
   */
  async generateTutorIntroduction(userContext: UserContext, userName?: string): Promise<string> {
    if (this.apiKey.includes('placeholder')) {
      return this.generateMockIntroduction(userContext, userName);
    }

    try {
      const prompt = this.buildIntroductionPrompt(userContext, userName);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Error generating introduction:', error);
      return this.generateMockIntroduction(userContext, userName);
    }
  }

  /**
   * Build curriculum generation prompt
   */
  private buildCurriculumPrompt(userContext: UserContext): string {
    return `You are an expert French language instructor. Create a personalized curriculum for a student with the following profile:

- Current Level: ${userContext.level}
- Learning Goal: ${userContext.goal}
- Timeline: ${userContext.timelineWeeks} weeks
- Study Frequency: ${userContext.studyFrequency}
- Session Duration: ${userContext.sessionDuration} minutes
- Includes Homework: ${userContext.includesHomework ? 'Yes' : 'No'}

Generate a complete curriculum as a JSON object with this structure:
{
  "totalLessons": <number>,
  "weeksDuration": <number>,
  "lessonsPerWeek": <number>,
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Week theme",
      "lessons": [
        {
          "lessonNumber": 1,
          "title": "Lesson title",
          "objectives": ["objective 1", "objective 2"],
          "duration": 30,
          "topics": ["topic 1", "topic 2"]
        }
      ]
    }
  ],
  "summary": "Brief overview of the curriculum"
}

Make it practical, engaging, and appropriate for their level and goals. Focus on conversational French.

Return ONLY the JSON object, no additional text.`;
  }

  /**
   * Build tutor introduction prompt
   */
  private buildIntroductionPrompt(userContext: UserContext, userName?: string): string {
    const goalMap: Record<string, string> = {
      business_trip: 'preparing for business travel',
      tourism: 'learning French for tourism and travel',
      conversation: 'achieving conversational fluency',
      academic: 'studying French for academic purposes',
      fluency: 'reaching general fluency',
    };

    const goal = goalMap[userContext.goal] || 'learning French';

    return `You are Amélie, a ${userContext.personality} French tutor. Write a warm, brief introduction (2-3 sentences) for a student ${userName ? `named ${userName} ` : ''}who is ${goal} and wants to reach ${userContext.level === 'beginner' ? 'A1' : userContext.level} level in ${userContext.timelineWeeks} weeks.

Make it enthusiastic and personalized. This will be spoken aloud, so keep it conversational.

Return only the introduction text in English, nothing else.`;
  }

  /**
   * Generate mock curriculum (for development without API key)
   */
  private generateMockCurriculum(userContext: UserContext): CurriculumResponse {
    const lessonsPerWeek = this.calculateLessonsPerWeek(userContext.studyFrequency);
    const totalLessons = Math.min(lessonsPerWeek * userContext.timelineWeeks, 50);

    const weeks = [];
    let lessonCounter = 1;

    for (let week = 1; week <= Math.min(userContext.timelineWeeks, 12); week++) {
      const weekThemes = [
        'Foundations & Essentials',
        'Building Conversations',
        'Daily Life & Routines',
        'Food & Dining',
        'Travel & Transportation',
        'Shopping & Services',
        'Work & Business',
        'Social Interactions',
        'Culture & Entertainment',
        'Advanced Conversations',
        'Specialized Topics',
        'Review & Practice',
      ];

      const lessonTitles = [
        ['Greetings & Introduction', 'Numbers & Basic Questions', 'Ordering Food & Drinks'],
        ['Directions & Transportation', 'Shopping & Bargaining', 'Making Appointments'],
        ['Daily Routine', 'Talking About Weather', 'Describing People & Places'],
        ['At the Restaurant', 'Grocery Shopping', 'Cooking Vocabulary'],
        ['At the Airport', 'Hotel Check-in', 'Public Transportation'],
        ['At the Pharmacy', 'Banking Basics', 'Postal Services'],
        ['Job Interviews', 'Office Communication', 'Email Writing'],
        ['Making Friends', 'Party Conversations', 'Phone Calls'],
        ['French Cinema', 'Music & Arts', 'Holidays & Traditions'],
        ['Debate & Discussion', 'Expressing Opinions', 'Storytelling'],
        ['Industry-Specific Terms', 'Idioms & Slang', 'Regional Dialects'],
        ['Comprehensive Review', 'Practice Scenarios', 'Final Assessment'],
      ];

      const lessons = [];
      for (let i = 0; i < lessonsPerWeek && lessonCounter <= totalLessons; i++) {
        const lessonIndex = week - 1;
        const titleIndex = i % 3;

        lessons.push({
          lessonNumber: lessonCounter,
          title: lessonTitles[lessonIndex]?.[titleIndex] || `Lesson ${lessonCounter}`,
          objectives: [
            'Learn key vocabulary',
            'Practice pronunciation',
            'Build conversational skills',
          ],
          duration: userContext.sessionDuration,
          topics: ['Vocabulary', 'Grammar', 'Practice'],
        });

        lessonCounter++;
      }

      weeks.push({
        weekNumber: week,
        theme: weekThemes[week - 1] || `Week ${week}`,
        lessons,
      });
    }

    return {
      totalLessons,
      weeksDuration: userContext.timelineWeeks,
      lessonsPerWeek,
      curriculumSummary: {
        totalLessons,
        weeksDuration: userContext.timelineWeeks,
        lessonsPerWeek,
        weeks,
        summary: `A comprehensive ${userContext.timelineWeeks}-week French learning program tailored for ${userContext.goal}, progressing from ${userContext.level} to practical fluency.`,
      },
    };
  }

  /**
   * Generate mock introduction
   */
  private generateMockIntroduction(userContext: UserContext, userName?: string): string {
    const greetings = {
      encouraging: `Bonjour${userName ? `, ${userName}` : ''}! I'm Amélie, and I'm so excited to be your French tutor! I can see you're passionate about learning French, and I'm here to support you every step of the way.`,
      fun: `Salut${userName ? `, ${userName}` : ''}! 🎉 I'm Amélie, your French tutor, and we're going to have an amazing time learning together! Get ready for some fun and engaging lessons!`,
      detail_oriented: `Bonjour${userName ? `, ${userName}` : ''}. I'm Amélie, your French instructor. I've carefully reviewed your goals and I'm prepared to guide you through a structured, comprehensive learning program.`,
      formal: `Good day${userName ? `, ${userName}` : ''}. I am Amélie, and I shall be your French language instructor. I have prepared a rigorous curriculum aligned with your academic objectives.`,
      sarcastic: `Well, well${userName ? `, ${userName}` : ''}! I'm Amélie, your French tutor. I hope you're ready to actually learn French, not just download Duolingo and ignore it like everyone else!`,
    };

    return greetings[userContext.personality as keyof typeof greetings] || greetings.encouraging;
  }

  /**
   * Calculate lessons per week based on study frequency
   */
  private calculateLessonsPerWeek(frequency: string): number {
    const frequencyMap: Record<string, number> = {
      daily: 5,
      '3x_week': 3,
      '2x_week': 2,
      weekly: 1,
    };

    return frequencyMap[frequency] || 2;
  }
}

export default new AIService();
