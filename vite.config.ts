import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const anonKey = env.VITE_SUPABASE_ANON_KEY?.trim() || '';

  if (anonKey.startsWith('sb_secret_') || anonKey.startsWith('service_role')) {
    throw new Error(
      'VITE_SUPABASE_ANON_KEY must contain the public Supabase anon key, not a secret key.',
    );
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined;
            }

            if (id.includes('@supabase')) {
              return 'supabase';
            }

            if (id.includes('react-router')) {
              return 'router';
            }

            if (id.includes('motion')) {
              return 'motion';
            }

            if (id.includes('lucide-react')) {
              return 'icons';
            }

            if (id.includes('react')) {
              return 'react-vendor';
            }

            return 'vendor';
          },
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
