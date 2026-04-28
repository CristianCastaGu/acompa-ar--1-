/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'patient' | 'family' | 'medical' | 'researcher' | null;

export type EmotionalState = 'sad' | 'anxious' | 'neutral' | 'calm' | 'peace' | 'motivated';

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  type: 'text' | 'audio';
  content: string; // text or audio url/blob mock
  timestamp: Date;
  isLocked?: boolean;
}

export interface Photo {
  id: string;
  url: string;
  narrative?: string;
  storyForm?: string;
  category: 'Family' | 'Achievement' | 'Travel' | 'Love' | 'Other';
  includedInBook: boolean;
  date: Date;
}

export interface VisitRecord {
  id: string;
  date: Date;
  doctorName: string;
  duration: number;
  aiFaceAnalysis: string;
  manualEmotionScore: number; // 1-10
  vitals: {
    respiratoryRate: number;
    heartRate: number;
    bloodPressure: string;
    spo2: number;
    temp: number;
    painLevel: number; // 0-10
    consciousness: string;
    mobility: string;
  };
  medication: { name: string; dose: string }[];
  clinicalNotes: string;
  diagnosis: string;
  carePlan: string;
}

export interface ClinicalDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'word';
  uploadDate: Date;
  uploadedBy: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'important' | 'info';
  category: 'emotion' | 'silence' | 'vitals' | 'request' | 'family';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface PatientData {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  daysInCare: number;
  currentEmotionalState: EmotionalState;
  emotionHistory: { date: Date; state: EmotionalState }[];
  album: Photo[];
  messages: Message[];
  visits: VisitRecord[];
  clinicalHistory: ClinicalDocument[];
  alerts: Alert[];
}

export interface AppState {
  currentRole: Role;
  currentUser: User | null;
  patient: PatientData;
}
