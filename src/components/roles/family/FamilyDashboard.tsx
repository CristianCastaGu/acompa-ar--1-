/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { 
  Heart, 
  Image, 
  Mail, 
  Book, 
  ShieldQuestion, 
  ChevronRight,
  Bell
} from 'lucide-react';

interface FamilyDashboardProps {
  onViewChange: (view: 'dashboard' | 'album' | 'messages' | 'guide' | 'book') => void;
}

const FamilyDashboard: React.FC<FamilyDashboardProps> = ({ onViewChange }) => {
  const { patient } = useAppContext();

  const getEmotionIcon = (state: string) => {
    switch (state) {
      case 'peace': return '🌿';
      case 'calm': return '😌';
      case 'anxious': return '😰';
      default: return '🙂';
    }
  };

  const menuItems = [
    { 
      id: 'album', 
      title: 'Ver álbum de vida', 
      icon: <Image className="w-6 h-6" />, 
      color: 'bg-primary-light',
      description: 'Explora las fotos y narrativas que Carlos ha compartido.'
    },
    { 
      id: 'messages', 
      title: 'Mensajes de Carlos', 
      icon: <Mail className="w-6 h-6" />, 
      color: 'bg-accent-warm',
      description: 'Lee o escucha las palabras que tiene para ti.'
    },
    { 
      id: 'book', 
      title: 'Libro de vida', 
      icon: <Book className="w-6 h-6" />, 
      color: 'bg-accent-gold',
      description: 'Navega por la historia completa de Carlos en formato digital.'
    },
    { 
      id: 'guide', 
      title: 'Guía de acompañamiento', 
      icon: <ShieldQuestion className="w-6 h-6" />, 
      color: 'bg-primary',
      description: 'Recibe orientación de IA basada en el estado actual de Carlos.'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      <header className="flex justify-between items-start">
        <div className="space-y-2">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-bold text-primary"
          >
            Familia García
          </motion.h2>
          <p className="text-text-sub font-medium leading-relaxed">
            Acompañando a Carlos en este camino.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <Bell className="w-4 h-4 text-accent-warm" />
          <span className="text-xs font-bold text-text-main">2 actualizaciones nuevas</span>
        </div>
      </header>

      {/* Patient State Feed */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-xl border-l-[12px] border-primary-light"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary-light/10 rounded-full flex items-center justify-center text-5xl">
              {getEmotionIcon(patient.currentEmotionalState)}
            </div>
            <div>
              <p className="text-sm font-bold text-text-sub uppercase tracking-widest mb-1">Estado de Carlos hoy</p>
              <h3 className="text-2xl font-bold text-text-main">
                Hoy Carlos se siente <span className="text-primary-light capitalize">{patient.currentEmotionalState === 'peace' ? 'en paz' : patient.currentEmotionalState}</span> {getEmotionIcon(patient.currentEmotionalState)}
              </h3>
            </div>
          </div>
          <div className="shrink-0">
             <div className="bg-surface-soft px-4 py-2 rounded-xl border border-primary/10 flex items-center gap-2">
               <Heart className="w-4 h-4 text-primary fill-primary" />
               <span className="text-xs font-black text-primary uppercase">Estable</span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      {patient.messages.length > 0 && (
        <div className="bg-accent-gold/10 border border-accent-gold/20 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 bg-accent-gold rounded-full animate-pulse" />
          <p className="text-sm font-medium text-text-main">
            Carlos actualizó su <span className="font-bold underline cursor-pointer" onClick={() => onViewChange('book')}>Libro de Vida</span> 💚
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

export default FamilyDashboard;
