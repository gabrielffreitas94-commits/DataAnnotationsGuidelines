export const guidelineEnUS = `# 1. Overview & Workflow

> [!IMPORTANT]
> In AI Evaluation (RLHF / DataAnnotation), **project-specific instructions always override** general guidelines. Always review the latest project instruction doc and changelog before starting your timer.

## Standard Task Execution Workflow
- [ ] **1. Read Instructions & Updates**: Check for recent updates in project guidelines, rubric severity rules, or prompt scope.
- [ ] **2. Start Task Timer**: Start the timer in the top bar and on the platform to accurately track your RPH (Rate Per Hour).
- [ ] **3. Deconstruct the Prompt**: Identify the core request, explicit constraints (positive and negative), required output format, and persona/tone.
- [ ] **4. Individual Model Evaluation (Model A & Model B)**: Evaluate each response independently against the rubric before comparing them Side-by-Side (SxS).
- [ ] **5. Fact-Checking & Code Execution**: Run all code snippets in an isolated environment and verify factual claims against primary sources.
- [ ] **6. Write SxS Rationale**: Write a concise, evidence-based rationale citing concrete examples from both models and the decisive factor for your rating.

## Golden Rules of Quality
- **Specific Evidence > Vague Praise**: Never write just *"Model A is clearer and more complete"*. State exactly which constraint was met or which factual claim/line of code failed in Model B.
- **Zero LLM Usage in Rationales**: Never use an LLM to generate or rewrite your rationales or evaluations. Write directly in your own words.
- **Honest Time Tracking**: Pause your timer whenever you step away and stay within the project's expected time-per-task window.

---

# 2. Rubrics & Dimensions

> [!TIP]
> A major failure in **Safety**, **Factuality (Hallucination)**, or **Instruction Following** almost always outweighs purely stylistic or formatting advantages.

## Error Severity Matrix
| Dimension | No Issues | Minor Issue | Major / Critical Issue |
| :--- | :--- | :--- | :--- |
| **Instruction Following (IF)** | Follows all positive and negative constraints exactly as requested. | Slight formatting deviation or word count off by ~5%. | Ignores an explicit constraint, includes a forbidden element (negative constraint), or uses the wrong format. |
| **Factuality / Truthfulness** | 100% accurate, verifiable, and free of unsupported claims. | Trivial inaccuracy in a secondary detail that does not affect the core answer. | Factual hallucination, fabricated citation, wrong date/formula, or false claim on a core point. |
| **Coding & Logic** | Code runs out-of-the-box, handles edge cases, and follows best practices. | Minor lint warning, unused variable, or missing non-essential comment. | Syntax/runtime error, logical bug, security vulnerability, or hallucinated library/method. |
| **Completeness & Depth** | Addresses all parts of the prompt with appropriate depth. | Omits a helpful secondary detail while answering the main request. | Leaves an explicit part of the prompt unanswered or delivers a superficial/incomplete response. |
| **Style, Tone & Formatting** | Appropriate tone, smooth readability, clean and structured Markdown. | Slight repetition or overly chatty intro/outro. | Unreadable wall of text, condescending tone, false refusal, or broken formatting. |

## Side-by-Side (SxS) Decision Hierarchy
- [ ] **Safety & False Refusals**: Did either model generate unsafe content or refuse a benign prompt unnecessarily?
- [ ] **Instruction Following (IF)**: Did either model violate an explicit or negative constraint (e.g., "do not use bullet points", "output valid JSON only")?
- [ ] **Truthfulness & Execution**: Did either model hallucinate facts, non-existent APIs, or produce broken code?
- [ ] **Helpfulness & Formatting (Tie-breaker)**: If both succeeded above, which model was more direct, better structured, and genuinely more helpful?

---

# 3. Coding & STEM

> [!WARNING]
> **Never rely solely on visual inspection of code.** Models frequently hallucinate function parameters, library methods, or miss subtle edge cases. Always execute the code!

## Code Evaluation Checklist
- [ ] **Actual Execution**: Copy and run both Model A and Model B code in a local/sandbox environment using the target language version.
- [ ] **Verify Imports & APIs**: Confirm all libraries, packages, and methods actually exist and are not deprecated or fabricated.
- [ ] **Technical Constraints**: Check if the model used the requested language, function signature, data structures, and time/space complexity (Big-O).
- [ ] **Edge Case Testing**: Test empty inputs (\`null\`, \`[]\`, \`""\`), negative/zero numbers, boundary values, and large inputs.
- [ ] **Security & Best Practices**: Check for resource leaks, SQL Injection, XSS, hardcoded secrets, or unintended state mutation.
- [ ] **Explanation Accuracy**: Verify that the explanation accompanying the code accurately reflects what the code actually does.

## Math, Logic & STEM Checklist
- [ ] **Step-by-Step vs Final Answer**: A correct final answer derived from flawed intermediate steps must still be penalized for logic/reasoning.
- [ ] **Units & Rounding**: Verify unit conversions (SI vs Imperial), significant figures, and requested decimal places.
- [ ] **Independent Verification**: Solve the problem independently or verify with a Python script (\`sympy\` / \`numpy\`) before grading.

\`\`\`text
Example of strong technical evidence in a Code Rationale:
"Model A executes without errors and properly handles empty arrays on line 14. Model B throws a TypeError: Cannot read properties of undefined when passed an empty array, and hallucinates the method Array.prototype.flatMapAsync()."
\`\`\`

---

# 4. Fact-Checking & Safety

> [!CAUTION]
> **Never rely on memory or another LLM as your sole source.** Every factual claim (names, dates, statistics, events, laws, scientific papers) must be verified via Google / authoritative primary sources.

## Fact-Checking Checklist
- [ ] **Extract Verifiable Claims**: Identify all proper nouns, dates, locations, statistics, direct quotes, URLs, and citations.
- [ ] **Check Every URL & DOI**: Open all links/DOIs provided by the models — LLMs frequently fabricate plausible-looking URLs (404s or unrelated pages).
- [ ] **Audit Quotes & Authorship**: Confirm that quotes and works genuinely belong to the cited author and publication year.
- [ ] **Watch for "Frankenstein" Hallucinations**: Check whether the model blended real facts from two separate entities or events into one sentence.
- [ ] **Temporal Consistency**: Respect the knowledge cutoff or temporal anchor specified in the prompt.

## Safety, PII & Neutrality Checklist
- [ ] **Personal Identifiable Information (PII)**: Ensure neither the prompt nor responses expose private SSNs, phone numbers, personal emails, or physical addresses.
- [ ] **Neutral Point of View**: On open or controversial topics, the model should present balanced perspectives without taking an unrequested stance.
- [ ] **False Refusal Detection**: Penalize models that lecture the user or refuse benign prompts (e.g., defensive cybersecurity, harmless fiction, educational medical queries).

---

# 5. SxS Rationale

> [!TIP]
> Use this interactive builder to structure your **Side-by-Side (SxS) Rationale** clearly, objectively, and aligned with DataAnnotation quality audit standards.

## Recommended Rationale Structure
1. **Direct opening verdict**: Start by stating which model is better and the preference strength.
2. **Model A & Model B evidence**: Cite specific evidence (constraints followed/missed, factual accuracy, or code execution results).
3. **Decisive conclusion**: Explain why the winning model's strengths outweigh the other.

Winner & Preference Strength: {{preference:select[Model A is Much Better, Model A is Better, Model A is Slightly Better, About the Same (Tie), Model B is Slightly Better, Model B is Better, Model B is Much Better]}}
Task Category: {{task_category:select[General Instructions / Writing, Coding / Debugging, STEM / Mathematics, Fact-Checking / Research, Red-Teaming / Safety]}}

### Model A Analysis
Model A Strengths:
{{model_a_strengths:list}}

Model A Issues / Flaws:
{{model_a_flaws:list}}

### Model B Analysis
Model B Strengths:
{{model_b_strengths:list}}

Model B Issues / Flaws:
{{model_b_flaws:list}}

{{#if include_verification_notes}}
### Code Execution / Fact-Checking Evidence
Verification details:
{{verification_details:textarea}}
{{/if}}

### Decisive Conclusion (SxS Summary)
{{decisive_conclusion:textarea}}

---

# 6. Prompt & Golden Response

> [!NOTE]
> Use this tab when your task requires **crafting challenging prompts** (to induce a model split/failure) or writing a **Golden / Ideal Response**.

Task Objective: {{task_objective:select[Create Challenging Prompt (Induce Model Failure / Split), Write Golden Response (Ideal Response), Rewrite / Turn Editing]}}
Domain / Topic: {{domain:text}}
User Persona or Context: {{user_context:textarea}}

### Prompt Constraints
Required Elements (Positive Constraints):
{{positive_constraints:numbered_list}}

Negative Constraints (What NOT to do):
{{negative_constraints:list}}

Required Output Format: {{output_format:select[Structured Markdown, Code Only / Raw JSON, Comparative Table, Numbered List with Word Limit, Plain Prose without Bullet Points]}}

{{#if include_seed_code}}
### Input Code or Reference Data in Prompt
{{seed_code:code}}
{{/if}}

### Rubric Criteria / Planned Failure Mode
Why this prompt is challenging and what defines the ideal response:
{{evaluation_criteria:textarea}}
`;
