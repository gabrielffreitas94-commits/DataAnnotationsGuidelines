import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, LanguageMeta, TranslationSchema } from './types';
import { translations, enUS, ptBR } from './locales';

const STORAGE_KEY_LANGUAGE = 'da_guidelines_language';

/**
 * Detecta o idioma mais adequado (EFIGS + LATAM) com base no navegador
 */
export function detectBrowserLanguage(): SupportedLanguage {
  const browserLangs = typeof navigator !== 'undefined'
    ? (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''])
    : ['pt-BR'];

  for (const rawLang of browserLangs) {
    if (!rawLang) continue;
    const lower = rawLang.toLowerCase();

    if (lower.startsWith('pt')) return 'pt-BR';
    if (lower === 'es-es') return 'es-ES';
    if (lower.startsWith('es')) return 'es-419';
    if (lower.startsWith('fr')) return 'fr-FR';
    if (lower.startsWith('it')) return 'it-IT';
    if (lower.startsWith('de')) return 'de-DE';
    if (lower.startsWith('en')) return 'en-US';
  }

  return 'pt-BR';
}

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationSchema>;

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentLanguageMeta: LanguageMeta;
  availableLanguages: LanguageMeta[];
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANGUAGE);
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved as SupportedLanguage;
      }
    } catch {
      // ignore
    }
    return detectBrowserLanguage();
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const currentLanguageMeta = useMemo(() => {
    return SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const t = useMemo(() => {
    const currentDict = translations[language] || ptBR;

    return (key: TranslationKey, params?: Record<string, string | number>): string => {
      const parts = key.split('.');
      let val: any = currentDict;

      for (const part of parts) {
        if (val && typeof val === 'object' && part in val) {
          val = val[part];
        } else {
          let fallbackVal: any = enUS;
          for (const fallbackPart of parts) {
            if (fallbackVal && typeof fallbackVal === 'object' && fallbackPart in fallbackVal) {
              fallbackVal = fallbackVal[fallbackPart];
            } else {
              fallbackVal = null;
              break;
            }
          }
          val = fallbackVal || (ptBR as any)[parts[0]]?.[parts[1]] || key;
          break;
        }
      }

      if (typeof val !== 'string') {
        return String(val ?? key);
      }

      if (!params) {
        return val;
      }

      return val.replace(/\{(\w+)\}/g, (match, paramKey) => {
        if (paramKey in params) {
          return String(params[paramKey]);
        }
        return match;
      });
    };
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      currentLanguageMeta,
      availableLanguages: SUPPORTED_LANGUAGES,
      t,
    }),
    [language, currentLanguageMeta, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an <I18nProvider>');
  }
  return context;
}
