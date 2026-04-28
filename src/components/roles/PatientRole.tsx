/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import PatientDashboard from './patient/PatientDashboard';
import AIAssistant from './patient/AIAssistant';
import LifeAlbum from './patient/LifeAlbum';
import FamilyMessages from './patient/FamilyMessages';
import PatientHistory from './patient/PatientHistory';
import { motion, AnimatePresence } from 'motion/react';

type PatientView = 'dashboard' | 'chat' | 'album' | 'messages' | 'history';

const PatientRole: React.FC = () => {
  const [view, setView] = useState<PatientView>('dashboard');

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
          {view === 'dashboard' && <PatientDashboard onViewChange={setView} />}
          {view === 'chat' && <AIAssistant onBack={() => setView('dashboard')} />}
          {view === 'album' && <LifeAlbum onBack={() => setView('dashboard')} />}
          {view === 'messages' && <FamilyMessages onBack={() => setView('dashboard')} />}
          {view === 'history' && <PatientHistory onBack={() => setView('dashboard')} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PatientRole;
