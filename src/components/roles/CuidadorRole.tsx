import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CuidadorDashboard from './caregiver/CuidadorDashboard';
import PatientObservationForm from './caregiver/PatientObservationForm';
import BurnoutAssessment from './caregiver/BurnoutAssessment';
import AlgorithmRecommendationView from './caregiver/AlgorithmRecommendationView';
import PatientManagement from './caregiver/PatientManagement';

type CaregiverView = 'dashboard' | 'observation' | 'burnout' | 'recommendation' | 'patients';

const CuidadorRole: React.FC = () => {
  const [view, setView] = useState<CaregiverView>('patients');

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
          {view === 'dashboard' && (
            <CuidadorDashboard onViewChange={setView} />
          )}
          {view === 'patients' && (
            <PatientManagement
              onBack={() => setView('dashboard')}
              onWorkWithPatient={() => setView('dashboard')}
            />
          )}
          {view === 'observation' && (
            <PatientObservationForm
              onBack={() => setView('dashboard')}
              onComplete={() => setView('recommendation')}
            />
          )}
          {view === 'burnout' && (
            <BurnoutAssessment onBack={() => setView('dashboard')} />
          )}
          {view === 'recommendation' && (
            <AlgorithmRecommendationView onBack={() => setView('dashboard')} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CuidadorRole;
