-- ============================================================
-- ACOMPAÑAR — Algoritmo de Acompañamiento Paliativo
-- Esquema Supabase + 50 perfiles sintéticos de entrenamiento
-- Hackathon UniSabana 2026 | Equipo Iron
-- ============================================================

-- ============================================================
-- TABLA 1: Perfiles sintéticos de pacientes (50 casos)
-- ============================================================
CREATE TABLE IF NOT EXISTS synthetic_patients (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                      TEXT NOT NULL,
  age                       INT NOT NULL,
  neurological_disease      TEXT NOT NULL,
  disease_stage             TEXT NOT NULL,
  depression_diagnosis      TEXT NOT NULL,
  depression_severity       TEXT NOT NULL,
  depression_episode        TEXT NOT NULL,
  psychiatric_comorbidities TEXT[] DEFAULT '{}',
  somatic_symptoms          TEXT[] DEFAULT '{}',
  current_medication        TEXT[] DEFAULT '{}',
  age_group                 TEXT NOT NULL,
  gender                    TEXT NOT NULL,
  living_environment        TEXT NOT NULL,
  socioeconomic_level       TEXT NOT NULL,
  education_level           TEXT NOT NULL,
  religiosity               TEXT NOT NULL,
  caregiver_type            TEXT NOT NULL,
  contact_frequency         TEXT NOT NULL,
  caregiver_burnout         TEXT NOT NULL,
  caregiver_signals         TEXT[] DEFAULT '{}',
  relationship_quality      TEXT NOT NULL,
  family_support_network    TEXT NOT NULL,
  communication_ability     TEXT NOT NULL,
  mobility                  TEXT NOT NULL,
  fine_motor_control        TEXT NOT NULL,
  chronic_pain              TEXT NOT NULL,
  cognitive_capacity        TEXT NOT NULL,
  distress_level            INT NOT NULL CHECK (distress_level BETWEEN 0 AND 10),
  loneliness_level          INT NOT NULL CHECK (loneliness_level BETWEEN 0 AND 10),
  death_fear                INT NOT NULL CHECK (death_fear BETWEEN 0 AND 10),
  life_desire               INT NOT NULL CHECK (life_desire BETWEEN 0 AND 10),
  daily_mood                INT NOT NULL CHECK (daily_mood BETWEEN 1 AND 5),
  emotional_trend_7days     NUMERIC(4,2) NOT NULL,
  suicidal_ideation         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at                TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA 2: Recomendaciones terapéuticas del algoritmo
-- ============================================================
CREATE TABLE IF NOT EXISTS therapeutic_recommendations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       TEXT NOT NULL,
  patient_name     TEXT NOT NULL,
  modality         TEXT NOT NULL,
  modality_name    TEXT NOT NULL,
  confidence_score INT NOT NULL,
  session_frequency TEXT NOT NULL,
  session_type     TEXT NOT NULL,
  suicidal_alert   BOOLEAN NOT NULL DEFAULT FALSE,
  axis_a           TEXT,
  axis_b           TEXT,
  axis_c           TEXT,
  doctor_approved  BOOLEAN DEFAULT NULL,
  doctor_notes     TEXT,
  reviewed_by      TEXT,
  reviewed_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA 3: Observaciones del cuidador
-- ============================================================
CREATE TABLE IF NOT EXISTS caregiver_observations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      TEXT NOT NULL,
  caregiver_name  TEXT NOT NULL,
  signals         TEXT[] DEFAULT '{}',
  notes           TEXT,
  zarit_score     INT NOT NULL CHECK (zarit_score BETWEEN 0 AND 88),
  zarit_category  TEXT NOT NULL,
  emergency_alert BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA 4: Evaluaciones ESAS del paciente
-- ============================================================
CREATE TABLE IF NOT EXISTS esas_assessments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id            TEXT NOT NULL,
  distress_level        INT NOT NULL CHECK (distress_level BETWEEN 0 AND 10),
  loneliness_level      INT NOT NULL CHECK (loneliness_level BETWEEN 0 AND 10),
  death_fear            INT NOT NULL CHECK (death_fear BETWEEN 0 AND 10),
  life_desire           INT NOT NULL CHECK (life_desire BETWEEN 0 AND 10),
  daily_mood            INT NOT NULL CHECK (daily_mood BETWEEN 1 AND 5),
  suicidal_ideation     BOOLEAN NOT NULL DEFAULT FALSE,
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 50 PERFILES SINTÉTICOS DE PACIENTES
-- ============================================================

INSERT INTO synthetic_patients (
  name, age, neurological_disease, disease_stage, depression_diagnosis, depression_severity, depression_episode,
  psychiatric_comorbidities, somatic_symptoms, current_medication,
  age_group, gender, living_environment, socioeconomic_level, education_level, religiosity,
  caregiver_type, contact_frequency, caregiver_burnout, caregiver_signals, relationship_quality, family_support_network,
  communication_ability, mobility, fine_motor_control, chronic_pain, cognitive_capacity,
  distress_level, loneliness_level, death_fear, life_desire, daily_mood, emotional_trend_7days, suicidal_ideation
) VALUES

-- CASOS PARKINSON (10 perfiles)
('Carlos Mendoza',        68, 'parkinson', 'moderado',  'tdm',          'grave',    'recurrente',  ARRAY['ansiedad'],    ARRAY['insomnio','fatiga'],       ARRAY['antidepresivos','ansioliticos'], '56-70', 'masculino', 'hogar_familiar',  'estrato_3_4', 'universitario',    'media', 'familiar_directo', '24_7',             'moderado', ARRAY['llanto_frecuente','aislamiento'],  'muy_cercana', 'moderada', 'verbal_fluida',   'con_apoyo',    'parcialmente_conservado', 'moderado', 'intacta',                         8, 7, 6, 3, 2, 2.8,  FALSE),
('Ana Sofía Gómez',       72, 'parkinson', 'avanzado',  'tdm',          'moderado', 'unico',       ARRAY['ninguna'],     ARRAY['hipersomnia','fatiga'],     ARRAY['antidepresivos'],               '71+',   'femenino', 'residencia_geriatrica', 'estrato_1_2', 'primaria',       'alta',  'profesional',      'visitas_diarias',  'leve',     ARRAY['aislamiento'],                    'cercana',     'minima',   'verbal_fluida',   'silla_de_ruedas','perdido',                 'severo',   'levemente_deteriorada',           6, 8, 4, 5, 2, 3.1,  FALSE),
('Ricardo Forero',        65, 'parkinson', 'leve',      'subclinica',   'leve',     'unico',       ARRAY['ninguna'],     ARRAY['insomnio'],                 ARRAY['sin_medicacion'],               '56-70', 'masculino', 'hogar_familiar',  'estrato_5_6', 'posgrado',         'baja',  'familiar_directo', '24_7',             'sin_burnout',ARRAY['sin_señales'],                    'muy_cercana', 'extensa',  'verbal_fluida',   'autonoma',     'conservado',              'sin_dolor','intacta',                         3, 3, 5, 7, 4, 4.2,  FALSE),
('Mercedes Ríos',         78, 'parkinson', 'terminal',  'tdm',          'grave',    'recurrente',  ARRAY['ansiedad'],    ARRAY['anorexia','fatiga','insomnio'], ARRAY['antidepresivos','ansioliticos','antipsicoticos'], '71+', 'femenino', 'clinica', 'estrato_1_2', 'primaria', 'alta', 'familiar_directo', '24_7', 'severo', ARRAY['llanto_frecuente','rechazo_comer','insomnio_visible'], 'cercana', 'moderada', 'verbal_limitada', 'postrado_en_cama', 'perdido', 'severo', 'moderadamente_deteriorada', 9, 9, 8, 1, 1, 1.2, FALSE),
('Hernán Castillo',       60, 'parkinson', 'leve',      'distimia',     'leve',     'recurrente',  ARRAY['ninguna'],     ARRAY['insomnio'],                 ARRAY['antidepresivos'],               '56-70', 'masculino', 'hogar_familiar',  'estrato_3_4', 'secundaria',       'media', 'familiar_directo', 'visitas_diarias',  'leve',     ARRAY['aislamiento'],                    'cercana',     'moderada', 'verbal_fluida',   'autonoma',     'conservado',              'leve',     'intacta',                         4, 5, 3, 6, 3, 3.5,  FALSE),
('Gloria Zambrano',       74, 'parkinson', 'avanzado',  'tdm',          'moderado', 'unico',       ARRAY['ansiedad'],    ARRAY['fatiga','hipersomnia'],     ARRAY['antidepresivos','ansioliticos'], '71+',   'femenino', 'hogar_familiar',  'estrato_1_2', 'sin_escolaridad',  'alta',  'familiar_directo', '24_7',             'moderado', ARRAY['llanto_frecuente','aislamiento'],  'muy_cercana', 'extensa',  'verbal_limitada', 'con_apoyo',    'perdido',                 'moderado', 'moderadamente_deteriorada',       7, 6, 5, 4, 2, 2.5,  FALSE),
('Pedro Salazar',         58, 'parkinson', 'moderado',  'tdm',          'moderado', 'recurrente',  ARRAY['toc'],         ARRAY['insomnio','agitacion'],     ARRAY['antidepresivos','antipsicoticos'],'56-70', 'masculino', 'hogar_unipersonal','estrato_3_4', 'universitario',   'sin_creencia', 'profesional', 'visitas_semanales', 'sin_burnout', ARRAY['aislamiento'], 'distante', 'minima', 'verbal_fluida', 'con_apoyo', 'parcialmente_conservado', 'leve', 'intacta', 7, 8, 4, 5, 2, 3.2, FALSE),
('Inés Morales',          70, 'parkinson', 'moderado',  'distimia',     'moderado', 'recurrente',  ARRAY['ansiedad'],    ARRAY['insomnio','anorexia'],      ARRAY['antidepresivos'],               '71+',   'femenino', 'hogar_familiar',  'estrato_1_2', 'primaria',         'alta',  'familiar_directo', '24_7',             'leve',     ARRAY['llanto_frecuente'],               'muy_cercana', 'extensa',  'verbal_fluida',   'con_apoyo',    'parcialmente_conservado', 'moderado', 'levemente_deteriorada',           5, 6, 6, 4, 3, 3.0,  FALSE),
('Arturo Bermúdez',       63, 'parkinson', 'leve',      'sin_diagnostico','leve',   'unico',       ARRAY['ninguna'],     ARRAY['sin_sintomas'],             ARRAY['sin_medicacion'],               '56-70', 'masculino', 'hogar_familiar',  'estrato_5_6', 'posgrado',         'media', 'familiar_directo', 'visitas_diarias',  'sin_burnout',ARRAY['sin_señales'],                    'muy_cercana', 'extensa',  'verbal_fluida',   'autonoma',     'conservado',              'sin_dolor','intacta',                         2, 2, 3, 8, 5, 4.7,  FALSE),
('Cecilia Pardo',         76, 'parkinson', 'avanzado',  'tdm',          'grave',    'recurrente',  ARRAY['ansiedad','toc'], ARRAY['insomnio','fatiga','anorexia'], ARRAY['antidepresivos','ansioliticos'], '71+', 'femenino', 'clinica', 'estrato_3_4', 'secundaria', 'alta', 'familiar_directo', '24_7', 'severo', ARRAY['llanto_frecuente','aislamiento','rechazo_comer'], 'muy_cercana', 'moderada', 'verbal_limitada', 'silla_de_ruedas', 'perdido', 'severo', 'levemente_deteriorada', 9, 8, 9, 2, 1, 1.5, FALSE),

-- CASOS ELA (10 perfiles)
('Julián Torres',         45, 'ela',       'avanzado',  'tdm',          'grave',    'unico',       ARRAY['ansiedad'],    ARRAY['fatiga','insomnio'],        ARRAY['antidepresivos','ansioliticos'], '36-55', 'masculino', 'hogar_familiar',  'estrato_3_4', 'universitario',    'baja',  'familiar_directo', '24_7',             'severo',   ARRAY['llanto_frecuente','aislamiento'],  'muy_cercana', 'moderada', 'verbal_limitada', 'silla_de_ruedas','parcialmente_conservado', 'severo',   'intacta',                         9, 8, 9, 2, 1, 1.4,  FALSE),
('Mónica Vargas',         38, 'ela',       'moderado',  'tdm',          'moderado', 'unico',       ARRAY['ansiedad'],    ARRAY['fatiga','hipersomnia'],     ARRAY['antidepresivos'],               '36-55', 'femenino', 'hogar_familiar',  'estrato_5_6', 'posgrado',         'sin_creencia', 'familiar_directo', '24_7', 'moderado', ARRAY['llanto_frecuente'], 'muy_cercana', 'extensa', 'verbal_fluida', 'con_apoyo', 'conservado', 'moderado', 'intacta', 7, 5, 8, 4, 2, 2.9, FALSE),
('Sebastián Cano',        52, 'ela',       'avanzado',  'tdm',          'grave',    'unico',       ARRAY['ninguna'],     ARRAY['fatiga','anorexia'],        ARRAY['antidepresivos'],               '36-55', 'masculino', 'clinica',         'estrato_1_2', 'secundaria',       'alta',  'familiar_directo', 'visitas_diarias',  'leve',     ARRAY['aislamiento'],                    'cercana',     'moderada', 'solo_gestual',    'postrado_en_cama','perdido',             'severo',   'intacta',                         8, 9, 7, 1, 1, 1.3,  FALSE),
('Adriana Muñoz',         41, 'ela',       'leve',      'subclinica',   'leve',     'unico',       ARRAY['ansiedad'],    ARRAY['insomnio'],                 ARRAY['ansioliticos'],                 '36-55', 'femenino', 'hogar_familiar',  'estrato_5_6', 'posgrado',         'media', 'familiar_directo', '24_7',             'sin_burnout',ARRAY['sin_señales'],                    'muy_cercana', 'extensa',  'verbal_fluida',   'autonoma',     'conservado',              'leve',     'intacta',                         5, 4, 6, 6, 3, 3.8,  FALSE),
('Rodrigo Ospina',        48, 'ela',       'avanzado',  'tdm',          'grave',    'recurrente',  ARRAY['ansiedad'],    ARRAY['insomnio','fatiga','anorexia'],ARRAY['antidepresivos','ansioliticos'], '36-55', 'masculino', 'hogar_familiar', 'estrato_3_4', 'universitario', 'media', 'familiar_directo', '24_7', 'severo', ARRAY['llanto_frecuente','rechazo_comer','aislamiento'], 'muy_cercana', 'extensa', 'verbal_limitada', 'silla_de_ruedas', 'perdido', 'severo', 'intacta', 10, 9, 8, 1, 1, 1.0, TRUE),
('Patricia Leal',         36, 'ela',       'leve',      'distimia',     'leve',     'recurrente',  ARRAY['ninguna'],     ARRAY['fatiga'],                   ARRAY['antidepresivos'],               '36-55', 'femenino', 'hogar_familiar',  'estrato_3_4', 'universitario',    'alta',  'familiar_directo', '24_7',             'leve',     ARRAY['aislamiento'],                    'muy_cercana', 'moderada', 'verbal_fluida',   'autonoma',     'conservado',              'leve',     'intacta',                         4, 5, 5, 5, 3, 3.4,  FALSE),
('Fernando Aguilar',      55, 'ela',       'moderado',  'tdm',          'moderado', 'unico',       ARRAY['ansiedad'],    ARRAY['fatiga','insomnio'],        ARRAY['antidepresivos','ansioliticos'], '36-55', 'masculino', 'hogar_familiar',  'estrato_3_4', 'universitario',    'baja',  'familiar_directo', '24_7',             'moderado', ARRAY['llanto_frecuente','aislamiento'],  'muy_cercana', 'moderada', 'verbal_fluida',   'con_apoyo',    'conservado',              'moderado', 'intacta',                         7, 6, 7, 4, 2, 2.7,  FALSE),
('Lucía Hernández',       43, 'ela',       'moderado',  'tdm',          'moderado', 'unico',       ARRAY['ninguna'],     ARRAY['hipersomnia','fatiga'],      ARRAY['antidepresivos'],               '36-55', 'femenino', 'hogar_familiar',  'estrato_1_2', 'secundaria',       'alta',  'familiar_directo', '24_7',             'leve',     ARRAY['llanto_frecuente'],               'cercana',     'extensa',  'verbal_fluida',   'con_apoyo',    'conservado',              'moderado', 'intacta',                         6, 5, 6, 5, 3, 3.1,  FALSE),
('Camilo Restrepo',       29, 'ela',       'leve',      'tdm',          'grave',    'unico',       ARRAY['ansiedad'],    ARRAY['insomnio','agitacion'],     ARRAY['antidepresivos','ansioliticos'], '18-35', 'masculino', 'hogar_familiar',  'estrato_5_6', 'universitario',    'sin_creencia', 'familiar_directo', '24_7', 'leve', ARRAY['llanto_frecuente'], 'muy_cercana', 'extensa', 'verbal_fluida', 'autonoma', 'conservado', 'sin_dolor', 'intacta', 9, 6, 7, 3, 1, 2.0, FALSE),
('Sandra Nieto',          50, 'ela',       'terminal',  'tdm',          'grave',    'recurrente',  ARRAY['ansiedad'],    ARRAY['anorexia','fatiga','insomnio'],ARRAY['antidepresivos','ansioliticos','antipsicoticos'], '36-55', 'femenino', 'clinica', 'estrato_1_2', 'primaria', 'alta', 'profesional', 'visitas_diarias', 'sin_burnout', ARRAY['aislamiento'], 'cercana', 'minima', 'sin_comunicacion_verbal', 'postrado_en_cama', 'perdido', 'severo', 'levemente_deteriorada', 8, 9, 6, 2, 1, 1.2, FALSE),

-- CASOS ALZHEIMER (15 perfiles)
('Beatriz Gutiérrez',     79, 'alzheimer', 'moderado',  'tdm',          'moderado', 'recurrente',  ARRAY['ansiedad'],    ARRAY['insomnio','agitacion'],     ARRAY['antidepresivos','antipsicoticos'],'71+',   'femenino', 'residencia_geriatrica', 'estrato_1_2', 'primaria', 'alta', 'familiar_directo', 'visitas_semanales', 'leve', ARRAY['aislamiento','insomnio_visible'], 'cercana', 'moderada', 'verbal_limitada', 'con_apoyo', 'parcialmente_conservado', 'leve', 'moderadamente_deteriorada', 6, 7, 4, 4, 2, 2.8, FALSE),
('Luis Arango',           82, 'alzheimer', 'avanzado',  'distimia',     'moderado', 'recurrente',  ARRAY['ninguna'],     ARRAY['hipersomnia','anorexia'],   ARRAY['antidepresivos'],               '71+',   'masculino', 'residencia_geriatrica', 'estrato_1_2', 'sin_escolaridad', 'alta', 'profesional', 'visitas_diarias', 'sin_burnout', ARRAY['aislamiento'], 'distante', 'minima', 'verbal_limitada', 'con_apoyo', 'perdido', 'leve', 'moderadamente_deteriorada', 5, 8, 3, 4, 2, 2.6, FALSE),
('Rosario Vega',          75, 'alzheimer', 'leve',      'subclinica',   'leve',     'unico',       ARRAY['ninguna'],     ARRAY['insomnio'],                 ARRAY['sin_medicacion'],               '71+',   'femenino', 'hogar_familiar',  'estrato_3_4', 'secundaria',       'alta',  'familiar_directo', '24_7',             'sin_burnout',ARRAY['sin_señales'],                    'muy_cercana', 'extensa',  'verbal_fluida',   'autonoma',     'conservado',              'sin_dolor','levemente_deteriorada',            3, 4, 3, 7, 4, 4.0,  FALSE),
('Álvaro Pineda',         80, 'alzheimer', 'avanzado',  'tdm',          'grave',    'recurrente',  ARRAY['ansiedad'],    ARRAY['insomnio','agitacion','anorexia'],ARRAY['antidepresivos','ansioliticos','antipsicoticos'],'71+','masculino','residencia_geriatrica','estrato_1_2','primaria','alta','familiar_directo','visitas_semanales','moderado',ARRAY['llanto_frecuente','aislamiento','rechazo_comer'],'distante','minima','solo_gestual','con_apoyo','perdido','moderado','severa',8,9,4,2,1,1.4,FALSE),
('Constanza Molina',      73, 'alzheimer', 'moderado',  'tdm',          'moderado', 'unico',       ARRAY['ansiedad'],    ARRAY['insomnio','hipersomnia'],   ARRAY['antidepresivos','ansioliticos'], '71+',   'femenino', 'hogar_familiar',  'estrato_3_4', 'primaria',         'alta',  'familiar_directo', '24_7',             'moderado', ARRAY['llanto_frecuente','aislamiento'],  'muy_cercana', 'moderada', 'verbal_fluida',   'con_apoyo',    'parcialmente_conservado', 'leve',     'levemente_deteriorada',           6, 7, 5, 4, 2, 2.9,  FALSE),
('Efraín Ospina',         85, 'alzheimer', 'terminal',  'tdm',          'grave',    'recurrente',  ARRAY['ansiedad'],    ARRAY['anorexia','fatiga'],        ARRAY['antidepresivos','antipsicoticos'],'71+',   'masculino', 'clinica',         'estrato_1_2', 'sin_escolaridad',  'alta',  'profesional',      'visitas_diarias',  'sin_burnout',ARRAY['aislamiento'],                    'distante',    'minima',   'sin_comunicacion_verbal','postrado_en_cama','perdido','severo','severa',7,9,3,1,1,1.0,FALSE),
('Margarita Díaz',        77, 'alzheimer', 'leve',      'distimia',     'leve',     'recurrente',  ARRAY['ninguna'],     ARRAY['insomnio'],                 ARRAY['antidepresivos'],               '71+',   'femenino', 'hogar_familiar',  'estrato_3_4', 'primaria',         'alta',  'familiar_directo', '24_7',             'leve',     ARRAY['aislamiento'],                    'muy_cercana', 'extensa',  'verbal_fluida',   'autonoma',     'conservado',              'sin_dolor','levemente_deteriorada',            4, 5, 3, 6, 3, 3.7,  FALSE),
('Tomás Vélez',           68, 'alzheimer', 'leve',      'sin_diagnostico','leve',   'unico',       ARRAY['ninguna'],     ARRAY['sin_sintomas'],             ARRAY['sin_medicacion'],               '56-70', 'masculino', 'hogar_familiar',  'estrato_5_6', 'universitario',    'media', 'familiar_directo', 'visitas_diarias',  'sin_burnout',ARRAY['sin_señales'],                    'muy_cercana', 'extensa',  'verbal_fluida',   'autonoma',     'conservado',              'sin_dolor','intacta',                         2, 3, 4, 8, 4, 4.5,  FALSE),
('Elena Sánchez',         84, 'alzheimer', 'avanzado',  'tdm',          'moderado', 'recurrente',  ARRAY['ansiedad'],    ARRAY['insomnio','hipersomnia'],   ARRAY['antidepresivos','ansioliticos'], '71+',   'femenino', 'residencia_geriatrica', 'estrato_1_2', 'sin_escolaridad', 'alta', 'familiar_directo', 'visitas_semanales', 'moderado', ARRAY['llanto_frecuente','aislamiento'], 'cercana', 'minima', 'verbal_limitada', 'con_apoyo', 'parcialmente_conservado', 'moderado', 'moderadamente_deteriorada', 6, 8, 4, 3, 2, 2.4, FALSE),
('Carlos Bedoya',         71, 'alzheimer', 'moderado',  'subclinica',   'leve',     'unico',       ARRAY['ninguna'],     ARRAY['fatiga'],                   ARRAY['sin_medicacion'],               '71+',   'masculino', 'hogar_familiar',  'estrato_3_4', 'secundaria',       'media', 'familiar_directo', '24_7',             'sin_burnout',ARRAY['sin_señales'],                    'muy_cercana', 'extensa',  'verbal_fluida',   'con_apoyo',    'conservado',              'leve',     'levemente_deteriorada',           3, 4, 4, 6, 4, 3.9,  FALSE),
('Nora Castaño',          76, 'alzheimer', 'moderado',  'tdm',          'moderado', 'unico',       ARRAY['ansiedad'],    ARRAY['insomnio','anorexia'],      ARRAY['antidepresivos','ansioliticos'], '71+',   'femenino', 'hogar_familiar',  'estrato_1_2', 'primaria',         'alta',  'familiar_directo', '24_7',             'severo',   ARRAY['llanto_frecuente','rechazo_comer','aislamiento'],'cercana','moderada','verbal_fluida','con_apoyo','parcialmente_conservado','moderado','levemente_deteriorada',7,7,5,3,2,2.5,FALSE),
('Augusto Salcedo',       83, 'alzheimer', 'avanzado',  'distimia',     'moderado', 'recurrente',  ARRAY['ninguna'],     ARRAY['hipersomnia','fatiga'],     ARRAY['antidepresivos'],               '71+',   'masculino', 'residencia_geriatrica', 'estrato_1_2', 'sin_escolaridad', 'alta', 'voluntario', 'visitas_semanales', 'sin_burnout', ARRAY['aislamiento'], 'distante', 'sin_red', 'verbal_limitada', 'silla_de_ruedas', 'perdido', 'leve', 'moderadamente_deteriorada', 5, 9, 3, 3, 2, 2.3, FALSE),
('Helena Peralta',        69, 'alzheimer', 'leve',      'subclinica',   'leve',     'unico',       ARRAY['ninguna'],     ARRAY['insomnio'],                 ARRAY['sin_medicacion'],               '56-70', 'femenino', 'hogar_familiar',  'estrato_3_4', 'secundaria',       'alta',  'familiar_directo', 'visitas_diarias',  'sin_burnout',ARRAY['sin_señales'],                    'muy_cercana', 'moderada', 'verbal_fluida',   'autonoma',     'conservado',              'sin_dolor','levemente_deteriorada',            3, 3, 4, 7, 4, 4.1,  FALSE),
('Mauricio Lagos',        78, 'alzheimer', 'moderado',  'tdm',          'grave',    'recurrente',  ARRAY['ansiedad','toc'], ARRAY['insomnio','agitacion'],  ARRAY['antidepresivos','ansioliticos','antipsicoticos'],'71+','masculino','hogar_familiar','estrato_3_4','universitario','media','familiar_directo','24_7','severo',ARRAY['llanto_frecuente','aislamiento'],'muy_cercana','extensa','verbal_limitada','con_apoyo','parcialmente_conservado','moderado','moderadamente_deteriorada',8,7,6,2,1,1.9,FALSE),
('Pilar Quintero',        74, 'alzheimer', 'terminal',  'tdm',          'grave',    'recurrente',  ARRAY['ansiedad'],    ARRAY['anorexia','fatiga','insomnio'],ARRAY['antidepresivos','ansioliticos'],'71+','femenino','clinica','estrato_1_2','sin_escolaridad','alta','familiar_directo','visitas_diarias','moderado',ARRAY['llanto_frecuente','rechazo_comer'],'cercana','minima','sin_comunicacion_verbal','postrado_en_cama','perdido','severo','severa',9,9,5,1,1,1.0,FALSE),

-- CASOS HUNTINGTON (10 perfiles)
('Diego Montoya',         42, 'huntington','moderado',  'tdm',          'grave',    'recurrente',  ARRAY['ansiedad'],    ARRAY['insomnio','agitacion'],     ARRAY['antidepresivos','ansioliticos','antipsicoticos'],'36-55','masculino','hogar_familiar','estrato_3_4','universitario','sin_creencia','familiar_directo','24_7','severo',ARRAY['llanto_frecuente','aislamiento'],'muy_cercana','moderada','verbal_fluida','con_apoyo','parcialmente_conservado','moderado','intacta',9,8,8,2,1,1.5,FALSE),
('Valentina Cruz',        35, 'huntington','leve',      'subclinica',   'leve',     'unico',       ARRAY['ansiedad'],    ARRAY['insomnio'],                 ARRAY['ansioliticos'],                 '18-35', 'femenino', 'hogar_familiar',  'estrato_5_6', 'posgrado',         'baja',  'familiar_directo', '24_7',             'sin_burnout',ARRAY['sin_señales'],                    'muy_cercana', 'extensa',  'verbal_fluida',   'autonoma',     'conservado',              'sin_dolor','intacta',                         5, 4, 7, 5, 3, 3.6,  FALSE),
('Sergio Medina',         48, 'huntington','avanzado',  'tdm',          'grave',    'recurrente',  ARRAY['ansiedad','toc'], ARRAY['insomnio','agitacion','fatiga'], ARRAY['antidepresivos','ansioliticos','antipsicoticos'],'36-55','masculino','hogar_familiar','estrato_1_2','secundaria','alta','familiar_directo','24_7','severo',ARRAY['llanto_frecuente','aislamiento','rechazo_comer'],'muy_cercana','extensa','verbal_limitada','silla_de_ruedas','perdido','severo','levemente_deteriorada',10,9,9,1,1,1.0,TRUE),
('Isabel Trujillo',       39, 'huntington','leve',      'distimia',     'moderado', 'recurrente',  ARRAY['ansiedad'],    ARRAY['insomnio','fatiga'],        ARRAY['antidepresivos','ansioliticos'], '36-55', 'femenino', 'hogar_familiar',  'estrato_3_4', 'universitario',    'media', 'familiar_directo', '24_7',             'leve',     ARRAY['llanto_frecuente'],               'muy_cercana', 'extensa',  'verbal_fluida',   'autonoma',     'conservado',              'leve',     'intacta',                         6, 5, 6, 5, 3, 3.3,  FALSE),
('Francisco Oquendo',     53, 'huntington','avanzado',  'tdm',          'moderado', 'unico',       ARRAY['ansiedad'],    ARRAY['insomnio','agitacion'],     ARRAY['antidepresivos','ansioliticos'], '36-55', 'masculino', 'clinica',         'estrato_1_2', 'primaria',         'alta',  'profesional',      'visitas_diarias',  'sin_burnout',ARRAY['aislamiento'],                    'distante',    'minima',   'verbal_limitada', 'silla_de_ruedas','perdido',             'moderado', 'levemente_deteriorada',           7, 8, 6, 3, 2, 2.4,  FALSE),
('Clara Jiménez',         44, 'huntington','moderado',  'tdm',          'moderado', 'recurrente',  ARRAY['ninguna'],     ARRAY['insomnio','hipersomnia'],   ARRAY['antidepresivos'],               '36-55', 'femenino', 'hogar_familiar',  'estrato_3_4', 'universitario',    'alta',  'familiar_directo', '24_7',             'moderado', ARRAY['aislamiento','llanto_frecuente'],  'muy_cercana', 'moderada', 'verbal_fluida',   'con_apoyo',    'parcialmente_conservado', 'leve',     'intacta',                         6, 6, 5, 5, 3, 3.2,  FALSE),
('Andrés Ochoa',          31, 'huntington','leve',      'tdm',          'grave',    'unico',       ARRAY['ansiedad'],    ARRAY['insomnio','agitacion'],     ARRAY['antidepresivos','ansioliticos'], '18-35', 'masculino', 'hogar_familiar',  'estrato_5_6', 'universitario',    'sin_creencia', 'familiar_directo', '24_7', 'leve', ARRAY['llanto_frecuente'], 'muy_cercana', 'extensa', 'verbal_fluida', 'autonoma', 'conservado', 'sin_dolor', 'intacta', 9, 7, 7, 3, 1, 2.1, FALSE),
('Liliana Posada',        46, 'huntington','moderado',  'distimia',     'leve',     'recurrente',  ARRAY['ninguna'],     ARRAY['fatiga','hipersomnia'],     ARRAY['antidepresivos'],               '36-55', 'femenino', 'hogar_familiar',  'estrato_1_2', 'secundaria',       'alta',  'familiar_directo', 'visitas_diarias',  'leve',     ARRAY['aislamiento'],                    'cercana',     'moderada', 'verbal_fluida',   'con_apoyo',    'conservado',              'moderado', 'intacta',                         4, 5, 4, 6, 3, 3.6,  FALSE),
('Gonzalo Varón',         57, 'huntington','avanzado',  'tdm',          'grave',    'recurrente',  ARRAY['ansiedad','trastorno_personalidad'], ARRAY['insomnio','agitacion','anorexia'], ARRAY['antidepresivos','ansioliticos','antipsicoticos'],'36-55','masculino','hogar_familiar','estrato_3_4','universitario','baja','familiar_directo','24_7','severo',ARRAY['llanto_frecuente','aislamiento','rechazo_comer'],'conflictiva','minima','verbal_limitada','silla_de_ruedas','perdido','severo','levemente_deteriorada',9,9,8,1,1,1.1,FALSE),
('Paula Arce',            40, 'huntington','terminal',  'tdm',          'grave',    'recurrente',  ARRAY['ansiedad'],    ARRAY['anorexia','fatiga','insomnio'],ARRAY['antidepresivos','ansioliticos'],'36-55','femenino','clinica','estrato_1_2','secundaria','alta','familiar_directo','visitas_diarias','severo',ARRAY['llanto_frecuente','rechazo_comer','aislamiento'],'muy_cercana','moderada','sin_comunicacion_verbal','postrado_en_cama','perdido','severo','moderadamente_deteriorada',9,9,7,1,1,1.0,FALSE),

-- CASOS ESCLEROSIS MÚLTIPLE (5 perfiles)
('María Claudia Ruiz',    34, 'esclerosis_multiple','leve','subclinica', 'leve',    'unico',       ARRAY['ansiedad'],    ARRAY['fatiga','insomnio'],        ARRAY['ansioliticos'],                 '18-35', 'femenino', 'hogar_familiar',  'estrato_5_6', 'posgrado',         'media', 'familiar_directo', '24_7',             'sin_burnout',ARRAY['sin_señales'],                    'muy_cercana', 'extensa',  'verbal_fluida',   'autonoma',     'conservado',              'leve',     'intacta',                         4, 3, 5, 7, 4, 3.9,  FALSE),
('Jaime Escobar',         49, 'esclerosis_multiple','moderado','tdm',   'moderado', 'recurrente',  ARRAY['ansiedad'],    ARRAY['fatiga','insomnio','hipersomnia'],ARRAY['antidepresivos','ansioliticos'],'36-55','masculino','hogar_familiar','estrato_3_4','universitario','baja','familiar_directo','24_7','moderado',ARRAY['aislamiento','llanto_frecuente'],'cercana','moderada','verbal_fluida','con_apoyo','parcialmente_conservado','moderado','intacta',6,6,5,5,3,3.1,FALSE),
('Alejandra Vásquez',     27, 'esclerosis_multiple','leve','tdm',       'grave',    'unico',       ARRAY['ansiedad'],    ARRAY['insomnio','agitacion'],     ARRAY['antidepresivos','ansioliticos'], '18-35', 'femenino', 'hogar_familiar',  'estrato_5_6', 'universitario',    'sin_creencia', 'familiar_directo', '24_7', 'leve', ARRAY['llanto_frecuente'], 'muy_cercana', 'extensa', 'verbal_fluida', 'autonoma', 'conservado', 'sin_dolor', 'intacta', 8, 5, 6, 4, 2, 2.5, FALSE),
('Ernesto Palacio',       62, 'esclerosis_multiple','avanzado','tdm',   'moderado', 'unico',       ARRAY['ansiedad'],    ARRAY['fatiga','insomnio'],        ARRAY['antidepresivos','ansioliticos'], '56-70', 'masculino', 'hogar_familiar',  'estrato_3_4', 'secundaria',       'media', 'familiar_directo', '24_7',             'leve',     ARRAY['aislamiento'],                    'cercana',     'moderada', 'verbal_fluida',   'con_apoyo',    'conservado',              'moderado', 'intacta',                         6, 5, 5, 5, 3, 3.3,  FALSE),
('Catalina Henao',        55, 'esclerosis_multiple','moderado','tdm',   'grave',    'recurrente',  ARRAY['ansiedad','toc'],ARRAY['fatiga','insomnio','anorexia'],ARRAY['antidepresivos','ansioliticos'],'36-55','femenino','hogar_familiar','estrato_3_4','universitario','alta','familiar_directo','24_7','severo',ARRAY['llanto_frecuente','aislamiento','rechazo_comer'],'muy_cercana','extensa','verbal_fluida','con_apoyo','parcialmente_conservado','severo','intacta',8,8,7,3,2,2.2,FALSE);

-- ============================================================
-- ÍNDICES PARA CONSULTAS FRECUENTES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_patients_disease ON synthetic_patients(neurological_disease);
CREATE INDEX IF NOT EXISTS idx_patients_severity ON synthetic_patients(depression_severity);
CREATE INDEX IF NOT EXISTS idx_recommendations_patient ON therapeutic_recommendations(patient_id);
CREATE INDEX IF NOT EXISTS idx_observations_patient ON caregiver_observations(patient_id);
CREATE INDEX IF NOT EXISTS idx_esas_patient ON esas_assessments(patient_id);
