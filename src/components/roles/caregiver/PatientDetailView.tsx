import React from 'react';
import { motion } from 'motion/react';
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
} from 'lucide-react';

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

const PatientDetailView: React.FC<Props> = ({ onBack, onAction }) => {
  const { activeManagedPatient, algorithmProfile, therapeuticRecommendation } = useAppContext();

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

  // Extract stage from diagnosis string e.g. "Parkinson — Estadio Moderado" → "Moderado"
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
        <div className={`w-20 h-20 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm`}>
          <User className={`w-10 h-10 ${colors.text}`} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold text-text-main">{p.name}</h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${stageColor}`}>
              {stage ? `Estadio ${stage}` : 'Terminal'}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-text-sub font-medium">
            <span className={`font-bold ${colors.text}`}>{p.diagnosis.split(' — ')[0]}</span>
            <span>·</span>
            <span>{p.age} años</span>
            <span>·</span>
            <span>Desde {p.createdAt.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}</span>
          </div>
          {p.notes && (
            <p className="text-sm text-text-sub italic bg-white/60 rounded-xl px-3 py-2">"{p.notes}"</p>
          )}
        </div>
      </motion.div>

      {/* Registered data */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-text-sub uppercase tracking-widest flex items-center gap-2">
          <ClipboardList className="w-4 h-4" /> Información registrada
        </h3>

        {!hasProfile && !hasRec ? (
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 text-center text-text-sub">
            <Brain className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p className="font-semibold text-sm">Sin observaciones aún</p>
            <p className="text-xs mt-1">Registra la primera observación clínica para activar el algoritmo.</p>
          </div>
        ) : (
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
        )}
      </div>

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
