import { Request, Response } from 'express';
import prisma from '../config/database';

/**
 * Get dashboard data for the authenticated user
 */
export async function getDashboardData(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user with profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get curriculum with lessons
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

    // Get knowledge base items
    const knowledgeItems = await prisma.userKnowledge.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Get lesson sessions
    const lessonSessions = await prisma.lessonSession.findMany({
      where: { userId },
      orderBy: {
        startedAt: 'desc',
      },
      take: 5,
      include: {
        lesson: true,
      },
    });

    // Calculate statistics
    const totalLessons = curriculum?.totalLessons || 0;
    const completedLessons = curriculum?.lessons.filter((l) => l.completed).length || 0;
    const knowledgeCount = await prisma.userKnowledge.count({
      where: { userId },
    });

    // Calculate study time (from sessions)
    const totalStudyMinutes = lessonSessions.reduce((sum, session) => {
      return sum + (session.durationMinutes || 0);
    }, 0);

    // Calculate streak (simplified - consecutive days with sessions)
    const currentStreak = await calculateStreak(userId);

    // Get next lesson
    const nextLesson = curriculum?.lessons.find((l) => !l.completed);

    res.json({
      user: {
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
      },
      profile: user.profile,
      stats: {
        totalLessons,
        completedLessons,
        knowledgeCount,
        totalStudyMinutes,
        currentStreak,
        progressPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      },
      curriculum: curriculum
        ? {
            ...curriculum,
            curriculumSummary: JSON.parse(curriculum.curriculumSummary as string),
            lessons: curriculum.lessons.map((lesson) => ({
              ...lesson,
              objectives: JSON.parse(lesson.objectives as string),
              content: JSON.parse(lesson.content as string),
            })),
          }
        : null,
      knowledgeItems: knowledgeItems.slice(0, 5), // Top 5 for dashboard
      recentSessions: lessonSessions.map((session) => ({
        ...session,
        lesson: session.lesson
          ? {
              ...session.lesson,
              objectives: JSON.parse(session.lesson.objectives as string),
            }
          : null,
      })),
      nextLesson: nextLesson
        ? {
            ...nextLesson,
            objectives: JSON.parse(nextLesson.objectives as string),
            content: JSON.parse(nextLesson.content as string),
          }
        : null,
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}

/**
 * Calculate user's current learning streak
 */
async function calculateStreak(userId: string): Promise<number> {
  const sessions = await prisma.lessonSession.findMany({
    where: {
      userId,
      completedAt: { not: null },
    },
    orderBy: {
      completedAt: 'desc',
    },
    select: {
      completedAt: true,
    },
  });

  if (sessions.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const session of sessions) {
    if (!session.completedAt) continue;

    const sessionDate = new Date(session.completedAt);
    sessionDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || diffDays === 1) {
      if (diffDays === 1) streak++;
      currentDate = sessionDate;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Get knowledge base items
 */
export async function getKnowledgeBase(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { type, search, limit = 50 } = req.query;

    const where: any = { userId };

    if (type) {
      where.knowledgeType = type;
    }

    if (search && typeof search === 'string') {
      where.content = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const items = await prisma.userKnowledge.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: Number(limit),
    });

    // Group by type
    const grouped = items.reduce((acc, item) => {
      const type = item.knowledgeType;
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {} as Record<string, typeof items>);

    res.json({
      items,
      grouped,
      total: items.length,
    });
  } catch (error) {
    console.error('Get knowledge base error:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge base' });
  }
}
