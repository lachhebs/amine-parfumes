'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { useCatalogueStore } from '@/contexts/catalogueStore';
import ProductCard from '@/components/store/ProductCard';
import type { Product, Category } from '@/types';

interface Props { products: Product[]; categories: Category[]; }

const GENDERS = [
  { value: 'homme', fr: 'Homme', ar: 'رجالي' },
  { value: 'femme', fr: 'Femme', ar: 'نسائي' },
  { value: 'mixte', fr: 'Mixte', ar: 'مختلط' },
];

const PRICE_RANGES = [
  { fr: 'Tous les prix',    ar: 'كل الأسعار',   min: 0,    max: Infinity },
  { fr: 'Moins de 200 MAD', ar: 'أقل من 200',   min: 0,    max: 200 },
  { fr: '200–500 MAD',      ar: '200–500',       min: 200,  max: 500 },
  { fr: '500–1000 MAD',     ar: '500–1000',      min: 500,  max: 1000 },
  { fr: 'Plus de 1000 MAD', ar: 'أكثر من 1000', min: 1000, max: Infinity },
];

function Inner({ products, categories }: Props) {
  const { lang, t } = useLang();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const {
    category, gender, search, featured, isNew, priceIndex,
    setCategory, setGender, setSearch, setFeatured,
    setIsNew, setPriceIndex, clearAll,
  } = useCatalogueStore();

  /* Sync URL params → store on first load (deep links from homepage categories) */
  useEffect(() => {
    const cat  = searchParams.get('category') || '';
    const gen  = searchParams.get('gender')   || '';
    const feat = searchParams.get('featured') === 'true';
    const q    = searchParams.get('search')   || '';
    if (cat)  setCategory(cat);
    if (gen)  setGender(gen);
    if (feat) setFeatured(true);
    if (q)    setSearch(q);
  // Only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Instant client-side filtering — zero network requests */
  const filtered = useMemo(() => {
    const range = PRICE_RANGES[priceIndex];
    const q = search.toLowerCase().trim();
    return products.filter(p => {
      if (category && p.category?.slug !== category) return false;
      if (gender   && p.gender !== gender)            return false;
      if (isNew    && !p.is_new)                      return false;
      if (featured && !p.is_featured)                 return false;
      if (p.price < range.min || p.price > range.max) return false;
      if (q && !p.name_fr.toLowerCase().includes(q) &&
               !(p.name_ar || '').toLowerCase().includes(q) &&
               !(p.brand   || '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, category, gender, search, priceIndex, isNew, featured]);

  const hasFilters = category || gender || search || featured || isNew || priceIndex > 0;

  const activeCatName = category
    ? categories.find(c => c.slug === category)?.[lang === 'ar' ? 'name_ar' : 'name_fr']
    : null;

  /* ── styles ── */
  const label: React.CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: '0.58rem',
    letterSpacing: '0.22em', textTransform: 'uppercase',
    color: 'var(--gold-400)', marginBottom: '0.5rem', display: 'block',
  };
  const btn = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-body)', fontSize: '0.78rem',
    color: active ? 'var(--gold-400)' : 'var(--fg-muted)',
    background: active ? 'rgba(201,162,39,0.09)' : 'transparent',
    border: active ? '1px solid rgba(201,162,39,0.28)' : '1px solid transparent',
    borderRadius: 4, padding: '0.3rem 0.65rem',
    cursor: 'pointer', width: '100%', textAlign: 'left',
    transition: 'all 0.1s ease',   // faster: 0.1s not 0.3s
  });

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">

        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'0.58rem', letterSpacing:'0.28em', color:'var(--gold-400)', textTransform:'uppercase', marginBottom:'0.35rem' }}>
            amine.parfume
          </p>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.9rem,5vw,3rem)', color:'var(--fg-primary)', lineHeight:1 }}>
              {activeCatName || t('nav_catalogue')}
            </h1>
            <p style={{ fontFamily:'var(--font-body)', fontSize:'0.72rem', color:'var(--fg-subtle)' }}>
              {filtered.length} {lang === 'ar' ? 'منتج' : filtered.length > 1 ? 'produits' : 'produit'}
            </p>
          </div>
        </div>

        {/* Top bar */}
        <div style={{ display:'flex', gap:'0.65rem', marginBottom:'1.5rem', alignItems:'center', flexWrap:'wrap' }}>
          {/* Mobile filter toggle */}
          <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden"
            style={{ display:'flex', alignItems:'center', gap:5, padding:'0.45rem 0.8rem', border:'1px solid var(--border)', borderRadius:4, background: showFilters ? 'rgba(201,162,39,0.08)' : 'transparent', color:'var(--fg-muted)', fontFamily:'var(--font-body)', fontSize:'0.73rem', cursor:'pointer', transition:'all 0.15s' }}>
            <SlidersHorizontal size={13} />
            {lang === 'ar' ? 'فلاتر' : 'Filtres'}
          </button>

          {/* Search */}
          <div style={{ flex:1, position:'relative', maxWidth:300 }}>
            <Search size={12} style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', color:'var(--fg-subtle)', pointerEvents:'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن عطر...' : 'Rechercher...'}
              className="input-luxury"
              style={{ paddingLeft:'1.9rem', fontSize:'0.78rem', height:36 }} />
            {search && (
              <button onClick={() => setSearch('')}
                style={{ position:'absolute', right:7, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--fg-subtle)', display:'flex', padding:2 }}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {category && (
            <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:100, background:'rgba(201,162,39,0.1)', border:'1px solid rgba(201,162,39,0.25)', fontFamily:'var(--font-body)', fontSize:'0.7rem', color:'var(--gold-400)' }}>
              {activeCatName}
              <button onClick={() => setCategory('')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--gold-400)', display:'flex', padding:0 }}><X size={10} /></button>
            </span>
          )}
          {gender && (
            <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:100, background:'rgba(201,162,39,0.1)', border:'1px solid rgba(201,162,39,0.25)', fontFamily:'var(--font-body)', fontSize:'0.7rem', color:'var(--gold-400)' }}>
              {GENDERS.find(g => g.value === gender)?.[lang === 'ar' ? 'ar' : 'fr']}
              <button onClick={() => setGender('')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--gold-400)', display:'flex', padding:0 }}><X size={10} /></button>
            </span>
          )}

          {hasFilters && (
            <button onClick={clearAll}
              style={{ display:'flex', alignItems:'center', gap:3, padding:'4px 10px', border:'1px solid rgba(239,68,68,0.28)', borderRadius:100, background:'rgba(239,68,68,0.06)', color:'#f87171', fontFamily:'var(--font-body)', fontSize:'0.68rem', cursor:'pointer', whiteSpace:'nowrap' }}>
              <X size={10} />
              {lang === 'ar' ? 'مسح الكل' : 'Tout effacer'}
            </button>
          )}
        </div>

        <div style={{ display:'flex', gap:'1.75rem', alignItems:'flex-start' }}>

          {/* ── Sidebar ── */}
          <aside className={`${showFilters ? 'flex' : 'hidden'} lg:flex`}
            style={{ flexDirection:'column', gap:'1.25rem', width:188, flexShrink:0 }}>

            {/* Categories */}
            <div>
              <span style={label}>{lang === 'ar' ? 'الفئات' : 'Catégories'}</span>
              <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                <button style={btn(!category)} onClick={() => setCategory('')}>
                  {lang === 'ar' ? 'الكل' : 'Tous'}
                </button>
                {categories.map(c => (
                  <button key={c.id} style={btn(category === c.slug)}
                    onClick={() => setCategory(category === c.slug ? '' : c.slug)}>
                    {lang === 'ar' ? c.name_ar : c.name_fr}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <span style={label}>{t('gender')}</span>
              <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                <button style={btn(!gender)} onClick={() => setGender('')}>
                  {lang === 'ar' ? 'الكل' : 'Tous'}
                </button>
                {GENDERS.map(g => (
                  <button key={g.value} style={btn(gender === g.value)}
                    onClick={() => setGender(gender === g.value ? '' : g.value)}>
                    {lang === 'ar' ? g.ar : g.fr}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <span style={label}>{lang === 'ar' ? 'السعر' : 'Prix'}</span>
              <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                {PRICE_RANGES.map((r, i) => (
                  <button key={i} style={btn(priceIndex === i)}
                    onClick={() => setPriceIndex(priceIndex === i && i !== 0 ? 0 : i)}>
                    {lang === 'ar' ? r.ar : r.fr}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <span style={label}>{lang === 'ar' ? 'خيارات' : 'Options'}</span>
              <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                <button style={btn(isNew)} onClick={() => setIsNew(!isNew)}>
                  ✨ {lang === 'ar' ? 'جديد فقط' : 'Nouveautés'}
                </button>
                <button style={btn(featured)} onClick={() => setFeatured(!featured)}>
                  ⭐ {lang === 'ar' ? 'الأكثر طلباً' : 'Meilleures ventes'}
                </button>
              </div>
            </div>
          </aside>

          {/* ── Grid ── */}
          <div style={{ flex:1, minWidth:0 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign:'center', padding:'5rem 1rem' }}>
                <span style={{ fontSize:36, display:'block', marginBottom:'1rem', opacity:0.25 }}>🌸</span>
                <p style={{ fontFamily:'var(--font-body)', color:'var(--fg-subtle)', fontSize:'0.88rem' }}>
                  {lang === 'ar' ? 'لا توجد منتجات' : 'Aucun produit trouvé'}
                </p>
                {hasFilters && (
                  <button onClick={clearAll}
                    style={{ marginTop:'0.85rem', fontFamily:'var(--font-body)', fontSize:'0.73rem', color:'var(--gold-400)', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>
                    {lang === 'ar' ? 'مسح الفلاتر' : 'Effacer les filtres'}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(182px, 1fr))', gap:'0.9rem' }}>
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogueClient(props: Props) {
  return <Suspense><Inner {...props} /></Suspense>;
}
