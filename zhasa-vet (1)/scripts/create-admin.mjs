import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const adminKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = (process.env.ADMIN_EMAIL || 'admin@zhasavet.kz').trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !adminKey) {
  console.error('Missing VITE_SUPABASE_URL and an admin key (SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY).');
  process.exit(1);
}

if (!adminPassword || adminPassword.length < 6) {
  console.error('Set ADMIN_PASSWORD in your environment before running this script.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, adminKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function upsertAdmin() {
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    throw listError;
  }

  const existingUser = usersData.users.find(
    (user) => user.email?.trim().toLowerCase() === adminEmail,
  );

  if (existingUser) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password: adminPassword,
      email_confirm: true,
    });

    if (updateError) {
      throw updateError;
    }

    console.log(`Admin user updated: ${adminEmail}`);
    return;
  }

  const { error: createError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  });

  if (createError) {
    throw createError;
  }

  console.log(`Admin user created: ${adminEmail}`);
}

upsertAdmin().catch((error) => {
  console.error('Failed to create or update admin user.');
  console.error(error);
  process.exit(1);
});
