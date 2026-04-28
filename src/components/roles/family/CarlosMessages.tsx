/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { 
  ArrowLeft, 
  Lock, 
  Play, 
  Pause, 
  Mic, 
  FileText,
  Volume2,
  X
} from 'lucide-react';

interface CarlosMessagesProps {
  onBack: () => void;
}

const CarlosMessages: React.FC<CarlosMessagesProps> = ({ onBack }) => {
  const { patient } = useAppContext();
  const [activeMessage, setActiveMessage] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="h-full bg-app-bg overflow-y-auto">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-primary">Palabras de Carlos</h2>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
          <p className="text-sm text-primary font-medium text-center">
            "Hay palabras que guardamos con amor para el momento indicado."
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {patient.messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group overflow-hidden relative"
            >
              {msg.isLocked && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 bg-text-main text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                    <Lock className="w-4 h-4" /> Mensaje reservado
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${msg.type === 'text' ? 'bg-primary/10 text-primary' : 'bg-accent-warm/10 text-accent-warm'}`}>
                  {msg.type === 'text' ? <FileText className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-text-main capitalize">Para: {msg.recipientId.split('-')[1]}</h4>
                  <p className="text-xs font-bold text-text-sub uppercase tracking-widest">
                    {msg.type === 'text' ? 'Mensaje escrito' : 'Mensaje de voz'} • {msg.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setActiveMessage(msg)}
                disabled={msg.isLocked}
                className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
              >
                Abrir ahora
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Message Modal */}
      <AnimatePresence>
        {activeMessage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 50, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.9 }}
              className="bg-[#FFFDF9] w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl relative p-10 border-8 border-primary/5"
            >
              <button 
                onClick={() => {
                  setActiveMessage(null);
                  setIsPlaying(false);
                }}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${activeMessage.type === 'text' ? 'bg-primary/10 text-primary' : 'bg-accent-warm/10 text-accent-warm'}`}>
                    {activeMessage.type === 'text' ? <FileText className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </div>
                  <h3 className="text-2xl font-bold text-text-main">Mensaje de Carlos</h3>
                  <p className="text-xs font-black uppercase text-text-sub tracking-widest">Dejado el {activeMessage.timestamp.toLocaleDateString()}</p>
                </div>

                {activeMessage.type === 'text' ? (
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-inner">
                    <p className="text-xl text-text-main font-serif italic leading-relaxed text-center">
                      "{activeMessage.content}"
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 h-12 justify-center">
                      {[2,5,8,4,3,6,9,2,5,7,4,3,6,8,5,2].map((h, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 rounded-full transition-all duration-300 ${isPlaying ? 'bg-accent-warm' : 'bg-gray-200'}`} 
                          style={{ height: isPlaying ? `${h * 10}%` : '8px' }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-xs font-bold text-text-sub">0:12 / 0:45</div>
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-accent-warm text-white' : 'bg-accent-warm/10 text-accent-warm'}`}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <button 
                    onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(activeMessage.content);
                        utterance.lang = 'es-ES';
                        window.speechSynthesis.speak(utterance);
                    }}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full text-xs font-bold hover:bg-primary/20 transition-all"
                  >
                    <Volume2 className="w-4 h-4" /> Escuchar lectura
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarlosMessages;
