/**
 * Global catalogue filter state — shared between Navbar and CatalogueClient.
 * When navbar clicks "Dupes", it sets the filter instantly in Zustand,
 * no URL change needed, no server fetch, no re-render of the whole page.
 */
import { create } from 'zustand';

interface CatalogueStore {
  category: string;
  gender: string;
  search: string;
  featured: boolean;
  isNew: boolean;
  priceIndex: number;
  setCategory: (v: string) => void;
  setGender:   (v: string) => void;
  setSearch:   (v: string) => void;
  setFeatured: (v: boolean) => void;
  setIsNew:    (v: boolean) => void;
  setPriceIndex:(v: number) => void;
  clearAll:    () => void;
}

export const useCatalogueStore = create<CatalogueStore>((set) => ({
  category:   '',
  gender:     '',
  search:     '',
  featured:   false,
  isNew:      false,
  priceIndex: 0,
  setCategory:  (v) => set({ category: v }),
  setGender:    (v) => set({ gender: v }),
  setSearch:    (v) => set({ search: v }),
  setFeatured:  (v) => set({ featured: v }),
  setIsNew:     (v) => set({ isNew: v }),
  setPriceIndex:(v) => set({ priceIndex: v }),
  clearAll: () => set({ category: '', gender: '', search: '', featured: false, isNew: false, priceIndex: 0 }),
}));
