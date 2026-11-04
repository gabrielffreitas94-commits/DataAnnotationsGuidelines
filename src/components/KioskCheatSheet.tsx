import { useState, useMemo } from 'react';
import { Star, Check, Copy, Sparkles, MessageSquareQuote } from 'lucide-react';

export interface EvaluationTerm {
  index: number;
  term: string; // English term: "Pitch Contour"
  translation: string; // Localized subtitle: "Contorno de Tom — Rising or Falling"
  whatIs: string; // "O que é: ..."
  bullets: string[]; // Important details (e.g., rising/falling, ritmo quebrado, etc.)
  practicalContext: string; // "No contexto prático: ..."
  examples: string[]; // Rationale phrases in English
}

export interface AxisColumn {
  title: string;
  description: string;
  positives: { polarity: 'positive'; term: string; meaning: string }[];
  negatives: { polarity: 'negative'; term: string; meaning: string }[];
  phrases: string[];
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

  let currentTerm: Partial<EvaluationTerm> | null = null;
  let currentField: 'whatIs' | 'bullets' | 'context' | 'examples' | null = null;

  const flushCurrentTerm = () => {
    if (currentTerm && currentTerm.term) {
      terms.push({
        index: currentTerm.index || terms.length + 1,
        term: currentTerm.term.trim(),
        translation: (currentTerm.translation || '').trim(),
        whatIs: (currentTerm.whatIs || '').trim(),
        bullets: currentTerm.bullets || [],
        practicalContext: (currentTerm.practicalContext || '').trim(),
        examples: currentTerm.examples || [],
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

    // Match numbered item e.g. "1. Pitch Contour (Contorno de Tom)" or "## 1. Pitch Contour"
    const termMatch = trimmed.match(/^(?:##\s+)?(\d+)[\.\)]\s*(.+)$/);
    if (termMatch) {
      flushCurrentTerm();
      const num = parseInt(termMatch[1], 10);
      const titleRaw = termMatch[2].trim();

      const parensMatch = titleRaw.match(/^([^(]+)(?:\((.+)\))?/);
      const termName = parensMatch ? parensMatch[1].trim() : titleRaw;
      const termTrans = parensMatch && parensMatch[2] ? parensMatch[2].trim() : '';

      currentTerm = {
        index: num,
        term: termName,
        translation: termTrans,
        whatIs: '',
        bullets: [],
        practicalContext: '',
        examples: [],
      };
      currentField = null;
      i++;
      continue;
    }

    // Match section headers inside a term
    if (/^(?:o que é|what it is|whatis|qué es|was es ist|cos'è)\s*:\s*/i.test(trimmed)) {
      if (currentTerm) {
        currentField = 'whatIs';
        currentTerm.whatIs = trimmed.replace(/^(?:o que é|what it is|whatis|qué es|was es ist|cos'è)\s*:\s*/i, '').trim();
      }
      i++;
      continue;
    }

    if (/^(?:detalhes|details|bullets|detalles)\s*:\s*/i.test(trimmed)) {
      currentField = 'bullets';
      i++;
      continue;
    }

    if (/^(?:no contexto prático|practical context|context|contexto práctico|contexte pratique|praxis-kontext|contesto pratico)\s*:\s*/i.test(trimmed)) {
      if (currentTerm) {
        currentField = 'context';
        currentTerm.practicalContext = trimmed.replace(/^(?:no contexto prático|practical context|context|contexto práctico|contexte pratique|praxis-kontext|contesto pratico)\s*:\s*/i, '').trim();
      }
      i++;
      continue;
    }

    if (/^(?:exemplos|examples|rationale examples|ejemplos)\s*:\s*/i.test(trimmed)) {
      currentField = 'examples';
      i++;
      continue;
    }

    // Collect bullets (- or • or indented lines)
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      const bulletText = trimmed.replace(/^[-•]\s*/, '').trim();
      if (currentTerm) {
        if (currentField === 'examples' || bulletText.startsWith('"')) {
          currentTerm.examples = currentTerm.examples || [];
          currentTerm.examples.push(bulletText.replace(/^["']|["']$/g, ''));
        } else {
          currentTerm.bullets = currentTerm.bullets || [];
          currentTerm.bullets.push(bulletText);
        }
      }
      i++;
      continue;
    }

    // Collect quote examples (* or "..." or '...')
    if (trimmed.startsWith('* ') || (trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith('“') && trimmed.endsWith('”'))) {
      const phrase = trimmed.replace(/^\*\s*/, '').replace(/^["'“]|["'”]$/g, '').trim();
      if (currentTerm && phrase) {
        currentTerm.examples = currentTerm.examples || [];
        currentTerm.examples.push(phrase);
      }
      i++;
      continue;
    }

    // Continuation line
    if (currentTerm) {
      if (currentField === 'whatIs') {
        currentTerm.whatIs = currentTerm.whatIs ? `${currentTerm.whatIs} ${trimmed}` : trimmed;
      } else if (currentField === 'context') {
        currentTerm.practicalContext = currentTerm.practicalContext ? `${currentTerm.practicalContext} ${trimmed}` : trimmed;
      } else if (currentField === 'bullets') {
        currentTerm.bullets = currentTerm.bullets || [];
        currentTerm.bullets.push(trimmed);
      } else if (currentField === 'examples') {
        currentTerm.examples = currentTerm.examples || [];
        currentTerm.examples.push(trimmed.replace(/^["']|["']$/g, ''));
      }
    }

    i++;
  }

  flushCurrentTerm();

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
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  const parsed = useMemo(() => parseKioskMarkdown(markdown), [markdown]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => {
      setCopiedItem(prev => (prev === label ? null : prev));
    }, 1500);
  };

  // Typography scale adapted for secondary vertical/portrait monitor
  const fontStyles = {
    normal: {
      bannerTitle: 'text-sm font-extrabold',
      bannerQuote: 'text-sm font-semibold',
      ruleTag: 'text-xs font-semibold px-2 py-0.5',
      termTitle: 'text-lg sm:text-xl font-bold font-mono',
      termSub: 'text-xs sm:text-sm font-semibold',
      termNumber: 'text-xs font-mono font-bold px-2 py-0.5',
      bodyText: 'text-xs sm:text-sm leading-relaxed',
      bulletText: 'text-xs sm:text-sm',
      exampleText: 'text-xs font-mono',
    },
    large: {
      bannerTitle: 'text-base font-extrabold',
      bannerQuote: 'text-base sm:text-lg font-bold',
      ruleTag: 'text-xs sm:text-sm font-semibold px-2.5 py-1',
      termTitle: 'text-xl sm:text-2xl font-extrabold font-mono',
      termSub: 'text-sm sm:text-base font-semibold',
      termNumber: 'text-sm font-mono font-bold px-2.5 py-1',
      bodyText: 'text-sm sm:text-base leading-relaxed',
      bulletText: 'text-sm sm:text-base',
      exampleText: 'text-xs sm:text-sm font-mono',
    },
    xlarge: {
      bannerTitle: 'text-lg font-extrabold',
      bannerQuote: 'text-lg sm:text-xl font-bold',
      ruleTag: 'text-sm font-bold px-3 py-1',
      termTitle: 'text-2xl sm:text-3xl font-extrabold font-mono',
      termSub: 'text-base sm:text-lg font-bold',
      termNumber: 'text-base font-mono font-bold px-3 py-1',
      bodyText: 'text-base sm:text-lg leading-relaxed',
      bulletText: 'text-base sm:text-lg',
      exampleText: 'text-sm font-mono',
    },
  }[fontSize];

  return (
    <div className="flex-1 flex flex-col gap-2 min-h-0 h-full overflow-hidden select-none">
      {/* 5 — Exceptional Guideline Banner (Sempre visível no topo) */}
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

      {/* Main Grid: 6 Cards ALWAYS VISIBLE with Hover Rationale Examples */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2.5 min-h-0 h-full overflow-y-auto pr-0.5">
        {parsed.terms.map(item => {
          const isHovered = hoveredCardIndex === item.index;
          const isTermCopied = copiedItem === item.term;

          return (
            <div
              key={item.index}
              onMouseEnter={() => setHoveredCardIndex(item.index)}
              onMouseLeave={() => setHoveredCardIndex(null)}
              className={`flex flex-col rounded-xl border transition-all duration-150 overflow-hidden ${
                isHovered
                  ? 'bg-white dark:bg-[#19191e] border-amber-400 dark:border-amber-400/90 shadow-md ring-1 ring-amber-400/30'
                  : 'bg-white dark:bg-[#131316] border-neutral-200 dark:border-neutral-800/90 shadow-xs'
              }`}
            >
              {/* Header: Termo Principal em Inglês (Clique para copiar) + Tradução */}
              <div className="px-3.5 py-2.5 flex items-center justify-between gap-3 bg-neutral-50/80 dark:bg-[#17171b] border-b border-neutral-200/80 dark:border-neutral-800/70">
                <div
                  onClick={() => handleCopy(item.term, item.term)}
                  className="flex-1 flex items-baseline gap-2.5 cursor-pointer group"
                  title="Clique para copiar o termo em inglês"
                >
                  <span
                    className={`rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shrink-0 font-mono ${fontStyles.termNumber}`}
                  >
                    0{item.index}
                  </span>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      className={`text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors ${fontStyles.termTitle}`}
                    >
                      {item.term}
                    </span>
                    {item.translation && (
                      <span className={`text-neutral-500 dark:text-neutral-400 ${fontStyles.termSub}`}>
                        ({item.translation})
                      </span>
                    )}
                  </div>
                </div>

                {/* Botão de Cópia Rápida do Termo */}
                <button
                  type="button"
                  onClick={() => handleCopy(item.term, item.term)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isTermCopied
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-neutral-100 dark:bg-neutral-800/90 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                  title="Copiar termo para o Rationale"
                >
                  {isTermCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>

              {/* Corpo: 100% Sempre Visível (Definição + Detalhes / Regras de Avaliação) */}
              <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                <div className="space-y-2">
                  {/* Definição direta (Sempre Visível) */}
                  {item.whatIs && (
                    <p className={`text-neutral-800 dark:text-neutral-200 font-medium ${fontStyles.bodyText}`}>
                      {item.whatIs}
                    </p>
                  )}

                  {/* Bullets & Informações Adicionais (Sempre Visíveis) */}
                  {item.bullets.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {item.bullets.map((bullet, bIdx) => (
                        <div
                          key={bIdx}
                          className={`flex items-start gap-2 text-neutral-700 dark:text-neutral-300 bg-neutral-100/70 dark:bg-neutral-800/40 px-2.5 py-1.5 rounded-lg border border-neutral-200/60 dark:border-neutral-800 ${fontStyles.bulletText}`}
                        >
                          <span className="text-amber-500 font-bold shrink-0">•</span>
                          <span className="leading-snug">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Contexto Prático (Sempre Visível se não houver bullets ou como reforço) */}
                  {item.practicalContext && item.bullets.length === 0 && (
                    <div className={`text-neutral-600 dark:text-neutral-400 italic bg-neutral-50 dark:bg-neutral-900/40 p-2 rounded-lg border border-neutral-100 dark:border-neutral-800/50 ${fontStyles.bodyText}`}>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300 not-italic">Contexto: </span>
                      {item.practicalContext}
                    </div>
                  )}
                </div>

                {/* Seção de Exemplos: Mostra 1 exemplo de preview e no HOVER mostra todos os exemplos prontos para copiar */}
                {item.examples.length > 0 && (
                  <div
                    className={`mt-1 rounded-lg border transition-all duration-150 ${
                      isHovered
                        ? 'bg-amber-500/10 dark:bg-amber-400/10 border-amber-500/40 p-2.5 space-y-2 shadow-xs'
                        : 'bg-neutral-50 dark:bg-[#151518] border-neutral-200/70 dark:border-neutral-800/80 p-2'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <MessageSquareQuote className="w-3.5 h-3.5" />
                        <span>{isHovered ? `Exemplos de Rationale (${item.examples.length})` : 'Exemplo de Rationale (Passe o mouse)'}</span>
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">Clique na frase p/ copiar</span>
                    </div>

                    {/* No hover mostra TODOS os exemplos; fora do hover mostra o 1º como preview */}
                    <div className="space-y-1.5">
                      {(isHovered ? item.examples : item.examples.slice(0, 1)).map((ex, eIdx) => {
                        const isCopied = copiedItem === ex;
                        return (
                          <div
                            key={eIdx}
                            onClick={() => handleCopy(ex, ex)}
                            className={`group/ex flex items-start justify-between gap-2 p-2 rounded-md border text-left cursor-pointer transition-all ${
                              isCopied
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-white dark:bg-[#1a1a1f] border-neutral-200 dark:border-neutral-700/60 text-neutral-800 dark:text-neutral-200 hover:border-amber-400 hover:bg-amber-500/5'
                            }`}
                            title="Clique para copiar este exemplo de rationale"
                          >
                            <p className={`flex-1 italic leading-relaxed ${fontStyles.exampleText}`}>
                              "{ex}"
                            </p>
                            <span
                              className={`shrink-0 text-[11px] font-mono font-bold px-1.5 py-0.5 rounded transition-all ${
                                isCopied
                                  ? 'bg-white text-emerald-800'
                                  : 'text-neutral-400 group-hover/ex:text-amber-500'
                              }`}
                            >
                              {isCopied ? 'COPIED' : 'COPY'}
                            </span>
                          </div>
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

      {/* Floating toast feedback ao copiar */}
      {copiedItem && (
        <div className="fixed bottom-4 right-4 z-50 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 px-3.5 py-2 rounded-lg shadow-xl text-sm font-mono font-bold flex items-center gap-2 border border-neutral-700 dark:border-neutral-200 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span className="truncate max-w-xs">Copiado: "{copiedItem}"</span>
        </div>
      )}
    </div>
  );
}
