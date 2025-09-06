-- Create categories table for campaign categorization
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7), -- Hex color code
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description, icon, color) VALUES
('Education', 'School supplies, books, and educational resources', 'GraduationCap', '#f97316'),
('Healthcare', 'Medical equipment, treatments, and health initiatives', 'Heart', '#ef4444'),
('Community', 'Community centers, events, and local improvements', 'Users', '#22c55e'),
('Food Security', 'Community kitchens, food programs, and nutrition', 'Utensils', '#eab308'),
('Infrastructure', 'Water, electricity, and basic infrastructure needs', 'Wrench', '#6366f1'),
('Youth Development', 'Sports, arts, and youth programs', 'Zap', '#8b5cf6'),
('Emergency Relief', 'Disaster relief and emergency assistance', 'AlertTriangle', '#dc2626'),
('Small Business', 'Supporting local entrepreneurs and businesses', 'Briefcase', '#059669')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);
