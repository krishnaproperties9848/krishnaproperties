-- Create brochures table for property listings
CREATE TABLE IF NOT EXISTS brochures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'few_left', 'sold_out', 'coming_soon')),
  is_featured BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0,
  budget_min BIGINT,
  budget_max BIGINT,
  price_per_sqyard_min INTEGER,
  price_per_sqyard_max INTEGER,
  plot_size_min INTEGER,
  plot_size_max INTEGER,
  investment_intents TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  why_invest TEXT[] DEFAULT '{}',
  cover_image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  files JSONB DEFAULT '[]',
  videos JSONB DEFAULT '[]',
  views_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  phone_override TEXT,
  whatsapp_override TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_brochures_region ON brochures(region);
CREATE INDEX IF NOT EXISTS idx_brochures_status ON brochures(status);
CREATE INDEX IF NOT EXISTS idx_brochures_is_featured ON brochures(is_featured);
CREATE INDEX IF NOT EXISTS idx_brochures_is_published ON brochures(is_published);
CREATE INDEX IF NOT EXISTS idx_brochures_priority ON brochures(priority DESC);
CREATE INDEX IF NOT EXISTS idx_brochures_budget ON brochures(budget_min, budget_max);
CREATE INDEX IF NOT EXISTS idx_brochures_slug ON brochures(slug);

-- Composite index for filtered queries
CREATE INDEX IF NOT EXISTS idx_brochures_region_status_priority ON brochures(region, status, priority DESC);

-- Enable RLS
ALTER TABLE brochures ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published brochures
CREATE POLICY "Public can read published brochures" ON brochures
  FOR SELECT USING (is_published = TRUE);

-- Policy: Authenticated users can manage brochures (for admin)
CREATE POLICY "Authenticated users can manage brochures" ON brochures
  FOR ALL USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_brochures_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_brochures_updated_at ON brochures;
CREATE TRIGGER trigger_brochures_updated_at
  BEFORE UPDATE ON brochures
  FOR EACH ROW
  EXECUTE FUNCTION update_brochures_updated_at();

-- Insert sample data
INSERT INTO brochures (title, slug, location, region, status, is_featured, priority, budget_min, budget_max, price_per_sqyard_min, price_per_sqyard_max, plot_size_min, plot_size_max, highlights, amenities, why_invest, is_published) VALUES
('Lake View Residency', 'lake-view-residency', 'Mumbai Highway', 'East Hyderabad', 'few_left', true, 100, 4000000, 16800000, 20000, 28000, 200, 600, ARRAY['Lake Facing Plots', 'Premium Location', 'Investment Grade', 'Easy EMI Options'], ARRAY['HMDA Approved', 'Gated Community', '24/7 Security', 'Wide Roads'], ARRAY['20%+ annual appreciation potential', 'Strategic location near ORR', 'Bank loan assistance available'], true),
('Sunrise Meadows', 'sunrise-meadows', 'Nagpur Highway', 'East Hyderabad', 'available', true, 90, 2505000, 10000000, 15000, 20000, 167, 500, ARRAY['LP Approved', 'Avenue Plantation', 'Underground Drainage', 'Street Lights'], ARRAY['DTCP Approved', 'Clear Title', 'Avenue Plantation', 'Underground Drainage'], ARRAY['High growth corridor', 'Near proposed metro station', 'Excellent road connectivity'], true),
('Krishna Gardens', 'krishna-gardens', 'Pocharam', 'East Hyderabad', 'available', true, 80, 2640000, 9000000, 22000, 30000, 120, 300, ARRAY['HMDA Layout', 'Corner Plots Available', 'Near IT Corridor', 'Parks & Amenities'], ARRAY['HMDA Approved', 'Near IT Corridor', 'Gated Community', 'Park View'], ARRAY['IT corridor proximity', 'Established neighborhood', 'Strong rental demand'], true),
('Green Valley Phase 2', 'green-valley-phase2', 'Warangal Highway', 'Warangal', 'available', false, 70, 2400000, 7200000, 12000, 18000, 200, 400, ARRAY['Clear Title', 'Wide Roads', 'Near NH-163', 'Water Connection'], ARRAY['Clear Title', 'Wide Roads', 'Water Connection'], ARRAY['Emerging investment destination', 'Affordable entry point', 'Infrastructure development ongoing'], true),
('Sri Lakshmi Enclave', 'sri-lakshmi-enclave', 'Srisailam Highway', 'East Hyderabad', 'available', false, 60, 2700000, 12500000, 18000, 25000, 150, 500, ARRAY['DTCP Approved', 'Near ORR Exit', 'Gated Community', '24/7 Security'], ARRAY['DTCP Approved', 'Gated Community', '24/7 Security', 'Near ORR'], ARRAY['Prime location near ORR', 'Approved layout', 'Strong appreciation history'], true)
ON CONFLICT (slug) DO NOTHING;
