import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import type { Product } from '@/types';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const { data } = await supabase
    .from('products')
    .select('slug')
    .eq('is_active', true);
  return (data || []).map((p) => ({ slug: p.slug }));
}

export const revalidate = 300;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
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

  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!product) notFound();

  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('gender', product.gender)
    .neq('id', product.id)
    .limit(4);

  return <ProductDetailClient product={product as Product} related={(related || []) as Product[]} />;
}
