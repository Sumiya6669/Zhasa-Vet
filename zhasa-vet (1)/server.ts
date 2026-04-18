import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Supabase Service Role Client (for admin bypass)
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  
  // Lazy-init Supabase to prevent crash if URL is missing at startup
  let _supabase: any = null;
  const getSupabase = () => {
    if (!_supabase) {
      if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
        throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.');
      }
      _supabase = createClient(supabaseUrl, supabaseKey);
    }
    return _supabase;
  };

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // Products
  app.get('/api/products', async (req, res) => {
    try {
      const { data, error } = await getSupabase()
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/products', async (req, res) => {
    try {
      const { data, error } = await getSupabase()
        .from('products')
        .insert([req.body])
        .select();
      
      if (error) return res.status(500).json({ error: error.message });
      res.status(201).json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await getSupabase()
        .from('products')
        .update(req.body)
        .match({ id })
        .select();
      
      if (error) return res.status(500).json({ error: error.message });
      res.json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = await getSupabase()
        .from('products')
        .delete()
        .match({ id });
      
      if (error) return res.status(500).json({ error: error.message });
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Orders
  app.get('/api/orders', async (req, res) => {
    try {
      const { data, error } = await getSupabase()
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const { data, error } = await getSupabase()
        .from('orders')
        .insert([req.body])
        .select();
      
      if (error) return res.status(500).json({ error: error.message });
      res.status(201).json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/orders/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await getSupabase()
        .from('orders')
        .update(req.body)
        .match({ id })
        .select();
      
      if (error) return res.status(500).json({ error: error.message });
      res.json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Blog
  app.get('/api/blog', async (req, res) => {
    try {
      const { data, error } = await getSupabase()
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/blog', async (req, res) => {
    try {
      const { data, error } = await getSupabase()
        .from('blog_posts')
        .insert([req.body])
        .select();
      
      if (error) return res.status(500).json({ error: error.message });
      res.status(201).json(data[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Vite / Static Handling ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
