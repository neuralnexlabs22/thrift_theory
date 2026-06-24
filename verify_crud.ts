import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function runAudit() {
  console.log('--- STARTING SUPABASE CRUD AUDIT ---');

  let categoryId, brandId, productId, bundleId;

  try {
    // 1. Category Creation
    const catSlug = 'audit-cat-' + Date.now();
    console.log('Creating Category...');
    const { data: category, error: catErr } = await supabase
      .from('categories')
      .insert([{ name: 'Audit Category ' + Date.now(), slug: catSlug, description: 'Test', is_active: true }])
      .select()
      .single();
    
    if (catErr) throw catErr;
    categoryId = category.id;
    console.log('✅ Category creation works:', categoryId);

    // 2. Brand Creation
    console.log('Creating Brand...');
    const { data: brand, error: brandErr } = await supabase
      .from('brands')
      .insert([{ category_id: categoryId, name: 'Audit Brand ' + Date.now(), slug: 'audit-brand-' + Date.now(), is_active: true }])
      .select()
      .single();

    if (brandErr) throw brandErr;
    brandId = brand.id;
    console.log('✅ Brand creation works:', brandId);

    // 3. Product Creation
    console.log('Creating Product...');
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .insert([{
        name: 'Audit Product',
        slug: 'audit-prod-' + Date.now(),
        sku: 'AUDIT-' + Date.now(),
        original_price: 150,
        discount_price: 100,
        category_id: categoryId,
        brand_id: brandId,
        is_active: true
      }])
      .select()
      .single();

    if (prodErr) throw prodErr;
    productId = product.id;
    console.log('✅ Product creation works:', productId);

    // 4. Bundle Creation
    console.log('Creating Bundle...');
    const { data: bundle, error: bunErr } = await supabase
      .from('bundles')
      .insert([{
        name: 'Audit Bundle',
        description: 'Test',
        price: 200,
        items_count: 5,
        is_active: true
      }])
      .select()
      .single();

    if (bunErr) throw bunErr;
    bundleId = bundle.id;
    console.log('✅ Bundle creation works:', bundleId);

    // 5. Update Tests
    console.log('Testing Updates...');
    const { error: prodUpdateErr } = await supabase
      .from('products')
      .update({ name: 'Audit Product Updated' })
      .eq('id', productId);
    if (prodUpdateErr) throw prodUpdateErr;
    console.log('✅ Product update works');

    const { error: bundleUpdateErr } = await supabase
      .from('bundles')
      .update({ name: 'Audit Bundle Updated' })
      .eq('id', bundleId);
    if (bundleUpdateErr) throw bundleUpdateErr;
    console.log('✅ Bundle update works');

  } catch (err) {
    console.error('❌ CRUD OPERATION FAILED:', err);
  } finally {
    // 6. Cleanup (Deletion)
    console.log('Starting Cleanup (Deletions)...');
    if (bundleId) {
      const { error: delBundle } = await supabase.from('bundles').delete().eq('id', bundleId);
      if (delBundle) console.error('Delete Bundle error:', delBundle);
      else console.log('✅ Bundle deletion works');
    }

    if (productId) {
      const { error: delProd } = await supabase.from('products').delete().eq('id', productId);
      if (delProd) console.error('Delete Product error:', delProd);
      else console.log('✅ Product deletion works');
    }

    if (brandId) {
      const { error: delBrand } = await supabase.from('brands').delete().eq('id', brandId);
      if (delBrand) console.error('Delete Brand error:', delBrand);
      else console.log('✅ Brand deletion works');
    }

    if (categoryId) {
      const { error: delCat } = await supabase.from('categories').delete().eq('id', categoryId);
      if (delCat) console.error('Delete Category error:', delCat);
      else console.log('✅ Category deletion works');
    }
    
    console.log('✅✅✅ Full CRUD lifecycle script finished.');
  }
}

runAudit();
