'use client';

import Link from 'next/link';

import { useLang } from '@/contexts/LangContext';
import ProductCard from '@/components/store/ProductCard';
import type { Product, Category } from '@/types';

interface Props { featured: Product[]; newProducts: Product[]; categories: Category[]; }

/* ── Inline SVG perfume bottle illustrations ── */
function BottleClassic({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#c9a227" stopOpacity="0.6"/>
          <stop offset="40%"  stopColor="#f0d88a" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#856118" stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#e6c97a" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0.4"/>
        </linearGradient>
        <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f0d88a"/>
          <stop offset="100%" stopColor="#856118"/>
        </linearGradient>
      </defs>
      {/* Cap */}
      <rect x="42" y="8" width="36" height="14" rx="4" fill="url(#capGrad)"/>
      <rect x="46" y="6" width="28" height="6" rx="3" fill="#c9a227" opacity="0.8"/>
      {/* Neck */}
      <rect x="48" y="22" width="24" height="20" rx="2" fill="url(#bottleGrad)" opacity="0.85"/>
      {/* Shoulder curve */}
      <path d="M32 42 Q32 52 24 62 L24 175 Q24 182 32 182 L88 182 Q96 182 96 175 L96 62 Q88 52 88 42 Z"
        fill="url(#bottleGrad)"/>
      {/* Liquid inside */}
      <path d="M29 100 L29 172 Q29 179 36 179 L84 179 Q91 179 91 172 L91 100 Z"
        fill="url(#liquidGrad)" opacity="0.5"/>
      {/* Highlight */}
      <rect x="34" y="65" width="10" height="90" rx="5" fill="white" opacity="0.15"/>
      {/* Label area */}
      <rect x="30" y="105" width="60" height="55" rx="3" fill="white" opacity="0.12"/>
      <text x="60" y="125" textAnchor="middle" fill="#c9a227" fontSize="7" fontFamily="'Cormorant Garamond',serif" fontStyle="italic" opacity="0.9">Amine</text>
      <text x="60" y="136" textAnchor="middle" fill="#c9a227" fontSize="5" fontFamily="'Jost',sans-serif" letterSpacing="2" opacity="0.7">PARFUMES</text>
      {/* Bottom edge */}
      <ellipse cx="60" cy="182" rx="36" ry="4" fill="#856118" opacity="0.3"/>
    </svg>
  );
}

function BottleFlacon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fg2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#8b5cf6" stopOpacity="0.5"/>
          <stop offset="50%"  stopColor="#c4b5fd" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.6"/>
        </linearGradient>
        <linearGradient id="lq2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ddd6fe" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4"/>
        </linearGradient>
      </defs>
      {/* Spray pump */}
      <rect x="44" y="4" width="12" height="18" rx="3" fill="#c9a227" opacity="0.9"/>
      <rect x="38" y="18" width="24" height="8" rx="2" fill="#e6c97a" opacity="0.8"/>
      <rect x="56" y="10" width="18" height="3" rx="1.5" fill="#c9a227" opacity="0.7"/>
      {/* Neck */}
      <rect x="42" y="26" width="16" height="16" rx="2" fill="url(#fg2)"/>
      {/* Body — square flacon */}
      <rect x="14" y="42" width="72" height="140" rx="8" fill="url(#fg2)"/>
      {/* Liquid */}
      <rect x="19" y="110" width="62" height="68" rx="6" fill="url(#lq2)" opacity="0.5"/>
      {/* Highlight shine */}
      <rect x="22" y="50" width="8" height="100" rx="4" fill="white" opacity="0.18"/>
      {/* Label */}
      <rect x="22" y="90" width="56" height="50" rx="4" fill="white" opacity="0.1"/>
      <text x="50" y="110" textAnchor="middle" fill="#e6c97a" fontSize="6" fontFamily="'Cormorant Garamond',serif" fontStyle="italic" opacity="0.9">Amine</text>
      <text x="50" y="122" textAnchor="middle" fill="#c9a227" fontSize="4.5" fontFamily="'Jost',sans-serif" letterSpacing="2" opacity="0.7">PARFUMES</text>
      <ellipse cx="50" cy="182" rx="36" ry="4" fill="#6d28d9" opacity="0.2"/>
    </svg>
  );
}

