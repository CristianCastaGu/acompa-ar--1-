/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useAppContext } from './AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Heart, 
  Stethoscope, 
  Search,
  LogOut,
  Bell,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';
import RoleSelection from './components/RoleSelection';
import PatientRole from './components/roles/PatientRole';
import FamilyRole from './components/roles/FamilyRole';
import MedicalRole from './components/roles/MedicalRole';
import ResearcherRole from './components/roles/ResearcherRole';

function MainContent() {
  const { currentRole, setRole, currentUser } = useAppContext();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const getRoleName = (role: string | null) => {
    switch (role) {
      case 'patient': return 'Paciente';
      case 'family': return 'Familia';
      case 'medical': return 'Médico / Enfermero';
      case 'researcher': return 'Investigador';
      default: return '';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-app-bg text-text-main'}`}>
      {!currentRole ? (
        <RoleSelection />
      ) : (
        <div className="flex flex-col h-screen">
          <header className={`h-16 px-4 md:px-8 flex items-center justify-between border-b ${isDarkMode ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'} backdrop-blur-md sticky top-0 z-50`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-primary">ACOMPAÑAR</h1>
                <p className={`text-[10px] font-medium uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-text-sub'}`}>
                  {getRoleName(currentRole)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="relative">
                <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
                </button>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold">{currentUser?.name}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-text-sub'}`}>Online</p>
                </div>
                <button 
                  onClick={() => setRole(null)}
                  className={`p-2 rounded-full text-error transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRole}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                {currentRole === 'patient' && <PatientRole />}
                {currentRole === 'family' && <FamilyRole />}
                {currentRole === 'medical' && <MedicalRole />}
                {currentRole === 'researcher' && <ResearcherRole />}
              </motion.div>
            </AnimatePresence>
          </main>

          <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary-light text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40 group">
            <HelpCircle className="w-6 h-6" />
            <div className="absolute right-14 bg-white text-text-main px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 whitespace-nowrap text-sm pointer-events-none transition-opacity font-medium">
              ¿Necesitas ayuda?
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
