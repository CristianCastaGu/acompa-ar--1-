# Plan de Implementación: Integración de IA Real en ACOMPAÑAR

El objetivo de este plan es reemplazar las funciones de Inteligencia Artificial que actualmente están simuladas ("mock") con llamadas reales a una API de IA, en este caso **Google Gemini**, utilizando la librería `@google/genai` que ya se encuentra instalada en el proyecto. Finalmente, prepararemos la aplicación para ser ejecutada y probada localmente.

> [!WARNING]
> **Requisito Crítico de Revisión**: Al integrar una API real de IA (Gemini) directamente en el frontend (React/Vite), necesitarás proporcionar una clave de API válida. Esto significa que la aplicación **ya no funcionará de forma 100% offline** para las funcionalidades que dependan del chat o análisis de imágenes, pues requerirán conexión a internet para comunicarse con los servidores de Google.

## Preguntas Abiertas

> [!IMPORTANT]
> 1. **Clave de API**: Para que la IA funcione, ¿cuentas con una clave de API de Google Gemini (Gemini API Key)? Será necesario agregarla en un archivo `.env`. Si no tienes una, te indicaré cómo obtenerla gratuitamente.
> 2. **Alcance de la IA**: El código actual simula casi toda la IA (Chat del paciente, Chat de la familia, Generación de cuentos/narrativas en el álbum, y Análisis visual médico). ¿Deseas que integremos llamadas reales de IA en **todos** estos módulos?

## Cambios Propuestos

---

### Servicios y Configuración

Crearemos un servicio centralizado para manejar todas las peticiones a la IA.

#### [NEW] `src/services/ai.ts`
- Se implementará un cliente utilizando `@google/genai`.
- Funciones propuestas:
  - `generateChatResponse(history, prompt, roleContext)`: Para los chats del paciente y familiar.
  - `generateImageNarrative(imageFile, context)`: Para narrar cuentos basados en fotos.
  - `analyzePatientEmotion(imageFile)`: Para el panel médico (análisis visual de expresión facial).

#### [MODIFY] `.env` y `vite-env.d.ts`
- Se configurará la variable `VITE_GEMINI_API_KEY` para que el cliente Vite exponga la llave al frontend de forma segura para desarrollo local.

---

### Módulos del Paciente

#### [MODIFY] `src/components/roles/patient/AIAssistant.tsx`
- Se eliminará el `setTimeout` mockeado.
- Se conectará el historial de mensajes al método de generación de texto del servicio de IA, proveyendo un contexto compasivo (system prompt) que defina su personalidad empática y de acompañamiento paliativo.

#### [MODIFY] `src/components/roles/patient/LifeAlbum.tsx`
- Se modificará el proceso de "Generar narrativa con IA" para enviar la foto y contexto al modelo multimodal de Gemini, devolviendo una historia o cuento personalizado basado en la imagen real y la nota del usuario.

---

### Módulo Familiar

#### [MODIFY] `src/components/roles/family/FamilySupportChat.tsx` (o equivalente)
- Se integrará el chat familiar para usar un contexto diferente, enfocado en orientación de cuidado paliativo y apoyo emocional, utilizando la misma infraestructura de IA que el paciente pero con un "system prompt" distinto.

---

### Módulo Médico

#### [MODIFY] `src/components/roles/medical/VisitRegistration.tsx`
- En la Sección 2 (Análisis visual con IA), la subida de imagen se enviará al modelo multimodal de Gemini para analizar la expresión facial y retornar un estimado de malestar emocional, reemplazando la respuesta estática quemada en código.

---

## Plan de Verificación

### Verificación Automática (Compilación)
- Ejecutar `npm install` para asegurar que las dependencias estén correctas.
- Ejecutar `npm run build` y `npm run lint` para validar que los tipos y cambios introducidos en la API de GenAI sean válidos con TypeScript.

### Verificación Manual (Local)
1. Iniciar el servidor local de desarrollo (`npm run dev`).
2. Entrar con el **Rol Paciente**, interactuar en el chat y verificar respuestas contextuales de la IA.
3. Entrar con el **Rol Médico**, simular una visita, subir una foto cualquiera y comprobar que el modelo retorna un análisis de expresión.
4. Confirmar que la estética, animaciones y fluidez de la app no se vean perjudicadas por los tiempos de respuesta asíncronos de la IA (se añadirán estados de carga UI/UX donde sea necesario).
