import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

interface Props { params: Promise<{ slug: string }> }

// Pre-generate all product pages at build time → instant load, zero SSR wait
export async function generateStaticParams() {
  const { data } = await supabase
    .from('products')
    .select('slug')
    .eq('is_active', true);
  return (data || []).map((p) => ({ slug: p.slug }));
}

// Re-validate every 5 minutes in the background
export const revalidate = 300;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  // Reuse the same fetch that ProductPage will make — Next.js deduplicates it
  const { data } = await supabase
    .from('products')
    .select('name_fr, description_fr')
    .eq('slug', slug)
    .single();
  if (!data) return { title: 'Produit' };
  return { title: `${data.name_fr} – Amine Parfumes`, description: data.description_fr };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  // Both queries run in parallel — not sequentially
  const [{ data: product }, ] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single(),
  ]);

  if (!product) notFound();

  // Only fetch related after we know the product's gender
  const { data: related } = await supabase
    .from('products')
    .select('id, name_fr, name_ar, brand, price, images, slug, gender, is_featured, is_new')
    .eq('is_active', true)
    .eq('gender', product.gender)
    .neq('id', product.id)
    .limit(4);

  return <ProductDetailClient product={product} related={related || []} />;
}
