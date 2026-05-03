'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import ProductCard from '@/components/store/ProductCard';
import type { Product, Category } from '@/types';

interface Props {
  products: Product[];
  categories: Category[];
  filters: Record<string, string | undefined>;
}

export default function CatalogueClient({ products, categories, filters }: Props) {
  const { lang, t } = useLang();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(filters.search || '');

  const applyFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams();
    if (filters.category && key !== 'category') params.set('category', filters.category);
    if (filters.gender && key !== 'gender') params.set('gender', filters.gender);
    if (filters.search && key !== 'search') params.set('search', filters.search);
    if (value) params.set(key, value);
    router.push(`/catalogue?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilter('search', search || undefined);
  };

  const genders = [
    { value: 'homme', label_fr: 'Homme', label_ar: 'رجالي' },
    { value: 'femme', label_fr: 'Femme', label_ar: 'نسائي' },
    { value: 'mixte', label_fr: 'Mixte', label_ar: 'مختلط' },
  ];

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold-600 mb-2">
            amine.parfume
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-cream/90">
            {t('nav_catalogue')}
          </h1>
          <p className="font-body text-sm text-cream/40 mt-2">
            {products.length} {lang === 'ar' ? 'منتج' : 'produits'}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside
            className={`${
              showFilters ? 'flex' : 'hidden'
            } lg:flex flex-col gap-8 w-56 flex-shrink-0`}
          >
            {/* Search */}
            <div>
              <h3 className="font-body text-xs tracking-[0.2em] uppercase text-gold-600 mb-4">
                {lang === 'ar' ? 'بحث' : 'Recherche'}
              </h3>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('nav_search')}
                  className="input-luxury text-xs"
                />
              </form>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-body text-xs tracking-[0.2em] uppercase text-gold-600 mb-4">
                {lang === 'ar' ? 'الفئات' : 'Catégories'}
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => applyFilter('category', undefined)}
                    className={`font-body text-sm w-full text-left transition-colors ${
                      !filters.category ? 'text-gold-400' : 'text-cream/50 hover:text-cream/80'
                    }`}
                  >
                    {lang === 'ar' ? 'الكل' : 'Tous'}
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => applyFilter('category', cat.slug)}
                      className={`font-body text-sm w-full text-left transition-colors ${
                        filters.category === cat.slug
                          ? 'text-gold-400'
                          : 'text-cream/50 hover:text-cream/80'
                      }`}
                    >
                      {lang === 'ar' ? cat.name_ar : cat.name_fr}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gender */}
            <div>
              <h3 className="font-body text-xs tracking-[0.2em] uppercase text-gold-600 mb-4">
                {t('gender')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => applyFilter('gender', undefined)}
                    className={`font-body text-sm w-full text-left transition-colors ${
                      !filters.gender ? 'text-gold-400' : 'text-cream/50 hover:text-cream/80'
                    }`}
                  >
                    {lang === 'ar' ? 'الكل' : 'Tous'}
                  </button>
                </li>
                {genders.map((g) => (
                  <li key={g.value}>
                    <button
                      onClick={() => applyFilter('gender', g.value)}
                      className={`font-body text-sm w-full text-left transition-colors ${
                        filters.gender === g.value
                          ? 'text-gold-400'
                          : 'text-cream/50 hover:text-cream/80'
                      }`}
                    >
                      {lang === 'ar' ? g.label_ar : g.label_fr}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clear */}
            {(filters.category || filters.gender || filters.search) && (
              <button
                onClick={() => router.push('/catalogue')}
                className="flex items-center gap-2 font-body text-xs text-cream/40 
                           hover:text-gold-400 transition-colors"
              >
                <X size={12} />
                {lang === 'ar' ? 'مسح الفلاتر' : 'Effacer les filtres'}
              </button>
            )}
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 font-body text-sm text-cream/60 
                           hover:text-gold-400 transition-colors"
              >
                <SlidersHorizontal size={16} />
                {lang === 'ar' ? 'الفلاتر' : 'Filtres'}
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-5xl mb-4 block opacity-30">🌸</span>
                <p className="font-body text-cream/40">
                  {lang === 'ar' ? 'لا توجد منتجات' : 'Aucun produit trouvé'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
