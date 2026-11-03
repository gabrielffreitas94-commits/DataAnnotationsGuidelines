export const guidelineEsES = `# 1. Visión General y Flujo

> [!IMPORTANT]
> En la evaluación de IA (RLHF / DataAnnotation), **las instrucciones específicas del proyecto siempre prevalecen** sobre cualquier directriz general. Revisa el documento de instrucciones actualizado antes de poner en marcha el temporizador.

## Flujo Estándar de Ejecución (Paso a Paso)
- [ ] **1. Lectura de Instrucciones y Novedades**: Comprobar si ha habido cambios recientes en la guía del proyecto, en las penalizaciones de la rúbrica o en el alcance del prompt.
- [ ] **2. Iniciar Temporizador (Task Timer)**: Activar el cronómetro en la barra superior y en la plataforma para controlar tu RPH (Rate Per Hour).
- [ ] **3. Desglose del Prompt**: Identificar la petición central, las restricciones explícitas (positivas y negativas), el formato exigido y el tono/rol.
- [ ] **4. Evaluación Individual (Modelo A y Modelo B)**: Evaluar cada respuesta por separado frente a la rúbrica antes de compararlas lado a lado (SxS).
- [ ] **5. Verificación Factual y Ejecución de Código**: Ejecutar todo el código en un entorno aislado y contrastar los datos con fuentes primarias fiables.
- [ ] **6. Redacción del Rationale SxS**: Redactar una justificación concisa y objetiva citando pruebas concretas de ambos modelos y el motivo decisivo de la elección.

## Reglas de Oro de Calidad
- **Evidencia Específica > Opinión Genérica**: Nunca escribas únicamente *"El Modelo A es más claro y completo"*. Especifica qué requisito exacto se ha cumplido o qué dato/línea ha fallado en el Modelo B.
- **Cero Uso de LLM en Justificaciones**: Jamás utilices IA para redactar tus justificaciones (rationales) o evaluaciones. Escribe siempre con tus propias palabras.
- **Control Honesto del Tiempo**: Pausa el temporizador si necesitas ausentarte y mantente dentro del tiempo máximo asignado a la tarea.

---

# 2. Rúbricas y Dimensiones

> [!TIP]
> Un fallo grave en **Seguridad**, **Veracidad (Alucinación)** o **Seguimiento de Instrucciones** casi siempre supera cualquier ventaja meramente estilística o de formato.

## Matriz de Gravedad de Errores
| Dimensión | Sin Problemas (No Issues) | Error Leve (Minor Issue) | Error Grave / Crítico (Major / Critical) |
| :--- | :--- | :--- | :--- |
| **Instruction Following (IF)** | Cumple todas las restricciones positivas y negativas tal como se solicita. | Ligera desviación de formato o recuento de palabras próximo al límite (~5%). | Ignora una restricción explícita, incluye un elemento prohibido o altera el formato exigido. |
| **Factuality / Truthfulness** | 100% preciso, verificable y sin afirmaciones infundadas. | Imprecisión trivial en un detalle secundario que no altera la respuesta central. | Alucinación factual, cita inventada, fecha/fórmula errónea o afirmación falsa en el punto principal. |
| **Coding & Logic** | El código se ejecuta a la primera, contempla casos límite y sigue buenas prácticas. | Advertencia leve de linter, variable no utilizada o falta de comentario opcional. | Error de sintaxis/ejecución, fallo lógico, vulnerabilidad de seguridad o librería/método inexistente. |
| **Completeness & Depth** | Aborda todas las partes del prompt con la profundidad adecuada. | Omite un detalle complementario útil pero responde a la cuestión principal. | Deja una parte explícita del prompt sin responder o ofrece una respuesta superficial/incompleta. |
| **Style, Tone & Formatting** | Tono adecuado, lectura fluida, Markdown limpio y bien estructurado. | Ligera repetición o introducción/conclusión excesivamente prolija. | Bloque de texto ilegible, tono condescendiente, rechazo falso (false refusal) o diseño roto. |

## Jerarquía de Decisión Side-by-Side (SxS)
- [ ] **Seguridad y Rechazos Falsos**: ¿Alguno de los modelos ha generado contenido inseguro o ha rechazado un prompt benigno sin motivo?
- [ ] **Seguimiento de Instrucciones (IF)**: ¿Alguno ha incumplido una restricción explícita o negativa (p. ej., "no uses listas", "responde solo en JSON")?
- [ ] **Veracidad y Ejecución**: ¿Alguno ha alucinado datos, APIs inexistentes o ha generado código que falla al ejecutarse?
- [ ] **Utilidad y Formato (Desempate)**: Si ambos han cumplido todo lo anterior, ¿cuál ha sido más directo, claro y útil para el usuario?

---

# 3. Coding y STEM

> [!WARNING]
> **Nunca confíes solo en la revisión visual del código.** Los modelos suelen inventar parámetros de funciones, métodos de librerías o fallar en casos límite sutiles. ¡Ejecuta siempre el código!

## Checklist de Evaluación de Código
- [ ] **Ejecución Real**: Copiar y ejecutar el código del Modelo A y del Modelo B en un entorno local/sandbox con la versión correcta del lenguaje.
- [ ] **Comprobación de Imports y APIs**: Confirmar que todas las librerías, paquetes y métodos existen realmente y no están obsoletos ni inventados.
- [ ] **Restricciones Técnicas**: Comprobar si el modelo ha utilizado el lenguaje, la firma de función, las estructuras de datos y la complejidad (Big-O) exigidos.
- [ ] **Prueba de Casos Límite (Edge Cases)**: Probar entradas vacías (\`null\`, \`[]\`, \`""\`), números negativos/cero, valores límite y grandes volúmenes de datos.
- [ ] **Seguridad y Buenas Prácticas**: Revisar fugas de recursos, inyección SQL, XSS, credenciales incrustadas o mutación indebida de estado.
- [ ] **Fidelidad de la Explicación**: Comprobar que la explicación que acompaña al código se corresponde exactamente con su implementación.

## Checklist de Matemáticas, Lógica y STEM
- [ ] **Desarrollo vs Resultado Final**: Un resultado final correcto obtenido mediante pasos intermedios erróneos debe penalizarse en Lógica/Razonamiento.
- [ ] **Unidades y Redondeo**: Revisar conversiones de unidades (SI vs Imperial), cifras significativas y decimales solicitados.
- [ ] **Verificación Independiente**: Resolver el problema de forma independiente o validarlo con un script en Python (\`sympy\` / \`numpy\`) antes de puntuar.

\`\`\`text
Ejemplo de evidencia técnica para Rationale de Código:
"El Modelo A se ejecuta sin errores y gestiona correctamente los arrays vacíos en la línea 14. El Modelo B lanza un TypeError: Cannot read properties of undefined al recibir un array vacío e inventa el método Array.prototype.flatMapAsync()."
\`\`\`

---

# 4. Fact-Checking y Safety

> [!CAUTION]
> **Prohibido fiarse de la memoria o de otro LLM como única fuente.** Toda afirmación factual (nombres, fechas, estadísticas, eventos, leyes, artículos científicos) debe contrastarse en Google / fuentes oficiales.

## Checklist de Verificación de Hechos (Fact-Checking)
- [ ] **Extraer Afirmaciones Verificables**: Identificar nombres propios, fechas, lugares, estadísticas, citas textuales, URLs y referencias bibliográficas.
- [ ] **Comprobar URLs y DOIs**: Abrir todos los enlaces facilitados — los LLMs fabrican a menudo URLs de apariencia verosímil (error 404 o páginas sin relación).
- [ ] **Auditar Citas y Autoría**: Confirmar que la obra o cita pertenece realmente al autor mencionado y al año de publicación indicado.
- [ ] **Detectar Alucinaciones Combinadas**: Comprobar que el modelo no haya mezclado hechos reales de dos entidades o sucesos distintos en una misma frase.
- [ ] **Coherencia Temporal**: Respetar la fecha de corte (knowledge cutoff) o el marco temporal exigido por el prompt.

## Checklist de Seguridad, PII y Neutralidad
- [ ] **Datos Personales (PII)**: Garantizar que ni el prompt ni las respuestas expongan DNI/NIF, teléfonos privados, correos personales o direcciones reales de particulares.
- [ ] **Tono Neutral en Temas Sensibles**: En cuestiones abiertas o controvertidas, el modelo debe exponer distintas perspectivas sin tomar partido cuando no se le solicita.
- [ ] **Detección de False Refusal**: Penalizar a los modelos que sermonean al usuario o rechazan peticiones seguras (p. ej., ciberseguridad defensiva, ficción inofensiva, dudas médicas educativas).

---

# 5. Rationale SxS

> [!TIP]
> Utiliza este generador interactivo para estructurar tu justificación **Side-by-Side (SxS)** de manera clara, objetiva y alineada con los estándares de auditoría de DataAnnotation.

## Estructura Recomendada de Rationale
1. **Veredicto inicial directo**: Empieza indicando qué modelo es mejor y en qué medida.
2. **Análisis del Modelo A y Modelo B**: Aporta pruebas concretas (instrucciones cumplidas/incumplidas, datos o comportamiento del código).
3. **Criterio decisivo**: Explica claramente por qué las ventajas del ganador superan al otro modelo.

Ganador y Nivel de Preferencia: {{preferencia:select[El Modelo A es mucho mejor (Much Better), El Modelo A es mejor (Better), El Modelo A es ligeramente mejor (Slightly Better), Empate (About the Same), El Modelo B es ligeramente mejor (Slightly Better), El Modelo B es mejor (Better), El Modelo B es mucho mejor (Much Better)]}}
Categoría de la Tarea: {{tipo_tarea:select[Instrucciones Generales / Redacción, Coding / Debugging, STEM / Matemáticas, Fact-Checking / Investigación, Red-Teaming / Safety]}}

### Análisis del Modelo A
Puntos Fuertes del Modelo A:
{{puntos_fuertes_a:list}}

Fallos / Problemas del Modelo A:
{{fallos_a:list}}

### Análisis del Modelo B
Puntos Fuertes del Modelo B:
{{puntos_fuertes_b:list}}

Fallos / Problemas del Modelo B:
{{fallos_b:list}}

{{#if verificacion_codigo_hechos}}
### Evidencia de Prueba / Fact-Checking
Detalles de la comprobación realizada:
{{detalles_verificacion:textarea}}
{{/if}}

### Conclusión Decisiva (Resumen SxS)
{{conclusion_decisiva:textarea}}

---

# 6. Prompt y Golden Response

> [!NOTE]
> Utiliza esta pestaña cuando la tarea requiera **diseñar prompts desafiantes** (para inducir fallos en los modelos) o redactar una **Golden Response / Respuesta Ideal**.

Objetivo de la Tarea: {{objetivo_tarea:select[Crear Prompt Desafiante (Inducir Fallo / Split en Modelos), Escribir Golden Response (Respuesta Ideal), Reescribir / Editar Respuesta (Turn Editing)]}}
Categoría / Dominio: {{dominio:text}}
Perfil o Contexto del Usuario: {{contexto_usuario:textarea}}

### Restricciones del Prompt (Constraints)
Requisitos Obligatorios (Positive Constraints):
{{requisitos_obligatorios:numbered_list}}

Restricciones Negativas (Qué NO hacer):
{{restricciones_negativas:list}}

Formato de Salida Exigido: {{formato_salida:select[Markdown Estructurado, Solo Código / JSON Puro, Tabla Comparativa, Lista Numerada con Límite de Palabras, Texto Corrido sin Viñetas]}}

{{#if incluye_codigo_base}}
### Código o Datos de Entrada en el Prompt
{{codigo_entrada:code}}
{{/if}}

### Criterios de la Rúbrica / Trampa Planificada
Por qué este prompt resulta desafiante y qué evaluar en la respuesta ideal:
{{criterios_evaluacion:textarea}}
`;
