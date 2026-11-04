export const guidelineEs419 = `# Audio & Voice Evaluation

> [!EXCEPTIONAL]
> 5 — Exceptional: Calificaciones completas, basadas en evidencia y consistentes. El anotador escucha completamente, separa calidad, adherencia y preferencia, y selecciona de 1 a 3 factores genuinamente decisivos.
> Rule: Escucha 100% de los audios | Separa Quality ≠ Adherence ≠ Preference | Calificaciones coherentes | 1 a 3 factores decisivos

1. Pitch Contour (Contorno de Tono / Altura)
O que é: La trayectoria o curva de la frecuencia fundamental ($F_0$) a lo largo de una frase o palabra. Muestra si el tono sube, baja o se mantiene estable.
No contexto prático: En humanos, una pregunta asciende al final ("¿Vienes?"), mientras que una afirmación desciende ("Ya voy."). Un contorno trunco o atípico suena inmediatamente artificial.

2. Dynamic Inflection (Inflexión Dinámica)
O que é: La capacidad de variar tono y modulación de forma expresiva, fluida y contextualizada. Lo opuesto a hablar como un robot lineal.
No contexto prático: Al enfatizar con entusiasmo o ironía, se usa inflexión dinámica. En audio sintetizado, indica flexibilidad y naturalidad humana al modular frecuencias.

3. Pitch Shift (Desplazamiento / Salto de Tono)
O que é: Un cambio perceptible en la frecuencia tonal (hacia más agudo o más grave).
No contexto prático: Gradual y con contexto es expresivo. En sintetizadores defectuosos, suele ser abrupto o inestable — la voz salta repentinamente como un corte o glitch mecánico.

4. Accented Syllable (Sílaba Tónica / Acentuada)
O que é: La sílaba que recibe el mayor énfasis dentro de una palabra (acento léxico).
No contexto prático: En la palabra "per-fect-ly", la sílaba tónica es "per-". El modelo debe aplicar energía, duración y frecuencia exactas. Si acentúa "fect", la pronunciación suena extraña o ininteligible.

5. Flat Prosody (Prosodia Plana / Monótona)
O que é: Ausencia de variación en ritmo, intensidad, pausas y entonación. La clásica "voz de GPS antiguo".
No contexto prático: Ocurre cuando el modelo lee manteniendo la misma frecuencia y volumen sin emoción ni intención comunicativa.

6. Jarring Cadence (Cadencia Desconexa / Ritmo Áspero)
O que é: Una métrica rítmica rota, truncada o desagradable al oído.
No contexto prático: Ocurre cuando el espaciado entre palabras o pausas respiratorias está mal calculado por la IA, sonando entrecortado.
`;
