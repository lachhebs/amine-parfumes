import { unstable_cache } from 'next/cache';
import { supabase } from './supabase';

// Cache all products for 5 minutes — reused across ALL pages
export const getProducts = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return data || [];
  },
  ['all-products'],
  { revalidate: 300, tags: ['products'] }
);

export const getCategories = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    return data || [];
  },
  ['all-categories'],
  { revalidate: 300, tags: ['categories'] }
);

export const getProductBySlug = unstable_cache(
  async (slug: string) => {
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    return data || null;
  },
  ['product-by-slug'],
  { revalidate: 300, tags: ['products'] }
);
