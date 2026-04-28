/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { FAMILY_MEMBERS } from '../../../mockData';
import { 
  ArrowLeft, 
  PenTool, 
  Mic, 
  Trash2, 
  Play, 
  Square, 
  Check,
  ChevronRight,
  User,
  CheckCircle2
} from 'lucide-react';

interface FamilyMessagesProps {
  onBack: () => void;
}

const FamilyMessages: React.FC<FamilyMessagesProps> = ({ onBack }) => {
  const { patient, updatePatientData } = useAppContext();
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'text' | 'audio' | null>(null);
  const [textMessage, setTextMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const getRecipientStatus = (id: string) => {
    const msg = patient.messages.find(m => m.recipientId === id);
    if (!msg) return 'Sin mensaje';
    return msg.type === 'text' ? '✅ Mensaje escrito' : '🎤 Audio guardado';
  };

  const handleSaveMessage = () => {
    if (!selectedRecipient) return;
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: patient.id,
      recipientId: selectedRecipient,
      type: editorMode || 'text',
      content: editorMode === 'text' ? textMessage : 'Audio URL Mock',
      timestamp: new Date()
    };
    updatePatientData(prev => ({
      ...prev,
      messages: [...prev.messages.filter(m => m.recipientId !== selectedRecipient), newMessage as any]
    }));
    setEditorMode(null);
    setTextMessage('');
  };

  const handleDeleteMessage = (recipientId: string) => {
    updatePatientData(prev => ({
      ...prev,
      messages: prev.messages.filter(m => m.recipientId !== recipientId)
    }));
  };

  return (
    <div className="h-full bg-app-bg overflow-y-auto">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-primary">Mensajes para la familia</h2>
              <p className="text-xs text-text-sub font-bold uppercase tracking-wider">
                Has dejado mensajes para {patient.messages.length} de {FAMILY_MEMBERS.length} personas
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {!selectedRecipient ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAMILY_MEMBERS.map((member) => {
              const status = getRecipientStatus(member.id);
              return (
                <motion.button
                  key={member.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => setSelectedRecipient(member.id)}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-surface-soft flex items-center justify-center text-3xl group-hover:bg-primary-light/10 transition-colors">
                      {member.avatar}
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-text-main text-lg">{member.name}</h3>
                      <p className={`text-xs font-bold uppercase tracking-widest ${status.includes('✅') || status.includes('🎤') ? 'text-success' : 'text-text-sub'}`}>
                        {status}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                </motion.button>
              );
            })}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <button 
              onClick={() => setSelectedRecipient(null)}
              className="flex items-center gap-2 text-text-sub hover:text-primary font-bold text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Cambiar destinatario
            </button>

            <div className="bg-white p-8 rounded-[32px] shadow-xl space-y-8">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-2xl bg-surface-soft flex items-center justify-center text-4xl">
                  {FAMILY_MEMBERS.find(m => m.id === selectedRecipient)?.avatar}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-main">
                    Para: {FAMILY_MEMBERS.find(m => m.id === selectedRecipient)?.name}
                  </h3>
                  <p className="text-text-sub">¿Qué quieres que sepa en este mensaje?</p>
                </div>
              </div>

              {!editorMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setEditorMode('text')}
                    className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-gray-100 rounded-3xl hover:border-primary/30 hover:bg-primary/5 transition-all group"
                  >
                    <PenTool className="w-10 h-10 text-primary-light group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-text-main">Escribir mensaje</span>
                  </button>
                  <button 
                    onClick={() => setEditorMode('audio')}
                    className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-gray-100 rounded-3xl hover:border-accent-warm/30 hover:bg-accent-warm/5 transition-all group"
                  >
                    <Mic className="w-10 h-10 text-accent-warm group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-text-main">Grabar audio</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {editorMode === 'text' ? (
                    <div className="space-y-4">
                      <textarea 
                        value={textMessage}
                        onChange={(e) => setTextMessage(e.target.value)}
                        placeholder="Escribe lo que quieres que sepa..."
                        className="w-full bg-surface-soft p-6 rounded-2xl outline-none focus:ring-2 ring-primary/20 transition-all min-h-[200px] text-lg font-medium leading-relaxed"
                      />
                    </div>
                  ) : (
                    <div className="bg-surface-soft p-12 rounded-2xl flex flex-col items-center gap-8 text-center">
                      <div className="space-y-2">
                        <div className="text-4xl font-mono font-bold text-text-main">
                          00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}
                        </div>
                        <p className="text-xs font-black uppercase text-text-sub tracking-widest">
                          {isRecording ? 'Grabando mensaje...' : 'Listo para grabar'}
                        </p>
                      </div>

                      {/* Waveform Mock */}
                      <div className="flex items-center gap-1.5 h-16 w-full max-w-sm justify-center">
                        {[1,3,4,8,4,3,1,2,5,9,10,6,4,3,2,5,8,4,2,1].map((h, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 rounded-full transition-all duration-300 ${isRecording ? 'bg-error animate-pulse' : 'bg-gray-300'}`} 
                            style={{ height: isRecording ? `${h * 10}%` : '8px' }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => {
                            setIsRecording(!isRecording);
                            if (!isRecording) {
                              const interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
                              (window as any).recInterval = interval;
                            } else {
                              clearInterval((window as any).recInterval);
                            }
                          }}
                          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-error text-white scale-110 shadow-2xl shadow-error/30' : 'bg-white text-error border-4 border-error hover:bg-error/5'}`}
                        >
                          {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                        </button>
                        
                        {!isRecording && recordingTime > 0 && (
                          <button 
                            onClick={() => {
                              setRecordingTime(0);
                              setEditorMode(null);
                            }}
                            className="bg-white text-gray-400 p-4 rounded-full hover:bg-gray-50 flex items-center gap-2 text-sm font-bold"
                          >
                            <Trash2 className="w-5 h-5" /> Descartar
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setEditorMode(null)}
                      className="flex-1 py-4 text-text-sub font-bold hover:bg-gray-100 transition-colors uppercase tracking-widest text-xs"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleSaveMessage}
                      className="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      {editorMode === 'text' ? 'Guardar mensaje' : 'Guardar audio'}
                    </button>
                  </div>
                </div>
              )}

              {/* Existing Message Preview */}
              {patient.messages.some(m => m.recipientId === selectedRecipient) && !editorMode && (
                <div className="pt-8 border-t border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-text-main uppercase tracking-widest">Tienes un mensaje guardado</h4>
                  <div className="bg-surface-soft p-6 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {patient.messages.find(m => m.recipientId === selectedRecipient)?.type === 'text' ? <PenTool className="text-primary" /> : <Mic className="text-accent-warm" />}
                      <span className="font-medium text-text-main">
                        {patient.messages.find(m => m.recipientId === selectedRecipient)?.type === 'text' ? 'Mensaje escrito' : 'Mensaje de voz'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setEditorMode(patient.messages.find(m => m.recipientId === selectedRecipient)?.type as any)}
                        className="p-3 text-primary hover:bg-primary/5 rounded-xl text-sm font-bold"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteMessage(selectedRecipient)}
                        className="p-3 text-error hover:bg-error/5 rounded-xl"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default FamilyMessages;
