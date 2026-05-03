'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import {
  LayoutDashboard, Package, ShoppingCart,
  Settings, LogOut, Menu, X, Sun, Moon, ExternalLink,
} from 'lucide-react';

const navItems = [
  { href: '/admin',          label: 'Dashboard',  icon: LayoutDashboard, badge: null },
  { href: '/admin/products', label: 'Produits',   icon: Package,         badge: null },
  { href: '/admin/orders',   label: 'Commandes',  icon: ShoppingCart,    badge: 'live' },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings,        badge: null },
];

/*
  COGNAC LEATHER SIDEBAR PALETTE
  Warm dark amber/brown — like a luxury perfume bottle in dark amber glass.
  Always dark so text is always visible regardless of store light/dark mode.
*/
const SB = {
  bg:           'linear-gradient(175deg, #120c06 0%, #1a1008 25%, #150d07 55%, #0a0704 100%)',
  border:       'rgba(201,140,39,0.22)',
  glow1:        'rgba(201,140,39,0.12)',
  glow2:        'rgba(180,110,30,0.07)',
  logoName:     '#e6c97a',
  logoSub:      'rgba(201,162,39,0.50)',
  sectionLabel: 'rgba(230,185,100,0.38)',
  itemDefault:  'rgba(240,220,180,0.50)',  // warm ivory text — always visible on brown
  itemHover:    'rgba(240,220,180,0.92)',
  itemActive:   '#e6c97a',
  itemActiveBg: 'rgba(201,140,39,0.18)',
  itemBorder:   '#c9a227',
  footerText:   'rgba(240,220,180,0.42)', // warm ivory — always visible on brown bg
  footerHover:  'rgba(240,220,180,0.85)',
  logoutHover:  '#f87171',
  divider:      'rgba(201,140,39,0.12)',
  badge:        { bg: 'rgba(201,140,39,0.20)', color: '#ddb84e', border: 'rgba(201,140,39,0.35)' },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { toggle, isLight } = useTheme();
  const [open, setOpen]       = useState(false);
  const [checking, setChecking] = useState(true);
  const [pending, setPending]   = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== '/admin/login') router.push('/admin/login');
      setChecking(false);
    });
    supabase.from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .then(({ count }) => setPending(count || 0));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const logout = async () => { await supabase.auth.signOut(); router.push('/admin/login'); };

  if (pathname === '/admin/login') return <>{children}</>;
  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #c9a227', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const currentPage = navItems.find(n => pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href)));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ══════════════════════════════
          SIDEBAR — store brand colors
          ══════════════════════════════ */}
      <aside
        style={{
          width: 240, minWidth: 240, flexShrink: 0,
          background: SB.bg,
          borderRight: `1px solid ${SB.border}`,
          display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
          transform: open ? 'translateX(0)' : undefined,
          overflow: 'hidden',
        }}
        className={`${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}
      >
        {/* Decorative glow orbs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: `radial-gradient(circle, ${SB.glow1}, transparent)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 40, left: -60, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${SB.glow2}, transparent)`, pointerEvents: 'none' }} />

        {/* ── Logo ── */}
        <div style={{ padding: '1.4rem 1.25rem 1rem', borderBottom: `1px solid ${SB.divider}`, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {/* Logo image */}
              <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(201,162,39,0.3)', position: 'relative', flexShrink: 0 }}>
                <Image src="/images/logo.png" alt="Amine Parfumes" fill className="object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', color: SB.logoName, fontSize: '1.05rem', lineHeight: 1, letterSpacing: '0.04em' }}>
                  Amine
                </p>
                <p style={{ fontFamily: 'var(--font-body)', color: SB.logoSub, fontSize: '0.52rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 1 }}>
                  Administration
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="lg:hidden"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: SB.itemDefault }}>
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ── Nav label ── */}
        <div style={{ padding: '1.1rem 1.25rem 0.4rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.22em', color: SB.sectionLabel, textTransform: 'uppercase' }}>
            Menu
          </p>
        </div>

        {/* ── Nav items ── */}
        <nav style={{ flex: 1, padding: '0 0.6rem', overflowY: 'auto' }}>
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.7rem',
                  padding: '0.62rem 0.9rem',
                  borderRadius: 6, marginBottom: 2,
                  textDecoration: 'none', fontSize: '0.82rem',
                  fontFamily: 'var(--font-body)', letterSpacing: '0.02em',
                  transition: 'all 0.2s ease',
                  color: active ? SB.itemActive : SB.itemDefault,
                  background: active ? SB.itemActiveBg : 'transparent',
                  borderLeft: active ? `2px solid ${SB.itemBorder}` : '2px solid transparent',
                }}>
                <Icon size={15} style={{ flexShrink: 0, opacity: active ? 1 : 0.65 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge === 'live' && pending > 0 && (
                  <span style={{
                    background: SB.badge.bg, color: SB.badge.color,
                    border: `1px solid ${SB.badge.border}`,
                    fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: 100,
                  }}>
                    {pending}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Footer links ── */}
        <div style={{ padding: '0.75rem 0.6rem', borderTop: `1px solid ${SB.divider}`, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Divider line */}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${SB.border}, transparent)`, marginBottom: 4 }} />

          {/* View site */}
          <Link href="/" target="_blank"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.52rem 0.9rem', borderRadius: 6,
              fontFamily: 'var(--font-body)', fontSize: '0.78rem',
              textDecoration: 'none',
              color: SB.footerText,           // ← always readable on dark sidebar
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = SB.footerHover)}
            onMouseLeave={e => (e.currentTarget.style.color = SB.footerText)}
          >
            <ExternalLink size={13} />
            Voir le site
          </Link>

          {/* Logout */}
          <button onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.52rem 0.9rem', borderRadius: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.78rem',
              color: SB.footerText,           // ← always readable on dark sidebar
              width: '100%', textAlign: 'left',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = SB.logoutHover)}
            onMouseLeave={e => (e.currentTarget.style.color = SB.footerText)}
          >
            <LogOut size={13} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* ══════════════════════════════
          MAIN CONTENT
          ══════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, marginLeft: 0 }}
        className="lg:ml-[240px]">

        {/* Top bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 30,
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-gold)',
          padding: '0 1.5rem', height: 56,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          {/* Mobile menu button */}
          <button onClick={() => setOpen(true)} className="lg:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--fg-muted)' }}>
            <Menu size={20} />
          </button>

          {/* Page title */}
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--fg-subtle)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {currentPage?.label || 'Admin'}
            </p>
          </div>

          {/* Theme toggle */}
          <button onClick={toggle}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 100,
              background: 'var(--bg-raised)', border: '1px solid var(--border-gold)',
              color: 'var(--fg-muted)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.68rem',
              letterSpacing: '0.08em', transition: 'all 0.2s ease',
            }}>
            {isLight ? <Moon size={13} /> : <Sun size={13} />}
            <span>{isLight ? 'Dark' : 'Light'}</span>
          </button>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '1.75rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
