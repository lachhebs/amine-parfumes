/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useLang } from '@/contexts/LangContext';
import { useCart } from '@/contexts/cartStore';

const SHIPPING_COST = 30;
const FREE_ABOVE = 500;

export default function CheckoutPage() {
  const { lang, t } = useLang();
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    address_city: '',
    address_street: '',
    address_zip: '',
    address_notes: '',
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const subtotal = total();
  const shipping = subtotal >= FREE_ABOVE ? 0 : SHIPPING_COST;
  const grand = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone || !form.address_city || !form.address_street) {
      toast.error(lang === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map(({ product, qty }) => ({
        product_id: product.id,
        name: lang === 'ar' ? product.name_ar : product.name_fr,
        price: product.price,
        qty,
        image: product.thumbnail,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: orderItems,
          subtotal,
          shipping_cost: shipping,
          total: grand,
          payment_method: 'cash_on_delivery',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      clearCart();
      router.push(`/merci?order=${data.order_number}`);
    } catch (err: any) {
      toast.error(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        <h1 className="font-display text-4xl text-cream/90 mb-10">{t('checkout_title')}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6">
                <h2 className="font-body text-xs tracking-[0.2em] uppercase text-gold-600 mb-6">
                  {t('checkout_info')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs text-cream/40 mb-1.5 block">{t('full_name')} *</label>
                    <input name="customer_name" value={form.customer_name} onChange={handleChange}
                      className="input-luxury" required />
                  </div>
                  <div>
                    <label className="font-body text-xs text-cream/40 mb-1.5 block">{t('phone')} *</label>
                    <input name="customer_phone" value={form.customer_phone} onChange={handleChange}
                      className="input-luxury" type="tel" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-body text-xs text-cream/40 mb-1.5 block">{t('email')}</label>
                    <input name="customer_email" value={form.customer_email} onChange={handleChange}
                      className="input-luxury" type="email" />
                  </div>
                  <div>
                    <label className="font-body text-xs text-cream/40 mb-1.5 block">{t('city')} *</label>
                    <input name="address_city" value={form.address_city} onChange={handleChange}
                      className="input-luxury" required />
                  </div>
                  <div>
                    <label className="font-body text-xs text-cream/40 mb-1.5 block">{t('zip')}</label>
                    <input name="address_zip" value={form.address_zip} onChange={handleChange}
                      className="input-luxury" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-body text-xs text-cream/40 mb-1.5 block">{t('address')} *</label>
                    <input name="address_street" value={form.address_street} onChange={handleChange}
                      className="input-luxury" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-body text-xs text-cream/40 mb-1.5 block">{t('delivery_notes')}</label>
                    <textarea name="address_notes" value={form.address_notes} onChange={handleChange}
                      className="input-luxury resize-none h-20" />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="glass-card p-6">
                <h2 className="font-body text-xs tracking-[0.2em] uppercase text-gold-600 mb-4">
                  {lang === 'ar' ? 'طريقة الدفع' : 'Mode de paiement'}
                </h2>
                <div className="flex items-center gap-3 border border-gold-500/30 p-4 bg-gold-900/10">
                  <div className="w-5 h-5 rounded-full border-2 border-gold-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-gold-500" />
                  </div>
                  <span className="font-body text-sm text-cream/80">💵 {t('payment_method')}</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card p-6 h-fit">
              <h2 className="font-display text-xl text-cream/90 mb-6">{t('order_summary')}</h2>
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-1">
                {items.map(({ product, qty }) => {
                  const name = lang === 'ar' ? product.name_ar : product.name_fr;
                  return (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-navy-800 flex-shrink-0">
                        {product.thumbnail && (
                          <Image src={product.thumbnail} alt={name} fill className="object-cover" />
                        )}
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold-600 
                                         text-navy-900 text-[9px] font-bold rounded-full 
                                         flex items-center justify-center">
                          {qty}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs text-cream/70 truncate">{name}</p>
                        <p className="font-body text-xs text-gold-500">{(product.price * qty).toFixed(2)} MAD</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="divider-gold mb-4" />
              <div className="space-y-2 mb-6">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-cream/50">{t('cart_subtotal')}</span>
                  <span>{subtotal.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-cream/50">{t('cart_shipping')}</span>
                  <span className={shipping === 0 ? 'text-gold-500' : ''}>
                    {shipping === 0 ? t('cart_free_shipping') : `${shipping.toFixed(2)} MAD`}
                  </span>
                </div>
                <div className="divider-gold" />
                <div className="flex justify-between font-body font-semibold text-lg">
                  <span>{t('cart_total')}</span>
                  <span className="text-gold-400">{grand.toFixed(2)} MAD</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold-filled w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading
                  ? (lang === 'ar' ? 'جارٍ المعالجة...' : 'Traitement...')
                  : t('place_order')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
