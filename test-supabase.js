const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://abuacykxsevzsddlkvgq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFidWFjeWt4c2V2enNkZGxrdmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NzM3ODYsImV4cCI6MjA5NzQ0OTc4Nn0.tSdPBRjYTQ7hAFS8rDW2hz8kMX-78AE5d84Pm6L7M0E'
);

async function testFetch() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      discount_price,
      original_price,
      featured,
      full_description,
      short_description,
      tags,
      brands ( name ),
      categories ( slug ),
      product_images ( image_url, display_order ),
      product_variants ( size, color, stock_quantity )
    `);

  console.log("Fetch Error:", error);
  console.log("Fetch Data Length:", data?.length);
  if (data?.length) {
    console.log("First Row:", JSON.stringify(data[0], null, 2));
  }
}

testFetch();
