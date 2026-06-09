import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  Clock,
  Monitor,
  BookOpen,
  Heart,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Edit3,
  Loader2,
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

const AlgorithmRecommendation: React.FC<Props> = ({ onBack }) => {
  const { therapeuticRecommendation, setTherapeuticRecommendation, algorithmProfile, patient } = useAppContext();
  const [openSection, setOpenSection] = useState<string | null>('justification');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [approved, setApproved] = useState(true);
  const [adjustments, setAdjustments] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!therapeuticRecommendation || !algorithmProfile) {
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-10">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-sub" />
          </button>
          <h2 className="text-2xl font-bold text-primary">Recomendación del Algoritmo</h2>
        </div>
        <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-8 text-center">
          <Brain className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="font-bold text-text-main mb-2">Sin recomendación generada</h3>
          <p className="text-sm text-text-sub mb-6">
            El cuidador aún no ha registrado el perfil del paciente. Una vez que lo haga, verás aquí la recomendación terapéutica con su justificación científica.
          </p>
          <button onClick={onBack} className="px-5 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all">
            Volver al panel
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

  const toggleSection = (s: string) => setOpenSection(p => p === s ? null : s);

  const handleSaveReview = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setTherapeuticRecommendation({
      ...rec,
      doctorReview: {
        approved,
        adjustments,
        reviewedAt: new Date(),
        reviewedBy: 'Dr. / Dra. — Panel Médico',
      },
    });
    setIsSaving(false);
    setShowReviewForm(false);
  };

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
          <span className="text-primary">{icon}</span>{title}
        </span>
        {openSection === id ? <ChevronUp className="w-4 h-4 text-text-sub" /> : <ChevronDown className="w-4 h-4 text-text-sub" />}
      </button>
      {openSection === id && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-5 pb-5 bg-white border-t border-gray-50"
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
          <h2 className="text-2xl font-bold text-primary">Recomendación del Algoritmo</h2>
          <p className="text-text-sub text-sm font-medium">
            Algoritmo ACOMPAÑAR · {patient.name} · {new Date(rec.createdAt).toLocaleDateString('es-CO')}
          </p>
        </div>
      </div>

      {/* Suicidal Alert */}
      {rec.suicidalAlert && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-error/10 border-2 border-error rounded-2xl p-5 flex items-center gap-4"
        >
          <AlertCircle className="w-8 h-8 text-error shrink-0" />
          <div>
            <p className="font-black text-error">🚨 ALERTA DE IDEACIÓN SUICIDA — INTERVENCIÓN URGENTE</p>
            <p className="text-xs text-text-sub mt-0.5">
              El algoritmo detectó indicadores de riesgo suicida en la evaluación del cuidador.
              Requiere evaluación clínica inmediata por el médico o psicólogo responsable.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Recommendation Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[28px] border-2 p-7 ${colors.bg} ${colors.border}`}
      >
        <div className="flex items-start justify-between mb-4">
          <span className={`text-xs font-black uppercase tracking-widest ${colors.text}`}>
            Modalidad terapéutica recomendada
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-black px-3 py-1 rounded-full bg-white/70 ${colors.text}`}>
              IA · {rec.confidenceScore}% confianza
            </span>
          </div>
        </div>
        <h3 className={`text-2xl font-black mb-2 ${colors.text}`}>{rec.modalityName}</h3>

        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-xl">
            <Clock className="w-4 h-4 text-text-sub" />
            <span className="text-xs font-bold text-text-main">{sessionFreqLabel[rec.sessionFrequency]}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-xl">
            <Monitor className="w-4 h-4 text-text-sub" />
            <span className="text-xs font-bold text-text-main">{sessionTypeLabel[rec.sessionType]}</span>
          </div>
        </div>
      </motion.div>

      {/* 3 Axes Classification */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-5 space-y-3">
        <p className="text-xs font-black uppercase tracking-widest text-text-sub">Clasificación del paciente — 3 ejes</p>
        {[
          { label: 'Eje A — Tipo de enfermedad', value: rec.patientAxes.axisA },
          { label: 'Eje B — Perfil depresivo (DSM-5)', value: rec.patientAxes.axisB },
          { label: 'Eje C — Perfil contextual', value: rec.patientAxes.axisC },
        ].map(axis => (
          <div key={axis.label} className="py-2 border-b border-gray-50 last:border-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-0.5">{axis.label}</span>
            <span className="text-sm font-medium text-text-main">{axis.value}</span>
          </div>
        ))}
      </div>

      {/* Expandable Sections */}
      <div className="space-y-3">
        <Section id="justification" icon={<BookOpen className="w-4 h-4" />} title="Justificación científica completa">
          <p className="text-sm text-text-main leading-relaxed pt-3">{rec.scientificJustification}</p>
          <p className="text-xs text-text-sub mt-3 italic">
            Fuentes: DSM-5 (APA, 2013) + Manual de Psicoterapias — Rodríguez Morejón (2019)
          </p>
        </Section>

        <Section id="exercises" icon={<Target className="w-4 h-4" />} title="Ejercicios terapéuticos propuestos">
          <ul className="space-y-2 pt-3">
            {rec.specificExercises.map((ex, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-main">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                {ex}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="caregiver" icon={<Heart className="w-4 h-4" />} title="Guía para el cuidador">
          <ul className="space-y-2 pt-3">
            {rec.caregiverGuide.map((g, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-main">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                {g}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="alerts" icon={<AlertCircle className="w-4 h-4" />} title="Indicadores de alerta a monitorear">
          <ul className="space-y-2 pt-3">
            {rec.alertIndicators.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-main">
                <span className="w-2 h-2 rounded-full bg-error mt-1.5 shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Doctor Review */}
      {rec.doctorReview ? (
        <div className={`rounded-2xl p-5 flex items-start gap-4 ${rec.doctorReview.approved ? 'bg-success/10 border border-success/20' : 'bg-accent-gold/10 border border-accent-gold/20'}`}>
          <CheckCircle2 className={`w-6 h-6 shrink-0 mt-0.5 ${rec.doctorReview.approved ? 'text-success' : 'text-accent-gold'}`} />
          <div>
            <p className="font-bold text-text-main text-sm">
              {rec.doctorReview.approved ? '✓ Recomendación aprobada' : '⚠ Recomendación con ajustes'}
            </p>
            <p className="text-xs text-text-sub">{rec.doctorReview.reviewedBy} · {new Date(rec.doctorReview.reviewedAt).toLocaleDateString('es-CO')}</p>
            {rec.doctorReview.adjustments && (
              <p className="text-sm text-text-main mt-2 italic bg-white/60 rounded-xl px-3 py-2">"{rec.doctorReview.adjustments}"</p>
            )}
          </div>
        </div>
      ) : (
        !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all"
          >
            <Edit3 className="w-5 h-5" />
            Revisar y validar recomendación
          </button>
        )
      )}

      {/* Review Form */}
      {showReviewForm && !rec.doctorReview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[24px] shadow-xl border border-gray-100 p-6 space-y-5"
        >
          <h3 className="font-bold text-text-main text-lg">Revisión Clínica del Médico</h3>

          <div>
            <p className="text-xs font-black uppercase tracking-widest text-text-sub mb-3">¿Aprueba la recomendación del algoritmo?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setApproved(true)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${approved ? 'bg-success text-white border-success' : 'bg-white text-text-sub border-gray-200 hover:border-success/40'}`}
              >
                ✓ Apruebo
              </button>
              <button
                onClick={() => setApproved(false)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${!approved ? 'bg-accent-gold text-white border-accent-gold' : 'bg-white text-text-sub border-gray-200 hover:border-accent-gold/40'}`}
              >
                ⚠ Con ajustes
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-text-sub block mb-1.5">
              Notas clínicas / ajustes (opcional)
            </label>
            <textarea
              value={adjustments}
              onChange={e => setAdjustments(e.target.value)}
              placeholder="Ej: Considerar también Mindfulness como complemento. Iniciar con sesiones cada 2 semanas dada la condición del paciente…"
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-text-main outline-none focus:ring-2 ring-primary/20 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowReviewForm(false)}
              className="flex-1 py-3 bg-gray-100 text-text-sub rounded-2xl font-bold hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveReview}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all disabled:opacity-70"
            >
              {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando…</> : 'Registrar revisión'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// We need to reference Target icon
const Target = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

export default AlgorithmRecommendation;
