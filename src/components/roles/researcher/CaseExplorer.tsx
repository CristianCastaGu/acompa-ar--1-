/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Filter, ChevronRight, Activity, Heart, Clock, Download, Brain } from 'lucide-react';

interface CaseExplorerProps {
  onBack: () => void;
}

const CaseExplorer: React.FC<CaseExplorerProps> = ({ onBack }) => {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const cases = [
    { id: '001', diagnosis: 'Cáncer pulmón IV', age: '60-70', duration: '90 días', outcome: 'Cerrado' },
    { id: '002', diagnosis: 'Alzheimer avanzado', age: '80+', duration: '120 días', outcome: 'Activo' },
    { id: '003', diagnosis: 'Insuficiencia Renal', age: '70-80', duration: '45 días', outcome: 'Activo' },
    { id: '004', diagnosis: 'EPOC avanzado', age: '60-70', duration: '200 días', outcome: 'Cerrado' },
    { id: '005', diagnosis: 'Cáncer pancreático', age: '50-60', duration: '30 días', outcome: 'Cerrado' },
  ];

  const timelineData = [
    { week: 'Semana 12', state: 'Paz', color: 'bg-success', vits: 'Estables', intervention: 'Soporte Psicológico' },
    { week: 'Semana 8', state: 'Aceptación', color: 'bg-accent-gold', vits: 'Monitorizados', intervention: 'Álbum de vida iniciado' },
    { week: 'Semana 4', state: 'Angustia', color: 'bg-accent-warm', vits: 'Inestables', intervention: 'Ajuste de analgesia radical' },
    { week: 'Semana 1', state: 'Shock', color: 'bg-error', vits: 'Alerta', intervention: 'Ingreso a plataforma' },
  ];

  return (
    <div className="h-full bg-app-bg overflow-y-auto">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-primary">Explorador de Casos</h2>
          </div>
          {selectedCase && (
             <button className="flex items-center gap-2 bg-text-main text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-black/10 transition-all">
                <Download className="w-4 h-4" /> Exportar Reporte PDF
             </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
        {/* Cases List */}
        <div className={`space-y-6 transition-all duration-300 ${selectedCase ? 'lg:w-1/3' : 'w-full'}`}>
           <div className="flex items-center gap-2 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
             <Search className="w-4 h-4 text-text-sub ml-2" />
             <input placeholder="Filtrar casos..." className="text-sm outline-none bg-transparent w-full" />
             <Filter className="w-4 h-4 text-text-sub mr-2" />
           </div>

           <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
             {cases.map((c) => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedCase(c.id)}
                  className={`w-full p-6 text-left hover:bg-primary/5 transition-all flex items-center justify-between group ${selectedCase === c.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                >
                  <div className="space-y-1">
                     <span className="text-[10px] font-black uppercase text-text-sub tracking-widest">Paciente #{c.id}</span>
                     <h4 className="font-bold text-text-main">{c.diagnosis}</h4>
                     <div className="flex gap-2 text-[10px] font-bold text-text-sub uppercase">
                        <span>{c.age}</span> • <span>{c.duration}</span>
                     </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${selectedCase === c.id ? 'text-primary' : 'text-gray-300 group-hover:translate-x-1'}`} />
                </button>
             ))}
           </div>
        </div>

        {/* Case Detail */}
        <AnimatePresence mode="wait">
          {selectedCase ? (
            <motion.div 
              key={selectedCase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 space-y-8"
            >
               <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 space-y-8">
                  <header className="flex justify-between items-start">
                     <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-text-main">Línea de Tiempo Clínica: Caso #{selectedCase}</h3>
                        <p className="text-sm text-text-sub italic">Trayectoria completa desde el ingreso hasta el desenlace.</p>
                     </div>
                     <div className="px-4 py-1.5 bg-success/10 text-success rounded-full text-[10px] font-black uppercase tracking-widest">
                        Anonimizado
                     </div>
                  </header>

                  <div className="relative border-l-2 border-primary/10 ml-4 py-4 pl-10 space-y-10">
                     {timelineData.map((item, idx) => (
                        <div key={idx} className="relative">
                           <div className={`absolute -left-[50px] top-0 w-8 h-8 rounded-full ${item.color} border-4 border-white shadow-md`} />
                           <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                 <h5 className="font-black text-xs text-text-sub uppercase tracking-wider">{item.week}</h5>
                                 <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${item.color}/10 ${item.color.replace('bg-', 'text-')}`}>
                                    {item.state}
                                 </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="bg-surface-soft p-3 rounded-xl flex items-center gap-3">
                                    <Activity className="w-4 h-4 text-primary" />
                                    <div className="text-[10px] uppercase font-bold text-text-sub">Signos: <span className="text-text-main">{item.vits}</span></div>
                                 </div>
                                 <div className="bg-surface-soft p-3 rounded-xl flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <div className="text-[10px] uppercase font-bold text-text-sub">Intervención: <span className="text-text-main">{item.intervention}</span></div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                     <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-4">
                        <h4 className="font-bold text-primary flex items-center gap-2">
                           <Brain className="w-5 h-5" /> Aprendizajes de este caso
                        </h4>
                        <p className="text-sm text-text-sub leading-relaxed italic">
                          "En este caso, la transición temprana al uso de narrativas asistidas por IA (Semana 8) 
                          previno una crisis depresiva mayor tras un deterioro agudo de los signos vitales. 
                          Se registra un 40% de mayor éxito en la aceptación cuando el paciente deja mensajes 
                          personalizados a su familia antes de la fase de terminalidad estricta."
                        </p>
                     </div>
                  </div>
               </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-50 bg-white/50 rounded-[40px] border-2 border-dashed border-gray-200">
               <Database className="w-20 h-20 text-gray-300" />
               <p className="text-xl font-medium text-text-sub">Selecciona un caso para explorar su trayectoria clínica.</p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const Database = ({ className }: { className: string }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;

export default CaseExplorer;
