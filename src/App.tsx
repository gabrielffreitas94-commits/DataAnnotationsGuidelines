import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  gistService,
  OFFICIAL_GIST_ID,
  purgeLegacyCaches,
} from './services/gistService';
import { GuidelineSection } from './types/template';
import {
  Sun,
  Moon,
  BookOpen,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Type,
} from 'lucide-react';
import { GistGuidePage } from './components/GistGuidePage';
import { KioskCheatSheet } from './components/KioskCheatSheet';
import { useI18n } from './i18n/I18nContext';
import { LanguageSelector } from './components/LanguageSelector';

purgeLegacyCaches();

const STORAGE_KEY_GIST = 'da_guidelines_active_gist_id';
const STORAGE_KEY_THEME = 'da_guidelines_theme';
const STORAGE_KEY_FONT_SIZE = 'da_guidelines_font_size';

export function App() {
  const { language, t } = useI18n();

  // Controle de Tamanho de Fonte para o Monitor de Apoio
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FONT_SIZE);
      if (saved === 'normal' || saved === 'large' || saved === 'xlarge') return saved;
    } catch {
      // ignore
    }
    return 'large'; // Default 'large' para leitura fácil à distância
  });

  const cycleFontSize = () => {
    setFontSize(prev => {
      const next = prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal';
      try {
        localStorage.setItem(STORAGE_KEY_FONT_SIZE, next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'dark';
      }
    } catch {
      // ignore
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [activeGistId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_GIST) || OFFICIAL_GIST_ID;
    } catch {
      return OFFICIAL_GIST_ID;
    }
  });

  const [sections, setSections] = useState<GuidelineSection[]>(() =>
    gistService.getEmbeddedSections(language)
  );
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [showGuideTab, setShowGuideTab] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchSections = useCallback(
    async (targetId: string) => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const loaded = await gistService.loadFromGist(targetId, language, false);
        setSections(loaded);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Erro ao carregar o GitHub Gist.');
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  useEffect(() => {
    if (activeGistId === OFFICIAL_GIST_ID) {
      setSections(gistService.getEmbeddedSections(language));
    }
    fetchSections(activeGistId);
  }, [language, activeGistId, fetchSections]);

  const activeSection = useMemo(() => {
    if (sections.length === 0) return null;
    return sections[Math.min(activeTabIndex, sections.length - 1)] || sections[0];
  }, [sections, activeTabIndex]);

  return (
    <div className="h-screen flex flex-col bg-[#fafafa] dark:bg-[#0c0c0e] text-neutral-900 dark:text-neutral-200 font-sans transition-colors duration-150 overflow-hidden select-none">
      {/* Barra Ultrafina no Topo (36px): 100% Clean e sem quebra de linha */}
      <header className="shrink-0 h-9 border-b border-neutral-200 dark:border-neutral-800/80 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-sm px-3 flex items-center justify-between z-30">
        {/* Centro-Esquerda: Abas de Projeto Minimalistas */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {sections.map((sec, idx) => {
            const isSelected = !showGuideTab && activeSection?.index === idx;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setShowGuideTab(false);
                  setActiveTabIndex(idx);
                }}
                className={`px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {sec.title}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setShowGuideTab(prev => !prev)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              showGuideTab
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950'
                : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
          >
            {showGuideTab ? <ArrowLeft className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
            <span>{showGuideTab ? 'Voltar' : t('header.tabGuide')}</span>
          </button>
        </div>

        {/* Canto Direito: Tamanho de Fonte (A+, A++) + Idioma + Tema */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Botão de Tamanho da Letra */}
          <button
            type="button"
            onClick={cycleFontSize}
            className="h-7 px-2 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-[#161618] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
            title={`Tamanho atual: ${fontSize.toUpperCase()} (Clique para alternar: Normal → Large → XL)`}
          >
            <Type className="w-3.5 h-3.5" />
            <span className="font-mono">{fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}</span>
          </button>

          <LanguageSelector />

          <button
            type="button"
            onClick={toggleTheme}
            className="w-7 h-7 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-[#161618] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            title={theme === 'dark' ? t('header.themeLight') : t('header.themeDark')}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-neutral-700" />
            )}
          </button>
        </div>
      </header>

      {/* Conteúdo em Tela Cheia Kiosk Otimizado para o Monitor de Apoio */}
      <main className="flex-1 flex flex-col min-h-0 p-2.5 overflow-hidden">
        {showGuideTab ? (
          <div className="flex-1 overflow-y-auto">
            <GistGuidePage onBackToWorkspace={() => setShowGuideTab(false)} />
          </div>
        ) : loading && sections.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
            <p className="text-xs">Carregando...</p>
          </div>
        ) : errorMsg && sections.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <p className="text-xs text-neutral-500">{errorMsg}</p>
          </div>
        ) : (
          activeSection && <KioskCheatSheet markdown={activeSection.body} fontSize={fontSize} />
        )}
      </main>
    </div>
  );
}

export default App;
