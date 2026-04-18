import { BlogPost, BlogPostInput, Order, Product, ProductInput } from '../types';
import { supabase } from './supabase';

type DbRecord = { id: string | number; created_at?: string };

function normalizeId<T extends DbRecord>(record: T) {
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
    return (data ?? []).map((product: Product & DbRecord) => normalizeId(product));
  },

  async createProduct(product: ProductInput): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    unwrapError('Failed to create product', error);
    return normalizeId(data as Product & DbRecord);
  },

  async updateProduct(id: string, product: ProductInput): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    unwrapError('Failed to update product', error);
    return normalizeId(data as Product & DbRecord);
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    unwrapError('Failed to delete product', error);
  },

  async createOrder(order: Partial<Order>): Promise<void> {
    const { error } = await supabase.from('orders').insert([order]);
    unwrapError('Failed to create order', error);
  },

  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    unwrapError('Failed to fetch orders', error);
    return (data ?? []).map((order: Order & DbRecord) => normalizeId(order));
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    unwrapError('Failed to update order status', error);
  },

  async getBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    unwrapError('Failed to fetch blog posts', error);
    return (data ?? []).map((post: BlogPost & DbRecord) => normalizeId(post));
  },

  async createBlogPost(post: BlogPostInput): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    unwrapError('Failed to create blog post', error);
    return normalizeId(data as BlogPost & DbRecord);
  },

  async updateBlogPost(id: string, post: BlogPostInput): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(post)
      .eq('id', id)
      .select()
      .single();

    unwrapError('Failed to update blog post', error);
    return normalizeId(data as BlogPost & DbRecord);
  },

  async deleteBlogPost(id: string): Promise<void> {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    unwrapError('Failed to delete blog post', error);
  },
};
