import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import {
  ClipboardList,
  Heart,
  Brain,
  AlertTriangle,
  ChevronRight,
  User,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';

type CaregiverView = 'dashboard' | 'observation' | 'burnout' | 'recommendation' | 'patients';

interface Props {
  onViewChange: (view: CaregiverView) => void;
}

const CuidadorDashboard: React.FC<Props> = ({ onViewChange }) => {
  const { patient, algorithmProfile, therapeuticRecommendation, addAlert, managedPatients, activeManagedPatient } = useAppContext();

  const handleEmergencyAlert = () => {
    addAlert({
      type: 'critical',
      category: 'emotion',
      message: `🚨 ALERTA DE EMERGENCIA: El cuidador ha solicitado atención urgente para ${patient.name}.`,
    });
    alert(`Alerta de emergencia enviada al equipo médico para ${patient.name}.\nEl médico de guardia será notificado en menos de 5 minutos.`);
  };

  const emotionLabels: Record<string, { label: string; emoji: string; color: string }> = {
    sad:       { label: 'Triste',    emoji: '😔', color: 'text-blue-500' },
    anxious:   { label: 'Ansioso',   emoji: '😰', color: 'text-yellow-500' },
    neutral:   { label: 'Neutral',   emoji: '😐', color: 'text-gray-500' },
    calm:      { label: 'Tranquilo', emoji: '🙂', color: 'text-green-500' },
    peace:     { label: 'En paz',    emoji: '😌', color: 'text-primary' },
    motivated: { label: 'Con ánimo', emoji: '💪', color: 'text-accent-gold' },
  };

  const emotion = emotionLabels[patient.currentEmotionalState] ?? emotionLabels.neutral;

  const activeCount = managedPatients.filter(p => p.status === 'active').length;

  const actionCards = [
    {
      view: 'patients' as CaregiverView,
      icon: <Users className="w-7 h-7" />,
      title: 'Mis Pacientes',
      description: 'Gestiona la lista de pacientes, agrega nuevos y elige con cuál trabajar.',
      color: 'bg-blue-50 text-blue-600',
      badge: activeManagedPatient ? `Trabajando con ${activeManagedPatient.name.split(' ')[0]}` : `${activeCount} activos`,
      badgeColor: activeManagedPatient ? 'bg-success/10 text-success' : 'bg-blue-50 text-blue-600',
    },
    {
      view: 'observation' as CaregiverView,
      icon: <ClipboardList className="w-7 h-7" />,
      title: 'Registrar Observación',
      description: 'Captura el estado clínico, emocional y físico del paciente para el algoritmo.',
      color: 'bg-primary/10 text-primary',
      badge: algorithmProfile ? '✓ Actualizado' : 'Pendiente',
      badgeColor: algorithmProfile ? 'bg-success/10 text-success' : 'bg-accent-gold/10 text-accent-gold',
    },
    {
      view: 'burnout' as CaregiverView,
      icon: <Heart className="w-7 h-7" />,
      title: 'Evaluar mi Bienestar',
      description: 'Escala ZARIT para medir tu nivel de sobrecarga como cuidador.',
      color: 'bg-rose-50 text-rose-500',
      badge: 'Autocuidado',
      badgeColor: 'bg-rose-50 text-rose-500',
    },
    {
      view: 'recommendation' as CaregiverView,
      icon: <Brain className="w-7 h-7" />,
      title: 'Ver Recomendación',
      description: 'Consulta la modalidad terapéutica recomendada por el algoritmo para este paciente.',
      color: 'bg-purple-50 text-purple-600',
      badge: therapeuticRecommendation ? '✓ Disponible' : 'Sin datos aún',
      badgeColor: therapeuticRecommendation ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-400',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Panel del Cuidador</h2>
          <p className="text-text-sub font-medium">Eres la puerta de entrada al sistema de acompañamiento.</p>
        </div>
        <button
          onClick={handleEmergencyAlert}
          className="flex items-center gap-2 px-5 py-3 bg-error text-white rounded-2xl font-bold shadow-lg hover:bg-error/90 active:scale-95 transition-all"
        >
          <AlertTriangle className="w-5 h-5" />
          Alerta de Emergencia
        </button>
      </header>

      {/* Patient Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-6 flex flex-col md:flex-row md:items-center gap-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-surface-soft flex items-center justify-center shrink-0">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-2xl font-bold text-text-main">{patient.name}</h3>
            <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-widest">
              Paciente activo
            </span>
          </div>
          <p className="text-text-sub text-sm font-medium">{patient.diagnosis} · {patient.age} años · {patient.daysInCare} días en cuidado</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-surface-soft rounded-2xl">
          <span className="text-3xl">{emotion.emoji}</span>
          <div>
            <p className="text-[10px] text-text-sub font-black uppercase tracking-widest">Estado actual</p>
            <p className={`text-sm font-bold ${emotion.color}`}>{emotion.label}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Activity className="w-5 h-5" />, label: 'Alertas activas', value: patient.alerts.filter(a => !a.resolved).length.toString(), color: 'text-error' },
          { icon: <Clock className="w-5 h-5" />, label: 'Días en cuidado', value: patient.daysInCare.toString(), color: 'text-primary' },
          { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Visitas registradas', value: patient.visits.length.toString(), color: 'text-success' },
          { icon: <Brain className="w-5 h-5" />, label: 'Perfil algoritmo', value: algorithmProfile ? 'Completo' : 'Pendiente', color: algorithmProfile ? 'text-success' : 'text-accent-gold' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100">
            <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
            <p className="text-lg font-black text-text-main">{stat.value}</p>
            <p className="text-[11px] text-text-sub font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Algorithm Recommendation Banner */}
      {therapeuticRecommendation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary/5 border border-primary/20 rounded-[24px] p-5 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-0.5">Algoritmo ACOMPAÑAR</p>
              <p className="font-bold text-text-main">{therapeuticRecommendation.modalityName}</p>
              <p className="text-xs text-text-sub">Confianza: {therapeuticRecommendation.confidenceScore}% · {therapeuticRecommendation.sessionFrequency} · {therapeuticRecommendation.sessionType.replace(/_/g, ' ')}</p>
            </div>
          </div>
          <button
            onClick={() => onViewChange('recommendation')}
            className="flex items-center gap-1 text-primary font-bold text-sm hover:underline shrink-0"
          >
            Ver <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Suicidal Alert Banner */}
      {therapeuticRecommendation?.suicidalAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-error/10 border border-error/30 rounded-[24px] p-5 flex items-center gap-4"
        >
          <AlertCircle className="w-8 h-8 text-error shrink-0" />
          <div>
            <p className="font-bold text-error">⚠️ Alerta de Ideación Suicida Detectada</p>
            <p className="text-sm text-text-sub">El sistema ha detectado indicadores de riesgo. El médico ha sido notificado. Mantén presencia continua con el paciente.</p>
          </div>
        </motion.div>
      )}

      {/* Action Cards */}
      <div>
        <h3 className="text-sm font-black text-text-sub uppercase tracking-widest mb-4">Acciones disponibles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {actionCards.map((card, idx) => (
            <motion.button
              key={card.view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onViewChange(card.view)}
              className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 text-left flex flex-col gap-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                  {card.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-lg ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-text-main mb-1">{card.title}</h4>
                <p className="text-xs text-text-sub leading-relaxed">{card.description}</p>
              </div>
              <div className="flex items-center gap-1 text-primary text-xs font-bold">
                Abrir <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      {patient.alerts.filter(a => !a.resolved).length > 0 && (
        <div>
          <h3 className="text-sm font-black text-text-sub uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Alertas recientes
          </h3>
          <div className="space-y-3">
            {patient.alerts.filter(a => !a.resolved).slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border ${
                  alert.type === 'critical' ? 'bg-error/5 border-error/20' :
                  alert.type === 'important' ? 'bg-accent-gold/5 border-accent-gold/20' :
                  'bg-primary/5 border-primary/20'
                }`}
              >
                <AlertCircle className={`w-5 h-5 shrink-0 ${
                  alert.type === 'critical' ? 'text-error' :
                  alert.type === 'important' ? 'text-accent-gold' : 'text-primary'
                }`} />
                <p className="text-sm font-medium text-text-main flex-1">{alert.message}</p>
                <span className="text-[10px] text-text-sub font-medium shrink-0">
                  {new Date(alert.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CuidadorDashboard;
