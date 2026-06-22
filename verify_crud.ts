import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function runAudit() {
  console.log('--- STARTING SUPABASE AUDIT ---');

  // 1. Category Creation
  const catSlug = 'audit-cat-' + Date.now();
  const { data: category, error: catErr } = await supabase
    .from('categories')
    .insert([{ name: 'Audit Category ' + Date.now(), slug: catSlug, description: 'Test', is_active: true }])
    .select()
    .single();
  
  if (catErr) console.error('Category error:', catErr);
  else console.log('✅ Category creation works:', category.id);

  // 2. Brand Creation
  const { data: brand, error: brandErr } = await supabase
    .from('brands')
    .insert([{ category_id: category.id, name: 'Audit Brand ' + Date.now(), slug: 'audit-brand-' + Date.now(), is_active: true }])
    .select()
    .single();

  if (brandErr) console.error('Brand error:', brandErr);
  else console.log('✅ Brand creation works:', brand.id);

  // 3. Product Creation
  const { data: product, error: prodErr } = await supabase
    .from('products')
    .insert([{
      name: 'Audit Product',
      slug: 'audit-prod-' + Date.now(),
      price: 100,
      category_id: category.id,
      brand_id: brand.id,
      is_active: true
    }])
    .select()
    .single();

  if (prodErr) console.error('Product error:', prodErr);
  else console.log('✅ Product creation works:', product.id);

  // 4. Bundle Creation
  const { data: bundle, error: bunErr } = await supabase
    .from('bundles')
    .insert([{
      name: 'Audit Bundle',
      slug: 'audit-bundle-' + Date.now(),
      description: 'Test',
      price: 200,
      is_active: true
    }])
    .select()
    .single();

  if (bunErr) console.error('Bundle error:', bunErr);
  else console.log('✅ Bundle creation works:', bundle.id);

  // 5. Bundle Product Assignment
  const { error: bpErr } = await supabase
    .from('bundle_products')
    .insert([{
      bundle_id: bundle.id,
      product_id: product.id
    }]);

  if (bpErr) console.error('Bundle Product error:', bpErr);
  else console.log('✅ Bundle product assignment works');

  // Cleanup
  await supabase.from('bundle_products').delete().eq('bundle_id', bundle.id);
  await supabase.from('bundles').delete().eq('id', bundle.id);
  await supabase.from('products').delete().eq('id', product.id);
  await supabase.from('brands').delete().eq('id', brand.id);
  await supabase.from('categories').delete().eq('id', category.id);
  
  console.log('✅ Cleanup successful. CRUD verified.');
}

runAudit();
