import { SupportedLanguage } from '../../i18n/types';
import { guidelinePtBR } from './pt-BR';
import { guidelineEnUS } from './en-US';
import { guidelineEs419 } from './es-419';
import { guidelineEsES } from './es-ES';
import { guidelineFrFR } from './fr-FR';
import { guidelineItIT } from './it-IT';
import { guidelineDeDE } from './de-DE';

export const DEFAULT_GUIDELINES_BY_LANG: Record<SupportedLanguage, string> = {
  'pt-BR': guidelinePtBR,
  'en-US': guidelineEnUS,
  'es-419': guidelineEs419,
  'es-ES': guidelineEsES,
  'fr-FR': guidelineFrFR,
  'it-IT': guidelineItIT,
  'de-DE': guidelineDeDE,
};
