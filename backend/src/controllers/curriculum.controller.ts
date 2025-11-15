import { Request, Response } from 'express';
import prisma from '../config/database';
import aiService from '../services/ai.service';

/**
 * Generate curriculum for the authenticated user
 */
export async function generateCurriculum(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'User profile not found. Complete onboarding first.' });
    }

    // Check if curriculum already exists
    const existingCurriculum = await prisma.curriculum.findUnique({
      where: { userId },
    });

    if (existingCurriculum) {
      return res.json({
        message: 'Curriculum already exists',
        curriculum: existingCurriculum,
      });
    }

    // Generate curriculum using AI
    const curriculumData = await aiService.generateCurriculum({
      level: profile.currentLevel,
      goal: profile.learningGoal,
      timelineWeeks: profile.timelineWeeks,
      studyFrequency: profile.studyFrequency,
      sessionDuration: profile.sessionDuration,
      includesHomework: profile.includesHomework,
      personality: profile.tutorPersonality,
    });

    // Save curriculum to database
    const curriculum = await prisma.curriculum.create({
      data: {
        userId,
        totalLessons: curriculumData.totalLessons,
        weeksDuration: curriculumData.weeksDuration,
        lessonsPerWeek: curriculumData.lessonsPerWeek,
        curriculumSummary: JSON.stringify(curriculumData.curriculumSummary),
      },
    });

    // Create lesson records
    const weeks = curriculumData.curriculumSummary.weeks || [];
    const lessonPromises = weeks.flatMap((week: any) =>
      week.lessons.map((lesson: any) =>
        prisma.lesson.create({
          data: {
            curriculumId: curriculum.id,
            lessonNumber: lesson.lessonNumber,
            title: lesson.title,
            description: `Lesson ${lesson.lessonNumber}: ${lesson.title}`,
            objectives: JSON.stringify(lesson.objectives),
            content: JSON.stringify(lesson),
            durationMinutes: lesson.duration,
          },
        })
      )
    );

    await Promise.all(lessonPromises);

    res.status(201).json({
      message: 'Curriculum generated successfully',
      curriculum: {
        ...curriculum,
        curriculumSummary: curriculumData.curriculumSummary,
      },
    });
  } catch (error) {
    console.error('Generate curriculum error:', error);
    res.status(500).json({ error: 'Failed to generate curriculum' });
  }
}

/**
 * Get curriculum for the authenticated user
 */
export async function getCurriculum(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const curriculum = await prisma.curriculum.findUnique({
      where: { userId },
      include: {
        lessons: {
          orderBy: {
            lessonNumber: 'asc',
          },
        },
      },
    });

    if (!curriculum) {
      return res.status(404).json({ error: 'Curriculum not found' });
    }

    res.json({
      curriculum: {
        ...curriculum,
        curriculumSummary: JSON.parse(curriculum.curriculumSummary as string),
        lessons: curriculum.lessons.map((lesson) => ({
          ...lesson,
          objectives: JSON.parse(lesson.objectives as string),
          content: JSON.parse(lesson.content as string),
        })),
      },
    });
  } catch (error) {
    console.error('Get curriculum error:', error);
    res.status(500).json({ error: 'Failed to fetch curriculum' });
  }
}

/**
 * Generate AI tutor introduction
 */
export async function getTutorIntroduction(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Get user email for personalization
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    // Generate introduction
    const introduction = await aiService.generateTutorIntroduction(
      {
        level: profile.currentLevel,
        goal: profile.learningGoal,
        timelineWeeks: profile.timelineWeeks,
        studyFrequency: profile.studyFrequency,
        sessionDuration: profile.sessionDuration,
        includesHomework: profile.includesHomework,
        personality: profile.tutorPersonality,
      },
      user?.email.split('@')[0] // Use email username as name
    );

    res.json({
      introduction,
      tutorName: 'Amélie',
      personality: profile.tutorPersonality,
    });
  } catch (error) {
    console.error('Get tutor introduction error:', error);
    res.status(500).json({ error: 'Failed to generate introduction' });
  }
}
