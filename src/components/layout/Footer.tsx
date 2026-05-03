'use client';

import Link from 'next/link';
import { useLang } from '@/contexts/LangContext';
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { t, lang } = useLang();

  return (
    <footer className="bg-navy-800 border-t border-gold-800/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl text-gold-400 mb-3">
              Amine Parfumes
            </h3>
            <p className="font-body text-sm text-cream/50 leading-relaxed max-w-xs">
              {t('footer_tagline')}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-cream/40 hover:text-gold-400 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-cream/40 hover:text-gold-400 transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-gold-600 mb-5">
              {t('footer_links')}
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: t('nav_home') },
                { href: '/catalogue', label: t('nav_catalogue') },
                { href: '/catalogue?gender=homme', label: lang === 'ar' ? 'رجالي' : 'Homme' },
                { href: '/catalogue?gender=femme', label: lang === 'ar' ? 'نسائي' : 'Femme' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-body text-sm text-cream/50 hover:text-gold-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-gold-600 mb-5">
              {t('footer_contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-cream/50">
                <Phone size={14} className="text-gold-600 flex-shrink-0" />
                <span className="font-body text-sm">+212 6XX XXX XXX</span>
              </li>
              <li className="flex items-center gap-3 text-cream/50">
                <Mail size={14} className="text-gold-600 flex-shrink-0" />
                <span className="font-body text-sm">contact@amineparfumes.ma</span>
              </li>
              <li className="flex items-center gap-3 text-cream/50">
                <MapPin size={14} className="text-gold-600 flex-shrink-0" />
                <span className="font-body text-sm">Agadir, Maroc</span>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-2 text-gold-700/80">
              <span className="text-lg">💳</span>
              <span className="font-body text-xs tracking-wider uppercase">
                {t('payment_cod')}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="divider-gold mt-12 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-cream/30">
            © {new Date().getFullYear()} Amine Parfumes – {t('footer_rights')}
          </p>
          <p className="font-body text-xs text-gold-800/60">
            Créations d&apos;Exception
          </p>
        </div>
      </div>
    </footer>
  );
}
