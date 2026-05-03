'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { useCart } from '@/contexts/cartStore';

const SHIPPING_COST = 30;
const FREE_ABOVE = 500;

export default function CartPage() {
  const { lang, t } = useLang();
  const { items, removeItem, updateQty, total } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const subtotal = total();
  const shipping = subtotal >= FREE_ABOVE ? 0 : SHIPPING_COST;
  const grand = subtotal + shipping;

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
        <h1 className="font-display text-4xl text-cream/90 mb-10">{t('cart_title')}</h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag size={48} className="mx-auto text-cream/20 mb-6" />
            <p className="font-body text-cream/40 mb-8">{t('cart_empty')}</p>
            <Link href="/catalogue" className="btn-gold">
              <span>{t('cart_continue')}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ product, qty }) => {
                const name = lang === 'ar' ? product.name_ar : product.name_fr;
                return (
                  <div key={product.id} className="glass-card p-4 flex gap-4">
                    <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-navy-800">
                      {product.thumbnail ? (
                        <Image src={product.thumbnail} alt={name} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-20">🌹</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base text-cream/90 truncate">{name}</h3>
                      {product.brand && (
                        <p className="font-body text-xs text-gold-700 mb-2">{product.brand}</p>
                      )}
                      <p className="font-body text-sm text-gold-400 font-semibold">
                        {product.price.toFixed(2)} MAD
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center glass-card">
                          <button
                            onClick={() => updateQty(product.id, qty - 1)}
                            className="w-8 h-8 flex items-center justify-center text-cream/50 
                                       hover:text-gold-400 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center font-body text-sm">{qty}</span>
                          <button
                            onClick={() => updateQty(product.id, qty + 1)}
                            className="w-8 h-8 flex items-center justify-center text-cream/50 
                                       hover:text-gold-400 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-cream/30 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-sm font-semibold text-cream/80">
                        {(product.price * qty).toFixed(2)} MAD
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="glass-card p-6 h-fit">
              <h2 className="font-display text-xl text-cream/90 mb-6">{t('order_summary')}</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-cream/50">{t('cart_subtotal')}</span>
                  <span className="text-cream/80">{subtotal.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-cream/50">{t('cart_shipping')}</span>
                  <span className={shipping === 0 ? 'text-gold-500' : 'text-cream/80'}>
                    {shipping === 0 ? t('cart_free_shipping') : `${shipping.toFixed(2)} MAD`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="font-body text-xs text-cream/30">
                    {lang === 'ar'
                      ? `أضف ${(FREE_ABOVE - subtotal).toFixed(0)} MAD للحصول على شحن مجاني`
                      : `Ajoutez ${(FREE_ABOVE - subtotal).toFixed(0)} MAD pour la livraison gratuite`}
                  </p>
                )}
                <div className="divider-gold" />
                <div className="flex justify-between font-body font-semibold">
                  <span className="text-cream/80">{t('cart_total')}</span>
                  <span className="text-gold-400 text-lg">{grand.toFixed(2)} MAD</span>
                </div>
              </div>
              <Link href="/checkout" className="btn-gold-filled w-full flex items-center justify-center gap-2">
                {t('checkout')}
              </Link>
              <Link
                href="/catalogue"
                className="mt-3 block text-center font-body text-xs text-cream/30 
                           hover:text-gold-400 transition-colors"
              >
                {t('cart_continue')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
