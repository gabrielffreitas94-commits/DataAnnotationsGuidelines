import { useState, useMemo } from 'react';
import {
  Star,
  Check,
  Copy,
  PlusCircle,
  MinusCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

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

export interface ParsedOnePageSection {
  exceptionalQuote: string;
  goldenRules: string[];
  columns: AxisColumn[];
}

export function parseOnePageMarkdown(markdown: string): ParsedOnePageSection {
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
      for (const ql of quoteLines) {
        if (/^\[!EXCEPTIONAL\]/i.test(ql)) continue;
        if (/^Rule:/i.test(ql)) {
          goldenRules = ql
            .replace(/^Rule:\s*/i, '')
            .split('|')
            .map(s => s.trim())
            .filter(Boolean);
        } else if (ql.length > 10) {
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
            meaning: meaningPart || termPart,
          });
        }
      } else if (trimmed.startsWith('- ') && !/^-\s*\[[ xX]\]/.test(trimmed)) {
        const raw = trimmed.slice(2).trim();
        const [termPart, meaningPart] = raw.split('|').map(s => s.trim());
        if (termPart) {
          currentCol.negatives.push({
            polarity: 'negative',
            term: termPart,
            meaning: meaningPart || termPart,
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

interface GuidelineRendererProps {
  markdown: string;
  searchQuery: string;
  onSelectTerm: (term: string, meaning: string) => void;
  labels: {
    positiveHeader: string;
    negativeHeader: string;
    phrasesHeader: string;
    clickToCopyHint: string;
  };
}

export function GuidelineRenderer({
  markdown,
  searchQuery,
  onSelectTerm,
  labels,
}: GuidelineRendererProps) {
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{ term: string; meaning: string } | null>(null);

  const parsed = useMemo(() => parseOnePageMarkdown(markdown), [markdown]);
  const query = searchQuery.trim().toLowerCase();

  const handlePillClick = (term: string, meaning: string) => {
    navigator.clipboard.writeText(term);
    setCopiedTerm(term);
    onSelectTerm(term, meaning);
    setTimeout(() => {
      setCopiedTerm(prev => (prev === term ? null : prev));
    }, 1400);
  };

  return (
    <div className="flex-1 flex flex-col gap-2.5 min-h-0">
      {/* Bloco Fixo no Topo: 5 — Exceptional Standard */}
      <div className="shrink-0 bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 shadow-2xs">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 dark:border-amber-400/30 text-amber-700 dark:text-amber-300 font-mono text-[11px] font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>5 — Exceptional</span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-800 dark:text-neutral-200 font-medium leading-snug">
              <span className="font-semibold text-neutral-950 dark:text-white">Exceptional: </span>
              {parsed.exceptionalQuote}
            </p>
          </div>

          {parsed.goldenRules.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              {parsed.goldenRules.map((rule, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#1c1c20] text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-800"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{rule}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid de 4 Colunas (Parâmetros de Avaliação + Word Bank em Inglês) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 min-h-0">
        {parsed.columns.map((col, colIdx) => {
          const filteredPositives = query
            ? col.positives.filter(
                p =>
                  p.term.toLowerCase().includes(query) ||
                  p.meaning.toLowerCase().includes(query)
              )
            : col.positives;

          const filteredNegatives = query
            ? col.negatives.filter(
                n =>
                  n.term.toLowerCase().includes(query) ||
                  n.meaning.toLowerCase().includes(query)
              )
            : col.negatives;

          const filteredPhrases = query
            ? col.phrases.filter(ph => ph.toLowerCase().includes(query))
            : col.phrases;

          return (
            <div
              key={colIdx}
              className="flex flex-col min-h-0 bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs overflow-hidden"
            >
              {/* Cabeçalho da Coluna */}
              <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-[#18181b] shrink-0">
                <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 tracking-tight truncate">
                  {col.title}
                </h2>
                {col.description && (
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5 line-clamp-2">
                    {col.description}
                  </p>
                )}
              </div>

              {/* Corpo da Coluna (Listas de Palavras em Inglês + Frases) */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2.5">
                  {/* Palavras Positivas (+) */}
                  {filteredPositives.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <PlusCircle className="w-3 h-3" />
                          <span>{labels.positiveHeader}</span>
                        </span>
                        <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500">
                          EN
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {filteredPositives.map((item, idx) => {
                          const isCopied = copiedTerm === item.term;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handlePillClick(item.term, item.meaning)}
                              onMouseEnter={() =>
                                setHoveredItem({ term: item.term, meaning: item.meaning })
                              }
                              onMouseLeave={() => setHoveredItem(null)}
                              title={`${item.term} — ${item.meaning}`}
                              className={`group text-left px-2 py-0.5 rounded-md border text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                                isCopied
                                  ? 'bg-emerald-600 border-emerald-600 text-white font-semibold'
                                  : 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-200 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40 hover:border-emerald-400'
                              }`}
                            >
                              <span>{item.term}</span>
                              {isCopied && <Check className="w-2.5 h-2.5 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Palavras de Problemas / Falhas (-) */}
                  {filteredNegatives.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1">
                          <MinusCircle className="w-3 h-3" />
                          <span>{labels.negativeHeader}</span>
                        </span>
                        <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500">
                          EN
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {filteredNegatives.map((item, idx) => {
                          const isCopied = copiedTerm === item.term;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handlePillClick(item.term, item.meaning)}
                              onMouseEnter={() =>
                                setHoveredItem({ term: item.term, meaning: item.meaning })
                              }
                              onMouseLeave={() => setHoveredItem(null)}
                              title={`${item.term} — ${item.meaning}`}
                              className={`group text-left px-2 py-0.5 rounded-md border text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                                isCopied
                                  ? 'bg-rose-600 border-rose-600 text-white font-semibold'
                                  : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/50 text-rose-950 dark:text-rose-200 hover:bg-rose-100/80 dark:hover:bg-rose-900/40 hover:border-rose-400'
                              }`}
                            >
                              <span>{item.term}</span>
                              {isCopied && <Check className="w-2.5 h-2.5 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Frases Prontas do Eixo (EN) */}
                {filteredPhrases.length > 0 && (
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/70 space-y-1">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{labels.phrasesHeader}</span>
                    </span>
                    <div className="space-y-1">
                      {filteredPhrases.map((phrase, pIdx) => {
                        const isCopied = copiedTerm === phrase;
                        return (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handlePillClick(phrase, labels.clickToCopyHint)}
                            className={`w-full text-left p-1.5 rounded-lg border text-[10px] font-mono leading-snug transition-all cursor-pointer flex items-start justify-between gap-1.5 ${
                              isCopied
                                ? 'bg-neutral-900 text-white dark:bg-neutral-200 dark:text-neutral-950 border-neutral-900'
                                : 'bg-neutral-50 dark:bg-[#111113] border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
                            }`}
                          >
                            <span className="line-clamp-2">"{phrase}"</span>
                            {isCopied ? (
                              <Check className="w-3 h-3 shrink-0 mt-0.5" />
                            ) : (
                              <Copy className="w-3 h-3 shrink-0 mt-0.5 opacity-50" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip / Legenda Instantânea da Palavra sob o Mouse */}
      {hoveredItem && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 px-3 py-1 rounded-full shadow-lg text-xs flex items-center gap-2 border border-neutral-700 dark:border-neutral-300">
          <span className="font-mono font-bold">{hoveredItem.term}</span>
          <span className="opacity-60">→</span>
          <span>{hoveredItem.meaning}</span>
        </div>
      )}
    </div>
  );
}
