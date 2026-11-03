import { SupportedLanguage, TranslationSchema } from '../types';
import { ptBR } from './pt-BR';
import { enUS } from './en-US';
import { es419 } from './es-419';
import { esES } from './es-ES';
import { frFR } from './fr-FR';
import { itIT } from './it-IT';
import { deDE } from './de-DE';

export const translations: Record<SupportedLanguage, TranslationSchema> = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-419': es419,
  'es-ES': esES,
  'fr-FR': frFR,
  'it-IT': itIT,
  'de-DE': deDE,
};

export { ptBR, enUS, es419, esES, frFR, itIT, deDE };
