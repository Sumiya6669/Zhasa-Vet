import { BlogPost, Order, Product } from '../types';
import { supabase } from './supabase';

type DbProduct = Product & { id: string | number; created_at?: string };
type DbOrder = Order & { id: string | number; created_at?: string };
type DbBlogPost = BlogPost & { id: string | number; created_at?: string };

function normalizeId<T extends { id: string | number }>(record: T) {
  return {
    ...record,
    id: String(record.id),
  };
}

function unwrapError(message: string, error: { message?: string } | null) {
  if (error) {
    throw new Error(error.message || message);
  }
}

export const api = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    unwrapError('Failed to fetch products', error);
    return (data ?? []).map((product: DbProduct) => normalizeId(product));
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    unwrapError('Failed to create product', error);
    return normalizeId(data as DbProduct);
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    unwrapError('Failed to delete product', error);
  },

  async createOrder(order: Partial<Order>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    unwrapError('Failed to create order', error);
    return normalizeId(data as DbOrder);
  },

  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    unwrapError('Failed to fetch orders', error);
    return (data ?? []).map((order: DbOrder) => normalizeId(order));
  },

  async getBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    unwrapError('Failed to fetch blog', error);
    return (data ?? []).map((post: DbBlogPost) => normalizeId(post));
  },

  async createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    unwrapError('Failed to create post', error);
    return normalizeId(data as DbBlogPost);
  },
};
