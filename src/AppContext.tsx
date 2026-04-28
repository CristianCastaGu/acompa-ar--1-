/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, Role, EmotionalState, PatientData, Alert } from './types';
import { INITIAL_PATIENT_DATA } from './mockData';

interface AppContextType extends AppState {
  setRole: (role: Role) => void;
  updateEmotionalState: (state: EmotionalState) => void;
  updatePatientData: (updater: (data: PatientData) => PatientData) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'resolved'>) => void;
  resolveAlert: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(null);
  const [patient, setPatient] = useState<PatientData>(INITIAL_PATIENT_DATA);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  const updateEmotionalState = (state: EmotionalState) => {
    setPatient(prev => ({
      ...prev,
      currentEmotionalState: state,
      emotionHistory: [...prev.emotionHistory, { date: new Date(), state }]
    }));
  };

  const updatePatientData = (updater: (data: PatientData) => PatientData) => {
    setPatient(prev => updater(prev));
  };

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp' | 'resolved'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `alt-${Date.now()}`,
      timestamp: new Date(),
      resolved: false
    };
    setPatient(prev => ({
      ...prev,
      alerts: [newAlert, ...prev.alerts]
    }));
  };

  const resolveAlert = (id: string) => {
    setPatient(prev => ({
      ...prev,
      alerts: prev.alerts.map(a => a.id === id ? { ...a, resolved: true } : a)
    }));
  };

  return (
    <AppContext.Provider value={{
      currentRole: role,
      currentUser: role ? { id: 'user-1', name: 'Usuario', role } : null,
      patient,
      setRole,
      updateEmotionalState,
      updatePatientData,
      addAlert,
      resolveAlert
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
