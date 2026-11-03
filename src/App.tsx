import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  gistService,
  OFFICIAL_GIST_ID,
  extractGistId,
} from './services/gistService';
import {
  interpolatePrompt,
  resolveCodeLanguage,
  splitBuilderSection,
} from './services/promptEngine';
import { GuidelineSection, extractVariables } from './types/template';
import {
  Copy,
  Check,
  ExternalLink,
  Loader2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  RefreshCw,
  Plus,
  X,
  List,
  Type,
  AlignLeft,
  ToggleRight,
  CheckCircle2,
  SlidersHorizontal,
  Code2,
  ClipboardPaste,
  BookOpen,
  ListOrdered,
  Sun,
  Moon,
  CheckSquare,
} from 'lucide-react';
import { GistGuidePage } from './components/GistGuidePage';
import { GuidelineRenderer } from './components/GuidelineRenderer';
import { useI18n } from './i18n/I18nContext';
import { LanguageSelector } from './components/LanguageSelector';
import { TaskTimer } from './components/TaskTimer';

const STORAGE_KEY_GIST = 'da_guidelines_active_gist_id';
const STORAGE_KEY_VALUES = 'da_guidelines_form_values_';
const STORAGE_KEY_CHECKS = 'da_guidelines_checks_';
const STORAGE_KEY_OMIT_EMPTY = 'da_guidelines_omit_empty';
const STORAGE_KEY_THEME = 'da_guidelines_theme';

interface TextFieldInputProps {
  label: string;
  variableKey: string;
  value: string;
  onChange: (value: string) => void;
}

function TextFieldInput({ label, variableKey, value, onChange }: TextFieldInputProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-300 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span>{label}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            {t('fields.text')}
          </span>
        </label>
        <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 font-normal">
          {`{{${variableKey}:text}}`}
        </span>
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={t('fields.textPlaceholder', { label: label.toLowerCase() })}
        className="w-full text-xs font-sans bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-500 transition-all"
      />
    </div>
  );
}

interface TextareaFieldInputProps {
  label: string;
  variableKey: string;
  value: string;
  onChange: (value: string) => void;
}

function TextareaFieldInput({ label, variableKey, value, onChange }: TextareaFieldInputProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-300 flex items-center gap-1.5">
          <AlignLeft className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span>{label}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            {t('fields.textarea')}
          </span>
        </label>
        <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 font-normal">
          {`{{${variableKey}:textarea}}`}
        </span>
      </div>
      <textarea
        rows={3}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={t('fields.textareaPlaceholder', { label: label.toLowerCase() })}
        className="w-full text-xs font-sans bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-500 transition-all resize-y"
      />
    </div>
  );
}

interface ListFieldInputProps {
  label: string;
  variableKey: string;
  items: string[];
  onChange: (items: string[]) => void;
  numbered?: boolean;
}

function ListFieldInput({ label, variableKey, items, onChange, numbered = false }: ListFieldInputProps) {
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    const newItems = trimmed
      .split('\n')
      .map(s => s.trim().replace(/^(?:\d+[.)]|[-*•])\s*/, ''))
      .filter(Boolean);

    onChange([...items, ...newItems]);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) return;
      const newItems = text
        .split('\n')
        .map(s => s.trim().replace(/^(?:\d+[.)]|[-*•])\s*/, ''))
        .filter(Boolean);
      if (newItems.length > 0) {
        onChange([...items, ...newItems]);
      }
    } catch {
      // ignore
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    onChange(items.filter((_, idx) => idx !== indexToRemove));
  };

  const Icon = numbered ? ListOrdered : List;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-300 flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span>{label}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            {numbered ? t('fields.numberedList') : t('fields.list')}
          </span>
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePasteClipboard}
            className="text-[10px] font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer"
          >
            <ClipboardPaste className="w-3 h-3" />
            <span>{t('fields.btnPasteList')}</span>
          </button>
          <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 font-normal">
            {numbered ? `{{${variableKey}:numbered_list}}` : `{{${variableKey}:list}}`}
          </span>
        </div>
      </div>

      {items.length > 0 && (
        <div className="space-y-1.5 bg-neutral-50/80 dark:bg-[#111113]/80 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 max-h-48 overflow-y-auto">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 text-xs bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 px-2.5 py-1.5 rounded-lg shadow-2xs group"
            >
              <div className="flex items-center gap-2 min-w-0">
                {numbered ? (
                  <span className="w-4 h-4 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 shrink-0" />
                )}
                <span className="truncate text-neutral-800 dark:text-neutral-300">{item}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-0.5 shrink-0 cursor-pointer"
                title={t('fields.btnRemoveItem')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('fields.listPlaceholder')}
          className="w-full text-xs font-sans bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-500 transition-all"
        />
        <button
          type="button"
          onClick={handleAddItem}
          className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-black dark:bg-neutral-200 dark:hover:bg-white text-white dark:text-neutral-950 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('fields.btnAdd')}</span>
        </button>
      </div>
    </div>
  );
}

