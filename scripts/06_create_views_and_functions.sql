-- Create view for campaign statistics
CREATE OR REPLACE VIEW campaign_stats AS
SELECT 
    c.id,
    c.title,
    c.goal_amount,
    c.current_amount,
    ROUND((c.current_amount / c.goal_amount * 100)::numeric, 2) as progress_percentage,
    COUNT(d.id) as total_donations,
    COUNT(DISTINCT d.donor_id) as unique_donors,
    AVG(d.amount) as average_donation,
    MAX(d.created_at) as last_donation_at
FROM campaigns c
LEFT JOIN donations d ON c.id = d.campaign_id AND d.status = 'confirmed'
GROUP BY c.id, c.title, c.goal_amount, c.current_amount;

-- Create function to get trending campaigns
CREATE OR REPLACE FUNCTION get_trending_campaigns(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    description TEXT,
    goal_amount DECIMAL(10,2),
    current_amount DECIMAL(10,2),
    progress_percentage NUMERIC,
    total_donations BIGINT,
    image_url TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.description,
        c.goal_amount,
        c.current_amount,
        ROUND((c.current_amount / c.goal_amount * 100)::numeric, 2) as progress_percentage,
        COUNT(d.id) as total_donations,
        c.image_url,
        c.category,
        c.created_at
    FROM campaigns c
    LEFT JOIN donations d ON c.id = d.campaign_id AND d.status = 'confirmed'
    WHERE c.status = 'active'
    GROUP BY c.id, c.title, c.description, c.goal_amount, c.current_amount, c.image_url, c.category, c.created_at
    ORDER BY 
        COUNT(d.id) DESC, 
        (c.current_amount / c.goal_amount) DESC,
        c.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user donation history
CREATE OR REPLACE FUNCTION get_user_donation_history(user_id UUID)
RETURNS TABLE (
    donation_id UUID,
    campaign_title VARCHAR(255),
    amount DECIMAL(10,2),
    currency VARCHAR(10),
    status VARCHAR(20),
    transaction_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id as donation_id,
        c.title as campaign_title,
        d.amount,
        d.currency,
        d.status,
        d.transaction_hash,
        d.created_at,
        d.confirmed_at
    FROM donations d
    JOIN campaigns c ON d.campaign_id = c.id
    WHERE d.donor_id = user_id
    ORDER BY d.created_at DESC;
END;
$$ LANGUAGE plpgsql;
