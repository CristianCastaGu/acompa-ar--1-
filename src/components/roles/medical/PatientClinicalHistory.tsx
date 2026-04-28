/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { 
  ArrowLeft, 
  FileText, 
  FileCode, 
  File, 
  Download, 
  Eye, 
  Plus,
  Search,
  Filter
} from 'lucide-react';

interface PatientClinicalHistoryProps {
  onBack: () => void;
}

const PatientClinicalHistory: React.FC<PatientClinicalHistoryProps> = ({ onBack }) => {
  const { patient } = useAppContext();

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="text-error" />;
      case 'word': return <FileCode className="text-blue-500" />;
      default: return <File className="text-text-sub" />;
    }
  };

  return (
    <div className="h-full bg-app-bg overflow-y-auto">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-primary">Historia Clínica de Carlos</h2>
          </div>
          <button className="flex items-center gap-2 gradient-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <Plus className="w-4 h-4" />
            Subir nuevo
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-sub" />
              <input 
                placeholder="Buscar documento..."
                className="w-full bg-surface-soft pl-10 pr-4 py-2 rounded-xl text-xs outline-none"
              />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-surface-soft px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-sub">
                 <Filter className="w-3 h-3" /> Todos
              </button>
              <button className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-sub">
                 PDFs
              </button>
           </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {patient.clinicalHistory.map((doc) => (
              <motion.div 
                key={doc.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 flex items-center justify-between hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-surface-soft flex items-center justify-center text-xl">
                      {getFileIcon(doc.type)}
                   </div>
                   <div>
                      <h4 className="font-bold text-text-main text-sm">{doc.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[10px] font-bold text-text-sub uppercase tracking-wider">{doc.uploadDate.toLocaleDateString()}</span>
                         <span className="w-1 h-1 bg-gray-200 rounded-full" />
                         <span className="text-[10px] font-bold text-text-sub uppercase tracking-wider">Por: {doc.uploadedBy}</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <button className="p-2.5 bg-surface-soft text-text-sub rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                      <Eye className="w-5 h-5" />
                   </button>
                   <button className="p-2.5 bg-surface-soft text-text-sub rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                      <Download className="w-5 h-5" />
                   </button>
                </div>
              </motion.div>
            ))}

            {/* Mock extra docs */}
            <div className="p-6 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-surface-soft flex items-center justify-center text-xl">
                      <FileText className="text-error" />
                   </div>
                   <div>
                      <h4 className="font-bold text-text-main text-sm">Epicrisis_Ingreso_Marzo_2026.pdf</h4>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[10px] font-bold text-text-sub uppercase tracking-wider">12/03/2026</span>
                         <span className="w-1 h-1 bg-gray-200 rounded-full" />
                         <span className="text-[10px] font-bold text-text-sub uppercase tracking-wider">Por: Dr. Jorge Giraldo</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <button className="p-2.5 bg-surface-soft text-text-sub rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                      <Eye className="w-5 h-5" />
                   </button>
                   <button className="p-2.5 bg-surface-soft text-text-sub rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                      <Download className="w-5 h-5" />
                   </button>
                </div>
            </div>
          </div>
        </div>

        {/* Clinical Summary Note */}
        <div className="bg-primary-light/5 p-8 rounded-[32px] border border-primary-light/10 space-y-4">
           <h3 className="font-bold text-primary uppercase text-xs tracking-widest">Diagnóstico Actualizado</h3>
           <div className="space-y-4">
              <p className="text-xl font-bold text-text-main">Adenocarcinoma de pulmón metastásico</p>
              <div className="w-full bg-white/50 h-px" />
              <p className="text-sm text-text-sub leading-relaxed">
                Paciente en manejo paliativo de soporte. Objetivo: Control de síntomas (disnea/dolor) y preservación de calidad de vida emocional. 
                Sin criterios actuales para hospitalización.
              </p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default PatientClinicalHistory;
