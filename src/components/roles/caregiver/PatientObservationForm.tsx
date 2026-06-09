import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { runAlgorithm } from '../../../services/algorithm';
import { ArrowLeft, ArrowRight, CheckCircle2, Brain, Loader2 } from 'lucide-react';
import {
  ClinicalDimension,
  ESASAssessment,
  DemographicDimension,
  RelationalDimension,
  PhysicalDimension,
  PatientAlgorithmProfile,
} from '../../../types';

interface Props {
  onBack: () => void;
  onComplete: () => void;
}

const STEPS = [
  { label: 'Clínica',     emoji: '🏥' },
  { label: 'Emocional',   emoji: '💙' },
  { label: 'Contexto',    emoji: '🏠' },
  { label: 'Relacional',  emoji: '🤝' },
  { label: 'Física',      emoji: '🦾' },
];

const PatientObservationForm: React.FC<Props> = ({ onBack, onComplete }) => {
  const { patient, setAlgorithmProfile, setTherapeuticRecommendation, addAlert } = useAppContext();
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Dimensión 1: Clínica
  const [clinical, setClinical] = useState<ClinicalDimension>({
    neurologicalDisease: 'parkinson',
    diseaseStage: 'moderado',
    depressionDiagnosis: 'tdm',
    depressionEpisode: 'recurrente',
    depressionSeverity: 'moderado',
    psychiatricComorbidities: [],
    somaticSymptoms: [],
    currentMedication: [],
  });

  // ── Dimensión 2: Emocional (ESAS)
  const [emotional, setEmotional] = useState<ESASAssessment>({
    distressLevel: 5,
    lonelinessLevel: 5,
    deathFear: 5,
    lifeDesire: 5,
    dailyMood: 3,
    emotionalTrend7Days: 3,
    suicidalIdeation: false,
    assessmentDate: new Date(),
  });

  // ── Dimensión 3: Demográfica
  const [demographic, setDemographic] = useState<DemographicDimension>({
    ageGroup: '56-70',
    gender: 'masculino',
    livingEnvironment: 'hogar_familiar',
    socioeconomicLevel: 'estrato_3_4',
    educationLevel: 'universitario',
    religiosity: 'media',
  });

  // ── Dimensión 4: Relacional
  const [relational, setRelational] = useState<RelationalDimension>({
    caregiverType: 'familiar_directo',
    contactFrequency: '24_7',
    caregiverBurnout: 'leve',
    caregiverSignals: [],
    relationshipQuality: 'muy_cercana',
    familySupportNetwork: 'moderada',
  });

  // ── Dimensión 5: Física
  const [physical, setPhysical] = useState<PhysicalDimension>({
    communicationAbility: 'verbal_fluida',
    mobility: 'con_apoyo',
    fineMotorControl: 'parcialmente_conservado',
    chronicPain: 'moderado',
    cognitiveCapacity: 'intacta',
  });

  const toggleArrayItem = (arr: string[], item: string): string[] =>
    arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  const handleFinish = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1200)); // simulated processing

    const profile: PatientAlgorithmProfile = {
      id: `prof-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      clinical,
      emotional,
      demographic,
      relational,
      physical,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const recommendation = runAlgorithm(profile);
    setAlgorithmProfile(profile);
    setTherapeuticRecommendation(recommendation);

    if (recommendation.suicidalAlert) {
      addAlert({
        type: 'critical',
        category: 'suicidal',
        message: `⚠️ ALERTA MÁXIMA: Indicadores de ideación suicida detectados en ${patient.name}. Intervención inmediata requerida.`,
      });
    }

    setIsProcessing(false);
    onComplete();
  };

  // ──────────────────────────────────────────────────────────
  // RENDERERS POR PASO
  // ──────────────────────────────────────────────────────────

  const Select = ({ label, value, onChange, options }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
  }) => (
    <div>
      <label className="text-xs font-bold text-text-sub uppercase tracking-wider block mb-1.5">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-text-main outline-none focus:ring-2 ring-primary/20 transition-all"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );

  const CheckGroup = ({ label, options, selected, onChange }: {
    label: string;
    options: { value: string; label: string }[];
    selected: string[];
    onChange: (v: string[]) => void;
  }) => (
    <div>
      <label className="text-xs font-bold text-text-sub uppercase tracking-wider block mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(toggleArrayItem(selected, o.value))}
            className={`text-xs px-3 py-2 rounded-xl font-bold border transition-all ${
              selected.includes(o.value)
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-text-sub border-gray-200 hover:border-primary/40'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  const Slider = ({ label, value, onChange, min = 0, max = 10, leftLabel, rightLabel }: {
    label: string; value: number; onChange: (v: number) => void;
    min?: number; max?: number; leftLabel?: string; rightLabel?: string;
  }) => (
    <div>
      <label className="text-xs font-bold text-text-sub uppercase tracking-wider block mb-1.5">
        {label} <span className="text-primary font-black ml-1">{value}</span>
      </label>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-[10px] text-text-sub mt-1">
          <span>{leftLabel}</span><span>{rightLabel}</span>
        </div>
      )}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <Select label="Enfermedad neurológica" value={clinical.neurologicalDisease}
              onChange={v => setClinical(p => ({ ...p, neurologicalDisease: v as ClinicalDimension['neurologicalDisease'] }))}
              options={[
                { value: 'parkinson', label: 'Parkinson' },
                { value: 'ela', label: 'ELA (Esclerosis Lateral Amiotrófica)' },
                { value: 'alzheimer', label: 'Alzheimer' },
                { value: 'huntington', label: 'Huntington' },
                { value: 'esclerosis_multiple', label: 'Esclerosis Múltiple' },
                { value: 'otra', label: 'Otra' },
              ]}
            />
            <Select label="Estadio de la enfermedad" value={clinical.diseaseStage}
              onChange={v => setClinical(p => ({ ...p, diseaseStage: v as ClinicalDimension['diseaseStage'] }))}
              options={[
                { value: 'leve', label: 'Estadio 1 — Leve' },
                { value: 'moderado', label: 'Estadio 2 — Moderado' },
                { value: 'avanzado', label: 'Estadio 3 — Avanzado' },
                { value: 'terminal', label: 'Terminal' },
              ]}
            />
            <Select label="Diagnóstico depresivo (DSM-5)" value={clinical.depressionDiagnosis}
              onChange={v => setClinical(p => ({ ...p, depressionDiagnosis: v as ClinicalDimension['depressionDiagnosis'] }))}
              options={[
                { value: 'tdm', label: 'Trastorno de Depresión Mayor (TDM)' },
                { value: 'distimia', label: 'Distimia' },
                { value: 'subclinica', label: 'Depresión Subclínica' },
                { value: 'sin_diagnostico', label: 'Sin diagnóstico formal' },
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Episodio" value={clinical.depressionEpisode}
                onChange={v => setClinical(p => ({ ...p, depressionEpisode: v as ClinicalDimension['depressionEpisode'] }))}
                options={[
                  { value: 'unico', label: 'Único' },
                  { value: 'recurrente', label: 'Recurrente' },
                ]}
              />
              <Select label="Gravedad (DSM-5)" value={clinical.depressionSeverity}
                onChange={v => setClinical(p => ({ ...p, depressionSeverity: v as ClinicalDimension['depressionSeverity'] }))}
                options={[
                  { value: 'leve', label: 'Leve (F32.0)' },
                  { value: 'moderado', label: 'Moderado (F32.1)' },
                  { value: 'grave', label: 'Grave (F32.2)' },
                  { value: 'psicotico', label: 'Con psicosis (F32.3)' },
                ]}
              />
            </div>
            <CheckGroup label="Comorbilidades psiquiátricas" selected={clinical.psychiatricComorbidities}
              onChange={v => setClinical(p => ({ ...p, psychiatricComorbidities: v }))}
              options={[
                { value: 'ansiedad', label: 'Ansiedad' },
                { value: 'toc', label: 'TOC' },
                { value: 'trastorno_personalidad', label: 'T. Personalidad' },
                { value: 'ninguna', label: 'Ninguna' },
              ]}
            />
            <CheckGroup label="Síntomas somáticos" selected={clinical.somaticSymptoms}
              onChange={v => setClinical(p => ({ ...p, somaticSymptoms: v }))}
              options={[
                { value: 'insomnio', label: 'Insomnio' },
                { value: 'hipersomnia', label: 'Hipersomnia' },
                { value: 'anorexia', label: 'Anorexia' },
                { value: 'fatiga', label: 'Fatiga severa' },
                { value: 'agitacion', label: 'Agitación' },
              ]}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-sm text-text-sub">
              <strong className="text-primary">Escala ESAS adaptada</strong> — Basada en observación directa del paciente. Escala 0-10.
            </div>
            <Slider label="Nivel de angustia" value={emotional.distressLevel}
              onChange={v => setEmotional(p => ({ ...p, distressLevel: v }))}
              leftLabel="0 · Sin angustia" rightLabel="10 · Angustia máxima"
            />
            <Slider label="Sensación de soledad" value={emotional.lonelinessLevel}
              onChange={v => setEmotional(p => ({ ...p, lonelinessLevel: v }))}
              leftLabel="0 · Acompañado" rightLabel="10 · Completamente solo"
            />
            <Slider label="Miedo a la muerte" value={emotional.deathFear}
              onChange={v => setEmotional(p => ({ ...p, deathFear: v }))}
              leftLabel="0 · Aceptación" rightLabel="10 · Terror intenso"
            />
            <Slider label="Sentido de vida" value={emotional.lifeDesire}
              onChange={v => setEmotional(p => ({ ...p, lifeDesire: v }))}
              leftLabel="0 · Vacío existencial" rightLabel="10 · Sentido claro"
            />
            <div>
              <label className="text-xs font-bold text-text-sub uppercase tracking-wider block mb-2">Estado de ánimo hoy</label>
              <div className="flex gap-3">
                {[
                  { v: 1, e: '😞', l: 'Muy mal' },
                  { v: 2, e: '😔', l: 'Mal' },
                  { v: 3, e: '😐', l: 'Regular' },
                  { v: 4, e: '🙂', l: 'Bien' },
                  { v: 5, e: '😄', l: 'Muy bien' },
                ].map(({ v, e, l }) => (
                  <button
                    key={v} type="button"
                    onClick={() => setEmotional(p => ({ ...p, dailyMood: v as 1|2|3|4|5 }))}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
                      emotional.dailyMood === v ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white hover:border-primary/30'
                    }`}
                  >
                    <span className="text-2xl">{e}</span>
                    <span className="text-[10px] font-bold text-text-sub">{l}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-2xl">
              <div>
                <p className="font-bold text-text-main text-sm">¿Hay indicios de ideación suicida?</p>
                <p className="text-xs text-text-sub">Expresiones como "ya no quiero estar", "quisiera morirme", "soy una carga".</p>
              </div>
              <button
                type="button"
                onClick={() => setEmotional(p => ({ ...p, suicidalIdeation: !p.suicidalIdeation }))}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  emotional.suicidalIdeation ? 'bg-error text-white' : 'bg-gray-100 text-text-sub'
                }`}
              >
                {emotional.suicidalIdeation ? 'SÍ' : 'NO'}
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Select label="Grupo de edad" value={demographic.ageGroup}
                onChange={v => setDemographic(p => ({ ...p, ageGroup: v as DemographicDimension['ageGroup'] }))}
                options={[
                  { value: '18-35', label: '18–35 años' },
                  { value: '36-55', label: '36–55 años' },
                  { value: '56-70', label: '56–70 años' },
                  { value: '71+', label: '71+ años' },
                ]}
              />
              <Select label="Género" value={demographic.gender}
                onChange={v => setDemographic(p => ({ ...p, gender: v as DemographicDimension['gender'] }))}
                options={[
                  { value: 'masculino', label: 'Masculino' },
                  { value: 'femenino', label: 'Femenino' },
                  { value: 'no_binario', label: 'No binario' },
                  { value: 'prefiere_no_decir', label: 'Prefiere no decir' },
                ]}
              />
            </div>
            <Select label="Entorno de vida" value={demographic.livingEnvironment}
              onChange={v => setDemographic(p => ({ ...p, livingEnvironment: v as DemographicDimension['livingEnvironment'] }))}
              options={[
                { value: 'hogar_familiar', label: 'Hogar familiar' },
                { value: 'hogar_unipersonal', label: 'Hogar unipersonal' },
                { value: 'clinica', label: 'Clínica / Hospital' },
                { value: 'residencia_geriatrica', label: 'Residencia geriátrica' },
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Nivel socioeconómico" value={demographic.socioeconomicLevel}
                onChange={v => setDemographic(p => ({ ...p, socioeconomicLevel: v as DemographicDimension['socioeconomicLevel'] }))}
                options={[
                  { value: 'estrato_1_2', label: 'Estrato 1-2' },
                  { value: 'estrato_3_4', label: 'Estrato 3-4' },
                  { value: 'estrato_5_6', label: 'Estrato 5-6' },
                ]}
              />
              <Select label="Nivel educativo" value={demographic.educationLevel}
                onChange={v => setDemographic(p => ({ ...p, educationLevel: v as DemographicDimension['educationLevel'] }))}
                options={[
                  { value: 'sin_escolaridad', label: 'Sin escolaridad' },
                  { value: 'primaria', label: 'Primaria' },
                  { value: 'secundaria', label: 'Secundaria' },
                  { value: 'universitario', label: 'Universitario' },
                  { value: 'posgrado', label: 'Posgrado' },
                ]}
              />
            </div>
            <Select label="Religiosidad / Espiritualidad" value={demographic.religiosity}
              onChange={v => setDemographic(p => ({ ...p, religiosity: v as DemographicDimension['religiosity'] }))}
              options={[
                { value: 'alta', label: 'Alta — Fe central en su vida' },
                { value: 'media', label: 'Media — Cree pero no practicante' },
                { value: 'baja', label: 'Baja — Escasa espiritualidad' },
                { value: 'sin_creencia', label: 'Sin creencia religiosa' },
              ]}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Select label="Tipo de cuidador" value={relational.caregiverType}
                onChange={v => setRelational(p => ({ ...p, caregiverType: v as RelationalDimension['caregiverType'] }))}
                options={[
                  { value: 'familiar_directo', label: 'Familiar directo' },
                  { value: 'profesional', label: 'Profesional de salud' },
                  { value: 'voluntario', label: 'Voluntario' },
                  { value: 'sin_cuidador', label: 'Sin cuidador identificado' },
                ]}
              />
              <Select label="Frecuencia de contacto" value={relational.contactFrequency}
                onChange={v => setRelational(p => ({ ...p, contactFrequency: v as RelationalDimension['contactFrequency'] }))}
                options={[
                  { value: '24_7', label: 'Cuidado 24/7 en hogar' },
                  { value: 'visitas_diarias', label: 'Visitas diarias' },
                  { value: 'visitas_semanales', label: 'Visitas semanales' },
                  { value: 'esporadico', label: 'Contacto esporádico' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Calidad de la relación" value={relational.relationshipQuality}
                onChange={v => setRelational(p => ({ ...p, relationshipQuality: v as RelationalDimension['relationshipQuality'] }))}
                options={[
                  { value: 'muy_cercana', label: 'Muy cercana' },
                  { value: 'cercana', label: 'Cercana' },
                  { value: 'distante', label: 'Distante' },
                  { value: 'conflictiva', label: 'Conflictiva' },
                ]}
              />
              <Select label="Red de apoyo familiar" value={relational.familySupportNetwork}
                onChange={v => setRelational(p => ({ ...p, familySupportNetwork: v as RelationalDimension['familySupportNetwork'] }))}
                options={[
                  { value: 'extensa', label: 'Extensa (5+ personas)' },
                  { value: 'moderada', label: 'Moderada (2-4)' },
                  { value: 'minima', label: 'Mínima (1)' },
                  { value: 'sin_red', label: 'Sin red de apoyo' },
                ]}
              />
            </div>
            <CheckGroup label="Señales observadas en el paciente" selected={relational.caregiverSignals}
              onChange={v => setRelational(p => ({ ...p, caregiverSignals: v }))}
              options={[
                { value: 'llanto_frecuente', label: 'Llanto frecuente' },
                { value: 'aislamiento', label: 'Aislamiento' },
                { value: 'rechazo_comer', label: 'Rechazo a comer' },
                { value: 'insomnio_visible', label: 'Insomnio visible' },
                { value: 'agitacion', label: 'Agitación' },
                { value: 'sin_señales', label: 'Sin señales de alerta' },
              ]}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <Select label="Capacidad comunicativa" value={physical.communicationAbility}
              onChange={v => setPhysical(p => ({ ...p, communicationAbility: v as PhysicalDimension['communicationAbility'] }))}
              options={[
                { value: 'verbal_fluida', label: 'Verbal fluida — Se expresa bien' },
                { value: 'verbal_limitada', label: 'Verbal limitada — Dificultad para hablar' },
                { value: 'solo_gestual', label: 'Solo gestual — Sin palabras' },
                { value: 'sin_comunicacion_verbal', label: 'Sin comunicación verbal' },
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Movilidad" value={physical.mobility}
                onChange={v => setPhysical(p => ({ ...p, mobility: v as PhysicalDimension['mobility'] }))}
                options={[
                  { value: 'autonoma', label: 'Autónoma' },
                  { value: 'con_apoyo', label: 'Con apoyo' },
                  { value: 'silla_de_ruedas', label: 'Silla de ruedas' },
                  { value: 'postrado_en_cama', label: 'Postrado en cama' },
                ]}
              />
              <Select label="Control motor fino" value={physical.fineMotorControl}
                onChange={v => setPhysical(p => ({ ...p, fineMotorControl: v as PhysicalDimension['fineMotorControl'] }))}
                options={[
                  { value: 'conservado', label: 'Conservado' },
                  { value: 'parcialmente_conservado', label: 'Parcialmente' },
                  { value: 'perdido', label: 'Perdido' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Dolor crónico" value={physical.chronicPain}
                onChange={v => setPhysical(p => ({ ...p, chronicPain: v as PhysicalDimension['chronicPain'] }))}
                options={[
                  { value: 'sin_dolor', label: 'Sin dolor' },
                  { value: 'leve', label: 'Leve' },
                  { value: 'moderado', label: 'Moderado' },
                  { value: 'severo', label: 'Severo' },
                ]}
              />
              <Select label="Capacidad cognitiva" value={physical.cognitiveCapacity}
                onChange={v => setPhysical(p => ({ ...p, cognitiveCapacity: v as PhysicalDimension['cognitiveCapacity'] }))}
                options={[
                  { value: 'intacta', label: 'Intacta' },
                  { value: 'levemente_deteriorada', label: 'Levemente deteriorada' },
                  { value: 'moderadamente_deteriorada', label: 'Moderadamente' },
                  { value: 'severa', label: 'Severa' },
                ]}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-sub" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-primary">Registro de Observación</h2>
          <p className="text-text-sub text-sm font-medium">Perfil clínico de {patient.name} · {STEPS[step].emoji} Dimensión {step + 1}/5: {STEPS[step].label}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1">
            <div className={`h-2 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-gray-200'}`} />
            <p className={`text-[10px] mt-1 font-bold text-center transition-colors ${i === step ? 'text-primary' : 'text-gray-300'}`}>
              {s.emoji}
            </p>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-6 md:p-8 mb-6">
        <h3 className="text-lg font-bold text-text-main mb-5 flex items-center gap-2">
          <span className="text-2xl">{STEPS[step].emoji}</span>
          Dimensión {STEPS[step].label}
        </h3>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-text-sub hover:border-primary/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Anterior
          </button>
        )}
        <div className="flex-1" />
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all"
          >
            Siguiente <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all disabled:opacity-70"
          >
            {isProcessing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Procesando…</>
            ) : (
              <><Brain className="w-4 h-4" /> Ejecutar Algoritmo</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientObservationForm;
