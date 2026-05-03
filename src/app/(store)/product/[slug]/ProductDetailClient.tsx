'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { useCart } from '@/contexts/cartStore';
import ProductCard from '@/components/store/ProductCard';
import type { Product } from '@/types';

export default function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { lang, t } = useLang();
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);

  const name = lang === 'ar' ? product.name_ar : product.name_fr;
  const desc = lang === 'ar' ? product.description_ar : product.description_fr;
  const images = product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : [];
  const isOutOfStock = product.stock <= 0;

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(lang === 'ar' ? `${name} أُضيف للسلة` : `${name} ajouté au panier`);
  };

  const noteLabels = {
    top: t('notes_top'),
    heart: t('notes_heart'),
    base: t('notes_base'),
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-10 font-body text-xs text-cream/30">
          <Link href="/" className="hover:text-gold-400 transition-colors">{t('nav_home')}</Link>
          <span>/</span>
          <Link href="/catalogue" className="hover:text-gold-400 transition-colors">{t('nav_catalogue')}</Link>
          <span>/</span>
          <span className="text-cream/60">{name}</span>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div>
            <div className="relative aspect-square overflow-hidden bg-navy-800 mb-4">
              {images[selectedImg] ? (
                <Image
                  src={images[selectedImg]}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-10">🌹</div>
              )}
              {product.is_new && (
                <span className="absolute top-4 left-4 bg-gold-600 text-navy-900 text-[10px] 
                                 font-semibold tracking-wider px-3 py-1 uppercase">
                  {lang === 'ar' ? 'جديد' : 'Nouveau'}
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`relative w-16 h-16 overflow-hidden border transition-colors ${
                      selectedImg === i ? 'border-gold-500' : 'border-gold-800/20 hover:border-gold-700/50'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            {product.brand && (
              <p className="font-body text-xs tracking-[0.25em] uppercase text-gold-700">
                {product.brand}
              </p>
            )}
            <h1 className="font-display text-3xl sm:text-4xl text-cream/95 leading-tight">
              {name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="font-display text-3xl text-gold-400">
                {product.price.toFixed(2)} <span className="text-base">MAD</span>
              </span>
              {product.original_price && (
                <span className="font-body text-base text-cream/30 line-through">
                  {product.original_price.toFixed(2)} MAD
                </span>
              )}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-3">
              {product.size_ml && (
                <span className="glass-card px-3 py-1 font-body text-xs text-cream/50">
                  {product.size_ml} ml
                </span>
              )}
              {product.concentration && (
                <span className="glass-card px-3 py-1 font-body text-xs text-cream/50">
                  {product.concentration}
                </span>
              )}
              {product.gender && (
                <span className="glass-card px-3 py-1 font-body text-xs text-cream/50">
                  {t(product.gender as 'homme' | 'femme' | 'mixte')}
                </span>
              )}
            </div>

            {desc && (
              <p className="font-body text-sm text-cream/50 leading-relaxed border-l border-gold-800/40 pl-4">
                {desc}
              </p>
            )}

            {/* Scent notes */}
            {(product.notes_top?.length || product.notes_heart?.length || product.notes_base?.length) && (
              <div className="glass-card p-5 space-y-3">
                <h3 className="font-body text-xs tracking-[0.2em] uppercase text-gold-600 mb-4">
                  {lang === 'ar' ? 'تركيبة العطر' : 'Composition olfactive'}
                </h3>
                {[
                  { key: 'top', notes: product.notes_top, icon: '🌸' },
                  { key: 'heart', notes: product.notes_heart, icon: '🌹' },
                  { key: 'base', notes: product.notes_base, icon: '🪵' },
                ].filter(n => n.notes?.length).map((n) => (
                  <div key={n.key} className="flex items-start gap-3">
                    <span className="text-sm mt-0.5">{n.icon}</span>
                    <div>
                      <p className="font-body text-[10px] text-gold-700 uppercase tracking-wider mb-1">
                        {noteLabels[n.key as keyof typeof noteLabels]}
                      </p>
                      <p className="font-body text-sm text-cream/60">
                        {n.notes?.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center glass-card">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center text-cream/60 
                             hover:text-gold-400 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-body text-sm text-cream">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock || 99, qty + 1))}
                  className="w-10 h-10 flex items-center justify-center text-cream/60 
                             hover:text-gold-400 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center gap-3 
                           btn-gold-filled disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={16} />
                <span>{isOutOfStock ? t('out_of_stock') : t('add_to_cart')}</span>
              </button>
            </div>

            {/* Stock */}
            <p className="font-body text-xs text-cream/30">
              {product.stock > 0
                ? `✓ ${lang === 'ar' ? 'متوفر في المخزون' : 'En stock'}`
                : `✗ ${t('out_of_stock')}`}
            </p>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24">
            <div className="divider-gold mb-12" />
            <h2 className="font-display text-2xl text-cream/80 mb-8">
              {lang === 'ar' ? 'قد يعجبك أيضاً' : 'Vous aimerez aussi'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
