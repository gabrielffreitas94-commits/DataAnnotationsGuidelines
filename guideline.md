# 1. Visão Geral & Fluxo

> [!IMPORTANT]
> Na avaliação de IA (RLHF / DataAnnotation), a **instrução específica do projeto sempre prevalece** sobre qualquer regra geral. Leia o documento de instruções atualizado antes de iniciar o timer.

## Fluxo Padrão de Execução (Passo a Passo)
- [ ] **1. Leitura das Instruções e Atualizações**: Verificar se houve mudança recente no guia do projeto, nas penalidades de rubrica ou no escopo do prompt.
- [ ] **2. Iniciar Cronômetro (Task Timer)**: Ativar o timer no topo desta página e o cronômetro da plataforma para controlar seu RPH (Rate Per Hour).
- [ ] **3. Decomposição do Prompt**: Identificar a tarefa central, restrições explícitas (positivas e negativas), formato exigido e persona/tom.
- [ ] **4. Avaliação Individual (Modelo A e Modelo B)**: Avaliar cada modelo separadamente contra a rubrica antes de compará-los lado a lado (SxS).
- [ ] **5. Verificação Factual e Execução de Código**: Testar todo código em ambiente isolado e checar fatos em fontes primárias confiáveis.
- [ ] **6. Redação do Rationale SxS**: Escrever uma justificativa concisa, objetiva, citando evidências concretas de ambos os modelos e o motivo decisivo da escolha.

## Regras de Ouro de Qualidade
- **Evidência Específica > Opinião Genérica**: Nunca escreva apenas *"O Modelo A é mais claro e completo"*. Cite qual requisito exato foi cumprido ou qual linha/fato falhou no Modelo B.
- **Zero Uso de LLM em Justificativas**: Jamais use IA para redigir suas justificativas (rationales) ou avaliações. Escreva com suas próprias palavras de forma direta.
- **Reporte Tempo Realista**: Mantenha foco ativo; pause o timer caso precise se ausentar e nunca ultrapasse o tempo máximo da task sem justificativa técnica.

---

# 2. Rubricas & Dimensões

> [!TIP]
> Uma falha grave de **Segurança**, **Veracidade (Alucinação)** ou **Seguimento de Instrução** quase sempre supera vantagens meramente estilísticas ou de formatação.

## Matriz de Severidade de Erros
| Dimensão | Sem Problemas (No Issues) | Erro Menor (Minor Issue) | Erro Grave / Crítico (Major / Critical) |
| :--- | :--- | :--- | :--- |
| **Instruction Following (IF)** | Segue todas as restrições positivas e negativas exatamente como pedido. | Desvio leve de formatação ou contagem de palavras próxima do limite (~5%). | Ignora restrição explícita, inclui item proibido (negative constraint) ou muda o formato pedido. |
| **Factuality / Truthfulness** | 100% preciso, verificável e sem extrapolações não comprovadas. | Imprecisão trivial ou secundária que não altera a resposta central. | Alucinação factual, citação inventada, data/fórmula errada ou afirmação falsa no ponto central. |
| **Coding & Logic** | Código executa de primeira, trata edge cases e segue boas práticas. | Warning de lint, variável não usada ou falta de comentário não essencial. | Erro de sintaxe/execução, bug lógico, falha de segurança ou uso de biblioteca/método inexistente. |
| **Completeness & Depth** | Aborda todas as partes da pergunta com profundidade adequada. | Omite detalhe complementar útil, mas responde à pergunta principal. | Deixa parte explícita do prompt sem resposta ou entrega resposta superficial/incompleta. |
| **Style, Tone & Formatting** | Tom adequado, leitura fluida, Markdown limpo e bem estruturado. | Leve repetição, introdução/conclusão prolixa (pleasantly chatty). | Parede de texto ilegível, tom condescendente, recusa falsa (false refusal) ou quebra severa de layout. |

