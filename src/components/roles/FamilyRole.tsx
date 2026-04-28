/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import FamilyDashboard from './family/FamilyDashboard';
import FamilyAlbum from './family/FamilyAlbum';
import CarlosMessages from './family/CarlosMessages';
import SupportGuide from './family/SupportGuide';
import LifeBook from './family/LifeBook';

type FamilyView = 'dashboard' | 'album' | 'messages' | 'guide' | 'book';

const FamilyRole: React.FC = () => {
  const [view, setView] = useState<FamilyView>('dashboard');

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
          {view === 'dashboard' && <FamilyDashboard onViewChange={setView} />}
          {view === 'album' && <FamilyAlbum onBack={() => setView('dashboard')} />}
          {view === 'messages' && <CarlosMessages onBack={() => setView('dashboard')} />}
          {view === 'guide' && <SupportGuide onBack={() => setView('dashboard')} />}
          {view === 'book' && <LifeBook onBack={() => setView('dashboard')} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FamilyRole;
