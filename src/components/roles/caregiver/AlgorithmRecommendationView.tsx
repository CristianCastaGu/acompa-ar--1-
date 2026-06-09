import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import {
  ArrowLeft,
  Brain,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Monitor,
  BookOpen,
  Heart,
  Target,
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

const MODALITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  tcc:           { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200' },
  logoterapia:   { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200' },
  rogers:        { bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-200' },
  gestalt:       { bg: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-200' },
  trec:          { bg: 'bg-yellow-50',  text: 'text-yellow-700', border: 'border-yellow-200' },
  mindfulness_act:{ bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200' },
  cognitiva_beck:{ bg: 'bg-indigo-50',  text: 'text-indigo-700', border: 'border-indigo-200' },
};

const AlgorithmRecommendationView: React.FC<Props> = ({ onBack }) => {
  const { therapeuticRecommendation, algorithmProfile, patient } = useAppContext();
  const [openSection, setOpenSection] = useState<string | null>('exercises');

  if (!therapeuticRecommendation || !algorithmProfile) {
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-10">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-sub" />
          </button>
          <h2 className="text-2xl font-bold text-primary">Recomendación Terapéutica</h2>
        </div>
        <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-8 text-center">
          <Brain className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="font-bold text-text-main mb-2">Sin datos de perfil aún</h3>
          <p className="text-sm text-text-sub mb-6">
            Registra primero la observación del paciente para que el algoritmo pueda generar una recomendación terapéutica.
          </p>
          <button onClick={onBack} className="px-5 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all">
            Ir a registrar observación
          </button>
        </div>
      </div>
    );
  }

  const rec = therapeuticRecommendation;
  const colors = MODALITY_COLORS[rec.modality] ?? MODALITY_COLORS.tcc;

  const sessionFreqLabel: Record<string, string> = {
    semanal: 'Semanal', quincenal: 'Quincenal', mensual: 'Mensual',
  };
  const sessionTypeLabel: Record<string, string> = {
    presencial: 'Presencial con psicólogo/a',
    virtual: 'Virtual / Telemedicina',
    guiada_por_ia: 'Guiada por asistente IA',
  };

  const toggleSection = (section: string) =>
    setOpenSection(prev => (prev === section ? null : section));

  const Section = ({
    id, icon, title, children,
  }: {
    id: string; icon: React.ReactNode; title: string; children: React.ReactNode;
  }) => (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-surface-soft transition-colors"
      >
        <span className="flex items-center gap-3 font-bold text-text-main">
          <span className="text-primary">{icon}</span>
          {title}
        </span>
        {openSection === id ? <ChevronUp className="w-4 h-4 text-text-sub" /> : <ChevronDown className="w-4 h-4 text-text-sub" />}
      </button>
      {openSection === id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-5 pb-5 bg-white border-t border-gray-50 space-y-2"
        >
          {children}
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-sub" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-primary">Recomendación Terapéutica</h2>
          <p className="text-text-sub text-sm font-medium">Algoritmo ACOMPAÑAR · {patient.name}</p>
        </div>
      </div>

      {/* Suicidal Alert */}
      {rec.suicidalAlert && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-error/10 border-2 border-error/30 rounded-2xl p-5 flex items-center gap-4"
        >
          <AlertCircle className="w-8 h-8 text-error shrink-0" />
          <div>
            <p className="font-bold text-error text-sm">⚠️ ALERTA DE IDEACIÓN SUICIDA</p>
            <p className="text-xs text-text-sub mt-0.5">
              El sistema ha detectado riesgo elevado. El médico responsable fue notificado automáticamente.
              Mantén presencia continua y no dejes al paciente solo.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Recommendation Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[28px] border-2 p-6 ${colors.bg} ${colors.border}`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-black uppercase tracking-widest ${colors.text}`}>
            Modalidad recomendada
          </span>
          <span className={`text-xs font-black px-3 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
            Confianza: {rec.confidenceScore}%
          </span>
        </div>
        <h3 className={`text-2xl font-black mb-3 ${colors.text}`}>{rec.modalityName}</h3>
        <p className="text-sm text-text-main leading-relaxed">{rec.scientificJustification}</p>

        <div className="flex flex-wrap gap-3 mt-5">
          <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl">
            <Clock className="w-4 h-4 text-text-sub" />
            <span className="text-xs font-bold text-text-main">{sessionFreqLabel[rec.sessionFrequency]}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl">
            <Monitor className="w-4 h-4 text-text-sub" />
            <span className="text-xs font-bold text-text-main">{sessionTypeLabel[rec.sessionType]}</span>
          </div>
        </div>
      </motion.div>

      {/* 3 Axes */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-5 space-y-3">
        <p className="text-xs font-black uppercase tracking-widest text-text-sub mb-3">Perfil del paciente — 3 ejes de clasificación</p>
        {[
          { label: 'Eje A — Enfermedad', value: rec.patientAxes.axisA },
          { label: 'Eje B — Perfil depresivo (DSM-5)', value: rec.patientAxes.axisB },
          { label: 'Eje C — Perfil contextual', value: rec.patientAxes.axisC },
        ].map(axis => (
          <div key={axis.label} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{axis.label}</span>
            <span className="text-sm font-medium text-text-main">{axis.value}</span>
          </div>
        ))}
      </div>

      {/* Expandable Sections */}
      <div className="space-y-3">
        <Section id="exercises" icon={<BookOpen className="w-4 h-4" />} title="Ejercicios terapéuticos específicos">
          <ul className="space-y-2 pt-2">
            {rec.specificExercises.map((ex, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-main">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                {ex}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="caregiver" icon={<Heart className="w-4 h-4" />} title="Guía para el cuidador">
          <ul className="space-y-2 pt-2">
            {rec.caregiverGuide.map((guide, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-main">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                {guide}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="alerts" icon={<AlertCircle className="w-4 h-4" />} title="Señales de alerta a monitorear">
          <ul className="space-y-2 pt-2">
            {rec.alertIndicators.map((alert, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-main">
                <span className="w-2 h-2 rounded-full bg-accent-gold shrink-0 mt-1.5" />
                {alert}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Doctor Review Status */}
      {rec.doctorReview ? (
        <div className={`rounded-2xl p-5 flex items-center gap-4 ${rec.doctorReview.approved ? 'bg-success/10 border border-success/20' : 'bg-accent-gold/10 border border-accent-gold/20'}`}>
          <CheckCircle2 className={`w-6 h-6 shrink-0 ${rec.doctorReview.approved ? 'text-success' : 'text-accent-gold'}`} />
          <div>
            <p className="font-bold text-text-main text-sm">
              {rec.doctorReview.approved ? 'Revisado y aprobado por el médico' : 'Revisado — con ajustes del médico'}
            </p>
            <p className="text-xs text-text-sub">{rec.doctorReview.reviewedBy} · {new Date(rec.doctorReview.reviewedAt).toLocaleDateString('es-CO')}</p>
            {rec.doctorReview.adjustments && (
              <p className="text-xs text-text-main mt-1 italic">"{rec.doctorReview.adjustments}"</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-surface-soft rounded-2xl p-4 text-center">
          <p className="text-xs text-text-sub font-medium">
            <Target className="w-4 h-4 inline mr-1" />
            Pendiente de revisión médica — El médico recibirá esta recomendación en su panel.
          </p>
        </div>
      )}
    </div>
  );
};

export default AlgorithmRecommendationView;
