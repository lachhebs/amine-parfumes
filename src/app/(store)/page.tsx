import { supabase } from '@/lib/supabase';
import HomeClient from './HomeClient';

export const revalidate = 300;

export default async function HomePage() {
  const [{ data: featured }, { data: newProducts }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('products')
      .select('*')
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
