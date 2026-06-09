/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import {
  AlertCircle,
  ChevronRight,
  User,
  Clock,
  Bell,
  Search,
  Filter,
  Brain
} from 'lucide-react';

interface MedicalDashboardProps {
  onViewChange: (view: 'dashboard' | 'profile' | 'visit' | 'monitoring' | 'emotional' | 'clinical' | 'algorithm') => void;
}

const MedicalDashboard: React.FC<MedicalDashboardProps> = ({ onViewChange }) => {
  const { patient, resolveAlert, managedPatients } = useAppContext();
  const [search, setSearch] = useState('');

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
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar paciente..."
                className="bg-white border border-gray-200 pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:ring-2 ring-primary/20 transition-all w-full md:w-64"
              />
           </div>
           <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
              <Filter className="w-5 h-5 text-text-sub" />
           </button>
        </div>
      </header>

      {/* Algorithm Recommendation Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary/5 border border-primary/15 rounded-[24px] p-5 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-0.5">Algoritmo ACOMPAÑAR</p>
            <p className="font-bold text-text-main text-sm">Recomendación terapéutica basada en DSM-5 + perfil del paciente</p>
            <p className="text-xs text-text-sub">El cuidador ingresa el perfil · El algoritmo recomienda · El médico valida</p>
          </div>
        </div>
        <button
          onClick={() => onViewChange('algorithm')}
          className="flex items-center gap-1 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shrink-0"
        >
          Ver recomendación <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

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
                  <button
                    onClick={() => onViewChange('profile')}
                    className="text-[10px] font-black uppercase bg-surface-soft px-3 py-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    Ver perfil
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Patients List */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-text-sub uppercase tracking-widest flex items-center gap-2">
          <User className="w-4 h-4" /> Pacientes ({managedPatients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.diagnosis.toLowerCase().includes(search.toLowerCase())).length})
        </h3>
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-soft">
              <tr>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-sub">Paciente</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-sub">Estado</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-sub">Diagnóstico</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-sub">Registrado</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-sub">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {managedPatients
                .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.diagnosis.toLowerCase().includes(search.toLowerCase()))
                .map((p) => (
                <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${p.status === 'active' ? 'bg-success' : 'bg-gray-300'}`} />
                      <div>
                        <span className="font-bold text-text-main">{p.name}</span>
                        <span className="ml-2 text-[10px] text-text-sub font-medium">{p.age} años</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${p.status === 'active' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-400'}`}>
                      {p.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-text-sub italic">{p.diagnosis}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-medium text-text-sub">
                      <Clock className="w-3.5 h-3.5" /> {p.createdAt.toLocaleDateString('es-CO')}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={() => onViewChange('profile')}
                      className="flex items-center gap-1 text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                    >
                      Ver Perfil <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {managedPatients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-text-sub text-sm">
                    No hay pacientes registrados aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicalDashboard;
