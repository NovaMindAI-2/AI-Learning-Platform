// User types
export interface User {
  id: string;
  email: string;
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface UserProfile {
  id: string;
  userId: string;
  targetLanguage: string;
  currentLevel: 'beginner' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  learningGoal: 'business_trip' | 'tourism' | 'conversation' | 'academic' | 'fluency';
  timelineWeeks: number;
  studyFrequency: 'daily' | '3x_week' | '2x_week' | 'weekly';
  sessionDuration: number;
  includesHomework: boolean;
  tutorPersonality: 'encouraging' | 'sarcastic' | 'detail_oriented' | 'fun' | 'formal';
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Onboarding types
export interface OnboardingFormData {
  currentLevel: UserProfile['currentLevel'];
  learningGoal: UserProfile['learningGoal'];
  timelineWeeks: number;
  studyFrequency: UserProfile['studyFrequency'];
  sessionDuration: number;
  includesHomework: boolean;
  tutorPersonality: UserProfile['tutorPersonality'];
}

// Curriculum types
export interface Lesson {
  lessonNumber: number;
  title: string;
  objectives: string[];
  duration: number;
  topics: string[];
}

export interface CurriculumWeek {
  weekNumber: number;
  theme: string;
  lessons: Lesson[];
}

export interface Curriculum {
  id: string;
  userId: string;
  totalLessons: number;
  weeksDuration: number;
  lessonsPerWeek: number;
  curriculumSummary: {
    totalLessons: number;
    weeksDuration: number;
    lessonsPerWeek: number;
    weeks: CurriculumWeek[];
    summary: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TutorIntroduction {
  introduction: string;
  tutorName: string;
  personality: string;
}
