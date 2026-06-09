/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  AppState,
  Role,
  EmotionalState,
  PatientData,
  Alert,
  PatientAlgorithmProfile,
  TherapeuticRecommendation,
  ManagedPatient,
} from './types';
import { INITIAL_PATIENT_DATA } from './mockData';

interface AppContextType extends AppState {
  setRole: (role: Role) => void;
  updateEmotionalState: (state: EmotionalState) => void;
  updatePatientData: (updater: (data: PatientData) => PatientData) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'resolved'>) => void;
  resolveAlert: (id: string) => void;
  // Algorithm state
  algorithmProfile: PatientAlgorithmProfile | null;
  therapeuticRecommendation: TherapeuticRecommendation | null;
  setAlgorithmProfile: (profile: PatientAlgorithmProfile) => void;
  setTherapeuticRecommendation: (rec: TherapeuticRecommendation) => void;
  // Patient management (cuidador)
  managedPatients: ManagedPatient[];
  activeManagedPatient: ManagedPatient | null;
  addManagedPatient: (p: Omit<ManagedPatient, 'id' | 'createdAt'>) => void;
  setActiveManagedPatient: (p: ManagedPatient | null) => void;
  updateManagedPatientStatus: (id: string, status: 'active' | 'inactive') => void;
  setManagedPatients: (patients: ManagedPatient[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(null);
  const [patient, setPatient] = useState<PatientData>(INITIAL_PATIENT_DATA);
  const [algorithmProfile, setAlgorithmProfileState] = useState<PatientAlgorithmProfile | null>(null);
  const [therapeuticRecommendation, setTherapeuticRecommendationState] = useState<TherapeuticRecommendation | null>(null);
  const [managedPatients, setManagedPatientsState] = useState<ManagedPatient[]>([]);
  const [activeManagedPatient, setActiveManagedPatientState] = useState<ManagedPatient | null>(null);

  const setRole = (newRole: Role) => setRoleState(newRole);

  const updateEmotionalState = (state: EmotionalState) => {
    setPatient(prev => ({
      ...prev,
      currentEmotionalState: state,
      emotionHistory: [...prev.emotionHistory, { date: new Date(), state }],
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
      resolved: false,
    };
    setPatient(prev => ({
      ...prev,
      alerts: [newAlert, ...prev.alerts],
    }));
  };

  const resolveAlert = (id: string) => {
    setPatient(prev => ({
      ...prev,
      alerts: prev.alerts.map(a => (a.id === id ? { ...a, resolved: true } : a)),
    }));
  };

  const setAlgorithmProfile = (profile: PatientAlgorithmProfile) => {
    setAlgorithmProfileState(profile);
  };

  const setTherapeuticRecommendation = (rec: TherapeuticRecommendation) => {
    setTherapeuticRecommendationState(rec);
  };

  const addManagedPatient = (p: Omit<ManagedPatient, 'id' | 'createdAt'>) => {
    const newPatient: ManagedPatient = {
      ...p,
      id: `mp-${Date.now()}`,
      createdAt: new Date(),
    };
    setManagedPatientsState(prev => [newPatient, ...prev]);
  };

  const setActiveManagedPatient = (p: ManagedPatient | null) => {
    setActiveManagedPatientState(p);
  };

  const updateManagedPatientStatus = (id: string, status: 'active' | 'inactive') => {
    setManagedPatientsState(prev =>
      prev.map(p => (p.id === id ? { ...p, status } : p))
    );
  };

  const setManagedPatients = (patients: ManagedPatient[]) => {
    setManagedPatientsState(patients);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole: role,
        currentUser: role ? { id: 'user-1', name: 'Usuario', role } : null,
        patient,
        setRole,
        updateEmotionalState,
        updatePatientData,
        addAlert,
        resolveAlert,
        algorithmProfile,
        therapeuticRecommendation,
        setAlgorithmProfile,
        setTherapeuticRecommendation,
        managedPatients,
        activeManagedPatient,
        addManagedPatient,
        setActiveManagedPatient,
        updateManagedPatientStatus,
        setManagedPatients,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
