import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';
import { calcZaritCategory, getZaritRecommendation } from '../../../services/algorithm';

interface Props {
  onBack: () => void;
}

const ZARIT_QUESTIONS = [
  '¿Sientes que tu familiar te pide más ayuda de la que realmente necesita?',
  '¿Sientes que por el tiempo que dedicas a tu familiar ya no tienes tiempo suficiente para ti?',
  '¿Te sientes estresado/a al tener que cuidar a tu familiar y tener que atender otras responsabilidades?',
  '¿Te sientes avergonzado/a por la conducta de tu familiar?',
  '¿Te sientes irritado/a cuando estás cerca de tu familiar?',
  '¿Crees que la situación actual afecta de manera negativa tu relación con amigos y otros familiares?',
  '¿Tienes miedo de lo que le puede pasar a tu familiar en el futuro?',
  '¿Sientes que tu familiar depende de ti?',
  '¿Te sientes agotado/a cuando tienes que estar junto a tu familiar?',
  '¿Sientes que tu salud se ha resentido por cuidar a tu familiar?',
  '¿Sientes que no tienes la vida privada que desearías por dedicarte al cuidado de tu familiar?',
  '¿Crees que tu vida social se ha visto afectada por tener que cuidar a tu familiar?',
  '¿Te sientes incómodo/a para invitar amigos a casa, a causa de tu familiar?',
  '¿Crees que tu familiar espera que le cuides, como si fueras la única persona con la que puede contar?',
  '¿Crees que no dispones de dinero suficiente para cuidar a tu familiar además de sus otros gastos?',
  '¿Sientes que serás incapaz de cuidar a tu familiar por mucho más tiempo?',
  '¿Sientes que has perdido el control de tu vida desde que comenzó la enfermedad de tu familiar?',
  '¿Desearías poder encargar el cuidado de tu familiar a otras personas?',
  '¿Te sientes inseguro/a acerca de lo que debes hacer con tu familiar?',
  '¿Sientes que deberías hacer más de lo que haces por tu familiar?',
  '¿Crees que podrías cuidar mejor a tu familiar de lo que lo haces?',
  'En general, ¿te sientes muy sobrecargado/a por tener que cuidar a tu familiar?',
];

const ZARIT_OPTIONS = [
  { value: 0, label: 'Nunca' },
  { value: 1, label: 'Rara vez' },
  { value: 2, label: 'A veces' },
  { value: 3, label: 'Bastantes veces' },
  { value: 4, label: 'Casi siempre' },
];

const BurnoutAssessment: React.FC<Props> = ({ onBack }) => {
  const [answers, setAnswers] = useState<number[]>(new Array(ZARIT_QUESTIONS.length).fill(1));
  const [submitted, setSubmitted] = useState(false);

  const totalScore = answers.reduce((s, v) => s + v, 0);
  const category = calcZaritCategory(totalScore);
  const recommendation = getZaritRecommendation(category);

  const categoryConfig: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
    sin_burnout: { label: 'Sin sobrecarga',    color: 'text-success',      bg: 'bg-success/10',      emoji: '🌿' },
    leve:        { label: 'Sobrecarga leve',   color: 'text-accent-gold',  bg: 'bg-accent-gold/10',  emoji: '🟡' },
    moderado:    { label: 'Sobrecarga moderada',color: 'text-orange-500',  bg: 'bg-orange-50',       emoji: '🟠' },
    severo:      { label: 'Sobrecarga severa', color: 'text-error',        bg: 'bg-error/10',        emoji: '🔴' },
  };

  const cfg = categoryConfig[category];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-10">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-sub" />
          </button>
          <h2 className="text-2xl font-bold text-primary">Resultado — Escala ZARIT</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-8 space-y-6"
        >
          <div className="text-center">
            <span className="text-6xl">{cfg.emoji}</span>
            <div className={`inline-block mt-4 px-5 py-2 rounded-full font-bold text-lg ${cfg.bg} ${cfg.color}`}>
              {cfg.label}
            </div>
            <p className="text-4xl font-black text-text-main mt-4">{totalScore} <span className="text-lg font-normal text-text-sub">/ 88 puntos</span></p>
          </div>

          <div className="bg-surface-soft rounded-2xl p-5">
            <p className="text-xs font-black uppercase tracking-widest text-text-sub mb-2">Recomendación</p>
            <p className="text-sm text-text-main leading-relaxed">{recommendation}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-text-sub">Rangos de referencia</p>
            {Object.entries(categoryConfig).map(([key, c]) => (
              <div key={key} className={`flex items-center justify-between px-4 py-2 rounded-xl ${key === category ? c.bg : 'bg-gray-50'}`}>
                <span className={`text-sm font-bold ${key === category ? c.color : 'text-text-sub'}`}>
                  {c.emoji} {c.label}
                </span>
                <span className="text-xs text-text-sub font-medium">
                  {key === 'sin_burnout' ? '0–22' : key === 'leve' ? '23–46' : key === 'moderado' ? '47–56' : '57–88'}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-text-sub text-center italic">
            Resultado compartido con el equipo médico para seguimiento integral.
          </p>

          <button
            onClick={onBack}
            className="w-full py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all"
          >
            Volver al panel
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-sub" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-primary">Escala ZARIT</h2>
          <p className="text-text-sub text-sm font-medium">Evaluación de sobrecarga del cuidador — {ZARIT_QUESTIONS.length} preguntas</p>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-text-main">
          <strong>Tu bienestar importa.</strong> Esta evaluación es confidencial y nos ayuda a entender cómo apoyarte mejor en tu rol de cuidador.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {ZARIT_QUESTIONS.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <p className="text-sm font-medium text-text-main mb-3">
              <span className="text-primary font-bold mr-2">{i + 1}.</span>{q}
            </p>
            <div className="flex gap-2 flex-wrap">
              {ZARIT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    const updated = [...answers];
                    updated[i] = opt.value;
                    setAnswers(updated);
                  }}
                  className={`text-xs px-3 py-2 rounded-xl font-bold border transition-all ${
                    answers[i] === opt.value
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-text-sub border-gray-200 hover:border-primary/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="sticky bottom-6">
        <button
          onClick={() => setSubmitted(true)}
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl hover:bg-primary/90 transition-all"
        >
          <CheckCircle2 className="w-5 h-5" />
          Ver mi resultado (Puntaje: {totalScore})
        </button>
      </div>
    </div>
  );
};

export default BurnoutAssessment;
