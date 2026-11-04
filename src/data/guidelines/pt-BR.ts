export const guidelinePtBR = `# Audio & Voice Evaluation

> [!EXCEPTIONAL]
> 5 — Exceptional: Complete, evidence-based, and internally consistent ratings. The annotator listens fully, separates quality, adherence, and preference, applies every displayed axis correctly, and selects one to three genuinely decisive factors.
> Rule: Ouça 100% dos áudios | Separe Quality ≠ Adherence ≠ Preference | Notas coerentes | 1 a 3 fatores decisivos

1. Pitch Contour (Contorno de Tom — Rising or Falling)
O que é: A trajetória ou "desenho" da frequência fundamental da voz ($F_0$) ao longo de uma frase ou palavra. É a curva que mostra se o tom está subindo, descendo ou se mantendo estável.
Detalhes:
- rising pitch contour: tom subindo, típico de perguntas de sim/não ou incerteza.
- falling pitch contour: tom descendo, típico de afirmações conclusivas ou ordens.
- rise-fall contour ou fall-rise contour: quando o tom sobe e desce dentro da mesma oração.
Exemplos:
* "The model fails to resolve the sentence with a standard falling pitch contour, leaving the final word elevated as if posing an unfinished question."

2. Dynamic Inflection (Inflexão Dinâmica)
O que é: A capacidade da voz de variar o tom e a modulação de forma expressiva, fluida e contextualizada. É o oposto de falar como um robô linear.
Detalhes:
- Modulação expressiva que simula a flexibilidade e expressividade natural da fala humana ao modular frequências.
- Evita entregas rígidas, lineares ou artificiais.
Exemplos:
* "Response A exhibits natural, dynamic inflection that appropriately conveys surprise at 0:08."
* "Response A showcases fluid inflection across the entire phrase, mimicking human intonation."
* "Response A demonstrates dynamic inflection across the clause, modulating its tonal range to convey genuine urgency rather than reading the text mechanically."

3. Pitch Shift (Deslocamento / Salto de Tom)
O que é: Uma mudança perceptível na frequência tonal (para mais agudo ou mais grave).
Detalhes:
- Se gradual e contextualmente adequado, faz parte da expressividade natural.
- Se abrupto ou instável, indica falha/defeito mecânico do sintetizador (a voz pula repentinamente para um tom fino ou grave, lembrando um corte de áudio mal renderizado).
Exemplos:
* "At 0:04, the synthetic voice suffers an abrupt upward pitch shift mid-vowel, producing an audible glitch on the stressed syllable."
* "An abrupt upward pitch shift on the second syllable, creating a disjointed, robotic artifact."
* "A sudden rising pitch shift at 0:15 that breaks the sentence's intonational coherence."

4. Accented Syllable (Sílaba Tônica / Acentuada)
O que é: A sílaba que recebe o maior destaque ou ênfase dentro de uma palavra (em fonética, o acento léxico).
Detalhes:
- A IA precisa aplicar a energia certa, a duração correta e a frequência esperada sobre a sílaba tônica exata.
- Erros de acentuação distorcem a palavra e podem alterar a classe gramatical (ex: substantivo vs verbo em 'record').
Exemplos:
* "The engine places the primary stress on the wrong accented syllable in 'record', pronouncing it as a noun instead of the intended verb form."
* "In 'per-fect-ly', the model misplaces the primary stress onto the second syllable, creating an unnatural phonetic delivery."

5. Flat Prosody (Prosódia Plana / Monótona)
O que é: Ausência de variação nos parâmetros prosódicos da fala — ritmo, intensidade, pausas e entonação. É a clássica "voz de GPS antigo" ou monocórdica.
Detalhes:
- Quando alguém diz que um áudio tem 'problemas prosódicos', significa que a inteligência artificial acertou a pronúncia das palavras isoladas, mas falhou na melodia, no ritmo, na pontuação sonora ou na musicalidade global do discurso.
Exemplos:
* "Due to its flat prosody, the narration lacks emotional variation and pacing shifts, sounding entirely monochrome despite the dramatic script."
* "While individual words are clear, the flat prosody produces a monotone delivery devoid of communicative intent."

6. Jarring Cadence (Cadência Desconexa / Ritmo Áspero)
O que é: Ritmo quebrado. Uma métrica rítmica quebrada, truncada ou desagradável ao ouvido humano.
Detalhes:
- Ritmo quebrado: quando o espaçamento entre palavras, sílabas ou pausas respiratórias é mal calculado pela IA.
- A fala perde o 'suingue' e fluxo natural da conversação, dando a impressão de áudio picotado com paradas súbitas onde deveria haver continuidade fluida.
Exemplos:
* "The unnatural 300 ms stutter between the auxiliary verb and the subject creates a jarring cadence that breaks the listener's immersion."
* "A jarring cadence disrupts the sentence flow with erratic pause placement between standard phrases."
`;
