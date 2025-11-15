import { Request, Response } from 'express';
import prisma from '../config/database';
import { userProfileSchema } from '../types/validation';
import { ZodError } from 'zod';

/**
 * Create or update user profile (onboarding)
 */
export async function createOrUpdateProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate request body
    const profileData = userProfileSchema.parse(req.body);

    // Check if profile already exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    let profile;

    if (existingProfile) {
      // Update existing profile
      profile = await prisma.userProfile.update({
        where: { userId },
        data: profileData,
      });
    } else {
      // Create new profile
      profile = await prisma.userProfile.create({
        data: {
          ...profileData,
          userId,
        },
      });

      // Mark onboarding as completed
      await prisma.user.update({
        where: { id: userId },
        data: { onboardingCompleted: true },
      });
    }

    res.status(existingProfile ? 200 : 201).json({
      message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
      profile,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Create/update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get user profile
 */
export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
