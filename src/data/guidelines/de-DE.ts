export const guidelineDeDE = `# Audio & Voice Evaluation

> [!EXCEPTIONAL]
> 5 — Exceptional: Vollständige, evidenzbasierte und konsistente Bewertungen. Der Annotator hört die Audios vollständig an, trennt Qualität, Instruktionsbefolgung und Präferenz und wählt 1 bis 3 entscheidende Faktoren.
> Rule: 100% beider Audios anhören | Quality ≠ Adherence ≠ Preference trennen | Konsistente Achsennoten | 1 bis 3 entscheidende Faktoren wählen

1. Pitch Contour (Tonhöhenkontur — Rising or Falling)
O que é: Der Verlauf der Grundfrequenz ($F_0$) über Satz oder Wort hinweg. Zeigt, ob die Tonhöhe steigt, fällt oder stabil bleibt.
Detalhes:
- rising pitch contour: steigende Tonhöhe (Entscheidungsfragen oder Unsicherheit).
- falling pitch contour: fallende Tonhöhe (Aussagen oder Anweisungen).
- rise-fall / fall-rise: Tonhöhe steigt und fällt innerhalb desselben Teilsatzes.
Exemplos:
* "The model fails to resolve the sentence with a standard falling pitch contour, leaving the final word elevated as if posing an unfinished question."

2. Dynamic Inflection (Dynamische Tonhöhenmodulation)
O que é: Die Fähigkeit der Stimme, Tonhöhe und Modulation ausdrucksstark, fließend und kontextbezogen zu variieren.
Detalhes:
- Ausdrucksstarke Tonhöhenmodulation, die natürliche menschliche Flexibilität simuliert.
- Verhindert starre oder monotone Darbietung.
Exemplos:
* "Response A exhibits natural, dynamic inflection that appropriately conveys surprise at 0:08."
* "Response A showcases fluid inflection across the entire phrase, mimicking human intonation."
* "Response A demonstrates dynamic inflection across the clause, modulating its tonal range to convey genuine urgency rather than reading the text mechanically."

3. Pitch Shift (Tonhöhensprung / Tonverschiebung)
O que é: Eine spürbare Änderung der Tonfrequenz (höher oder tiefer).
Detalhes:
- Wenn graduell und kontextuell, verleiht es Expressivität.
- Wenn abrupt oder instabil, deutet es auf einen mechanischen Synthesizer-Glitch hin.
Exemplos:
* "At 0:04, the synthetic voice suffers an abrupt upward pitch shift mid-vowel, producing an audible glitch on the stressed syllable."
* "An abrupt upward pitch shift on the second syllable, creating a disjointed, robotic artifact."
* "A sudden rising pitch shift at 0:15 that breaks the sentence's intonational coherence."

4. Accented Syllable (Betonte Silbe / Wortakzent)
O que é: Die Silbe mit der Hauptbetonung innerhalb eines Wortes (Wortakzent).
Detalhes:
- Die Sprachsynthese muss Energie, Dauer und Tonhöhe exakt auf die betonte Silbe anwenden.
- Betonungsfehler verzerren das Wort und verändern Wortarten (z.B. Nomen vs. Verb bei 'record').
Exemplos:
* "The engine places the primary stress on the wrong accented syllable in 'record', pronouncing it as a noun instead of the intended verb form."
* "In 'per-fect-ly', the model misplaces the primary stress onto the second syllable, creating an unnatural phonetic delivery."

5. Flat Prosody (Flache Prosodie / Monotonie)
O que é: Fehlende Variation bei Rhythmus, Lautstärke, Pausen und Intonation ("alte GPS-Stimme").
Detalhes:
- 'Prosodieprobleme' bedeuten, dass die KI zwar einzelne Wörter korrekt ausspricht, aber an der Satzmelodie, dem Sprachfluss und der globalen Musikalität scheitert.
Exemplos:
* "Due to its flat prosody, the narration lacks emotional variation and pacing shifts, sounding entirely monochrome despite the dramatic script."
* "While individual words are clear, the flat prosody produces a monotone delivery devoid of communicative intent."

6. Jarring Cadence (Stolpernder Rhythmus / Holprige Kadenz)
O que é: Gebrochener Rhythmus. Holprige oder unangenehme Sprechrhythmik.
Detalhes:
- Gebrochener Rhythmus: Falsch berechnete Wortabstände oder unnatürliche Atempausen.
- Die Sprache verliert den natürlichen Fluss und wirkt abgehackt mit plötzlichen Unterbrechungen.
Exemplos:
* "The unnatural 300 ms stutter between the auxiliary verb and the subject creates a jarring cadence that breaks the listener's immersion."
* "A jarring cadence disrupts the sentence flow with erratic pause placement between standard phrases."
`;
