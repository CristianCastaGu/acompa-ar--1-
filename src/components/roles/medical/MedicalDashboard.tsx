/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { 
  AlertCircle, 
  ChevronRight, 
  User, 
  Clock, 
  Activity,
  Bell,
  Search,
  Filter
} from 'lucide-react';

interface MedicalDashboardProps {
  onViewChange: (view: 'dashboard' | 'profile' | 'visit' | 'monitoring' | 'emotional' | 'clinical') => void;
}

const MedicalDashboard: React.FC<MedicalDashboardProps> = ({ onViewChange }) => {
  const { patient, resolveAlert } = useAppContext();

  // Mock patient list
  const patients = [
    { 
      ...patient, 
      statusColor: 'bg-error', // Red alert for Carlos
      lastVisit: 'Ayer, 10:30 AM',
      mainDiagnosis: 'Cáncer pulmón IV'
    },
    { 
      id: 'pt-002', 
      name: 'Marta Lucía Soto', 
      statusColor: 'bg-success', 
      lastVisit: 'Hace 3 días',
      mainDiagnosis: 'Alzheimer avanzado',
      currentEmotionalState: 'calm'
    },
    { 
      id: 'pt-003', 
      name: 'Jorge Eliécer Gaitán', 
      statusColor: 'bg-accent-gold', 
      lastVisit: 'Hoy, 08:00 AM',
      mainDiagnosis: 'Insuficiencia Renal',
      currentEmotionalState: 'neutral'
    }
  ];

  const urgencyLabels: Record<string, string> = {
    critical: '🔴 Urgente',
    important: '🟡 Importante',
    info: '🟢 Info'
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-primary">Dashboard Médico</h2>
          <p className="text-text-sub font-medium">Panel de control de cuidados paliativos.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-sub" />
              <input 
                placeholder="Buscar paciente..."
                className="bg-white border border-gray-200 pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:ring-2 ring-primary/20 transition-all w-full md:w-64"
              />
           </div>
           <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
              <Filter className="w-5 h-5 text-text-sub" />
           </button>
        </div>
      </header>

      {/* Alerts Summary */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-text-sub uppercase tracking-widest flex items-center gap-2">
          <Bell className="w-4 h-4" /> Alertas del día
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patient.alerts.filter(a => !a.resolved).map((alert) => (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4"
            >
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${alert.type === 'critical' ? 'bg-error/10 text-error' : alert.type === 'important' ? 'bg-accent-gold/10 text-accent-gold' : 'bg-primary/10 text-primary'}`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-60">{urgencyLabels[alert.type]}</span>
                  <span className="text-[10px] text-text-sub font-bold">{alert.timestamp.toLocaleTimeString()}</span>
                </div>
                <p className="text-xs font-bold text-text-main mb-3">{alert.message}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => resolveAlert(alert.id)}
                    className="text-[10px] font-black uppercase bg-surface-soft px-3 py-1.5 rounded-lg hover:bg-success/10 hover:text-success transition-all"
                  >
                    Atender
                  </button>
                  <button className="text-[10px] font-black uppercase bg-surface-soft px-3 py-1.5 rounded-lg">Ver perfil</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Patients List */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-text-sub uppercase tracking-widest flex items-center gap-2">
          <User className="w-4 h-4" /> Pacientes activos
        </h3>
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-soft">
              <tr>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-sub">Paciente</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-sub">Estado</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-sub">Diagnóstico</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-sub">Última Visita</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-sub">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${p.statusColor || 'bg-success'}`} />
                      <span className="font-bold text-text-main">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 px-3 py-1 bg-surface-soft rounded-lg w-fit">
                       <span className="text-sm">
                         {p.currentEmotionalState === 'peace' ? '🌿' : 
                          p.currentEmotionalState === 'calm' ? '😌' : 
                          p.currentEmotionalState === 'anxious' ? '😰' : '😐'}
                       </span>
                       <span className="text-xs font-bold text-text-sub capitalize">{p.currentEmotionalState === 'peace' ? 'En paz' : p.currentEmotionalState}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-text-sub italic">{p.mainDiagnosis}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-medium text-text-sub">
                      <Clock className="w-3.5 h-3.5" /> {p.lastVisit}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => p.id === 'pt-001' && onViewChange('profile')}
                      className="flex items-center gap-1 text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                    >
                      Ver Perfil <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicalDashboard;
