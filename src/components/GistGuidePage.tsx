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

const EXAMPLE_GIST_MARKDOWN = `# 1. Audio & Voice SxS

> [!EXCEPTIONAL]
> Complete, evidence-based, and internally consistent ratings. The annotator listens fully, separates quality, adherence, and preference, applies every displayed axis correctly, and selects one to three genuinely decisive factors.
> Rule: Ouça 100% dos dois áudios | Separe Quality ≠ Adherence ≠ Preference | Mantenha consistência entre eixos | Escolha 1 a 3 fatores decisivos

## 1. Audio Quality & Artifacts
Desc: Fidelidade acústica pura e integridade do sinal (não misture com entonação ou estilo).
+ studio-grade clarity | nitidez com padrão de estúdio
+ crisp and clean | áudio limpo e bem definido
+ artifact-free signal | sinal livre de ruídos digitais
- metallic artifacts | ruído metálico / sintético
- muffled / muddy audio | som abafado ou sem brilho
- abrupt cut-off | corte seco antes da última palavra
* "Model A delivers crisp, artifact-free audio, whereas Model B suffers from noticeable metallic artifacts."

## 2. Naturalness, Prosody & Pacing
Desc: Quão humano o locutor soa: ritmo, pausas, respiração, entonação e pronúncia.
+ human-like cadence | cadência natural humana
+ expressive inflection | inflexão expressiva nas palavras-chave
- robotic monotone | entonação reta e mecânica
- awkward pause placement | pausa estranha no meio da frase
* "Model A exhibits a natural cadence and expressive inflection, while Model B sounds robotic and monotone."`;

export function GistGuidePage({ onBackToWorkspace }: GistGuidePageProps) {
  const { t } = useI18n();
  const [copiedExample, setCopiedExample] = useState(false);

  const handleCopyExample = () => {
    navigator.clipboard.writeText(EXAMPLE_GIST_MARKDOWN);
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 2000);
  };

  const syntaxRows = [
    { syntax: '# 1. Audio & Voice SxS', component: 'Top Tab (1 Tela)', desc: t('guide.syntaxTabDesc') },
    { syntax: '> [!EXCEPTIONAL]', component: '5-Star Banner', desc: 'Define o texto em inglês do padrão 5 — Exceptional no topo da tela.' },
    { syntax: '> Rule: Regra 1 | Regra 2', component: 'Golden Rules Pills', desc: 'Pílulas de regras de ouro traduzidas exibidas à direita do banner 5 estrelas.' },
    { syntax: '## 1. Nome do Eixo', component: 'Axis Column (1/4)', desc: 'Cria uma das 4 colunas verticais de parâmetro de avaliação na tela.' },
    { syntax: 'Desc: Explicação curta...', component: 'Axis Description', desc: 'Resumo no idioma escolhido explicando o que avaliar nesse eixo.' },
    { syntax: '+ english word | tradução', component: '+ Positive Word Pill', desc: 'Pílula verde com o termo em inglês (clique copia; hover mostra tradução).' },
    { syntax: '- english flaw | tradução', component: '- Issue/Flaw Word Pill', desc: 'Pílula vermelha com a falha em inglês (clique copia; hover mostra tradução).' },
    { syntax: '* "Model A wins..."', component: 'Decisive Phrase (EN)', desc: 'Frase pronta em inglês para iniciar ou fechar o seu Rationale.' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-8">
      <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs space-y-4">
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

        <div className="space-y-1">
          <h1 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            {t('guide.title')}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {t('guide.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              <Terminal className="w-3.5 h-3.5 text-neutral-500" />
              <span>{t('guide.step1Title')}</span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('guide.step1Desc')}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              <Layers className="w-3.5 h-3.5 text-neutral-500" />
              <span>{t('guide.step2Title')}</span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('guide.step2Desc')}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#111113] border border-neutral-200/80 dark:border-neutral-800/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
              <span>{t('guide.step3Title')}</span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('guide.step3Desc')}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-100/70 dark:bg-[#18181b] border border-neutral-200 dark:border-neutral-800 flex items-start gap-2.5">
          <Globe className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">
              {t('guide.i18nGistTitle')}
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('guide.i18nGistDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Sintaxe */}
      <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
          {t('guide.syntaxTitle')}
        </h2>
        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 dark:bg-[#111113] border-b border-neutral-200 dark:border-neutral-800">
                <th className="py-2 px-3 font-semibold">{t('guide.colSyntax')}</th>
                <th className="py-2 px-3 font-semibold">{t('guide.colComponent')}</th>
                <th className="py-2 px-3 font-semibold">{t('guide.colDescription')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
              {syntaxRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-3 font-mono text-[11px] text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                    {row.syntax}
                  </td>
                  <td className="py-2 px-3 font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                    {row.component}
                  </td>
                  <td className="py-2 px-3 text-neutral-600 dark:text-neutral-400">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exemplo */}
      <div className="bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            {t('guide.exampleTitle')}
          </h2>
          <button
            type="button"
            onClick={handleCopyExample}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-200 dark:text-neutral-950 flex items-center gap-1.5 cursor-pointer"
          >
            {copiedExample ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedExample ? t('guide.btnCopiedExample') : t('guide.btnCopyExample')}</span>
          </button>
        </div>
        <pre className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-800 dark:text-neutral-200 overflow-x-auto leading-relaxed">
          {EXAMPLE_GIST_MARKDOWN}
        </pre>
      </div>
    </div>
  );
}
