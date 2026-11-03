import { useState } from 'react';
import {
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Layers,
  Terminal,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { OFFICIAL_GIST_URL } from '../services/gistService';

interface GistGuidePageProps {
  onBackToWorkspace: () => void;
}

const EXAMPLE_GIST_MARKDOWN = `# 1. Checklist do Projeto

> [!IMPORTANT]
> Verifique todas as restrições negativas do prompt antes de comparar os modelos.

## Passos Obrigatórios
- [ ] Executar código do Modelo A e Modelo B localmente
- [ ] Checar todas as URLs e fatos em fontes primárias
- [ ] Validar formatação exigida no prompt

---

# 2. Rubrica do Projeto

| Dimensão | Sem Problemas | Erro Grave |
| :--- | :--- | :--- |
| **Instruction Following** | Cumpre 100% das regras | Viola restrição explícita |
| **Truthfulness** | Fatos verificados | Alucinação ou dado falso |

---

# 3. Gerador de Rationale SxS

Veredito: {{veredito:select[Modelo A é melhor, Empate, Modelo B é melhor]}}

Pontos Fortes do Modelo A:
{{fortes_a:list}}

Pontos Fortes do Modelo B:
{{fortes_b:list}}

{{#if incluir_teste_codigo}}
Resultado da Execução do Código:
{{log_execucao:code}}
{{/if}}

Conclusão Decisiva:
{{conclusao:textarea}}`;

export function GistGuidePage({ onBackToWorkspace }: GistGuidePageProps) {
  const { t } = useI18n();
  const [copiedExample, setCopiedExample] = useState(false);

  const handleCopyExample = () => {
    navigator.clipboard.writeText(EXAMPLE_GIST_MARKDOWN);
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 2000);
  };

  const syntaxRows = [
    { syntax: '# Nome da Aba', component: 'Top Tab', desc: t('guide.syntaxTabDesc') },
    { syntax: '## Subtítulo', component: 'Card Section', desc: t('guide.syntaxCardDesc') },
    { syntax: '- [ ] Item de verificação', component: 'Interactive Checklist', desc: t('guide.syntaxCheckDesc') },
    { syntax: '> [!IMPORTANT] / [!TIP] / [!WARNING]', component: 'Callout Alert', desc: t('guide.syntaxAlertDesc') },
    { syntax: '| Col 1 | Col 2 |', component: 'Rubric Table', desc: t('guide.syntaxTableDesc') },
    { syntax: '{{campo:text}}', component: t('fields.text'), desc: t('guide.syntaxVarTextDesc') },
    { syntax: '{{campo:textarea}}', component: t('fields.textarea'), desc: t('guide.syntaxVarTextareaDesc') },
    { syntax: '{{campo:list}}', component: t('fields.list'), desc: t('guide.syntaxVarListDesc') },
    { syntax: '{{campo:numbered_list}}', component: t('fields.numberedList'), desc: t('guide.syntaxVarNumListDesc') },
    { syntax: '{{campo:select[A, B*]}}', component: t('fields.select'), desc: t('guide.syntaxVarSelectDesc') },
    { syntax: '{{campo:multiselect[A, B]}}', component: t('fields.multiselect'), desc: t('guide.syntaxVarMultiDesc') },
    { syntax: '{{campo:code}}', component: t('fields.code'), desc: t('guide.syntaxVarCodeDesc') },
    { syntax: '{{#if var}}...{{/if}}', component: t('fields.conditionalBlock'), desc: t('guide.syntaxVarIfDesc') },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Cabeçalho do Guia */}
      <div className="bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('guide.badge')}</span>
          </span>

          <div className="flex items-center gap-2">
            <a
              href={OFFICIAL_GIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t('guide.btnOpenOfficialGist')}</span>
            </a>
            <button
              type="button"
              onClick={onBackToWorkspace}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-black dark:bg-neutral-200 dark:hover:bg-white text-white dark:text-neutral-950 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('guide.btnBackToApp')}</span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            {t('guide.title')}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-3xl">
            {t('guide.subtitle')}
          </p>
        </div>

        {/* 3 Passos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              <Terminal className="w-4 h-4 text-neutral-500" />
              <span>{t('guide.step1Title')}</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('guide.step1Desc')}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              <Layers className="w-4 h-4 text-neutral-500" />
              <span>{t('guide.step2Title')}</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('guide.step2Desc')}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              <Sparkles className="w-4 h-4 text-neutral-500" />
              <span>{t('guide.step3Title')}</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('guide.step3Desc')}
            </p>
          </div>
        </div>

        {/* Nota de i18n EFIGS+LATAM */}
        <div className="p-4 rounded-xl bg-neutral-100/70 dark:bg-[#141417] border border-neutral-200 dark:border-neutral-800 flex items-start gap-3">
          <Globe className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">
              {t('guide.i18nGistTitle')}
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('guide.i18nGistDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Sintaxe */}
      <div className="bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {t('guide.syntaxTitle')}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {t('guide.syntaxSubtitle')}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 dark:bg-[#111113] border-b border-neutral-200 dark:border-neutral-800">
                <th className="py-2.5 px-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                  {t('guide.colSyntax')}
                </th>
                <th className="py-2.5 px-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                  {t('guide.colComponent')}
                </th>
                <th className="py-2.5 px-3.5 font-semibold text-neutral-800 dark:text-neutral-200">
                  {t('guide.colDescription')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
              {syntaxRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/20">
                  <td className="py-2.5 px-3.5 font-mono text-[11px] text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                    {row.syntax}
                  </td>
                  <td className="py-2.5 px-3.5 font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                    {row.component}
                  </td>
                  <td className="py-2.5 px-3.5 text-neutral-600 dark:text-neutral-400">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template de Exemplo */}
      <div className="bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {t('guide.exampleTitle')}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {t('guide.exampleSubtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyExample}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-black dark:bg-neutral-200 dark:hover:bg-white text-white dark:text-neutral-950 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedExample ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                <span>{t('guide.btnCopiedExample')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t('guide.btnCopyExample')}</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-800 dark:text-neutral-200 overflow-x-auto leading-relaxed">
          {EXAMPLE_GIST_MARKDOWN}
        </pre>
      </div>
    </div>
  );
}
