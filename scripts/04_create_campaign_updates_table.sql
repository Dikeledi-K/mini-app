-- Create campaign updates table for progress updates
CREATE TABLE IF NOT EXISTS campaign_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE campaign_updates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view campaign updates" ON campaign_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM campaigns 
            WHERE campaigns.id = campaign_updates.campaign_id 
            AND campaigns.status = 'active'
        )
    );

CREATE POLICY "Campaign creators can add updates" ON campaign_updates
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM campaigns 
            WHERE campaigns.id = campaign_updates.campaign_id 
            AND campaigns.creator_id = auth.uid()
        )
    );

-- Create indexes
CREATE INDEX idx_campaign_updates_campaign_id ON campaign_updates(campaign_id);
CREATE INDEX idx_campaign_updates_created_at ON campaign_updates(created_at DESC);
