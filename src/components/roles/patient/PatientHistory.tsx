/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { ArrowLeft, Calendar, Info, TrendingUp } from 'lucide-react';

interface PatientHistoryProps {
  onBack: () => void;
}

const PatientHistory: React.FC<PatientHistoryProps> = ({ onBack }) => {
  const { patient } = useAppContext();

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'peace': return 'bg-success';
      case 'calm': return 'bg-primary-light';
      case 'neutral': return 'bg-text-sub';
      case 'anxious': return 'bg-accent-warm';
      case 'sad': return 'bg-error';
      case 'motivated': return 'bg-accent-gold';
      default: return 'bg-gray-400';
    }
  };

  // Group by week mock
  const historyItems = [
    { 
      week: 'Esta semana', 
      avgState: 'Paz Profunda', 
      color: 'bg-success', 
      emoji: '🌿',
      summary: 'Has tenido conversaciones muy reflexivas sobre tu legado. Te sientes conectado con tu familia.' 
    },
    { 
      week: 'Semana pasada', 
      avgState: 'Aceptación', 
      color: 'bg-accent-gold', 
      emoji: '✨',
      summary: 'Momentos de nostalgia mezclados con gratitud. El álbum de vida te ha ayudado a recordar lo bueno.' 
    },
    { 
      week: 'Hace 2 semanas', 
      avgState: 'Incertidumbre', 
      color: 'bg-accent-warm', 
      emoji: '😰',
      summary: 'Días de cansancio físico que afectaron tu ánimo. El médico ajustó tu plan de cuidado.' 
    }
  ];

  return (
    <div className="h-full bg-app-bg overflow-y-auto">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-primary">Mi historial emocional</h2>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 md:py-12">
        <div className="space-y-12 relative border-l-4 border-primary/10 ml-4 py-4 pl-10">
          {historyItems.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              <div className={`absolute -left-[54px] top-0 w-10 h-10 rounded-full border-4 border-app-bg ${item.color} flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-black/10`}>
                {item.emoji}
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-4 hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-text-sub uppercase tracking-widest">{item.week}</span>
                  <div className={`px-4 py-1.5 rounded-full ${item.color}/10 ${item.color.replace('bg-', 'text-')} text-xs font-black uppercase tracking-wider`}>
                    Promedio: {item.avgState}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="p-3 bg-surface-soft rounded-2xl shrink-0">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-main">Resumen de la IA</h4>
                      <p className="text-sm text-text-sub leading-relaxed">{item.summary}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-text-sub">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> 7 registros diarios
                    </div>
                    <button className="text-primary hover:underline font-bold">Ver detalle diario</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-primary/5 rounded-3xl border border-primary/10 space-y-4">
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-primary">Sobre tu progreso</h3>
          </div>
          <p className="text-sm text-text-sub leading-relaxed">
            Este historial es una herramienta para ti y tu equipo médico. Registramos tus sensaciones y 
            conversaciones para asegurarnos de que el acompañamiento sea lo más humano y efectivo posible.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PatientHistory;
