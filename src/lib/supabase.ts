import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const hasSecretSupabaseKey =
  supabaseAnonKey.startsWith('sb_secret_') || supabaseAnonKey.startsWith('service_role');

if (hasSecretSupabaseKey) {
  console.error(
    'VITE_SUPABASE_ANON_KEY contains a secret Supabase key. Replace it with the public anon key and rebuild.',
  );
}

// Only initialize the client if we have valid credentials to prevent startup crash
// If keys are missing, we export a proxy that logs a helpful error when used
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http') && !hasSecretSupabaseKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get: (_target, prop) => {
        if (prop === 'auth') {
          return {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signInWithPassword: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
            signUp: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
            signOut: () => Promise.resolve({ error: null }),
            getUser: () => Promise.resolve({ data: { user: null } }),
          };
        }
        if (prop === 'storage') {
          return {
            createBucket: () =>
              Promise.resolve({
                data: null,
                error: new Error('Supabase not configured'),
              }),
            from: () => ({
              upload: () =>
                Promise.resolve({
                  data: null,
                  error: new Error('Supabase not configured'),
                }),
              getPublicUrl: () => ({
                data: { publicUrl: '' },
              }),
            }),
          };
        }
        console.warn(
          hasSecretSupabaseKey
            ? 'Supabase is blocked because VITE_SUPABASE_ANON_KEY contains a secret key. Use the public anon key.'
            : 'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.',
        );
        return () => ({
          from: () => ({
            select: () => Promise.resolve({ data: [], error: null }),
            insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
            order: () => Promise.resolve({ data: [], error: null }),
            eq: () => Promise.resolve({ data: [], error: null }),
            match: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
            delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          }),
        });
      }
    });

export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey &&
  !hasSecretSupabaseKey
);
