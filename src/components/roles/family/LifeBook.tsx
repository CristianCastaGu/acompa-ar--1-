/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft, 
  Volume2, 
  Printer, 
  Download,
  BookOpen,
  Calendar,
  Heart,
  Quote
} from 'lucide-react';

interface LifeBookProps {
  onBack: () => void;
}

const LifeBook: React.FC<LifeBookProps> = ({ onBack }) => {
  const { patient } = useAppContext();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    // Page 0: Cover
    { 
      type: 'cover',
      title: `Libro de Vida de ${patient.name}`,
      photo: patient.album[0]?.url,
      quote: "La vida no se mide por las veces que respiras, sino por los momentos que te dejan sin aliento."
    },
    // Page 1: Who am I
    {
      type: 'text',
      title: 'Quién Soy',
      content: `Nací en una Colombia llena de retos, pero siempre encontré en mi familia el motor para salir adelante. Mi diagnóstico de ${patient.diagnosis} me ha enseñado a valorar cada pequeño rayo de sol. Soy un contador de historias, un amante de la naturaleza y alguien que cree profundamente en la paz.`,
      photo: 'https://images.unsplash.com/photo-1544161515-4af6b1d4640b?w=400'
    },
    // Page 2: Moments 1
    {
       type: 'moments',
       title: 'Mis momentos',
       photos: patient.album.filter(p => p.includedInBook).slice(0, 2)
    },
    // Page 3: Moments 2
    {
        type: 'moments',
        title: 'Momentos compartidos',
        photos: patient.album.filter(p => p.includedInBook).slice(2, 4)
    },
    // Page 4: Words for Family
    {
       type: 'words',
       title: 'Mis palabras',
       messages: patient.messages
    },
    // Page 5: Legacy
    {
        type: 'legacy',
        title: 'Mi legado',
        content: 'Mi mayor fortuna no es lo que he construido con las manos, sino el amor que dejo en sus corazones. Sigan buscando la felicidad en lo simple, cuiden el uno del otro y no olviden que siempre estaré a su lado en cada brisa y cada recuerdo.',
        finalQuote: 'Nos volveremos a encontrar en el jardín de la eternidad.'
    },
    // Page 6: Timeline
    {
        type: 'timeline',
        title: 'El hilo de mi vida',
        milestones: [
            { year: '1982', text: 'Graduación profesional', type: 'Achievement' },
            { year: '2005', text: 'Viaje a Cartagena', type: 'Travel' },
            { year: '2015', text: 'Nacimiento de mi primer nieto', type: 'Family' },
            { year: '2026', text: 'Un presente lleno de paz', type: 'Love' },
        ]
    }
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleReadPage = (content: string) => {
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-full bg-[#E5DACE] overflow-hidden flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-black/5 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-colors font-bold flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-text-sub" />
            <span className="text-sm font-bold uppercase tracking-widest text-text-sub hidden md:inline">Cerrar Libro</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-black/5 rounded-full" title="Imprimir"><Printer className="w-5 h-5 text-text-sub" /></button>
          <button className="p-2 hover:bg-black/5 rounded-full" title="Descargar PDF"><Download className="w-5 h-5 text-text-sub" /></button>
          <div className="w-px h-6 bg-black/10 mx-2" />
          <div className="text-xs font-black text-text-sub uppercase tracking-widest">Página {currentPage + 1} de {pages.length}</div>
        </div>
      </header>

      <main className="flex-1 relative flex items-center justify-center p-4 md:p-12 overflow-hidden bg-app-bg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 100, rotateY: 45 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: -45 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="w-full max-w-4xl aspect-[3/4] md:aspect-[4/3] bg-[#FFFBF0] rounded-lg shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.3)] border-r-8 border-accent-gold/20 relative overflow-hidden"
            style={{ perspective: '1500px' }}
          >
            {/* Center fold */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/5 z-10" />
            
            {/* Page Content */}
            <div className="h-full grid grid-cols-1 md:grid-cols-2">
               {/* Left Page (Visual) */}
               <div className="hidden md:flex flex-col p-12 border-r border-black/5 items-center justify-center bg-white/30">
                  {pages[currentPage].type === 'cover' ? (
                     <div className="text-center space-y-6">
                        <div className="aspect-[3/4] w-full max-w-[280px] bg-white p-2 shadow-xl rotate-[-2deg]">
                            <img src={pages[currentPage].photo} className="w-full h-full object-cover" />
                        </div>
                        <Quote className="w-10 h-10 text-accent-gold/40 mx-auto" />
                     </div>
                  ) : pages[currentPage].type === 'text' ? (
                      <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                          <img src={pages[currentPage].photo} className="w-full h-full object-cover" />
                      </div>
                  ) : pages[currentPage].type === 'moments' ? (
                      <div className="space-y-6 flex flex-col items-center">
                          {pages[currentPage].photos?.slice(0, 1).map(p => (
                            <div key={p.id} className="aspect-video w-full bg-white p-1 shadow-lg rotate-2">
                                <img src={p.url} className="w-full h-full object-cover" />
                            </div>
                          ))}
                          <Heart className="w-12 h-12 text-error/20" />
                      </div>
                  ) : pages[currentPage].type === 'words' ? (
                      <div className="grid grid-cols-2 gap-4 w-full">
                         {Array.from({length: 4}).map((_, i) => (
                             <div key={i} className="aspect-square bg-accent-gold/10 rounded-xl flex items-center justify-center text-accent-gold/20">
                                <Heart className="w-8 h-8 fill-current" />
                             </div>
                         ))}
                      </div>
                  ) : (
                      <BookOpen className="w-32 h-32 text-accent-gold/10" />
                  )}
               </div>

               {/* Right Page (Content) */}
               <div className="p-8 md:p-14 flex flex-col justify-center font-serif">
                  {pages[currentPage].type === 'cover' ? (
                    <div className="text-center space-y-8">
                       <h1 className="text-4xl md:text-5xl font-black text-primary leading-tight font-sans tracking-tight">
                        {pages[currentPage].title}
                       </h1>
                       <div className="w-16 h-1 bg-accent-gold mx-auto" />
                       <p className="text-lg italic text-text-sub font-serif leading-relaxed px-4">
                         "{pages[currentPage].quote}"
                       </p>
                       <div className="pt-12">
                          <button onClick={handleNext} className="bg-primary text-white p-4 rounded-full shadow-lg animate-bounce">
                             <ArrowRight className="w-6 h-6" />
                          </button>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                         <h3 className="text-2xl font-bold text-accent-gold tracking-tight">{pages[currentPage].title}</h3>
                         <button onClick={() => handleReadPage(pages[currentPage].content || '')} className="p-2 hover:bg-accent-gold/10 rounded-full text-accent-gold">
                             <Volume2 className="w-5 h-5" />
                         </button>
                       </div>

                       {pages[currentPage].type === 'text' && (
                         <p className="text-lg text-text-main leading-loose first-letter:text-4xl first-letter:font-bold first-letter:text-accent-gold first-letter:mr-2">
                            {pages[currentPage].content}
                         </p>
                       )}

                       {pages[currentPage].type === 'moments' && (
                         <div className="space-y-6">
                            {pages[currentPage].photos?.map(p => (
                                <div key={p.id} className="space-y-2">
                                    <p className="text-sm italic font-medium">"{p.narrative}"</p>
                                    <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-text-sub opacity-50">
                                        <Calendar className="w-3 h-3" /> {p.date.getFullYear()}
                                    </div>
                                </div>
                            ))}
                         </div>
                       )}

                       {pages[currentPage].type === 'words' && (
                          <div className="space-y-8">
                             {pages[currentPage].messages?.slice(0, 2).map((m: any) => (
                                <div key={m.id} className="space-y-2 relative pl-6 border-l-2 border-accent-gold/30">
                                   <div className="absolute left-0 top-0 text-accent-gold -translate-x-1/2 bg-[#FFFBF0] px-1">
                                      <Heart className="w-4 h-4 fill-current" />
                                   </div>
                                   <h5 className="font-bold text-sm text-text-main uppercase tracking-widest">Para: {m.recipientId.split('-')[1]}</h5>
                                   <p className="text-base italic">"{m.type === 'text' ? m.content : 'Mensaje de voz...'}"</p>
                                </div>
                             ))}
                             {pages[currentPage].messages?.length === 0 && (
                                 <p className="text-sm italic text-text-sub">Carlos aún no ha dejado mensajes escritos.</p>
                             )}
                          </div>
                       )}

                       {pages[currentPage].type === 'legacy' && (
                          <div className="space-y-8">
                             <p className="text-xl leading-relaxed italic text-primary font-bold">
                                "{pages[currentPage].content}"
                             </p>
                             <div className="pt-4 border-t border-accent-gold/20">
                                <p className="text-center font-bold text-accent-gold">
                                    {pages[currentPage].finalQuote}
                                </p>
                             </div>
                          </div>
                       )}

                       {pages[currentPage].type === 'timeline' && (
                          <div className="space-y-6 relative ml-4 pl-8 border-l border-accent-gold/30">
                              {pages[currentPage].milestones?.map((m: any, idx: number) => (
                                  <div key={idx} className="relative">
                                      <div className="absolute -left-[37px] top-1 w-3 h-3 rounded-full bg-accent-gold" />
                                      <span className="text-xs font-black text-accent-gold">{m.year}</span>
                                      <p className="text-sm font-bold text-text-main">{m.text}</p>
                                  </div>
                              ))}
                          </div>
                       )}
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Overlays */}
        <button 
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="absolute left-4 md:left-24 top-1/2 -translate-y-1/2 p-4 md:p-6 bg-white/20 hover:bg-white/40 text-text-main rounded-full backdrop-blur-md disabled:opacity-0 transition-all z-20"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={handleNext}
          disabled={currentPage === pages.length - 1}
          className="absolute right-4 md:right-24 top-1/2 -translate-y-1/2 p-4 md:p-6 bg-white/20 hover:bg-white/40 text-text-main rounded-full backdrop-blur-md disabled:opacity-0 transition-all z-20"
        >
          <ArrowRight className="w-8 h-8" />
        </button>
      </main>

      <footer className="p-4 bg-white/30 backdrop-blur-sm flex justify-center gap-2">
        {pages.map((_, i) => (
           <button 
             key={i} 
             onClick={() => setCurrentPage(i)}
             className={`w-2.5 h-2.5 rounded-full transition-all ${currentPage === i ? 'bg-primary scale-125' : 'bg-black/10'}`}
           />
        ))}
      </footer>
    </div>
  );
};

export default LifeBook;
