export const guidelineDeDE = `# 1. Übersicht & Ablauf

> [!IMPORTANT]
> Bei der KI-Evaluierung (RLHF / DataAnnotation) **haben projektspezifische Anweisungen immer Vorrang** vor allgemeinen Richtlinien. Prüfen Sie vor dem Starten des Timers stets das aktuelle Projektdokument.

## Standard-Arbeitsablauf (Schritt für Schritt)
- [ ] **1. Anweisungen & Updates lesen**: Prüfen, ob es aktuelle Änderungen im Projektleitfaden, bei den Bewertungsmaßstäben oder im Prompt-Umfang gibt.
- [ ] **2. Task-Timer starten**: Den Timer in der oberen Leiste sowie auf der Plattform aktivieren, um Ihre RPH (Rate Per Hour) präzise im Blick zu behalten.
- [ ] **3. Prompt zerlegen**: Kernaufgabe, explizite Einschränkungen (positive wie negative), gefordertes Ausgabeformat sowie Tonalität/Persona identifizieren.
- [ ] **4. Einzelbewertung (Modell A & Modell B)**: Jede Antwort zunächst separat anhand der Rubrik bewerten, bevor der direkte Vergleich (SxS) erfolgt.
- [ ] **5. Faktencheck & Code-Ausführung**: Gesamten Code in einer isolierten Umgebung ausführen und Fakten anhand verlässlicher Primärquellen prüfen.
- [ ] **6. SxS-Rationale verfassen**: Eine prägnante, evidenzbasierte Begründung mit konkreten Belegen aus beiden Modellen und dem ausschlaggebenden Kriterium schreiben.

## Goldene Qualitätsregeln
- **Konkrete Belege > Pauschale Aussagen**: Schreiben Sie niemals nur *„Modell A ist klarer und vollständiger“*. Nennen Sie exakt, welche Vorgabe erfüllt wurde oder welche Codezeile/Faktenbehauptung in Modell B falsch war.
- **Kein LLM-Einsatz für Begründungen**: Nutzen Sie niemals KI, um Ihre Rationales oder Bewertungen zu formulieren. Schreiben Sie immer selbst und direkt.
- **Ehrliche Zeiterfassung**: Pausieren Sie den Timer bei Unterbrechungen und halten Sie das vorgesehene Zeitfenster pro Aufgabe ein.

---

# 2. Rubriken & Dimensionen

> [!TIP]
> Ein schwerwiegender Fehler bei **Sicherheit**, **Faktentreue (Halluzination)** oder **Anweisungsbefolgung (IF)** wiegt fast immer schwerer als rein stilistische oder formale Vorteile.

## Fehler-Schweregrad-Matrix
| Dimension | Keine Probleme (No Issues) | Kleiner Mangel (Minor Issue) | Schwerer / Kritischer Fehler (Major / Critical) |
| :--- | :--- | :--- | :--- |
| **Instruction Following (IF)** | Befolgt alle positiven und negativen Vorgaben exakt wie gefordert. | Leichte Formatabweichung oder Wortanzahl knapp am Limit (~5 %). | Ignoriert eine explizite Vorgabe, nutzt ein verbotenes Element oder verfehlt das geforderte Format. |
| **Factuality / Truthfulness** | 100 % korrekt, überprüfbar und frei von unbelegten Behauptungen. | Unwesentliche Ungenauigkeit in einem Nebendetail ohne Einfluss auf die Kernaussage. | Faktische Halluzination, erfundenes Zitat, falsches Datum/Formel oder Falschaussage im Kernpunkt. |
| **Coding & Logic** | Code läuft sofort, behandelt Grenzfälle (Edge Cases) und folgt Best Practices. | Kleine Linter-Warnung, ungenutzte Variable oder fehlender optionaler Kommentar. | Syntax-/Laufzeitfehler, Logikfehler, Sicherheitslücke oder halluzinierte Bibliothek/Methode. |
| **Completeness & Depth** | Behandelt alle Teile des Prompts mit angemessener Tiefe. | Lässt ein nützliches Nebendetail aus, beantwortet aber die Hauptfrage. | Lässt einen expliziten Teil des Prompts unbeantwortet oder liefert eine oberflächliche Antwort. |
| **Style, Tone & Formatting** | Passender Tonfall, flüssig lesbar, sauberes und strukturiertes Markdown. | Leichte Wiederholung oder zu ausschweifende Einleitung/Schlussformel. | Unlesbarer Textblock, herablassender Ton, falsche Verweigerung (False Refusal) oder defektes Layout. |

## Side-by-Side (SxS) Entscheidungshierarchie
- [ ] **Sicherheit & Falsche Verweigerungen**: Hat eines der Modelle unsichere Inhalte erzeugt oder einen harmlosen Prompt grundlos abgelehnt?
- [ ] **Anweisungsbefolgung (IF)**: Hat eines der Modelle gegen eine explizite oder negative Vorgabe verstoßen (z. B. „keine Aufzählungszeichen“, „nur valides JSON“)?
- [ ] **Faktentreue & Ausführung**: Hat eines der Modelle Fakten/APIs halluziniert oder nicht lauffähigen Code geliefert?
- [ ] **Nützlichkeit & Formatierung (Tie-Breaker)**: Wenn beide oben fehlerfrei waren, welches Modell war direkter, klarer strukturiert und hilfreicher?

---

# 3. Coding & STEM

> [!WARNING]
> **Verlassen Sie sich niemals nur auf das bloße Durchlesen von Code.** Modelle halluzinieren häufig Funktionsparameter, Bibliotheksmethoden oder übersehen subtile Grenzfälle. Führen Sie den Code immer aus!

## Checkliste für die Code-Evaluierung
- [ ] **Tatsächliche Ausführung**: Code von Modell A und Modell B in einer lokalen Umgebung/Sandbox mit der korrekten Sprachversion kopieren und ausführen.
- [ ] **Imports & APIs prüfen**: Sicherstellen, dass alle Bibliotheken, Pakete und Methoden tatsächlich existieren und weder veraltet noch frei erfunden sind.
- [ ] **Technische Vorgaben**: Prüfen, ob Sprache, Funktionssignatur, Datenstrukturen und Zeit-/Speicherkomplexität (Big-O) eingehalten wurden.
- [ ] **Grenzfälle testen (Edge Cases)**: Leere Eingaben (\`null\`, \`[]\`, \`""\`), negative Zahlen/Null, Grenzwerte und große Datenmengen testen.
- [ ] **Sicherheit & Best Practices**: Auf Ressourcenlecks, SQL-Injection, XSS, fest codierte Zugangsdaten oder unbeabsichtigte Zustandsänderungen prüfen.
- [ ] **Richtigkeit der Erklärung**: Überprüfen, ob die begleitende Erklärung exakt mit dem tatsächlichen Verhalten des Codes übereinstimmt.

## Checkliste für Mathematik, Logik & MINT (STEM)
- [ ] **Rechenweg vs. Endergebnis**: Ein richtiges Endergebnis, das auf fehlerhaften Zwischenschritten beruht, muss bei Logik/Argumentation abgewertet werden.
- [ ] **Einheiten & Rundung**: Einheitenumrechnungen (SI vs. Imperial), signifikante Stellen und geforderte Nachkommastellen kontrollieren.
- [ ] **Unabhängige Prüfung**: Die Gleichung selbstständig lösen oder mit einem Python-Skript (\`sympy\` / \`numpy\`) validieren, bevor bewertet wird.

\`\`\`text
Beispiel für einen präzisen technischen Beleg im Code-Rationale:
"Modell A läuft fehlerfrei durch und fängt leere Arrays in Zeile 14 korrekt ab. Modell B bricht bei einem leeren Array mit TypeError: Cannot read properties of undefined ab und halluziniert zudem die Methode Array.prototype.flatMapAsync()."
\`\`\`

---

# 4. Fact-Checking & Safety

> [!CAUTION]
> **Verlassen Sie sich niemals allein auf Ihr Gedächtnis oder ein anderes LLM.** Jede Tatsachenbehauptung (Namen, Daten, Statistiken, Ereignisse, Gesetze, Fachartikel) muss über Google / offizielle Primärquellen verifiziert werden.

## Checkliste für die Faktenprüfung (Fact-Checking)
- [ ] **Überprüfbare Aussagen markieren**: Eigennamen, Daten, Orte, Statistiken, direkte Zitate, URLs und Literaturangaben erfassen.
- [ ] **Jede URL & DOI öffnen**: Alle angegebenen Links prüfen — LLMs erfinden häufig plausibel aussehende URLs (404-Fehler oder themenfremde Seiten).
- [ ] **Zitate & Urheberschaft prüfen**: Bestätigen, dass Werk oder Zitat tatsächlich vom genannten Autor und aus dem angegebenen Erscheinungsjahr stammen.
- [ ] **Vermischte Halluzinationen erkennen**: Prüfen, ob das Modell wahre Fakten zweier unterschiedlicher Personen oder Ereignisse in einem Satz vermischt hat.
- [ ] **Zeitliche Konsistenz**: Den Wissensstichtag (Knowledge Cutoff) bzw. den im Prompt geforderten Zeitrahmen beachten.

## Checkliste für Sicherheit, PII & Neutralität
- [ ] **Personenbezogene Daten (PII)**: Sicherstellen, dass weder Prompt noch Antworten private Ausweisnummern, Telefonnummern, E-Mail-Adressen oder Wohnadressen preisgeben.
- [ ] **Neutraler Standpunkt**: Bei offenen oder kontroversen Themen muss das Modell ausgewogene Perspektiven darstellen, ohne ungefragt Partei zu ergreifen.
- [ ] **False Refusal erkennen**: Modelle abstrafen, die den Nutzer belehren oder harmlose Anfragen ablehnen (z. B. defensive IT-Sicherheit, harmlose Fiktion, medizinische Wissensfragen).

---

# 5. SxS-Rationale

> [!TIP]
> Nutzen Sie diesen interaktiven Generator, um Ihre **Side-by-Side (SxS) Begründung** klar, objektiv und konform mit den DataAnnotation-Qualitätsstandards aufzubauen.

## Empfohlene Rationale-Struktur
1. **Direktes Einstiegsurteil**: Nennen Sie gleich zu Beginn, welches Modell besser ist und wie deutlich der Unterschied ausfällt.
2. **Analyse von Modell A & Modell B**: Führen Sie konkrete Belege an (befolgte/verletzte Vorgaben, Fakten oder Code-Verhalten).
3. **Ausschlaggebendes Fazit**: Erklären Sie klar, warum die Stärken des Gewinners gegenüber dem anderen Modell überwiegen.

Gewinner & Präferenzstärke: {{praeferenz:select[Modell A ist viel besser (Much Better), Modell A ist besser (Better), Modell A ist etwas besser (Slightly Better), Gleich gut (About the Same), Modell B ist etwas besser (Slightly Better), Modell B ist besser (Better), Modell B ist viel besser (Much Better)]}}
Aufgabenkategorie: {{aufgabenkategorie:select[Allgemeine Anweisungen / Text, Coding / Debugging, MINT / Mathematik, Fact-Checking / Recherche, Red-Teaming / Safety]}}

### Analyse von Modell A
Stärken von Modell A:
{{staerken_modell_a:list}}

Mängel / Fehler von Modell A:
{{maengel_modell_a:list}}

### Analyse von Modell B
Stärken von Modell B:
{{staerken_modell_b:list}}

Mängel / Fehler von Modell B:
{{maengel_modell_b:list}}

{{#if pruefungsnotizen_einschliessen}}
### Nachweis aus Code-Test / Faktencheck
Details der durchgeführten Überprüfung:
{{pruefungsdetails:textarea}}
{{/if}}

### Ausschlaggebendes Fazit (SxS-Zusammenfassung)
{{ausschlaggebendes_fazit:textarea}}

---

# 6. Prompt & Golden Response

> [!NOTE]
> Nutzen Sie diesen Tab, wenn Ihre Aufgabe darin besteht, **anspruchsvolle Prompts zu entwerfen** (um Modellfehler/Splits zu provozieren) oder eine **Golden Response / Idealantwort** zu verfassen.

Aufgabenziel: {{aufgabenziel:select[Herausfordernden Prompt erstellen (Modellfehler / Split provozieren), Golden Response verfassen (Ideale Antwort), Modellantwort umschreiben / editieren (Turn Editing)]}}
Fachgebiet / Thema: {{fachgebiet:text}}
Nutzer-Persona oder Kontext: {{nutzerkontext:textarea}}

### Prompt-Vorgaben (Constraints)
Pflichtanforderungen (Positive Constraints):
{{positive_vorgaben:numbered_list}}

Negative Vorgaben (Was NICHT getan werden darf):
{{negative_vorgaben:list}}

Gefordertes Ausgabeformat: {{ausgabeformat:select[Strukturiertes Markdown, Nur Code / Reines JSON, Vergleichstabelle, Nummerierte Liste mit Wortlimit, Fließtext ohne Aufzählungszeichen]}}

{{#if quellcode_einschliessen}}
### Eingabecode oder Referenzdaten im Prompt
{{eingabecode:code}}
{{/if}}

### Rubrik-Kriterien / Geplante Fehlerquelle
Warum dieser Prompt anspruchsvoll ist und was die ideale Antwort ausmacht:
{{bewertungskriterien:textarea}}
`;
