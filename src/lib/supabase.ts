import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = (): boolean =>
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

// ====================================================
// TIPOS DE TABLAS EN SUPABASE
// ====================================================

export interface SupabasePatient {
  id: string;
  name: string;
  age: number;
  neurological_disease: string;
  disease_stage: string;
  depression_diagnosis: string;
  depression_severity: string;
  depression_episode: string;
  psychiatric_comorbidities: string[];
  somatic_symptoms: string[];
  current_medication: string[];
  age_group: string;
  gender: string;
  living_environment: string;
  socioeconomic_level: string;
  education_level: string;
  religiosity: string;
  caregiver_type: string;
  contact_frequency: string;
  caregiver_burnout: string;
  relationship_quality: string;
  family_support_network: string;
  communication_ability: string;
  mobility: string;
  fine_motor_control: string;
  chronic_pain: string;
  cognitive_capacity: string;
  distress_level: number;
  loneliness_level: number;
  death_fear: number;
  life_desire: number;
  daily_mood: number;
  emotional_trend_7days: number;
  suicidal_ideation: boolean;
  created_at: string;
}

export async function fetchSyntheticPatients(): Promise<SupabasePatient[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('synthetic_patients')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Supabase fetch error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function saveRecommendation(rec: {
  patient_id: string;
  patient_name: string;
  modality: string;
  modality_name: string;
  confidence_score: number;
  session_frequency: string;
  session_type: string;
  suicidal_alert: boolean;
  axis_a: string;
  axis_b: string;
  axis_c: string;
}): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { error } = await supabase.from('therapeutic_recommendations').insert([rec]);
  if (error) {
    console.error('Supabase insert error:', error.message);
    return false;
  }
  return true;
}

export async function saveCaregiverObservation(obs: {
  patient_id: string;
  caregiver_name: string;
  signals: string[];
  notes: string;
  zarit_score: number;
  zarit_category: string;
  emergency_alert: boolean;
}): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { error } = await supabase.from('caregiver_observations').insert([obs]);
  if (error) {
    console.error('Supabase insert error:', error.message);
    return false;
  }
  return true;
}
