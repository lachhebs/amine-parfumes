import { getProducts, getCategories } from '@/lib/queries';
import HomeClient from './HomeClient';
import type { Product, Category } from '@/types';

export const revalidate = 300;

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const featured = (products as Product[]).filter((p) => p.is_featured).slice(0, 8);
  const newProducts = (products as Product[]).filter((p) => p.is_new).slice(0, 4);

  return (
    <HomeClient
      featured={featured}
      newProducts={newProducts}
      categories={categories as Category[]}
    />
  );
}
