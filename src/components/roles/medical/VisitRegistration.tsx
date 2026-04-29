  /**
   * @license
   * SPDX-License-Identifier: Apache-2.0
   */

  import React, { useState } from 'react';
  import { motion, AnimatePresence } from 'motion/react';
  import { useAppContext } from '../../../AppContext';
  import { sendImage } from "../../../services/gemini";
  import { 
    ArrowLeft, 
    Check, 
    Camera, 
    Sparkles, 
    Activity, 
    Pill, 
    FileText, 
    Calendar,
    AlertCircle,
    Loader2,
    Trash2,
    Plus
  } from 'lucide-react';

  interface VisitRegistrationProps {
    onBack: () => void;
  }

  const VisitRegistration: React.FC<VisitRegistrationProps> = ({ onBack }) => {
    const { addAlert } = useAppContext();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    
    // Form State
    const [vitals, setVitals] = useState({
      rr: '18',
      hr: '72',
      bp_sys: '120',
      bp_dia: '80',
      spo2: '96',
      temp: '36.5',
      pain: 2,
      consciousness: 'Alerta',
      mobility: 'Con ayuda'
    });

      // Función para convertir el archivo de imagen a Base64
    const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const handleImageUpload = async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const base64Image = await convertFileToBase64(file);
        // Guarda el base64 en el estado. Esto servirá para previsualizarla y para enviarla.
        setSelectedImage(base64Image); 
      } catch (error) {
        console.error("Error al convertir la imagen:", error);
        addAlert({ type: 'error', category: 'system', message: 'Error al cargar la imagen' });
      }
    };

    const [meds, setMeds] = useState([{ name: 'Morfina', dose: '5mg c/4h' }]);

    const handleAnalyze = async () => {
      if (!selectedImage) return;

      setIsAnalyzing(true);

      try {
        const prompt = `
          Eres un asistente clínico en cuidados paliativos.

          Analiza la imagen y responde:

          - Expresión facial:
          - Nivel de malestar (0-10):
          - Signos visibles:\
          - Recomendación breve:
          `;

        const reply = await sendImage({
          prompt,
          image: selectedImage
        });

        setAnalysisResult(reply);

      } catch (error) {
        console.error(error);
        setAnalysisResult("Error al analizar la imagen.");
      } finally {
        setIsAnalyzing(false);
      }
    };

    const handleSave = () => {
      // Check ranges for alerts
      if (parseInt(vitals.spo2) < 90) {
        addAlert({
          type: 'critical',
          category: 'vitals',
          message: `SpO2 bajo detectado: ${vitals.spo2}%`
        });
      }
      // toast confirmation mock
      alert("¡Registro guardado con éxito!");
      onBack();
    };

    return (
      <div className="h-full bg-app-bg overflow-y-auto">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-primary">Registrar Visita</h2>
            </div>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className={`w-8 h-1.5 rounded-full ${step >= i ? 'bg-primary' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 pb-32">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" /> Sección 1: Datos Básicos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-text-sub uppercase tracking-widest">Fecha y Hora</label>
                        <input type="text" readOnly value={new Date().toLocaleString()} className="w-full bg-surface-soft p-3 rounded-xl border-none outline-none text-sm font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-text-sub uppercase tracking-widest">Médico Responsable</label>
                        <select className="w-full bg-surface-soft p-3 rounded-xl border-none outline-none text-sm font-medium">
                          <option>Dra. Ana Lucía Restrepo</option>
                          <option>Dr. Julián Vásquez</option>
                        </select>
                      </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" /> Sección 2: Análisis Visual con IA
                  </h3>
                  <div className="space-y-6">
                    {/* Cambiamos el div por un label para que active el input file */}
                    <label className="aspect-video bg-surface-soft rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:border-primary transition-colors overflow-hidden">
                      
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                      />

                      {selectedImage ? (
                        <img src={selectedImage} className="w-full h-full object-cover" alt="Visita médica" />
                      ) : (
                        <>
                          <Camera className="w-12 h-12 text-gray-300 mb-2" />
                          <p className="text-sm text-text-sub">Tocar para cargar imagen o tomar foto</p>
                        </>
                      )}
                    </label>
                    
                    {analysisResult && (
                      <div className="p-4 bg-success/5 border border-success/20 rounded-2xl text-sm italic text-success font-medium">
                        "Result: {analysisResult}"
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleAnalyze}
                    disabled={!selectedImage || isAnalyzing}
                    className="w-full py-4 bg-primary/10 text-primary rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/20 transition-all disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analizando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Analizar estado con IA
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" /> Sección 3: Signos Vitales
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-text-sub uppercase tracking-widest">Fr (rpm)</label>
                        <input type="number" value={vitals.rr} onChange={e => setVitals({...vitals, rr: e.target.value})} className="w-full bg-surface-soft p-3 rounded-xl border-none outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-text-sub uppercase tracking-widest">Ritmo (bpm)</label>
                        <input type="number" value={vitals.hr} onChange={e => setVitals({...vitals, hr: e.target.value})} className="w-full bg-surface-soft p-3 rounded-xl border-none outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-text-sub uppercase tracking-widest">SpO2 (%)</label>
                        <input type="number" value={vitals.spo2} onChange={e => setVitals({...vitals, spo2: e.target.value})} className={`w-full bg-surface-soft p-3 rounded-xl border-none outline-none ${parseInt(vitals.spo2) < 90 ? 'ring-2 ring-error text-error' : ''}`} />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-xs font-black text-text-sub uppercase tracking-widest">Dolor (0-10)</label>
                        <input type="range" min="0" max="10" value={vitals.pain} onChange={e => setVitals({...vitals, pain: parseInt(e.target.value)})} className="w-full accent-primary" />
                        <div className="flex justify-between text-[10px] font-bold text-text-sub">
                            <span>SIN DOLOR</span>
                            <span className="text-primary text-sm">{vitals.pain}</span>
                            <span>INSUFRIBLE</span>
                        </div>
                      </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                      <Pill className="w-5 h-5 text-primary" /> Sección 4: Medicación
                  </h3>
                  <div className="space-y-4">
                      {meds.map((m, i) => (
                        <div key={i} className="flex gap-4 items-end">
                          <div className="flex-1 space-y-1">
                              <label className="text-[10px] font-black text-text-sub uppercase">Medicamento</label>
                              <input value={m.name} className="w-full bg-surface-soft p-3 rounded-xl" />
                          </div>
                          <div className="w-32 space-y-1">
                              <label className="text-[10px] font-black text-text-sub uppercase">Dosis</label>
                              <input value={m.dose} className="w-full bg-surface-soft p-3 rounded-xl" />
                          </div>
                          <button onClick={() => setMeds(meds.filter((_, idx) => idx !== i))} className="p-3 text-error hover:bg-error/10 rounded-xl">
                              <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setMeds([...meds, { name: '', dose: '' }])}
                        className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center gap-2 text-text-sub hover:border-primary/20 hover:text-primary transition-all font-bold"
                      >
                        <Plus className="w-5 h-5" /> Agregar medicamento
                      </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" /> Sección 5: Historia Clínica
                  </h3>
                  <div className="space-y-4">
                      <div className="p-6 bg-surface-soft rounded-3xl border-2 border-dashed border-gray-200 text-center">
                        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <button className="text-primary font-bold text-sm bg-white px-6 py-2 rounded-xl shadow-sm">Subir documentos (PDF, IMG)</button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-sub uppercase tracking-widest">Plan de cuidado actualizado</label>
                        <textarea className="w-full bg-surface-soft p-4 rounded-2xl outline-none min-h-[120px] text-sm" placeholder="Describe el plan a seguir..." />
                      </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" /> Sección 6: Notas Finales
                  </h3>
                  <textarea 
                    className="w-full bg-surface-soft p-6 rounded-[32px] outline-none min-h-[250px] text-base leading-relaxed" 
                    placeholder="Observaciones generales de la visita..."
                  />
                  
                  <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-start gap-4">
                      <AlertCircle className="w-6 h-6 text-primary shrink-0" />
                      <p className="text-xs text-text-sub leading-relaxed">
                        Al guardar este registro, las alertas pertinentes se enviarán al dashboard clínico y se actualizará el historial del paciente de forma instantánea.
                      </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-between items-center z-30">
            <button 
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="px-8 py-3 text-text-sub font-bold rounded-xl hover:bg-gray-100 disabled:opacity-0 transition-all font-sans uppercase tracking-widest text-xs"
            >
              Anterior
            </button>
            
            {step < 6 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="px-10 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all font-sans uppercase tracking-widest text-xs"
              >
                Siguiente
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className="px-12 py-3 bg-success text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-success/20 hover:scale-105 transition-all font-sans uppercase tracking-widest text-xs"
              >
                Guardar registro completo
              </button>
            )}
          </div>
        </main>
      </div>
    );
  };

  export default VisitRegistration;
