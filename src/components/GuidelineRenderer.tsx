import { useState, useMemo } from 'react';
import {
  CheckSquare,
  Square,
  AlertTriangle,
  Info,
  Lightbulb,
  ShieldAlert,
  Flame,
  Copy,
  Check,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

interface GuidelineRendererProps {
  sectionId: string;
  markdown: string;
  checkedMap: Record<string, boolean>;
  onToggleCheck: (itemKey: string) => void;
  onResetSectionChecks?: () => void;
  compact?: boolean;
}

interface ParsedCallout {
  kind: 'callout';
  alertType: 'IMPORTANT' | 'TIP' | 'WARNING' | 'CAUTION' | 'NOTE';
  lines: string[];
}

interface ParsedChecklist {
  kind: 'checklist';
  items: { id: string; text: string; defaultChecked: boolean }[];
}

interface ParsedBulletList {
  kind: 'list';
  ordered: boolean;
  items: string[];
}

interface ParsedTable {
  kind: 'table';
  headers: string[];
  rows: string[][];
}

interface ParsedCode {
  kind: 'code';
  lang: string;
  code: string;
}

interface ParsedParagraph {
  kind: 'paragraph';
  text: string;
}

type ParsedBlock =
  | ParsedCallout
  | ParsedChecklist
  | ParsedBulletList
  | ParsedTable
  | ParsedCode
  | ParsedParagraph;

interface CardGroup {
  title: string | null;
  blocks: ParsedBlock[];
}

function renderInlineMarkdown(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return (
        <strong key={i} className="font-semibold text-neutral-900 dark:text-neutral-100">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      return (
        <code
          key={i}
          className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      return (
        <em key={i} className="italic text-neutral-700 dark:text-neutral-300">
          {token.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{token}</span>;
  });
}

function parseBlocksFromLines(lines: string[], sectionId: string, cardIdx: number): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  let i = 0;
  let checkCounter = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed === '---') {
      i++;
      continue;
    }

    // 1. Code block ```
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push({
        kind: 'code',
        lang,
        code: codeLines.join('\n'),
      });
      continue;
    }

    // 2. Callout / Blockquote > [!TYPE]
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      const firstLine = quoteLines[0] || '';
      const alertMatch = firstLine.match(/^\[!(IMPORTANT|TIP|WARNING|CAUTION|NOTE)\]/i);
      const alertType = alertMatch
        ? (alertMatch[1].toUpperCase() as ParsedCallout['alertType'])
        : 'NOTE';
      const bodyLines = alertMatch ? quoteLines.slice(1) : quoteLines;
      blocks.push({
        kind: 'callout',
        alertType,
        lines: bodyLines.filter(Boolean),
      });
      continue;
    }

    // 3. Markdown Table | ... |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const parseRow = (rowStr: string) =>
          rowStr
            .replace(/^\||\|$/g, '')
            .split('|')
            .map(c => c.trim());

        const headers = parseRow(tableLines[0]);
        const isSeparator = /^[\s|:-]+$/.test(tableLines[1]);
        const dataLines = isSeparator ? tableLines.slice(2) : tableLines.slice(1);
        const rows = dataLines.map(parseRow);
        blocks.push({
          kind: 'table',
          headers,
          rows,
        });
        continue;
      }
    }

    // 4. Checklist - [ ] or - [x]
    if (/^[-*]\s+\[([ xX])\]\s+/.test(trimmed)) {
      const items: { id: string; text: string; defaultChecked: boolean }[] = [];
      while (i < lines.length && /^[-*]\s+\[([ xX])\]\s+/.test(lines[i].trim())) {
        const lineTrim = lines[i].trim();
        const m = lineTrim.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/);
        if (m) {
          checkCounter++;
          items.push({
            id: `${sectionId}_c${cardIdx}_item${checkCounter}`,
            defaultChecked: m[1].toLowerCase() === 'x',
            text: m[2].trim(),
          });
        }
        i++;
      }
      blocks.push({
        kind: 'checklist',
        items,
      });
      continue;
    }

    // 5. Regular bullet or ordered list
    if (/^(?:[-*•]|\d+[.)])\s+/.test(trimmed)) {
      const ordered = /^\d+[.)]\s+/.test(trimmed);
      const items: string[] = [];
      while (
        i < lines.length &&
        /^(?:[-*•]|\d+[.)])\s+/.test(lines[i].trim()) &&
        !/^[-*]\s+\[([ xX])\]\s+/.test(lines[i].trim())
      ) {
        items.push(lines[i].trim().replace(/^(?:[-*•]|\d+[.)])\s+/, ''));
        i++;
      }
      blocks.push({
        kind: 'list',
        ordered,
        items,
      });
      continue;
    }

    // 6. Paragraph / Subheading ###
    blocks.push({
      kind: 'paragraph',
      text: trimmed.replace(/^#{3,6}\s+/, ''),
    });
    i++;
  }

  return blocks;
}

