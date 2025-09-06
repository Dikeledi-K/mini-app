-- Create donations table
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

-- Enable Row Level Security
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view confirmed donations" ON donations
    FOR SELECT USING (status = 'confirmed');

CREATE POLICY "Users can view their own donations" ON donations
    FOR SELECT USING (auth.uid() = donor_id);

CREATE POLICY "Users can create donations" ON donations
    FOR INSERT WITH CHECK (auth.uid() = donor_id OR donor_id IS NULL);

-- Create indexes
CREATE INDEX idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_transaction_hash ON donations(transaction_hash);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);

-- Create function to update campaign current_amount when donation is confirmed
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

CREATE TRIGGER update_campaign_amount_trigger
    AFTER INSERT OR UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_campaign_amount();
