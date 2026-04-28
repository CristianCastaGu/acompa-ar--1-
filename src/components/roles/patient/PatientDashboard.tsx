/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { MessageCircle, Image, Mail, Clock, ChevronRight } from 'lucide-react';

interface PatientDashboardProps {
  onViewChange: (view: 'dashboard' | 'chat' | 'album' | 'messages' | 'history') => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ onViewChange }) => {
  const { patient } = useAppContext();

  const getEmotionPhrase = (state: string) => {
    switch (state) {
      case 'peace': return 'Te encuentras en un momento de paz profunda.';
      case 'calm': return 'Hoy tu corazón se siente tranquilo.';
      case 'neutral': return 'Un día para estar presente y observar.';
      case 'anxious': return 'Es normal sentir ansiedad, estamos aquí contigo.';
      case 'sad': return 'Permítete sentir, no estás solo en tu tristeza.';
      case 'motivated': return 'Tienes una energía especial hoy, ¡aprovéchala!';
      default: return 'Estamos aquí para acompañarte.';
    }
  };

  const menuItems = [
    { 
      id: 'chat', 
      title: 'Hablar con mi acompañante IA', 
      icon: <MessageCircle className="w-6 h-6" />, 
      color: 'bg-primary',
      description: 'Conversa, cuéntame tus historias o simplemente desahógate.'
    },
    { 
      id: 'album', 
      title: 'Mi álbum de vida', 
      icon: <Image className="w-6 h-6" />, 
      color: 'bg-primary-light',
      description: 'Revive tus momentos más preciados y dales una narrativa única.'
    },
    { 
      id: 'messages', 
      title: 'Mensajes para la familia', 
      icon: <Mail className="w-6 h-6" />, 
      color: 'bg-accent-gold',
      description: 'Deja palabras de amor y audios para tus seres queridos.'
    },
    { 
      id: 'history', 
      title: 'Mi historial', 
      icon: <Clock className="w-6 h-6" />, 
      color: 'bg-text-sub',
      description: 'Mira cómo ha sido tu camino emocional en las últimas semanas.'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      <header className="space-y-2">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl font-bold text-primary"
        >
          Hola, {patient.name.split(' ')[0]}.
        </motion.h2>
        <p className="text-xl text-text-sub font-medium">Estamos aquí contigo.</p>
      </header>

      {/* Seasonal / Emotional Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-xl border border-primary/10 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-primary-light/10 rounded-full flex items-center justify-center text-5xl">
            {patient.currentEmotionalState === 'peace' ? '🌿' : 
             patient.currentEmotionalState === 'calm' ? '😌' : 
             patient.currentEmotionalState === 'anxious' ? '😰' : '🙂'}
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-text-main mb-1">
              Estado de hoy: <span className="text-primary capitalize">{patient.currentEmotionalState}</span>
            </h3>
            <p className="text-text-sub italic">"{getEmotionPhrase(patient.currentEmotionalState)}"</p>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      {patient.alerts.filter(a => !a.resolved).length > 0 && (
        <div className="bg-accent-warm/10 border border-accent-warm/20 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 bg-accent-warm rounded-full animate-pulse" />
          <p className="text-sm font-medium text-accent-warm">
            Tienes un mensaje nuevo de tu equipo médico.
          </p>
        </div>
      )}

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item, idx) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewChange(item.id as any)}
            className="bg-white p-6 rounded-3xl shadow-lg border border-transparent hover:border-primary/20 text-left flex items-start gap-4 group transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl ${item.color} text-white flex items-center justify-center shrink-0`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1 text-text-main group-hover:text-primary transition-colors">{item.title}</h4>
              <p className="text-sm text-text-sub leading-snug">{item.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors mt-1" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
