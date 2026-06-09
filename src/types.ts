/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'patient' | 'family' | 'medical' | 'researcher' | 'caregiver' | null;

export type EmotionalState = 'sad' | 'anxious' | 'neutral' | 'calm' | 'peace' | 'motivated';

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  type: 'text' | 'audio';
  content: string;
  timestamp: Date;
  isLocked?: boolean;
}

export interface Photo {
  id: string;
  url: string;
  narrative?: string;
  storyForm?: string;
  category: 'Family' | 'Achievement' | 'Travel' | 'Love' | 'Other';
  includedInBook: boolean;
  date: Date;
}

export interface VisitRecord {
  id: string;
  date: Date;
  doctorName: string;
  duration: number;
  aiFaceAnalysis: string;
  manualEmotionScore: number;
  vitals: {
    respiratoryRate: number;
    heartRate: number;
    bloodPressure: string;
    spo2: number;
    temp: number;
    painLevel: number;
    consciousness: string;
    mobility: string;
  };
  medication: { name: string; dose: string }[];
  clinicalNotes: string;
  diagnosis: string;
  carePlan: string;
}

export interface ClinicalDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'word';
  uploadDate: Date;
  uploadedBy: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'important' | 'info';
  category: 'emotion' | 'silence' | 'vitals' | 'request' | 'family' | 'suicidal';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface PatientData {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  daysInCare: number;
  currentEmotionalState: EmotionalState;
  emotionHistory: { date: Date; state: EmotionalState }[];
  album: Photo[];
  messages: Message[];
  visits: VisitRecord[];
  clinicalHistory: ClinicalDocument[];
  alerts: Alert[];
}

export interface AppState {
  currentRole: Role;
  currentUser: User | null;
  patient: PatientData;
}

// ====================================================
// ALGORITHM TYPES — Módulo Acompañamiento Paliativo
// ====================================================

export type NeurologicalDisease =
  | 'parkinson' | 'ela' | 'alzheimer' | 'huntington' | 'esclerosis_multiple' | 'otra';

export type DiseaseStage = 'leve' | 'moderado' | 'avanzado' | 'terminal';

export type DepressionDiagnosis = 'tdm' | 'distimia' | 'subclinica' | 'sin_diagnostico';

export type DepressionSeverity = 'leve' | 'moderado' | 'grave' | 'psicotico';

export type DepressionEpisode = 'unico' | 'recurrente';

export type TherapeuticModality =
  | 'tcc' | 'logoterapia' | 'rogers' | 'gestalt' | 'trec' | 'mindfulness_act' | 'cognitiva_beck';

export type CaregiverBurnoutLevel = 'sin_burnout' | 'leve' | 'moderado' | 'severo';

export type SessionFrequency = 'semanal' | 'quincenal' | 'mensual';

export type SessionType = 'presencial' | 'virtual' | 'guiada_por_ia';

// Dimensión 1 — Clínica (DSM-5)
export interface ClinicalDimension {
  neurologicalDisease: NeurologicalDisease;
  diseaseStage: DiseaseStage;
  depressionDiagnosis: DepressionDiagnosis;
  depressionEpisode: DepressionEpisode;
  depressionSeverity: DepressionSeverity;
  psychiatricComorbidities: string[];  // 'ansiedad' | 'toc' | 'trastorno_personalidad' | 'ninguna'
  somaticSymptoms: string[];           // 'insomnio' | 'hipersomnia' | 'anorexia' | 'fatiga' | etc.
  currentMedication: string[];         // 'antidepresivos' | 'ansioliticos' | 'antipsicoticos' | etc.
}

// Dimensión 2 — Emocional (Escala ESAS adaptada)
export interface ESASAssessment {
  distressLevel: number;       // 0-10 nivel de angustia
  lonelinessLevel: number;     // 0-10 sensación de soledad
  deathFear: number;           // 0-10 miedo a la muerte
  lifeDesire: number;          // 0-10 sentido de vida (0=vacío existencial, 10=sentido claro)
  dailyMood: 1 | 2 | 3 | 4 | 5; // 1=muy mal, 5=muy bien
  emotionalTrend7Days: number; // promedio ponderado últimos 7 días
  suicidalIdeation: boolean;
  assessmentDate: Date;
}

