/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MedicalDashboard from './medical/MedicalDashboard';
import PatientProfile from './medical/PatientProfile';
import VisitRegistration from './medical/VisitRegistration';
import ClinicalMonitoring from './medical/ClinicalMonitoring';
import EmotionalHistory from './medical/EmotionalHistory';
import PatientClinicalHistory from './medical/PatientClinicalHistory';

type MedicalView = 'dashboard' | 'profile' | 'visit' | 'monitoring' | 'emotional' | 'clinical';

const MedicalRole: React.FC = () => {
  const [view, setView] = useState<MedicalView>('dashboard');

  return (
    <div className="h-full bg-app-bg relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {view === 'dashboard' && <MedicalDashboard onViewChange={setView} />}
          {view === 'profile' && <PatientProfile onViewChange={setView} onBack={() => setView('dashboard')} />}
          {view === 'visit' && <VisitRegistration onBack={() => setView('profile')} />}
          {view === 'monitoring' && <ClinicalMonitoring onBack={() => setView('profile')} />}
          {view === 'emotional' && <EmotionalHistory onBack={() => setView('profile')} />}
          {view === 'clinical' && <PatientClinicalHistory onBack={() => setView('profile')} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MedicalRole;
