# DataAnnotation Guidelines & SxS Rationale Hub

Aplicação minimalista para **GitHub Pages** voltada para avaliação de modelos de IA (**RLHF / DataAnnotation / SxS Evaluation / Coding & STEM**), seguindo a mesma arquitetura dinâmica baseada em **GitHub Gists** do **PromptCraft**.

- **Gist Oficial (Multi-idioma EFIGS + LATAM)**: [`a551abab1395c1f911f0d5979c9c09e0`](https://gist.github.com/gabrielffreitas94-commits/a551abab1395c1f911f0d5979c9c09e0)

## Funcionalidades Principais

- **Abas Superiores Dinâmicas (`# Título`)**: Cada seção de nível 1 (`# Nome da Aba`) do arquivo Markdown no GitHub Gist vira automaticamente uma aba na barra superior.
- **Layout Híbrido Adaptativo**:
  - **Modo Guideline & Checklist**: Seções sem variáveis dinâmicas são exibidas em cards minimalistas (`## Subtítulo`) com checklists interativos (`- [ ]`), barra de progresso por aba, filtro rápido, tabelas de rubrica e callouts (`> [!IMPORTANT]`, `> [!TIP]`, `> [!WARNING]`, `> [!CAUTION]`).
  - **Modo Construtor Split-Screen (`{{variavel:tipo}}`)**: Seções com variáveis dinâmicas (como **5. Rationale SxS** e **6. Prompt & Golden Response**) abrem automaticamente o construtor interativo lado a lado com contador de palavras/caracteres e cópia em 1 clique.
- **Cronômetro de Task (RPH Timer)**: Cronômetro integrado na barra superior com persistência em `localStorage` e botão **"Nova Task (Zerar Tudo)"**.
- **Internacionalização Completa (EFIGS + LATAM)**:
  - **LATAM**: Português (`pt-BR`), Español LATAM (`es-419`)
  - **EFIGS**: English (`en-US`), Français (`fr-FR`), Italiano (`it-IT`), Deutsch (`de-DE`), Español España (`es-ES`)
  - Suporta arquivos localizados no Gist (`guideline.<idioma>.md`) com fallback automático para `guideline.md`.
- **Temas Dark & Light**: Estética minimalista monocromática com alternância instantânea.
