/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PatientData, EmotionalState } from './types';

export const INITIAL_PATIENT_DATA: PatientData = {
  id: 'pt-001',
  name: 'Carlos Mendoza',
  age: 68,
  diagnosis: 'Cáncer de pulmón avanzado',
  daysInCare: 45,
  currentEmotionalState: 'peace',
  emotionHistory: [
    { date: new Date(2026, 3, 20), state: 'anxious' },
    { date: new Date(2026, 3, 21), state: 'neutral' },
    { date: new Date(2026, 3, 22), state: 'calm' },
    { date: new Date(2026, 3, 23), state: 'peace' },
    { date: new Date(2026, 3, 24), state: 'neutral' },
    { date: new Date(2026, 3, 25), state: 'calm' },
    { date: new Date(2026, 3, 26), state: 'peace' },
  ],
  album: [
    {
      id: 'ph-001',
      url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1000',
      narrative: 'Esta foto fue tomada el día de tu graduación. En ella se puede ver tu sonrisa y a tu familia abrazándote.',
      storyForm: 'Era un día de julio, el sol brillaba fuerte cuando me puse la toga por primera vez. Mi mamá lloraba de alegría y yo intentaba no llorar también...',
      category: 'Achievement',
      includedInBook: true,
      date: new Date(1982, 6, 15)
    },
    {
      id: 'ph-002',
      url: 'https://images.unsplash.com/photo-1543269664-7eef42226a21?auto=format&fit=crop&q=80&w=1000',
      narrative: 'Un viaje inolvidable con Elena a Cartagena. La brisa del mar y la comida típica los hacían muy felices.',
      category: 'Travel',
      includedInBook: true,
      date: new Date(2005, 11, 10)
    },
  ],
  messages: [
    {
      id: 'msg-001',
      senderId: 'pt-001',
      recipientId: 'fam-hijo',
      type: 'text',
      content: 'Miguel, estoy orgulloso del hombre en el que te has convertido.',
      timestamp: new Date(),
      isLocked: true
    }
  ],
  visits: [
    {
      id: 'vis-001',
      date: new Date(2026, 3, 27, 10, 30),
      doctorName: 'Dra. Ana Lucía Restrepo',
      duration: 45,
      aiFaceAnalysis: 'Expresión facial: Tranquilidad con algo de fatiga. Nivel de malestar estimado: Bajo (3/10).',
      manualEmotionScore: 7,
      vitals: {
        respiratoryRate: 18,
        heartRate: 72,
        bloodPressure: '120/80',
        spo2: 96,
        temp: 36.5,
        painLevel: 2,
        consciousness: 'Alerta',
        mobility: 'Con ayuda'
      },
      medication: [
        { name: 'Morfina', dose: '5mg c/4h' },
        { name: 'Haloperidol', dose: '1mg noche' }
      ],
      clinicalNotes: 'Paciente se encuentra estable emocionalmente. Reporta leve dolor en región lumbar que cede con medicación.',
      diagnosis: 'Cáncer broncopulmonar estadio IV',
      carePlan: 'Continuar con analgesia reglada y apoyo emocional por IA.'
    }
  ],
  clinicalHistory: [
    { id: 'doc-001', name: 'Biopsia_Pulmonar_2025.pdf', type: 'pdf', uploadDate: new Date(2025, 5, 12), uploadedBy: 'Dr. Jorge Giraldo' }
  ],
  alerts: [
    {
      id: 'alt-001',
      type: 'important',
      category: 'emotion',
      message: 'Cambio emocional detectado: Mayor tranquilidad hoy.',
      timestamp: new Date(),
      resolved: false
    }
  ]
};

export const FAMILY_MEMBERS = [
  { id: 'fam-esposa', name: 'Elena (Esposa)', avatar: '👩‍🦳' },
  { id: 'fam-hijo', name: 'Miguel (Hijo)', avatar: '👨' },
  { id: 'fam-hija', name: 'Sofía (Hija)', avatar: '👩' },
  { id: 'fam-madre', name: 'Carmen (Madre)', avatar: '👵' },
];