// Dimensión 3 — Demográfica y contextual
export interface DemographicDimension {
  ageGroup: '18-35' | '36-55' | '56-70' | '71+';
  gender: 'masculino' | 'femenino' | 'no_binario' | 'prefiere_no_decir';
  livingEnvironment: 'hogar_familiar' | 'hogar_unipersonal' | 'clinica' | 'residencia_geriatrica';
  socioeconomicLevel: 'estrato_1_2' | 'estrato_3_4' | 'estrato_5_6';
  educationLevel: 'sin_escolaridad' | 'primaria' | 'secundaria' | 'universitario' | 'posgrado';
  religiosity: 'alta' | 'media' | 'baja' | 'sin_creencia';
  nativeLanguage: 'español' | 'ingles' | 'portugues' | 'frances' | 'lengua_indigena' | 'otro';
}

// Dimensión 4 — Relacional (el cuidador como actor clave)
export interface RelationalDimension {
  caregiverType: 'familiar_directo' | 'profesional' | 'voluntario' | 'sin_cuidador';
  contactFrequency: '24_7' | 'visitas_diarias' | 'visitas_semanales' | 'esporadico';
  caregiverBurnout: CaregiverBurnoutLevel;
  caregiverSignals: string[];      // señales observadas en el paciente
  caregiverSelfSignals: string[];  // señales que detecta el cuidador en sí mismo
  relationshipQuality: 'muy_cercana' | 'cercana' | 'distante' | 'conflictiva';
  familySupportNetwork: 'extensa' | 'moderada' | 'minima' | 'sin_red';
}

// Dimensión 5 — Condición física
export interface PhysicalDimension {
  communicationAbility: 'verbal_fluida' | 'verbal_limitada' | 'solo_gestual' | 'sin_comunicacion_verbal';
  mobility: 'autonoma' | 'con_apoyo' | 'silla_de_ruedas' | 'postrado_en_cama';
  fineMotorControl: 'conservado' | 'parcialmente_conservado' | 'perdido';
  chronicPain: 'sin_dolor' | 'leve' | 'moderado' | 'severo';
  cognitiveCapacity: 'intacta' | 'levemente_deteriorada' | 'moderadamente_deteriorada' | 'severa';
}

// Perfil completo del paciente para el algoritmo
export interface PatientAlgorithmProfile {
  id: string;
  patientId: string;
  patientName: string;
  clinical: ClinicalDimension;
  emotional: ESASAssessment;
  demographic: DemographicDimension;
  relational: RelationalDimension;
  physical: PhysicalDimension;
  createdAt: Date;
  updatedAt: Date;
}

// Salida del algoritmo
export interface TherapeuticRecommendation {
  id: string;
  patientId: string;
  patientName: string;
  modality: TherapeuticModality;
  modalityName: string;
  scientificJustification: string;
  sessionFrequency: SessionFrequency;
  sessionType: SessionType;
  specificExercises: string[];
  caregiverGuide: string[];
  alertIndicators: string[];
  patientAxes: {
    axisA: string; // enfermedad + estadio
    axisB: string; // perfil depresivo DSM-5
    axisC: string; // perfil contextual
  };
  confidenceScore: number; // 0-100
  suicidalAlert: boolean;
  createdAt: Date;
  doctorReview?: {
    approved: boolean;
    adjustments: string;
    reviewedAt: Date;
    reviewedBy: string;
  };
}

// Paciente gestionado por el cuidador
export interface ManagedPatient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  neurologicalDisease: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: Date;
  source: 'manual' | 'supabase';
}

// Observación del cuidador
export interface CaregiverObservation {
  id: string;
  patientId: string;
  caregiverName: string;
  observationDate: Date;
  signals: string[];
  notes: string;
  zaritScore: number; // 0-88
  zaritCategory: CaregiverBurnoutLevel;
  emergencyAlert: boolean;
}
