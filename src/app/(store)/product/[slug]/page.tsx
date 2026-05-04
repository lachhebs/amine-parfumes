import { notFound } from 'next/navigation';
import { getProducts, getProductBySlug } from '@/lib/queries';
import ProductDetailClient from './ProductDetailClient';
import type { Product } from '@/types';

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getProducts();
  return (products as Product[]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug) as Product | null;
  if (!product) return { title: 'Produit' };
  return {
    title: `${product.name_fr} – Amine Parfumes`,
    description: product.description_fr,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug) as Product | null;
  if (!product) notFound();

  const allProducts = await getProducts() as Product[];
  const related = allProducts
    .filter((p) => p.gender === product.gender && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
