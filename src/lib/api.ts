import { BlogPost, BlogPostInput, Order, Product, ProductInput } from '../types';
import { BLOG_CONTENT_OVERRIDES, PRODUCT_CONTENT_OVERRIDES } from '../mockData';
import { supabase } from './supabase';

type DbRecord = { id: string | number; created_at?: string };
const PRODUCT_IMAGE_BUCKET = 'product-images';

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

function mergeProductContent(product: Product) {
  if (!product.article) {
    return product;
  }

  return {
    ...product,
    ...PRODUCT_CONTENT_OVERRIDES[product.article],
  };
}

function mergeBlogContent(post: BlogPost) {
  if (!post.slug) {
    return post;
  }

  return {
    ...post,
    ...BLOG_CONTENT_OVERRIDES[post.slug],
  };
}

function getFileExtension(fileName: string) {
  const sanitizedName = fileName.split('?')[0];
  const extension = sanitizedName.includes('.') ? sanitizedName.split('.').pop() : 'jpg';
  return extension || 'jpg';
}

function createStoragePath(file: File) {
  const uniqueId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;

  return `products/${uniqueId}.${getFileExtension(file.name)}`;
}

export const api = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    unwrapError('Failed to fetch products', error);
    return (data ?? [])
      .map((product: Product & DbRecord) => normalizeId(product))
      .map(mergeProductContent);
  },

  async createProduct(product: ProductInput): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    unwrapError('Failed to create product', error);
    return mergeProductContent(normalizeId(data as Product & DbRecord));
  },

  async updateProduct(id: string, product: ProductInput): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    unwrapError('Failed to update product', error);
    return mergeProductContent(normalizeId(data as Product & DbRecord));
  },

  async uploadProductImage(file: File): Promise<string> {
    const storagePath = createStoragePath(file);
    const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });

    if (error) {
      throw new Error(
        error.message ||
          'Failed to upload product image. Make sure product-images bucket exists in Supabase Storage.',
      );
    }

    const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(storagePath);

    if (!data?.publicUrl) {
      throw new Error('Failed to get public URL for product image.');
    }

    return data.publicUrl;
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
    return (data ?? [])
      .map((post: BlogPost & DbRecord) => normalizeId(post))
      .map(mergeBlogContent);
  },

  async createBlogPost(post: BlogPostInput): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    unwrapError('Failed to create blog post', error);
    return mergeBlogContent(normalizeId(data as BlogPost & DbRecord));
  },

  async updateBlogPost(id: string, post: BlogPostInput): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(post)
      .eq('id', id)
      .select()
      .single();

    unwrapError('Failed to update blog post', error);
    return mergeBlogContent(normalizeId(data as BlogPost & DbRecord));
  },

  async deleteBlogPost(id: string): Promise<void> {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    unwrapError('Failed to delete blog post', error);
  },
};
