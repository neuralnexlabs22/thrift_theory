-- 1. Bundles Table
CREATE TABLE IF NOT EXISTS bundles (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  items_count integer not null default 1,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Bundle Products Mapping Table
-- (This allows assigning multiple products to one bundle)
CREATE TABLE IF NOT EXISTS bundle_products (
  bundle_id uuid references bundles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (bundle_id, product_id)
);

-- 3. Custom Clothing Types Table
-- (Stores the blank mockups like Drop Shoulder Tee, Hoodie, etc.)
CREATE TABLE IF NOT EXISTS custom_clothing_types (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  base_image_url text not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Custom Colors Table
-- (Stores the hex codes for live color tinting)
CREATE TABLE IF NOT EXISTS custom_colors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  hex_code text not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Custom Orders Table
-- (Stores the details of custom requests submitted by customers)
CREATE TABLE IF NOT EXISTS custom_orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  phone text not null,
  email text,
  clothing_type_id uuid references custom_clothing_types(id) on delete set null,
  color_id uuid references custom_colors(id) on delete set null,
  size text not null,
  quantity integer default 1,
  placement text not null,
  notes text,
  design_url text,
  status text default 'Pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: RLS is disabled by default, matching your existing 001_create_content_tables.sql setup.
-- If you choose to enable RLS in the future, you can add policies here.
