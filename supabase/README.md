# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Save your project credentials

## 2. Run Migrations

### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option B: Manual SQL Execution

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy the content of `migrations/20260101000000_initial_schema.sql`
4. Paste and execute

## 3. Add Environment Variables

Add these to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. (Optional) Seed Test Data

For development, you can seed test data:

```bash
# Using CLI
supabase db reset --db-url your-db-url

# Or manually run seed.sql in SQL Editor
```

## Database Schema Overview

### Core Tables

- **users**: Main user accounts (synced with Clerk)
- **closer_profiles**: Closer/Setter profiles with expertise
- **entrepreneur_profiles**: Entrepreneur company profiles
- **missions**: Job postings and contracts
- **conversations**: Chat conversations
- **messages**: Individual chat messages
- **reviews**: Ratings and reviews
- **payments**: Payment tracking with Stripe
- **subscriptions**: Premium subscriptions

### Security

Row Level Security (RLS) is enabled on all tables with appropriate policies.

## Realtime Setup (Optional)

To enable realtime for messaging:

1. Go to Database > Replication
2. Enable replication for:
   - `conversations`
   - `messages`
   - `notifications`

## Storage Setup (Optional)

For file uploads (profile photos, documents):

1. Go to Storage
2. Create buckets:
   - `profile-photos`
   - `contracts`
   - `portfolio-files`
3. Set appropriate bucket policies