interface BooleanFieldInputProps {
  label: string;
  variableKey: string;
  checked: boolean;
  isConditionalBlock?: boolean;
  onChange: (checked: boolean) => void;
}

function BooleanFieldInput({
  label,
  variableKey,
  checked,
  isConditionalBlock,
  onChange,
}: BooleanFieldInputProps) {
  const { t } = useI18n();
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
        checked
          ? 'bg-neutral-900/5 dark:bg-neutral-200/5 border-neutral-400 dark:border-neutral-700'
          : 'bg-neutral-50 dark:bg-[#111113] border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
      }`}
    >
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          <ToggleRight className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span>{label}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            {isConditionalBlock ? t('fields.conditionalBlock') : t('fields.boolean')}
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
          {t('fields.conditionalHint')}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
          {checked ? t('fields.boolActive') : t('fields.boolInactive')}
        </span>
        <div
          className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
            checked ? 'bg-neutral-900 dark:bg-neutral-200' : 'bg-neutral-300 dark:bg-neutral-700'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white dark:bg-neutral-950 transition-transform ${
              checked ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    </div>
  );
}

interface SelectFieldInputProps {
  label: string;
  variableKey: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

function SelectFieldInput({ label, variableKey, options, value, onChange }: SelectFieldInputProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-300 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span>{label}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            {t('fields.select')}
          </span>
        </label>
        <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 font-normal">
          {`{{${variableKey}:select[...]}}`}
        </span>
      </div>

      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-xs font-sans bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-neutral-900 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-500 transition-all cursor-pointer"
      >
        <option value="">{t('fields.selectPlaceholder')}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

interface MultiselectFieldInputProps {
  label: string;
  variableKey: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function MultiselectFieldInput({
  label,
  variableKey,
  options,
  selected,
  onChange,
}: MultiselectFieldInputProps) {
  const { t } = useI18n();
  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(i => i !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-300 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span>{label}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            {t('fields.multiselect')}
          </span>
        </label>
        <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 font-normal">
          {`{{${variableKey}:multiselect[...]}}`}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 p-2.5 bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 rounded-xl">
        {options.map(opt => {
          const isActive = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleOption(opt)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-200 dark:border-neutral-200 dark:text-neutral-950 font-medium'
                  : 'bg-white dark:bg-[#161618] border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface CodeFieldInputProps {
  label: string;
  variableKey: string;
  codeLanguage?: string;
  value: string;
  onChange: (value: string) => void;
}

function CodeFieldInput({
  label,
  variableKey,
  codeLanguage,
  value,
  onChange,
}: CodeFieldInputProps) {
  const { t } = useI18n();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onChange(text);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-300 flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span>{label}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            {codeLanguage ? `${t('fields.code')} (${codeLanguage})` : t('fields.code')}
          </span>
        </label>
        <button
          type="button"
          onClick={handlePaste}
          className="text-[10px] font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer"
        >
          <ClipboardPaste className="w-3 h-3" />
          <span>{t('fields.btnPasteCode')}</span>
        </button>
      </div>
      <textarea
        rows={5}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={t('fields.codePlaceholder')}
        className="w-full text-xs font-mono bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-500 transition-all resize-y"
      />
      <div className="text-right font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
        {`{{${variableKey}:code}}`}
      </div>
    </div>
  );
}

export function App() {
  const { language, t } = useI18n();

  // Tema Dark / Light
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
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

  // Gist ativo
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

  // Seções (# Título -> Abas na barra superior)
  const [sections, setSections] = useState<GuidelineSection[]>(() =>
    gistService.getEmbeddedSections(language)
  );
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [showGuideTab, setShowGuideTab] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [reloaded, setReloaded] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timerResetSignal, setTimerResetSignal] = useState<number>(0);
  const [resetNotice, setResetNotice] = useState<boolean>(false);

  // Estado dos checklists por Gist
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_CHECKS}${activeGistId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_CHECKS}${activeGistId}`, JSON.stringify(checkedMap));
    } catch {
      // ignore
    }
  }, [checkedMap, activeGistId]);

  // Estado dos valores de formulário dinâmico (para abas Builder com {{...}})
  const [formValuesByTab, setFormValuesByTab] = useState<Record<string, Record<string, any>>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_VALUES}${activeGistId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_VALUES}${activeGistId}`, JSON.stringify(formValuesByTab));
    } catch {
      // ignore
    }
  }, [formValuesByTab, activeGistId]);

  const [omitEmpty, setOmitEmpty] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OMIT_EMPTY);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OMIT_EMPTY, String(omitEmpty));
    } catch {
      // ignore
    }
  }, [omitEmpty]);

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
          setTimeout(() => setReloaded(false), 2000);
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Erro ao carregar o GitHub Gist.');
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  // Atualiza automaticamente as abas quando o idioma (EFIGS + LATAM) muda
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

  // Separa referências de template quando a aba ativa tem variáveis {{...}}
  const builderParts = useMemo(() => {
    if (!activeSection || !activeSection.hasVariables) {
      return { referenceMarkdown: '', templateMarkdown: '' };
    }
    return splitBuilderSection(activeSection.body);
  }, [activeSection]);

  const variables = useMemo(() => {
    if (!activeSection || !activeSection.hasVariables) return [];
    return extractVariables(builderParts.templateMarkdown);
  }, [activeSection, builderParts.templateMarkdown]);

  const tabStorageKey = `tab_${activeSection?.index ?? 0}`;

  const effectiveFieldValues = useMemo(() => {
    const savedForTab = formValuesByTab[tabStorageKey] || {};
    const merged: Record<string, any> = { ...savedForTab };
    for (const v of variables) {
      if (merged[v.key] === undefined) {
        if (v.type === 'multiselect' && v.defaultValues) {
          merged[v.key] = v.defaultValues;
        } else if (v.defaultValue !== undefined) {
          merged[v.key] = v.defaultValue;
        }
      }
    }
    return merged;
  }, [formValuesByTab, tabStorageKey, variables]);

  const handleFieldValueChange = (key: string, val: any) => {
    setFormValuesByTab(prev => ({
      ...prev,
      [tabStorageKey]: {
        ...(prev[tabStorageKey] || {}),
        [key]: val,
      },
    }));
  };

  const handleClearTabFields = () => {
    setFormValuesByTab(prev => ({
      ...prev,
      [tabStorageKey]: {},
    }));
  };

  const handleToggleCheck = (itemKey: string) => {
    setCheckedMap(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const handleResetSectionChecks = () => {
    if (!activeSection) return;
    const prefix = `tab_${activeSection.index}_`;
    setCheckedMap(prev => {
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        if (k.startsWith(prefix)) {
          delete next[k];
        }
      }
      return next;
    });
  };

  const handleResetAllForNewTask = () => {
    setCheckedMap({});
    setFormValuesByTab({});
    setTimerResetSignal(prev => prev + 1);
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 2200);
  };

  const interpolatedOutput = useMemo(() => {
    if (!activeSection || !activeSection.hasVariables) return '';
    return interpolatePrompt(builderParts.templateMarkdown, effectiveFieldValues, { omitEmpty });
  }, [activeSection, builderParts.templateMarkdown, effectiveFieldValues, omitEmpty]);

  const [copiedOutput, setCopiedOutput] = useState(false);

  const handleCopyOutput = () => {
    if (!interpolatedOutput) return;
    navigator.clipboard.writeText(interpolatedOutput);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const charCount = interpolatedOutput.length;
  const wordCount = interpolatedOutput.trim()
    ? interpolatedOutput.trim().split(/\s+/).length
    : 0;

  const currentGistUrl = `https://gist.github.com/${activeGistId}`;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f11] flex flex-col text-neutral-900 dark:text-neutral-300 font-sans transition-colors duration-150">
      {/* Barra Superior Minimalista com Controles e Abas (# Título do Gist) */}
      <header className="border-b border-neutral-200 dark:border-neutral-800/80 bg-white/95 dark:bg-[#141416]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Linha 1: Identidade + Cronômetro RPH + Conexão Gist + Idioma (EFIGS+LATAM) + Tema */}
          <div className="h-14 flex items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800/60">
            {/* Logo e Nome */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                onClick={() => setShowGuideTab(false)}
                className="flex items-center gap-2.5 cursor-pointer select-none group"
                title="DataAnnotation Guidelines"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-neutral-200 text-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  DA
                </div>
                <div className="hidden sm:block leading-tight">
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {t('header.appTitle')}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                    {t('header.appSubtitle')}
                  </div>
                </div>
              </div>

              {/* Botão Zerar Tudo para Nova Task */}
              <button
                type="button"
                onClick={handleResetAllForNewTask}
                className="hidden md:flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-50 dark:bg-[#111113] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title={t('workspace.btnResetTaskAll')}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('workspace.btnResetTaskAll')}</span>
              </button>
            </div>

            {/* Controles Direita: Timer + Gist Loader + Idioma + Tema */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              {/* Cronômetro da Task (RPH) */}
              <TaskTimer resetSignal={timerResetSignal} />

              {/* Formulário de Conexão do Gist */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  fetchSections(gistInput || OFFICIAL_GIST_ID, true);
                }}
                className="hidden sm:flex items-center gap-1.5 w-full max-w-xs"
              >
                <input
                  type="text"
                  value={gistInput}
                  onChange={e => setGistInput(e.target.value)}
                  placeholder={t('header.gistInputPlaceholder')}
                  className="w-full h-8 text-xs font-mono bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-500 transition-all text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`h-8 text-xs font-semibold px-2.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    reloaded
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-neutral-900 hover:bg-black dark:bg-neutral-200 dark:hover:bg-white text-white dark:text-neutral-950'
                  } disabled:opacity-50`}
                  title={t('header.tooltipLoad')}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span className="hidden lg:inline">{t('header.btnReloading')}</span>
                    </>
                  ) : reloaded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden lg:inline">{t('header.btnReloaded')}</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden lg:inline">{t('header.btnLoad')}</span>
                    </>
                  )}
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

              {/* Seletor de Idioma (EFIGS + LATAM) */}
              <LanguageSelector />

              {/* Alternador de Tema (Dark / Light) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="h-8 w-8 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-[#111113] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                title={theme === 'dark' ? t('header.themeLight') : t('header.themeDark')}
                aria-label={t('header.themeAria')}
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-neutral-700" />
                )}
              </button>
            </div>
          </div>

          {/* Linha 2: Barra de Abas Superiores (Cada '# Título' do Gist + Aba Fixa 'Guia do Gist') */}
          <nav
            aria-label="Guideline Tabs"
            className="flex items-center justify-between gap-2 py-2 overflow-x-auto no-scrollbar"
          >
            <div className="flex items-center gap-1">
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-neutral-200 dark:text-neutral-950 font-semibold shadow-2xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    {sec.hasVariables ? (
                      <Sparkles className="w-3.5 h-3.5 shrink-0 opacity-80" />
                    ) : (
                      <CheckSquare className="w-3.5 h-3.5 shrink-0 opacity-75" />
                    )}
                    <span>{sec.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Aba Fixa: Guia do Gist */}
            <button
              type="button"
              onClick={() => setShowGuideTab(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer border ${
                showGuideTab
                  ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-200 dark:border-neutral-200 dark:text-neutral-950 shadow-2xs'
                  : 'bg-neutral-50 dark:bg-[#111113] border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>{t('header.tabGuide')}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Aviso rápido de Task Resetada */}
      {resetNotice && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t('workspace.resetTaskConfirm')}</span>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {showGuideTab ? (
          <GistGuidePage onBackToWorkspace={() => setShowGuideTab(false)} />
        ) : loading && sections.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-neutral-900 dark:text-neutral-300" />
            <p className="text-xs font-medium">{t('workspace.loadingGist')}</p>
          </div>
        ) : errorMsg && sections.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center max-w-md mx-auto text-center gap-3 bg-white dark:bg-[#161618] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-200">
              {t('workspace.errorTitle')}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {errorMsg}
            </p>
            <button
              onClick={() => {
                setGistInput('');
                fetchSections(OFFICIAL_GIST_ID, true);
              }}
              className="mt-2 text-xs font-semibold px-4 py-2 bg-neutral-900 hover:bg-black dark:bg-neutral-200 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl transition-all cursor-pointer"
            >
              {t('workspace.btnLoadDefault')}
            </button>
          </div>
        ) : (
          activeSection && (
            <div className="space-y-5">
              {errorMsg && (
                <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                  <button
                    onClick={() => setErrorMsg(null)}
                    className="text-red-500 hover:text-red-800 dark:hover:text-red-200 font-bold ml-2 text-sm leading-none cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* MODO 1: Guideline & Checklist (Quando a aba não possui variáveis {{...}}) */}
              {!activeSection.hasVariables ? (
                <div className="max-w-5xl mx-auto">
                  <GuidelineRenderer
                    sectionId={`tab_${activeSection.index}`}
                    markdown={activeSection.body}
                    checkedMap={checkedMap}
                    onToggleCheck={handleToggleCheck}
                    onResetSectionChecks={handleResetSectionChecks}
                  />
                </div>
              ) : (
                /* MODO 2: Split-Screen Interativo (Quando a aba possui variáveis {{...}}) */
                <div className="space-y-5">
                  {builderParts.referenceMarkdown && (
                    <GuidelineRenderer
                      sectionId={`tab_${activeSection.index}`}
                      markdown={builderParts.referenceMarkdown}
                      checkedMap={checkedMap}
                      onToggleCheck={handleToggleCheck}
                      onResetSectionChecks={handleResetSectionChecks}
                      compact
                    />
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Coluna Esquerda: Campos Dinâmicos do Gist */}
                    <div className="lg:col-span-6 bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs space-y-5">
                      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                              {activeSection.title}
                            </h2>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                              {t('workspace.modeBuilderBadge')}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                            {t('workspace.variablesDetected', { count: variables.length })}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleClearTabFields}
                          className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 px-2.5 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                          title={t('workspace.btnClearFieldsTitle')}
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{t('workspace.btnClearFields')}</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {variables.map(v => {
                          if (v.error) {
                            return (
                              <div
                                key={v.key}
                                className="p-3.5 bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-xs font-semibold text-red-900 dark:text-red-300">
                                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                                    <span>{v.label}</span>
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
                                      {t('workspace.invalidType')}
                                    </span>
                                  </div>
                                  <span className="font-mono text-[10px] text-red-500 dark:text-red-400 font-semibold">
                                    {v.rawType ? `{{${v.key}:${v.rawType}}}` : `{{${v.key}}}`}
                                  </span>
                                </div>
                                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                                  {v.error}
                                </p>
                              </div>
                            );
                          }

                          if (v.type === 'text') {
                            return (
                              <TextFieldInput
                                key={v.key}
                                label={v.label}
                                variableKey={v.key}
                                value={
                                  typeof effectiveFieldValues[v.key] === 'string'
                                    ? effectiveFieldValues[v.key]
                                    : ''
                                }
                                onChange={val => handleFieldValueChange(v.key, val)}
                              />
                            );
                          }

                          if (v.type === 'textarea') {
                            return (
                              <TextareaFieldInput
                                key={v.key}
                                label={v.label}
                                variableKey={v.key}
                                value={
                                  typeof effectiveFieldValues[v.key] === 'string'
                                    ? effectiveFieldValues[v.key]
                                    : ''
                                }
                                onChange={val => handleFieldValueChange(v.key, val)}
                              />
                            );
                          }

                          if (v.type === 'list') {
                            return (
                              <ListFieldInput
                                key={v.key}
                                label={v.label}
                                variableKey={v.key}
                                items={
                                  Array.isArray(effectiveFieldValues[v.key])
                                    ? effectiveFieldValues[v.key]
                                    : []
                                }
                                onChange={newItems => handleFieldValueChange(v.key, newItems)}
                              />
                            );
                          }

                          if (v.type === 'numbered_list') {
                            return (
                              <ListFieldInput
                                key={v.key}
                                label={v.label}
                                variableKey={v.key}
                                numbered
                                items={
                                  Array.isArray(effectiveFieldValues[v.key])
                                    ? effectiveFieldValues[v.key]
                                    : []
                                }
                                onChange={newItems => handleFieldValueChange(v.key, newItems)}
                              />
                            );
                          }

                          if (v.type === 'boolean') {
                            return (
                              <BooleanFieldInput
                                key={v.key}
                                label={v.label}
                                variableKey={v.key}
                                isConditionalBlock={v.isConditionalBlock}
                                checked={Boolean(effectiveFieldValues[v.key])}
                                onChange={checked => handleFieldValueChange(v.key, checked)}
                              />
                            );
                          }

                          if (v.type === 'select') {
                            return (
                              <SelectFieldInput
                                key={v.key}
                                label={v.label}
                                variableKey={v.key}
                                options={v.options || []}
                                value={
                                  typeof effectiveFieldValues[v.key] === 'string'
                                    ? effectiveFieldValues[v.key]
                                    : ''
                                }
                                onChange={val => handleFieldValueChange(v.key, val)}
                              />
                            );
                          }

                          if (v.type === 'multiselect') {
                            return (
                              <MultiselectFieldInput
                                key={v.key}
                                label={v.label}
                                variableKey={v.key}
                                options={v.options || []}
                                selected={
                                  Array.isArray(effectiveFieldValues[v.key])
                                    ? effectiveFieldValues[v.key]
                                    : []
                                }
                                onChange={sel => handleFieldValueChange(v.key, sel)}
                              />
                            );
                          }

                          if (v.type === 'code') {
                            const resolvedLang = resolveCodeLanguage(
                              v.codeLanguage,
                              effectiveFieldValues,
                              builderParts.templateMarkdown
                            );
                            return (
                              <CodeFieldInput
                                key={v.key}
                                label={v.label}
                                variableKey={v.key}
                                codeLanguage={resolvedLang || v.codeLanguage}
                                value={
                                  typeof effectiveFieldValues[v.key] === 'string'
                                    ? effectiveFieldValues[v.key]
                                    : ''
                                }
                                onChange={val => handleFieldValueChange(v.key, val)}
                              />
                            );
                          }

                          return null;
                        })}
                      </div>
                    </div>

                    {/* Coluna Direita: Preview em Tempo Real & Cópia Rápida */}
                    <div className="lg:col-span-6 lg:sticky lg:top-28 bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xs space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
                        <div className="space-y-0.5">
                          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            {t('workspace.previewTitle')}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                            <span>{t('workspace.wordCount', { count: wordCount })}</span>
                            <span>•</span>
                            <span>{t('workspace.charCount', { count: charCount })}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <label
                            className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer select-none px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#111113]"
                            title={t('workspace.omitEmptyTooltip')}
                          >
                            <input
                              type="checkbox"
                              checked={omitEmpty}
                              onChange={e => setOmitEmpty(e.target.checked)}
                              className="rounded border-neutral-300 dark:border-neutral-700 accent-neutral-900 dark:accent-neutral-200"
                            />
                            <span>{t('workspace.omitEmpty')}</span>
                          </label>

                          <button
                            type="button"
                            onClick={handleCopyOutput}
                            disabled={!interpolatedOutput}
                            className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                              copiedOutput
                                ? 'bg-emerald-600 text-white'
                                : 'bg-neutral-900 hover:bg-black dark:bg-neutral-200 dark:hover:bg-white text-white dark:text-neutral-950'
                            } disabled:opacity-40`}
                          >
                            {copiedOutput ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>{t('workspace.btnCopiedResult')}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{t('workspace.btnCopyResult')}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <pre className="w-full min-h-[340px] max-h-[65vh] overflow-y-auto p-4 rounded-xl bg-neutral-50 dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed select-all">
                        {interpolatedOutput || '...'}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
}
export default App;
