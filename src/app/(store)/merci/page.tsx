'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';

function MerciContent() {
  const { t } = useLang();
  const params = useSearchParams();
  const orderNumber = params.get('order');

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-gold-900/20 border border-gold-500/30 
                        flex items-center justify-center mx-auto mb-8 animate-fade-up">
          <CheckCircle2 size={40} className="text-gold-500" />
        </div>
        <h1 className="font-display text-4xl text-cream/90 mb-4 animate-fade-up stagger-1">
          {t('merci_title')}
        </h1>
        {orderNumber && (
          <div className="glass-card px-6 py-3 inline-block mb-6 animate-fade-up stagger-2">
            <p className="font-body text-xs text-gold-600 uppercase tracking-widest mb-1">
              {t('merci_order_number')}
            </p>
            <p className="font-display text-2xl text-gold-400">{orderNumber}</p>
          </div>
        )}
        <p className="font-body text-sm text-cream/50 leading-relaxed mb-10 animate-fade-up stagger-3">
          {t('merci_text')}
        </p>
        <Link href="/" className="btn-gold animate-fade-up stagger-4">
          <span>{t('back_home')}</span>
        </Link>
      </div>
    </div>
  );
}

export default function MerciPage() {
  return (
    <Suspense>
      <MerciContent />
    </Suspense>
  );
}
