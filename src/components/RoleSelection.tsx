/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../AppContext';
import { Heart, Users, Stethoscope, Search } from 'lucide-react';
import { Role } from '../types';

interface RoleCardProps {
  role: Role;
  title: string;
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, icon, description, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl flex flex-col items-center text-center group transition-all border-2 border-transparent hover:border-accent-gold/30 h-full"
  >
    <div className="w-16 h-16 rounded-2xl bg-surface-soft flex items-center justify-center mb-4 group-hover:bg-primary-light/10 transition-colors">
      <div className="text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold mb-2 text-text-main">{title}</h3>
    <p className="text-sm text-text-sub leading-relaxed">{description}</p>
  </motion.button>
);

const RoleSelection: React.FC = () => {
  const { setRole } = useAppContext();

  const roles: { role: Role; title: string; icon: React.ReactNode; description: string }[] = [
    { 
      role: 'patient', 
      title: 'Paciente', 
      icon: <Heart size={32} />, 
      description: 'Expresa tus emociones, guarda tus recuerdos y conéctate con los tuyos.' 
    },
    { 
      role: 'family', 
      title: 'Familia', 
      icon: <Users size={32} />, 
      description: 'Acompaña a tu ser querido, recibe orientación y preserva su legado.' 
    },
    { 
      role: 'medical', 
      title: 'Médico / Enfermero', 
      icon: <Stethoscope size={32} />, 
      description: 'Monitorea el bienestar emocional y clínico para un cuidado integral.' 
    },
    { 
      role: 'researcher', 
      title: 'Investigador', 
      icon: <Search size={32} />, 
      description: 'Analiza datos anonimizados para mejorar los protocolos de cuidado.' 
    },
  ];

  return (
    <div className="min-h-screen gradient-primary flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden relative">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-6xl text-center"
      >
        <div className="mb-12">
          <div className="inline-block p-4 rounded-3xl bg-white/20 backdrop-blur-md mb-6 shadow-2xl">
            <Heart className="w-12 h-12 text-white fill-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter drop-shadow-sm">ACOMPAÑAR</h1>
          <p className="text-white/90 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto">
            Tecnología con alma para los momentos que más importan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {roles.map((item, idx) => (
            <motion.div
              key={item.role}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
            >
              <RoleCard 
                {...item} 
                onClick={() => setRole(item.role)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <footer className="absolute bottom-8 text-white/60 text-sm font-medium tracking-widest uppercase">
        Cuidado Paliativo Humanizado • 2026
      </footer>
    </div>
  );
};

export default RoleSelection;
