export const guidelineEnUS = `# Audio & Voice Evaluation

> [!EXCEPTIONAL]
> 5 — Exceptional: Complete, evidence-based, and internally consistent ratings. The annotator listens fully, separates quality, adherence, and preference, applies every displayed axis correctly, and selects one to three genuinely decisive factors.
> Rule: Listen to 100% of both audio clips | Separate Quality ≠ Adherence ≠ Preference | Consistent axis ratings | Select 1 to 3 truly decisive factors

1. Pitch Contour (Contorno de Tom — Rising or Falling)
O que é: The trajectory or contour of the fundamental frequency ($F_0$) over a sentence or word. It shows whether pitch is rising, falling, or remaining stable.
Detalhes:
- rising pitch contour: pitch rising, typical of yes/no questions or uncertainty.
- falling pitch contour: pitch falling, typical of conclusive statements or commands.
- rise-fall contour or fall-rise contour: pitch rises and falls within the same clause.
Exemplos:
* "The model fails to resolve the sentence with a standard falling pitch contour, leaving the final word elevated as if posing an unfinished question."

2. Dynamic Inflection (Inflexão Dinâmica)
O que é: The ability of the voice to vary pitch and modulation expressively, fluidly, and contextually. The opposite of a linear robot voice.
Detalhes:
- Expressive pitch range modulation reflecting conversational urgency, excitement, or nuance.
- Avoids rigid, flat, or synthetic line reading.
Exemplos:
* "Response A exhibits natural, dynamic inflection that appropriately conveys surprise at 0:08."
* "Response A showcases fluid inflection across the entire phrase, mimicking human intonation."
* "Response A demonstrates dynamic inflection across the clause, modulating its tonal range to convey genuine urgency rather than reading the text mechanically."

3. Pitch Shift (Deslocamento / Salto de Tom)
O que é: A noticeable shift or jump in tonal frequency (higher or lower pitch).
Detalhes:
- If gradual and contextual, it adds natural human expressiveness.
- If abrupt or erratic, it indicates a synthesizer defect or glitch (voice suddenly jumps to an unnatural pitch mechanically).
Exemplos:
* "At 0:04, the synthetic voice suffers an abrupt upward pitch shift mid-vowel, producing an audible glitch on the stressed syllable."
* "An abrupt upward pitch shift on the second syllable, creating a disjointed, robotic artifact."
* "A sudden rising pitch shift at 0:15 that breaks the sentence's intonational coherence."

4. Accented Syllable (Sílaba Tônica / Acentuada)
O que é: The syllable receiving primary stress and emphasis within a word (lexical stress).
Detalhes:
- Speech synthesis must apply proper energy, duration, and pitch to the exact stressed syllable.
- Misplaced stress distorts the word and may alter parts of speech (e.g., noun vs verb in 'record').
Exemplos:
* "The engine places the primary stress on the wrong accented syllable in 'record', pronouncing it as a noun instead of the intended verb form."
* "In 'per-fect-ly', the model misplaces the primary stress onto the second syllable, creating an unnatural phonetic delivery."

5. Flat Prosody (Prosódia Plana / Monótona)
O que é: Absence of variation in prosodic parameters—rhythm, loudness, pauses, and intonation ("old GPS voice").
Detalhes:
- When someone says audio has 'prosodic issues', it means the AI got individual word pronunciation right, but failed on the melody, rhythm, phrasing, or global musicality of speech.
Exemplos:
* "Due to its flat prosody, the narration lacks emotional variation and pacing shifts, sounding entirely monochrome despite the dramatic script."
* "While individual words are clear, the flat prosody produces a monotone delivery devoid of communicative intent."

6. Jarring Cadence (Cadência Desconexa / Ritmo Áspero)
O que é: Broken rhythm. A fractured, chopped, or uncomfortable metric in the flow of speech.
Detalhes:
- Broken cadence: spacing between words, syllables, or breath pauses is miscalculated by AI.
- Speech loses conversational swing, feeling chopped with unnatural sudden pauses where smooth flow should exist.
Exemplos:
* "The unnatural 300 ms stutter between the auxiliary verb and the subject creates a jarring cadence that breaks the listener's immersion."
* "A jarring cadence disrupts the sentence flow with erratic pause placement between standard phrases."
`;