export function parseMarkdownIntoCards(markdown: string, sectionId: string): CardGroup[] {
  const lines = markdown.split('\n');
  const rawGroups: { title: string | null; lines: string[] }[] = [];
  let currentGroup: { title: string | null; lines: string[] } = { title: null, lines: [] };

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^##\s+/.test(trimmed)) {
      if (currentGroup.title !== null || currentGroup.lines.some(l => l.trim().length > 0)) {
        rawGroups.push(currentGroup);
      }
      currentGroup = {
        title: trimmed.replace(/^##\s+/, '').trim(),
        lines: [],
      };
    } else {
      currentGroup.lines.push(line);
    }
  }

  if (currentGroup.title !== null || currentGroup.lines.some(l => l.trim().length > 0)) {
    rawGroups.push(currentGroup);
  }

  return rawGroups
    .map((g, idx) => ({
      title: g.title,
      blocks: parseBlocksFromLines(g.lines, sectionId, idx),
    }))
    .filter(g => g.blocks.length > 0);
}

export function GuidelineRenderer({
  sectionId,
  markdown,
  checkedMap,
  onToggleCheck,
  onResetSectionChecks,
  compact = false,
}: GuidelineRendererProps) {
  const { t } = useI18n();
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const cards = useMemo(() => parseMarkdownIntoCards(markdown, sectionId), [markdown, sectionId]);

  const allChecklistItems = useMemo(() => {
    const list: { id: string; defaultChecked: boolean }[] = [];
    for (const c of cards) {
      for (const b of c.blocks) {
        if (b.kind === 'checklist') {
          list.push(...b.items);
        }
      }
    }
    return list;
  }, [cards]);

  const totalChecks = allChecklistItems.length;
  const completedChecks = allChecklistItems.filter(item =>
    item.id in checkedMap ? checkedMap[item.id] : item.defaultChecked
  ).length;
  const progressPercent = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(card => {
      if (card.title?.toLowerCase().includes(q)) return true;
      return card.blocks.some(b => {
        if (b.kind === 'callout') return b.lines.some(l => l.toLowerCase().includes(q));
        if (b.kind === 'checklist') return b.items.some(i => i.text.toLowerCase().includes(q));
        if (b.kind === 'list') return b.items.some(i => i.toLowerCase().includes(q));
        if (b.kind === 'paragraph') return b.text.toLowerCase().includes(q);
        if (b.kind === 'code') return b.code.toLowerCase().includes(q);
        if (b.kind === 'table') {
          return (
            b.headers.some(h => h.toLowerCase().includes(q)) ||
            b.rows.some(r => r.some(c => c.toLowerCase().includes(q)))
          );
        }
        return false;
      });
    });
  }, [cards, searchQuery]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(id);
    setTimeout(() => setCopiedCodeIdx(null), 1800);
  };

  return (
    <div className="space-y-4">
      {/* Barra de Progresso do Checklist + Filtro Rápido */}
      {!compact && (totalChecks > 0 || cards.length > 1) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-2xs">
          {totalChecks > 0 ? (
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                  <span>{t('workspace.checklistProgress')}</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                    {t('workspace.checklistCompleted', {
                      done: completedChecks,
                      total: totalChecks,
                      percent: progressPercent,
                    })}
                  </span>
                  {completedChecks > 0 && onResetSectionChecks && (
                    <button
                      type="button"
                      onClick={onResetSectionChecks}
                      className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t('workspace.btnResetChecklist')}</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    progressPercent === 100
                      ? 'bg-emerald-500 dark:bg-emerald-400'
                      : 'bg-neutral-900 dark:bg-neutral-200'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {t('workspace.modeGuidelineBadge')}
            </div>
          )}

          {/* Campo de Filtro Rápido */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('workspace.searchPlaceholder')}
              className="w-full text-xs bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 rounded-xl pl-8 pr-7 py-1.5 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cards de Conteúdo */}
      <div className="space-y-4">
        {filteredCards.map((card, cardIdx) => (
          <div
            key={cardIdx}
            className={`${
              card.title
                ? 'bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs space-y-4'
                : 'space-y-3'
            }`}
          >
            {card.title && (
              <div className="border-b border-neutral-100 dark:border-neutral-800/80 pb-2.5 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {card.title}
                </h2>
              </div>
            )}

            <div className="space-y-3.5">
              {card.blocks.map((block, bIdx) => {
                if (block.kind === 'callout') {
                  const styles = {
                    IMPORTANT: {
                      wrap: 'bg-neutral-100/90 dark:bg-[#19191d] border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200',
                      icon: <ShieldAlert className="w-4 h-4 text-neutral-900 dark:text-neutral-100 shrink-0 mt-0.5" />,
                    },
                    TIP: {
                      wrap: 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200',
                      icon: <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
                    },
                    WARNING: {
                      wrap: 'bg-amber-50/80 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200',
                      icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
                    },
                    CAUTION: {
                      wrap: 'bg-red-50/80 dark:bg-red-950/25 border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200',
                      icon: <Flame className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />,
                    },
                    NOTE: {
                      wrap: 'bg-neutral-50 dark:bg-[#141417] border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300',
                      icon: <Info className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0 mt-0.5" />,
                    },
                  }[block.alertType];

                  return (
                    <div
                      key={bIdx}
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${styles.wrap}`}
                    >
                      {styles.icon}
                      <div className="space-y-1 flex-1">
                        {block.lines.map((line, lIdx) => (
                          <p key={lIdx}>{renderInlineMarkdown(line)}</p>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (block.kind === 'checklist') {
                  return (
                    <div key={bIdx} className="space-y-2">
                      {block.items.map(item => {
                        const isChecked =
                          item.id in checkedMap ? checkedMap[item.id] : item.defaultChecked;
                        return (
                          <div
                            key={item.id}
                            onClick={() => onToggleCheck(item.id)}
                            className={`group flex items-start gap-3 p-3 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer select-none ${
                              isChecked
                                ? 'bg-neutral-50/70 dark:bg-[#121214] border-neutral-200/70 dark:border-neutral-800/60 text-neutral-400 dark:text-neutral-500'
                                : 'bg-neutral-50/40 dark:bg-[#111113] border-neutral-200 dark:border-neutral-800/90 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400 dark:hover:border-neutral-700'
                            }`}
                          >
                            <button
                              type="button"
                              className="mt-0.5 shrink-0 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                            <div className={`flex-1 ${isChecked ? 'line-through opacity-75' : ''}`}>
                              {renderInlineMarkdown(item.text)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                if (block.kind === 'list') {
                  return (
                    <ul key={bIdx} className="space-y-2 pl-1">
                      {block.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed"
                        >
                          {block.ordered ? (
                            <span className="w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[10px] font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 shrink-0 mt-2" />
                          )}
                          <span className="flex-1">{renderInlineMarkdown(item)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                if (block.kind === 'table') {
                  return (
                    <div
                      key={bIdx}
                      className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800"
                    >
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-neutral-50 dark:bg-[#111113] border-b border-neutral-200 dark:border-neutral-800">
                            {block.headers.map((header, hIdx) => (
                              <th
                                key={hIdx}
                                className="py-2.5 px-3.5 font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap"
                              >
                                {renderInlineMarkdown(header)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
                          {block.rows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/20 transition-colors"
                            >
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className="py-2.5 px-3.5 text-neutral-700 dark:text-neutral-300 leading-relaxed align-top"
                                >
                                  {renderInlineMarkdown(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                if (block.kind === 'code') {
                  const codeId = `${cardIdx}_${bIdx}`;
                  const isCopied = copiedCodeIdx === codeId;
                  return (
                    <div
                      key={bIdx}
                      className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#111113] overflow-hidden"
                    >
                      <div className="px-3.5 py-1.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-100/60 dark:bg-[#141417]">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          {block.lang || 'snippet'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(block.code, codeId)}
                          className="flex items-center gap-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>{t('workspace.copiedSnippet')}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{t('workspace.copySnippet')}</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3.5 text-xs font-mono text-neutral-800 dark:text-neutral-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {block.code}
                      </pre>
                    </div>
                  );
                }

                return (
                  <p
                    key={bIdx}
                    className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed"
                  >
                    {renderInlineMarkdown(block.text)}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
