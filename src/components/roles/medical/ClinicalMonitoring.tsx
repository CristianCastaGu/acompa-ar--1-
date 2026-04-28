/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { ArrowLeft, Download, Activity, Heart, Wind, Gauge, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ClinicalMonitoringProps {
  onBack: () => void;
}

const ClinicalMonitoring: React.FC<ClinicalMonitoringProps> = ({ onBack }) => {
  const { patient } = useAppContext();

  // Mock data for graphs
  const data = [
    { name: 'Lun', hr: 68, rr: 16, spo2: 96, pain: 2 },
    { name: 'Mar', hr: 72, rr: 18, spo2: 95, pain: 3 },
    { name: 'Mie', hr: 70, rr: 17, spo2: 96, pain: 2 },
    { name: 'Jue', hr: 75, rr: 20, spo2: 94, pain: 4 },
    { name: 'Vie', hr: 71, rr: 18, spo2: 95, pain: 2 },
    { name: 'Sab', hr: 69, rr: 16, spo2: 97, pain: 1 },
    { name: 'Dom', hr: 68, rr: 16, spo2: 96, pain: 1 },
  ];

  const charts = [
    { id: 'hr', title: 'Ritmo Cardíaco (bpm)', dataKey: 'hr', color: '#C0392B', icon: <Heart className="w-5 h-5" />, threshold: 100 },
    { id: 'rr', title: 'Fr. Respiratoria (rpm)', dataKey: 'rr', color: '#27AE60', icon: <Wind className="w-5 h-5" />, threshold: 24 },
    { id: 'spo2', title: 'Saturación SpO2 (%)', dataKey: 'spo2', color: '#2E9E8A', icon: <Activity className="w-5 h-5" />, threshold: 92, inverse: true },
    { id: 'pain', title: 'Nivel de Dolor (0-10)', dataKey: 'pain', color: '#E8825A', icon: <Gauge className="w-5 h-5" />, threshold: 7 },
  ];

  return (
    <div className="h-full bg-app-bg overflow-y-auto pb-20">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-primary">Monitoreo Clínico</h2>
          </div>
          <button className="flex items-center gap-2 bg-text-main text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-black/10 transition-all">
            <Download className="w-4 h-4" /> Exportar Historial PDF
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {charts.map((chart) => (
          <motion.div 
            key={chart.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl text-white`} style={{ backgroundColor: chart.color }}>
                  {chart.icon}
                </div>
                <h3 className="font-bold text-text-main">{chart.title}</h3>
              </div>
              <div className="flex items-center gap-1 text-[10px] bg-surface-soft px-3 py-1 rounded-full font-black uppercase text-text-sub">
                Última sem.
              </div>
            </div>

            <div className="h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                  <YAxis hide domain={chart.id === 'spo2' ? [85, 100] : [0, 'auto']} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <ReferenceLine y={chart.threshold} stroke={chart.color} strokeDasharray="3 3" label={{ position: 'right', value: 'Alerta', fill: chart.color, fontSize: 10 }} />
                  <Line 
                    type="monotone" 
                    dataKey={chart.dataKey} 
                    stroke={chart.color} 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: chart.color, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Alert marker mock */}
              {chart.id === 'hr' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-error/10 text-error px-2 py-1 rounded-lg border border-error/20">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="text-[10px] font-bold">Pico detectado</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </main>

      <div className="max-w-6xl mx-auto px-6">
         <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
               <h4 className="text-xl font-bold text-primary">Interpretación Clínica</h4>
               <p className="text-sm text-text-sub leading-relaxed max-w-2xl">
                 Los signos vitales de Carlos se han mantenido dentro de los rangos esperados para su estadio. 
                 La ligera taquicardia observada en Jueves coincidió con un pico reportado de dolor (4/10), 
                 que fue resuelto satisfactoriamente tras el ajuste de analgesia.
               </p>
            </div>
            <div className="shrink-0 flex gap-4">
               <div className="bg-white p-4 rounded-2xl shadow-sm text-center min-w-[120px]">
                  <p className="text-[10px] font-black uppercase text-text-sub mb-1">Ritmo Promedio</p>
                  <p className="text-2xl font-bold text-text-main">70 bpm</p>
               </div>
               <div className="bg-white p-4 rounded-2xl shadow-sm text-center min-w-[120px]">
                  <p className="text-[10px] font-black uppercase text-text-sub mb-1">SpO2 Promedio</p>
                  <p className="text-2xl font-bold text-success">95.5%</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ClinicalMonitoring;
