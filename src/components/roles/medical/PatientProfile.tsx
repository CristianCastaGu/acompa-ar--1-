/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import {
  ArrowLeft,
  Activity,
  Brain,
  FileText,
  Clock,
  Plus,
  Heart,
  BarChart2,
  User,
  ChevronRight,
  Database,
  AlertCircle,
  Stethoscope,
  Users,
  Dumbbell,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PATIENT_RICH_DATA } from '../../../lib/patientRichData';

interface PatientProfileProps {
  onBack: () => void;
  onViewChange: (view: any) => void;
}

const DISEASE_LABELS: Record<string, string> = {
  parkinson: 'Parkinson',
  ela: 'ELA (Esclerosis Lateral Amiotrófica)',
  alzheimer: 'Alzheimer',
  huntington: 'Huntington',
  esclerosis_multiple: 'Esclerosis Múltiple',
  otra: 'Otra',
};

const LABEL: Record<string, string> = {
  tdm: 'TDM (Mayor)', subclinica: 'Subclínica', distimia: 'Distimia', sin_diagnostico: 'Sin diagnóstico',
  leve: 'Leve', moderado: 'Moderado', grave: 'Grave',
  unico: 'Episodio único', recurrente: 'Recurrente',
  insomnio: 'Insomnio', hipersomnia: 'Hipersomnia', fatiga: 'Fatiga', anorexia: 'Anorexia',
  agitacion: 'Agitación', sin_sintomas: 'Sin síntomas',
  antidepresivos: 'Antidepresivos', ansioliticos: 'Ansiolíticos', antipsicoticos: 'Antipsicóticos',
  sin_medicacion: 'Sin medicación', ansiedad: 'Ansiedad', toc: 'TOC', sin_señales: 'Sin señales',
  trastorno_personalidad: 'Trastorno de personalidad', ninguna: 'Ninguna',
  familiar_directo: 'Familiar directo', profesional: 'Profesional', voluntario: 'Voluntario',
  '24_7': '24/7', visitas_diarias: 'Visitas diarias', visitas_semanales: 'Visitas semanales',
  sin_burnout: 'Sin burnout', severo: 'Severo',
  llanto_frecuente: 'Llanto frecuente', aislamiento: 'Aislamiento',
  rechazo_comer: 'Rechazo a comer', insomnio_visible: 'Insomnio visible',
  muy_cercana: 'Muy cercana', cercana: 'Cercana', distante: 'Distante', conflictiva: 'Conflictiva',
  extensa: 'Red extensa', moderada: 'Moderada', minima: 'Mínima', sin_red: 'Sin red',
  verbal_fluida: 'Verbal fluida', verbal_limitada: 'Verbal limitada',
  solo_gestual: 'Solo gestual', sin_comunicacion_verbal: 'Sin comunicación verbal',
  autonoma: 'Autónoma', con_apoyo: 'Con apoyo',
  silla_de_ruedas: 'Silla de ruedas', postrado_en_cama: 'Postrado en cama',
  conservado: 'Conservado', parcialmente_conservado: 'Parcial', perdido: 'Perdido',
  sin_dolor: 'Sin dolor',
  intacta: 'Intacta', levemente_deteriorada: 'Lev. deteriorada',
  moderadamente_deteriorada: 'Mod. deteriorada', severa: 'Severa',
  masculino: 'Masculino', femenino: 'Femenino',
  hogar_familiar: 'Hogar familiar', hogar_unipersonal: 'Hogar unipersonal',
  residencia_geriatrica: 'Residencia geriátrica', clinica: 'Clínica',
  'estrato_1_2': '1–2', 'estrato_3_4': '3–4', 'estrato_5_6': '5–6',
  sin_escolaridad: 'Sin escolaridad', primaria: 'Primaria', secundaria: 'Secundaria',
  universitario: 'Universitario', posgrado: 'Posgrado',
  alta: 'Alta', media: 'Media', baja: 'Baja', sin_creencia: 'Sin creencia',
};

function lbl(key: string) { return LABEL[key] ?? key.replace(/_/g, ' '); }

function getEmotionalDataByStage(diagnosis: string) {
  if (diagnosis.includes('Terminal'))  return [{ name: 'S1', value: 3 }, { name: 'S2', value: 2 }, { name: 'S3', value: 2 }, { name: 'S4', value: 1 }];
  if (diagnosis.includes('Avanzado')) return [{ name: 'S1', value: 4 }, { name: 'S2', value: 3 }, { name: 'S3', value: 4 }, { name: 'S4', value: 3 }];
  if (diagnosis.includes('Moderado')) return [{ name: 'S1', value: 5 }, { name: 'S2', value: 6 }, { name: 'S3', value: 5 }, { name: 'S4', value: 7 }];
  return [{ name: 'S1', value: 6 }, { name: 'S2', value: 7 }, { name: 'S3', value: 7 }, { name: 'S4', value: 8 }];
}

