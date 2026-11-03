export type SupportedLanguage =
  | 'pt-BR'
  | 'es-419'
  | 'en-US'
  | 'es-ES'
  | 'fr-FR'
  | 'it-IT'
  | 'de-DE';

export interface LanguageMeta {
  code: SupportedLanguage;
  shortCode: string;
  name: string;
  regionLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'pt-BR', shortCode: 'PT-BR', name: 'Português (Brasil)', regionLabel: 'LATAM', flag: '🇧🇷' },
  { code: 'es-419', shortCode: 'ES-LA', name: 'Español (LATAM)', regionLabel: 'LATAM', flag: '🇲🇽' },
  { code: 'en-US', shortCode: 'EN', name: 'English', regionLabel: 'EFIGS', flag: '🇺🇸' },
  { code: 'fr-FR', shortCode: 'FR', name: 'Français', regionLabel: 'EFIGS', flag: '🇫🇷' },
  { code: 'it-IT', shortCode: 'IT', name: 'Italiano', regionLabel: 'EFIGS', flag: '🇮🇹' },
  { code: 'de-DE', shortCode: 'DE', name: 'Deutsch', regionLabel: 'EFIGS', flag: '🇩🇪' },
  { code: 'es-ES', shortCode: 'ES', name: 'Español (España)', regionLabel: 'EFIGS', flag: '🇪🇸' },
];

export interface TranslationSchema {
  header: {
    appTitle: string;
    appSubtitle: string;
    tabGuide: string;
    gistInputPlaceholder: string;
    btnLoad: string;
    btnReloading: string;
    btnReloaded: string;
    tooltipLoad: string;
    tooltipEditGist: string;
    themeDark: string;
    themeLight: string;
    themeAria: string;
    languageAria: string;
    timerStart: string;
    timerPause: string;
    timerReset: string;
    timerTooltip: string;
  };
  workspace: {
    loadingGist: string;
    errorTitle: string;
    btnLoadDefault: string;
    checklistProgress: string;
    checklistCompleted: string;
    btnResetChecklist: string;
    btnResetTaskAll: string;
    resetTaskConfirm: string;
    copySnippet: string;
    copiedSnippet: string;
    modeGuidelineBadge: string;
    modeBuilderBadge: string;
    variablesDetected: string;
    btnClearFields: string;
    btnClearFieldsTitle: string;
    invalidType: string;
    fixTypesInGist: string;
    formatRequiredInGist: string;
    previewTitle: string;
    omitEmpty: string;
    omitEmptyTooltip: string;
    btnCopyResult: string;
    btnCopiedResult: string;
    charCount: string;
    wordCount: string;
    guidelineNotesTitle: string;
    searchPlaceholder: string;
  };
  fields: {
    text: string;
    textPlaceholder: string;
    textarea: string;
    textareaPlaceholder: string;
    list: string;
    numberedList: string;
    listPlaceholder: string;
    btnAdd: string;
    btnPasteList: string;
    btnRemoveItem: string;
    boolean: string;
    boolActive: string;
    boolInactive: string;
    select: string;
    selectPlaceholder: string;
    multiselect: string;
    code: string;
    codePlaceholder: string;
    btnPasteCode: string;
    conditionalBlock: string;
    conditionalHint: string;
  };
  guide: {
    badge: string;
    title: string;
    subtitle: string;
    btnBackToApp: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    i18nGistTitle: string;
    i18nGistDesc: string;
    syntaxTitle: string;
    syntaxSubtitle: string;
    colSyntax: string;
    colComponent: string;
    colDescription: string;
    syntaxTabDesc: string;
    syntaxCardDesc: string;
    syntaxCheckDesc: string;
    syntaxAlertDesc: string;
    syntaxTableDesc: string;
    syntaxVarTextDesc: string;
    syntaxVarTextareaDesc: string;
    syntaxVarListDesc: string;
    syntaxVarNumListDesc: string;
    syntaxVarSelectDesc: string;
    syntaxVarMultiDesc: string;
    syntaxVarCodeDesc: string;
    syntaxVarIfDesc: string;
    exampleTitle: string;
    exampleSubtitle: string;
    btnCopyExample: string;
    btnCopiedExample: string;
    btnOpenOfficialGist: string;
  };
}
