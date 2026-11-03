import { FieldType, parseRawType, extractVariables } from '../types/template';

export interface InterpolateOptions {
  omitEmpty?: boolean;
}

/**
 * Em abas híbridas (que possuem variáveis {{...}}), separa blocos iniciais
 * de callout (> [!TIP]) ou instruções estáticas da parte que compõe o template dinâmico.
 */
export function splitBuilderSection(body: string): {
  referenceMarkdown: string;
  templateMarkdown: string;
} {
  const lines = body.split('\n');
  let firstTemplateLineIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/\{\{/.test(line)) {
      // Inclui o cabeçalho imediatamente anterior (### ...) se houver
      let startIdx = i;
      while (startIdx > 0 && lines[startIdx - 1].trim() === '') {
        startIdx--;
      }
      if (startIdx > 0 && /^#{2,4}\s+/.test(lines[startIdx - 1].trim())) {
        startIdx--;
      }
      firstTemplateLineIdx = startIdx;
      break;
    }
  }

  if (firstTemplateLineIdx <= 0) {
    return {
      referenceMarkdown: '',
      templateMarkdown: body.trim(),
    };
  }

  return {
    referenceMarkdown: lines.slice(0, firstTemplateLineIdx).join('\n').trim(),
    templateMarkdown: lines.slice(firstTemplateLineIdx).join('\n').trim(),
  };
}

export function cleanupEmptySections(text: string): string {
  let prev = '';
  let current = text;

  while (prev !== current) {
    prev = current;
    current = current.replace(/(?:^|\n)(#{1,6}\s+[^\n]+)\s*(?=(?:\n#{1,6}\s+|$))/g, '');
  }

  // Remove labels sem valor na mesma linha (ex: "Dominio: " ou "- Label: ")
  current = current.replace(/(?:^|\n)[ \t]*(?:[-*•][ \t]*)?(?:\*\*[^*\n]+\*\*:?|[^\n:{]+:)[ \t]*(?=(?:\n|$))/g, '');

  // Remove marcadores solitários
  current = current.replace(/(?:^|\n)\s*(?:\d+[.)]|[-*•])\s*(?=(?:\n|$))/g, '');

  current = current.replace(/\n{3,}/g, '\n\n').trim();

  return current;
}

export function normalizeOrderedLists(text: string): string {
  const lines = text.split('\n');
  let inList = false;
  let currentIndent = -1;
  let currentNum = 1;
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^([ \t]*)(\d+)([.)]\s+.*)$/);
    if (match) {
      const indent = match[1].length;
      if (!inList || indent !== currentIndent) {
        inList = true;
        currentIndent = indent;
        currentNum = 1;
      }
      result.push(match[1] + currentNum + match[3]);
      currentNum++;
    } else {
      inList = false;
      currentIndent = -1;
      currentNum = 1;
      result.push(line);
    }
  }

  return result.join('\n');
}

export function isValueFilled(val: unknown): boolean {
  if (val === undefined || val === null) return false;
  if (typeof val === 'boolean') return val;
  if (Array.isArray(val)) {
    return val.some(item => typeof item === 'string' && item.trim().length > 0);
  }
  if (typeof val === 'string') {
    return val.trim().length > 0;
  }
  if (typeof val === 'number') {
    return true;
  }
  return false;
}

export function resolveCodeLanguage(
  langParam: string | undefined,
  values: Record<string, any>,
  templatePrompt?: string
): string {
  if (!langParam) return '';
  const trimmed = langParam.trim();

  const isVariable =
    trimmed in values ||
    (templatePrompt
      ? new RegExp(`\\{\\{(?:#(?:if\\s+)?${trimmed}|${trimmed}(?::|\\}\\}))`).test(templatePrompt)
      : false);

  if (isVariable) {
    const val = values[trimmed];
    if (isValueFilled(val)) {
      return String(val).trim().toLowerCase();
    }
    return '';
  }

  return trimmed.toLowerCase();
}

export interface FormatOptions {
  codeLanguage?: string;
  allValues?: Record<string, any>;
  templatePrompt?: string;
  hasBulletPrefix?: boolean;
}

