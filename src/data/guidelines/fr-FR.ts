export const guidelineFrFR = `# Audio & Voice Evaluation

> [!EXCEPTIONAL]
> 5 — Exceptional: Évaluations complètes, fondées sur des preuves et cohérentes. L'annotateur écoute l'intégralité des audios, sépare qualité, conformité et préférence, et sélectionne 1 à 3 facteurs décisifs.
> Rule: Écoutez 100% des audios | Séparez Quality ≠ Adherence ≠ Preference | Notes cohérentes | 1 à 3 facteurs décisifs

1. Pitch Contour (Contour Mélodique — Rising or Falling)
O que é: La trajectoire ou le profil de la fréquence fondamentale ($F_0$) le long d'une phrase. Indique si le ton monte, descend ou reste stable.
Detalhes:
- rising pitch contour : ton montant (questions oui/non ou incertitude).
- falling pitch contour : ton descendant (affirmations conclusives ou ordres).
- rise-fall / fall-rise : montée et descente au sein de la même proposition.
Exemplos:
* "The model fails to resolve the sentence with a standard falling pitch contour, leaving the final word elevated as if posing an unfinished question."

2. Dynamic Inflection (Inflexion Dynamique)
O que é: Capacité de varier le ton et la modulation de façon expressive, fluide et contextuelle. L'opposé d'une voix robotique linéaire.
Detalhes:
- Modulation expressive qui simule la souplesse naturelle de la parole humaine.
- Évite les lectures linéaires, monochromes ou artificielles.
Exemplos:
* "Response A exhibits natural, dynamic inflection that appropriately conveys surprise at 0:08."
* "Response A showcases fluid inflection across the entire phrase, mimicking human intonation."
* "Response A demonstrates dynamic inflection across the clause, modulating its tonal range to convey genuine urgency rather than reading the text mechanically."

3. Pitch Shift (Saut / Déplacement de Ton)
O que é: Un changement perceptible de fréquence tonale (vers l'aigu ou le grave).
Detalhes:
- Si progressif et contextuel, apporte de l'expressivité naturelle.
- Si brusque ou instable, trahit un glitch mécanique du synthétiseur (saut subit vers un ton métallique ou aigu).
Exemplos:
* "At 0:04, the synthetic voice suffers an abrupt upward pitch shift mid-vowel, producing an audible glitch on the stressed syllable."
* "An abrupt upward pitch shift on the second syllable, creating a disjointed, robotic artifact."
* "A sudden rising pitch shift at 0:15 that breaks the sentence's intonational coherence."

4. Accented Syllable (Syllabe Accentée / Tonique)
O que é: La syllabe recevant l'accent tonique principal dans un mot (accent lexical).
Detalhes:
- La synthèse vocale doit appliquer l'énergie, la durée et la hauteur correctes sur la syllabe exacte.
- Une erreur d'accentuation déforme le mot et peut altérer sa classe grammaticale (ex : nom vs verbe dans 'record').
Exemplos:
* "The engine places the primary stress on the wrong accented syllable in 'record', pronouncing it as a noun instead of the intended verb form."
* "In 'per-fect-ly', the model misplaces the primary stress onto the second syllable, creating an unnatural phonetic delivery."

5. Flat Prosody (Prosodie Plate / Monotone)
O que é: Absence de variation prosodique — rythme, intensité, pauses et intonation ("voix de GPS ancien").
Detalhes:
- Lorsqu'on signale des 'problèmes prosodiques', cela signifie que l'IA a prononcé correctement les mots isolés, mais a échoué sur la mélodie, le rythme ou la musicalité globale du discours.
Exemplos:
* "Due to its flat prosody, the narration lacks emotional variation and pacing shifts, sounding entirely monochrome despite the dramatic script."
* "While individual words are clear, the flat prosody produces a monotone delivery devoid of communicative intent."

6. Jarring Cadence (Cadence Saccadée / Heurtée)
O que é: Rythme brisé. Une métrique rythmique heurtée ou désagréable à l'oreille.
Detalhes:
- Rythme brisé : espacement erratique entre mots, syllabes ou pauses respiratoires.
- La parole perd son flux conversationnel et paraît hachée avec des arrêts subits non naturels.
Exemplos:
* "The unnatural 300 ms stutter between the auxiliary verb and the subject creates a jarring cadence that breaks the listener's immersion."
* "A jarring cadence disrupts the sentence flow with erratic pause placement between standard phrases."
`;
