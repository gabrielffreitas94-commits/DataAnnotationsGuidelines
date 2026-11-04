export const guidelineEsES = `# Audio & Voice Evaluation

> [!EXCEPTIONAL]
> 5 — Exceptional: Calificaciones completas, basadas en evidencias y consistentes. El anotador escucha completamente, separa calidad, adherencia y preferencia, y selecciona de 1 a 3 factores genuinamente decisivos.
> Rule: Escucha 100% de los audios | Separa Quality ≠ Adherence ≠ Preference | Calificaciones coherentes | 1 a 3 factores decisivos

1. Pitch Contour (Contorno de Tom — Rising or Falling)
O que é: La trayectoria o curva de la frecuencia fundamental ($F_0$) a lo largo de una frase o palabra. Muestra si el tono sube, baja o se mantiene estable.
Detalhes:
- rising pitch contour: tono ascendente (preguntas de sí/no o incertidumbre).
- falling pitch contour: tono descendente (afirmaciones conclusivas u órdenes).
- rise-fall / fall-rise: el tono sube y baja dentro de la misma cláusula.
Exemplos:
* "The model fails to resolve the sentence with a standard falling pitch contour, leaving the final word elevated as if posing an unfinished question."

2. Dynamic Inflection (Inflexión Dinâmica)
O que é: La capacidad de variar tono y modulación de forma expressiva, fluida y contextualizada. Lo opuesto a hablar como un robot lineal.
Detalhes:
- Modulación tonal expresiva que refleja urgencia, entusiasmo o matices emocionales.
- Evita entregas rígidas, planas o sintetizadas mecánicamente.
Exemplos:
* "Response A exhibits natural, dynamic inflection that appropriately conveys surprise at 0:08."
* "Response A showcases fluid inflection across the entire phrase, mimicking human intonation."
* "Response A demonstrates dynamic inflection across the clause, modulating its tonal range to convey genuine urgency rather than reading the text mechanically."

3. Pitch Shift (Deslocamento / Salto de Tom)
O que é: Un cambio perceptible en la frecuencia tonal (hacia agudo o grave).
Detalhes:
- Gradual y contextual aporta expresividad humana natural.
- Abrupto o inestable delata fallo mecánico del sintetizador (la voz salta repentinamente a un tono fino o grave).
Exemplos:
* "At 0:04, the synthetic voice suffers an abrupt upward pitch shift mid-vowel, producing an audible glitch on the stressed syllable."
* "An abrupt upward pitch shift on the second syllable, creating a disjointed, robotic artifact."
* "A sudden rising pitch shift at 0:15 that breaks the sentence's intonational coherence."

4. Accented Syllable (Sílaba Tônica / Acentuada)
O que é: La sílaba que recibe el mayor énfasis léxico dentro de una palabra.
Detalhes:
- La IA debe aplicar energía, duración y frecuencia exactas a la sílaba tónica.
- Errores de acentuación distorsionan la palabra y alteran su significado o categoría gramatical (ej: sustantivo vs verbo en 'record').
Exemplos:
* "The engine places the primary stress on the wrong accented syllable in 'record', pronouncing it as a noun instead of the intended verb form."
* "In 'per-fect-ly', the model misplaces the primary stress onto the second syllable, creating an unnatural phonetic delivery."

5. Flat Prosody (Prosódia Plana / Monótona)
O que é: Ausencia de variación prosódica — ritmo, intensidad, pausas y entonación ("voz de GPS antiguo").
Detalhes:
- Cuando se dice que un audio tiene 'problemas prosódicos', significa que la IA acertó la pronunciación de palabras aisladas, pero falló en la melodía, ritmo o musicalidad global del discurso.
Exemplos:
* "Due to its flat prosody, the narration lacks emotional variation and pacing shifts, sounding entirely monochrome despite the dramatic script."
* "While individual words are clear, the flat prosody produces a monotone delivery devoid of communicative intent."

6. Jarring Cadence (Cadência Desconexa / Ritmo Áspero)
O que é: Ritmo quebrado. Métrica rítmica rota, truncada o desagradable al oído.
Detalhes:
- Ritmo quebrado: espaciado irregular entre palabras o pausas respiratorias mal calculadas por la IA.
- La voz pierde fluidez y parece entrecortada con paradas bruscas donde debería haber continuidad natural.
Exemplos:
* "The unnatural 300 ms stutter between the auxiliary verb and the subject creates a jarring cadence that breaks the listener's immersion."
* "A jarring cadence disrupts the sentence flow with erratic pause placement between standard phrases."
`;
