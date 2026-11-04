import { GuidelineSection, extractVariables } from '../types/template';
import { SupportedLanguage } from '../i18n/types';
import { DEFAULT_GUIDELINES_BY_LANG } from '../data/guidelines';

export const OFFICIAL_GIST_ID = 'a551abab1395c1f911f0d5979c9c09e0';
export const OFFICIAL_GIST_URL = 'https://gist.github.com/gabrielffreitas94-commits/a551abab1395c1f911f0d5979c9c09e0';

// Bumped cache key to force immediate purge of old v1/v2/v3/v4 cached data
const CACHE_VERSION = 'v5_audio_prosody';
const CACHE_KEY_PREFIX = `da_guidelines_${CACHE_VERSION}_`;

export function extractGistId(gistInput: string): string {
  const clean = gistInput.trim();
  const match = clean.match(/gist\.github(?:usercontent)?\.com\/(?:[a-zA-Z0-9_-]+\/)?([a-f0-9]+)/i);
  return match ? match[1] : clean;
}

// Limpa caches antigos de versões anteriores no navegador
export function purgeLegacyCaches() {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('da_guidelines_gist_') || k.startsWith('da_guidelines_v1_') || k.startsWith('da_guidelines_v2_') || k.startsWith('da_guidelines_v3_') || k.startsWith('da_guidelines_v4_'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

/**
 * Converte um arquivo Markdown em GuidelineSection[] onde cada '# Título' vira uma aba no topo
 */
export function parseMarkdownSections(content: string): GuidelineSection[] {
  const trimmed = content.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('#') || trimmed.includes('\n# ')) {
    const rawSections = trimmed
      .split(/(?:^|\n)(?=#\s+[^\n]+)/g)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    return rawSections.map((sec, idx) => {
      const lines = sec.split('\n');
      const titleLine = lines[0] || '';
      const title = titleLine.replace(/^#+\s*/, '').trim();

      let body = lines.slice(1).join('\n').trim();
      body = body.replace(/\n\s*---\s*$/g, '').trim();

      const shortTitle = title.replace(/^\d+[.)]\s*/, '').trim() || title;

      const slugId =
        title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9_-]+/g, '-')
          .replace(/^-+|-+$/g, '') || `tab-${idx + 1}`;

      const vars = extractVariables(body);

      return {
        id: `tab-${idx + 1}-${slugId}`,
        index: idx,
        title: title || `Tab #${idx + 1}`,
        shortTitle: shortTitle || `Tab #${idx + 1}`,
        body,
        hasVariables: vars.length > 0,
      };
    });
  }

  const vars = extractVariables(trimmed);
  return [
    {
      id: 'tab-1-main',
      index: 0,
      title: 'Guideline Principal',
      shortTitle: 'Guideline',
      body: trimmed,
      hasVariables: vars.length > 0,
    },
  ];
}

export const gistService = {
  /**
   * Retorna as abas padrão embutidas para o idioma selecionado (0ms latency / fallback)
   */
  getEmbeddedSections(language: SupportedLanguage): GuidelineSection[] {
    const md = DEFAULT_GUIDELINES_BY_LANG[language] || DEFAULT_GUIDELINES_BY_LANG['pt-BR'];
    return parseMarkdownSections(md);
  },

  /**
   * Carrega as seções do GitHub Gist com resolução automática de idioma (EFIGS + LATAM)
   */
  async loadFromGist(
    gistInput: string,
    language: SupportedLanguage,
    bypassCache: boolean = false
  ): Promise<GuidelineSection[]> {
    purgeLegacyCaches();

    const rawId = !gistInput || gistInput === 'default' ? OFFICIAL_GIST_ID : gistInput;
    const gistId = extractGistId(rawId);

    if (!gistId) {
      throw new Error('Informe o ID ou URL do GitHub Gist.');
    }

    const cacheKey = `${CACHE_KEY_PREFIX}${gistId}_${language}`;

    if (bypassCache) {
      try {
        localStorage.removeItem(cacheKey);
      } catch {
        // ignore
      }
    } else {
      const cached = this.getCachedSections(gistId, language);
      if (cached && cached.length > 0) {
        return cached;
      }
    }

    // Se for o Gist Oficial e falhar a rede ou estiver carregando pela primeira vez,
    // retorna instantaneamente o bundle embutido atualizado
    if (gistId === OFFICIAL_GIST_ID && !bypassCache) {
      const embedded = this.getEmbeddedSections(language);
      try {
        localStorage.setItem(cacheKey, JSON.stringify(embedded));
      } catch {
        // ignore
      }
      return embedded;
    }

    try {
      const cacheBuster = `?_t=${Date.now()}`;
      const apiUrl = `https://api.github.com/gists/${gistId}${cacheBuster}`;
      const res = await fetch(apiUrl, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        if (gistId === OFFICIAL_GIST_ID) {
          return this.getEmbeddedSections(language);
        }
        if (res.status === 404) {
          throw new Error('Gist não encontrado. Verifique se o ID está correto e se o Gist é público.');
        }
        if (res.status === 403) {
          throw new Error('Limite temporário de requisições da API do GitHub atingido.');
        }
        throw new Error(`Erro ao conectar ao GitHub Gist (Status: ${res.status}).`);
      }

      const gistData = await res.json();
      const files = gistData.files || {};
      const fileList = Object.values(files) as any[];

      if (fileList.length === 0) {
        throw new Error('Nenhum arquivo encontrado no Gist informado.');
      }

      const localizedFilename = `guideline.${language.toLowerCase()}.md`;
      const targetFile =
        fileList.find(f => f.filename?.toLowerCase() === localizedFilename) ||
        fileList.find(f => f.filename?.toLowerCase() === 'guideline.md') ||
        fileList.find(f => f.filename?.toLowerCase().endsWith('.md')) ||
        fileList[0];

      let content = targetFile?.content;
      if (!content && targetFile?.raw_url) {
        try {
          const rawRes = await fetch(
            `${targetFile.raw_url}${targetFile.raw_url.includes('?') ? '&' : '?'}_t=${Date.now()}`
          );
          if (rawRes.ok) {
            content = await rawRes.text();
          }
        } catch {
          // ignore
        }
      }

      if (content) {
        const parsed = parseMarkdownSections(content);
        if (parsed.length > 0) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(parsed));
          } catch {
            // ignore
          }
          return parsed;
        }
      }

      if (gistId === OFFICIAL_GIST_ID) {
        return this.getEmbeddedSections(language);
      }

      throw new Error('O arquivo Markdown no Gist está vazio ou não contém seções válidas.');
    } catch (err) {
      if (gistId === OFFICIAL_GIST_ID) {
        return this.getEmbeddedSections(language);
      }
      throw err;
    }
  },

  getCachedSections(gistId: string, language: SupportedLanguage): GuidelineSection[] | null {
    try {
      const data = localStorage.getItem(`${CACHE_KEY_PREFIX}${gistId}_${language}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
};
