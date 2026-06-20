-- ==============================================================================
-- THRIFT THEORY: BUNDLES & CUSTOMIZER MIGRATION
-- Please run this script in your Supabase SQL Editor.
-- ==============================================================================

-- 1. BUNDLES SYSTEM
CREATE TABLE IF NOT EXISTS public.bundles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    items_count integer NOT NULL DEFAULT 1,
    image_url text,
    is_active boolean DEFAULT true,
    sizes jsonb DEFAULT '["S", "M", "L", "XL"]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.bundle_products (
    bundle_id uuid REFERENCES public.bundles(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    PRIMARY KEY (bundle_id, product_id)
);

-- 2. CUSTOMIZER SYSTEM (MOCKUPS & COLORS)
CREATE TABLE IF NOT EXISTS public.custom_clothing_types (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL, -- e.g., 'T-Shirt', 'Oversized Tee', 'Hoodie'
    base_image_url text NOT NULL, -- The blank mockup image
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.custom_colors (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL, -- e.g., 'White', 'Black', 'Red'
    hex_code text NOT NULL, -- e.g., '#FFFFFF'
    is_active boolean DEFAULT true
);

-- 3. CUSTOM ORDERS
CREATE TABLE IF NOT EXISTS public.custom_orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name text NOT NULL,
    phone text NOT NULL,
    email text,
    clothing_type_id uuid REFERENCES public.custom_clothing_types(id),
    color_id uuid REFERENCES public.custom_colors(id),
    size text NOT NULL,
    quantity integer NOT NULL DEFAULT 1,
    placement text NOT NULL, -- e.g., 'Front Center'
    notes text,
    design_url text NOT NULL, -- The URL to the uploaded design
    status text DEFAULT 'Pending', -- 'Pending', 'WhatsApp Sent', 'In Review', 'Approved', 'In Production', 'Completed'
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 4. RLS POLICIES
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_clothing_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to bundles and customizer assets
CREATE POLICY "Allow public read access to bundles" ON public.bundles FOR SELECT USING (true);
CREATE POLICY "Allow public read access to bundle_products" ON public.bundle_products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to custom_clothing_types" ON public.custom_clothing_types FOR SELECT USING (true);
CREATE POLICY "Allow public read access to custom_colors" ON public.custom_colors FOR SELECT USING (true);

-- Allow public to INSERT custom orders
CREATE POLICY "Allow public insert to custom_orders" ON public.custom_orders FOR INSERT WITH CHECK (true);
-- Allow public to READ their own order? (Usually handled via server or anon just needs insert)
-- For now, let's allow all operations for admin/anon to keep it simple, similar to existing setup:
CREATE POLICY "Allow all operations for bundles" ON public.bundles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for bundle_products" ON public.bundle_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for custom_clothing_types" ON public.custom_clothing_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for custom_colors" ON public.custom_colors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for custom_orders" ON public.custom_orders FOR ALL USING (true) WITH CHECK (true);


-- 5. INITIAL SEED DATA FOR CUSTOMIZER
INSERT INTO public.custom_colors (name, hex_code)
VALUES 
    ('White', '#FFFFFF'),
    ('Black', '#1A1A1A'),
    ('Grey', '#808080'),
    ('Red', '#C8102E'),
    ('Blue', '#0033A0'),
    ('Green', '#00563F')
ON CONFLICT DO NOTHING;

-- Storage buckets need to be created via the Supabase Dashboard -> Storage.
-- Please create two public buckets: 
-- 1. "custom-designs"
-- 2. "clothing-mockups"
