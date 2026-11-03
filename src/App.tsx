import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  gistService,
  OFFICIAL_GIST_ID,
  extractGistId,
} from './services/gistService';
import { GuidelineSection } from './types/template';
import {
  Copy,
  Check,
  ExternalLink,
  Loader2,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  X,
  BookOpen,
  Sun,
  Moon,
  Search,
  Sparkles,
} from 'lucide-react';
import { GistGuidePage } from './components/GistGuidePage';
import { GuidelineRenderer } from './components/GuidelineRenderer';
import { useI18n } from './i18n/I18nContext';
import { LanguageSelector } from './components/LanguageSelector';
import { TaskTimer } from './components/TaskTimer';

const STORAGE_KEY_GIST = 'da_guidelines_active_gist_id';
const STORAGE_KEY_SCRATCHPAD = 'da_guidelines_scratchpad_en';
const STORAGE_KEY_THEME = 'da_guidelines_theme';

const VOCAB_LABELS_BY_LANG: Record<
  string,
  {
    positiveHeader: string;
    negativeHeader: string;
    phrasesHeader: string;
    clickToCopyHint: string;
    scratchpadPlaceholder: string;
  }
> = {
  'pt-BR': {
    positiveHeader: '+ Pontos Fortes (Word Bank EN)',
    negativeHeader: '- Falhas / Problemas (Word Bank EN)',
    phrasesHeader: 'Frases Decisivas (Clique p/ Copiar)',
    clickToCopyHint: 'Frase copiada e adicionada ao rascunho!',
    scratchpadPlaceholder:
      'Clique nas palavras/frases acima para montar seu Rationale em inglês ou digite aqui...',
  },
  'en-US': {
    positiveHeader: '+ Strengths (EN Word Bank)',
    negativeHeader: '- Issues / Flaws (EN Word Bank)',
    phrasesHeader: 'Decisive Phrases (Click to Copy)',
    clickToCopyHint: 'Phrase copied & added to scratchpad!',
    scratchpadPlaceholder:
      'Click any word or phrase pill above to build your English rationale here...',
  },
  'es-419': {
    positiveHeader: '+ Fortalezas (Word Bank EN)',
    negativeHeader: '- Fallas / Problemas (Word Bank EN)',
    phrasesHeader: 'Frases Decisivas (Clic para Copiar)',
    clickToCopyHint: '¡Frase copiada y agregada al borrador!',
    scratchpadPlaceholder:
      'Haz clic en las palabras/frases de arriba para armar tu Rationale en inglés...',
  },
  'es-ES': {
    positiveHeader: '+ Puntos Fuertes (Word Bank EN)',
    negativeHeader: '- Fallos / Problemas (Word Bank EN)',
    phrasesHeader: 'Frases Decisivas (Clic para Copiar)',
    clickToCopyHint: '¡Frase copiada y añadida al borrador!',
    scratchpadPlaceholder:
      'Haz clic en las palabras/frases superiores para redactar tu Rationale en inglés...',
  },
  'fr-FR': {
    positiveHeader: '+ Points Forts (Word Bank EN)',
    negativeHeader: '- Défauts / Erreurs (Word Bank EN)',
    phrasesHeader: 'Phrases Décisives (Cliquer pour Copier)',
    clickToCopyHint: 'Phrase copiée et ajoutée au brouillon !',
    scratchpadPlaceholder:
      'Cliquez sur les mots/phrases ci-dessus pour composer votre Rationale en anglais...',
  },
  'it-IT': {
    positiveHeader: '+ Punti di Forza (Word Bank EN)',
    negativeHeader: '- Difetti / Problemi (Word Bank EN)',
    phrasesHeader: 'Frasi Decisive (Clicca per Copiare)',
    clickToCopyHint: 'Frase copiata e aggiunta alla bozza!',
    scratchpadPlaceholder:
      'Clicca sulle parole/frasi in alto per comporre il tuo Rationale in inglese...',
  },
  'de-DE': {
    positiveHeader: '+ Stärken (Word Bank EN)',
    negativeHeader: '- Mängel / Probleme (Word Bank EN)',
    phrasesHeader: 'Entscheidende Sätze (Klicken zum Kopieren)',
    clickToCopyHint: 'Satz kopiert und zum Entwurf hinzugefügt!',
    scratchpadPlaceholder:
      'Klicken Sie oben auf Wörter/Sätze, um Ihr englisches Rationale zusammenzustellen...',
  },
};

