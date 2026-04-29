/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { sendMessage } from "../../../services/gemini"; // adjust path if needed
import { 
  ArrowLeft, 
  Send, 
  Mic, 
  Camera, 
  X,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { EmotionalState } from '../../../types';
import { sendPatientMessage, isAIAvailable, type ChatMessage } from '../../../services/gemini';

interface AIAssistantProps {
  onBack: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onBack }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { updateEmotionalState } = useAppContext();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string, type?: 'text' | 'audio'}[]>([
    { role: 'ai', text: 'Hola, Carlos. Estoy aquí para escucharte. ¿Cómo te sientes en este momento?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const emotionOptions: { state: EmotionalState; label: string; emoji: string }[] = [
    { state: 'sad', label: 'Triste', emoji: '😔' },
    { state: 'anxious', label: 'Ansioso', emoji: '😰' },
    { state: 'neutral', label: 'Neutral', emoji: '😐' },
    { state: 'calm', label: 'Tranquilo', emoji: '🙂' },
    { state: 'peace', label: 'En paz', emoji: '😌' },
    { state: 'motivated', label: 'Con ánimo', emoji: '💪' },
  ];

  const getInitialMessage = (state: EmotionalState) => {
  switch (state) {
    case 'sad':
      return 'Siento que estés pasando por un momento difícil. Estoy aquí contigo. ¿Quieres contarme qué te está pesando más hoy?';
    case 'anxious':
      return 'Estoy contigo. Vamos paso a paso. ¿Qué es lo que más te está generando ansiedad ahora?';
    case 'calm':
      return 'Qué bueno saber que estás en calma. ¿Hay algo bonito que quieras explorar o compartir hoy?';
    case 'peace':
      return 'Me alegra ver que estás en paz. ¿Quieres profundizar en cómo llegaste a este estado?';
    case 'motivated':
      return 'Esa energía se siente bien 💪 ¿En qué te gustaría enfocarte hoy?';
    default:
      return 'Gracias por contarme cómo te sientes. Estoy aquí para acompañarte.';
    }
  };

  const handleEmotionSelect = (state: EmotionalState) => {
    setSelectedEmotion(state);
    updateEmotionalState(state);
    setHasCheckedIn(true);

    const initialAIMessage = getInitialMessage(state);

    setMessages([
      { role: 'ai', text: initialAIMessage }
    ]);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText;

    // Build updated message list FIRST (avoid stale state bug)
    const updatedMessages = [
      ...messages,
      { role: 'user' as const, text: userMsg }
    ];

    // Update UI immediately
    setMessages(updatedMessages);
    setInputText('');

    try {
      setIsLoading(true);

      // Send FULL conversation (not just last message)
      const reply = await sendMessage(updatedMessages, selectedEmotion);;

      // Add AI response
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: reply }
      ]);

    } catch (error) {
      console.error(error);

      setMessages(prev => [
        ...prev,
        { role: 'ai', text: "Lo siento, tuve un problema al responder. Intenta de nuevo." }
      ]);
    } finally {
      setIsLoading(false);
    }
};
  

  const handleMicPress = () => setIsRecording(true);
  const handleMicRelease = async () => {
    setIsRecording(false);
    setMessages(prev => [...prev, { role: 'user', text: 'Mensaje de voz enviado', type: 'audio' }]);
    setIsThinking(true);

    if (isAIAvailable()) {
      try {
        const history = buildChatHistory();
        const aiResponse = await sendPatientMessage(
          history,
          '(El paciente envió un mensaje de voz. Responde como si lo hubieras escuchado, con empatía.)'
        );
        setMessages(prev => [...prev, { role: 'ai', text: `Escuché tu mensaje de voz. ${aiResponse}` }]);
      } catch {
        setMessages(prev => [...prev, { role: 'ai', text: 'Escuché tu mensaje de voz. Gracias por compartir tu voz conmigo.' }]);
      }
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: 'Escuché tu mensaje de voz. Gracias por compartir tu voz conmigo.' }]);
      }, 1000);
    }
    setIsThinking(false);
  };

  if (!hasCheckedIn) {
    return (
      <div className="h-full flex flex-col p-6 items-center justify-center bg-surface-soft">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <header>
            <h2 className="text-3xl font-bold text-primary mb-2">¿Cómo te sientes hoy?</h2>
            <p className="text-text-sub">Registra tu estado para que podamos acompañarte mejor.</p>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {emotionOptions.map((opt) => (
              <motion.button
                key={opt.state}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEmotionSelect(opt.state)}
                className="bg-white p-6 rounded-3xl shadow-md flex flex-col items-center gap-2 hover:border-primary border-2 border-transparent transition-all"
              >
                <span className="text-4xl">{opt.emoji}</span>
                <span className="text-sm font-bold text-text-main">{opt.label}</span>
              </motion.button>
            ))}
          </div>

          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-text-sub hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Regresar al dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <header className="h-16 px-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-sub" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div>
              <h3 className="font-bold text-text-main line-clamp-1">Mi Acompañante</h3>
              <p className="text-[10px] text-success font-bold uppercase tracking-wider">
                {isAIAvailable() ? 'Gemini 2.0 Flash · En línea' : 'Modo offline'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-app-bg/30"
      >
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-white text-text-main rounded-bl-none border border-gray-100'
            }`}>
              {msg.type === 'audio' ? (
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5" />
                  <div className="flex gap-1 h-4 items-center">
                    {[1,2,3,4,5,4,3,2,1].map((h, i) => (
                      <div key={i} className="w-1 bg-white/50 rounded-full" style={{ height: `${h * 4}px` }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold">Audio</span>
                </div>
              ) : (
                <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-text-sub border border-gray-100 p-4 rounded-2xl shadow-sm max-w-[80%]">
                <p className="text-sm">Escribiendo...</p>
              </div>
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-3 text-text-sub hover:bg-gray-100 rounded-2xl transition-colors shrink-0"
          >
            <Camera className="w-6 h-6" />
          </button>
          
          <div className="flex-1 bg-surface-soft rounded-2xl border border-gray-100 p-1 flex items-end">
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Escribe algo aquí..."
              className="w-full bg-transparent p-3 outline-none resize-none text-sm md:text-base"
              disabled={isThinking}
            />
            {inputText.trim() ? (
              <button 
                onClick={handleSend}
                disabled={isThinking}
                className="p-3 text-primary hover:scale-110 transition-transform disabled:opacity-50"
              >
                <Send className="w-6 h-6" />
              </button>
            ) : (
              <button 
                onMouseDown={handleMicPress}
                onMouseUp={handleMicRelease}
                onTouchStart={handleMicPress}
                onTouchEnd={handleMicRelease}
                className={`p-3 rounded-xl transition-all ${isRecording ? 'bg-error text-white scale-125' : 'text-primary hover:bg-primary/5'}`}
              >
                <Mic className="w-6 h-6" />
                {isRecording && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-error text-white text-[10px] px-2 py-1 rounded-full font-black uppercase"
                  >
                    Grabando...
                  </motion.div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* "Save Moment" Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-primary">Guardar este momento</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="aspect-video bg-surface-soft rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:border-primary transition-colors">
                    <Camera className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-sm text-text-sub">Tocar para subir foto</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-sub uppercase tracking-wider">Nota personal</label>
                    <textarea 
                      placeholder="¿Qué estás pensando o sintiendo en este momento?"
                      className="w-full bg-surface-soft p-4 rounded-xl outline-none border border-transparent focus:border-primary/20 transition-all min-h-[100px]"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full gradient-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Guardar Momento
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistant;
