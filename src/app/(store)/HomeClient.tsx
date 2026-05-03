/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/contexts/LangContext';
import ProductCard from '@/components/store/ProductCard';
import type { Product, Category } from '@/types';

interface Props { featured: Product[]; newProducts: Product[]; categories: Category[]; }

/* ─── Hero perfume data ─── */
const HERO_PERFUMES = [
  {
    id: 0,
    src: '/images/hero-armani.jpg',
    name: 'Stronger With You',
    sub: 'Intensely · Emporio Armani',
    mood: 'Chaud & Ambré',
    accent: '#c9601a',
    glow: 'rgba(201,96,26,0.35)',
    tag: 'Homme',
  },
  {
    id: 1,
    src: '/images/hero-burberry.jpg',
    name: 'Burberry Her',
    sub: 'Elixir de Parfum',
    mood: 'Floral & Fruité',
    accent: '#c9a0a0',
    glow: 'rgba(201,160,160,0.3)',
    tag: 'Femme',
  },
  {
    id: 2,
    src: '/images/hero-jbg.jpg',
    name: 'Le Beau',
    sub: 'Jean Paul Gaultier',
    mood: 'Boisé & Exotique',
    accent: '#2d9e6a',
    glow: 'rgba(45,158,106,0.3)',
    tag: 'Homme',
  },
];

/* ─── Category visual map ─── */
const CAT_META: Record<string, { emoji: string; color: string; bg: string }> = {
  'homme':      { emoji: '🏛️', color: '#c9a227', bg: 'linear-gradient(135deg,#0a0e1a,#1a1408)' },
  'femme':      { emoji: '🌸', color: '#f9a8d4', bg: 'linear-gradient(135deg,#1a0a18,#2d0f24)' },
  'mixte':      { emoji: '✨', color: '#e6c97a', bg: 'linear-gradient(135deg,#0f1218,#1a1a20)' },
  'sets-packs': { emoji: '🎁', color: '#86efac', bg: 'linear-gradient(135deg,#060e10,#0a1a14)' },
  'nouveautes': { emoji: '💫', color: '#c4b5fd', bg: 'linear-gradient(135deg,#0d0820,#180d30)' },
  'dupes':      { emoji: '💎', color: '#7dd3fc', bg: 'linear-gradient(135deg,#050e1a,#0a1428)' },
  'decants':    { emoji: '🧪', color: '#fca5a5', bg: 'linear-gradient(135deg,#160808,#200f0f)' },
};

