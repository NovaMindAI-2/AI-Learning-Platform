import { z } from 'zod';

// Auth validation schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// User profile validation schema
export const userProfileSchema = z.object({
  targetLanguage: z.string().default('french'),
  currentLevel: z.enum(['beginner', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  learningGoal: z.enum(['business_trip', 'tourism', 'conversation', 'academic', 'fluency']),
  timelineWeeks: z.number().int().positive(),
  studyFrequency: z.enum(['daily', '3x_week', '2x_week', 'weekly']),
  sessionDuration: z.number().int().positive(),
  includesHomework: z.boolean(),
  tutorPersonality: z.enum(['encouraging', 'sarcastic', 'detail_oriented', 'fun', 'formal']),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
