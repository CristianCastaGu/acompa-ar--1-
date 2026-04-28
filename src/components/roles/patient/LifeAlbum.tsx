/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { 
  ArrowLeft, 
  Plus, 
  Volume2, 
  BookOpen, 
  Eye, 
  Cloud,
  Check,
  X,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Photo } from '../../../types';

interface LifeAlbumProps {
  onBack: () => void;
}

const LifeAlbum: React.FC<LifeAlbumProps> = ({ onBack }) => {
  const { patient, updatePatientData } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isNarrativeModalOpen, setIsNarrativeModalOpen] = useState<{ open: boolean; content: string; title: string }>({
    open: false,
    content: '',
    title: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const googlePhotosMock: Partial<Photo>[] = [
    { id: 'gp-1', url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400', category: 'Travel' },
    { id: 'gp-2', url: 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=400', category: 'Love' },
    { id: 'gp-3', url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400', category: 'Family' },
    { id: 'gp-4', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400', category: 'Family' },
    { id: 'gp-5', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400', category: 'Achievement' },
    { id: 'gp-6', url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400', category: 'Love' },
  ];

  const handleHear = (text: string) => {
    // Mock TTS
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  const handleNarrate = (photo: Photo) => {
    setIsNarrativeModalOpen({
      open: true,
      title: 'Tu historia contada como cuento',
      content: photo.storyForm || `Había una vez un momento inolvidable... ${photo.narrative}`
    });
  };

  const togglePhotoInclusion = (id: string) => {
    updatePatientData(prev => ({
      ...prev,
      album: prev.album.map(p => p.id === id ? { ...p, includedInBook: !p.includedInBook } : p)
    }));
  };

  const handleGenerateNarrative = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="h-full bg-app-bg overflow-y-auto">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-primary">Mi álbum de vida</h2>
              <p className="text-xs text-text-sub font-bold uppercase tracking-wider">
                {patient.album.filter(p => p.includedInBook).length} fotos seleccionadas para tu libro
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsGoogleModalOpen(true)}
              className="hidden md:flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-text-sub hover:bg-gray-50 transition-all"
            >
              <Cloud className="w-4 h-4 text-blue-500" />
              Google Photos
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 gradient-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              Agregar foto
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {patient.album.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="aspect-square overflow-hidden relative">
                <img src={photo.url} alt="Memory" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-primary shadow-sm">
                    {photo.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform">
                  <button onClick={() => togglePhotoInclusion(photo.id)} className={`p-2 rounded-full shadow-lg transition-colors ${photo.includedInBook ? 'bg-success text-white' : 'bg-white text-gray-400'}`}>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-text-main font-medium leading-relaxed italic">
                  "{photo.narrative}"
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-surface-soft transition-colors text-text-sub">
                    <Eye className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">Ver</span>
                  </button>
                  <button 
                    onClick={() => handleHear(photo.narrative || '')}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-surface-soft transition-colors text-text-sub"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">Escuchar</span>
                  </button>
                  <button 
                    onClick={() => handleNarrate(photo)}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-surface-soft transition-colors text-text-sub"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">Narrar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* Narrate Modal */}
      <AnimatePresence>
        {isNarrativeModalOpen.open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 20, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.9 }}
              className="bg-[#FFFDF9] w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl border-8 border-accent-gold/10"
            >
              <div className="p-8 md:p-12 space-y-8 relative">
                <button 
                  onClick={() => setIsNarrativeModalOpen({ ...isNarrativeModalOpen, open: false })}
                  className="absolute top-6 right-6 p-2 hover:bg-accent-gold/10 rounded-full"
                >
                  <X className="w-6 h-6 text-accent-gold" />
                </button>
                
                <div className="text-center space-y-4">
                  <BookOpen className="w-12 h-12 text-accent-gold mx-auto" />
                  <h3 className="text-3xl font-serif font-bold text-accent-gold">{isNarrativeModalOpen.title}</h3>
                </div>

                <div className="markdown-body text-lg text-text-main font-serif leading-loose first-letter:text-5xl first-letter:font-bold first-letter:text-accent-gold first-letter:mr-3 first-letter:float-left">
                  {isNarrativeModalOpen.content}
                </div>

                <div className="flex justify-center">
                  <button 
                    onClick={() => handleHear(isNarrativeModalOpen.content)}
                    className="flex items-center gap-2 bg-accent-gold text-white px-8 py-3 rounded-full font-bold shadow-xl shadow-accent-gold/20 hover:scale-105 transition-all"
                  >
                    <Volume2 className="w-5 h-5" />
                    Leer en voz alta
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Photos Modal */}
      <AnimatePresence>
        {isGoogleModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Cloud className="w-8 h-8 text-blue-500" />
                    <h3 className="text-2xl font-bold text-text-main">Tus fotos en Google</h3>
                  </div>
                  <button onClick={() => setIsGoogleModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {googlePhotosMock.map((photo) => (
                    <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100">
                      <img src={photo.url} alt="Google" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="bg-white text-primary text-xs font-black uppercase px-3 py-1.5 rounded-lg hover:scale-110 transition-transform">
                          Incluir en libro
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Photo Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-primary">Agregar nuevo recuerdo</h3>
                  <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="aspect-video bg-surface-soft rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                  <Plus className="w-12 h-12 text-gray-300" />
                  <p className="text-sm text-text-sub font-medium">Subir imagen</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-sub uppercase tracking-widest">Contexto del recuerdo</label>
                    <textarea 
                      placeholder="¿Qué estaba pasando aquí? ¿Quiénes te acompañaban?"
                      className="w-full bg-surface-soft p-4 rounded-xl outline-none border border-transparent focus:border-primary/20 transition-all min-h-[100px] text-sm"
                    />
                  </div>
                  
                  <button 
                    onClick={handleGenerateNarrative}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 bg-primary/5 text-primary border border-primary/20 py-3 rounded-xl font-bold hover:bg-primary/10 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {isGenerating ? 'Generando narrative...' : 'Generar narrativa con IA'}
                  </button>
                </div>

                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-full gradient-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20"
                >
                  Guardar en mi álbum
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LifeAlbum;
