export const guidelineItIT = `# 1. Panoramica & Flusso

> [!IMPORTANT]
> Nella valutazione IA (RLHF / DataAnnotation), **le istruzioni specifiche del progetto prevalgono sempre** sulle linee guida generali. Leggi sempre il documento aggiornato del progetto prima di avviare il timer.

## Flusso di Lavoro Standard (Passo dopo Passo)
- [ ] **1. Lettura delle Istruzioni e Aggiornamenti**: Controllare eventuali modifiche recenti nella guida del progetto, nelle penalità della rubrica o nell'ambito del prompt.
- [ ] **2. Avviare il Timer (Task Timer)**: Attivare il cronometro nella barra superiore e sulla piattaforma per monitorare il proprio RPH (Rate Per Hour).
- [ ] **3. Scomposizione del Prompt**: Identificare la richiesta principale, i vincoli espliciti (positivi e negativi), il formato richiesto e il tono/persona.
- [ ] **4. Valutazione Individuale (Modello A e Modello B)**: Valutare ciascuna risposta singolarmente rispetto alla rubrica prima del confronto affiancato (SxS).
- [ ] **5. Verifica dei Fatti ed Esecuzione del Codice**: Eseguire tutto il codice in un ambiente isolato e verificare i fatti su fonti primarie attendibili.
- [ ] **6. Stesura del Rationale SxS**: Scrivere una motivazione concisa e oggettiva citando prove concrete da entrambi i modelli e il fattore decisivo.

## Regole d'Oro di Qualità
- **Prove Specifiche > Opinioni Generiche**: Non scrivere mai solo *"Il Modello A è più chiaro e completo"*. Specifica esattamente quale vincolo è stato rispettato o quale riga/dato ha fallito nel Modello B.
- **Zero Uso di LLM nelle Motivazioni**: Non usare mai l'IA per scrivere o riformulare i tuoi rationale. Scrivi sempre con parole tue in modo diretto.
- **Tracciamento Onesto del Tempo**: Metti in pausa il timer se ti allontani e rispetta il tempo massimo previsto per il task.

---

# 2. Rubriche & Dimensioni

> [!TIP]
> Un errore grave di **Sicurezza**, **Veridicità (Allucinazione)** o **Rispetto delle Istruzioni** pesa quasi sempre più di vantaggi puramente stilistici o di formattazione.

## Matrice di Gravità degli Errori
| Dimensione | Nessun Problema (No Issues) | Errore Lieve (Minor Issue) | Errore Grave / Critico (Major / Critical) |
| :--- | :--- | :--- | :--- |
| **Instruction Following (IF)** | Rispetta tutti i vincoli positivi e negativi esattamente come richiesto. | Lieve deviazione di formato o conteggio parole vicino al limite (~5%). | Ignora un vincolo esplicito, include un elemento vietato o cambia il formato richiesto. |
| **Factuality / Truthfulness** | 100% accurato, verificabile e privo di affermazioni non supportate. | Imprecisione marginale su un dettaglio secondario che non altera la risposta centrale. | Allucinazione fattuale, citazione inventata, data/formula errata o affermazione falsa sul punto chiave. |
| **Coding & Logic** | Il codice funziona al primo colpo, gestisce i casi limite e segue le best practice. | Warning minore del linter, variabile inutilizzata o commento opzionale mancante. | Errore di sintassi/esecuzione, bug logico, vulnerabilità di sicurezza o libreria/metodo inesistente. |
| **Completeness & Depth** | Affronta tutte le parti del prompt con la giusta profondità. | Omette un dettaglio secondario utile ma risponde alla richiesta principale. | Lascia una parte esplicita del prompt senza risposta o fornisce una risposta superficiale/incompleta. |
| **Style, Tone & Formatting** | Tono appropriato, lettura fluida, Markdown pulito e ben strutturato. | Lieve ripetizione o introduzione/conclusione troppo prolissa. | Muro di testo illeggibile, tono condiscendente, falso rifiuto (false refusal) o layout rotto. |

## Gerarchia di Decisione Side-by-Side (SxS)
- [ ] **Sicurezza & Falsi Rifiuti**: Uno dei modelli ha generato contenuti non sicuri o ha rifiutato senza motivo un prompt innocuo?
- [ ] **Instruction Following (IF)**: Uno dei modelli ha violato un vincolo esplicito o negativo (es. "non usare elenchi puntati", "rispondi solo in JSON")?
- [ ] **Veridicità & Esecuzione**: Uno dei modelli ha allucinato fatti, API inesistenti o prodotto codice non funzionante?
- [ ] **Utilità & Formattazione (Spareggio)**: Se entrambi hanno superato i punti precedenti, quale modello è stato più diretto, chiaro e utile?

---

# 3. Coding & STEM

> [!WARNING]
> **Non affidarti mai solo alla lettura visiva del codice.** I modelli spesso inventano parametri di funzioni, metodi di librerie o sbagliano casi limite sottili. Esegui sempre il codice!

## Checklist di Valutazione del Codice
- [ ] **Esecuzione Reale**: Copiare ed eseguire il codice del Modello A e del Modello B in un ambiente locale/sandbox con la versione corretta del linguaggio.
- [ ] **Verifica di Import e API**: Confermare che tutte le librerie, i pacchetti e i metodi esistano realmente e non siano deprecati o inventati.
- [ ] **Vincoli Tecnici**: Controllare se il modello ha rispettato linguaggio, firma della funzione, strutture dati e complessità (Big-O) richiesti.
- [ ] **Test dei Casi Limite (Edge Cases)**: Testare input vuoti (\`null\`, \`[]\`, \`""\`), numeri negativi/zero, valori limite e grandi volumi di dati.
- [ ] **Sicurezza e Best Practice**: Verificare resource leak, SQL Injection, XSS, credenziali hardcoded o mutazioni di stato indesiderate.
- [ ] **Accuratezza della Spiegazione**: Verificare che la spiegazione testuale corrisponda esattamente a ciò che fa il codice.

## Checklist di Matematica, Logica & STEM
- [ ] **Passaggi Intermedi vs Risultato Finale**: Un risultato finale corretto ottenuto tramite passaggi intermedi errati deve essere penalizzato in Logica/Ragionamento.
- [ ] **Unità e Arrotondamenti**: Controllare le conversioni di unità (SI vs Imperiale), le cifre significative e i decimali richiesti.
- [ ] **Verifica Indipendente**: Risolvere il problema in modo indipendente o validarlo con uno script Python (\`sympy\` / \`numpy\`) prima di valutare.

\`\`\`text
Esempio di prova tecnica in un Rationale di Codice:
"Il Modello A viene eseguito senza errori e gestisce correttamente gli array vuoti alla riga 14. Il Modello B genera un TypeError: Cannot read properties of undefined con un array vuoto e inventa il metodo Array.prototype.flatMapAsync()."
\`\`\`

---

# 4. Fact-Checking & Safety

> [!CAUTION]
> **Vietato affidarsi alla memoria o a un altro LLM come unica fonte.** Ogni affermazione fattuale (nomi, date, statistiche, eventi, leggi, articoli scientifici) deve essere verificata su Google / fonti ufficiali.

## Checklist di Verifica dei Fatti (Fact-Checking)
- [ ] **Individuare le Affermazioni Verificabili**: Elencare nomi propri, date, luoghi, statistiche, citazioni dirette, URL e riferimenti bibliografici.
- [ ] **Controllare Ogni URL e DOI**: Aprire tutti i link forniti dai modelli — gli LLM generano spesso URL plausibili ma inesistenti (404 o pagine non correlate).
- [ ] **Verificare Citazioni e Autori**: Confermare che l'opera o la citazione appartenga realmente all'autore indicato e all'anno corretto.
- [ ] **Attenzione alle Allucinazioni Ibride**: Controllare che il modello non abbia mescolato fatti reali di due entità o eventi diversi nella stessa frase.
- [ ] **Coerenza Temporale**: Rispettare la data di cutoff della conoscenza (knowledge cutoff) o il contesto temporale richiesto dal prompt.

## Checklist di Sicurezza, PII e Neutralità
- [ ] **Dati Personali (PII)**: Assicurarsi che né il prompt né le risposte espongano codici fiscali, numeri di telefono privati, email personali o indirizzi reali.
- [ ] **Tono Neutrale su Temi Sensibili**: Su argomenti aperti o controversi, il modello deve presentare più prospettive senza schierarsi se non richiesto.
- [ ] **Rilevamento di False Refusal**: Penalizzare i modelli che fanno la morale o rifiutano richieste sicure (es. cybersecurity difensiva, narrativa innocua, domande mediche educative).

---

# 5. Rationale SxS

> [!TIP]
> Usa questo generatore interattivo per strutturare la tua motivazione **Side-by-Side (SxS)** in modo chiaro, oggettivo e conforme agli standard di audit di DataAnnotation.

## Struttura Consigliata del Rationale
1. **Verdetto iniziale diretto**: Inizia dichiarando quale modello è migliore e in quale misura.
2. **Analisi del Modello A e Modello B**: Cita prove specifiche (vincoli rispettati/violati, accuratezza dei fatti o comportamento del codice).
3. **Criterio decisivo**: Spiega chiaramente perché i punti di forza del vincitore superano l'altro modello.

Vincitore e Livello di Preferenza: {{preferenza:select[Il Modello A è nettamente migliore (Much Better), Il Modello A è migliore (Better), Il Modello A è leggermente migliore (Slightly Better), Pareggio (About the Same), Il Modello B è leggermente migliore (Slightly Better), Il Modello B è migliore (Better), Il Modello B è nettamente migliore (Much Better)]}}
Categoria del Task: {{categoria_task:select[Istruzioni Generali / Scrittura, Coding / Debugging, STEM / Matematica, Fact-Checking / Ricerca, Red-Teaming / Safety]}}

### Analisi del Modello A
Punti di Forza del Modello A:
{{punti_forza_a:list}}

Difetti / Problemi del Modello A:
{{difetti_a:list}}

### Analisi del Modello B
Punti di Forza del Modello B:
{{punti_forza_b:list}}

Difetti / Problemi del Modello B:
{{difetti_b:list}}

{{#if includi_note_verifica}}
### Prove di Esecuzione / Fact-Checking
Dettagli della verifica effettuata:
{{dettagli_verifica:textarea}}
{{/if}}

### Conclusione Decisiva (Riepilogo SxS)
{{conclusione_decisiva:textarea}}

---

# 6. Prompt & Golden Response

> [!NOTE]
> Usa questa scheda quando il task richiede di **creare prompt sfidanti** (per indurre un errore/split nei modelli) o scrivere una **Golden Response / Risposta Ideale**.

Obiettivo del Task: {{obiettivo_task:select[Creare Prompt Sfidante (Indurre Errore / Split nei Modelli), Scrivere Golden Response (Risposta Ideale), Riscrivere / Modificare Risposta (Turn Editing)]}}
Dominio / Argomento: {{dominio:text}}
Persona o Contesto Utente: {{contesto_utente:textarea}}

### Vincoli del Prompt (Constraints)
Requisiti Obbligatori (Positive Constraints):
{{vincoli_positivi:numbered_list}}

Vincoli Negativi (Cosa NON fare):
{{vincoli_negativi:list}}

Formato di Output Richiesto: {{formato_output:select[Markdown Strutturato, Solo Codice / JSON Puro, Tabella Comparativa, Elenco Numerato con Limite di Parole, Testo Continuo senza Elenchi Puntati]}}

{{#if includi_codice_base}}
### Codice o Dati di Input nel Prompt
{{codice_input:code}}
{{/if}}

### Criteri della Rubrica / Trappola Pianificata
Perché questo prompt è sfidante e cosa definisce la risposta ideale:
{{criteri_valutazione:textarea}}
`;
