'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, normalizeLanguage } from './config';
import dictionaries from './dictionaries';
import sections from './sections';

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  useEffect(() => {
    const stored = window.localStorage.getItem('nexus-locale');
    const cookie = document.cookie
      .split('; ')
      .find((item) => item.startsWith('nexus-locale='))
      ?.split('=')[1];
    setLanguage(normalizeLanguage(stored || cookie));
  }, []);
  const value = useMemo(
    () => ({
      language,
      dictionary: {
        ...(dictionaries[language] || dictionaries[DEFAULT_LANGUAGE]),
        ...(sections[language] || sections[DEFAULT_LANGUAGE]),
      },
      changeLanguage(next) {
        const normalized = normalizeLanguage(next);
        setLanguage(normalized);
        window.localStorage.setItem('nexus-locale', normalized);
        document.cookie = `nexus-locale=${normalized}; path=/; max-age=31536000; SameSite=Lax`;
      },
    }),
    [language]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n debe utilizarse dentro de I18nProvider');
  return context;
}
