import { supabase } from '@/lib/supabase';
import CatalogueClient from './CatalogueClient';

// Cache for 5 minutes — products don't change that often
export const revalidate = 300;

export default async function CataloguePage() {
  // Fetch EVERYTHING once — filtering is done client-side (instant)
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
  ]);

  return (
    <CatalogueClient
      products={products || []}
      categories={categories || []}
    />
  );
}