## Hierarquia de Decisão Side-by-Side (SxS)
- [ ] **Segurança & Recusas Falsas**: Algum modelo gerou conteúdo inseguro ou recusou um prompt benigno sem motivo?
- [ ] **Seguimento de Instruções (IF)**: Algum modelo violou uma restrição explícita ou negativa (ex: "não use a letra X", "responda apenas em JSON")?
- [ ] **Veracidade & Execução (Truthfulness / Code)**: Algum modelo alucinou fatos, APIs inexistentes ou gerou código que não roda?
- [ ] **Utilidade & Formatação (Tie-breaker)**: Se ambos acertaram tudo acima, qual modelo foi mais direto, bem estruturado e útil para o usuário?

---

# 3. Coding & STEM

> [!WARNING]
> **Nunca confie apenas na leitura visual do código.** Modelos frequentemente alucinam parâmetros de funções, métodos de bibliotecas ou erram casos de borda sutis. Sempre execute o código!

## Checklist de Avaliação de Código
- [ ] **Execução Real**: Copiar e rodar o código do Modelo A e do Modelo B em um ambiente local/sandbox com a versão correta da linguagem.
- [ ] **Verificação de Imports e APIs**: Confirmar se todas as bibliotecas, pacotes e métodos existem e não estão depreciados ou inventados.
- [ ] **Cumprimento de Restrições Técnicas**: Verificar se o modelo usou a linguagem, versão, assinatura de função e complexidade (Big-O) exigidas no prompt.
- [ ] **Teste de Casos de Borda (Edge Cases)**: Testar entradas vazias (`null`, `[]`, `""`), números negativos/zero, tipos inesperados e volumes grandes.
- [ ] **Segurança e Boas Práticas**: Checar vazamento de recursos, SQL Injection, XSS, credenciais hardcoded ou mutação indevida de estado.
- [ ] **Qualidade da Explicação**: Verificar se a explicação após o código condiz exatamente com a implementação apresentada.

## Checklist de Matemática, Lógica & STEM
- [ ] **Passo a Passo vs Resultado Final**: Um resultado final correto com raciocínio intermediário errado deve ser penalizado em Lógica/Raciocínio.
- [ ] **Unidades e Arredondamento**: Conferir conversões de unidades (SI vs Imperial), algarismos significativos e casas decimais solicitadas.
- [ ] **Verificação Independente**: Resolver a equação ou validar com script Python (`sympy` / `numpy`) antes de julgar os modelos.

```text
Exemplo de evidência técnica para Rationale de Código:
"O Modelo A executa sem erros e trata listas vazias na linha 14. O Modelo B falha com TypeError: Cannot read properties of undefined ao receber um array vazio, além de alucinar o método Array.prototype.flatMapAsync()."
```

---

# 4. Fact-Checking & Safety

> [!CAUTION]
> **Proibido confiar na memória ou em outro LLM como fonte única.** Toda afirmação factual (nomes, datas, estatísticas, eventos, leis, artigos científicos) deve ser verificada no Google / fontes oficiais.

## Checklist de Verificação de Fatos (Fact-Checking)
- [ ] **Identificar Claims Verificáveis**: Listar nomes próprios, datas, locais, estatísticas, citações diretas, URLs e referências bibliográficas.
- [ ] **Checar URLs e DOIs**: Abrir todos os links/DOIs fornecidos pelos modelos — LLMs frequentemente fabricam URLs com aparência plausível (404 ou página de outro assunto).
- [ ] **Auditar Citações e Autoria**: Confirmar se a obra/frase realmente pertence ao autor citado e se o ano de publicação está correto.
- [ ] **Atenção a Alucinações "Costuradas"**: Verificar se o modelo não misturou fatos reais de duas entidades/eventos diferentes na mesma frase.
- [ ] **Consistência Temporal**: Respeitar a data de corte (knowledge cutoff) ou o contexto temporal exigido pelo prompt.

