/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { 
  ArrowLeft, 
  Calendar, 
  Activity, 
  Brain, 
  FileText, 
  Clock,
  Plus,
  TrendingUp,
  Heart,
  BarChart2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PatientProfileProps {
  onBack: () => void;
  onViewChange: (view: any) => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ onBack, onViewChange }) => {
  const { patient } = useAppContext();
  const [activeTab, setActiveTab] = useState('summary');

  const emotionalData = [
    { name: 'S1', value: 4 },
    { name: 'S2', value: 3 },
    { name: 'S3', value: 6 },
    { name: 'S4', value: 8 },
  ];

  return (
    <div className="h-full bg-app-bg overflow-y-auto">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-primary">{patient.name}</h2>
              <p className="text-xs text-text-sub font-bold uppercase tracking-wider">{patient.diagnosis}</p>
            </div>
          </div>
          <button 
            onClick={() => onViewChange('visit')}
            className="flex items-center gap-2 gradient-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            Registrar visita de hoy
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        {/* Patient Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Edad', value: `${patient.age} años`, icon: <User className="w-4 h-4" /> },
            { label: 'Días en cuidado', value: patient.daysInCare, icon: <Clock className="w-4 h-4" /> },
            { label: 'Estado Emocional', value: patient.currentEmotionalState, icon: <Heart className="w-4 h-4" />, highlight: true },
            { label: 'Última Alerta', value: 'Hace 2h', icon: <Activity className="w-4 h-4" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
               <div className="flex items-center gap-2 mb-2 text-text-sub">
                  {stat.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
               </div>
               <p className={`text-xl font-bold ${stat.highlight ? 'text-primary capitalize' : 'text-text-main'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Graphs & Analysis */}
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
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                    />
                    <Area type="monotone" dataKey="value" stroke="#1A6B5A" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-primary-light/5 p-8 rounded-[32px] border border-primary-light/10 space-y-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Brain className="w-5 h-5" /> Resumen Semanal de IA
              </h3>
              <p className="text-sm md:text-base text-text-sub leading-relaxed">
                Carlos ha mostrado una tendencia positiva hacia la aceptación. Sus conversaciones con el asistente 
                reflejan una disminución de la angustia nocturna en un 30% comparado con la semana anterior. 
                Se recomienda mantener el plan de apoyo narrativo y considerar una visita familiar extendida.
              </p>
            </div>
          </div>

          {/* Right Column: Shortcuts */}
          <div className="space-y-4">
             <h3 className="text-xs font-black text-text-sub uppercase tracking-widest pl-2">Acciones Rápidas</h3>
             {[
               { id: 'emotional', label: 'Historial Emocional', icon: <Heart className="w-5 h-5" /> },
               { id: 'monitoring', label: 'Historial de Monitoreo', icon: <Activity className="w-5 h-5" /> },
               { id: 'clinical', label: 'Historia Clínica', icon: <FileText className="w-5 h-5" /> },
               { id: 'dashboard', label: 'Registros de Visitas', icon: <Clock className="w-5 h-5" /> },
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

// Internal icons helper for this component only to avoid too many imports if needed
const User = ({ className }: { className: string }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ChevronRight = ({ className }: { className: string }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>;

export default PatientProfile;
