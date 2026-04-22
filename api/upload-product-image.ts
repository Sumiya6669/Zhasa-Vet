import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'product-images';
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

type UploadRequestBody = {
  fileName?: string;
  contentType?: string;
  base64Data?: string;
};

function getAdminKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
}

function getFileExtension(fileName: string, contentType: string) {
  const normalizedFileName = fileName.split('?')[0];
  const byName = normalizedFileName.includes('.') ? normalizedFileName.split('.').pop() : '';

  if (byName) {
    return byName.toLowerCase();
  }

  if (contentType === 'image/png') {
    return 'png';
  }

  if (contentType === 'image/webp') {
    return 'webp';
  }

  return 'jpg';
}

async function ensureBucketExists(supabase: ReturnType<typeof createClient>) {
  const { data: bucket, error } = await supabase.storage.getBucket(BUCKET_NAME);

  if (error && !error.message.toLowerCase().includes('not found')) {
    throw error;
  }

  if (!bucket) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ALLOWED_MIME_TYPES,
      fileSizeLimit: MAX_FILE_SIZE_BYTES,
    });

    if (
      createError &&
      !createError.message.toLowerCase().includes('already exists') &&
      !createError.message.toLowerCase().includes('duplicate')
    ) {
      throw createError;
    }

    return;
  }

  if (!bucket.public) {
    const { error: updateError } = await supabase.storage.updateBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ALLOWED_MIME_TYPES,
      fileSizeLimit: MAX_FILE_SIZE_BYTES,
    });

    if (updateError) {
      throw updateError;
    }
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseAdminKey = getAdminKey();

  if (!supabaseUrl || !supabaseAdminKey) {
    res.status(500).json({
      error:
        'Supabase server credentials are missing. Add VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY in Vercel.',
    });
    return;
  }

  const { fileName, contentType, base64Data } = (req.body || {}) as UploadRequestBody;

  if (!fileName || !contentType || !base64Data) {
    res.status(400).json({ error: 'Image payload is incomplete.' });
    return;
  }

  if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    res.status(400).json({ error: 'Unsupported image format.' });
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAdminKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    await ensureBucketExists(supabase);

    const fileBuffer = Buffer.from(base64Data, 'base64');

    if (!fileBuffer.length) {
      res.status(400).json({ error: 'Image file is empty.' });
      return;
    }

    if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
      res.status(400).json({ error: 'Image is too large. Maximum size is 5 MB.' });
      return;
    }

    const filePath = `products/${randomUUID()}.${getFileExtension(fileName, contentType)}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, fileBuffer, {
      cacheControl: '3600',
      contentType,
      upsert: false,
    });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error('Failed to get public URL for the uploaded image.');
    }

    res.status(200).json({ imageUrl: data.publicUrl });
  } catch (error: any) {
    res.status(500).json({
      error: error?.message || 'Failed to upload image to Supabase Storage.',
    });
  }
}
