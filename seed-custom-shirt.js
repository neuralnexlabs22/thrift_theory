const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding Drop Shoulder Shirt...");

  // 1. Get or create category
  let categoryId;
  const { data: catData } = await supabase.from('categories').select('id').ilike('name', 'Customization').single();
  if (catData) {
    categoryId = catData.id;
  } else {
    const { data: newCat } = await supabase.from('categories').insert({ name: 'Customization', slug: 'customization', description: 'Custom products' }).select().single();
    categoryId = newCat.id;
  }

  // 2. Get or create brand
  let brandId;
  const { data: brandData } = await supabase.from('brands').select('id').ilike('name', 'ThriftTheory').single();
  if (brandData) {
    brandId = brandData.id;
  } else {
    const { data: newBrand } = await supabase.from('brands').insert({ name: 'ThriftTheory', slug: 'thrifttheory', category_id: categoryId }).select().single();
    brandId = newBrand.id;
  }

  // 3. Create Product
  const { data: product, error } = await supabase.from('products').insert({
    name: 'Drop Shoulder Shirt',
    slug: 'drop-shoulder-shirt-custom',
    sku: 'CUSTOM-DROP-SHIRT',
    short_description: 'Premium drop shoulder shirt for your custom designs.',
    full_description: 'Transform your artwork into premium streetwear. We print on luxury heavyweight blanks designed for the perfect oversized fit.',
    category_id: categoryId,
    brand_id: brandId,
    original_price: 1500,
    discount_price: 1500,
    featured: true,
    is_active: true
  }).select().single();

  if (error) {
    console.error("Error creating product:", error);
    return;
  }
  const productId = product.id;

  // 4. Images (Use the mockup image we have, e.g. /images/hero.png or base url)
  await supabase.from('product_images').insert([
    { product_id: productId, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80', display_order: 0, is_main: true }
  ]);

  // 5. Variants (Sizes & Colors)
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['White', 'Black', 'Cream'];
  const variants = [];
  let i = 0;
  for (const s of sizes) {
    for (const c of colors) {
      variants.push({
        product_id: productId,
        size: s,
        color: c,
        sku: `CUSTOM-DROP-SHIRT-${s}-${c}`,
        stock_quantity: 100,
        stock_status: 'in_stock'
      });
    }
  }
  await supabase.from('product_variants').insert(variants);

  console.log("Seeded Drop Shoulder Shirt successfully!");
}

seed().catch(console.error);
