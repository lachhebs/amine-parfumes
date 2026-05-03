/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Upload, Check } from 'lucide-react';
import type { Product, Category } from '@/types';

const EMPTY_PRODUCT = {
  name_fr: '', name_ar: '', description_fr: '', description_ar: '',
  price: '', original_price: '', stock: '', sku: '', brand: '',
  gender: 'mixte', size_ml: '', concentration: 'EDP',
  category_id: '', is_featured: false, is_new: false, is_active: true,
  notes_top: '', notes_heart: '', notes_base: '',
  images: [] as string[], thumbnail: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<typeof EMPTY_PRODUCT>({ ...EMPTY_PRODUCT });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*, category:categories(name_fr)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setProducts(prods || []);
    setCategories(cats || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditProduct(null);
    setForm({ ...EMPTY_PRODUCT });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name_fr: p.name_fr, name_ar: p.name_ar,
      description_fr: p.description_fr || '', description_ar: p.description_ar || '',
      price: String(p.price), original_price: p.original_price ? String(p.original_price) : '',
      stock: String(p.stock), sku: p.sku || '', brand: p.brand || '',
      gender: p.gender, size_ml: p.size_ml ? String(p.size_ml) : '',
      concentration: p.concentration || 'EDP',
      category_id: p.category_id || '',
      is_featured: p.is_featured, is_new: p.is_new, is_active: p.is_active,
      notes_top: p.notes_top?.join(', ') || '',
      notes_heart: p.notes_heart?.join(', ') || '',
      notes_base: p.notes_base?.join(', ') || '',
      images: p.images || [], thumbnail: p.thumbnail || '',
    });
    setShowForm(true);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) {
      setForm((f) => ({
        ...f,
        thumbnail: f.thumbnail || data.url,
        images: [...f.images, data.url],
      }));
    } else {
      toast.error('Upload failed');
    }
  };

  const handleSave = async () => {
    if (!form.name_fr || !form.price) {
      toast.error('Nom et prix obligatoires');
      return;
    }
    setSaving(true);

    const payload: any = {
      name_fr: form.name_fr, name_ar: form.name_ar,
      description_fr: form.description_fr || null,
      description_ar: form.description_ar || null,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      stock: parseInt(form.stock) || 0,
      sku: form.sku || null, brand: form.brand || null,
      gender: form.gender, size_ml: form.size_ml ? parseInt(form.size_ml) : null,
      concentration: form.concentration || null,
      category_id: form.category_id || null,
      is_featured: form.is_featured, is_new: form.is_new, is_active: form.is_active,
      notes_top: form.notes_top ? form.notes_top.split(',').map((s) => s.trim()).filter(Boolean) : [],
      notes_heart: form.notes_heart ? form.notes_heart.split(',').map((s) => s.trim()).filter(Boolean) : [],
      notes_base: form.notes_base ? form.notes_base.split(',').map((s) => s.trim()).filter(Boolean) : [],
      images: form.images, thumbnail: form.thumbnail || form.images[0] || null,
    };

    if (!editProduct) {
      payload.slug = form.name_fr.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);
    }

    let error;
    if (editProduct) {
      const { error: e } = await supabase.from('products').update(payload).eq('id', editProduct.id);
      error = e;
    } else {
      const { error: e } = await supabase.from('products').insert(payload);
      error = e;
    }

    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editProduct ? 'Produit mis à jour' : 'Produit créé');
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Produit supprimé');
    load();
  };

  const toggleActive = async (p: Product) => {
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-cream/90 mb-1">Produits</h1>
          <p className="font-body text-sm text-cream/40">{products.length} produits au total</p>
        </div>
        <button onClick={openNew} className="btn-gold-filled flex items-center gap-2">
          <Plus size={16} />
          Nouveau produit
        </button>
      </div>

      {/* Products table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-800/20">
                {['Image','Nom','Prix','Stock','Statut','Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-body text-xs text-gold-700 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-800/10">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-10 h-12 bg-navy-700 overflow-hidden">
                      {p.thumbnail && <Image src={p.thumbnail} alt="" fill className="object-cover" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-body text-sm text-cream/80">{p.name_fr}</p>
                    <p className="font-body text-xs text-cream/40">{p.brand}</p>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-gold-400">{Number(p.price).toFixed(2)} MAD</td>
                  <td className="px-4 py-3">
                    <span className={`font-body text-xs px-2 py-0.5 ${p.stock > 0 ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(p)}
                      className={`flex items-center gap-1.5 font-body text-xs px-2 py-0.5 transition-colors ${
                        p.is_active ? 'text-green-400 bg-green-900/20' : 'text-cream/30 bg-white/5'
                      }`}>
                      {p.is_active ? <><Check size={11} /> Actif</> : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)}
                        className="text-cream/40 hover:text-gold-400 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="text-cream/40 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl glass-card my-8">
            <div className="flex items-center justify-between p-6 border-b border-gold-800/20">
              <h2 className="font-display text-xl text-cream/90">
                {editProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-cream/40 hover:text-cream">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-xs text-cream/40 mb-1.5">Nom (FR) *</label>
                  <input value={form.name_fr} onChange={(e) => setForm({...form, name_fr: e.target.value})}
                    className="input-luxury" />
                </div>
                <div>
                  <label className="block font-body text-xs text-cream/40 mb-1.5">الاسم (AR)</label>
                  <input value={form.name_ar} dir="rtl" onChange={(e) => setForm({...form, name_ar: e.target.value})}
                    className="input-luxury text-right" />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-xs text-cream/40 mb-1.5">Description (FR)</label>
                  <textarea value={form.description_fr}
                    onChange={(e) => setForm({...form, description_fr: e.target.value})}
                    className="input-luxury resize-none h-20" />
                </div>
                <div>
                  <label className="block font-body text-xs text-cream/40 mb-1.5">الوصف (AR)</label>
                  <textarea value={form.description_ar} dir="rtl"
                    onChange={(e) => setForm({...form, description_ar: e.target.value})}
                    className="input-luxury resize-none h-20 text-right" />
                </div>
              </div>

              {/* Price / Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-body text-xs text-cream/40 mb-1.5">Prix (MAD) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})}
                    className="input-luxury" />
                </div>
                <div>
                  <label className="block font-body text-xs text-cream/40 mb-1.5">Prix barré</label>
                  <input type="number" value={form.original_price}
                    onChange={(e) => setForm({...form, original_price: e.target.value})}
                    className="input-luxury" />
                </div>
                <div>
                  <label className="block font-body text-xs text-cream/40 mb-1.5">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})}
                    className="input-luxury" />
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-xs text-cream/40 mb-1.5">Marque / Inspiré de</label>
                  <input value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})}
                    className="input-luxury" />
                </div>
                <div>
                  <label className="block font-body text-xs text-cream/40 mb-1.5">SKU</label>
                  <input value={form.sku} onChange={(e) => setForm({...form, sku: e.target.value})}
                    className="input-luxury" />
                </div>
              </div>

              {/* Category / Gender / Size */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block font-body text-xs text-cream/40 mb-1.5">Catégorie</label>
                  <select value={form.category_id} onChange={(e) => setForm({...form, category_id: e.target.value})}
                    className="input-luxury">
                    <option value="">—</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name_fr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs text-cream/40 mb-1.5">Genre</label>
                  <select value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value as any})}
                    className="input-luxury">
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="mixte">Mixte</option>
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs text-cream/40 mb-1.5">Taille (ml)</label>
                  <input type="number" value={form.size_ml}
                    onChange={(e) => setForm({...form, size_ml: e.target.value})}
                    className="input-luxury" />
                </div>
                <div>
                  <label className="block font-body text-xs text-cream/40 mb-1.5">Concentration</label>
                  <select value={form.concentration}
                    onChange={(e) => setForm({...form, concentration: e.target.value})}
                    className="input-luxury">
                    {['EDP','EDT','EDC','Parfum','Huile'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'notes_top', label: 'Notes de tête' },
                  { key: 'notes_heart', label: 'Notes de cœur' },
                  { key: 'notes_base', label: 'Notes de fond' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block font-body text-xs text-cream/40 mb-1.5">{label}</label>
                    <input value={(form as unknown as Record<string, string>)[key]}
                      onChange={(e) => setForm({...form, [key]: e.target.value})}
                      placeholder="Rose, Oud, Vanille…"
                      className="input-luxury text-xs" />
                    <p className="font-body text-[10px] text-cream/25 mt-1">Séparés par virgule</p>
                  </div>
                ))}
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                {[
                  { key: 'is_featured', label: 'Vedette' },
                  { key: 'is_new', label: 'Nouveauté' },
                  { key: 'is_active', label: 'Actif' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setForm({...form, [key]: !(form as unknown as Record<string, boolean>)[key]})}
                      className={`w-9 h-5 rounded-full transition-colors ${
                        (form as unknown as Record<string, boolean>)[key] ? 'bg-gold-600' : 'bg-navy-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white m-0.5 transition-transform ${
                        (form as unknown as Record<string, boolean>)[key] ? 'translate-x-4' : ''
                      }`} />
                    </div>
                    <span className="font-body text-xs text-cream/60">{label}</span>
                  </label>
                ))}
              </div>

              {/* Images */}
              <div>
                <label className="block font-body text-xs text-cream/40 mb-1.5">Images produit</label>
                <div className="flex gap-3 flex-wrap mb-3">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 border border-gold-800/30">
                      <Image src={url} alt="" fill className="object-cover" />
                      <button
                        onClick={() => setForm((f) => ({
                          ...f, images: f.images.filter((_, idx) => idx !== i),
                          thumbnail: f.thumbnail === url ? (f.images.find((u) => u !== url) || '') : f.thumbnail,
                        }))}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center"
                      >×</button>
                    </div>
                  ))}
                  <label className="w-16 h-16 border border-dashed border-gold-800/40 flex items-center justify-center cursor-pointer hover:border-gold-500/50 transition-colors">
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={16} className="text-cream/30" />
                    )}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gold-800/20">
              <button onClick={() => setShowForm(false)}
                className="font-body text-sm text-cream/50 hover:text-cream px-4 py-2 transition-colors">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-gold-filled">
                {saving ? 'Enregistrement…' : editProduct ? 'Mettre à jour' : 'Créer le produit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}