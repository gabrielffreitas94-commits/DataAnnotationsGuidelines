export interface GuidelineSection {
  id: string;
  index: number;
  title: string;
  shortTitle: string;
  body: string;
  hasVariables: boolean;
}

export const SUPPORTED_FIELD_TYPES = [
  'text',
  'textarea',
  'list',
  'numbered_list',
  'boolean',
  'select',
  'multiselect',
  'code',
] as const;

export type FieldType = (typeof SUPPORTED_FIELD_TYPES)[number];

export interface ExtractedVariable {
  key: string;
  label: string;
  type?: FieldType;
  rawType?: string;
  options?: string[];
  codeLanguage?: string;
  defaultValues?: string[];
  defaultValue?: any;
  isConditionalBlock?: boolean;
  error?: string;
}

export function parseRawType(rawType: string): {
  type?: FieldType;
  options?: string[];
  codeLanguage?: string;
  defaultValues?: string[];
  defaultValue?: any;
  error?: string;
} {
  const trimmed = rawType.trim();
  const match = trimmed.match(/^([a-zA-Z0-9_-]+)(?::([a-zA-Z0-9_-]+))?(?:\[(.*?)\]|\((.*?)\))?(\*)?$/);
  if (!match) {
    return { error: `Tipo ':${trimmed}' não suportado pelo sistema.` };
  }

  let baseType = match[1].toLowerCase();
  const modifier = match[2]?.toLowerCase();
  const bracketContent = match[3];
  const parenContent = match[4];
  const hasTrailingStar = Boolean(match[5]);

  let isAllDefault = modifier === 'all';

  if (baseType === 'ordered_list' || baseType === 'numberlist' || baseType === 'lista_numerada') {
    baseType = 'numbered_list';
  } else if (baseType === 'multiselect_all') {
    baseType = 'multiselect';
    isAllDefault = true;
  }

  if (!(SUPPORTED_FIELD_TYPES as readonly string[]).includes(baseType)) {
    return { error: `Tipo ':${trimmed}' não suportado pelo sistema.` };
  }

  const type = baseType as FieldType;
  let options: string[] | undefined;
  let codeLanguage: string | undefined;
  let defaultValues: string[] | undefined;
  let defaultValue: any | undefined;

  if (type === 'select' || type === 'multiselect') {
    if (bracketContent === undefined) {
      return {
        error: `Tipo ':${type}' requer lista de opções no formato ${type}[Opção 1, Opção 2].`,
      };
    }
    const rawOptions = bracketContent
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (rawOptions.length === 0) {
      return {
        error: `Tipo ':${type}' requer ao menos uma opção válida em [opções].`,
      };
    }

    const cleanOptions: string[] = [];
    const defaults: string[] = [];
    for (const opt of rawOptions) {
      const isDefault = opt.endsWith('*') || isAllDefault;
      const clean = opt.replace(/\*+$/, '').trim();
      cleanOptions.push(clean);
      if (isDefault) {
        defaults.push(clean);
      }
    }

    options = cleanOptions;
    if (type === 'multiselect') {
      if (defaults.length > 0) {
        defaultValues = defaults;
      }
    } else if (type === 'select') {
      if (defaults.length > 0) {
        defaultValue = defaults[0];
      }
    }
  } else if (type === 'code') {
    if (parenContent && parenContent.trim()) {
      codeLanguage = parenContent.trim();
    }
  } else if (type === 'boolean') {
    if (hasTrailingStar || parenContent?.trim().toLowerCase() === 'true' || modifier === 'true') {
      defaultValue = true;
    }
  }

  return { type, options, codeLanguage, defaultValues, defaultValue };
}

export function extractVariables(promptText: string): ExtractedVariable[] {
  if (!promptText) return [];

  const matches = promptText.matchAll(
    /\{\{(?:#(?:(?:if\s+(?:(!|not\s+))?)|unless\s+)?([a-zA-Z0-9_-]+)|([a-zA-Z0-9_-]+)(?::([^}]+))?)\}\}/g
  );
  const varsMap = new Map<string, ExtractedVariable>();

  for (const match of matches) {
    const isConditional = Boolean(match[2] && match[0].startsWith('{{#'));
    const key = match[2] || match[3];
    if (!key) continue;

    if (isConditional) {
      if (!varsMap.has(key)) {
        varsMap.set(key, {
          key,
          label: humanizeLabel(key),
          type: 'boolean',
          rawType: 'boolean',
          isConditionalBlock: true,
        });
      }
      continue;
    }

    const rawType = match[4];

    let type: FieldType | undefined;
    let options: string[] | undefined;
    let codeLanguage: string | undefined;
    let defaultValues: string[] | undefined;
    let defaultValue: any | undefined;
    let error: string | undefined;

    if (!rawType) {
      error = `Tipo obrigatório ausente. A variável deve ser declarada como {{${key}:tipo}}.`;
    } else {
      const parsed = parseRawType(rawType);
      if (parsed.error) {
        error = parsed.error;
      } else {
        type = parsed.type;
        options = parsed.options;
        codeLanguage = parsed.codeLanguage;
        defaultValues = parsed.defaultValues;
        defaultValue = parsed.defaultValue;
      }
    }

    if (!varsMap.has(key)) {
      varsMap.set(key, {
        key,
        label: humanizeLabel(key),
        type,
        rawType,
        options,
        codeLanguage,
        defaultValues,
        defaultValue,
        error,
      });
    } else {
      const existing = varsMap.get(key)!;
      if (type) {
        existing.type = type;
        existing.rawType = rawType;
        existing.options = options;
        existing.codeLanguage = codeLanguage;
        existing.defaultValues = defaultValues;
        existing.defaultValue = defaultValue;
        existing.isConditionalBlock = false;
        existing.error = undefined;
      } else if (!existing.type && error) {
        existing.rawType = rawType;
        existing.error = error;
      }
    }
  }

  return Array.from(varsMap.values());
}

export function humanizeLabel(key: string): string {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
