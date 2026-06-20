const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function update() {
  console.log("Updating Drop Shoulder Shirt image...");

  const { data: product } = await supabase.from('products').select('id').eq('sku', 'CUSTOM-DROP-SHIRT').single();
  
  if (product) {
    await supabase.from('product_images')
      .update({ image_url: '/images/oversize_tshirt_blank.png' })
      .eq('product_id', product.id)
      .eq('is_main', true);
      
    // Rename to Oversize T-Shirt
    await supabase.from('products').update({ name: 'Premium Oversize T-Shirt' }).eq('id', product.id);
    
    console.log("Updated successfully!");
  } else {
    console.log("Product not found.");
  }
}

update().catch(console.error);
