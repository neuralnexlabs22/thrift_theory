const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFk() {
  const { data, error } = await supabase.rpc('get_foreign_keys');
  if (error) {
    // try querying pg_constraint directly using raw SQL if possible, but PostgREST doesn't support arbitrary SQL.
    console.log("RPC error, trying to insert a dummy product to see foreign keys");
  } else {
    console.log("Foreign keys:", data);
  }
  
  // Since we don't have RPC, let's try an easier way: fetch a product and look at its fields.
  const { data: products } = await supabase.from('products').select('*').limit(1);
  console.log("Product schema:", products && products.length ? Object.keys(products[0]) : "No products");
  
  // Try deleting a category that has products!
  // First, find a category that has products.
  if (products && products.length) {
    const p = products[0];
    console.log("Product has category field:", p.category);
    // Is `category` a UUID or string?
    console.log("Category field type:", typeof p.category, p.category);
  }
}

checkFk();
