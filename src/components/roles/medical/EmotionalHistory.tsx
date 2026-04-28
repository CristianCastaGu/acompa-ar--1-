/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { ArrowLeft, TrendingUp, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface EmotionalHistoryProps {
  onBack: () => void;
}

const EmotionalHistory: React.FC<EmotionalHistoryProps> = ({ onBack }) => {
  const { patient } = useAppContext();

  const data = [
    { name: 'S1', value: 45, color: '#E8825A' },
    { name: 'S2', value: 55, color: '#C9973A' },
    { name: 'S3', value: 75, color: '#2E9E8A' },
    { name: 'S4', value: 85, color: '#1A6B5A' },
    { name: 'S5', value: 80, color: '#1A6B5A' },
  ];

  const visitLogs = [
    { date: '27 Abr', aiState: 'Tranquilidad', manual: '7/10', assistantUsage: 'Alta', notes: 'Conversación sobre juventud' },
    { date: '24 Abr', aiState: 'Fatiga leve', manual: '6/10', assistantUsage: 'Media', notes: 'Deseo de ver álbum' },
    { date: '20 Abr', aiState: 'Angustia', manual: '3/10', assistantUsage: 'Baja', notes: 'Ajuste de medicación' },
  ];

  return (
    <div className="h-full bg-app-bg overflow-y-auto pb-12">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-primary">Historial Emocional Progresivo</h2>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Índice de Bienestar (%)
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Section */}
          <div className="space-y-6">
             <div className="bg-accent-gold/5 p-8 rounded-[32px] border border-accent-gold/10 space-y-6">
                <h3 className="text-lg font-bold text-accent-gold flex items-center gap-2">
                   <Sparkles className="w-5 h-5" /> Hallazgos de la IA
                </h3>
                <div className="space-y-4">
                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-accent-gold/20 shrink-0">
                         <Heart className="w-5 h-5 text-accent-gold" />
                      </div>
                      <p className="text-sm text-text-sub leading-relaxed">
                        El 85% de los episodios de paz coinciden con la interacción con el <strong>Álbum de Vida</strong>.
                      </p>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-accent-gold/20 shrink-0">
                         <MessageCircle className="w-5 h-5 text-accent-gold" />
                      </div>
                      <p className="text-sm text-text-sub leading-relaxed">
                        La frecuencia de mensajes dejados a la familia ha aumentado tras las sesiones de <strong>Acompañante IA</strong>.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Visits Detail Table */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-text-sub uppercase tracking-widest pl-2">Detalle de Monitoreo Emocional</h3>
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-soft">
                <tr>
                   <th className="px-6 py-4 text-xs font-black uppercase text-text-sub tracking-widest">Fecha</th>
                   <th className="px-6 py-4 text-xs font-black uppercase text-text-sub tracking-widest">IA (Facial)</th>
                   <th className="px-6 py-4 text-xs font-black uppercase text-text-sub tracking-widest">Manual</th>
                   <th className="px-6 py-4 text-xs font-black uppercase text-text-sub tracking-widest">Uso Asistente</th>
                   <th className="px-6 py-4 text-xs font-black uppercase text-text-sub tracking-widest">Contexto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visitLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-5 font-bold text-text-main text-sm">{log.date}</td>
                    <td className="px-6 py-5 text-sm text-text-sub">{log.aiState}</td>
                    <td className="px-6 py-5 text-sm font-bold text-primary">{log.manual}</td>
                    <td className="px-6 py-5">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${log.assistantUsage === 'Alta' ? 'bg-success/10 text-success' : log.assistantUsage === 'Media' ? 'bg-accent-gold/10 text-accent-gold' : 'bg-error/10 text-error'}`}>
                          {log.assistantUsage}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-xs text-text-sub italic">{log.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmotionalHistory;