function getEmotionalLabel(diagnosis: string): string {
  if (diagnosis.includes('Terminal'))  return 'Crítico';
  if (diagnosis.includes('Avanzado')) return 'Ansioso';
  if (diagnosis.includes('Moderado')) return 'Moderado';
  return 'Estable';
}

function getEmotionalColor(diagnosis: string): string {
  if (diagnosis.includes('Terminal'))  return 'text-error';
  if (diagnosis.includes('Avanzado')) return 'text-orange-500';
  if (diagnosis.includes('Moderado')) return 'text-accent-gold';
  return 'text-success';
}

function getAISummary(name: string, diagnosis: string): string {
  const firstName = name.split(' ')[0];
  if (diagnosis.includes('Terminal'))
    return `${firstName} se encuentra en etapa terminal. El equipo recomienda reforzar los cuidados paliativos intensivos, priorizar el confort y el acompañamiento emocional continuo. La comunicación con la familia es fundamental en esta etapa.`;
  if (diagnosis.includes('Avanzado'))
    return `${firstName} presenta signos de progresión en su cuadro clínico. Se observan fluctuaciones emocionales frecuentes. Se recomienda ajustar el plan terapéutico y aumentar la frecuencia de visitas para monitorear el estado general.`;
  if (diagnosis.includes('Moderado'))
    return `${firstName} muestra una evolución estable con períodos de mejoría. Las intervenciones actuales tienen un impacto positivo. Se recomienda mantener el plan terapéutico vigente y evaluar la incorporación de actividades de estimulación cognitiva.`;
  return `${firstName} se encuentra en etapa temprana con buena respuesta al tratamiento. Se observa estabilidad emocional y funcional. Se recomienda enfocarse en intervenciones preventivas y fortalecer la red de apoyo familiar.`;
}

function getDaysInCare(createdAt: Date): number {
  const now = new Date('2026-06-09');
  return Math.max(1, Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-text-sub font-medium">{label}</span>
      <span className="text-xs font-bold text-text-main">{value}</span>
    </div>
  );
}

const DB_TABS = [
  { id: 'clinico',  label: 'Clínico',  icon: <Stethoscope className="w-3.5 h-3.5" /> },
  { id: 'esas',     label: 'ESAS',     icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 'cuidador', label: 'Cuidador', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'fisico',   label: 'Físico',   icon: <Dumbbell className="w-3.5 h-3.5" /> },
];

