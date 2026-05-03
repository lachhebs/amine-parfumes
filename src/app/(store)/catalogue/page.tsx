import { supabase } from '@/lib/supabase';
import CatalogueClient from './CatalogueClient';

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ category?: string; gender?: string; search?: string; featured?: string }>;
}

export default async function CataloguePage({ searchParams }: Props) {
  const sp = await searchParams;

  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (sp.gender && ['homme', 'femme', 'mixte'].includes(sp.gender)) {
    query = query.eq('gender', sp.gender);
  }
  if (sp.featured === 'true') {
    query = query.eq('is_featured', true);
  }
  if (sp.search) {
    query = query.or(
      `name_fr.ilike.%${sp.search}%,name_ar.ilike.%${sp.search}%,brand.ilike.%${sp.search}%`
    );
  }

  const [{ data: products }, { data: categories }] = await Promise.all([
    query,
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
  ]);

  return (
    <CatalogueClient
      products={products || []}
      categories={categories || []}
      filters={sp}
    />
  );
}
