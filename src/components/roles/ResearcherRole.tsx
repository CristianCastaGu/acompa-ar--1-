/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ResearcherDashboard from './researcher/ResearcherDashboard';
import CaseExplorer from './researcher/CaseExplorer';
import Trends from './researcher/Trends';

type ResearcherView = 'dashboard' | 'cases' | 'trends';

const ResearcherRole: React.FC = () => {
  const [view, setView] = useState<ResearcherView>('dashboard');

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
          {view === 'dashboard' && <ResearcherDashboard onViewChange={setView} />}
          {view === 'cases' && <CaseExplorer onBack={() => setView('dashboard')} />}
          {view === 'trends' && <Trends onBack={() => setView('dashboard')} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ResearcherRole;
