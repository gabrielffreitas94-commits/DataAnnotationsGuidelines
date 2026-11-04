export const guidelineEnUS = `# Audio & Voice Evaluation

> [!EXCEPTIONAL]
> 5 — Exceptional: Complete, evidence-based, and internally consistent ratings. The annotator listens fully, separates quality, adherence, and preference, applies every displayed axis correctly, and selects one to three genuinely decisive factors.
> Rule: Listen to 100% of both audio clips | Separate Quality ≠ Adherence ≠ Preference | Consistent axis ratings | Select 1 to 3 truly decisive factors

1. Pitch Contour (Contorno de Tom / Altura)
O que é: The trajectory or contour of the fundamental frequency ($F_0$) over a sentence or word. It shows whether pitch is rising, falling, or remaining stable over time.
No contexto prático: In human speech, questions typically have a rising final contour ("Are you coming?"), while statements fall ("I am coming."). A truncated or atypical contour immediately sounds synthetic.

2. Dynamic Inflection (Inflexão Dinâmica)
O que é: The ability of the voice to vary pitch and modulation expressively, fluidly, and contextually. The opposite of a linear robot voice.
No contexto prático: Emphasizing an important word with enthusiasm or irony relies on dynamic inflection. In synthesized audio, it indicates natural human flexibility rather than rigid monotone delivery.

3. Pitch Shift (Deslocamento / Salto de Tom)
O que é: A noticeable shift or jump in tonal frequency (higher pitch or lower pitch).
No contexto prático: If gradual and contextually appropriate, it adds expressiveness. In flawed TTS models, a pitch shift is abrupt or erratic—the voice suddenly jumps to an unnatural pitch mechanically, resembling an audio artifact.

4. Accented Syllable (Sílaba Tônica / Acentuada)
O que é: The syllable receiving primary stress and emphasis within a word (lexical stress).
No contexto prático: In the word "per-fect-ly", the stressed syllable is "per-". In speech synthesis, the model must apply the correct energy, duration, and frequency to this exact syllable. Stressing "fect" makes the speech sound awkward or unintelligible.

5. Flat Prosody (Prosódia Plana / Monótona)
O que é: Absence of variation in prosodic parameters—rhythm, loudness, pauses, and intonation. The classic monotone "old GPS" voice.
No contexto prático: Occurs when the model reads text with virtually the same frequency and volume throughout, lacking emotion, communicative intent, or sentence hierarchy.

6. Jarring Cadence (Cadência Desconexa / Ritmo Áspero)
O que é: A broken, choppy, or uncomfortable rhythmic metric and timing in speech.
No contexto prático: Happens when the spacing between words, syllables, or breath pauses is miscalculated by AI. The speech loses its conversational flow, sounding cut-up with unnatural sudden stops.
`;