## Checklist de Segurança, PII e Neutralidade
- [ ] **Dados Pessoais (PII)**: Garantir que nem o prompt nem as respostas exponham CPF/SSN, telefones privados, e-mails pessoais ou endereços reais de indivíduos privados.
- [ ] **Tom Neutro em Temas Sensíveis**: Em questões abertas ou controversas, o modelo deve apresentar múltiplos pontos de vista sem tomar partido quando não solicitado.
- [ ] **Detecção de False Refusal (Recusa Indevida)**: Penalizar modelos que dão sermão moral ou recusam pedidos seguros (ex: segurança defensiva, ficção inofensiva, termos médicos educativos).

---

# 5. Rationale SxS

> [!TIP]
> Use este gerador interativo para estruturar sua justificativa **Side-by-Side (SxS)** de forma clara, objetiva e alinhada ao padrão de auditoria do DataAnnotation.

## Estrutura Recomendada de Rationale
1. **Veredito inicial direto**: Comece declarando qual modelo é melhor e o quão melhor ele é.
2. **Análise do Modelo A e Modelo B**: Cite evidências específicas (instruções seguidas/violadas, fatos ou comportamento do código).
3. **Critério decisivo**: Explique claramente por que as vantagens do vencedor superam o outro modelo.

Vencedor e Nível de Preferência: {{preferencia:select[Modelo A é muito melhor (Much Better), Modelo A é melhor (Better), Modelo A é levemente melhor (Slightly Better), Empate (About the Same), Modelo B é levemente melhor (Slightly Better), Modelo B é melhor (Better), Modelo B é muito melhor (Much Better)]}}
Tipo de Tarefa: {{tipo_tarefa:select[Instruções Gerais / Escrita, Coding / Debugging, STEM / Matemática, Fact-Checking / Pesquisa, Red-Teaming / Safety]}}

### Análise do Modelo A
Pontos Fortes do Modelo A:
{{pontos_fortes_a:list}}

Falhas / Problemas do Modelo A:
{{falhas_a:list}}

### Análise do Modelo B
Pontos Fortes do Modelo B:
{{pontos_fortes_b:list}}

Falhas / Problemas do Modelo B:
{{falhas_b:list}}

{{#if verificacao_codigo_fatos}}
### Evidência de Teste / Fact-Checking
Detalhes da verificação executada:
{{detalhes_verificacao:textarea}}
{{/if}}

### Conclusão Decisiva (Resumo SxS)
{{conclusao_decisiva:textarea}}

---

# 6. Prompt & Golden Response

> [!NOTE]
> Use esta aba quando a task exigir **criar prompts desafiadores** (para induzir falha nos modelos) ou redigir uma **Golden Response / Ideal Response**.

Objetivo da Task: {{objetivo_task:select[Criar Prompt Desafiador (Induzir Erro / Split nos Modelos), Escrever Golden Response (Resposta Ideal Perfeita), Reescrever / Editar Resposta de Modelo (Turn Editing)]}}
Categoria / Domínio: {{dominio:text}}
Persona ou Contexto do Usuário: {{contexto_usuario:textarea}}

### Restrições do Prompt (Constraints)
Requisitos Obrigatórios (Positive Constraints):
{{requisitos_obrigatorios:numbered_list}}

Restrições Negativas (O que NÃO fazer):
{{restricoes_negativas:list}}

Formato de Saída Exigido: {{formato_saida:select[Markdown Estruturado, Apenas Código / JSON Puro, Tabela Comparativa, Lista Numerada com Limite de Palavras, Texto Corrido sem Bullet Points]}}

{{#if inclui_codigo_base}}
### Código ou Dados de Entrada Fornecidos no Prompt
{{codigo_entrada:code}}
{{/if}}

### Critérios da Rubrica / Armadilha Planejada
Por que este prompt é desafiador e o que avaliar na resposta ideal:
{{criterios_avaliacao:textarea}}
