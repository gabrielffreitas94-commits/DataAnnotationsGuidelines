export const guidelineItIT = `# Audio & Voice Evaluation

> [!EXCEPTIONAL]
> 5 — Exceptional: Valutazioni complete, basate su prove e coerenti. L'annotatore ascolta interamente gli audio, distingue qualità, aderenza e preferenza, e seleziona da 1 a 3 fattori decisivi.
> Rule: Ascolta il 100% degli audio | Separa Quality ≠ Adherence ≠ Preference | Valutazioni coerenti | 1 a 3 fattori decisivi

1. Pitch Contour (Contorno di Tono / Altezza)
O que é: La traiettoria o curva della frequenza fondamentale ($F_0$) lungo una frase o parola. Mostra se il tono sale, scende o rimane stabile.
No contexto prático: Nelle domande la curva sale al termine ("Vieni?"), nelle affermazioni scende ("Vado io."). Un profilo troncato o atipico suona immediatamente sintetico.

2. Dynamic Inflection (Inflessione Dinamica)
O que é: Capacità di variare tono e modulazione in modo espressivo, fluido e contestualizzato. L'opposto di una voce robotica lineare.
No contexto prático: Enfatizzare parole chiave con entusiasmo o ironia; nella sintesi vocale indica flessibilità ed espressività umana.

3. Pitch Shift (Spostamento / Salto di Tono)
O que é: Una variazione percepibile nella frequenza tonale (verso l'acuto o il grave).
No contexto prático: Se graduale è espressivo; nei modelli difettosi è brusco e instabile, simile a un glitch audio.

4. Accented Syllable (Sillaba Tonica / Accentuata)
O que é: La sillaba che riceve l'accento e il risalto primario nella parola.
No contexto prático: Nella parola "per-fect-ly", l'accento cade su "per-". Il modello deve erogare la corretta energia e durata.

5. Flat Prosody (Prosodia Piatta / Monotona)
O que é: Assenza di variazione nei parametri prosodici (ritmo, intensità, pause e intonazione). La classica voce da vecchio GPS.
No contexto prático: La voce legge a frequenza costante senza emozione né intenzione comunicativa.

6. Jarring Cadence (Cadenza Sconnessa / Ritmo Aspro)
O que é: Metrica ritmica spezzata o sgradevole all'ascolto.
No contexto prático: Si verifica quando la spaziatura tra parole e pause respiratorie è calcolata male dall'IA, risultando frammentaria.
`;
