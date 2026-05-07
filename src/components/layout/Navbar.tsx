'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/cartStore';
import { useCatalogueStore } from '@/contexts/catalogueStore';

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const { toggle, isLight }  = useTheme();
  const count    = useCart((s) => s.count());
  const router   = useRouter();
  const pathname = usePathname();
  const { setCategory, setGender, clearAll } = useCatalogueStore();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* Navigate to catalogue with a filter — instant if already on /catalogue */
  const goFilter = (type: 'category' | 'gender' | 'clear', value?: string) => {
    setOpen(false);
    // Set the filter state instantly
    clearAll();
    if (type === 'category' && value) setCategory(value);
    if (type === 'gender'   && value) setGender(value);
    // Only navigate if not already on catalogue
    if (!pathname.startsWith('/catalogue')) {
      router.push('/catalogue');
    }
  };

  const navBg = scrolled ? (isLight ? 'shadow-sm border-b' : 'border-b') : '';
  const navBgStyle = scrolled
    ? isLight
      ? { background: '#fdf6eb', borderColor: 'rgba(133,97,24,0.2)' }
      : { background: '#080b14', borderColor: 'rgba(201,162,39,0.18)' }
    : { background: 'transparent' };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg} py-3`}
      style={navBgStyle}
    >
      <nav className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
          <div className="w-9 h-9 relative rounded-full overflow-hidden" style={{ border: '1px solid rgba(201,162,39,0.25)' }}>
            <Image src="/images/logo.png" alt="Amine Parfumes" fill className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-400)', fontSize: '1.05rem', lineHeight: 1, letterSpacing: '0.05em' }}>
              Amine
            </p>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-600)', fontSize: '0.55rem', letterSpacing: '0.28em', textTransform: 'uppercase', marginTop: 1 }}>
              Parfumes
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-5 flex-1 mx-4">
          <li>
            <Link href="/" style={{ fontFamily:'var(--font-body)', fontSize:'0.68rem', color:'var(--fg-muted)', letterSpacing:'0.14em', textTransform:'uppercase', textDecoration:'none', transition:'color 0.15s' }}
              className="hover:text-[var(--gold-400)]">
              {t('nav_home')}
            </Link>
          </li>
          {/* These use goFilter for instant switching */}
          {[
            { label: t('nav_catalogue'), type: 'clear' as const, value: undefined },
            { label: lang === 'ar' ? 'رجالي' : 'Homme', type: 'gender' as const, value: 'homme' },
            { label: lang === 'ar' ? 'نسائي' : 'Femme', type: 'gender' as const, value: 'femme' },
            { label: 'Dupes',  type: 'category' as const, value: 'dupes' },
            { label: 'Sets',   type: 'category' as const, value: 'sets-packs' },
            { label: lang === 'ar' ? 'ديكانت' : 'Décants', type: 'category' as const, value: 'decants' },
          ].map((item) => (
            <li key={item.label}>
              <button
                onClick={() => goFilter(item.type, item.value)}
                style={{ fontFamily:'var(--font-body)', fontSize:'0.68rem', color:'var(--fg-muted)', letterSpacing:'0.14em', textTransform:'uppercase', background:'none', border:'none', cursor:'pointer', padding:0, transition:'color 0.15s' }}
                className="hover:text-[var(--gold-400)]">
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <Link href="/#contact" style={{ fontFamily:'var(--font-body)', fontSize:'0.68rem', color:'var(--fg-muted)', letterSpacing:'0.14em', textTransform:'uppercase', textDecoration:'none', transition:'color 0.15s' }}
              className="hover:text-[var(--gold-400)]">
              {t('nav_contact')}
            </Link>
          </li>
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3 ml-auto">
          <button onClick={toggle} aria-label="Toggle theme"
            style={{ color:'var(--fg-muted)', background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', transition:'color 0.15s' }}
            className="hover:text-[var(--gold-400)]">
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            style={{ display:'flex', alignItems:'center', gap:4, color:'var(--fg-muted)', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.68rem', letterSpacing:'0.1em', transition:'color 0.15s' }}
            className="hover:text-[var(--gold-400)]">
            <Globe size={14} />
            <span className="hidden sm:inline">{lang === 'fr' ? 'عربي' : 'FR'}</span>
          </button>

          <Link href="/cart" className="relative"
            style={{ color:'var(--fg-muted)', display:'flex', transition:'color 0.15s' }}
            aria-label="Cart">
            <ShoppingBag size={18} className="hover:text-[var(--gold-400)]" />
            {count > 0 && (
              <span style={{ position:'absolute', top:-6, right:-6, width:16, height:16, borderRadius:'50%', background:'var(--gold-400)', color:'#080b14', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {count}
              </span>
            )}
          </Link>

          <button onClick={() => setOpen(!open)} className="lg:hidden"
            style={{ color:'var(--fg-muted)', background:'none', border:'none', cursor:'pointer', padding:4, display:'flex' }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{ background:'var(--bg-surface)', borderTop:'1px solid var(--border)', padding:'1.25rem 1rem' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            <Link href="/" onClick={() => setOpen(false)}
              style={{ fontFamily:'var(--font-body)', fontSize:'0.85rem', color:'var(--fg-muted)', padding:'0.6rem 0.5rem', textDecoration:'none', borderRadius:4 }}>
              {t('nav_home')}
            </Link>
            {[
              { label: t('nav_catalogue'), type: 'clear' as const, value: undefined },
              { label: lang === 'ar' ? 'رجالي' : 'Homme', type: 'gender' as const, value: 'homme' },
              { label: lang === 'ar' ? 'نسائي' : 'Femme', type: 'gender' as const, value: 'femme' },
              { label: 'Dupes & Inspirations', type: 'category' as const, value: 'dupes' },
              { label: 'Sets & Packs', type: 'category' as const, value: 'sets-packs' },
              { label: lang === 'ar' ? 'ديكانتات' : 'Décants', type: 'category' as const, value: 'decants' },
            ].map((item) => (
              <button key={item.label}
                onClick={() => goFilter(item.type, item.value)}
                style={{ fontFamily:'var(--font-body)', fontSize:'0.85rem', color:'var(--fg-muted)', padding:'0.6rem 0.5rem', background:'none', border:'none', cursor:'pointer', textAlign:'left', borderRadius:4 }}>
                {item.label}
              </button>
            ))}
            <Link href="/#contact" onClick={() => setOpen(false)}
              style={{ fontFamily:'var(--font-body)', fontSize:'0.85rem', color:'var(--fg-muted)', padding:'0.6rem 0.5rem', textDecoration:'none', borderRadius:4 }}>
              {t('nav_contact')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
