import { auth, currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId, createUser } from '@/lib/db/queries';
import type { User } from '@/lib/db/types';

/**
 * Get the current authenticated user from Clerk and Supabase
 * Automatically creates user in Supabase if doesn't exist
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    // Try to get user from our database
    const user = await getUserByClerkId(userId);
    return user;
  } catch (error) {
    // User doesn't exist in our DB, create them
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    // Check if user has completed onboarding (has user_type in metadata)
    const userType = clerkUser.publicMetadata.user_type as
      | 'closer'
      | 'entrepreneur'
      | undefined;

    if (!userType) {
      // User hasn't completed onboarding yet
      return null;
    }

    const newUser = await createUser({
      clerk_id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      name:
        `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
        'User',
      user_type: userType,
    });

    return newUser;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await auth();
  return !!userId;
}

/**
 * Require authentication, redirect to sign-in if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return false;
  }

  return !!clerkUser.publicMetadata.user_type;
}
