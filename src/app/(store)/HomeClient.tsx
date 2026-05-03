/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/contexts/LangContext';
import ProductCard from '@/components/store/ProductCard';
import type { Product, Category } from '@/types';

interface Props { featured: Product[]; newProducts: Product[]; categories: Category[]; }

const HERO_PERFUMES = [
  {
    id: 0,
    src: '/images/hero-armani.jpg',
    name: 'Stronger With You',
    sub: 'Intensely · Emporio Armani',
    mood: 'Chaud & Ambré',
    accent: '#d4722a',
    tag: 'Homme',
  },
  {
    id: 1,
    src: '/images/hero-burberry.jpg',
    name: 'Burberry Her',
    sub: 'Elixir de Parfum',
    mood: 'Floral & Fruité',
    accent: '#c9a0a0',
    tag: 'Femme',
  },
  {
    id: 2,
    src: '/images/hero-jbg.jpg',
    name: 'Le Beau',
    sub: 'Jean Paul Gaultier',
    mood: 'Boisé & Exotique',
    accent: '#3aaa76',
    tag: 'Homme',
  },
];

const CAT_META: Record<string, { emoji: string; color: string; bg: string }> = {
  'homme':      { emoji: '🏛️', color: '#c9a227', bg: 'linear-gradient(135deg,#0a0e1a,#1a1408)' },
  'femme':      { emoji: '🌸', color: '#f9a8d4', bg: 'linear-gradient(135deg,#1a0a18,#2d0f24)' },
  'mixte':      { emoji: '✨', color: '#e6c97a', bg: 'linear-gradient(135deg,#0f1218,#1a1a20)' },
  'sets-packs': { emoji: '🎁', color: '#86efac', bg: 'linear-gradient(135deg,#060e10,#0a1a14)' },
  'nouveautes': { emoji: '💫', color: '#c4b5fd', bg: 'linear-gradient(135deg,#0d0820,#180d30)' },
  'dupes':      { emoji: '💎', color: '#7dd3fc', bg: 'linear-gradient(135deg,#050e1a,#0a1428)' },
  'decants':    { emoji: '🧪', color: '#fca5a5', bg: 'linear-gradient(135deg,#160808,#200f0f)' },
};

