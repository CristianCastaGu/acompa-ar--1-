/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { 
  ArrowLeft, 
  Volume2, 
  Download,
  Eye
} from 'lucide-react';

interface FamilyAlbumProps {
  onBack: () => void;
}

const FamilyAlbum: React.FC<FamilyAlbumProps> = ({ onBack }) => {
  const { patient } = useAppContext();

  const handleHear = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-full bg-app-bg overflow-y-auto">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-primary">Álbum de vida de Carlos</h2>
          </div>
          <button className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all border border-primary/10">
            <Download className="w-4 h-4" />
            Descargar como PDF
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {patient.album.filter(p => p.includedInBook).map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
          >
            <div className="aspect-video overflow-hidden">
              <img src={photo.url} alt="Memory" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-2">{photo.category}</h4>
              <p className="text-sm text-text-main font-medium italic mb-6 leading-relaxed flex-1">
                "{photo.narrative}"
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <button className="flex items-center gap-2 text-text-sub hover:text-primary transition-colors text-xs font-bold">
                  <Eye className="w-4 h-4" /> Ver original
                </button>
                <button 
                  onClick={() => handleHear(photo.narrative || '')}
                  className="flex items-center gap-2 bg-surface-soft text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/10 transition-colors"
                >
                  <Volume2 className="w-4 h-4" /> Escuchar
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
};

export default FamilyAlbum;
