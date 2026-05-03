-- ============================================
-- AMINE PARFUMES - Full Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  stock INT DEFAULT 0,
  sku TEXT UNIQUE,
  images TEXT[] DEFAULT '{}',
  thumbnail TEXT,
  -- Scent profile
  notes_top TEXT[],       -- Notes de tête
  notes_heart TEXT[],     -- Notes de cœur
  notes_base TEXT[],      -- Notes de fond
  gender TEXT CHECK (gender IN ('homme','femme','mixte')) DEFAULT 'mixte',
  size_ml INT,            -- e.g. 50, 100, 200
  concentration TEXT CHECK (concentration IN ('EDP','EDT','EDC','Parfum','Huile')),
  brand TEXT,             -- Marque / inspiré de
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  -- Customer info
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  -- Shipping address
  address_city TEXT NOT NULL,
  address_street TEXT NOT NULL,
  address_zip TEXT,
  address_notes TEXT,
  -- Order details
  items JSONB NOT NULL,  -- [{product_id, name, price, qty, image}]
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  -- Payment
  payment_method TEXT DEFAULT 'cash_on_delivery',
  -- Status
  status TEXT CHECK (status IN (
    'pending','confirmed','processing','shipped','delivered','cancelled','refunded'
  )) DEFAULT 'pending',
  -- Tracking
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDER STATUS HISTORY (for tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('shipping_cost', '{"standard": 30, "free_above": 500}'),
  ('hero_banner', '{"title_fr": "Créations d''Exception", "title_ar": "إبداعات استثنائية", "subtitle_fr": "Découvrez notre collection de parfums exclusifs", "subtitle_ar": "اكتشف مجموعتنا من العطور الحصرية"}'),
  ('contact', '{"phone": "+212 6XX XXX XXX", "email": "contact@amineparfumes.ma", "city": "Agadir, Maroc"}'),
  ('social', '{"instagram": "", "facebook": "", "whatsapp": ""}')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SEED CATEGORIES
-- ============================================
INSERT INTO categories (name_fr, name_ar, slug, description_fr, description_ar, sort_order) VALUES
  ('Parfums Homme', 'عطور رجالية', 'homme', 'Collection masculine d''exception', 'مجموعة رجالية استثنائية', 1),
  ('Parfums Femme', 'عطور نسائية', 'femme', 'Fragrances féminines raffinées', 'عطور نسائية راقية', 2),
  ('Mixte', 'عطور مختلطة', 'mixte', 'Parfums pour tous', 'عطور للجميع', 3),
  ('Sets & Packs', 'مجموعات وحزم', 'sets-packs', 'Nos packs exclusifs', 'حزمنا الحصرية', 4),
  ('Nouveautés', 'وصل حديثاً', 'nouveautes', 'Les dernières créations', 'أحدث الإبداعات', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- TRIGGERS: auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- AUTO ORDER NUMBER
-- ============================================
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'AP-' || LPAD(nextval('order_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Public can read active products and categories
CREATE POLICY "Public read products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (is_active = true);

-- Public can insert orders (place an order)
CREATE POLICY "Public create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Public can read settings
CREATE POLICY "Public read settings" ON settings
  FOR SELECT USING (true);

-- Authenticated (admin) can do everything
CREATE POLICY "Admin all products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin all categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin all orders" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin all settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin all order history" ON order_status_history
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKET for product images
-- ============================================
-- Run this in Supabase Dashboard > Storage > New Bucket
-- Name: "products"  Public: true
-- Or run via SQL:
INSERT INTO storage.buckets (id, name, public) 
  VALUES ('products', 'products', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Admin upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'products' AND auth.role() = 'authenticated'
  );

-- ============================================
-- ADD NEW CATEGORIES (run after initial setup)
-- ============================================
INSERT INTO categories (name_fr, name_ar, slug, description_fr, description_ar, sort_order) VALUES
  ('Dupes & Inspirations', 'بدائل وإلهامات', 'dupes', 'Nos inspirations des grandes maisons', 'إلهاماتنا من دور الأزياء الكبرى', 6),
  ('Décants & Échantillons', 'ديكانتات وعينات', 'decants', 'Testez avant d''acheter', 'جرب قبل أن تشتري', 7)
ON CONFLICT (slug) DO NOTHING;
