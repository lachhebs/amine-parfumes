import { supabase } from '@/lib/supabase';
import HomeClient from './HomeClient';

// Cache home page for 5 minutes
export const revalidate = 300;

export default async function HomePage() {
  // Select only the columns ProductCard actually needs — less data over the wire
  const productFields = 'id, name_fr, name_ar, brand, price, images, slug, gender, is_featured, is_new, stock';

  const [{ data: featured }, { data: newProducts }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select(productFields)
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('products')
      .select(productFields)
      .eq('is_new', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(4),
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
  ]);

  return (
    <HomeClient
      featured={featured || []}
      newProducts={newProducts || []}
      categories={categories || []}
    />
  );
}
