/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Download, TrendingUp, BarChart2, PieChart as PieIcon, Zap, Search } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
  PieChart, Pie
} from 'recharts';

interface TrendsProps {
  onBack: () => void;
}

const Trends: React.FC<TrendsProps> = ({ onBack }) => {
  const emotionalEvolution = [
    { name: 'Ene', value: 40 },
    { name: 'Feb', value: 35 },
    { name: 'Mar', value: 55 },
    { name: 'Abr', value: 72 },
  ];

  const toolUsage = [
    { name: 'Asistente IA', value: 450, color: '#1A6B5A' },
    { name: 'Álbum Vida', value: 320, color: '#2E9E8A' },
    { name: 'Mensajes', value: 280, color: '#E8825A' },
    { name: 'Libro Vida', value: 150, color: '#C9973A' },
  ];

  const outcomes = [
    { name: 'Fallecimiento en casa', value: 65, fill: '#1A6B5A' },
    { name: 'Hospitalización', value: 25, fill: '#E8825A' },
    { name: 'Otro', value: 10, fill: '#5A7268' },
  ];

  return (
    <div className="h-full bg-app-bg overflow-y-auto pb-12">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-primary">Tendencias Globales</h2>
          </div>
          <button className="flex items-center gap-2 bg-text-main text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-black/10 transition-all">
            <Download className="w-4 h-4" /> Reporte de Tendencias PDF
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Emotional Evolution */}
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                 <TrendingUp className="w-5 h-5 text-primary" /> Índice de Paz Promedio
              </h3>
              <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={emotionalEvolution}>
                       <defs>
                          <linearGradient id="pazGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#1A6B5A" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#1A6B5A" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                       <YAxis hide domain={[0, 100]} />
                       <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                       <Area type="monotone" dataKey="value" stroke="#1A6B5A" strokeWidth={4} fill="url(#pazGradient)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Tool Usage */}
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                 <BarChart2 className="w-5 h-5 text-primary" /> Herramientas más Utlizadas
              </h3>
              <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={toolUsage}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                       <YAxis hide />
                       <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                       <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                          {toolUsage.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Pie Chart Outcomes */}
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6 lg:col-span-1">
              <h3 className="font-bold text-text-main flex items-center gap-2">
                 <PieIcon className="w-5 h-5 text-primary" /> Distribución de Desenlaces
              </h3>
              <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie 
                          data={outcomes} 
                          innerRadius={50} 
                          outerRadius={70} 
                          paddingAngle={5} 
                          dataKey="value"
                        >
                          {outcomes.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                 {outcomes.map((o, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                       <span className="flex items-center gap-2 text-text-sub font-bold uppercase tracking-widest">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: o.fill }} /> {o.name}
                       </span>
                       <span className="font-black text-text-main">{o.value}%</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Insights Block */}
           <div className="lg:col-span-2 bg-[#1C2B27] p-10 rounded-[40px] text-white space-y-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                    <Zap className="w-8 h-8 text-accent-gold" />
                    <h3 className="text-2xl font-bold">Insight IA de Correlación</h3>
                 </div>
                 <div className="space-y-6">
                    <p className="text-lg text-white/80 leading-relaxed font-medium italic">
                      "Los pacientes con <strong>SpO2 estable</strong> (+94%) que utilizan el álbum de vida al menos 
                      3 veces por semana muestran un <strong>40% menos</strong> de episodios de angustia aguda reportados 
                      en visitas domiciliarias."
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Confianza del Análisis</p>
                          <p className="text-xl font-bold text-success">96%</p>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Impacto sugerido</p>
                          <p className="text-xl font-bold text-accent-gold">Alto</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-surface-soft p-12 rounded-[40px] border border-gray-100 flex flex-col md:flex-row items-center gap-8">
           <div className="shrink-0 p-6 bg-white rounded-3xl shadow-md">
              <Search size={48} className="text-primary-light" />
           </div>
           <div className="space-y-4">
              <h4 className="text-2xl font-bold text-text-main">¿Necesitas un reporte personalizado?</h4>
              <p className="text-text-sub text-sm leading-relaxed max-w-2xl">
                Nuestro motor de IA puede generar reportes de correlación cruzada entre cualquier par de variables 
                de la plataforma (clínicas, emocionales o de uso) preservando el anonimato.
              </p>
              <button className="bg-primary-light text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-primary-light/20">
                Solicitar análisis avanzado
              </button>
           </div>
        </div>
      </main>
    </div>
  );
};

export default Trends;
