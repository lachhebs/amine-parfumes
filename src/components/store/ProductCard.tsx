'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLang } from '@/contexts/LangContext';
import { useCart } from '@/contexts/cartStore';
import type { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLang();
  const addItem = useCart((s) => s.addItem);

  const name = lang === 'ar' ? product.name_ar : product.name_fr;
  const isOut = product.stock <= 0;
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOut) return;
    addItem(product);
    toast.success(lang === 'ar' ? `${name} أُضيف للسلة` : `${name} ajouté au panier`);
  };

  return (
    <div className="product-card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)' }}>
      <Link href={`/product/${product.slug}`}>
        {/* Image */}
        <div className="card-img relative" style={{ aspectRatio: '3/4', background: 'var(--bg-raised)', overflow: 'hidden' }}>
          {product.thumbnail ? (
            <Image src={product.thumbnail} alt={name} fill className="object-cover"
              sizes="(max-width:768px) 50vw, 25vw" />
          ) : (
            /* Placeholder SVG bottle */
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 80 140" style={{ width: 64, opacity: 0.2 }}>
                <rect x="30" y="4" width="20" height="10" rx="3" fill="var(--gold-mid)"/>
                <rect x="32" y="14" width="16" height="14" rx="2" fill="var(--gold-mid)" opacity="0.7"/>
                <path d="M20 30 Q15 40 15 55 L15 125 Q15 132 22 132 L58 132 Q65 132 65 125 L65 55 Q65 40 60 30 Z"
                  fill="var(--gold-mid)" opacity="0.5"/>
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {product.is_new && (
              <span className="badge badge-purple">
                {lang === 'ar' ? 'جديد' : 'Nouveau'}
              </span>
            )}
            {discount && (
              <span className="badge badge-red">-{discount}%</span>
            )}
            {isOut && (
              <span className="badge badge-gray">
                {t('out_of_stock')}
              </span>
            )}
          </div>

          {/* Hover overlay */}
          <div className="overlay">
            <button onClick={handleAdd} disabled={isOut}
              className="btn-gold-filled flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.65rem' }}>
              <ShoppingBag size={12} />
              {t('add_to_cart')}
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '0.9rem 0.85rem 0.75rem' }}>
          {product.brand && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--gold-dark)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              {product.brand}
            </p>
          )}
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--fg-primary)', lineHeight: 1.2, marginBottom: '0.5rem', transition: 'color 0.2s' }}
            className="group-hover:text-[var(--gold-mid)]">
            {name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--gold-mid)', fontSize: '0.9rem' }}>
              {product.price.toFixed(2)} MAD
            </span>
            {product.original_price && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--fg-subtle)', textDecoration: 'line-through' }}>
                {product.original_price.toFixed(2)}
              </span>
            )}
          </div>
          {product.size_ml && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--fg-subtle)', marginTop: '0.25rem' }}>
              {product.size_ml} ml{product.concentration ? ` · ${product.concentration}` : ''}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
