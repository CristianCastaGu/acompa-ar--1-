/**
 * Motor de Recomendación Terapéutica — ACOMPAÑAR
 * Algoritmo de Acompañamiento Paliativo
 * Base científica: DSM-5 + Manual de Psicoterapias (Rodríguez Morejón, 2019)
 */

import {
  PatientAlgorithmProfile,
  TherapeuticRecommendation,
  TherapeuticModality,
  SessionFrequency,
  SessionType,
} from '../types';

// ====================================================
// DATA CIENTÍFICA POR MODALIDAD TERAPÉUTICA
// ====================================================

const MODALITY_DATA: Record<
  TherapeuticModality,
  {
    name: string;
    justification: string;
    exercises: string[];
    caregiverGuide: string[];
    alertIndicators: string[];
  }
> = {
  tcc: {
    name: 'Terapia Cognitivo-Conductual (TCC)',
    justification:
      'Máxima evidencia empírica en depresión mayor (meta-análisis: 50-60% remisión). Reestructura pensamientos distorsionados sobre la enfermedad y fomenta conductas adaptativas. Criterios DSM-5: indicada en depresión grave con angustia intensa y capacidad cognitiva preservada.',
    exercises: [
      'Registro de pensamientos automáticos negativos (diario de cogniciones)',
      'Reestructuración cognitiva: identificar → cuestionar → reformular',
      'Activación conductual: programar actividades placenteras accesibles',
      'Técnica del semáforo: rojo (parar), amarillo (pensar), verde (actuar)',
    ],
    caregiverGuide: [
      'Reforzar verbalizaciones positivas del paciente sin exagerar',
      'No validar pensamientos catastrofistas; redirigir suavemente hacia evidencia',
      'Ayudar a completar el registro diario de actividades y pensamientos',
    ],
    alertIndicators: [
      'Incremento de pensamientos intrusivos reportados',
      'Rechazo sostenido a actividades programadas (>3 días)',
      'Verbalización de desesperanza absoluta sin variación',
    ],
  },
  logoterapia: {
    name: 'Logoterapia de Frankl',
    justification:
      'Diseñada para encontrar sentido en el sufrimiento extremo. Eficaz cuando el vacío existencial y el miedo a la muerte son predominantes. Viktor Frankl la fundamentó desde los campos de concentración: incluso en el sufrimiento máximo el ser humano puede elegir su actitud y encontrar sentido.',
    exercises: [
      'Diálogo socrático sobre el legado personal: "¿Qué dejas al mundo?"',
      'Técnica de desreflexión: redirigir atención del yo hacia el mundo y los otros',
      'Ejercicio de la "última carta": escribir lo que más importa expresar',
      'Revisión de vida: momentos de sentido, logro y conexión genuina',
    ],
    caregiverGuide: [
      'Invitar al paciente a contar historias significativas de su vida sin interrumpir',
      'Validar verbalmente que la vida del paciente ha tenido impacto e importancia',
      'Crear rituales de despedida significativos alineados con sus valores',
    ],
    alertIndicators: [
      'Expresiones de futilidad total ("nada tiene sentido, nunca lo tuvo")',
      'Rechazo a hablar del pasado o de personas significativas',
      'Aislamiento extremo incluso de personas muy queridas',
    ],
  },
  rogers: {
    name: 'Terapia Centrada en la Persona (Rogers)',
    justification:
      'Enfoque humanista que prioriza la escucha empática incondicional. Idóneo para adultos mayores con capacidad verbal conservada que necesitan ser escuchados y validados. Facilita la autoaceptación y la reconciliación personal en el cierre vital.',
    exercises: [
      'Escucha activa sin juzgar ni aconsejar: presencia plena',
      'Reflejo empático: "Lo que entiendo es que sientes..." (validación emocional)',
      'Exploración del yo real vs. ideal: reconciliación y autocompasión',
      'Narrativa libre: contar la propia historia en el propio orden y ritmo',
    ],
    caregiverGuide: [
      'Practicar escucha activa sin dar consejos no solicitados',
      'Validar todas las emociones del paciente sin minimizarlas ni exagerarlas',
      'Crear espacios de conversación sin interrupciones tecnológicas ni externas',
    ],
    alertIndicators: [
      'Mutismo prolongado (más de 2 días sin comunicación voluntaria)',
      'Rechazo explícito a la presencia del cuidador o familia cercana',
      'Expresiones repetidas de no ser comprendido por nadie',
    ],
  },
  gestalt: {
    name: 'Terapia Gestalt',
    justification:
      'Trabaja en el aquí y ahora integrando cuerpo, emoción y cognición. Permite expresión emocional no verbal. Especialmente eficaz en pacientes con limitación comunicativa parcial o emociones bloqueadas que no pueden articularse verbalmente.',
    exercises: [
      'Técnica de la silla vacía: diálogo con personas o situaciones pendientes',
      'Contacto con el cuerpo: "¿Dónde y cómo sientes esta emoción en tu cuerpo?"',
      'Expresión creativa: dibujo, música, movimiento según capacidad física',
      'Cierre de gestalts inconclusas: identificar y completar asuntos pendientes',
    ],
    caregiverGuide: [
      'Permitir la expresión emocional sin intentar calmarlo de inmediato',
      'Observar lenguaje no verbal y nombrarlo: "Veo que aprietas las manos..."',
      'Facilitar rituales de cierre y despedida con personas significativas',
    ],
    alertIndicators: [
      'Agitación psicomotora frecuente sin causa física identificable',
      'Expresión emocional desregulada o llanto inconsolable prolongado',
      'Quejas somáticas difusas (dolores, presiones) sin correlato médico claro',
    ],
  },
  trec: {
    name: 'Terapia Racional Emotiva de Conducta (TREC)',
    justification:
      'Modelo ABC de Ellis: identifica y debate creencias irracionales que generan sufrimiento innecesario. Complementa la TCC en perfiles de alta rumiación y pensamientos negativos recurrentes. Especialmente útil en depresión con episodios recurrentes.',
    exercises: [
      'Modelo ABC: Activador → Creencia → Consecuencia emocional (identificar cada paso)',
      'Debate de creencias: "¿Es esto REALMENTE verdad? ¿Qué evidencia tengo a favor y en contra?"',
      'Reestructuración de "deberías" rígidos a "preferiría" flexibles',
      'Imaginería racional emotiva: visualizar la situación con creencias funcionales',
    ],
    caregiverGuide: [
      'Cuando el paciente rumine, preguntar suavemente: "¿Qué tan probable es eso realmente?"',
      'Evitar reforzar pensamientos catastrofistas con acuerdo o sobreprotección',
      'Ayudar a enfocarse en lo que sí puede influenciar dentro de sus limitaciones',
    ],
    alertIndicators: [
      'Rumiación continua durante horas sin poder redirigir la atención',
      'Verbalizaciones frecuentes de culpa extrema o autocastigo',
      'Negación absoluta a considerar cualquier perspectiva alternativa',
    ],
  },
  mindfulness_act: {
    name: 'Mindfulness / ACT (Terapia de Aceptación y Compromiso)',
    justification:
      'Aceptación del sufrimiento sin evitación. Desarrolla flexibilidad psicológica y orienta la acción hacia valores, no hacia el control de síntomas. Especialmente eficaz en enfermedades crónicas donde el control total es imposible. Eficacia superior cuando hay ansiedad comórbida.',
    exercises: [
      'Meditación de atención plena: respiración consciente 5-10 min/día (adaptable a postración)',
      'Defusión cognitiva: "Tengo el pensamiento de que..." (distanciarse del pensamiento)',
      'Ejercicio de valores: "¿Qué importa realmente ahora mismo para mí?"',
      'Compromiso de acción: una pequeña acción alineada con valores hoy',
    ],
    caregiverGuide: [
      'Practicar respiración consciente junto al paciente (modelado)',
      'No intentar eliminar el sufrimiento; acompañarlo con presencia sin ansiedad',
      'Invitar al paciente a identificar qué aún le da sentido o pequeñas alegrías',
    ],
    alertIndicators: [
      'Evitación extrema de cualquier conversación sobre la enfermedad o el futuro',
      'Ansiedad anticipatoria intensa que interfiere con el sueño y la alimentación',
      'Resistencia absoluta y angustiada a cualquier forma de aceptación',
    ],
  },
  cognitiva_beck: {
    name: 'Terapia Cognitiva (Beck)',
    justification:
      'Aborda la triada cognitiva de Beck: visión negativa de sí mismo, del mundo y del futuro. Corrección mediante evidencia y experimentos conductuales. Eficaz en depresión moderada con red de apoyo familiar presente que puede participar activamente en los experimentos.',
    exercises: [
      'Registro de pensamientos disfuncionales (RPD): columna de triple entrada',
      'Prueba de realidad: diseñar experimentos conductuales para validar o refutar creencias',
      'Identificar distorsiones cognitivas: catastrofismo, generalización, filtro mental negativo',
      'Técnica de la flecha descendente: descubrir la creencia nuclear profunda',
    ],
    caregiverGuide: [
      'Participar activamente en los experimentos conductuales como co-observador',
      'Ofrecer retroalimentación positiva específica, concreta y genuina',
      'Ayudar a planificar actividades pequeñas que desafíen creencias negativas sobre sí mismo',
    ],
    alertIndicators: [
      'Generalizaciones extremas frecuentes ("siempre", "nunca", "todo está mal")',
      'Retiro social completo incluso de personas que el paciente quiere',
      'Creencias consolidadas de ser una carga o de inutilidad absoluta',
    ],
  },
};

