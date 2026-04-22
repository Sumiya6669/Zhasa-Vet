import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAdminKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const bucketName = 'product-images';
const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const fileSizeLimit = 5 * 1024 * 1024;

if (!supabaseUrl || !supabaseAdminKey) {
  console.error(
    'Missing VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY in .env.local',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAdminKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data: existingBucket, error: getError } = await supabase.storage.getBucket(bucketName);

if (getError && !getError.message.toLowerCase().includes('not found')) {
  console.error('Failed to inspect storage bucket:', getError.message);
  process.exit(1);
}

if (!existingBucket) {
  const { error: createError } = await supabase.storage.createBucket(bucketName, {
    public: true,
    allowedMimeTypes,
    fileSizeLimit,
  });

  if (createError) {
    console.error('Failed to create storage bucket:', createError.message);
    process.exit(1);
  }

  console.log(`Bucket "${bucketName}" created successfully.`);
  process.exit(0);
}

const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
  public: true,
  allowedMimeTypes,
  fileSizeLimit,
});

if (updateError) {
  console.error('Failed to update storage bucket:', updateError.message);
  process.exit(1);
}

console.log(`Bucket "${bucketName}" already existed and was updated successfully.`);
