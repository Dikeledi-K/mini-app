-- Complete database setup for iS'khaftin Farcaster mini app
-- Run this script in your Supabase SQL editor

-- 1. Create users table (Updated for Farcaster mini app)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE, -- Made optional for Farcaster mini app
  full_name VARCHAR(255),
  avatar_url TEXT,
  wallet_address VARCHAR(42) UNIQUE, -- Made unique since it's the primary identifier
  farcaster_fid INTEGER UNIQUE,
  farcaster_username VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create campaigns table (Updated for Farcaster mini app)
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Made optional
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  goal_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  goal_currency VARCHAR(10) DEFAULT 'ZAR',
  wallet_address VARCHAR(42) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'paused')),
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ETH',
  transaction_hash VARCHAR(66),
  wallet_address VARCHAR(42),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  block_number BIGINT,
  gas_used BIGINT,
  gas_price BIGINT,
  donor_name VARCHAR(255), -- For anonymous donations
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Create triggers (with IF NOT EXISTS equivalent using DROP IF EXISTS)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Create function to update campaign current_amount when donation is confirmed
CREATE OR REPLACE FUNCTION update_campaign_amount()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if donation status changed to confirmed
    IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
        UPDATE campaigns 
        SET current_amount = current_amount + NEW.amount
        WHERE id = NEW.campaign_id;
    END IF;
    
    -- If donation status changed from confirmed to something else, subtract the amount
    IF OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
        UPDATE campaigns 
        SET current_amount = current_amount - NEW.amount
        WHERE id = NEW.campaign_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_campaign_amount_trigger ON donations;
CREATE TRIGGER update_campaign_amount_trigger
    AFTER INSERT OR UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_campaign_amount();

-- 7. Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- 8. Create policies (Simplified for Farcaster mini app - no auth required)
-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can view user profiles" ON users;
DROP POLICY IF EXISTS "Anyone can create user profiles" ON users;
DROP POLICY IF EXISTS "Anyone can update user profiles" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

DROP POLICY IF EXISTS "Anyone can view active campaigns" ON campaigns;
DROP POLICY IF EXISTS "Anyone can create campaigns" ON campaigns;
DROP POLICY IF EXISTS "Anyone can update campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON campaigns;

DROP POLICY IF EXISTS "Anyone can view confirmed donations" ON donations;
DROP POLICY IF EXISTS "Anyone can create donations" ON donations;
DROP POLICY IF EXISTS "Users can view their own donations" ON donations;

-- Users policies
CREATE POLICY "Anyone can view user profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create user profiles" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update user profiles" ON users
    FOR UPDATE USING (true);

-- Campaigns policies
CREATE POLICY "Anyone can view active campaigns" ON campaigns
    FOR SELECT USING (status = 'active');

CREATE POLICY "Anyone can create campaigns" ON campaigns
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update campaigns" ON campaigns
    FOR UPDATE USING (true);

-- Donations policies
CREATE POLICY "Anyone can view confirmed donations" ON donations
    FOR SELECT USING (status = 'confirmed');