// ====================================================
// MOTOR DE CLASIFICACIÓN — 3 EJES
// ====================================================

function buildAxes(profile: PatientAlgorithmProfile): { axisA: string; axisB: string; axisC: string } {
  const diseaseNames: Record<string, string> = {
    parkinson: 'Parkinson', ela: 'ELA (Esclerosis Lateral Amiotrófica)',
    alzheimer: 'Alzheimer', huntington: 'Huntington',
    esclerosis_multiple: 'Esclerosis Múltiple', otra: 'Otra enfermedad neurológica',
  };
  const stageNames: Record<string, string> = {
    leve: 'Estadio 1 — Leve', moderado: 'Estadio 2 — Moderado',
    avanzado: 'Estadio 3 — Avanzado', terminal: 'Estadio Terminal',
  };
  const depressionNames: Record<string, string> = {
    tdm: 'Trastorno de Depresión Mayor (TDM)',
    distimia: 'Distimia',
    subclinica: 'Depresión Subclínica',
    sin_diagnostico: 'Sin Diagnóstico Formal',
  };
  const severityNames: Record<string, string> = {
    leve: 'Leve (F32.0)', moderado: 'Moderado (F32.1)',
    grave: 'Grave (F32.2)', psicotico: 'Con características psicóticas (F32.3)',
  };

  const { clinical, demographic, relational, physical } = profile;

  return {
    axisA: `${diseaseNames[clinical.neurologicalDisease]} · ${stageNames[clinical.diseaseStage]}`,
    axisB: `${depressionNames[clinical.depressionDiagnosis]} · ${severityNames[clinical.depressionSeverity]} · Episodio ${clinical.depressionEpisode}`,
    axisC: `${demographic.ageGroup} años · Red ${relational.familySupportNetwork} · ${physical.communicationAbility.replace(/_/g, ' ')}`,
  };
}

