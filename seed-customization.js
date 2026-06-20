const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  // 1. Insert "Customization" category
  const categorySlug = 'customization';
  let { data: category } = await supabase.from('categories').select('*').eq('slug', categorySlug).maybeSingle();
  
  if (!category) {
    const { data: insertedCategories, error: catError } = await supabase.from('categories').insert({
      name: 'Customization',
      slug: categorySlug,
      description: 'Design your own premium clothing',
      is_active: true,
      display_order: 100
    }).select();
    
    if (catError) {
      console.error("Error inserting category:", catError);
      return;
    }
    category = insertedCategories[0];
    console.log("Inserted Customization category:", category.id);
  } else {
    console.log("Customization category already exists:", category.id);
  }

  // 2. Insert "ThriftTheory" brand (if not exists)
  const brandSlug = 'thrifttheory';
  let { data: brand } = await supabase.from('brands').select('*').eq('slug', brandSlug).maybeSingle();
  
  if (!brand) {
    const { data: insertedBrands, error: brandError } = await supabase.from('brands').insert({
      category_id: category.id,
      name: 'ThriftTheory',
      slug: brandSlug,
      description: 'Our in-house premium blanks',
      is_active: true,
      display_order: 1
    }).select();
    
    if (brandError) {
      console.error("Error inserting brand:", brandError);
      return;
    }
    brand = insertedBrands[0];
    console.log("Inserted ThriftTheory brand:", brand.id);
  } else {
    console.log("ThriftTheory brand already exists:", brand.id);
  }

  // 3. Insert "Premium Custom White Tee" product
  const productSlug = 'premium-custom-white-tee';
  let { data: product } = await supabase.from('products').select('*').eq('slug', productSlug).maybeSingle();
  
  if (!product) {
    const { data: insertedProducts, error: prodError } = await supabase.from('products').insert({
      category_id: category.id,
      brand_id: brand.id,
      name: 'Premium Custom White Tee',
      slug: productSlug,
      sku: 'CUSTOM-TEE-WHT',
      short_description: 'Drag and drop your design to customize this premium blank tee.',
      full_description: 'Made from 100% heavyweight cotton. Use our customizer tool to add your own graphic to the front. Perfect for unique 1-of-1 pieces.',
      original_price: 1500,
      discount_price: 1299,
      is_active: true,
      featured: true,
      gender: 'Unisex',
      product_type: 'clothing',
      collection: 'Custom'
    }).select();
    
    if (prodError) {
      console.error("Error inserting product:", prodError);
      return;
    }
    product = insertedProducts[0];
    console.log("Inserted Product:", product.id);

    // 4. Insert image for the product
    // Image of a blank white shirt:
    const imageUrl = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx3aGl0ZSUyMHRzaGlydHxlbnwwfHx8fDE3MTUyMTMyNDN8MA&ixlib=rb-4.0.3&q=80&w=1080';
    
    await supabase.from('product_images').insert({
      product_id: product.id,
      image_url: imageUrl,
      display_order: 1,
      is_primary: true
    });
    console.log("Inserted Image");

    // 5. Insert variants (sizes)
    const sizes = ['S', 'M', 'L', 'XL'];
    for (const size of sizes) {
      await supabase.from('product_variants').insert({
        product_id: product.id,
        size: size,
        color: 'White',
        stock_quantity: 100,
        sku: `CUSTOM-WHT-${size}`
      });
    }
    console.log("Inserted Variants");
  } else {
    console.log("Product already exists:", product.id);
  }
}

seed();
