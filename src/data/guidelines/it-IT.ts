export const guidelineItIT = `# Audio & Voice Evaluation

> [!EXCEPTIONAL]
> 5 — Exceptional: Valutazioni complete, basate su prove e coerenti. L'annotatore ascolta interamente gli audio, distingue qualità, aderenza e preferenza, e seleziona da 1 a 3 fattori decisivi.
> Rule: Ascolta il 100% degli audio | Separa Quality ≠ Adherence ≠ Preference | Valutazioni coerenti | 1 a 3 fattori decisivi

1. Pitch Contour (Contorno di Tono — Rising or Falling)
O que é: La traiettoria o curva della frequenza fondamentale ($F_0$) lungo una frase o parola. Mostra se il tono sale, scende o rimane stabile.
Detalhes:
- rising pitch contour: tono ascendente (domande o incertezza).
- falling pitch contour: tono discendente (affermazioni o ordini).
- rise-fall / fall-rise: il tono sale e scende all'interno della stessa clausola.
Exemplos:
* "The model fails to resolve the sentence with a standard falling pitch contour, leaving the final word elevated as if posing an unfinished question."

2. Dynamic Inflection (Inflessione Dinamica)
O que é: Capacità di variare tono e modulazione in modo espressivo, fluido e contestualizzato. L'opposto di una voce robotica lineare.
Detalhes:
- Modulazione espressiva che simula la naturale flessibilità e fluidità del parlato umano.
- Evita letture meccaniche o piatte.
Exemplos:
* "Response A exhibits natural, dynamic inflection that appropriately conveys surprise at 0:08."
* "Response A showcases fluid inflection across the entire phrase, mimicking human intonation."
* "Response A demonstrates dynamic inflection across the clause, modulating its tonal range to convey genuine urgency rather than reading the text mechanically."

3. Pitch Shift (Spostamento / Salto di Tono)
O que é: Una variazione percepibile nella frequenza tonale (verso l'acuto o il grave).
Detalhes:
- Se graduale è espressivo e naturale.
- Se brusco o instabile, delinea un difetto meccanico del sintetizzatore (salto improvviso a una frequenza anomala).
Exemplos:
* "At 0:04, the synthetic voice suffers an abrupt upward pitch shift mid-vowel, producing an audible glitch on the stressed syllable."
* "An abrupt upward pitch shift on the second syllable, creating a disjointed, robotic artifact."
* "A sudden rising pitch shift at 0:15 that breaks the sentence's intonational coherence."

4. Accented Syllable (Sillaba Tonica / Accentuata)
O que é: La sillaba che riceve l'accento e il risalto primario nella parola (accento lessicale).
Detalhes:
- La sintesi vocale deve dosare energia, durata e frequenza sulla sillaba esatta.
- Errori di accento stravolgono la parola o ne mutano la categoria grammaticale (es: sostantivo vs verbo in 'record').
Exemplos:
* "The engine places the primary stress on the wrong accented syllable in 'record', pronouncing it as a noun instead of the intended verb form."
* "In 'per-fect-ly', the model misplaces the primary stress onto the second syllable, creating an unnatural phonetic delivery."

5. Flat Prosody (Prosodia Piatta / Monotona)
O que é: Assenza di variazione nei parametri prosodici — ritmo, intensità, pause e intonazione ("voce da vecchio navigatore GPS").
Detalhes:
- Segnalare 'problemi prosodici' indica che l'IA ha pronunciato correttamente le singole parole, ma ha fallito sulla melodia, ritmo o musicalità globale del discorso.
Exemplos:
* "Due to its flat prosody, the narration lacks emotional variation and pacing shifts, sounding entirely monochrome despite the dramatic script."
* "While individual words are clear, the flat prosody produces a monotone delivery devoid of communicative intent."

6. Jarring Cadence (Cadenza Sconnessa / Ritmo Aspro)
O que é: Ritmo spezzato. Metrica ritmica frammentata o sgradevole all'ascolto.
Detalhes:
- Ritmo spezzato: spaziatura e pause respiratorie calcolate male dall'algoritmo.
- La voce perde continuità fluida e appare singhiozzante con brusche interruzioni.
Exemplos:
* "The unnatural 300 ms stutter between the auxiliary verb and the subject creates a jarring cadence that breaks the listener's immersion."
* "A jarring cadence disrupts the sentence flow with erratic pause placement between standard phrases."
`;
