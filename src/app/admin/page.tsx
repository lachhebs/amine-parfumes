/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Package, ShoppingCart, TrendingUp, Clock } from 'lucide-react';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  recentOrders: any[];
}

const STATUS_COLORS: Record<string, string> = {
  pending:    'text-yellow-400 bg-yellow-900/20',
  confirmed:  'text-blue-400 bg-blue-900/20',
  processing: 'text-purple-400 bg-purple-900/20',
  shipped:    'text-cyan-400 bg-cyan-900/20',
  delivered:  'text-green-400 bg-green-900/20',
  cancelled:  'text-red-400 bg-red-900/20',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0, totalOrders: 0, pendingOrders: 0, revenue: 0, recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [
        { count: products },
        { count: orders },
        { count: pending },
        { data: recentOrders },
        { data: delivered },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('orders').select('total').eq('status', 'delivered'),
      ]);

      const revenue = delivered?.reduce((s: number, o: any) => s + Number(o.total), 0) || 0;

      setStats({
        totalProducts: products || 0,
        totalOrders: orders || 0,
        pendingOrders: pending || 0,
        revenue,
        recentOrders: recentOrders || [],
      });
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { label: 'Produits', value: stats.totalProducts, icon: Package, href: '/admin/products', color: 'text-blue-400' },
    { label: 'Commandes', value: stats.totalOrders, icon: ShoppingCart, href: '/admin/orders', color: 'text-purple-400' },
    { label: 'En attente', value: stats.pendingOrders, icon: Clock, href: '/admin/orders?status=pending', color: 'text-yellow-400' },
    { label: 'Revenus livrés', value: `${stats.revenue.toFixed(2)} MAD`, icon: TrendingUp, href: '/admin/orders', color: 'text-gold-400' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-cream/90 mb-1">Tableau de bord</h1>
        <p className="font-body text-sm text-cream/40">Vue d&apos;ensemble de votre boutique</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="glass-card p-5 hover:border-gold-500/30 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <c.icon size={20} className={`${c.color} opacity-80`} />
            </div>
            <p className="font-display text-2xl text-cream/90 mb-1">
              {loading ? '—' : c.value}
            </p>
            <p className="font-body text-xs text-cream/40">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="glass-card">
        <div className="p-5 border-b border-gold-800/20 flex items-center justify-between">
          <h2 className="font-body text-sm font-medium text-cream/80">Commandes récentes</h2>
          <Link href="/admin/orders" className="font-body text-xs text-gold-600 hover:text-gold-400 transition-colors">
            Voir tout →
          </Link>
        </div>
        <div className="divide-y divide-gold-800/10">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : stats.recentOrders.length === 0 ? (
            <div className="p-8 text-center font-body text-sm text-cream/30">
              Aucune commande pour l&apos;instant
            </div>
          ) : (
            stats.recentOrders.map((order) => (
              <Link key={order.id} href={`/admin/orders?id=${order.id}`}
                className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm text-gold-400">{order.order_number}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-body uppercase tracking-wide ${STATUS_COLORS[order.status] || 'text-cream/40 bg-white/5'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="font-body text-xs text-cream/50 mt-0.5 truncate">{order.customer_name} · {order.address_city}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-body text-sm text-cream/80">{Number(order.total).toFixed(2)} MAD</p>
                  <p className="font-body text-[10px] text-cream/30">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
