'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/cartStore';

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const { toggle, isLight } = useTheme();
  const count = useCart((s) => s.count());
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { href: '/', label: t('nav_home') },
    { href: '/catalogue', label: t('nav_catalogue') },
    { href: '/catalogue?gender=homme', label: lang === 'ar' ? 'رجالي' : 'Homme' },
    { href: '/catalogue?gender=femme', label: lang === 'ar' ? 'نسائي' : 'Femme' },
    { href: '/catalogue?category=dupes', label: 'Dupes' },
    { href: '/catalogue?category=sets-packs', label: 'Sets' },
    { href: '/#contact', label: t('nav_contact') },
  ];

  const navBg = scrolled ? (isLight ? 'shadow-sm border-b' : 'border-b') : '';
  const navBgStyle = scrolled
    ? isLight
      ? { background: '#fdf8f0', borderColor: 'rgba(133,97,24,0.2)' }
      : { background: '#0a0e1a', borderColor: 'rgba(201,162,39,0.2)' }
    : { background: 'transparent' };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg} py-3`}
      style={navBgStyle}
    >
      <nav className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-3">
          <div className="w-9 h-9 relative">
            <Image src="/images/logo.png" alt="Amine Parfumes" fill className="object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-mid)', fontSize: '1.1rem', lineHeight: 1, letterSpacing: '0.05em' }}>
              Amine
            </p>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-dark)', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              Parfumes
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-6 flex-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--fg-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
                className="hover:text-[var(--gold-mid)] transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Theme toggle */}
          <button onClick={toggle} aria-label="Toggle theme"
            style={{ color: 'var(--fg-muted)', transition: 'color 0.2s' }}
            className="hover:text-[var(--gold-mid)] transition-colors p-1">
            {isLight ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* Lang toggle */}
          <button onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            className="flex items-center gap-1 transition-colors p-1"
            style={{ color: 'var(--fg-muted)', fontSize: '0.72rem', fontFamily: 'var(--font-body)', letterSpacing: '0.1em' }}>
            <Globe size={14} />
            <span className="hidden sm:inline">{lang === 'fr' ? 'عربي' : 'FR'}</span>
          </button>

          {/* Cart */}
          <Link href="/cart" className="relative p-1 transition-colors"
            style={{ color: 'var(--fg-muted)' }}>
            <ShoppingBag size={19} className="hover:text-[var(--gold-mid)]" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: 'var(--gold-mid)', color: '#0a0e1a', fontSize: '9px', fontWeight: 700 }}>
                {count}
              </span>
            )}
          </Link>

          {/* Mobile menu */}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-1 transition-colors"
            style={{ color: 'var(--fg-muted)' }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t px-4 py-5 space-y-3"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-gold)' }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block py-2 transition-colors"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--fg-muted)', letterSpacing: '0.1em' }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
