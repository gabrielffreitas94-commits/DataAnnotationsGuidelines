export const guidelineFrFR = `# Audio & Voice Evaluation

> [!EXCEPTIONAL]
> 5 — Exceptional: Évaluations complètes, fondées sur des preuves et cohérentes. L'annotateur écoute l'intégralité des audios, sépare qualité, conformité et préférence, et sélectionne 1 à 3 facteurs décisifs.
> Rule: Écoutez 100% des audios | Séparez Quality ≠ Adherence ≠ Preference | Notes cohérentes | 1 à 3 facteurs décisifs

1. Pitch Contour (Contour Mélodique / Hauteur Vocale)
O que é: La trajectoire ou le profil de la fréquence fondamentale ($F_0$) le long d'une phrase. Indique si le ton monte, descend ou reste stable.
No contexto prático: Chez l'humain, une question monte en fin de phrase ("Tu viens ?"), alors qu'une affirmation descend ("Je viens."). Un contour tronqué ou atypique sonne artificiel.

2. Dynamic Inflection (Inflexion Dynamique)
O que é: Capacité de varier le ton et la modulation de façon expressive, fluide et contextuelle. L'opposé d'une voix robotique linéaire.
No contexto prático: Accentuer un mot clé avec enthousiasme ou ironie repose sur l'inflexion dynamique. En synthèse vocale, cela traduit une flexibilité naturelle.

3. Pitch Shift (Saut / Déplacement de Ton)
O que é: Un changement perceptible de fréquence tonale (vers l'aigu ou le grave).
No contexte prático: Progressif et adapté, il apporte de l'expressivité. Dans les synthétiseurs défaillants, il est souvent abrupt ou instable, provoquant des sauts mécaniques.

4. Accented Syllable (Syllabe Accentée / Tonique)
O que é: La syllabe recevant l'accent tonique principal dans un mot.
No contexte prático: Dans "per-fect-ly", l'accent est sur "per-". Le modèle doit appliquer l'énergie et la durée correctes. Accentuer "fect" rend la diction anormale ou inintelligible.

5. Flat Prosody (Prosodie Plate / Monotone)
O que é: Absence de variation dans le rythme, l'intensité, les pauses et l'intonation ("voix de GPS ancien").
No contexte prático: Le modèle lit le texte avec une fréquence et un volume constants, sans émotion ni hiérarchie communicative.

6. Jarring Cadence (Cadence Saccadée / Heurtée)
O que é: Une métrique rythmique brisée, hachée ou désagréable à l'écoute.
No contexte prático: Se produit lorsque l'espacement entre mots ou pauses respiratoires est mal calculé, donnant un rendu haché.
`;
