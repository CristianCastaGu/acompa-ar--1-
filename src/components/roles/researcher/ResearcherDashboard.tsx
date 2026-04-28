/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  TrendingUp, 
  Database, 
  ShieldCheck, 
  BarChart, 
  Activity,
  ArrowRight
} from 'lucide-react';

interface ResearcherDashboardProps {
  onViewChange: (view: 'dashboard' | 'cases' | 'trends') => void;
}

const ResearcherDashboard: React.FC<ResearcherDashboardProps> = ({ onViewChange }) => {
  const kpis = [
    { label: 'Reducción Soledad', value: '42%', icon: <Users className="text-primary-light" />, color: 'bg-primary-light/10' },
    { label: 'Satisfacción Familiar', value: '9.4/10', icon: <Activity className="text-accent-gold" />, color: 'bg-accent-gold/10' },
    { label: 'Casos Anonimados', value: '128', icon: <ShieldCheck className="text-success" />, color: 'bg-success/10' },
    { label: 'Alertas Atendidas', value: '98%', icon: <Database className="text-primary" />, color: 'bg-primary/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
      <header>
        <h2 className="text-3xl font-bold text-primary">Dashboard de Investigación</h2>
        <p className="text-text-sub font-medium">Analíticas globales y tendencias clínicas.</p>
      </header>

      {/* Global Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Casos', value: '156' },
          { label: 'Activos', value: '48' },
          { label: 'Cerrados', value: '108' },
          { label: 'Días promedio', value: '62' },
        ].map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
             <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">{m.label}</p>
             <p className="text-3xl font-bold text-text-main">{m.value}</p>
          </div>
        ))}
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-2xl ${kpi.color} flex items-center justify-center shrink-0`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-sub mb-1">{kpi.label}</p>
              <p className="text-xl font-bold text-text-main">{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button 
          onClick={() => onViewChange('cases')}
          className="group bg-white p-10 rounded-[40px] shadow-xl border border-transparent hover:border-primary/20 transition-all text-left flex flex-col justify-between h-80"
        >
          <div className="space-y-4">
             <div className="w-16 h-16 rounded-[24px] bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search size={32} />
             </div>
             <h3 className="text-2xl font-bold text-text-main">Explorar Casos Anonimizados</h3>
             <p className="text-text-sub text-sm leading-relaxed">
               Accede a la base de datos de casos clínicos para estudiar trayectorias emocionales y respuestas a intervenciones.
             </p>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
            Comenzar análisis <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </div>
        </button>

        <button 
          onClick={() => onViewChange('trends')}
          className="group bg-white p-10 rounded-[40px] shadow-xl border border-transparent hover:border-primary-light/20 transition-all text-left flex flex-col justify-between h-80"
        >
          <div className="space-y-4">
             <div className="w-16 h-16 rounded-[24px] bg-primary-light/10 text-primary-light flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart size={32} />
             </div>
             <h3 className="text-2xl font-bold text-text-main">Ver Tendencias Globales</h3>
             <p className="text-text-sub text-sm leading-relaxed">
               Visualiza predicciones basadas en IA y correlaciones entre signos vitales y bienestar psicológico.
             </p>
          </div>
          <div className="flex items-center gap-2 text-primary-light font-bold uppercase tracking-widest text-xs">
            Ver reportes <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </div>
        </button>
      </div>

      <div className="p-8 bg-surface-soft rounded-[32px] border border-gray-100 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-light border border-primary-light/20">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-text-sub max-w-xl">
              Todos los datos presentados en este panel han sido estrictamente anonimizados bajo el estándar <strong>HIPAA / GDPR</strong> de protección de datos clínicos.
            </p>
         </div>
         <button className="hidden lg:block text-xs font-black uppercase bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
            Exportar datos (CSV/JSON)
         </button>
      </div>
    </div>
  );
};

export default ResearcherDashboard;
