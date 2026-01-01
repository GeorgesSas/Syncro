-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_type AS ENUM ('closer', 'entrepreneur', 'admin');
CREATE TYPE mission_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE payment_method AS ENUM ('commission', 'flat_fee');
CREATE TYPE payment_status AS ENUM ('pending', 'held', 'released', 'refunded');
CREATE TYPE availability_status AS ENUM ('available', 'busy', 'unavailable');

-- Users table (extends Clerk auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    user_type user_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Closer profiles
CREATE TABLE closer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    bio TEXT,
    experience_years INTEGER DEFAULT 0,
    sectors TEXT[] DEFAULT '{}',
    hourly_rate DECIMAL(10, 2),
    is_premium BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    portfolio_items JSONB DEFAULT '[]'::jsonb,
    availability availability_status DEFAULT 'available',
    total_missions INTEGER DEFAULT 0,
    success_rate DECIMAL(5, 2) DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    stripe_account_id TEXT,
    photo_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entrepreneur profiles
CREATE TABLE entrepreneur_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    industry TEXT,
    company_size TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Missions
CREATE TABLE missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entrepreneur_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    closer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    commission_rate DECIMAL(5, 2) DEFAULT 0.10,
    commission_amount DECIMAL(10, 2),
    total_amount DECIMAL(10, 2),
    duration_months INTEGER,
    status mission_status DEFAULT 'pending',
    start_date DATE,
    end_date DATE,
    payment_method payment_method DEFAULT 'commission',
    flat_fee_amount DECIMAL(10, 2),
    contract_signed_at TIMESTAMPTZ,
    contract_url TEXT,
    sectors TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mission applications (when closers apply to missions)
CREATE TABLE mission_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE NOT NULL,
    closer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mission_id, closer_id)
);

-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
    entrepreneur_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    closer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entrepreneur_id, closer_id, mission_id)
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mission_id, reviewer_id)
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE NOT NULL,
    stripe_payment_intent_id TEXT UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    status payment_status DEFAULT 'pending',
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions (Premium)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    plan_type TEXT NOT NULL, -- 'closer_premium', 'entrepreneur_premium'
    status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'past_due'
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'message', 'mission', 'payment', 'review', etc.
    read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_closer_profiles_user_id ON closer_profiles(user_id);
CREATE INDEX idx_closer_profiles_availability ON closer_profiles(availability);
CREATE INDEX idx_closer_profiles_is_premium ON closer_profiles(is_premium);
CREATE INDEX idx_entrepreneur_profiles_user_id ON entrepreneur_profiles(user_id);
CREATE INDEX idx_missions_entrepreneur_id ON missions(entrepreneur_id);
CREATE INDEX idx_missions_closer_id ON missions(closer_id);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_mission_applications_mission_id ON mission_applications(mission_id);
CREATE INDEX idx_mission_applications_closer_id ON mission_applications(closer_id);
CREATE INDEX idx_conversations_entrepreneur_id ON conversations(entrepreneur_id);
CREATE INDEX idx_conversations_closer_id ON conversations(closer_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_payments_mission_id ON payments(mission_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_closer_profiles_updated_at BEFORE UPDATE ON closer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entrepreneur_profiles_updated_at BEFORE UPDATE ON entrepreneur_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically calculate mission commission and total
CREATE OR REPLACE FUNCTION calculate_mission_amounts()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_method = 'commission' THEN
        NEW.commission_amount := NEW.budget * NEW.commission_rate;
        NEW.total_amount := NEW.budget + NEW.commission_amount;
        NEW.flat_fee_amount := NULL;
    ELSE
        NEW.commission_amount := COALESCE(NEW.flat_fee_amount, 199);
        NEW.total_amount := NEW.budget + NEW.commission_amount;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_mission_amounts_trigger BEFORE INSERT OR UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION calculate_mission_amounts();

-- Function to update closer stats after review
CREATE OR REPLACE FUNCTION update_closer_stats_after_review()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE closer_profiles
    SET
        average_rating = (
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM reviews
            WHERE reviewee_id = NEW.reviewee_id
        )
    WHERE user_id = NEW.reviewee_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_closer_stats_trigger AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_closer_stats_after_review();

-- Function to update last_message_at in conversations
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversation_last_message_trigger AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE closer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE entrepreneur_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid()::text = clerk_id);

-- RLS Policies for closer_profiles
CREATE POLICY "Closer profiles are viewable by authenticated users" ON closer_profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Closers can update their own profile" ON closer_profiles
    FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

-- RLS Policies for entrepreneur_profiles
CREATE POLICY "Entrepreneurs can view and update their own profile" ON entrepreneur_profiles
    FOR ALL USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

-- RLS Policies for missions
CREATE POLICY "Missions are viewable by participants and public if pending" ON missions
    FOR SELECT USING (
        status = 'pending' OR
        entrepreneur_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text) OR
        closer_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
    );

CREATE POLICY "Entrepreneurs can create missions" ON missions
    FOR INSERT WITH CHECK (entrepreneur_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

CREATE POLICY "Mission owners can update their missions" ON missions
    FOR UPDATE USING (entrepreneur_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

-- Additional policies for other tables...
-- (You can add more granular policies as needed)

COMMENT ON TABLE users IS 'Main users table, synced with Clerk authentication';
COMMENT ON TABLE closer_profiles IS 'Profiles for closers/setters with expertise and portfolio';
COMMENT ON TABLE entrepreneur_profiles IS 'Profiles for entrepreneurs seeking closers';
COMMENT ON TABLE missions IS 'Job postings and contracts between entrepreneurs and closers';
COMMENT ON TABLE conversations IS 'Chat conversations between users';
COMMENT ON TABLE messages IS 'Individual messages in conversations';
COMMENT ON TABLE reviews IS 'Ratings and reviews after mission completion';
COMMENT ON TABLE payments IS 'Payment tracking with Stripe escrow';
COMMENT ON TABLE subscriptions IS 'Premium subscription tracking';