export function formatFieldValue(
  val: unknown,
  fieldType?: FieldType,
  options?: FormatOptions
): string {
  if (!isValueFilled(val)) return '';

  if (fieldType === 'boolean' || typeof val === 'boolean') {
    return val ? 'Yes' : '';
  }

  if (fieldType === 'code') {
    const lang = resolveCodeLanguage(
      options?.codeLanguage,
      options?.allValues || {},
      options?.templatePrompt
    );
    return `\`\`\`${lang}\n${String(val).trimEnd()}\n\`\`\``;
  }

  if (fieldType === 'multiselect') {
    if (Array.isArray(val)) {
      const cleanItems = val.map(i => String(i).trim()).filter(Boolean);
      if (cleanItems.length === 0) return '';
      if (options?.hasBulletPrefix) {
        return cleanItems.map(item => `- ${item}`).join('\n');
      }
      return cleanItems.join(', ');
    }
    return String(val);
  }

  if (fieldType === 'numbered_list') {
    if (Array.isArray(val)) {
      const cleanItems = val.map(i => String(i).trim()).filter(Boolean);
      if (cleanItems.length === 0) return '';
      return cleanItems.map((item, idx) => `${idx + 1}. ${item}`).join('\n');
    }
    const cleanLines = String(val)
      .split('\n')
      .map(s => s.trim().replace(/^(?:\d+[.)]|[-*•])\s*/, ''))
      .filter(Boolean);
    if (cleanLines.length === 0) return '';
    return cleanLines.map((item, idx) => `${idx + 1}. ${item}`).join('\n');
  }

  if (fieldType === 'list' || Array.isArray(val)) {
    if (Array.isArray(val)) {
      const cleanItems = val.map(i => String(i).trim()).filter(Boolean);
      if (cleanItems.length === 0) return '';
      return cleanItems.map(item => `- ${item}`).join('\n');
    }
    const cleanLines = String(val)
      .split('\n')
      .map(s => s.trim().replace(/^[-*•]\s*/, ''))
      .filter(Boolean);
    if (cleanLines.length === 0) return '';
    return cleanLines.map(item => `- ${item}`).join('\n');
  }

  return String(val);
}

export function interpolatePrompt(
  templatePrompt: string,
  values: Record<string, any>,
  options: InterpolateOptions = { omitEmpty: true }
): string {
  if (!templatePrompt) return '';

  let result = templatePrompt;

  // 1. Condicionais {{#if var}}...{{/if}}
  result = result.replace(
    /((?:^|\r?\n)[ \t]*(?:(?:\d+[.)]|[-*+•])[ \t]*)?)?\{\{#if\s+(?:(!|not\s+))?([a-zA-Z0-9_-]+)\}\}([\s\S]*?)\{\{\/if\}\}/gi,
    (_, prefix = '', notOp, key, content) => {
      const isNegated = Boolean(notOp);
      const val = values[key];
      const filled = isValueFilled(val);
      const conditionPassed = isNegated ? !filled : filled;
      if (conditionPassed) {
        return prefix + content;
      }
      return '';
    }
  );

  // 2. Condicionais {{#unless var}}...{{/unless}}
  result = result.replace(
    /((?:^|\r?\n)[ \t]*(?:(?:\d+[.)]|[-*+•])[ \t]*)?)?\{\{#unless\s+([a-zA-Z0-9_-]+)\}\}([\s\S]*?)\{\{\/unless\}\}/gi,
    (_, prefix = '', key, content) => {
      const val = values[key];
      if (!isValueFilled(val)) {
        return prefix + content;
      }
      return '';
    }
  );

  // 3. Condicionais {{#var}}...{{/var}}
  result = result.replace(
    /((?:^|\r?\n)[ \t]*(?:(?:\d+[.)]|[-*+•])[ \t]*)?)?\{\{#([a-zA-Z0-9_-]+)\}\}([\s\S]*?)\{\{\/\2\}\}/gi,
    (_, prefix = '', key, content) => {
      const val = values[key];
      if (isValueFilled(val)) {
        return prefix + content;
      }
      return '';
    }
  );

  const declaredVars = extractVariables(templatePrompt);
  const varMap = new Map(declaredVars.filter(v => v.type).map(v => [v.key, v]));

  result = result.replace(
    /(^[ \t]*[-*•][ \t]*)?\{\{([a-zA-Z0-9_-]+)(?::([^}]+))?\}\}/gm,
    (_, bulletPrefix, key, rawType) => {
      let type: FieldType | undefined;
      let codeLanguage: string | undefined;

      if (rawType) {
        const parsed = parseRawType(rawType);
        if (parsed.error) {
          return `[ERRO: ${parsed.error}]`;
        }
        type = parsed.type;
        codeLanguage = parsed.codeLanguage;
      } else {
        const existing = varMap.get(key);
        if (existing?.type) {
          type = existing.type;
          codeLanguage = existing.codeLanguage;
        } else {
          return `[ERRO: Campo {{${key}}} requer tipo explícito (formato: {{${key}:tipo}})]`;
        }
      }

      const val = values[key];
      const hasBullet = Boolean(bulletPrefix);
      const formatted = formatFieldValue(val, type, {
        codeLanguage,
        allValues: values,
        templatePrompt,
        hasBulletPrefix: hasBullet,
      });

      if (!formatted) {
        return '';
      }

      if (type === 'list' || type === 'numbered_list' || (type === 'multiselect' && hasBullet)) {
        return formatted;
      }

      if (type === 'code') {
        if (bulletPrefix) {
          return `${bulletPrefix.trimEnd()}\n${formatted}`;
        }
        return formatted;
      }

      return (bulletPrefix || '') + formatted;
    }
  );

  if (options.omitEmpty) {
    result = cleanupEmptySections(result);
  } else {
    result = result.replace(/\n{3,}/g, '\n\n').trim();
  }

  result = normalizeOrderedLists(result);

  return result;
}
