'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu, X, Sun, Moon, ExternalLink } from 'lucide-react';

const navItems = [
  { href: '/admin',          label: 'Dashboard',  icon: LayoutDashboard, badge: null },
  { href: '/admin/products', label: 'Produits',   icon: Package,         badge: null },
  { href: '/admin/orders',   label: 'Commandes',  icon: ShoppingCart,    badge: 'live' },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings,        badge: null },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { toggle, isLight } = useTheme();
  const [open, setOpen]       = useState(false);
  const [checking, setChecking] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== '/admin/login') router.push('/admin/login');
      setChecking(false);
    });
    supabase.from('orders').select('*', { count: 'exact', head: true })
      .eq('status', 'pending').then(({ count }) => setPendingCount(count || 0));
  }, [pathname, router]);

  const logout = async () => { await supabase.auth.signOut(); router.push('/admin/login'); };

  if (pathname === '/admin/login') return <>{children}</>;
  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--gold-mid)', borderTopColor: 'transparent', animation: 'spinSlow 0.7s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ══ SIDEBAR ══ */}
      <aside className={`admin-sidebar fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ width: 240, minWidth: 240 }}>

        {/* Logo area */}
        <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(201,162,39,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: 32, height: 32, position: 'relative' }}>
                <Image src="/images/logo.png" alt="Logo" fill className="object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)', fontSize: '1rem', lineHeight: 1 }}>
                  Amine
                </p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(201,162,39,0.5)', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                  Admin
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="lg:hidden"
              style={{ color: 'rgba(253,248,238,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Nav section label */}
        <div style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(201,162,39,0.35)', textTransform: 'uppercase' }}>
            Navigation
          </p>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '0 0.75rem' }}>
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`sidebar-item ${active ? 'active' : ''}`}>
                <Icon size={16} style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge === 'live' && pendingCount > 0 && (
                  <span style={{ background: 'rgba(201,162,39,0.2)', color: 'var(--gold-mid)', fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: 100, border: '1px solid rgba(201,162,39,0.3)' }}>
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(201,162,39,0.08)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* View site */}
          <Link href="/" target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.55rem 1rem', color: 'rgba(253,248,238,0.3)', fontFamily: 'var(--font-body)', fontSize: '0.78rem', textDecoration: 'none', borderRadius: 'var(--radius-md)', transition: 'all var(--transition)' }}
            className="hover:bg-white/5">
            <ExternalLink size={14} />
            Voir le site
          </Link>

          {/* Logout */}
          <button onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.55rem 1rem', color: 'rgba(253,248,238,0.3)', fontFamily: 'var(--font-body)', fontSize: '0.78rem', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)', width: '100%', transition: 'all var(--transition)' }}
            className="hover:text-red-400 hover:bg-white/5">
            <LogOut size={14} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* ══ MAIN CONTENT ══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-gold)', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setOpen(true)} className="lg:hidden"
            style={{ color: 'var(--fg-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--fg-subtle)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {navItems.find(n => pathname.startsWith(n.href) || pathname === n.href)?.label || 'Admin'}
            </p>
          </div>

          {/* Theme toggle */}
          <button onClick={toggle}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--bg-raised)', border: '1px solid var(--border-gold)', borderRadius: 100, color: 'var(--fg-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.7rem', transition: 'all var(--transition)' }}>
            {isLight ? <Moon size={13} /> : <Sun size={13} />}
            <span>{isLight ? 'Dark' : 'Light'}</span>
          </button>
        </header>

        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
