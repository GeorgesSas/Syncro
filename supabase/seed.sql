-- Seed data for development and testing
-- WARNING: This will add test data. Only run in development!

-- Insert test users
INSERT INTO users (id, clerk_id, email, name, user_type) VALUES
    ('00000000-0000-0000-0000-000000000001', 'clerk_test_closer_1', 'jean.dupont@email.com', 'Jean Dupont', 'closer'),
    ('00000000-0000-0000-0000-000000000002', 'clerk_test_closer_2', 'marie.martin@email.com', 'Marie Martin', 'closer'),
    ('00000000-0000-0000-0000-000000000003', 'clerk_test_closer_3', 'pierre.bernard@email.com', 'Pierre Bernard', 'closer'),
    ('00000000-0000-0000-0000-000000000004', 'clerk_test_entrepreneur_1', 'sophie.tech@startup.com', 'Sophie Laurent', 'entrepreneur'),
    ('00000000-0000-0000-0000-000000000005', 'clerk_test_entrepreneur_2', 'thomas.coach@coaching.com', 'Thomas Dubois', 'entrepreneur')
ON CONFLICT (clerk_id) DO NOTHING;

-- Insert closer profiles
INSERT INTO closer_profiles (user_id, bio, experience_years, sectors, hourly_rate, is_premium, is_verified, availability, total_missions, success_rate, average_rating, photo_url) VALUES
    (
        '00000000-0000-0000-0000-000000000001',
        'Expert en closing high-ticket avec 5 ans d''expérience dans le SaaS B2B. Spécialisé dans les solutions tech complexes.',
        5,
        ARRAY['tech', 'saas'],
        150,
        true,
        true,
        'available',
        12,
        92.5,
        4.8,
        'https://i.pravatar.cc/300?img=1'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Closeure passionnée par le coaching et la formation. Track record de 2M€+ en CA généré pour mes clients.',
        3,
        ARRAY['coaching', 'formation'],
        120,
        true,
        true,
        'available',
        8,
        95.0,
        5.0,
        'https://i.pravatar.cc/300?img=2'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Setter et closer spécialisé en immobilier et finance. Approche consultative et orientée résultats.',
        7,
        ARRAY['immobilier', 'finance'],
        180,
        false,
        true,
        'busy',
        25,
        88.0,
        4.6,
        'https://i.pravatar.cc/300?img=3'
    )
ON CONFLICT (user_id) DO NOTHING;

-- Insert entrepreneur profiles
INSERT INTO entrepreneur_profiles (user_id, company_name, industry, company_size, is_premium) VALUES
    ('00000000-0000-0000-0000-000000000004', 'TechFlow SaaS', 'tech', '11-50', true),
    ('00000000-0000-0000-0000-000000000005', 'Excellence Coaching', 'coaching', '2-10', false)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample missions
INSERT INTO missions (id, entrepreneur_id, closer_id, title, description, budget, sectors, status, payment_method, duration_months) VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000001',
        'Closer pour solution CRM B2B',
        'Nous recherchons un closer expérimenté pour notre solution CRM destinée aux PME. Ticket moyen: 5000€/an.',
        15000,
        ARRAY['tech', 'saas'],
        'active',
        'commission',
        3
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000005',
        NULL,
        'Closer pour programme coaching premium',
        'Programme de coaching à 3000€. Besoin d''un closer pour convertir nos leads qualifiés.',
        10000,
        ARRAY['coaching'],
        'pending',
        'commission',
        2
    )
ON CONFLICT (id) DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (mission_id, reviewer_id, reviewee_id, rating, comment) VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000001',
        5,
        'Excellent travail ! Jean a dépassé nos attentes avec un taux de conversion de 35%. Très professionnel et à l''écoute.'
    )
ON CONFLICT (mission_id, reviewer_id) DO NOTHING;

COMMENT ON TABLE users IS 'Test users created for development';
