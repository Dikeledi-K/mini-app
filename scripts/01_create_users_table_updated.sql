-- Create users table for authentication and profiles (Updated for Farcaster mini app)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE, -- Made optional for Farcaster mini app
  full_name VARCHAR(255),
  avatar_url TEXT,
  wallet_address VARCHAR(42) UNIQUE, -- Made unique since it's the primary identifier for Farcaster mini app
  farcaster_fid INTEGER UNIQUE,
  farcaster_username VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies (Updated for Farcaster mini app - no auth required)
CREATE POLICY "Anyone can view user profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create user profiles" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (true); -- Simplified for Farcaster mini app

-- Create indexes
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_farcaster_fid ON users(farcaster_fid);