CREATE POLICY "Anyone can create donations" ON donations
    FOR INSERT WITH CHECK (true);

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_farcaster_fid ON users(farcaster_fid);
CREATE INDEX IF NOT EXISTS idx_campaigns_creator_id ON campaigns(creator_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_transaction_hash ON donations(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);

-- 10. Insert sample users and campaigns for testing
INSERT INTO users (wallet_address, full_name, farcaster_username) VALUES 
('0x1234567890123456789012345678901234567890', 'Thabo Mthembu', 'thabo_ubuntu'),
('0x0987654321098765432109876543210987654321', 'Nomsa Dlamini', 'nomsa_cares'),
('0x1111111111111111111111111111111111111111', 'Sipho Khumalo', 'sipho_community'),
('0x2222222222222222222222222222222222222222', 'Lerato Molefe', 'lerato_help'),
('0x3333333333333333333333333333333333333333', 'Mandla Nkosi', 'mandla_youth'),
('0x4444444444444444444444444444444444444444', 'Zanele Mokoena', 'zanele_health')
ON CONFLICT (wallet_address) DO NOTHING;

INSERT INTO campaigns (creator_id, title, description, goal_amount, current_amount, wallet_address, category, location, image_url, deadline) VALUES 
-- Community & Food Security
((SELECT id FROM users WHERE wallet_address = '0x1234567890123456789012345678901234567890'), 
 'Community Kitchen Stove', 
 'Help us buy a new gas stove for our community kitchen that serves 200+ people daily. Our current stove is broken and we need to keep feeding our neighbors.', 
 5000.00, 
 1200.00,
 '0x1234567890123456789012345678901234567890', 
 'Community', 
 'Soweto, Johannesburg',
 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
 NOW() + INTERVAL '15 days'),

((SELECT id FROM users WHERE wallet_address = '0x1111111111111111111111111111111111111111'), 
 'Vegetable Garden for Township', 
 'We want to start a community vegetable garden to provide fresh, healthy food for families in our area. We need seeds, tools, and fencing.', 
 2500.00, 
 800.00,
 '0x1111111111111111111111111111111111111111', 
 'Food Security', 
 'Khayelitsha, Cape Town',
 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
 NOW() + INTERVAL '30 days'),

-- Education
((SELECT id FROM users WHERE wallet_address = '0x0987654321098765432109876543210987654321'), 
 'School Books for Children', 
 'We need textbooks and stationery for 50 children in our local school. Many families cannot afford basic school supplies.', 
 3000.00, 
 0.00,
 '0x0987654321098765432109876543210987654321', 
 'Education', 
 'Cape Town',
 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
 NOW() + INTERVAL '45 days'),

((SELECT id FROM users WHERE wallet_address = '0x2222222222222222222222222222222222222222'), 
 'Computer Lab for Rural School', 
 'Our rural school needs 10 computers to help students learn digital skills. This will give our children opportunities for the future.', 
 15000.00, 
 3500.00,
 '0x2222222222222222222222222222222222222222', 
 'Education', 
 'Limpopo Province',
 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
 NOW() + INTERVAL '60 days'),

-- Healthcare
((SELECT id FROM users WHERE wallet_address = '0x3333333333333333333333333333333333333333'), 
 'Medical Equipment for Clinic', 
 'Our local clinic needs a blood pressure monitor and basic medical supplies to better serve our community.', 
 4000.00, 
 1500.00,
 '0x3333333333333333333333333333333333333333', 
 'Healthcare', 
 'Durban, KwaZulu-Natal',
 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500',
 NOW() + INTERVAL '20 days'),

((SELECT id FROM users WHERE wallet_address = '0x4444444444444444444444444444444444444444'), 
 'Wheelchair for Elderly Patient', 
 'Help us buy a wheelchair for Gogo Sarah, a 78-year-old grandmother who needs to attend medical appointments.', 
 1200.00, 
 0.00,
 '0x4444444444444444444444444444444444444444', 
 'Healthcare', 
 'Port Elizabeth',
 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
 NOW() + INTERVAL '10 days'),

-- Youth Development
((SELECT id FROM users WHERE wallet_address = '0x1111111111111111111111111111111111111111'), 
 'Youth Sports Equipment', 
 'We need footballs, jerseys, and equipment for our youth soccer team. Sports keep our young people off the streets.', 
 2000.00, 
 600.00,
 '0x1111111111111111111111111111111111111111', 
 'Youth Development', 
 'Alexandra, Johannesburg',
 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
 NOW() + INTERVAL '25 days'),

-- Emergency Relief
((SELECT id FROM users WHERE wallet_address = '0x2222222222222222222222222222222222222222'), 
 'Flood Relief for Families', 
 'Recent floods damaged 20 homes in our community. We need to help families rebuild and get back on their feet.', 
 8000.00, 
 2200.00,
 '0x2222222222222222222222222222222222222222', 
 'Emergency Relief', 
 'KwaZulu-Natal',
 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500',
 NOW() + INTERVAL '5 days'),

-- Small Business
((SELECT id FROM users WHERE wallet_address = '0x3333333333333333333333333333333333333333'), 
 'Sewing Machine for Tailoring Business', 
 'Help me buy a sewing machine to start a small tailoring business and support my family. I will teach others to sew too.', 
 1800.00, 
 0.00,
 '0x3333333333333333333333333333333333333333', 
 'Small Business', 
 'Bloemfontein',
 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
 NOW() + INTERVAL '40 days'),

-- Infrastructure
((SELECT id FROM users WHERE wallet_address = '0x4444444444444444444444444444444444444444'), 
 'Community Water Tank', 
 'Our area has water shortages. We need a large water tank to store water for the community during dry periods.', 
 6000.00, 
 1800.00,
 '0x4444444444444444444444444444444444444444', 
 'Infrastructure', 
 'Mpumalanga',
 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
 NOW() + INTERVAL '35 days')
ON CONFLICT DO NOTHING;

-- Insert some sample donations to show progress
INSERT INTO donations (campaign_id, donor_id, amount, currency, status, donor_name, message) VALUES 
-- Donations for Community Kitchen Stove
((SELECT id FROM campaigns WHERE title = 'Community Kitchen Stove'), 
 (SELECT id FROM users WHERE wallet_address = '0x0987654321098765432109876543210987654321'),
 500.00, 'ZAR', 'confirmed', 'Nomsa Dlamini', 'Keep up the good work!'),
((SELECT id FROM campaigns WHERE title = 'Community Kitchen Stove'), 
 (SELECT id FROM users WHERE wallet_address = '0x1111111111111111111111111111111111111111'),
 700.00, 'ZAR', 'confirmed', 'Sipho Khumalo', 'Ubuntu in action!'),

-- Donations for Vegetable Garden
((SELECT id FROM campaigns WHERE title = 'Vegetable Garden for Township'), 
 (SELECT id FROM users WHERE wallet_address = '0x1234567890123456789012345678901234567890'),
 300.00, 'ZAR', 'confirmed', 'Thabo Mthembu', 'Great initiative!'),
((SELECT id FROM campaigns WHERE title = 'Vegetable Garden for Township'), 
 (SELECT id FROM users WHERE wallet_address = '0x2222222222222222222222222222222222222222'),
 500.00, 'ZAR', 'confirmed', 'Lerato Molefe', 'Healthy food for all!'),

-- Donations for Computer Lab
((SELECT id FROM campaigns WHERE title = 'Computer Lab for Rural School'), 
 (SELECT id FROM users WHERE wallet_address = '0x1234567890123456789012345678901234567890'),
 1000.00, 'ZAR', 'confirmed', 'Thabo Mthembu', 'Education is the future!'),
((SELECT id FROM campaigns WHERE title = 'Computer Lab for Rural School'), 
 (SELECT id FROM users WHERE wallet_address = '0x0987654321098765432109876543210987654321'),
 1500.00, 'ZAR', 'confirmed', 'Nomsa Dlamini', 'Digital skills for our children'),
((SELECT id FROM campaigns WHERE title = 'Computer Lab for Rural School'), 
 (SELECT id FROM users WHERE wallet_address = '0x3333333333333333333333333333333333333333'),
 1000.00, 'ZAR', 'confirmed', 'Mandla Nkosi', 'Investing in our future!'),

-- Donations for Medical Equipment
((SELECT id FROM campaigns WHERE title = 'Medical Equipment for Clinic'), 
 (SELECT id FROM users WHERE wallet_address = '0x4444444444444444444444444444444444444444'),
 800.00, 'ZAR', 'confirmed', 'Zanele Mokoena', 'Healthcare for all!'),
((SELECT id FROM campaigns WHERE title = 'Medical Equipment for Clinic'), 
 (SELECT id FROM users WHERE wallet_address = '0x1111111111111111111111111111111111111111'),
 700.00, 'ZAR', 'confirmed', 'Sipho Khumalo', 'Supporting our clinic'),

-- Donations for Youth Sports
((SELECT id FROM campaigns WHERE title = 'Youth Sports Equipment'), 
 (SELECT id FROM users WHERE wallet_address = '0x2222222222222222222222222222222222222222'),
 300.00, 'ZAR', 'confirmed', 'Lerato Molefe', 'Keep our youth active!'),
((SELECT id FROM campaigns WHERE title = 'Youth Sports Equipment'), 
 (SELECT id FROM users WHERE wallet_address = '0x4444444444444444444444444444444444444444'),
 300.00, 'ZAR', 'confirmed', 'Zanele Mokoena', 'Sports build character!'),

-- Donations for Flood Relief
((SELECT id FROM campaigns WHERE title = 'Flood Relief for Families'), 
 (SELECT id FROM users WHERE wallet_address = '0x1234567890123456789012345678901234567890'),
 1000.00, 'ZAR', 'confirmed', 'Thabo Mthembu', 'Standing together in tough times'),
((SELECT id FROM campaigns WHERE title = 'Flood Relief for Families'), 
 (SELECT id FROM users WHERE wallet_address = '0x0987654321098765432109876543210987654321'),
 800.00, 'ZAR', 'confirmed', 'Nomsa Dlamini', 'Community support'),
((SELECT id FROM campaigns WHERE title = 'Flood Relief for Families'), 
 (SELECT id FROM users WHERE wallet_address = '0x3333333333333333333333333333333333333333'),
 400.00, 'ZAR', 'confirmed', 'Mandla Nkosi', 'Every bit helps!'),

-- Donations for Water Tank
((SELECT id FROM campaigns WHERE title = 'Community Water Tank'), 
 (SELECT id FROM users WHERE wallet_address = '0x1111111111111111111111111111111111111111'),
 600.00, 'ZAR', 'confirmed', 'Sipho Khumalo', 'Water is life!'),
((SELECT id FROM campaigns WHERE title = 'Community Water Tank'), 
 (SELECT id FROM users WHERE wallet_address = '0x2222222222222222222222222222222222222222'),
 700.00, 'ZAR', 'confirmed', 'Lerato Molefe', 'Essential infrastructure'),
((SELECT id FROM campaigns WHERE title = 'Community Water Tank'), 
 (SELECT id FROM users WHERE wallet_address = '0x4444444444444444444444444444444444444444'),
 500.00, 'ZAR', 'confirmed', 'Zanele Mokoena', 'Clean water for all!')
ON CONFLICT DO NOTHING;