// ====================================================
// MOTOR DE RECOMENDACIÓN — REGLAS BASADAS EN EVIDENCIA
// ====================================================

export function runAlgorithm(profile: PatientAlgorithmProfile): TherapeuticRecommendation {
  const { clinical, emotional, demographic, relational, physical } = profile;

  let modality: TherapeuticModality = 'tcc';
  let confidenceScore = 70;

  // Regla 1: Vacío existencial profundo + miedo intenso a la muerte → Logoterapia
  if (emotional.lifeDesire <= 3 && emotional.deathFear >= 7) {
    modality = 'logoterapia';
    confidenceScore = 92;
  }
  // Regla 2: Depresión grave + angustia alta + adulto joven/medio (18-55) → TCC
  else if (
    clinical.depressionSeverity === 'grave' &&
    emotional.distressLevel >= 7 &&
    (demographic.ageGroup === '18-35' || demographic.ageGroup === '36-55')
  ) {
    modality = 'tcc';
    confidenceScore = 90;
  }
  // Regla 3: Comunicación verbal limitada o solo gestual → Gestalt
  else if (
    physical.communicationAbility === 'verbal_limitada' ||
    physical.communicationAbility === 'solo_gestual'
  ) {
    modality = 'gestalt';
    confidenceScore = 86;
  }
  // Regla 4: Depresión + ansiedad comórbida + apertura espiritual → Mindfulness/ACT
  else if (
    clinical.psychiatricComorbidities.includes('ansiedad') &&
    demographic.religiosity !== 'sin_creencia' &&
    emotional.distressLevel >= 5
  ) {
    modality = 'mindfulness_act';
    confidenceScore = 83;
  }
  // Regla 5: Depresión leve-moderada + adulto mayor (56+) + comunicación fluida → Rogers
  else if (
    (clinical.depressionSeverity === 'leve' || clinical.depressionSeverity === 'moderado') &&
    (demographic.ageGroup === '56-70' || demographic.ageGroup === '71+') &&
    physical.communicationAbility === 'verbal_fluida'
  ) {
    modality = 'rogers';
    confidenceScore = 81;
  }
  // Regla 6: Episodio recurrente + angustia moderada-alta + capacidad cognitiva preservada → TREC
  else if (
    clinical.depressionEpisode === 'recurrente' &&
    emotional.distressLevel >= 6 &&
    physical.cognitiveCapacity !== 'severa'
  ) {
    modality = 'trec';
    confidenceScore = 78;
  }
  // Regla 7: Depresión moderada + red de apoyo familiar presente → Terapia Cognitiva Beck
  else if (
    (clinical.depressionSeverity === 'leve' || clinical.depressionSeverity === 'moderado') &&
    (relational.familySupportNetwork === 'extensa' || relational.familySupportNetwork === 'moderada')
  ) {
    modality = 'cognitiva_beck';
    confidenceScore = 76;
  }
  // Default: TCC — mayor evidencia empírica general
  else {
    modality = 'tcc';
    confidenceScore = 70;
  }

  // Frecuencia de sesiones según gravedad
  let sessionFrequency: SessionFrequency;
  if (
    clinical.depressionSeverity === 'grave' ||
    clinical.depressionSeverity === 'psicotico' ||
    emotional.suicidalIdeation
  ) {
    sessionFrequency = 'semanal';
  } else if (clinical.depressionSeverity === 'moderado') {
    sessionFrequency = 'quincenal';
  } else {
    sessionFrequency = 'mensual';
  }

  // Tipo de sesión según capacidad física
  let sessionType: SessionType;
  if (
    physical.mobility === 'postrado_en_cama' ||
    physical.communicationAbility === 'sin_comunicacion_verbal'
  ) {
    sessionType = 'guiada_por_ia';
  } else if (
    relational.livingEnvironment === 'hogar_familiar' &&
    clinical.depressionSeverity !== 'grave'
  ) {
    sessionType = 'virtual';
  } else {
    sessionType = 'presencial';
  }

  const data = MODALITY_DATA[modality];
  const axes = buildAxes(profile);

  return {
    id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    patientId: profile.patientId,
    patientName: profile.patientName,
    modality,
    modalityName: data.name,
    scientificJustification: data.justification,
    sessionFrequency,
    sessionType,
    specificExercises: data.exercises,
    caregiverGuide: data.caregiverGuide,
    alertIndicators: data.alertIndicators,
    patientAxes: axes,
    confidenceScore,
    suicidalAlert: emotional.suicidalIdeation,
    createdAt: new Date(),
  };
}

// ====================================================
// PUNTUACIÓN ZARIT — Evaluación burnout del cuidador
// ====================================================

export function calcZaritCategory(score: number): 'sin_burnout' | 'leve' | 'moderado' | 'severo' {
  if (score <= 22) return 'sin_burnout';
  if (score <= 46) return 'leve';
  if (score <= 56) return 'moderado';
  return 'severo';
}

export function getZaritRecommendation(category: string): string {
  const recommendations: Record<string, string> = {
    sin_burnout: 'El cuidador mantiene equilibrio. Continuar con apoyo preventivo y pausas regulares.',
    leve: 'Sobrecarga incipiente. Recomendar grupos de apoyo y respiro periódico (2-3 horas/día sin rol de cuidador).',
    moderado: 'Sobrecarga moderada. Intervención psicológica recomendada para el cuidador. Evaluar apoyo adicional de familia o profesional.',
    severo: 'Sobrecarga severa. Requiere intervención urgente. Evaluar relevo de cuidado, apoyo profesional intensivo y atención médica del cuidador.',
  };
  return recommendations[category] ?? '';
}
