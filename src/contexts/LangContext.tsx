'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, TranslationKey } from '@/lib/translations';
import type { Language } from '@/types';

interface LangContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey) => string;
  dir: 'ltr' | 'rtl';
  isAr: boolean;
}

const LangContext = createContext<LangContextType>({} as LangContextType);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Language | null;
    if (saved === 'ar' || saved === 'fr') setLangState(saved);
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('lang', l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key: TranslationKey) =>
    translations[lang][key] ?? translations['fr'][key] ?? key;

  return (
    <LangContext.Provider value={{
      lang, setLang, t, dir: lang === 'ar' ? 'rtl' : 'ltr', isAr: lang === 'ar'
    }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
