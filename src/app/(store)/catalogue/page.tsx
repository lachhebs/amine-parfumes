import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/queries';
import CatalogueClient from './CatalogueClient';
import type { Product, Category } from '@/types';

export const revalidate = 300;

export default async function CataloguePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--fg-muted)', fontSize: '0.8rem', letterSpacing: '0.2em' }}>
          Chargement...
        </p>
      </div>
    }>
      <CatalogueClient
        products={products as Product[]}
        categories={categories as Category[]}
      />
    </Suspense>
  );
}
