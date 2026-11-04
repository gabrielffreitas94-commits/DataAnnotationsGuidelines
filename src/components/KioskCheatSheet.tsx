import { useState, useMemo } from 'react';
import { Star, Check, Copy, Info } from 'lucide-react';

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

export interface EvaluationTerm {
  index: number;
  term: string; // English term: "Pitch Contour"
  translation: string; // Localized subtitle: "Contorno de Tom / Altura"
  whatIs: string; // "O que é: ..."
  practicalContext: string; // "No contexto prático: ..."
  polarity?: 'positive' | 'negative' | 'neutral';
}

export interface ParsedKioskSection {
  exceptionalQuote: string;
  goldenRules: string[];
  terms: EvaluationTerm[];
  columns: AxisColumn[];
}

export function parseKioskMarkdown(markdown: string): ParsedKioskSection {
  const lines = markdown.split('\n');
  let exceptionalQuote =
    'Complete, evidence-based, and internally consistent ratings. The annotator listens fully, separates quality, adherence, and preference, applies every displayed axis correctly, and selects one to three genuinely decisive factors.';
  let goldenRules: string[] = [];
  const columns: AxisColumn[] = [];
  const terms: EvaluationTerm[] = [];

  let currentCol: AxisColumn | null = null;
  let currentTerm: Partial<EvaluationTerm> | null = null;
  let currentField: 'whatIs' | 'context' | null = null;

  const whatIsPrefixes = [
    /^o que é\s*:\s*/i,
    /^what it is\s*:\s*/i,
    /^whatis\s*:\s*/i,
    /^qué es\s*:\s*/i,
    /^qu'est-ce que c'est\s*:\s*/i,
    /^was es ist\s*:\s*/i,
    /^cos'è\s*:\s*/i,
  ];

  const contextPrefixes = [
    /^no contexto prático\s*:\s*/i,
    /^practical context\s*:\s*/i,
    /^context\s*:\s*/i,
    /^contexto práctico\s*:\s*/i,
    /^contexte pratique\s*:\s*/i,
    /^praxis-kontext\s*:\s*/i,
    /^contesto pratico\s*:\s*/i,
  ];

  const flushCurrentTerm = () => {
    if (currentTerm && currentTerm.term) {
      terms.push({
        index: currentTerm.index || terms.length + 1,
        term: currentTerm.term.trim(),
        translation: (currentTerm.translation || '').trim(),
        whatIs: (currentTerm.whatIs || '').trim(),
        practicalContext: (currentTerm.practicalContext || '').trim(),
      });
      currentTerm = null;
      currentField = null;
    }
  };

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

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
        if (/^Rule:\s*/i.test(ql)) {
          goldenRules = ql
            .replace(/^Rule:\s*/i, '')
            .split('|')
            .map(s => s.trim())
            .filter(Boolean);
        } else if (isExceptional && ql.length > 10) {
          exceptionalQuote = ql.replace(/^5\s*[—–-]\s*Exceptional:\s*/i, '');
        }
      }
      continue;
    }

    // Check if line starts a numbered term, e.g. "1. Pitch Contour (Contorno de Tom / Altura)"
    // or "## 1. Pitch Contour (Contorno de Tom / Altura)"
    const termNumberedMatch = trimmed.match(/^(?:##\s+)?(\d+)[\.\)]\s*(.+)$/);
    if (termNumberedMatch) {
      flushCurrentTerm();
      if (currentCol) {
        columns.push(currentCol);
        currentCol = null;
      }

      const num = parseInt(termNumberedMatch[1], 10);
      const titleRaw = termNumberedMatch[2].trim();

      // Split "Pitch Contour (Contorno de Tom / Altura)" into term and translation
      const parensMatch = titleRaw.match(/^([^(]+)(?:\((.+)\))?/);
      const termName = parensMatch ? parensMatch[1].trim() : titleRaw;
      const termTrans = parensMatch && parensMatch[2] ? parensMatch[2].trim() : '';

      currentTerm = {
        index: num,
        term: termName,
        translation: termTrans,
        whatIs: '',
        practicalContext: '',
      };
      i++;
      continue;
    }

    // Check for "O que é:"
    const whatIsMatch = whatIsPrefixes.find(p => p.test(trimmed));
    if (whatIsMatch && currentTerm) {
      currentField = 'whatIs';
      const rest = trimmed.replace(whatIsMatch, '').trim();
      currentTerm.whatIs = rest;
      i++;
      continue;
    }

    // Check for "No contexto prático:"
    const contextMatch = contextPrefixes.find(p => p.test(trimmed));
    if (contextMatch && currentTerm) {
      currentField = 'context';
      const rest = trimmed.replace(contextMatch, '').trim();
      currentTerm.practicalContext = rest;
      i++;
      continue;
    }

    // Continuation line for currentTerm
    if (currentTerm && currentField) {
      if (currentField === 'whatIs') {
        currentTerm.whatIs = currentTerm.whatIs ? `${currentTerm.whatIs} ${trimmed}` : trimmed;
      } else if (currentField === 'context') {
        currentTerm.practicalContext = currentTerm.practicalContext ? `${currentTerm.practicalContext} ${trimmed}` : trimmed;
      }
      i++;
      continue;
    }

    // Parse legacy ## Axis Column
    if (/^##\s+/.test(trimmed)) {
      flushCurrentTerm();
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

  flushCurrentTerm();

  if (currentCol) {
    columns.push(currentCol);
  }

  return {
    exceptionalQuote,
    goldenRules,
    terms,
    columns,
  };
}

interface KioskCheatSheetProps {
  markdown: string;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export function KioskCheatSheet({ markdown, fontSize }: KioskCheatSheetProps) {
  const [copiedPill, setCopiedPill] = useState<string | null>(null);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const parsed = useMemo(() => parseKioskMarkdown(markdown), [markdown]);

  const handleCopy = (term: string) => {
    navigator.clipboard.writeText(term);
    setCopiedPill(term);
    setTimeout(() => {
      setCopiedPill(prev => (prev === term ? null : prev));
    }, 1400);
  };

  const togglePin = (index: number) => {
    setPinnedIndex(prev => (prev === index ? null : index));
  };

  // Typography scale adapted for secondary vertical/portrait monitor
  const fontStyles = {
    normal: {
      bannerTitle: 'text-sm font-extrabold',
      bannerQuote: 'text-sm font-semibold',
      ruleTag: 'text-xs font-semibold px-2.5 py-1',
      termTitle: 'text-lg sm:text-xl font-bold font-mono',
      termSub: 'text-xs sm:text-sm font-medium',
      termNumber: 'text-xs font-mono font-bold px-2 py-0.5',
      popoverWhatIsTitle: 'text-xs font-bold uppercase tracking-wider',
      popoverWhatIsText: 'text-sm leading-relaxed',
      popoverContextTitle: 'text-xs font-bold uppercase tracking-wider',
      popoverContextText: 'text-sm leading-relaxed',
    },
    large: {
      bannerTitle: 'text-base font-extrabold',
      bannerQuote: 'text-base sm:text-lg font-bold',
      ruleTag: 'text-xs sm:text-sm font-semibold px-3 py-1',
      termTitle: 'text-xl sm:text-2xl font-bold font-mono',
      termSub: 'text-sm sm:text-base font-medium',
      termNumber: 'text-sm font-mono font-bold px-2.5 py-1',
      popoverWhatIsTitle: 'text-xs sm:text-sm font-bold uppercase tracking-wider',
      popoverWhatIsText: 'text-base leading-relaxed',
      popoverContextTitle: 'text-xs sm:text-sm font-bold uppercase tracking-wider',
      popoverContextText: 'text-base leading-relaxed',
    },
    xlarge: {
      bannerTitle: 'text-lg font-extrabold',
      bannerQuote: 'text-lg sm:text-xl font-bold',
      ruleTag: 'text-sm font-bold px-3.5 py-1.5',
      termTitle: 'text-2xl sm:text-3xl font-bold font-mono',
      termSub: 'text-base sm:text-lg font-semibold',
      termNumber: 'text-base font-mono font-bold px-3 py-1',
      popoverWhatIsTitle: 'text-sm font-bold uppercase tracking-wider',
      popoverWhatIsText: 'text-lg leading-relaxed',
      popoverContextTitle: 'text-sm font-bold uppercase tracking-wider',
      popoverContextText: 'text-lg leading-relaxed',
    },
  }[fontSize];

  return (
    <div className="flex-1 flex flex-col gap-2 min-h-0 h-full overflow-hidden select-none">
      {/* 5 — Exceptional Guideline Banner */}
      <div className="shrink-0 bg-neutral-900 dark:bg-[#151518] border-2 border-amber-500/50 dark:border-amber-400/40 rounded-xl px-4 py-2.5 shadow-md">
        <div className="flex flex-col gap-1.5">
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

      {/* Main View: Clean Audio Evaluation Cards with Interactive Hover Info */}
      {parsed.terms.length > 0 ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2.5 min-h-0 h-full overflow-y-auto pr-0.5">
          {parsed.terms.map(item => {
            const isHovered = hoveredIndex === item.index;
            const isPinned = pinnedIndex === item.index;
            const isOpen = isHovered || isPinned;
            const isCopied = copiedPill === item.term;

            return (
              <div
                key={item.index}
                onMouseEnter={() => setHoveredIndex(item.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative flex flex-col rounded-xl border transition-all duration-150 overflow-hidden ${
                  isOpen
                    ? 'bg-white dark:bg-[#18181c] border-amber-400/80 dark:border-amber-400/80 shadow-lg ring-1 ring-amber-400/40'
                    : 'bg-white dark:bg-[#131316] border-neutral-200 dark:border-neutral-800/90 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs'
                }`}
              >
                {/* Header Row: Number + English Term + Copy Button + Info Trigger */}
                <div className="px-4 py-3 flex items-start justify-between gap-3 bg-neutral-50/70 dark:bg-[#16161a] border-b border-neutral-200/70 dark:border-neutral-800/60">
                  <div
                    onClick={() => handleCopy(item.term)}
                    className="flex-1 flex items-start gap-2.5 cursor-pointer group"
                    title="Clique para copiar o termo em inglês"
                  >
                    <span
                      className={`rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0 font-mono ${fontStyles.termNumber}`}
                    >
                      0{item.index}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors ${fontStyles.termTitle}`}
                        >
                          {item.term}
                        </span>
                        {isCopied ? (
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            <Check className="w-3.5 h-3.5" /> COPIED
                          </span>
                        ) : (
                          <span className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-opacity">
                            <Copy className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      {item.translation && (
                        <span className={`text-neutral-500 dark:text-neutral-400 ${fontStyles.termSub}`}>
                          {item.translation}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Trigger Button (Hover / Click) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => togglePin(item.index)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isOpen
                          ? 'bg-amber-500 text-neutral-950 border-amber-400 font-extrabold shadow-xs'
                          : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                      title={isPinned ? 'Clique para desafixar info' : 'Passe o mouse ou clique para fixar o info'}
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>{isOpen ? 'INFO' : 'info'}</span>
                    </button>
                  </div>
                </div>

                {/* Body: Clean State vs Hovered/Expanded Explanations */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3 text-neutral-800 dark:text-neutral-200">
                  {isOpen ? (
                    <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                      {/* O que é */}
                      {item.whatIs && (
                        <div className="space-y-1 bg-amber-500/5 dark:bg-amber-400/5 p-3 rounded-lg border border-amber-500/20">
                          <div className={`text-amber-700 dark:text-amber-400 flex items-center gap-1.5 ${fontStyles.popoverWhatIsTitle}`}>
                            <span>📌 O que é:</span>
                          </div>
                          <p className={`text-neutral-700 dark:text-neutral-200 ${fontStyles.popoverWhatIsText}`}>
                            {item.whatIs}
                          </p>
                        </div>
                      )}

                      {/* No contexto prático */}
                      {item.practicalContext && (
                        <div className="space-y-1 bg-neutral-100/70 dark:bg-neutral-800/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700/60">
                          <div className={`text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 ${fontStyles.popoverContextTitle}`}>
                            <span>💡 No contexto prático:</span>
                          </div>
                          <p className={`text-neutral-700 dark:text-neutral-300 ${fontStyles.popoverContextText}`}>
                            {item.practicalContext}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => handleCopy(item.term)}
                      className="flex-1 flex flex-col justify-center py-2 cursor-pointer group"
                    >
                      <p className={`text-neutral-600 dark:text-neutral-400 line-clamp-2 italic ${fontStyles.popoverWhatIsText}`}>
                        {item.whatIs}
                      </p>
                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center gap-1">
                          <Copy className="w-3 h-3" /> Clique para copiar termo
                        </span>
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                          <Info className="w-3 h-3" /> Passe o mouse para ver detalhes
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Fallback: Axis Columns View */
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2.5 min-h-0 h-full overflow-hidden">
          {parsed.columns.map((col, colIdx) => (
            <div
              key={colIdx}
              className="flex flex-col min-h-0 h-full bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden"
            >
              <div className="px-3.5 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-[#18181b] shrink-0 flex items-baseline justify-between gap-2">
                <h2 className="text-neutral-900 dark:text-neutral-100 font-bold tracking-tight text-base">
                  {col.title}
                </h2>
                {col.description && (
                  <span className="text-neutral-500 dark:text-neutral-400 truncate max-w-[50%] text-right text-xs">
                    {col.description}
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
                {col.positives.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-0.5">
                      <span className="font-mono tracking-wider uppercase text-emerald-600 dark:text-emerald-400 text-xs font-bold">
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
                            className={`text-left rounded-lg border transition-all cursor-pointer flex items-center gap-2 px-3 py-1.5 ${
                              isCopied
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                                : 'bg-emerald-50/90 dark:bg-emerald-950/25 border-emerald-300/80 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:border-emerald-400'
                            }`}
                          >
                            <span className="text-sm font-bold font-mono">{item.term}</span>
                            {item.meaning && (
                              <span className="text-xs font-sans text-emerald-700/90 dark:text-emerald-300/80">
                                {item.meaning}
                              </span>
                            )}
                            {isCopied && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {col.negatives.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center justify-between px-0.5">
                      <span className="font-mono tracking-wider uppercase text-rose-600 dark:text-rose-400 text-xs font-bold">
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
                            className={`text-left rounded-lg border transition-all cursor-pointer flex items-center gap-2 px-3 py-1.5 ${
                              isCopied
                                ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                                : 'bg-rose-50/90 dark:bg-rose-950/25 border-rose-300/80 dark:border-rose-800/60 text-rose-950 dark:text-rose-100 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:border-rose-400'
                            }`}
                          >
                            <span className="text-sm font-bold font-mono">{item.term}</span>
                            {item.meaning && (
                              <span className="text-xs font-sans text-rose-700/90 dark:text-rose-300/80">
                                {item.meaning}
                              </span>
                            )}
                            {isCopied && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-white" />}
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
      )}

      {/* Floating toast feedback */}
      {copiedPill && (
        <div className="fixed bottom-4 right-4 z-50 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 px-3.5 py-2 rounded-lg shadow-xl text-sm font-mono font-bold flex items-center gap-2 border border-neutral-700 dark:border-neutral-200 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>Copied: "{copiedPill}"</span>
        </div>
      )}
    </div>
  );
}
