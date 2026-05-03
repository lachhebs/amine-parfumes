import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import CatalogueClient from './CatalogueClient';

// Cache for 5 minutes
export const revalidate = 300;

export default async function CataloguePage() {
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
    // Suspense required because CatalogueClient calls useSearchParams()
    <Suspense fallback={
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--fg-muted)', fontSize: '0.8rem', letterSpacing: '0.2em' }}>
          Chargement...
        </p>
      </div>
    }>
      <CatalogueClient
        products={products || []}
        categories={categories || []}
      />
    </Suspense>
  );
}
