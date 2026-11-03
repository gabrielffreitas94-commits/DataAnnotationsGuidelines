import { useState, useMemo } from 'react';
import { Star, Check, Sparkles } from 'lucide-react';

export interface WordItem {
  polarity: 'positive' | 'negative';
  term: string; // Always in English
  meaning: string; // Localized explanation (EFIGS + LATAM)
}

export interface AxisColumn {
  title: string;
  description: string;
  positives: WordItem[];
  negatives: WordItem[];
  phrases: string[];
}

export interface ParsedKioskSection {
  exceptionalQuote: string;
  goldenRules: string[];
  columns: AxisColumn[];
}

export function parseKioskMarkdown(markdown: string): ParsedKioskSection {
  const lines = markdown.split('\n');
  let exceptionalQuote =
    'Complete, evidence-based, and internally consistent ratings. The annotator listens fully, separates quality, adherence, and preference, applies every displayed axis correctly, and selects one to three genuinely decisive factors.';
  let goldenRules: string[] = [];
  const columns: AxisColumn[] = [];
  let currentCol: AxisColumn | null = null;

  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (!trimmed || trimmed === '---') {
      i++;
      continue;
    }

    // Parse > [!EXCEPTIONAL] block
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      const isExceptional = quoteLines.some(l => /^\[!EXCEPTIONAL\]/i.test(l));
      for (const ql of quoteLines) {
        if (/^\[!EXCEPTIONAL\]/i.test(ql)) continue;
        if (/^Rule:/i.test(ql)) {
          goldenRules = ql
            .replace(/^Rule:\s*/i, '')
            .split('|')
            .map(s => s.trim())
            .filter(Boolean);
        } else if (isExceptional && ql.length > 10) {
          exceptionalQuote = ql;
        }
      }
      continue;
    }

    // Parse ## Axis Column
    if (/^##\s+/.test(trimmed)) {
      if (currentCol) {
        columns.push(currentCol);
      }
      currentCol = {
        title: trimmed.replace(/^##\s+/, '').trim(),
        description: '',
        positives: [],
        negatives: [],
        phrases: [],
      };
      i++;
      continue;
    }

    if (currentCol) {
      if (/^Desc:/i.test(trimmed)) {
        currentCol.description = trimmed.replace(/^Desc:\s*/i, '').trim();
      } else if (trimmed.startsWith('+ ')) {
        const raw = trimmed.slice(2).trim();
        const [termPart, meaningPart] = raw.split('|').map(s => s.trim());
        if (termPart) {
          currentCol.positives.push({
            polarity: 'positive',
            term: termPart,
            meaning: meaningPart || '',
          });
        }
      } else if (trimmed.startsWith('- ') && trimmed.includes('|')) {
        const raw = trimmed.slice(2).trim();
        const [termPart, meaningPart] = raw.split('|').map(s => s.trim());
        if (termPart) {
          currentCol.negatives.push({
            polarity: 'negative',
            term: termPart,
            meaning: meaningPart || '',
          });
        }
      } else if (trimmed.startsWith('* ')) {
        const phrase = trimmed
          .slice(2)
          .trim()
          .replace(/^["']|["']$/g, '');
        if (phrase) {
          currentCol.phrases.push(phrase);
        }
      }
    }

    i++;
  }

  if (currentCol) {
    columns.push(currentCol);
  }

  return {
    exceptionalQuote,
    goldenRules,
    columns,
  };
}

interface KioskCheatSheetProps {
  markdown: string;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export function KioskCheatSheet({ markdown, fontSize }: KioskCheatSheetProps) {
  const [copiedPill, setCopiedPill] = useState<string | null>(null);

  const parsed = useMemo(() => parseKioskMarkdown(markdown), [markdown]);

  const handleCopy = (term: string) => {
    navigator.clipboard.writeText(term);
    setCopiedPill(term);
    setTimeout(() => {
      setCopiedPill(prev => (prev === term ? null : prev));
    }, 1200);
  };

  // Escala de fontes baseada no seletor de tamanho
  const fontStyles = {
    normal: {
      bannerTitle: 'text-sm font-extrabold',
      bannerQuote: 'text-sm font-semibold',
      ruleTag: 'text-xs font-semibold px-2.5 py-1',
      colTitle: 'text-base font-bold',
      colDesc: 'text-xs',
      blockHeader: 'text-xs font-bold',
      pillTerm: 'text-xs sm:text-sm font-bold font-mono',
      pillMeaning: 'text-[11px] font-sans',
      pillPad: 'px-2.5 py-1.5',
      phraseText: 'text-xs font-mono',
    },
    large: {
      bannerTitle: 'text-base font-extrabold',
      bannerQuote: 'text-base sm:text-lg font-bold',
      ruleTag: 'text-xs sm:text-sm font-semibold px-3 py-1',
      colTitle: 'text-lg font-extrabold',
      colDesc: 'text-xs sm:text-sm',
      blockHeader: 'text-xs sm:text-sm font-extrabold',
      pillTerm: 'text-sm sm:text-base font-bold font-mono',
      pillMeaning: 'text-xs font-sans',
      pillPad: 'px-3 py-1.5',
      phraseText: 'text-xs sm:text-sm font-mono',
    },
    xlarge: {
      bannerTitle: 'text-lg font-extrabold',
      bannerQuote: 'text-lg sm:text-xl font-bold',
      ruleTag: 'text-sm font-bold px-3.5 py-1.5',
      colTitle: 'text-xl font-extrabold',
      colDesc: 'text-sm',
      blockHeader: 'text-sm font-extrabold',
      pillTerm: 'text-base sm:text-lg font-bold font-mono',
      pillMeaning: 'text-xs sm:text-sm font-sans',
      pillPad: 'px-3.5 py-2',
      phraseText: 'text-sm font-mono',
    },
  }[fontSize];

  return (
    <div className="flex-1 flex flex-col gap-2 min-h-0 h-full overflow-hidden select-none">
      {/* 5 — Exceptional Guideline Banner (Grande, destacado e fácil de ler à distância) */}
      <div className="shrink-0 bg-neutral-900 dark:bg-[#151518] border-2 border-amber-500/50 dark:border-amber-400/40 rounded-xl px-4 py-3 shadow-md">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/20 text-amber-300 dark:text-amber-200 border border-amber-400/50 shrink-0 ${fontStyles.bannerTitle}`}>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>5 — Exceptional</span>
            </div>
            <p className={`text-neutral-100 dark:text-neutral-50 leading-snug tracking-tight ${fontStyles.bannerQuote}`}>
              {parsed.exceptionalQuote}
            </p>
          </div>

          {parsed.goldenRules.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-neutral-800 dark:border-neutral-800/80">
              {parsed.goldenRules.map((rule, idx) => (
                <span
                  key={idx}
                  className={`rounded-md bg-neutral-800 dark:bg-neutral-800/90 text-neutral-200 border border-neutral-700/80 ${fontStyles.ruleTag}`}
                >
                  {rule}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid de 4 Parâmetros: Otimizado para Monitor Vertical (2 Colunas x 2 Linhas ocupando 100% da tela) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2.5 min-h-0 h-full overflow-hidden">
        {parsed.columns.map((col, colIdx) => (
          <div
            key={colIdx}
            className="flex flex-col min-h-0 h-full bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden"
          >
            {/* Título do Parâmetro com fonte grande */}
            <div className="px-3.5 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-[#18181b] shrink-0 flex items-baseline justify-between gap-2">
              <h2 className={`text-neutral-900 dark:text-neutral-100 tracking-tight ${fontStyles.colTitle}`}>
                {col.title}
              </h2>
              {col.description && (
                <span className={`text-neutral-500 dark:text-neutral-400 truncate max-w-[50%] text-right ${fontStyles.colDesc}`}>
                  {col.description}
                </span>
              )}
            </div>

            {/* Corpo dividido claramente em 2 Blocos Compactos */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
              {/* BLOCO 1: (+) STRONG / QUALITY */}
              {col.positives.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-0.5">
                    <span className={`font-mono tracking-wider uppercase text-emerald-600 dark:text-emerald-400 ${fontStyles.blockHeader}`}>
                      + STRONG / QUALITY
                    </span>
                    <span className="text-xs font-mono text-neutral-400">EN</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {col.positives.map((item, idx) => {
                      const isCopied = copiedPill === item.term;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleCopy(item.term)}
                          title="Clique para copiar"
                          className={`text-left rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${fontStyles.pillPad} ${
                            isCopied
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm scale-102'
                              : 'bg-emerald-50/90 dark:bg-emerald-950/25 border-emerald-300/80 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:border-emerald-400'
                          }`}
                        >
                          <div className="flex flex-col leading-tight">
                            <span className={fontStyles.pillTerm}>
                              {item.term}
                            </span>
                            {item.meaning && (
                              <span className={`text-emerald-700/90 dark:text-emerald-300/80 mt-0.5 ${fontStyles.pillMeaning}`}>
                                {item.meaning}
                              </span>
                            )}
                          </div>
                          {isCopied && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BLOCO 2: (-) FLAWS / ISSUES */}
              {col.negatives.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between px-0.5">
                    <span className={`font-mono tracking-wider uppercase text-rose-600 dark:text-rose-400 ${fontStyles.blockHeader}`}>
                      - FLAWS / ISSUES
                    </span>
                    <span className="text-xs font-mono text-neutral-400">EN</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {col.negatives.map((item, idx) => {
                      const isCopied = copiedPill === item.term;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleCopy(item.term)}
                          title="Clique para copiar"
                          className={`text-left rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${fontStyles.pillPad} ${
                            isCopied
                              ? 'bg-rose-600 border-rose-600 text-white shadow-sm scale-102'
                              : 'bg-rose-50/90 dark:bg-rose-950/25 border-rose-300/80 dark:border-rose-800/60 text-rose-950 dark:text-rose-100 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:border-rose-400'
                          }`}
                        >
                          <div className="flex flex-col leading-tight">
                            <span className={fontStyles.pillTerm}>
                              {item.term}
                            </span>
                            {item.meaning && (
                              <span className={`text-rose-700/90 dark:text-rose-300/80 mt-0.5 ${fontStyles.pillMeaning}`}>
                                {item.meaning}
                              </span>
                            )}
                          </div>
                          {isCopied && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Frases Decisivas (Compactas, para usar como tie-breaker ou veredito) */}
              {col.phrases.length > 0 && (
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Decisive Phrases</span>
                  </span>
                  <div className="space-y-1">
                    {col.phrases.map((phrase, pIdx) => {
                      const isCopied = copiedPill === phrase;
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleCopy(phrase)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg border leading-snug transition-all cursor-pointer flex items-center justify-between gap-2 ${fontStyles.phraseText} ${
                            isCopied
                              ? 'bg-neutral-900 text-white dark:bg-neutral-200 dark:text-neutral-950 border-neutral-900'
                              : 'bg-neutral-50 dark:bg-[#111113] border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                          }`}
                        >
                          <span className="truncate">"{phrase}"</span>
                          {isCopied ? (
                            <Check className="w-3 h-3 shrink-0" />
                          ) : (
                            <span className="text-[10px] text-neutral-400 uppercase shrink-0">copy</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Toast flutuante rápido ao copiar */}
      {copiedPill && (
        <div className="fixed bottom-4 right-4 z-50 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 px-3.5 py-2 rounded-lg shadow-xl text-sm font-mono font-bold flex items-center gap-2 border border-neutral-700 dark:border-neutral-200 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>Copied: "{copiedPill}"</span>
        </div>
      )}
    </div>
  );
}