/* ─── Animated hero section ─── */
function HeroSection({ lang }: { lang: string; t: (k: string) => string }) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /* auto-advance */
  useEffect(() => {
    timerRef.current = setTimeout(() => advance((active + 1) % 3), 5000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active]);

  /* mouse parallax */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const fn = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMouseX((e.clientX - rect.left) / rect.width - 0.5);
      setMouseY((e.clientY - rect.top) / rect.height - 0.5);
    };
    el.addEventListener('mousemove', fn);
    return () => el.removeEventListener('mousemove', fn);
  }, []);

  const advance = (next: number) => {
    if (animating) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setAnimating(true);
    setPrev(active);
    setActive(next);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 800);
  };

  const cur = HERO_PERFUMES[active];
  const prv = prev !== null ? HERO_PERFUMES[prev] : null;

  const parallaxStyle = (depth: number) => ({
    transform: `translate(${mouseX * depth}px, ${mouseY * depth}px)`,
    transition: 'transform 0.15s ease-out',
  });

  return (
    <section ref={sectionRef} style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', background: '#05060d' }}>

      {/* ── Background image layers ── */}
      {HERO_PERFUMES.map((p, i) => (
        <div key={p.id} style={{
          position: 'absolute', inset: 0,
          opacity: i === active ? 1 : i === prev ? 0 : 0,
          transition: 'opacity 0.9s ease',
          zIndex: i === active ? 1 : i === prev ? 2 : 0,
        }}>
          {/* Blurred bg */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <Image src={p.src} alt="" fill className="object-cover"
              style={{ filter: 'blur(40px) brightness(0.25) saturate(1.4)', transform: 'scale(1.15)' }}
              priority={i === 0} />
          </div>
          {/* Color overlay tinted to perfume accent */}
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 60% at 70% 50%, ${p.glow} 0%, transparent 65%)` }} />
          {/* Dark vignette */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(5,6,13,0.85) 0%, rgba(5,6,13,0.4) 50%, rgba(5,6,13,0.6) 100%)' }} />
        </div>
      ))}

      {/* ── Content grid ── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full" style={{ position: 'relative', zIndex: 10, paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }} className="grid-cols-1 lg:grid-cols-2">

          {/* LEFT — Text */}
          <div>
            {/* Slide badge */}
            <div key={`badge-${active}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem', animation: 'fadeSlideUp 0.6s ease forwards', opacity: 0 }}>
              <div style={{ height: 1, width: 40, background: `linear-gradient(90deg, transparent, ${cur.accent})` }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.35em', color: cur.accent, textTransform: 'uppercase' }}>
                {cur.tag} · {cur.mood}
              </span>
            </div>

            {/* Main brand name */}
            <div key={`title-${active}`} style={{ overflow: 'hidden', marginBottom: '0.5rem' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem,7vw,5rem)', color: '#fdf8ee', lineHeight: 1, letterSpacing: '-0.02em', animation: 'fadeSlideUp 0.65s ease 0.1s forwards', opacity: 0 }}>
                {cur.name}
              </h1>
            </div>

            {/* Sub name */}
            <div key={`sub-${active}`} style={{ overflow: 'hidden', marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,2.5vw,1.5rem)', color: cur.accent, fontStyle: 'italic', animation: 'fadeSlideUp 0.65s ease 0.2s forwards', opacity: 0 }}>
                {cur.sub}
              </p>
            </div>

            {/* Description */}
            <p key={`desc-${active}`} style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(253,248,238,0.55)', lineHeight: 1.85, maxWidth: 400, marginBottom: '2.5rem', animation: 'fadeSlideUp 0.65s ease 0.3s forwards', opacity: 0 }}>
              {lang === 'ar'
                ? 'اكتشف هذا العطر الاستثنائي من مجموعتنا المختارة. متوفر الآن مع توصيل لجميع أنحاء المغرب.'
                : 'Découvrez ce parfum d\'exception, disponible maintenant dans notre boutique avec livraison partout au Maroc.'}
            </p>

            {/* CTAs */}
            <div key={`ctas-${active}`} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', animation: 'fadeSlideUp 0.65s ease 0.4s forwards', opacity: 0 }}>
              <Link href="/catalogue" className="btn-gold-filled" style={{ fontSize: '0.7rem' }}>
                {lang === 'ar' ? 'تسوق الآن' : 'Commander maintenant'}
              </Link>
              <Link href="/catalogue" className="btn-gold" style={{ fontSize: '0.7rem' }}>
                <span>{lang === 'ar' ? 'عرض الكل' : 'Voir la collection'}</span>
              </Link>
            </div>

            {/* Trust strip */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { icon: '🚚', label: lang === 'ar' ? 'توصيل للمغرب' : 'Livraison Maroc' },
                { icon: '💵', label: lang === 'ar' ? 'دفع عند الاستلام' : 'Paiement livraison' },
                { icon: '✅', label: lang === 'ar' ? 'أصالة مضمونة' : 'Authenticité' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13 }}>{b.icon}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: 'rgba(253,248,238,0.3)', letterSpacing: '0.08em' }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Animated perfume photo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 520 }} className="hidden lg:flex">

            {/* Glow rings behind bottle */}
            <div style={{
              position: 'absolute', width: 360, height: 360, borderRadius: '50%',
              border: `1px solid ${cur.accent}25`,
              top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              animation: 'ringPulse 3s ease-in-out infinite',
              transition: 'border-color 0.9s ease',
            }} />
            <div style={{
              position: 'absolute', width: 260, height: 260, borderRadius: '50%',
              border: `1px solid ${cur.accent}15`,
              top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            }} />
            {/* Glow blob */}
            <div style={{
              position: 'absolute', width: 280, height: 280, borderRadius: '50%',
              background: `radial-gradient(circle, ${cur.glow} 0%, transparent 70%)`,
              top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              transition: 'background 0.9s ease',
              filter: 'blur(30px)',
            }} />

            {/* Outgoing bottle */}
            {prv && (
              <div style={{
                position: 'absolute',
                animation: 'bottleOut 0.8s cubic-bezier(0.4,0,0.2,1) forwards',
                zIndex: 1,
              }}>
                <div style={{ ...parallaxStyle(12), width: 340, height: 420, position: 'relative' }}>
                  <Image src={prv.src} alt={prv.name} fill className="object-contain"
                    style={{ filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.5))' }} />
                </div>
              </div>
            )}

            {/* Active bottle */}
            <div key={`bottle-${active}`} style={{
              position: 'relative', zIndex: 2,
              animation: 'bottleIn 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards',
              opacity: 0,
            }}>
              {/* Floating wrapper */}
              <div style={{ ...parallaxStyle(18), animation: 'floatBottle 6s ease-in-out infinite', width: 340, height: 420, position: 'relative' }}>
                <Image src={cur.src} alt={cur.name} fill className="object-contain"
                  priority
                  style={{ filter: `drop-shadow(0 40px 80px ${cur.glow}) drop-shadow(0 0 60px ${cur.glow})` }} />
              </div>
            </div>

            {/* Floating label */}
            <div key={`label-${active}`} style={{
              position: 'absolute', bottom: 30, right: 0,
              background: 'rgba(5,6,13,0.8)',
              border: `1px solid ${cur.accent}30`,
              backdropFilter: 'blur(12px)',
              padding: '0.75rem 1.25rem',
              borderRadius: 8,
              animation: 'fadeSlideUp 0.7s ease 0.5s forwards',
              opacity: 0,
              minWidth: 160,
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', color: cur.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 3 }}>
                {cur.mood}
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#fdf8ee' }}>
                {cur.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide controls ── */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        {HERO_PERFUMES.map((p, i) => (
          <button key={i} onClick={() => advance(i)}
            style={{
              width: i === active ? 32 : 8,
              height: 8,
              borderRadius: 4,
              background: i === active ? cur.accent : 'rgba(253,248,238,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              padding: 0,
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Side nav arrows ── */}
      {(['prev','next'] as const).map((dir) => (
        <button key={dir}
          onClick={() => advance(dir === 'next' ? (active + 1) % 3 : (active + 2) % 3)}
          style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            [dir === 'prev' ? 'left' : 'right']: '1.5rem',
            zIndex: 20,
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(5,6,13,0.6)',
            border: '1px solid rgba(253,248,238,0.1)',
            color: 'rgba(253,248,238,0.6)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(8px)',
          }}
          className="hidden sm:flex"
        >
          {dir === 'prev' ? '‹' : '›'}
        </button>
      ))}

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bottleIn {
          from { opacity: 0; transform: scale(0.82) translateY(30px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bottleOut {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to   { opacity: 0; transform: scale(0.9) translateY(-20px); }
        }
        @keyframes floatBottle {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes ringPulse {
          0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: 0.6; }
          50%      { transform: translate(-50%,-50%) scale(1.06); opacity: 1; }
        }
        @keyframes particleDrift {
          0%   { transform: translateY(0) scale(1);   opacity:0.7; }
          100% { transform: translateY(-100px) translateX(15px) scale(0); opacity:0; }
        }
      `}</style>
    </section>
  );
}

/* ─── Scrolling marquee of perfume thumbnails ─── */
function PerfumeMarquee() {
  const images = [
    { src: '/images/hero-armani.jpg',   label: 'Stronger With You Intensely' },
    { src: '/images/hero-burberry.jpg', label: 'Burberry Her Elixir' },
    { src: '/images/hero-jbg.jpg',      label: 'Le Beau JPG' },
    { src: '/images/hero-armani.jpg',   label: 'Stronger With You Intensely' },
    { src: '/images/hero-burberry.jpg', label: 'Burberry Her Elixir' },
    { src: '/images/hero-jbg.jpg',      label: 'Le Beau JPG' },
  ];
  return (
    <div style={{ overflow: 'hidden', padding: '2rem 0', borderTop: '1px solid var(--border-gold)', borderBottom: '1px solid var(--border-gold)', background: 'var(--bg-surface)' }}>
      <div style={{ display: 'flex', gap: '2rem', animation: 'marqueeScroll 18s linear infinite', width: 'max-content' }}>
        {images.map((img, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
            <div style={{ width: 52, height: 52, borderRadius: 6, overflow: 'hidden', position: 'relative', border: '1px solid var(--border-gold)' }}>
              <Image src={img.src} alt={img.label} fill className="object-cover" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--fg-muted)', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
              {img.label}
            </span>
            <span style={{ color: 'var(--gold-mid)', opacity: 0.4, fontSize: '1.2rem' }}>✦</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ─── Product showcase with real photo alongside ─── */
function ShowcaseStrip({ lang }: { lang: string }) {
  const perfumes = [
    { src: '/images/hero-armani.jpg', accent: '#c9601a', glow: 'rgba(201,96,26,0.3)',
      name_fr: 'Stronger With You Intensely', name_ar: 'ستيرونغر ويذ يو إنتنسلي',
      brand: 'Emporio Armani', tag_fr: 'Homme · EDP', tag_ar: 'رجالي · EDP',
      href: '/catalogue?gender=homme' },
    { src: '/images/hero-burberry.jpg', accent: '#d4a0a0', glow: 'rgba(212,160,160,0.3)',
      name_fr: 'Burberry Her Elixir', name_ar: 'بربري هير إليكسير',
      brand: 'Burberry', tag_fr: 'Femme · EDP', tag_ar: 'نسائي · EDP',
      href: '/catalogue?gender=femme' },
    { src: '/images/hero-jbg.jpg', accent: '#2d9e6a', glow: 'rgba(45,158,106,0.3)',
      name_fr: 'Le Beau', name_ar: 'لو بو',
      brand: 'Jean Paul Gaultier', tag_fr: 'Homme · EDT', tag_ar: 'رجالي · EDT',
      href: '/catalogue?gender=homme' },
  ];

  return (
    <section style={{ background: 'var(--bg-base)', padding: '5rem 0' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.35em', color: 'var(--gold-mid)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            {lang === 'ar' ? 'أبرز العطور' : 'Nos Coups de Cœur'}
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--fg-primary)' }}>
            {lang === 'ar' ? 'العطور المميزة' : 'Fragrances Iconiques'}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="grid-cols-1 sm:grid-cols-3">
          {perfumes.map((p, i) => (
            <Link key={i} href={p.href}
              style={{ textDecoration: 'none', display: 'block', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-gold)', background: 'var(--bg-surface)', transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)', position: 'relative' }}
              className="group hover:-translate-y-2 hover:shadow-2xl">

              {/* Photo */}
              <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
                <Image src={p.src} alt={lang === 'ar' ? p.name_ar : p.name_fr} fill className="object-cover"
                  style={{ transition: 'transform 0.7s ease' }}
                  sizes="(max-width:768px) 100vw, 33vw" />
                {/* Hover overlay */}
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0, transition: 'opacity 0.4s ease',
                  background: `linear-gradient(to top, ${p.glow} 0%, transparent 60%)`,
                }}
                  className="group-hover:opacity-100" />
                {/* Glow on hover */}
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 120, height: 60, borderRadius: '50%',
                  background: p.glow, filter: 'blur(20px)',
                  opacity: 0, transition: 'opacity 0.4s ease' }}
                  className="group-hover:opacity-100" />
              </div>

              {/* Info */}
              <div style={{ padding: '1.25rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: p.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  {p.brand}
                </p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--fg-primary)', marginBottom: '0.4rem', lineHeight: 1.2 }}>
                  {lang === 'ar' ? p.name_ar : p.name_fr}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--fg-subtle)' }}>
                  {lang === 'ar' ? p.tag_ar : p.tag_fr}
                </p>

                {/* Accent bar */}
                <div style={{ height: 2, width: 0, background: p.accent, marginTop: '1rem', borderRadius: 1, transition: 'width 0.4s ease' }}
                  className="group-hover:w-full" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main export ─── */
export default function HomeClient({ featured, newProducts, categories }: Props) {
  const { lang, t } = useLang();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* 1. Hero with animated real photos */}
      <HeroSection lang={lang} t={t as (k:string)=>string} />

      {/* 2. Scrolling marquee */}
      <PerfumeMarquee />

      {/* 3. Categories grid */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.35em', color: 'var(--gold-mid)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              {lang === 'ar' ? 'مجموعاتنا' : 'Collections'}
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg-primary)' }}>
              {t('categories_title')}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {categories.map((cat) => {
              const meta = CAT_META[cat.slug] || { emoji: '✨', color: '#c9a227', bg: 'linear-gradient(135deg,#0f1628,#151e36)' };
              return (
                <Link key={cat.id} href={`/catalogue?category=${cat.slug}`} className="category-card"
                  style={{ background: meta.bg, minHeight: 130, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.1rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 60% 20%, ${meta.color}30, transparent)`, borderRadius: 6 }} />
                  <span style={{ fontSize: 26, marginBottom: '0.4rem', display: 'block' }}>{meta.emoji}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#fdf8ee', lineHeight: 1.2, position: 'relative' }}>
                    {lang === 'ar' ? cat.name_ar : cat.name_fr}
                  </h3>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Iconic perfume showcase */}
      <ShowcaseStrip lang={lang} />

      {/* 5. Featured products */}
      {featured.length > 0 && (
        <section style={{ background: 'var(--bg-surface)', padding: '5rem 0' }}>
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.3em', color: 'var(--gold-mid)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {lang === 'ar' ? 'الأكثر طلباً' : 'Top Ventes'}
                </p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'var(--fg-primary)' }}>
                  {t('featured_title')}
                </h2>
              </div>
              <Link href="/catalogue?featured=true"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--gold-dark)', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                className="hidden sm:block">
                {lang === 'ar' ? 'عرض الكل ←' : 'Voir tout →'}
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* 6. New arrivals */}
      {newProducts.length > 0 && (
        <section style={{ padding: '5rem 0' }}>
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.3em', color: 'var(--gold-mid)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {lang === 'ar' ? 'آخر الإضافات' : 'Dernières Arrivées'}
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'var(--fg-primary)' }}>
                {t('new_title')}
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* 7. Why us */}
      <section style={{ background: 'var(--bg-surface)', padding: '4rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '🚚', fr: 'Livraison partout au Maroc', ar: 'توصيل لجميع أنحاء المغرب', dfr: 'Délai 24–72h', dar: 'خلال 24–72 ساعة', img: '/images/hero-armani.jpg' },
              { icon: '💵', fr: 'Paiement à la livraison', ar: 'الدفع عند الاستلام', dfr: 'Payez en cash', dar: 'ادفع نقداً', img: '/images/hero-burberry.jpg' },
              { icon: '🌹', fr: 'Sélection haut de gamme', ar: 'اختيار من أرقى العطور', dfr: 'Fragrances authentiques', dar: 'عطور أصيلة', img: '/images/hero-jbg.jpg' },
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                {/* Mini photo bg */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
                  <Image src={item.img} alt="" fill className="object-cover" />
                </div>
                <span style={{ fontSize: 32, display: 'block', marginBottom: '1rem' }}>{item.icon}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold-mid)', marginBottom: '0.5rem' }}>
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
