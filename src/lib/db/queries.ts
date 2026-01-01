import { supabase } from './supabase';
import type { CloserProfile, Mission, User } from './types';

// User queries
export async function getUserByClerkId(clerkId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (error) throw error;
  return data as User;
}

export async function createUser(userData: {
  clerk_id: string;
  email: string;
  name: string;
  user_type: 'closer' | 'entrepreneur';
}) {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

// Closer profile queries
export async function getCloserProfile(userId: string) {
  const { data, error } = await supabase
    .from('closer_profiles')
    .select(`
      *,
      user:users(*)
    `)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data as CloserProfile;
}

export async function getAllClosers(filters?: {
  sectors?: string[];
  minRating?: number;
  availability?: string;
  isPremium?: boolean;
}) {
  let query = supabase
    .from('closer_profiles')
    .select(`
      *,
      user:users(*)
    `)
    .order('is_premium', { ascending: false })
    .order('average_rating', { ascending: false });

  if (filters?.sectors && filters.sectors.length > 0) {
    query = query.overlaps('sectors', filters.sectors);
  }

  if (filters?.minRating) {
    query = query.gte('average_rating', filters.minRating);
  }

  if (filters?.availability) {
    query = query.eq('availability', filters.availability);
  }

  if (filters?.isPremium !== undefined) {
    query = query.eq('is_premium', filters.isPremium);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as CloserProfile[];
}

export async function updateCloserProfile(
  userId: string,
  updates: Partial<CloserProfile>
) {
  const { data, error } = await supabase
    .from('closer_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as CloserProfile;
}

// Mission queries
export async function getMissions(filters?: {
  status?: string;
  entrepreneurId?: string;
  closerId?: string;
  sectors?: string[];
}) {
  let query = supabase
    .from('missions')
    .select(`
      *,
      entrepreneur:users!entrepreneur_id(*),
      closer:users!closer_id(*)
    `)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.entrepreneurId) {
    query = query.eq('entrepreneur_id', filters.entrepreneurId);
  }

  if (filters?.closerId) {
    query = query.eq('closer_id', filters.closerId);
  }

  if (filters?.sectors && filters.sectors.length > 0) {
    query = query.overlaps('sectors', filters.sectors);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Mission[];
}

export async function getMissionById(missionId: string) {
  const { data, error } = await supabase
    .from('missions')
    .select(`
      *,
      entrepreneur:users!entrepreneur_id(*),
      closer:users!closer_id(*)
    `)
    .eq('id', missionId)
    .single();

  if (error) throw error;
  return data as Mission;
}

export async function createMission(missionData: {
  entrepreneur_id: string;
  title: string;
  description: string;
  budget: number;
  duration_months?: number;
  payment_method?: 'commission' | 'flat_fee';
  sectors?: string[];
}) {
  const { data, error } = await supabase
    .from('missions')
    .insert(missionData)
    .select()
    .single();

  if (error) throw error;
  return data as Mission;
}

export async function updateMission(
  missionId: string,
  updates: Partial<Mission>
) {
  const { data, error } = await supabase
    .from('missions')
    .update(updates)
    .eq('id', missionId)
    .select()
    .single();

  if (error) throw error;
  return data as Mission;
}

// Conversation and message queries
export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      entrepreneur:users!entrepreneur_id(*),
      closer:users!closer_id(*),
      mission:missions(*)
    `)
    .or(`entrepreneur_id.eq.${userId},closer_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users(*)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createMessage(messageData: {
  conversation_id: string;
  sender_id: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Reviews
export async function getCloserReviews(closerId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:users!reviewer_id(*),
      mission:missions(*)
    `)
    .eq('reviewee_id', closerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