const PatientProfile: React.FC<PatientProfileProps> = ({ onBack, onViewChange }) => {
  const { selectedMedicalPatient, patient, algorithmProfile, therapeuticRecommendation } = useAppContext();
  const [activeTab, setActiveTab] = useState('clinico');

  const p = selectedMedicalPatient;
  const name = p?.name ?? patient.name;
  const diagnosis = p?.diagnosis ?? patient.diagnosis;
  const age = p?.age ?? patient.age;
  const daysInCare = p ? getDaysInCare(p.createdAt) : patient.daysInCare;
  const emotionalLabel = p ? getEmotionalLabel(p.diagnosis) : patient.currentEmotionalState;
  const emotionalColor = p ? getEmotionalColor(p.diagnosis) : 'text-primary';
  const emotionalData = p ? getEmotionalDataByStage(p.diagnosis) : [{ name: 'S1', value: 4 }, { name: 'S2', value: 3 }, { name: 'S3', value: 6 }, { name: 'S4', value: 8 }];
  const aiSummary = p ? getAISummary(p.name, p.diagnosis) : 'Sin datos de paciente seleccionado.';
  const diseaseName = p ? (DISEASE_LABELS[p.neurologicalDisease] ?? p.neurologicalDisease) : diagnosis;
  const rich = p ? (PATIENT_RICH_DATA[p.name] ?? null) : null;

  const hasRec = !!therapeuticRecommendation && therapeuticRecommendation.patientName === name;

  return (
    <div className="h-full bg-app-bg overflow-y-auto">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-primary">{name}</h2>
                {p?.source === 'supabase' && (
                  <span className="flex items-center gap-1 text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded-lg">
                    <Database className="w-3 h-3" /> BD
                  </span>
                )}
                {rich?.suicidal_ideation && (
                  <span className="flex items-center gap-1 text-[10px] font-black bg-error/10 text-error px-2 py-1 rounded-lg">
                    <AlertCircle className="w-3 h-3" /> Ideación suicida
                  </span>
                )}
              </div>
              <p className="text-xs text-text-sub font-bold uppercase tracking-wider">{diseaseName}</p>
            </div>
          </div>
          <button
            onClick={() => onViewChange('visit')}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Registrar visita de hoy
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Edad',           value: `${age} años`,     icon: <User className="w-4 h-4" />,     highlight: false },
            { label: 'Días en cuidado',value: daysInCare,        icon: <Clock className="w-4 h-4" />,    highlight: false },
            { label: 'Estado clínico', value: emotionalLabel,    icon: <Heart className="w-4 h-4" />,    highlight: true  },
            { label: 'Estadio',        value: diagnosis.includes('Terminal') ? 'Terminal' : (diagnosis.match(/Estadio (\w+)/)?.[1] ?? '—'), icon: <Activity className="w-4 h-4" />, highlight: false },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2 text-text-sub">
                {stat.icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className={`text-xl font-bold ${stat.highlight ? emotionalColor : 'text-text-main'}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Algorithm recommendation banner */}
        {hasRec && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-primary/5 border border-primary/20 rounded-[24px] p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary mb-0.5">Recomendación activa</p>
                <p className="font-bold text-text-main text-sm">{therapeuticRecommendation!.modalityName}</p>
                <p className="text-xs text-text-sub">Confianza: {therapeuticRecommendation!.confidenceScore}% · {therapeuticRecommendation!.sessionFrequency}</p>
              </div>
            </div>
            <button onClick={() => onViewChange('algorithm')} className="text-primary font-bold text-sm hover:underline flex items-center gap-1 shrink-0">
              Ver <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Chart + AI Summary + DB Data */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-primary" /> Evolución Emocional
                </h3>
                <span className="text-xs font-bold text-text-sub uppercase">Últimas 4 semanas</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={emotionalData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1A6B5A" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#1A6B5A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                    <YAxis hide domain={[0, 10]} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="value" stroke="#1A6B5A" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10 space-y-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Brain className="w-5 h-5" /> Resumen Clínico IA
              </h3>
              <p className="text-sm text-text-sub leading-relaxed">{aiSummary}</p>
              {p && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-1">Enfermedad</p>
                    <p className="text-sm font-bold text-text-main">{DISEASE_LABELS[p.neurologicalDisease] ?? p.neurologicalDisease}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-1">Estadio</p>
                    <p className="text-sm font-bold text-text-main">{p.diagnosis.split('— ')[1] ?? '—'}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-1">Estado</p>
                    <p className={`text-sm font-bold ${p.status === 'active' ? 'text-success' : 'text-gray-400'}`}>
                      {p.status === 'active' ? 'Activo' : 'Inactivo'}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-1">Registrado</p>
                    <p className="text-sm font-bold text-text-main">{p.createdAt.toLocaleDateString('es-CO')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* DB Clinical Data Tabs */}
            {rich && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-text-sub uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-4 h-4" /> Datos clínicos (Base de datos)
                </h3>

                <div className="flex gap-2 bg-surface-soft rounded-2xl p-1">
                  {DB_TABS.map(tab => (
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
                        <div className="grid grid-cols-3 gap-4">
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
                        <Row label="Género" value={lbl(rich.gender)} />
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
          </div>

          {/* Right: Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-text-sub uppercase tracking-widest pl-2">Acciones Rápidas</h3>
            {[
              { id: 'algorithm', label: 'Recomendación Algoritmo', icon: <Brain className="w-5 h-5" /> },
              { id: 'emotional', label: 'Historial Emocional',      icon: <Heart className="w-5 h-5" /> },
              { id: 'monitoring', label: 'Historial de Monitoreo',  icon: <Activity className="w-5 h-5" /> },
              { id: 'clinical',  label: 'Historia Clínica',          icon: <FileText className="w-5 h-5" /> },
              { id: 'dashboard', label: 'Registros de Visitas',      icon: <Clock className="w-5 h-5" /> },
            ].map((action) => (
              <button
                key={action.id}
                onClick={() => onViewChange(action.id)}
                className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-primary/20 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-surface-soft rounded-xl text-text-sub group-hover:text-primary transition-colors">
                    {action.icon}
                  </div>
                  <span className="font-bold text-text-main group-hover:text-primary transition-colors">{action.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;
