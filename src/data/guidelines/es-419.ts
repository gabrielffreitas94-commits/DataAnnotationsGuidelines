export const guidelineEs419 = `# 1. Resumen y Flujo

> [!IMPORTANT]
> En la evaluación de IA (RLHF / DataAnnotation), **las instrucciones específicas del proyecto siempre tienen prioridad** sobre cualquier guía general. Lee el documento actualizado del proyecto antes de iniciar el cronómetro.

## Flujo Estándar de Ejecución (Paso a Paso)
- [ ] **1. Lectura de Instrucciones y Cambios**: Revisar si hubo actualizaciones recientes en la guía del proyecto, penalizaciones de rúbrica o alcance del prompt.
- [ ] **2. Iniciar Cronómetro (Task Timer)**: Activar el temporizador en la barra superior y en la plataforma para controlar tu RPH (Rate Per Hour).
- [ ] **3. Desglose del Prompt**: Identificar la tarea principal, restricciones explícitas (positivas y negativas), formato requerido y tono/persona.
- [ ] **4. Evaluación Individual (Modelo A y Modelo B)**: Evaluar cada respuesta por separado según la rúbrica antes de compararlas lado a lado (SxS).
- [ ] **5. Verificación de Hechos y Ejecución de Código**: Ejecutar todo el código en un entorno aislado y verificar datos en fuentes primarias confiables.
- [ ] **6. Redacción del Rationale SxS**: Escribir una justificación concisa y objetiva citando evidencia concreta de ambos modelos y el criterio decisivo.

## Reglas de Oro de Calidad
- **Evidencia Específica > Opinión Genérica**: Nunca escribas solo *"El Modelo A es más claro y completo"*. Indica exactamente qué restricción se cumplió o qué dato/línea falló en el Modelo B.
- **Cero Uso de LLM en Justificaciones**: Jamás uses IA para redactar tus justificaciones (rationales) o evaluaciones. Escribe siempre con tus propias palabras.
- **Registro de Tiempo Honesto**: Pausa el cronómetro si necesitas ausentarte y respeta el tiempo máximo estimado por tarea.

---

# 2. Rúbricas y Dimensiones

> [!TIP]
> Una falla grave en **Seguridad**, **Veracidad (Alucinación)** o **Seguimiento de Instrucciones** casi siempre pesa más que ventajas meramente estilísticas o de formato.

## Matriz de Severidad de Errores
| Dimensión | Sin Problemas (No Issues) | Error Menor (Minor Issue) | Error Grave / Crítico (Major / Critical) |
| :--- | :--- | :--- | :--- |
| **Instruction Following (IF)** | Cumple todas las restricciones positivas y negativas exactamente como se pidió. | Desviación leve de formato o conteo de palabras cercano al límite (~5%). | Ignora una restricción explícita, incluye un elemento prohibido o cambia el formato solicitado. |
| **Factuality / Truthfulness** | 100% preciso, verificable y sin afirmaciones sin respaldo. | Imprecisión trivial en un detalle secundario que no altera la respuesta central. | Alucinación factual, cita inventada, fecha/fórmula errónea o dato falso en el punto central. |
| **Coding & Logic** | El código corre a la primera, maneja casos borde y sigue buenas prácticas. | Advertencia menor de linter, variable no usada o falta de comentario opcional. | Error de sintaxis/ejecución, bug lógico, falla de seguridad o librería/método inventado. |
| **Completeness & Depth** | Aborda todas las partes del prompt con la profundidad adecuada. | Omite un detalle complementario útil pero responde la pregunta principal. | Deja una parte explícita del prompt sin responder o entrega una respuesta superficial/incompleta. |
| **Style, Tone & Formatting** | Tono adecuado, lectura fluida, Markdown limpio y bien estructurado. | Leve repetición o introducción/conclusión demasiado extensa. | Bloque de texto ilegible, tono condescendiente, rechazo falso (false refusal) o formato roto. |

## Jerarquía de Decisión Side-by-Side (SxS)
- [ ] **Seguridad y Rechazos Falsos**: ¿Alguno de los modelos generó contenido inseguro o rechazó un prompt benigno sin motivo?
- [ ] **Seguimiento de Instrucciones (IF)**: ¿Alguno violó una restricción explícita o negativa (ej. "no uses viñetas", "responde solo en JSON")?
- [ ] **Veracidad y Ejecución**: ¿Alguno alucinó datos, APIs inexistentes o entregó código que no funciona?
- [ ] **Utilidad y Formato (Desempate)**: Si ambos cumplieron todo lo anterior, ¿cuál fue más directo, claro y útil para el usuario?

---

# 3. Coding y STEM

> [!WARNING]
> **Nunca confíes solo en la inspección visual del código.** Los modelos suelen alucinar parámetros, métodos de librerías o fallar en casos borde sutiles. ¡Ejecuta siempre el código!

## Checklist de Evaluación de Código
- [ ] **Ejecución Real**: Copiar y correr el código del Modelo A y del Modelo B en un entorno local/sandbox con la versión correcta del lenguaje.
- [ ] **Verificación de Imports y APIs**: Confirmar que todas las librerías, paquetes y métodos existan realmente y no estén obsoletos o inventados.
- [ ] **Restricciones Técnicas**: Revisar si el modelo respetó el lenguaje, firma de función, estructuras de datos y complejidad (Big-O) solicitados.
- [ ] **Prueba de Casos Borde (Edge Cases)**: Probar entradas vacías (\`null\`, \`[]\`, \`""\`), números negativos/cero, valores límite y volúmenes grandes.
- [ ] **Seguridad y Buenas Prácticas**: Revisar fugas de recursos, SQL Injection, XSS, credenciales fijas en código o mutación indebida de estado.
- [ ] **Precisión de la Explicación**: Verificar que la explicación posterior coincida exactamente con lo que hace el código.

## Checklist de Matemáticas, Lógica y STEM
- [ ] **Paso a Paso vs Resultado Final**: Un resultado final correcto obtenido con pasos intermedios erróneos debe penalizarse en Lógica/Razonamiento.
- [ ] **Unidades y Redondeo**: Revisar conversiones de unidades (SI vs Imperial), cifras significativas y decimales solicitados.
- [ ] **Verificación Independiente**: Resolver la ecuación por separado o validar con un script en Python (\`sympy\` / \`numpy\`) antes de calificar.

\`\`\`text
Ejemplo de evidencia técnica para Rationale de Código:
"El Modelo A se ejecuta sin errores y maneja arreglos vacíos en la línea 14. El Modelo B falla con TypeError: Cannot read properties of undefined al recibir un arreglo vacío y alucina el método Array.prototype.flatMapAsync()."
\`\`\`

---

# 4. Fact-Checking y Safety

> [!CAUTION]
> **Prohibido confiar en la memoria o en otro LLM como única fuente.** Toda afirmación factual (nombres, fechas, estadísticas, eventos, leyes, artículos) debe verificarse en Google / fuentes oficiales.

## Checklist de Verificación de Hechos (Fact-Checking)
- [ ] **Identificar Afirmaciones Verificables**: Listar nombres propios, fechas, lugares, estadísticas, citas textuales, URLs y referencias.
- [ ] **Revisar URLs y DOIs**: Abrir todos los enlaces proporcionados — los LLMs suelen inventar URLs con apariencia creíble (error 404 o contenido distinto).
- [ ] **Auditar Citas y Autoría**: Confirmar que la obra o frase realmente pertenezca al autor citado y al año indicado.
- [ ] **Detectar Alucinaciones Mezcladas**: Verificar que el modelo no haya combinado datos reales de dos personas o eventos distintos en una misma oración.
- [ ] **Consistencia Temporal**: Respetar la fecha de corte (knowledge cutoff) o el contexto temporal exigido en el prompt.

## Checklist de Seguridad, PII y Neutralidad
- [ ] **Datos Personales (PII)**: Asegurar que ni el prompt ni las respuestas expongan identificaciones privadas, teléfonos, correos personales o direcciones reales.
- [ ] **Tono Neutral en Temas Sensibles**: En temas abiertos o controvertidos, el modelo debe presentar múltiples perspectivas sin tomar partido si no se le pide.
- [ ] **Detección de False Refusal**: Penalizar modelos que sermonean al usuario o rechazan solicitudes seguras (ej. ciberseguridad defensiva, ficción inofensiva, consultas médicas educativas).

---

# 5. Rationale SxS

> [!TIP]
> Usa este generador interactivo para estructurar tu justificación **Side-by-Side (SxS)** de forma clara, objetiva y alineada con los estándares de auditoría de DataAnnotation.

## Estructura Recomendada de Rationale
1. **Veredicto inicial directo**: Comienza indicando qué modelo es mejor y en qué grado.
2. **Análisis del Modelo A y Modelo B**: Cita evidencia específica (instrucciones cumplidas/violadas, hechos o comportamiento del código).
3. **Criterio decisivo**: Explica por qué las ventajas del modelo ganador superan al otro.

Ganador y Nivel de Preferencia: {{preferencia:select[El Modelo A es mucho mejor (Much Better), El Modelo A es mejor (Better), El Modelo A es ligeramente mejor (Slightly Better), Empate (About the Same), El Modelo B es ligeramente mejor (Slightly Better), El Modelo B es mejor (Better), El Modelo B es mucho mejor (Much Better)]}}
Categoría de la Tarea: {{tipo_tarea:select[Instrucciones Generales / Redacción, Coding / Debugging, STEM / Matemáticas, Fact-Checking / Investigación, Red-Teaming / Safety]}}

### Análisis del Modelo A
Fortalezas del Modelo A:
{{fortalezas_a:list}}

Fallas / Problemas del Modelo A:
{{fallas_a:list}}

### Análisis del Modelo B
Fortalezas del Modelo B:
{{fortalezas_b:list}}

Fallas / Problemas del Modelo B:
{{fallas_b:list}}

{{#if verificacion_codigo_hechos}}
### Evidencia de Prueba / Fact-Checking
Detalles de la verificación realizada:
{{detalles_verificacion:textarea}}
{{/if}}

### Conclusión Decisiva (Resumen SxS)
{{conclusion_decisiva:textarea}}

---

# 6. Prompt y Golden Response

> [!NOTE]
> Usa esta pestaña cuando la tarea requiera **crear prompts desafiantes** (para inducir errores en los modelos) o redactar una **Golden Response / Respuesta Ideal**.

Objetivo de la Tarea: {{objetivo_tarea:select[Crear Prompt Desafiante (Inducir Fallo / Split en Modelos), Escribir Golden Response (Respuesta Ideal), Reescribir / Editar Respuesta (Turn Editing)]}}
Categoría / Dominio: {{dominio:text}}
Persona o Contexto del Usuario: {{contexto_usuario:textarea}}

### Restricciones del Prompt (Constraints)
Requisitos Obligatorios (Positive Constraints):
{{requisitos_obligatorios:numbered_list}}

Restricciones Negativas (Qué NO hacer):
{{restricciones_negativas:list}}

Formato de Salida Requerido: {{formato_salida:select[Markdown Estructurado, Solo Código / JSON Puro, Tabla Comparativa, Lista Numerada con Límite de Palabras, Texto Corrido sin Viñetas]}}

{{#if incluye_codigo_base}}
### Código o Datos de Entrada en el Prompt
{{codigo_entrada:code}}
{{/if}}

### Criterios de Rúbrica / Trampa Planeada
Por qué este prompt es desafiante y qué evaluar en la respuesta ideal:
{{criterios_evaluacion:textarea}}
`;