function BottleOud({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fg3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#c9a227" stopOpacity="0.5"/>
          <stop offset="50%"  stopColor="#f0d88a" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#856118" stopOpacity="0.6"/>
        </linearGradient>
        <radialGradient id="lq3" cx="40%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#fde68a" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#92400e" stopOpacity="0.5"/>
        </radialGradient>
      </defs>
      {/* Stopper */}
      <ellipse cx="45" cy="18" rx="12" ry="14" fill="url(#fg3)"/>
      <rect x="42" y="14" width="6" height="18" rx="3" fill="#c9a227" opacity="0.9"/>
      {/* Shoulder */}
      <path d="M20 46 Q10 70 10 90 L10 172 Q10 180 18 180 L72 180 Q80 180 80 172 L80 90 Q80 70 70 46 Z"
        fill="url(#fg3)"/>
      {/* Liquid */}
      <path d="M15 110 L15 170 Q15 177 22 177 L68 177 Q75 177 75 170 L75 110 Z"
        fill="url(#lq3)" opacity="0.5"/>
      {/* Highlight */}
      <path d="M18 55 Q16 70 16 90 L16 140" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.15" fill="none"/>
      {/* Label */}
      <rect x="18" y="108" width="54" height="44" rx="3" fill="white" opacity="0.1"/>
      <text x="45" y="126" textAnchor="middle" fill="#c9a227" fontSize="5.5" fontFamily="'Cormorant Garamond',serif" fontStyle="italic" opacity="0.9">Amine</text>
      <text x="45" y="137" textAnchor="middle" fill="#c9a227" fontSize="4" fontFamily="'Jost',sans-serif" letterSpacing="2" opacity="0.7">PARFUMES</text>
      <ellipse cx="45" cy="180" rx="32" ry="3.5" fill="#92400e" opacity="0.25"/>
    </svg>
  );
}

/* ── Floating particle dots ── */
function Particles() {
  const dots = [
    { x: '15%', delay: '0s',   dur: '4s',  size: 3 },
    { x: '35%', delay: '0.8s', dur: '5s',  size: 2 },
    { x: '55%', delay: '1.4s', dur: '3.5s',size: 4 },
    { x: '72%', delay: '0.3s', dur: '6s',  size: 2 },
    { x: '88%', delay: '2s',   dur: '4.5s',size: 3 },
    { x: '25%', delay: '1.1s', dur: '5.5s',size: 2 },
    { x: '65%', delay: '0.6s', dur: '4s',  size: 3 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            left: d.x, bottom: '0%', width: d.size, height: d.size,
            background: 'radial-gradient(circle, #c9a227, #856118)',
            animation: `particleDrift ${d.dur} ease-out infinite`,
            animationDelay: d.delay, opacity: 0.6,
          }} />
      ))}
    </div>
  );
}

/* ── Category visual map ── */
const CAT_ICONS: Record<string, { emoji: string; color: string; gradient: string }> = {
  'homme':      { emoji: '🏛️',  color: '#c9a227', gradient: 'linear-gradient(135deg,#0a0e1a,#1a1408)' },
  'femme':      { emoji: '🌸',  color: '#f9a8d4', gradient: 'linear-gradient(135deg,#1a0a18,#2d0f24)' },
  'mixte':      { emoji: '✨',  color: '#e6c97a', gradient: 'linear-gradient(135deg,#0f1218,#1a1a20)' },
  'sets-packs': { emoji: '🎁',  color: '#86efac', gradient: 'linear-gradient(135deg,#060e10,#0a1a14)' },
  'nouveautes': { emoji: '💫',  color: '#c4b5fd', gradient: 'linear-gradient(135deg,#0d0820,#180d30)' },
  'dupes':      { emoji: '💎',  color: '#7dd3fc', gradient: 'linear-gradient(135deg,#050e1a,#0a1428)' },
  'decants':    { emoji: '🧪',  color: '#fca5a5', gradient: 'linear-gradient(135deg,#160808,#200f0f)' },
};

