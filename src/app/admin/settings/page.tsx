/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    shipping_standard: '30',
    shipping_free_above: '500',
    phone: '+212 6XX XXX XXX',
    email: 'contact@amineparfumes.ma',
    city: 'Agadir, Maroc',
    instagram: '',
    facebook: '',
    whatsapp: '',
    hero_title_fr: 'Créations d\'Exception',
    hero_title_ar: 'إبداعات استثنائية',
    hero_subtitle_fr: 'Découvrez notre collection de parfums exclusifs',
    hero_subtitle_ar: 'اكتشف مجموعتنا من العطور الحصرية',
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('settings').select('*');
      if (!data) return;
      const map: Record<string, any> = {};
      data.forEach((row) => { map[row.key] = row.value; });

      setSettings((prev) => ({
        ...prev,
        shipping_standard: String(map.shipping_cost?.standard ?? prev.shipping_standard),
        shipping_free_above: String(map.shipping_cost?.free_above ?? prev.shipping_free_above),
        phone: map.contact?.phone ?? prev.phone,
        email: map.contact?.email ?? prev.email,
        city: map.contact?.city ?? prev.city,
        instagram: map.social?.instagram ?? prev.instagram,
        facebook: map.social?.facebook ?? prev.facebook,
        whatsapp: map.social?.whatsapp ?? prev.whatsapp,
        hero_title_fr: map.hero_banner?.title_fr ?? prev.hero_title_fr,
        hero_title_ar: map.hero_banner?.title_ar ?? prev.hero_title_ar,
        hero_subtitle_fr: map.hero_banner?.subtitle_fr ?? prev.hero_subtitle_fr,
        hero_subtitle_ar: map.hero_banner?.subtitle_ar ?? prev.hero_subtitle_ar,
      }));
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    const updates = [
      {
        key: 'shipping_cost',
        value: { standard: Number(settings.shipping_standard), free_above: Number(settings.shipping_free_above) },
      },
      {
        key: 'contact',
        value: { phone: settings.phone, email: settings.email, city: settings.city },
      },
      {
        key: 'social',
        value: { instagram: settings.instagram, facebook: settings.facebook, whatsapp: settings.whatsapp },
      },
      {
        key: 'hero_banner',
        value: {
          title_fr: settings.hero_title_fr, title_ar: settings.hero_title_ar,
          subtitle_fr: settings.hero_subtitle_fr, subtitle_ar: settings.hero_subtitle_ar,
        },
      },
    ];

    for (const u of updates) {
      await supabase.from('settings').upsert({ key: u.key, value: u.value });
    }

    setSaving(false);
    toast.success('Paramètres enregistrés');
  };

  const field = (label: string, key: keyof typeof settings, type = 'text', dir?: string) => (
    <div>
      <label className="block font-body text-xs text-cream/40 mb-1.5">{label}</label>
      <input
        type={type}
        value={settings[key]}
        dir={dir}
        onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
        className="input-luxury"
      />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-cream/90 mb-1">Paramètres</h1>
          <p className="font-body text-sm text-cream/40">Configuration de la boutique</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-gold-filled flex items-center gap-2">
          <Save size={15} />
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping */}
        <div className="glass-card p-6">
          <h2 className="font-body text-xs tracking-[0.2em] uppercase text-gold-600 mb-5">
            🚚 Livraison
          </h2>
          <div className="space-y-4">
            {field('Frais de livraison standard (MAD)', 'shipping_standard', 'number')}
            {field('Livraison gratuite à partir de (MAD)', 'shipping_free_above', 'number')}
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card p-6">
          <h2 className="font-body text-xs tracking-[0.2em] uppercase text-gold-600 mb-5">
            📞 Contact
          </h2>
          <div className="space-y-4">
            {field('Téléphone', 'phone')}
            {field('Email', 'email', 'email')}
            {field('Ville / Adresse', 'city')}
          </div>
        </div>

        {/* Social */}
        <div className="glass-card p-6">
          <h2 className="font-body text-xs tracking-[0.2em] uppercase text-gold-600 mb-5">
            📱 Réseaux sociaux
          </h2>
          <div className="space-y-4">
            {field('Instagram (URL)', 'instagram')}
            {field('Facebook (URL)', 'facebook')}
            {field('WhatsApp (numéro)', 'whatsapp')}
          </div>
        </div>

        {/* Hero banner */}
        <div className="glass-card p-6">
          <h2 className="font-body text-xs tracking-[0.2em] uppercase text-gold-600 mb-5">
            🏠 Bannière d&apos;accueil
          </h2>
          <div className="space-y-4">
            {field('Titre (FR)', 'hero_title_fr')}
            {field('Titre (AR)', 'hero_title_ar', 'text', 'rtl')}
            {field('Sous-titre (FR)', 'hero_subtitle_fr')}
            {field('Sous-titre (AR)', 'hero_subtitle_ar', 'text', 'rtl')}
          </div>
        </div>
      </div>

      {/* Admin password section */}
      <div className="glass-card p-6 mt-6">
        <h2 className="font-body text-xs tracking-[0.2em] uppercase text-gold-600 mb-4">
          🔐 Sécurité
        </h2>
        <p className="font-body text-sm text-cream/50">
          Pour changer le mot de passe admin, allez dans le tableau de bord Supabase →{' '}
          <strong className="text-cream/70">Authentication → Users</strong> → modifiez votre compte.
        </p>
      </div>
    </div>
  );
}