/* ─── Hero ─── */
function HeroSection({ lang }: { lang: string }) {
  const [active, setActive]     = useState(0);
  const [prev,   setPrev]       = useState<number | null>(null);
  const [transitioning, setTrans] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback((next: number) => {
    if (transitioning) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setTrans(true);
    setPrev(active);
    setActive(next);
    setTimeout(() => { setPrev(null); setTrans(false); }, 700);
  }, [active, transitioning]);

  useEffect(() => {
    timerRef.current = setTimeout(() => advance((active + 1) % 3), 5500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active]);

  const cur = HERO_PERFUMES[active];
  const prv = prev !== null ? HERO_PERFUMES[prev] : null;

  return (
    <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', background: '#05060d' }}>

      {/* BG layers — NO blur filter (too slow). Use dark overlay instead */}
      {HERO_PERFUMES.map((p, i) => (
        <div key={p.id} style={{
          position: 'absolute', inset: 0, zIndex: i === active ? 1 : i === prev ? 2 : 0,
          opacity: i === active ? 1 : i === prev ? 0 : 0,
          transition: 'opacity 0.8s ease',
        }}>
          <Image src={p.src} alt="" fill priority={i === 0}
            className="object-cover"
            style={{ opacity: 0.18, transform: 'scale(1.05)' }}
            sizes="100vw"
          />
          {/* Solid dark overlay — no blur needed */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(5,6,13,0.92) 0%, rgba(5,6,13,0.55) 55%, rgba(5,6,13,0.75) 100%)' }} />
          {/* Subtle color tint — cheap, no GPU blur */}
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 50% at 72% 50%, ${p.accent}20 0%, transparent 70%)` }} />
        </div>
      ))}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full" style={{ position: 'relative', zIndex: 10, paddingTop: '5.5rem', paddingBottom: '4rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem', alignItems: 'center' }}>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* LEFT — text */}
          <div>
            <div key={`tag-${active}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem', animation: 'hFadeUp 0.55s ease forwards', opacity: 0 }}>
              <div style={{ height: 1, width: 36, background: `linear-gradient(90deg, transparent, ${cur.accent})` }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.35em', color: cur.accent, textTransform: 'uppercase' }}>
                {cur.tag} · {cur.mood}
              </span>
            </div>

            <h1 key={`h1-${active}`} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem,6.5vw,4.8rem)', color: '#fdf8ee', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: '0.4rem', animation: 'hFadeUp 0.55s ease 0.1s forwards', opacity: 0 }}>
              {cur.name}
            </h1>

            <p key={`sub-${active}`} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.95rem,2vw,1.35rem)', color: cur.accent, fontStyle: 'italic', marginBottom: '1.5rem', animation: 'hFadeUp 0.55s ease 0.18s forwards', opacity: 0 }}>
              {cur.sub}
            </p>

            <p key={`desc-${active}`} style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(253,248,238,0.5)', lineHeight: 1.85, maxWidth: 380, marginBottom: '2rem', animation: 'hFadeUp 0.55s ease 0.26s forwards', opacity: 0 }}>
              {lang === 'ar'
                ? 'اكتشف هذا العطر الاستثنائي. متوفر الآن مع توصيل لجميع أنحاء المغرب.'
                : "Disponible maintenant dans notre boutique avec livraison partout au Maroc."}
            </p>

            <div key={`cta-${active}`} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', marginBottom: '2rem', animation: 'hFadeUp 0.55s ease 0.34s forwards', opacity: 0 }}>
              <Link href="/catalogue" className="btn-gold-filled" style={{ fontSize: '0.68rem' }}>
                {lang === 'ar' ? 'تسوق الآن' : 'Commander maintenant'}
              </Link>
              <Link href="/catalogue" className="btn-gold" style={{ fontSize: '0.68rem' }}>
                <span>{lang === 'ar' ? 'عرض الكل' : 'Voir la collection'}</span>
              </Link>
            </div>

            {/* Trust */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { icon: '🚚', fr: 'Livraison Maroc', ar: 'توصيل المغرب' },
                { icon: '💵', fr: 'Paiement livraison', ar: 'دفع عند الاستلام' },
                { icon: '✅', fr: 'Authenticité', ar: 'أصالة مضمونة' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 12 }}>{b.icon}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'rgba(253,248,238,0.28)', letterSpacing: '0.08em' }}>
                    {lang === 'ar' ? b.ar : b.fr}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — bottle image, CSS animation only (no JS mousemove) */}
          <div className="hidden lg:flex" style={{ position: 'relative', height: 500, alignItems: 'center', justifyContent: 'center' }}>
            {/* Static glow ring — no JS pulse */}
            <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', border: `1px solid ${cur.accent}20`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', transition: 'border-color 0.8s' }} />
            {/* Colour blob — cheap radial-gradient, no blur filter */}
            <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: `radial-gradient(circle, ${cur.accent}18 0%, transparent 70%)`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', transition: 'background 0.8s' }} />

            {/* Outgoing bottle */}
            {prv && (
              <div style={{ position: 'absolute', zIndex: 1, animation: 'bOut 0.7s ease forwards' }}>
                <div style={{ width: 320, height: 400, position: 'relative' }}>
                  <Image src={prv.src} alt={prv.name} fill className="object-contain"
                    style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.5))' }} />
                </div>
              </div>
            )}

            {/* Active bottle — CSS float only, NO mousemove state */}
            <div key={`bottle-${active}`} style={{ position: 'relative', zIndex: 2, animation: 'bIn 0.8s cubic-bezier(0.34,1.4,0.64,1) forwards', opacity: 0 }}>
              <div style={{ animation: 'bottleFloat 5s ease-in-out infinite', width: 320, height: 400, position: 'relative' }}>
                <Image src={cur.src} alt={cur.name} fill priority className="object-contain"
                  sizes="320px"
                  style={{ filter: `drop-shadow(0 32px 56px ${cur.accent}50)` }} />
              </div>
            </div>

            {/* Floating info card — no backdrop-filter */}
            <div key={`card-${active}`} style={{
              position: 'absolute', bottom: 24, right: 0,
              background: 'rgba(5,6,13,0.88)',
              border: `1px solid ${cur.accent}25`,
              padding: '0.7rem 1.1rem', borderRadius: 8,
              animation: 'hFadeUp 0.6s ease 0.5s forwards', opacity: 0, minWidth: 150,
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: cur.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 2 }}>{cur.mood}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: '#fdf8ee' }}>{cur.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div style={{ position: 'absolute', bottom: '1.75rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
        {HERO_PERFUMES.map((_, i) => (
          <button key={i} onClick={() => advance(i)}
            style={{ width: i === active ? 28 : 7, height: 7, borderRadius: 4, background: i === active ? cur.accent : 'rgba(253,248,238,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.35s ease', padding: 0 }} />
        ))}
      </div>

      {/* Arrow nav */}
      {(['prev', 'next'] as const).map((dir) => (
        <button key={dir} onClick={() => advance(dir === 'next' ? (active + 1) % 3 : (active + 2) % 3)}
          className="hidden sm:flex"
          style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            [dir === 'prev' ? 'left' : 'right']: '1.25rem',
            zIndex: 20, width: 42, height: 42, borderRadius: '50%',
            background: 'rgba(5,6,13,0.7)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>
          {dir === 'prev' ? '‹' : '›'}
        </button>
      ))}

      <style>{`
        @keyframes hFadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bIn    { from { opacity:0; transform:scale(0.85) translateY(24px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes bOut   { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(0.92) translateY(-16px); } }
        @keyframes bottleFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
        @keyframes marqueeScroll { from { transform:translateX(0); } to { transform:translateX(-50%); } }
      `}</style>
    </section>
  );
}

/* ─── Marquee ─── */
function Marquee() {
  const items = [
    { src: '/images/hero-armani.jpg',   label: 'Stronger With You Intensely' },
    { src: '/images/hero-burberry.jpg', label: 'Burberry Her Elixir' },
    { src: '/images/hero-jbg.jpg',      label: 'Le Beau · JPG' },
    { src: '/images/hero-armani.jpg',   label: 'Stronger With You Intensely' },
    { src: '/images/hero-burberry.jpg', label: 'Burberry Her Elixir' },
    { src: '/images/hero-jbg.jpg',      label: 'Le Beau · JPG' },
  ];
  return (
    <div style={{ overflow: 'hidden', padding: '1.5rem 0', borderTop: '1px solid var(--border-gold)', borderBottom: '1px solid var(--border-gold)', background: 'var(--bg-surface)' }}>
      <div style={{ display: 'flex', gap: '2rem', animation: 'marqueeScroll 20s linear infinite', width: 'max-content' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexShrink: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 6, overflow: 'hidden', position: 'relative', border: '1px solid var(--border-gold)', flexShrink: 0 }}>
              <Image src={item.src} alt={item.label} fill className="object-cover" sizes="44px" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--fg-muted)', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
              {item.label}
            </span>
            <span style={{ color: 'var(--gold-mid)', opacity: 0.35, fontSize: '1rem' }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Showcase ─── */
function Showcase({ lang }: { lang: string }) {
  const list = [
    { src: '/images/hero-armani.jpg', accent: '#d4722a', name_fr: 'Stronger With You Intensely', name_ar: 'ستيرونغر ويذ يو إنتنسلي', brand: 'Emporio Armani', tag: 'Homme · EDP', href: '/catalogue?gender=homme' },
    { src: '/images/hero-burberry.jpg', accent: '#c9a0b4', name_fr: 'Burberry Her Elixir', name_ar: 'بربري هير إليكسير', brand: 'Burberry', tag: 'Femme · EDP', href: '/catalogue?gender=femme' },
    { src: '/images/hero-jbg.jpg', accent: '#3aaa76', name_fr: 'Le Beau', name_ar: 'لو بو', brand: 'Jean Paul Gaultier', tag: 'Homme · EDT', href: '/catalogue?gender=homme' },
  ];
  return (
    <section style={{ background: 'var(--bg-base)', padding: '4.5rem 0' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.35em', color: 'var(--gold-mid)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {lang === 'ar' ? 'أبرز العطور' : 'Nos Coups de Cœur'}
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem,4vw,2.6rem)', color: 'var(--fg-primary)' }}>
            {lang === 'ar' ? 'العطور المميزة' : 'Fragrances Iconiques'}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {list.map((p, i) => (
            <Link key={i} href={p.href} className="group"
              style={{ textDecoration: 'none', display: 'block', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-gold)', background: 'var(--bg-surface)', transition: 'transform 0.35s ease, box-shadow 0.35s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${p.accent}25`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
              <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
                <Image src={p.src} alt={lang === 'ar' ? p.name_ar : p.name_fr} fill className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                  style={{ transition: 'transform 0.6s ease' }}
                />
                {/* Overlay on hover — CSS only, no blur */}
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${p.accent}30 0%, transparent 50%)`, opacity: 0, transition: 'opacity 0.35s ease' }}
                  className="group-hover:opacity-100" />
              </div>
              <div style={{ padding: '1.1rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', color: p.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{p.brand}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--fg-primary)', marginBottom: '0.3rem', lineHeight: 1.2 }}>
                  {lang === 'ar' ? p.name_ar : p.name_fr}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)' }}>{p.tag}</p>
                <div style={{ height: 1, width: 0, background: p.accent, marginTop: '0.85rem', borderRadius: 1, transition: 'width 0.35s ease' }} className="group-hover:w-full" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main ─── */
export default function HomeClient({ featured, newProducts, categories }: Props) {
  const { lang, t } = useLang();

  return (
    <div style={{ background: 'var(--bg-base)' }}>

      <HeroSection lang={lang} />
      <Marquee />

      {/* Categories */}
      {categories.length > 0 && (
        <section style={{ padding: '4.5rem 0' }}>
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.35em', color: 'var(--gold-mid)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {lang === 'ar' ? 'مجموعاتنا' : 'Collections'}
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem,4vw,2.4rem)', color: 'var(--fg-primary)' }}>
                {t('categories_title')}
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
              {categories.map((cat) => {
                const m = CAT_META[cat.slug] || { emoji: '✨', color: '#c9a227', bg: 'linear-gradient(135deg,#0f1628,#151e36)' };
                return (
                  <Link key={cat.id} href={`/catalogue?category=${cat.slug}`} className="category-card"
                    style={{ background: m.bg, minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 65% 25%, ${m.color}25, transparent)`, borderRadius: 6 }} />
                    <span style={{ fontSize: 24, marginBottom: '0.35rem', display: 'block' }}>{m.emoji}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#fdf8ee', lineHeight: 1.2, position: 'relative' }}>
                      {lang === 'ar' ? cat.name_ar : cat.name_fr}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Showcase with real photos */}
      <Showcase lang={lang} />

      {/* Featured */}
      {featured.length > 0 && (
        <section style={{ background: 'var(--bg-surface)', padding: '4.5rem 0' }}>
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--gold-mid)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  {lang === 'ar' ? 'الأكثر طلباً' : 'Top Ventes'}
                </p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', color: 'var(--fg-primary)' }}>
                  {t('featured_title')}
                </h2>
              </div>
              <Link href="/catalogue?featured=true" style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--gold-dark)', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                className="hidden sm:block">
                {lang === 'ar' ? 'عرض الكل ←' : 'Voir tout →'}
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: '1.1rem' }}>
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* New arrivals */}
      {newProducts.length > 0 && (
        <section style={{ padding: '4.5rem 0' }}>
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--gold-mid)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                {lang === 'ar' ? 'آخر الإضافات' : 'Dernières Arrivées'}
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', color: 'var(--fg-primary)' }}>
                {t('new_title')}
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: '1.1rem' }}>
              {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Why us */}
      <section style={{ background: 'var(--bg-surface)', padding: '3.5rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '🚚', fr: 'Livraison partout au Maroc', ar: 'توصيل لجميع أنحاء المغرب', dfr: 'Délai 24–72h', dar: 'خلال 24–72 ساعة' },
              { icon: '💵', fr: 'Paiement à la livraison', ar: 'الدفع عند الاستلام', dfr: 'Payez en cash', dar: 'ادفع نقداً' },
              { icon: '🌹', fr: 'Sélection haut de gamme', ar: 'اختيار من أرقى العطور', dfr: 'Fragrances authentiques', dar: 'عطور أصيلة' },
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: '0.85rem' }}>{item.icon}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--gold-mid)', marginBottom: '0.4rem' }}>
                  {lang === 'ar' ? item.ar : item.fr}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--fg-muted)' }}>
                  {lang === 'ar' ? item.dar : item.dfr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
