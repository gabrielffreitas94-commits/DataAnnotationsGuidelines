import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export function LanguageSelector() {
  const { language, setLanguage, currentLanguageMeta, availableLanguages, t } = useI18n();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="h-8 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-[#111113] hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer shrink-0"
        title={t('header.languageAria')}
        aria-label={t('header.languageAria')}
      >
        <Globe className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
        <span className="font-mono text-[11px] font-semibold">{currentLanguageMeta.shortCode}</span>
        <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-1.5 z-50">
          <div className="px-3 py-1 border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold">
              EFIGS + LATAM
            </span>
            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
              i18n
            </span>
          </div>
          <div className="py-1 max-h-72 overflow-y-auto">
            {availableLanguages.map(lang => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-100 dark:bg-neutral-800/90 text-neutral-900 dark:text-white font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm leading-none">{lang.flag}</span>
                    <span className="truncate">{lang.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border border-neutral-200/70 dark:border-neutral-800">
                      {lang.regionLabel}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-200" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
