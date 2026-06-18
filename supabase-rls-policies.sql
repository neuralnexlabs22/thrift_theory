-- Run this script in the Supabase SQL Editor to enable Row Level Security (RLS) and allow public read access.

-- 1. Enable RLS on all related tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist (to avoid conflicts when running multiple times)
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow public read access to product_images" ON product_images;
DROP POLICY IF EXISTS "Allow public read access to product_variants" ON product_variants;
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
DROP POLICY IF EXISTS "Allow public read access to brands" ON brands;

-- 3. Create policies for anonymous (public) reads
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Allow public read access to product_variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to brands" ON brands FOR SELECT USING (true);

-- 4. Create policies for inserts/updates
CREATE POLICY "Allow all operations for products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for product_images" ON product_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for product_variants" ON product_variants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for brands" ON brands FOR ALL USING (true) WITH CHECK (true);
