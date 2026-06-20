const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://abuacykxsevzsddlkvgq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFidWFjeWt4c2V2enNkZGxrdmdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTg3Mzc4NiwiZXhwIjoyMDk3NDQ5Nzg2fQ.QhDMUiBkvgiZNddox75_IWaPxm7v5CJQFhJ1e-wK33Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDelete() {
  const { data: categories } = await supabase.from('categories').select('id, name');
  if (!categories || categories.length === 0) {
    console.log('No categories to delete');
    return;
  }
  const target = categories[0];
  console.log(`Attempting to delete category: ${target.name} (${target.id})`);
  
  const { error } = await supabase.from('categories').delete().eq('id', target.id);
  
  if (error) {
    console.log('Delete Error:');
    console.log('Code:', error.code);
    console.log('Message:', error.message);
    console.log('Details:', error.details);
    console.log('Hint:', error.hint);
    console.log('Full object keys:', Object.keys(error));
  } else {
    console.log('Delete successful');
  }
}

testDelete();
