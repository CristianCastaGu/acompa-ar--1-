import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import {
  ArrowLeft,
  User,
  Brain,
  Heart,
  ClipboardList,
  ChevronRight,
  Activity,
  CheckCircle2,
  AlertCircle,
  Database,
  Stethoscope,
  Users,
  Dumbbell,
} from 'lucide-react';
import { PATIENT_RICH_DATA } from '../../../lib/patientRichData';

type CaregiverView = 'dashboard' | 'observation' | 'burnout' | 'recommendation' | 'patients' | 'patient-detail';

interface Props {
  onBack: () => void;
  onAction: (view: CaregiverView) => void;
}

const DISEASE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  parkinson:          { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200' },
  ela:                { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  alzheimer:          { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  huntington:         { bg: 'bg-rose-50',   text: 'text-rose-600',   border: 'border-rose-200' },
  esclerosis_multiple:{ bg: 'bg-teal-50',   text: 'text-teal-600',   border: 'border-teal-200' },
  otra:               { bg: 'bg-gray-50',   text: 'text-gray-600',   border: 'border-gray-200' },
};

const STAGE_COLORS: Record<string, string> = {
  Leve:     'bg-success/10 text-success',
  Moderado: 'bg-accent-gold/10 text-accent-gold',
  Avanzado: 'bg-orange-100 text-orange-600',
  Terminal: 'bg-error/10 text-error',
};

const MODALITY_NAMES: Record<string, string> = {
  tcc:           'Terapia Cognitivo-Conductual',
  logoterapia:   'Logoterapia',
  rogers:        'Terapia Centrada en la Persona',
  gestalt:       'Terapia Gestalt',
  trec:          'Terapia Racional Emotiva',
  mindfulness_act: 'Mindfulness / ACT',
  cognitiva_beck: 'Terapia Cognitiva de Beck',
};

const LABEL: Record<string, string> = {
  // Depression
  tdm: 'TDM (Mayor)', subclinica: 'Subclínica', distimia: 'Distimia', sin_diagnostico: 'Sin diagnóstico',
  leve: 'Leve', moderado: 'Moderado', grave: 'Grave',
  unico: 'Episodio único', recurrente: 'Recurrente',
  // Symptoms / medication / comorbidities
  insomnio: 'Insomnio', hipersomnia: 'Hipersomnia', fatiga: 'Fatiga', anorexia: 'Anorexia',
  agitacion: 'Agitación', sin_sintomas: 'Sin síntomas',
  antidepresivos: 'Antidepresivos', ansioliticos: 'Ansiolíticos', antipsicoticos: 'Antipsicóticos',
  sin_medicacion: 'Sin medicación', ansiedad: 'Ansiedad', toc: 'TOC', sin_señales: 'Sin señales',
  trastorno_personalidad: 'Trastorno de personalidad', ninguna: 'Ninguna',
  // Caregiver
  familiar_directo: 'Familiar directo', profesional: 'Profesional', voluntario: 'Voluntario',
  '24_7': '24/7', visitas_diarias: 'Visitas diarias', visitas_semanales: 'Visitas semanales',
  sin_burnout: 'Sin burnout', severo: 'Severo',
  llanto_frecuente: 'Llanto frecuente', aislamiento: 'Aislamiento',
  rechazo_comer: 'Rechazo a comer', insomnio_visible: 'Insomnio visible',
  muy_cercana: 'Muy cercana', cercana: 'Cercana', distante: 'Distante', conflictiva: 'Conflictiva',
  extensa: 'Red extensa', moderada: 'Moderada', minima: 'Mínima', sin_red: 'Sin red',
  // Physical
  verbal_fluida: 'Verbal fluida', verbal_limitada: 'Verbal limitada',
  solo_gestual: 'Solo gestual', sin_comunicacion_verbal: 'Sin comunicación verbal',
  autonoma: 'Autónoma', con_apoyo: 'Con apoyo',
  silla_de_ruedas: 'Silla de ruedas', postrado_en_cama: 'Postrado en cama',
  conservado: 'Conservado', parcialmente_conservado: 'Parcial', perdido: 'Perdido',
  sin_dolor: 'Sin dolor',
  intacta: 'Intacta', levemente_deteriorada: 'Lev. deteriorada',
  moderadamente_deteriorada: 'Mod. deteriorada', severa: 'Severa',
  // Context
  masculino: 'Masculino', femenino: 'Femenino',
  hogar_familiar: 'Hogar familiar', hogar_unipersonal: 'Hogar unipersonal',
  residencia_geriatrica: 'Residencia geriátrica', clinica: 'Clínica',
  'estrato_1_2': '1–2', 'estrato_3_4': '3–4', 'estrato_5_6': '5–6',
  sin_escolaridad: 'Sin escolaridad', primaria: 'Primaria', secundaria: 'Secundaria',
  universitario: 'Universitario', posgrado: 'Posgrado',
  alta: 'Alta', media: 'Media', baja: 'Baja', sin_creencia: 'Sin creencia',
};

function lbl(key: string) {
  return LABEL[key] ?? key.replace(/_/g, ' ');
}

function EsasBar({ label, value, warning = false }: { label: string; value: number; warning?: boolean }) {
  const color = value >= 8 ? 'bg-error' : value >= 6 ? 'bg-orange-400' : value >= 4 ? 'bg-accent-gold' : 'bg-success';
  const textColor = value >= 8 ? 'text-error' : value >= 6 ? 'text-orange-500' : value >= 4 ? 'text-accent-gold' : 'text-success';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-text-sub font-medium">{label}</span>
        <span className={`font-black ${warning && value >= 7 ? 'text-error' : textColor}`}>{value}/10</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 10}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

function TagChip({ label }: { label: string }) {
  return (
    <span className="text-[10px] font-bold bg-surface-soft text-text-sub px-2 py-0.5 rounded-lg">{label}</span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-text-sub font-medium">{label}</span>
      <span className="text-xs font-bold text-text-main">{value}</span>
    </div>
  );
}

const TABS = [
  { id: 'clinico',   label: 'Clínico',   icon: <Stethoscope className="w-3.5 h-3.5" /> },
  { id: 'esas',      label: 'ESAS',       icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 'cuidador',  label: 'Cuidador',   icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'fisico',    label: 'Físico',     icon: <Dumbbell className="w-3.5 h-3.5" /> },
];

const PatientDetailView: React.FC<Props> = ({ onBack, onAction }) => {
  const { activeManagedPatient, algorithmProfile, therapeuticRecommendation } = useAppContext();
  const [activeTab, setActiveTab] = useState('clinico');

  if (!activeManagedPatient) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center text-text-sub">
        No hay paciente seleccionado.
        <button onClick={onBack} className="block mx-auto mt-4 text-primary font-bold hover:underline">
          Volver a la lista
        </button>
      </div>
    );
  }

  const p = activeManagedPatient;
  const colors = DISEASE_COLORS[p.neurologicalDisease] ?? DISEASE_COLORS.otra;
  const rich = PATIENT_RICH_DATA[p.name] ?? null;

  const stageMatch = p.diagnosis.match(/Estadio (\w+)|Terminal/);
  const stage = stageMatch ? (stageMatch[1] ?? 'Terminal') : '';
  const stageColor = STAGE_COLORS[stage] ?? 'bg-gray-100 text-gray-500';

  const hasProfile = !!algorithmProfile && algorithmProfile.patientName === p.name;
  const hasRec = !!therapeuticRecommendation && therapeuticRecommendation.patientName === p.name;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-sub" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-primary">{p.name}</h2>
          <p className="text-text-sub text-sm font-medium">{p.diagnosis} · {p.age} años</p>
        </div>
        <div className="flex items-center gap-2">
          {p.source === 'supabase' && (
            <span className="flex items-center gap-1 text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded-lg">
              <Database className="w-3 h-3" /> BD
            </span>
          )}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${p.status === 'active' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-400'}`}>
            {p.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {/* Patient Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[28px] border-2 ${colors.border} ${colors.bg} p-6 flex flex-col md:flex-row md:items-center gap-6`}
      >
        <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
          <User className={`w-10 h-10 ${colors.text}`} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold text-text-main">{p.name}</h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${stageColor}`}>
              {stage ? `Estadio ${stage}` : 'Terminal'}
            </span>
            {rich?.suicidal_ideation && (
              <span className="flex items-center gap-1 text-[10px] font-black bg-error/10 text-error px-2 py-0.5 rounded-lg">
                <AlertCircle className="w-3 h-3" /> Ideación suicida
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-text-sub font-medium">
            <span className={`font-bold ${colors.text}`}>{p.diagnosis.split(' — ')[0]}</span>
            <span>·</span>
            <span>{p.age} años</span>
            {rich && <><span>·</span><span>{lbl(rich.gender)}</span></>}
            <span>·</span>
            <span>Desde {p.createdAt.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}</span>
          </div>
          {p.notes && (
            <p className="text-sm text-text-sub italic bg-white/60 rounded-xl px-3 py-2">"{p.notes}"</p>
          )}
        </div>
      </motion.div>

      {/* Clinical Data from Database */}
      {rich && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-text-sub uppercase tracking-widest flex items-center gap-2">
            <Database className="w-4 h-4" /> Datos clínicos (Base de datos)
          </h3>

          {/* Tabs */}
          <div className="flex gap-2 bg-surface-soft rounded-2xl p-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-text-sub hover:text-text-main'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-[24px] border border-gray-100 p-6"
            >
              {activeTab === 'clinico' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-surface-soft rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">Diagnóstico</p>
                      <p className="font-bold text-text-main text-sm">{lbl(rich.depression_diagnosis)}</p>
                    </div>
                    <div className="bg-surface-soft rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">Severidad</p>
                      <p className={`font-bold text-sm ${rich.depression_severity === 'grave' ? 'text-error' : rich.depression_severity === 'moderado' ? 'text-accent-gold' : 'text-success'}`}>
                        {lbl(rich.depression_severity)}
                      </p>
                    </div>
                    <div className="bg-surface-soft rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">Episodio</p>
                      <p className="font-bold text-text-main text-sm">{lbl(rich.depression_episode)}</p>
                    </div>
                  </div>
                  <Row label="Entorno" value={lbl(rich.living_environment)} />
                  <Row label="Estrato" value={lbl(rich.socioeconomic_level)} />
                  <Row label="Educación" value={lbl(rich.education_level)} />
                  <Row label="Religiosidad" value={lbl(rich.religiosity)} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-2">Comorbilidades psiquiátricas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {rich.psychiatric_comorbidities.map(c => (
                        <span key={c} className="text-[10px] font-bold bg-surface-soft text-text-sub px-2 py-0.5 rounded-lg">{lbl(c)}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-2">Síntomas somáticos</p>
                    <div className="flex flex-wrap gap-1.5">
                      {rich.somatic_symptoms.map(s => (
                        <span key={s} className="text-[10px] font-bold bg-surface-soft text-text-sub px-2 py-0.5 rounded-lg">{lbl(s)}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-2">Medicación actual</p>
                    <div className="flex flex-wrap gap-1.5">
                      {rich.current_medication.map(m => (
                        <span key={m} className="text-[10px] font-bold bg-surface-soft text-text-sub px-2 py-0.5 rounded-lg">{lbl(m)}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'esas' && (
                <div className="space-y-4">
                  {rich.suicidal_ideation && (
                    <div className="flex items-center gap-3 bg-error/10 border border-error/20 rounded-2xl p-4">
                      <AlertCircle className="w-5 h-5 text-error shrink-0" />
                      <p className="text-sm font-bold text-error">Ideación suicida detectada — requiere atención inmediata</p>
                    </div>
                  )}
                  <EsasBar label="Angustia" value={rich.distress_level} warning />
                  <EsasBar label="Soledad" value={rich.loneliness_level} warning />
                  <EsasBar label="Miedo a la muerte" value={rich.death_fear} />
                  <EsasBar label="Deseo de vivir" value={rich.life_desire} />
                  <EsasBar label="Estado de ánimo diario" value={rich.daily_mood} />
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">Tendencia emocional (7 días)</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${rich.emotional_trend_7days * 10}%` }}
                          transition={{ duration: 0.7 }}
                          className={`h-full rounded-full ${rich.emotional_trend_7days >= 6 ? 'bg-success' : rich.emotional_trend_7days >= 4 ? 'bg-accent-gold' : 'bg-error'}`}
                        />
                      </div>
                      <span className={`text-sm font-black ${rich.emotional_trend_7days >= 6 ? 'text-success' : rich.emotional_trend_7days >= 4 ? 'text-accent-gold' : 'text-error'}`}>
                        {rich.emotional_trend_7days.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cuidador' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-soft rounded-2xl p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">Tipo cuidador</p>
                      <p className="font-bold text-text-main text-sm">{lbl(rich.caregiver_type)}</p>
                    </div>
                    <div className="bg-surface-soft rounded-2xl p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">Frecuencia contacto</p>
                      <p className="font-bold text-text-main text-sm">{lbl(rich.contact_frequency)}</p>
                    </div>
                    <div className="bg-surface-soft rounded-2xl p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">Burnout cuidador</p>
                      <p className={`font-bold text-sm ${rich.caregiver_burnout === 'severo' ? 'text-error' : rich.caregiver_burnout === 'moderado' ? 'text-accent-gold' : rich.caregiver_burnout === 'leve' ? 'text-orange-500' : 'text-success'}`}>
                        {lbl(rich.caregiver_burnout)}
                      </p>
                    </div>
                    <div className="bg-surface-soft rounded-2xl p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">Calidad relación</p>
                      <p className="font-bold text-text-main text-sm">{lbl(rich.relationship_quality)}</p>
                    </div>
                  </div>
                  <Row label="Red de apoyo familiar" value={lbl(rich.family_support_network)} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-2">Señales observadas en el cuidador</p>
                    <div className="flex flex-wrap gap-1.5">
                      {rich.caregiver_signals.map(s => (
                        <span key={s} className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${s === 'sin_señales' ? 'bg-success/10 text-success' : 'bg-orange-50 text-orange-600'}`}>
                          {lbl(s)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'fisico' && (
                <div className="space-y-3">
                  <Row label="Comunicación" value={lbl(rich.communication_ability)} />
                  <Row label="Movilidad" value={lbl(rich.mobility)} />
                  <Row label="Control motor fino" value={lbl(rich.fine_motor_control)} />
                  <Row label="Dolor crónico" value={lbl(rich.chronic_pain)} />
                  <Row label="Capacidad cognitiva" value={lbl(rich.cognitive_capacity)} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Registered algorithm data */}
      {(hasProfile || hasRec) && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-text-sub uppercase tracking-widest flex items-center gap-2">
            <ClipboardList className="w-4 h-4" /> Información registrada
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hasProfile && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[24px] border border-primary/20 p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-primary">Perfil clínico</p>
                    <p className="text-[11px] text-text-sub">{new Date(algorithmProfile!.updatedAt).toLocaleDateString('es-CO')}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-success ml-auto" />
                </div>
                <div className="space-y-1 text-xs text-text-sub">
                  <p><span className="font-bold text-text-main">Enfermedad:</span> {algorithmProfile!.clinical.neurologicalDisease} — {algorithmProfile!.clinical.diseaseStage}</p>
                  <p><span className="font-bold text-text-main">Depresión:</span> {algorithmProfile!.clinical.depressionDiagnosis} ({algorithmProfile!.clinical.depressionSeverity})</p>
                  <p><span className="font-bold text-text-main">Angustia ESAS:</span> {algorithmProfile!.emotional.distressLevel}/10</p>
                  <p><span className="font-bold text-text-main">Deseo de vivir:</span> {algorithmProfile!.emotional.lifeDesire}/10</p>
                  {algorithmProfile!.emotional.suicidalIdeation && (
                    <p className="text-error font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Alerta: ideación suicida detectada
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {hasRec && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[24px] border border-purple-200 p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-purple-600">Recomendación activa</p>
                    <p className="text-[11px] text-text-sub">{new Date(therapeuticRecommendation!.createdAt).toLocaleDateString('es-CO')}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-success ml-auto" />
                </div>
                <div className="space-y-1 text-xs text-text-sub">
                  <p className="font-bold text-text-main text-sm">{MODALITY_NAMES[therapeuticRecommendation!.modality] ?? therapeuticRecommendation!.modalityName}</p>
                  <p><span className="font-bold text-text-main">Confianza:</span> {therapeuticRecommendation!.confidenceScore}%</p>
                  <p><span className="font-bold text-text-main">Frecuencia:</span> {therapeuticRecommendation!.sessionFrequency}</p>
                  <p><span className="font-bold text-text-main">Modalidad:</span> {therapeuticRecommendation!.sessionType.replace(/_/g, ' ')}</p>
                  {therapeuticRecommendation!.suicidalAlert && (
                    <p className="text-error font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Alerta de riesgo activa
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-text-sub uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4" /> Acciones
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              view: 'observation' as CaregiverView,
              icon: <ClipboardList className="w-6 h-6" />,
              title: 'Registrar Observación',
              desc: 'Captura las dimensiones clínicas, emocionales y físicas del paciente.',
              color: 'bg-primary/10 text-primary',
              badge: hasProfile ? '✓ Ya registrada' : 'Pendiente',
              badgeColor: hasProfile ? 'bg-success/10 text-success' : 'bg-accent-gold/10 text-accent-gold',
            },
            {
              view: 'recommendation' as CaregiverView,
              icon: <Brain className="w-6 h-6" />,
              title: 'Ver Recomendación',
              desc: 'Consulta la modalidad terapéutica del algoritmo ACOMPAÑAR.',
              color: 'bg-purple-50 text-purple-600',
              badge: hasRec ? '✓ Disponible' : 'Sin datos',
              badgeColor: hasRec ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-400',
            },
            {
              view: 'burnout' as CaregiverView,
              icon: <Heart className="w-6 h-6" />,
              title: 'Evaluar mi Bienestar',
              desc: 'Escala ZARIT para medir tu nivel de sobrecarga como cuidador.',
              color: 'bg-rose-50 text-rose-500',
              badge: 'Autocuidado',
              badgeColor: 'bg-rose-50 text-rose-500',
            },
            {
              view: 'dashboard' as CaregiverView,
              icon: <Activity className="w-6 h-6" />,
              title: 'Ir al Panel',
              desc: 'Ve el panel principal del cuidador con estadísticas y alertas.',
              color: 'bg-surface-soft text-text-sub',
              badge: 'Panel',
              badgeColor: 'bg-surface-soft text-text-sub',
            },
          ].map((card, idx) => (
            <motion.button
              key={card.view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAction(card.view)}
              className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 text-left flex items-center gap-4 hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                {card.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-text-main text-sm">{card.title}</h4>
                  <span className={`text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>
                <p className="text-xs text-text-sub leading-relaxed">{card.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-text-sub shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailView;
