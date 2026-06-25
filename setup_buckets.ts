import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const buckets = [
  "product-images",
  "category-images",
  "brand-logos",
  "brand-banners",
  "clothing-mockups",
  "bundle-images",
  "custom-designs"
];

async function setupBuckets() {
  console.log("Starting bucket setup...");

  for (const bucket of buckets) {
    console.log(`Checking bucket: ${bucket}...`);
    const { data: existingBucket, error: getError } = await supabase.storage.getBucket(bucket);
    
    if (getError && getError.message.includes('not found')) {
      console.log(`Creating bucket: ${bucket}...`);
      const { data, error } = await supabase.storage.createBucket(bucket, {
        public: true,
        allowedMimeTypes: ['image/*'],
      });
      if (error) {
        console.error(`Error creating bucket ${bucket}:`, error.message);
      } else {
        console.log(`✅ Bucket ${bucket} created successfully.`);
      }
    } else if (existingBucket) {
      console.log(`✅ Bucket ${bucket} already exists.`);
      
      // Ensure it is public just in case
      await supabase.storage.updateBucket(bucket, {
        public: true,
        allowedMimeTypes: ['image/*'],
      });
    } else if (getError) {
      console.error(`Error checking bucket ${bucket}:`, getError.message);
    }
  }

  console.log("Bucket setup complete!");
}

setupBuckets();
