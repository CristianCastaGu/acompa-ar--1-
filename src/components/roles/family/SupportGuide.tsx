/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  X, 
  Info, 
  CheckCircle2,
  Stethoscope,
  Send,
  Loader2,
  Heart
} from 'lucide-react';
import { sendFamilyMessage, isAIAvailable, type ChatMessage } from '../../../services/gemini';

interface SupportGuideProps {
  onBack: () => void;
}

const SupportGuide: React.FC<SupportGuideProps> = ({ onBack }) => {
  const { patient } = useAppContext();
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Hola, soy tu guía de apoyo emocional. Entiendo que este camino puede ser difícil. ¿En qué puedo orientarte hoy?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const recommendations = [
    { 
      title: 'Espacio para el silencio', 
      content: 'Hoy Carlos se siente en paz. A veces, simplemente estar presente sin hablar es la mejor forma de acompañar.',
      source: 'Basado en el estado de Carlos esta semana'
    },
    { 
      title: 'Compartir memorias', 
      content: 'Es un buen momento para revisar juntos el álbum de vida y narrar alguna historia especial.',
      source: 'Sugerencia por uso de IA en álbum'
    },
    { 
      title: 'Cuidado propio', 
      content: 'Recuerda que para cuidar también necesitas estar bien. Tómate 15 minutos para caminar o respirar hoy.',
      source: 'Protocolo de bienestar familiar'
    }
  ];

  const buildChatHistory = (): ChatMessage[] => {
    return messages.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.text }],
    }));
  };

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;
    const userMsg = inputText;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setIsTyping(true);

    if (isAIAvailable()) {
      try {
        const history = buildChatHistory();
        const aiResponse = await sendFamilyMessage(history, userMsg);
        setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      } catch {
        setMessages(prev => [...prev, { role: 'ai', text: 'Disculpa, tuve un problema para responder. ¿Puedes intentar de nuevo?' }]);
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const responses = [
        "Es completamente normal sentirse agotado en este proceso. ¿Tienes a alguien con quien compartir la carga hoy?",
        "Entiendo tu preocupación. Es valioso que quieras lo mejor para Carlos. ¿Has notado algún cambio físico que te preocupe?",
        "La comunicación honesta es clave. Te sugiero hablar con el equipo médico sobre esto en la próxima visita.",
        "Te envío mucha fortaleza. No olvides que también eres importante en este proceso."
      ];
      setMessages(prev => [...prev, { role: 'ai', text: responses[Math.floor(Math.random() * responses.length)] }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="h-full bg-app-bg overflow-y-auto">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-primary">Guía de acompañamiento</h2>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-12 pb-24">
        {/* Recommendations Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" /> Sugerencias hoy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <h4 className="font-bold text-primary">{rec.title}</h4>
                  <p className="text-sm text-text-sub leading-relaxed">{rec.content}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-text-sub/60 tracking-widest">{rec.source}</span>
                  <button className="text-primary hover:bg-primary/5 p-1 rounded-full"><CheckCircle2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Support Chat Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary-light" /> Apoyo familiar personalizado
          </h3>
          <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden flex flex-col h-[500px]">
             <div className="p-4 bg-surface-soft border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-white">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-sm font-bold">Guía de Familia IA</span>
                    <p className="text-[10px] text-success font-black uppercase">Especialista en duelo y cuidado</p>
                  </div>
                </div>
                <div className="bg-accent-warm/10 px-3 py-1 rounded-full flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-accent-warm rounded-full" />
                   <span className="text-[10px] font-bold text-accent-warm uppercase">Apoyo Emocional</span>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-app-bg/10">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-text-main border border-gray-100 shadow-sm rounded-bl-none'}`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary-light animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-primary-light animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 bg-primary-light animate-bounce delay-200" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
             </div>

             <div className="p-4 bg-white border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-2">
                  <input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="¿Necesitas orientación o quieres desahogarte?"
                    className="flex-1 bg-surface-soft p-3 rounded-xl outline-none text-sm placeholder:text-text-sub/50"
                  />
                  <button 
                    onClick={handleSend}
                    className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                   <p className="text-[10px] text-text-sub font-medium flex items-center gap-1">
                     <Stethoscope className="w-3 h-3" /> Este asistente es apoyo emocional. Consulta al médico para decisiones clínicas.
                   </p>
                   <button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 text-primary font-bold text-xs hover:underline bg-primary/5 px-4 py-2 rounded-lg"
                   >
                     📞 Contactar al médico
                   </button>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-primary">Equipo Médico de Carlos</h3>
                  <button onClick={() => setIsContactModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-surface-soft p-4 rounded-2xl flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                       <Stethoscope className="text-primary w-6 h-6" />
                     </div>
                     <div>
                       <h4 className="font-bold text-text-main">Dra. Ana Lucía Restrepo</h4>
                       <p className="text-xs text-text-sub">Médico Líder</p>
                     </div>
                  </div>
                  <div className="bg-surface-soft p-4 rounded-2xl flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                       <Phone className="text-primary w-6 h-6" />
                     </div>
                     <div>
                       <h4 className="font-bold text-text-main">+57 320 000 0000</h4>
                       <p className="text-xs text-text-sub">Línea de Urgencias 24h</p>
                     </div>
                  </div>
                </div>

                <div className="p-4 bg-accent-warm/5 rounded-2xl border border-accent-warm/10">
                   <p className="text-xs text-accent-warm leading-relaxed">
                     Llama inmediatamente si notas dificultad respiratoria súbita o dolor que no cede.
                   </p>
                </div>

                <button 
                  onClick={() => setIsContactModalOpen(false)}
                  className="w-full gradient-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportGuide;
