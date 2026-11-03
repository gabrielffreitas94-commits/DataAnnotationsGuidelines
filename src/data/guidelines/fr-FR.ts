export const guidelineFrFR = `# 1. Vue d'ensemble & Flux

> [!IMPORTANT]
> En évaluation d'IA (RLHF / DataAnnotation), **les instructions spécifiques au projet prévalent toujours** sur les directives générales. Consultez systématiquement le guide à jour du projet avant de lancer le chronomètre.

## Flux de Travail Standard (Étape par Étape)
- [ ] **1. Lecture des Instructions & Mises à jour** : Vérifier les changements récents dans les consignes du projet, les pénalités de la grille ou le périmètre du prompt.
- [ ] **2. Démarrer le Chronomètre (Task Timer)** : Activer le minuteur dans la barre supérieure et sur la plateforme pour suivre votre RPH (Rate Per Hour).
- [ ] **3. Décomposition du Prompt** : Identifier la demande principale, les contraintes explicites (positives et négatives), le format attendu et le ton/persona.
- [ ] **4. Évaluation Individuelle (Modèle A & Modèle B)** : Évaluer chaque réponse séparément selon la grille avant de les comparer côte à côte (SxS).
- [ ] **5. Vérification des Faits & Exécution du Code** : Tester tout le code dans un environnement isolé et vérifier chaque fait via des sources primaires fiables.
- [ ] **6. Rédaction du Rationale SxS** : Rédiger une justification concise et factuelle citant des preuves concrètes des deux modèles et le critère décisif.

## Règles d'Or de Qualité
- **Preuve Spécifique > Avis Générique** : N'écrivez jamais seulement *« Le Modèle A est plus clair et complet »*. Précisez exactement quelle contrainte a été respectée ou quelle ligne/affirmation a échoué dans le Modèle B.
- **Zéro Utilisation de LLM dans les Justifications** : N'utilisez jamais d'IA pour rédiger ou reformuler vos rationales. Écrivez directement avec vos propres mots.
- **Suivi Honnête du Temps** : Mettez le chronomètre en pause si vous vous absentez et respectez le temps imparti par tâche.

---

# 2. Grilles & Dimensions

> [!TIP]
> Une erreur majeure de **Sécurité**, de **Véracité (Hallucination)** ou de **Suivi d'Instructions** l'emporte presque toujours sur des avantages purement stylistiques ou de mise en forme.

## Matrice de Gravité des Erreurs
| Dimension | Aucun Problème (No Issues) | Erreur Mineure (Minor Issue) | Erreur Majeure / Critique (Major / Critical) |
| :--- | :--- | :--- | :--- |
| **Instruction Following (IF)** | Respecte toutes les contraintes positives et négatives exactement comme demandé. | Léger écart de mise en forme ou nombre de mots proche de la limite (~5 %). | Ignore une contrainte explicite, inclut un élément interdit ou change le format imposé. |
| **Factuality / Truthfulness** | 100 % exact, vérifiable et sans affirmation non fondée. | Imprécision mineure sur un détail secondaire qui n'altère pas la réponse principale. | Hallucination factuelle, citation inventée, date/formule erronée ou affirmation fausse sur un point clé. |
| **Coding & Logic** | Le code s'exécute immédiatement, gère les cas limites et suit les bonnes pratiques. | Avertissement mineur de linter, variable inutilisée ou commentaire optionnel manquant. | Erreur de syntaxe/exécution, bug logique, faille de sécurité ou bibliothèque/méthode inventée. |
| **Completeness & Depth** | Traite toutes les parties du prompt avec la profondeur adéquate. | Omet un détail secondaire utile mais répond à la demande principale. | Laisse une partie explicite du prompt sans réponse ou fournit une réponse superficielle/incomplète. |
| **Style, Tone & Formatting** | Ton approprié, lecture fluide, Markdown propre et bien structuré. | Légère répétition ou introduction/conclusion trop bavarde. | Bloc de texte illisible, ton condescendant, faux refus (false refusal) ou mise en page cassée. |

## Hiérarchie de Décision Side-by-Side (SxS)
- [ ] **Sécurité & Faux Refus** : L'un des modèles a-t-il généré un contenu dangereux ou refusé à tort un prompt inoffensif ?
- [ ] **Suivi des Instructions (IF)** : L'un des modèles a-t-il violé une contrainte explicite ou négative (ex. « pas de liste à puces », « répondre uniquement en JSON ») ?
- [ ] **Véracité & Exécution** : L'un des modèles a-t-il halluciné des faits, des API inexistantes ou produit un code non fonctionnel ?
- [ ] **Utilité & Mise en forme (Départage)** : Si les deux modèles ont réussi ci-dessus, lequel est le plus direct, clair et utile ?

---

# 3. Coding & STEM

> [!WARNING]
> **Ne vous fiez jamais uniquement à une lecture visuelle du code.** Les modèles hallucinent souvent des paramètres de fonctions, des méthodes de bibliothèques ou échouent sur des cas limites subtils. Exécutez toujours le code !

## Checklist d'Évaluation de Code
- [ ] **Exécution Réelle** : Copier et exécuter le code du Modèle A et du Modèle B dans un environnement local/sandbox avec la bonne version du langage.
- [ ] **Vérification des Imports & API** : Confirmer que toutes les bibliothèques, paquets et méthodes existent réellement et ne sont ni obsolètes ni inventés.
- [ ] **Contraintes Techniques** : Vérifier le respect du langage, de la signature de fonction, des structures de données et de la complexité (Big-O) demandés.
- [ ] **Test des Cas Limites (Edge Cases)** : Tester les entrées vides (\`null\`, \`[]\`, \`""\`), les nombres négatifs/zéro, les valeurs bornes et les grands volumes.
- [ ] **Sécurité & Bonnes Pratiques** : Vérifier les fuites de ressources, injections SQL, XSS, secrets codés en dur ou mutations d'état non désirées.
- [ ] **Exactitude de l'Explication** : S'assurer que l'explication accompagnant le code correspond exactement à son comportement réel.

## Checklist Mathématiques, Logique & STEM
- [ ] **Raisonnement Étape par Étape vs Résultat Final** : Un résultat final exact obtenu via des étapes intermédiaires fausses doit être pénalisé en Logique/Raisonnement.
- [ ] **Unités & Arrondis** : Vérifier les conversions d'unités (SI vs Impérial), les chiffres significatifs et les décimales demandées.
- [ ] **Vérification Indépendante** : Résoudre l'équation indépendamment ou valider avec un script Python (\`sympy\` / \`numpy\`) avant de noter.

\`\`\`text
Exemple de preuve technique dans un Rationale de Code :
"Le Modèle A s'exécute sans erreur et gère les tableaux vides à la ligne 14. Le Modèle B lève une TypeError: Cannot read properties of undefined sur un tableau vide et hallucine la méthode Array.prototype.flatMapAsync()."
\`\`\`

---

# 4. Fact-Checking & Safety

> [!CAUTION]
> **Ne vous fiez jamais à votre mémoire ou à un autre LLM comme source unique.** Toute affirmation factuelle (noms, dates, statistiques, événements, lois, articles scientifiques) doit être vérifiée sur Google / sources officielles.

## Checklist de Vérification des Faits (Fact-Checking)
- [ ] **Identifier les Affirmations Vérifiables** : Repérer les noms propres, dates, lieux, statistiques, citations directes, URL et références.
- [ ] **Vérifier chaque URL & DOI** : Ouvrir tous les liens fournis — les LLM fabriquent fréquemment des URL plausibles mais fausses (404 ou hors sujet).
- [ ] **Auditer les Citations & Auteurs** : Confirmer que l'œuvre ou la citation appartient bien à l'auteur mentionné et à la bonne année.
- [ ] **Traquer les Hallucinations Hybrides** : Vérifier que le modèle n'a pas fusionné des faits réels provenant de deux entités ou événements distincts.
- [ ] **Cohérence Temporelle** : Respecter la date de coupure des connaissances (knowledge cutoff) ou le cadre temporel fixé par le prompt.

## Checklist Sécurité, PII & Neutralité
- [ ] **Données Personnelles (PII)** : Garantir que ni le prompt ni les réponses n'exposent de numéros personnels, téléphones privés, e-mails ou adresses réelles.
- [ ] **Neutralité sur les Sujets Sensibles** : Sur les sujets ouverts ou controversés, le modèle doit présenter plusieurs points de vue sans prendre parti.
- [ ] **Détection de Faux Refus (False Refusal)** : Pénaliser les modèles moralisateurs ou qui refusent des demandes sûres (ex. cybersécurité défensive, fiction inoffensive, questions médicales éducatives).

---

# 5. Rationale SxS

> [!TIP]
> Utilisez ce générateur interactif pour structurer votre justification **Side-by-Side (SxS)** de façon claire, objective et conforme aux standards d'audit DataAnnotation.

## Structure Recommandée du Rationale
1. **Verdict initial direct** : Indiquez d'emblée quel modèle est meilleur et avec quelle intensité.
2. **Analyse du Modèle A & Modèle B** : Citez des preuves précises (contraintes respectées/violées, exactitude factuelle ou exécution du code).
3. **Conclusion décisive** : Expliquez pourquoi les points forts du gagnant l'emportent sur l'autre modèle.

Gagnant & Niveau de Préférence : {{preference:select[Le Modèle A est nettement meilleur (Much Better), Le Modèle A est meilleur (Better), Le Modèle A est légèrement meilleur (Slightly Better), Égalité (About the Same), Le Modèle B est légèrement meilleur (Slightly Better), Le Modèle B est meilleur (Better), Le Modèle B est nettement meilleur (Much Better)]}}
Catégorie de Tâche : {{categorie_tache:select[Instructions Générales / Rédaction, Coding / Debugging, STEM / Mathématiques, Fact-Checking / Recherche, Red-Teaming / Safety]}}

### Analyse du Modèle A
Points Forts du Modèle A :
{{forces_modele_a:list}}

Défauts / Erreurs du Modèle A :
{{defauts_modele_a:list}}

### Analyse du Modèle B
Points Forts du Modèle B :
{{forces_modele_b:list}}

Défauts / Erreurs du Modèle B :
{{defauts_modele_b:list}}

{{#if inclure_notes_verification}}
### Preuves d'Exécution / Fact-Checking
Détails de la vérification effectuée :
{{details_verification:textarea}}
{{/if}}

### Conclusion Décisive (Résumé SxS)
{{conclusion_decisive:textarea}}

---

# 6. Prompt & Golden Response

> [!NOTE]
> Utilisez cet onglet lorsque la tâche demande de **concevoir des prompts exigeants** (pour provoquer une erreur/différence entre modèles) ou de rédiger une **Golden Response / Réponse Idéale**.

Objectif de la Tâche : {{objectif_tache:select[Créer un Prompt Complexe (Induire un Échec / Split), Rédiger une Golden Response (Réponse Idéale), Réécrire / Corriger une Réponse (Turn Editing)]}}
Domaine / Sujet : {{domaine:text}}
Persona ou Contexte Utilisateur : {{contexte_utilisateur:textarea}}

### Contraintes du Prompt
Exigences Obligatoires (Contraintes Positives) :
{{contraintes_positives:numbered_list}}

Contraintes Négatives (Ce qu'il ne faut PAS faire) :
{{contraintes_negatives:list}}

Format de Sortie Exigé : {{format_sortie:select[Markdown Structuré, Code Uniquement / JSON Brut, Tableau Comparatif, Liste Numérotée avec Limite de Mots, Texte Continu sans Puces]}}

{{#if inclure_code_source}}
### Code ou Données d'Entrée Fournis dans le Prompt
{{code_entree:code}}
{{/if}}

### Critères de Grille / Piège Prévu
Pourquoi ce prompt est exigeant et ce qui définit la réponse idéale :
{{criteres_evaluation:textarea}}
`;