export default function HomeClient({ featured, newProducts, categories }: Props) {
  const { lang, t } = useLang();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <Particles />

        {/* BG gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
            style={{ background: 'radial-gradient(circle, #c9a227, transparent)' }} />
          <div className="absolute top-1/2 right-1/5 w-64 h-64 rounded-full blur-3xl opacity-8"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 pb-16">
          {/* Text side */}
          <div>
            <div className="flex items-center gap-3 mb-6" style={{ animation: 'fadeUp 0.6s ease forwards', opacity: 0 }}>
              <div style={{ height: 1, width: 48, background: 'linear-gradient(90deg, transparent, var(--gold-mid))' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.35em', color: 'var(--gold-mid)', textTransform: 'uppercase' }}>
                {t('hero_badge')}
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem,8vw,5.5rem)', color: 'var(--fg-primary)', lineHeight: 1, letterSpacing: '-0.02em', animation: 'fadeUp 0.6s ease 0.15s forwards', opacity: 0 }}>
              Amine<br />
              <em className="text-gold-gradient">Parfumes</em>
            </h1>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--fg-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '1.5rem', marginBottom: '2.5rem', animation: 'fadeUp 0.6s ease 0.3s forwards', opacity: 0, maxWidth: 420 }}>
              {lang === 'ar'
                ? 'اكتشف عطور استثنائية تُصنع من أجلك'
                : "Des fragrances d'exception, créées pour vous"}
            </p>

            <div className="flex flex-wrap gap-4" style={{ animation: 'fadeUp 0.6s ease 0.45s forwards', opacity: 0 }}>
              <Link href="/catalogue" className="btn-gold"><span>{t('hero_cta')}</span></Link>
              <Link href="/catalogue?category=nouveautes" className="btn-gold">
                <span>{lang === 'ar' ? 'وصل حديثاً' : 'Nouveautés'}</span>
              </Link>
              <Link href="/catalogue?category=dupes" className="btn-gold">
                <span>Dupes & Inspirations</span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10" style={{ animation: 'fadeUp 0.6s ease 0.6s forwards', opacity: 0 }}>
              {[
                { icon: '🚚', label: lang === 'ar' ? 'توصيل للمغرب' : 'Livraison Maroc' },
                { icon: '💵', label: lang === 'ar' ? 'دفع عند الاستلام' : 'Paiement livraison' },
                { icon: '✅', label: lang === 'ar' ? 'أصالة مضمونة' : 'Authenticité garantie' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span style={{ fontSize: 14 }}>{b.icon}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--fg-subtle)', letterSpacing: '0.08em' }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottles side — animated SVG illustrations */}
          <div className="relative h-[520px] hidden lg:flex items-center justify-center">
            {/* Glow rings */}
            <div className="absolute w-72 h-72 rounded-full glow-pulse"
              style={{ border: '1px solid rgba(201,162,39,0.1)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
            <div className="absolute w-56 h-56 rounded-full"
              style={{ border: '1px solid rgba(201,162,39,0.06)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

            {/* Left bottle */}
            <div className="absolute left-8 top-16 float-b"
              style={{ filter: 'drop-shadow(0 24px 48px rgba(139,92,246,0.3))' }}>
              <BottleFlacon className="w-24 h-auto opacity-80" />
            </div>

            {/* Center bottle — main */}
            <div className="relative float-a z-10"
              style={{ filter: 'drop-shadow(0 32px 64px rgba(201,162,39,0.35))' }}>
              <BottleClassic className="w-36 h-auto" />
              {/* Sparkles around center bottle */}
              {['top-0 right-0', 'bottom-8 left-0', 'top-1/2 -right-4'].map((pos, i) => (
                <div key={i} className={`absolute ${pos}`}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold-mid)', animation: `glowPulse ${2.5 + i}s ease-in-out infinite`, animationDelay: `${i * 0.8}s` }} />
              ))}
            </div>

            {/* Right bottle */}
            <div className="absolute right-4 bottom-20 float-c"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(201,162,39,0.25))' }}>
              <BottleOud className="w-20 h-auto opacity-85" />
            </div>

            {/* Decorative lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 400 520">
              <circle cx="200" cy="260" r="160" stroke="#c9a227" strokeWidth="0.5" fill="none" strokeDasharray="4 8"/>
              <circle cx="200" cy="260" r="110" stroke="#c9a227" strokeWidth="0.5" fill="none" strokeDasharray="2 12"/>
            </svg>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
          <div style={{ width: 1, height: 48, background: 'linear-gradient(180deg, transparent, var(--gold-mid))' }} />
        </div>
      </section>

      {/* ══════════════ CATEGORIES ══════════════ */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
          <div className="text-center mb-12">
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--gold-mid)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              {lang === 'ar' ? 'مجموعاتنا' : 'Collections'}
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg-primary)' }}>
              {t('categories_title')}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat) => {
              const meta = CAT_ICONS[cat.slug] || { emoji: '✨', color: '#c9a227', gradient: 'linear-gradient(135deg,#0f1628,#151e36)' };
              return (
                <Link key={cat.id} href={`/catalogue?category=${cat.slug}`} className="category-card"
                  style={{ background: meta.gradient, minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.25rem' }}>
                  <div className="cat-bg absolute inset-0 opacity-20"
                    style={{ background: `radial-gradient(ellipse at 60% 30%, ${meta.color}40, transparent)` }} />
                  <span style={{ fontSize: 28, marginBottom: '0.5rem', display: 'block' }}>{meta.emoji}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#fdf8ee', lineHeight: 1.2 }}>
                    {lang === 'ar' ? cat.name_ar : cat.name_fr}
                  </h3>
                  <div style={{ height: 1, width: 0, background: meta.color, transition: 'width 0.3s ease', marginTop: '0.4rem' }}
                    className="cat-line" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
          <div className="divider-gold mb-16" />
          <div className="flex items-end justify-between mb-10">
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--gold-mid)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                {lang === 'ar' ? 'الأكثر طلباً' : 'Top Ventes'}
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'var(--fg-primary)' }}>
                {t('featured_title')}
              </h2>
            </div>
            <Link href="/catalogue?featured=true"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--gold-dark)', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
              className="hidden sm:block hover:text-[var(--gold-mid)] transition-colors">
              {lang === 'ar' ? 'عرض الكل ←' : 'Voir tout →'}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ══════════════ BRAND STRIP ══════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, var(--gold-mid), transparent)' }} />
        </div>
        <div className="divider-gold" />
        <div className="max-w-4xl mx-auto px-4 text-center py-16 relative">
          {/* Center bottle decoration */}
          <div className="flex justify-center mb-8">
            <div className="float-a" style={{ filter: 'drop-shadow(0 16px 32px rgba(201,162,39,0.2))' }}>
              <BottleClassic className="w-20 h-auto opacity-60" />
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--gold-dark)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            amine.parfume
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,3rem)', color: 'var(--fg-primary)', fontStyle: 'italic', marginBottom: '1rem' }}>
            {lang === 'ar' ? 'فن العطر في أرقى صوره' : "L'art du parfum dans sa plus haute expression"}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
            {lang === 'ar'
              ? 'كل عطر قصة، كل رائحة ذكرى. اكتشف مجموعتنا من العطور المختارة بعناية فائقة.'
              : 'Chaque parfum raconte une histoire. Chaque fragrance est une invitation au voyage.'}
          </p>
        </div>
        <div className="divider-gold" />
      </section>

      {/* ══════════════ NEW ARRIVALS ══════════════ */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--gold-mid)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                {lang === 'ar' ? 'آخر الإضافات' : 'Dernières Arrivées'}
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'var(--fg-primary)' }}>
                {t('new_title')}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ══════════════ WHY US ══════════════ */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: '🚚', bottles: <BottleClassic className="w-12 h-auto opacity-40 float-a" />,
              fr: 'Livraison partout au Maroc', ar: 'توصيل لجميع أنحاء المغرب',
              dfr: 'Délai 24–72h', dar: 'خلال 24–72 ساعة' },
            { icon: '💵', bottles: <BottleFlacon className="w-12 h-auto opacity-40 float-b" />,
              fr: 'Paiement à la livraison', ar: 'الدفع عند الاستلام',
              dfr: 'Payez en cash à réception', dar: 'ادفع نقداً عند الاستلام' },
            { icon: '🌹', bottles: <BottleOud className="w-12 h-auto opacity-40 float-c" />,
              fr: 'Sélection haut de gamme', ar: 'اختيار من أرقى العطور',
              dfr: 'Fragrances authentiques', dar: 'عطور أصيلة ومختارة' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-8 text-center relative overflow-hidden">
              <div className="flex justify-center mb-4">{item.bottles}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--gold-mid)', marginBottom: '0.5rem' }}>
                {lang === 'ar' ? item.ar : item.fr}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--fg-muted)' }}>
                {lang === 'ar' ? item.dar : item.dfr}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
