export const guidelinePtBR = `# Audio & Voice Evaluation

> [!EXCEPTIONAL]
> 5 — Exceptional: Complete, evidence-based, and internally consistent ratings. The annotator listens fully, separates quality, adherence, and preference, applies every displayed axis correctly, and selects one to three genuinely decisive factors.
> Rule: Ouça 100% dos áudios | Separe Quality ≠ Adherence ≠ Preference | Notas coerentes | 1 a 3 fatores decisivos

1. Pitch Contour (Contorno de Tom / Altura)
O que é: A trajetória ou "desenho" da frequência fundamental da voz ($F_0$) ao longo de uma frase ou palavra. É a curva que mostra se o tom está subindo, descendo ou se mantendo estável com o tempo.
No contexto prático: Em humanos, uma pergunta normalmente tem um contorno ascendente no final ("Você vem?"), enquanto uma afirmação cai ("Eu vou."). Um contorno truncado ou com desenho atípico soa imediatamente artificial.

2. Dynamic Inflection (Inflexão Dinâmica)
O que é: A capacidade da voz de variar o tom e a modulação de forma expressiva, fluida e contextualizada. É o oposto de falar como um robô linear.
No contexto prático: Quando você enfatiza uma palavra importante com entusiasmo ou ironia, você usa inflexão dinâmica. No áudio sintetizado, indica que o modelo foi capaz de simular a flexibilidade e a expressividade natural da fala humana ao modular a frequência sem soar rígido.

3. Pitch Shift (Deslocamento / Salto de Tom)
O que é: Uma mudança perceptível na frequência tonal (para mais agudo ou mais grave).
No contexto prático: Se for gradual e contextualmente adequado, faz parte da expressividade. Em modelos de áudio ou sintetizadores com defeito, um pitch shift costuma ser abrupto ou instável — a voz pula repentinamente para um tom fino ou grave de forma mecânica, lembrando um corte de áudio mal renderizado ou um sintetizador rudimentar.

4. Accented Syllable (Sílaba Tônica / Acentuada)
O que é: A sílaba que recebe o maior destaque ou ênfase dentro de uma palavra (em fonética, o acento léxico).
No contexto prático: Na palavra "per-fect-ly", a sílaba tônica é "per-". Em síntese de fala, o modelo precisa aplicar a energia certa, a duração correta e a frequência esperada sobre essa sílaba exata. Se ele errar e acentuar "fect" ou omitir a força em "per", a pronúncia fica estranha ou ininteligível.

5. Flat Prosody (Prosódia Plana / Monótona)
O que é: Ausência de variação nos parâmetros prosódicos da fala — ritmo, intensidade, pausas e entonação. É a clássica "voz de GPS antigo" ou voz monocórdica.
No contexto prático: Ocorre quando o modelo lê o texto mantendo praticamente a mesma frequência e volume o tempo todo, sem demonstrar emoção, intenção comunicativa ou hierarquia entre as palavras da oração.

6. Jarring Cadence (Cadência Desconexa / Ritmo Áspero)
O que é: Uma métrica rítmica quebrada, truncada ou desagradável ao ouvido humano (cadence = ritmo/compasso da fala; jarring = dissonante, desconexo, que incomoda).
No contexto prático: Acontece quando o espaçamento entre palavras, sílabas ou pausas respiratórias é mal calculado pela IA. A fala perde o "suingue" e o fluxo natural da conversação, dando a impressão de um áudio picotado, com paradas súbitas onde deveria haver continuidade fluida.
`;
