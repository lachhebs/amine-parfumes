/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { X, Phone, MapPin, Calendar } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending',    label: 'En attente',     color: 'text-yellow-400 bg-yellow-900/20 border-yellow-800/40' },
  { value: 'confirmed',  label: 'Confirmée',      color: 'text-blue-400 bg-blue-900/20 border-blue-800/40' },
  { value: 'processing', label: 'En préparation', color: 'text-purple-400 bg-purple-900/20 border-purple-800/40' },
  { value: 'shipped',    label: 'Expédiée',       color: 'text-cyan-400 bg-cyan-900/20 border-cyan-800/40' },
  { value: 'delivered',  label: 'Livrée',         color: 'text-green-400 bg-green-900/20 border-green-800/40' },
  { value: 'cancelled',  label: 'Annulée',        color: 'text-red-400 bg-red-900/20 border-red-800/40' },
  { value: 'refunded',   label: 'Remboursée',     color: 'text-gray-400 bg-gray-900/20 border-gray-800/40' },
];

function getStatusStyle(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.color ||
    'text-cream/40 bg-white/5 border-white/10';
}

function getStatusLabel(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label || status;
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || '');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = async () => {
    setLoading(true);
    let q = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (filterStatus) q = q.eq('status', filterStatus);
    if (search) q = q.or(`customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%,order_number.ilike.%${search}%`);
    const { data } = await q;
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filterStatus, search]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingStatus(true);
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) { toast.error(error.message); setUpdatingStatus(false); return; }

    await supabase.from('order_status_history').insert({
      order_id: orderId, status,
      note: `Statut changé en: ${getStatusLabel(status)}`,
    });

    toast.success(`Statut mis à jour: ${getStatusLabel(status)}`);
    if (selected?.id === orderId) setSelected({ ...selected, status });
    setUpdatingStatus(false);
    load();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-cream/90 mb-1">Commandes</h1>
        <p className="font-body text-sm text-cream/40">
          {orders.length} commande{orders.length > 1 ? 's' : ''}
          {filterStatus ? ` · ${getStatusLabel(filterStatus)}` : ''}
        </p>
      </div>

      {/* Status filter bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterStatus('')}
          className={`font-body text-xs px-3 py-1.5 border transition-colors ${
            !filterStatus ? 'border-gold-500 text-gold-400 bg-gold-900/20' : 'border-gold-800/30 text-cream/50 hover:border-gold-700/50'
          }`}
        >
          Toutes ({orders.length})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilterStatus(filterStatus === s.value ? '' : s.value)}
            className={`font-body text-xs px-3 py-1.5 border transition-colors ${
              filterStatus === s.value ? s.color : 'border-gold-800/30 text-cream/50 hover:border-gold-700/50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom, téléphone, numéro…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-luxury max-w-sm text-sm"
        />
      </div>

      {/* Orders table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-800/20">
                {['N° Commande','Client','Ville','Total','Statut','Date','Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-body text-xs text-gold-700 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-800/10">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center font-body text-sm text-cream/30">
                  Aucune commande trouvée
                </td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-body text-sm text-gold-400 font-medium">{order.order_number}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-body text-sm text-cream/80">{order.customer_name}</p>
                    <p className="font-body text-xs text-cream/40">{order.customer_phone}</p>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-cream/60">{order.address_city}</td>
                  <td className="px-4 py-3 font-body text-sm font-semibold text-cream/80">
                    {Number(order.total).toFixed(2)} MAD
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-[11px] font-body border ${getStatusStyle(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-cream/40 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(order)}
                      className="font-body text-xs text-gold-600 hover:text-gold-400 transition-colors"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg bg-navy-800 border-l border-gold-800/20 
                          overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-navy-800 border-b border-gold-800/20 p-6 flex items-center justify-between z-10">
              <div>
                <p className="font-body text-xs text-gold-600 uppercase tracking-widest mb-1">Commande</p>
                <h2 className="font-display text-2xl text-gold-400">{selected.order_number}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-cream/40 hover:text-cream p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              {/* Status updater */}
              <div className="glass-card p-4">
                <p className="font-body text-xs text-gold-600 uppercase tracking-wider mb-3">
                  Changer le statut
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      disabled={updatingStatus || selected.status === s.value}
                      onClick={() => updateStatus(selected.id, s.value)}
                      className={`font-body text-xs px-3 py-1.5 border transition-all disabled:opacity-50 ${
                        selected.status === s.value
                          ? s.color + ' font-semibold'
                          : 'border-gold-800/30 text-cream/50 hover:border-gold-700/50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer info */}
              <div className="glass-card p-4 space-y-3">
                <p className="font-body text-xs text-gold-600 uppercase tracking-wider mb-3">Client</p>
                <div className="flex items-center gap-3 text-cream/70">
                  <Phone size={13} className="text-gold-700 flex-shrink-0" />
                  <span className="font-body text-sm">{selected.customer_name} · {selected.customer_phone}</span>
                </div>
                {selected.customer_email && (
                  <div className="flex items-center gap-3 text-cream/70">
                    <span className="text-xs text-gold-700 w-[13px] flex-shrink-0">@</span>
                    <span className="font-body text-sm">{selected.customer_email}</span>
                  </div>
                )}
                <div className="flex items-start gap-3 text-cream/70">
                  <MapPin size={13} className="text-gold-700 flex-shrink-0 mt-0.5" />
                  <div className="font-body text-sm">
                    <p>{selected.address_street}</p>
                    <p>{selected.address_city}{selected.address_zip ? `, ${selected.address_zip}` : ''}</p>
                    {selected.address_notes && (
                      <p className="text-cream/40 text-xs mt-1 italic">{selected.address_notes}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order items */}
              <div className="glass-card p-4">
                <p className="font-body text-xs text-gold-600 uppercase tracking-wider mb-4">
                  Articles commandés
                </p>
                <div className="space-y-3">
                  {(selected.items as any[]).map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 pb-3 border-b border-gold-800/10 last:border-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-cream/80 truncate">{item.name}</p>
                        <p className="font-body text-xs text-cream/40">
                          {item.qty} × {Number(item.price).toFixed(2)} MAD
                        </p>
                      </div>
                      <span className="font-body text-sm font-medium text-cream/70 flex-shrink-0">
                        {(item.qty * item.price).toFixed(2)} MAD
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="glass-card p-4 space-y-2">
                <div className="flex justify-between font-body text-sm text-cream/60">
                  <span>Sous-total</span>
                  <span>{Number(selected.subtotal).toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between font-body text-sm text-cream/60">
                  <span>Livraison</span>
                  <span>{Number(selected.shipping_cost) === 0 ? 'Gratuite' : `${Number(selected.shipping_cost).toFixed(2)} MAD`}</span>
                </div>
                <div className="divider-gold" />
                <div className="flex justify-between font-body font-bold text-base">
                  <span className="text-cream/80">Total</span>
                  <span className="text-gold-400">{Number(selected.total).toFixed(2)} MAD</span>
                </div>
                <p className="font-body text-xs text-cream/30 uppercase tracking-wider mt-2">
                  💵 Paiement à la livraison
                </p>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-cream/30">
                <Calendar size={12} />
                <p className="font-body text-xs">
                  Commandé le {new Date(selected.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}
