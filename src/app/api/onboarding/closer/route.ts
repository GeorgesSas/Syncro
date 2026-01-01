import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/db/supabase';
import { getUserByClerkId, createUser } from '@/lib/db/queries';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { bio, experience_years, hourly_rate, phone, sectors } = data;

    // Validate required fields
    if (!bio || !experience_years || !hourly_rate || !phone || !sectors) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check if user exists in our DB, create if not
    let user;
    try {
      user = await getUserByClerkId(userId);
    } catch {
      // Get Clerk user data
      const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });

      if (!clerkResponse.ok) {
        throw new Error('Failed to fetch Clerk user');
      }

      const clerkUser = await clerkResponse.json();

      user = await createUser({
        clerk_id: userId,
        email: clerkUser.email_addresses[0]?.email_address || '',
        name: `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim() || 'User',
        user_type: 'closer',
      });
    }

    // Create closer profile
    const { data: profile, error } = await supabase
      .from('closer_profiles')
      .insert({
        user_id: user.id,
        bio,
        experience_years,
        hourly_rate,
        phone,
        sectors,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating closer profile:', error);
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error in closer onboarding:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
