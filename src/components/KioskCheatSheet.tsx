import { useState, useMemo } from 'react';
import { Star, Check } from 'lucide-react';

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
}

export function KioskCheatSheet({ markdown }: KioskCheatSheetProps) {
  const [copiedPill, setCopiedPill] = useState<string | null>(null);

  const parsed = useMemo(() => parseKioskMarkdown(markdown), [markdown]);

  const handleCopy = (term: string) => {
    navigator.clipboard.writeText(term);
    setCopiedPill(term);
    setTimeout(() => {
      setCopiedPill(prev => (prev === term ? null : prev));
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col gap-2 min-h-0 h-full overflow-hidden select-none">
      {/* Banner 5 — Exceptional: Destaque com texto maior e legível à distância */}
      <div className="shrink-0 bg-neutral-900/95 dark:bg-[#141417] border border-amber-500/40 dark:border-amber-400/30 rounded-xl px-4 py-2.5 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/20 text-amber-300 dark:text-amber-200 border border-amber-400/40 font-mono text-sm font-extrabold shrink-0 shadow-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>5 — Exceptional</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-neutral-100 leading-snug">
              {parsed.exceptionalQuote}
            </p>
          </div>

          {parsed.goldenRules.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              {parsed.goldenRules.map((rule, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-neutral-800 text-neutral-200 border border-neutral-700/80"
                >
                  {rule}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid de 4 Colunas: 100% da tela sem scroll na página */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 min-h-0 h-full overflow-hidden">
        {parsed.columns.map((col, colIdx) => (
          <div
            key={colIdx}
            className="flex flex-col min-h-0 h-full bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800/90 rounded-xl shadow-xs overflow-hidden"
          >
            {/* Cabeçalho da Coluna com texto maior */}
            <div className="px-3.5 py-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-[#18181b] shrink-0">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {col.title}
              </h2>
              {col.description && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5 line-clamp-2">
                  {col.description}
                </p>
              )}
            </div>

            {/* Corpo dividido nos 2 Blocos: GOOD / STRONG (+) e POOR / FLAW (-) */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
              {/* Bloco 1: POSITIVOS (+) */}
              {col.positives.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                      + STRONG / QUALITY
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">EN</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {col.positives.map((item, idx) => {
                      const isCopied = copiedPill === item.term;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleCopy(item.term)}
                          title={item.meaning ? `${item.term} — ${item.meaning}` : item.term}
                          className={`text-left px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isCopied
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                              : 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:border-emerald-400'
                          }`}
                        >
                          <div className="flex flex-col leading-tight">
                            <span className="text-xs font-mono font-bold tracking-tight">
                              {item.term}
                            </span>
                            {item.meaning && (
                              <span className="text-[10px] text-emerald-700/80 dark:text-emerald-300/70 font-sans">
                                {item.meaning}
                              </span>
                            )}
                          </div>
                          {isCopied && <Check className="w-3 h-3 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bloco 2: NEGATIVOS (-) */}
              {col.negatives.length > 0 && (
                <div className="space-y-1.5 pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-rose-600 dark:text-rose-400">
                      - FLAWS / ISSUES
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">EN</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {col.negatives.map((item, idx) => {
                      const isCopied = copiedPill === item.term;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleCopy(item.term)}
                          title={item.meaning ? `${item.term} — ${item.meaning}` : item.term}
                          className={`text-left px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isCopied
                              ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                              : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:border-rose-400'
                          }`}
                        >
                          <div className="flex flex-col leading-tight">
                            <span className="text-xs font-mono font-bold tracking-tight">
                              {item.term}
                            </span>
                            {item.meaning && (
                              <span className="text-[10px] text-rose-700/80 dark:text-rose-300/70 font-sans">
                                {item.meaning}
                              </span>
                            )}
                          </div>
                          {isCopied && <Check className="w-3 h-3 shrink-0 ml-1" />}
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

      {/* Toast flutuante discreto ao copiar */}
      {copiedPill && (
        <div className="fixed bottom-4 right-4 z-50 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 px-3 py-1.5 rounded-lg shadow-lg text-xs font-mono font-bold flex items-center gap-1.5 border border-neutral-700 dark:border-neutral-200 animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          <span>Copied: "{copiedPill}"</span>
        </div>
      )}
    </div>
  );
}