export function App() {
  const { language, t } = useI18n();

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

  const [activeGistId, setActiveGistId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_GIST) || OFFICIAL_GIST_ID;
    } catch {
      return OFFICIAL_GIST_ID;
    }
  });

  const [gistInput, setGistInput] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GIST);
      return saved && saved !== OFFICIAL_GIST_ID ? saved : '';
    } catch {
      return '';
    }
  });

  const [sections, setSections] = useState<GuidelineSection[]>(() =>
    gistService.getEmbeddedSections(language)
  );
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [showGuideTab, setShowGuideTab] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [reloaded, setReloaded] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timerResetSignal, setTimerResetSignal] = useState<number>(0);

  // Rascunho rápido de Rationale em Inglês na barra inferior
  const [scratchpad, setScratchpad] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SCRATCHPAD) || '';
    } catch {
      return '';
    }
  });
  const [copiedScratchpad, setCopiedScratchpad] = useState<boolean>(false);
  const [lastSelectedInfo, setLastSelectedInfo] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCRATCHPAD, scratchpad);
    } catch {
      // ignore
    }
  }, [scratchpad]);

  const fetchSections = useCallback(
    async (input: string, forceReload: boolean = false) => {
      const targetId = extractGistId(input || OFFICIAL_GIST_ID);
      setLoading(true);
      setErrorMsg(null);

      try {
        const loaded = await gistService.loadFromGist(targetId, language, forceReload);
        setSections(loaded);
        setActiveGistId(targetId);
        try {
          localStorage.setItem(STORAGE_KEY_GIST, targetId);
        } catch {
          // ignore
        }
        if (forceReload) {
          setReloaded(true);
          setTimeout(() => setReloaded(false), 1800);
        }
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
    fetchSections(activeGistId, false);
  }, [language, activeGistId, fetchSections]);

  const activeSection = useMemo(() => {
    if (sections.length === 0) return null;
    return sections[Math.min(activeTabIndex, sections.length - 1)] || sections[0];
  }, [sections, activeTabIndex]);

  const handleSelectTerm = (term: string, meaning: string) => {
    setLastSelectedInfo(`${term} → ${meaning}`);
    setScratchpad(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return term;
      if (term.endsWith('.')) return `${trimmed} ${term}`;
      if (trimmed.endsWith('.') || trimmed.endsWith(':') || trimmed.endsWith(',')) {
        return `${trimmed} ${term}`;
      }
      return `${trimmed}, ${term}`;
    });
  };

  const handleCopyScratchpad = () => {
    if (!scratchpad.trim()) return;
    navigator.clipboard.writeText(scratchpad.trim());
    setCopiedScratchpad(true);
    setTimeout(() => setCopiedScratchpad(false), 1800);
  };

  const handleResetAll = () => {
    setScratchpad('');
    setLastSelectedInfo('');
    setSearchQuery('');
    setTimerResetSignal(prev => prev + 1);
  };

  const vocabLabels = VOCAB_LABELS_BY_LANG[language] || VOCAB_LABELS_BY_LANG['en-US'];
  const wordCount = scratchpad.trim() ? scratchpad.trim().split(/\s+/).length : 0;
  const currentGistUrl = `https://gist.github.com/${activeGistId}`;

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#fafafa] dark:bg-[#0f0f11] flex flex-col text-neutral-900 dark:text-neutral-200 font-sans transition-colors duration-150">
      {/* Barra Superior Compacta em 1 Linha (Abas à Esquerda + Controles à Direita) */}
      <header className="shrink-0 border-b border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-[#141416] px-3 py-1.5 z-30">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Esquerda: Logo + Abas (# Título do Gist) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
            <div
              onClick={() => setShowGuideTab(false)}
              className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-200 text-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-[11px] cursor-pointer select-none shrink-0"
              title="DataAnnotation 5-Star Second-Screen Hub"
            >
              DA
            </div>

            <nav className="flex items-center gap-1 bg-neutral-100 dark:bg-[#0f0f11] p-0.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
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
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-[#222226] text-neutral-950 dark:text-white shadow-2xs'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                  >
                    {sec.title}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setShowGuideTab(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  showGuideTab
                    ? 'bg-white dark:bg-[#222226] text-neutral-950 dark:text-white shadow-2xs'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>{t('header.tabGuide')}</span>
              </button>
            </nav>
          </div>

          {/* Direita: Filtro Rápido + Timer + Gist Loader + Idioma (EFIGS+LATAM) + Tema */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Filtro de Palavras em Tempo Real */}
            {!showGuideTab && (
              <div className="relative w-36 xl:w-44">
                <Search className="w-3 h-3 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter words..."
                  className="w-full h-8 text-[11px] bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 rounded-lg pl-7 pr-6 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Cronômetro da Task */}
            <TaskTimer resetSignal={timerResetSignal} />

            {/* Input compacto do Gist */}
            <form
              onSubmit={e => {
                e.preventDefault();
                fetchSections(gistInput || OFFICIAL_GIST_ID, true);
              }}
              className="hidden md:flex items-center gap-1"
            >
              <input
                type="text"
                value={gistInput}
                onChange={e => setGistInput(e.target.value)}
                placeholder={t('header.gistInputPlaceholder')}
                className="w-32 xl:w-40 h-8 text-[11px] font-mono bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 rounded-lg px-2 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-500"
              />
              <button
                type="submit"
                disabled={loading}
                className={`h-8 px-2.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  reloaded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-900 hover:bg-black dark:bg-neutral-200 dark:hover:bg-white text-white dark:text-neutral-950'
                }`}
                title={t('header.tooltipLoad')}
              >
                {loading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : reloaded ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                <span className="hidden xl:inline">{t('header.btnLoad')}</span>
              </button>
            </form>

            {activeGistId && (
              <a
                href={currentGistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
                title={t('header.tooltipEditGist')}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <LanguageSelector />

            <button
              type="button"
              onClick={toggleTheme}
              className="h-8 w-8 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-[#111113] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              title={theme === 'dark' ? t('header.themeLight') : t('header.themeDark')}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-neutral-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Área Principal de 1 Página (Sem Scroll na Página no Segundo Monitor) */}
      <main className="flex-1 flex flex-col min-h-0 px-3 py-2 overflow-y-auto lg:overflow-hidden">
        {showGuideTab ? (
          <div className="flex-1 overflow-y-auto">
            <GistGuidePage onBackToWorkspace={() => setShowGuideTab(false)} />
          </div>
        ) : errorMsg && sections.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center gap-3">
            <AlertCircle className="w-7 h-7 text-red-500" />
            <p className="text-xs text-neutral-500">{errorMsg}</p>
            <button
              onClick={() => fetchSections(OFFICIAL_GIST_ID, true)}
              className="text-xs font-semibold px-3 py-1.5 bg-neutral-900 text-white dark:bg-neutral-200 dark:text-neutral-950 rounded-lg cursor-pointer"
            >
              {t('workspace.btnLoadDefault')}
            </button>
          </div>
        ) : (
          activeSection && (
            <GuidelineRenderer
              markdown={activeSection.body}
              searchQuery={searchQuery}
              onSelectTerm={handleSelectTerm}
              labels={vocabLabels}
            />
          )
        )}
      </main>

      {/* Barra Inferior Compacta: Rascunho Rápido em Inglês (Scratchpad) */}
      {!showGuideTab && (
        <footer className="shrink-0 border-t border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-[#141416] px-3 py-1.5">
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                EN Scratchpad:
              </span>
            </div>

            <input
              type="text"
              value={scratchpad}
              onChange={e => setScratchpad(e.target.value)}
              placeholder={vocabLabels.scratchpadPlaceholder}
              className="flex-1 h-7 text-xs font-mono bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-500"
            />

            {lastSelectedInfo && (
              <span className="hidden xl:inline-block text-[10px] font-mono text-neutral-400 dark:text-neutral-500 max-w-xs truncate">
                {lastSelectedInfo}
              </span>
            )}

            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 shrink-0">
              {wordCount}w
            </span>

            <button
              type="button"
              onClick={handleCopyScratchpad}
              disabled={!scratchpad.trim()}
              className={`h-7 px-2.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                copiedScratchpad
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 hover:bg-black dark:bg-neutral-200 dark:hover:bg-white text-white dark:text-neutral-950'
              } disabled:opacity-40`}
            >
              {copiedScratchpad ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>{t('workspace.btnCopiedResult')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>{t('workspace.btnCopyResult')}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetAll}
              className="h-7 px-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-50 dark:bg-[#111113] hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              title={t('workspace.btnResetTaskAll')}
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
