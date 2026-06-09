import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../../AppContext';
import { fetchSyntheticPatients } from '../../../lib/supabase';
import { ManagedPatient } from '../../../types';
import {
  Plus,
  Users,
  UserCheck,
  Search,
  ChevronRight,
  CheckCircle2,
  Circle,
  Loader2,
  X,
  Brain,
} from 'lucide-react';

interface Props {
  onBack: () => void;
  onWorkWithPatient: () => void;
}

const DISEASE_LABELS: Record<string, string> = {
  parkinson: 'Parkinson',
  ela: 'ELA',
  alzheimer: 'Alzheimer',
  huntington: 'Huntington',
  esclerosis_multiple: 'Esclerosis Múltiple',
  otra: 'Otra',
};

const FALLBACK_PATIENTS: ManagedPatient[] = [
  // Parkinson (10)
  { id: 'sp-01', name: 'Carlos Mendoza',     age: 68, diagnosis: 'Parkinson — Estadio Moderado',            neurologicalDisease: 'parkinson',          status: 'active',   createdAt: new Date('2026-01-05'), source: 'supabase' },
  { id: 'sp-02', name: 'Ana Sofía Gómez',   age: 72, diagnosis: 'Parkinson — Estadio Avanzado',             neurologicalDisease: 'parkinson',          status: 'active',   createdAt: new Date('2026-01-07'), source: 'supabase' },
  { id: 'sp-03', name: 'Ricardo Forero',     age: 65, diagnosis: 'Parkinson — Estadio Leve',                 neurologicalDisease: 'parkinson',          status: 'active',   createdAt: new Date('2026-01-09'), source: 'supabase' },
  { id: 'sp-04', name: 'Mercedes Ríos',      age: 78, diagnosis: 'Parkinson — Terminal',                     neurologicalDisease: 'parkinson',          status: 'inactive', createdAt: new Date('2026-01-11'), source: 'supabase' },
  { id: 'sp-05', name: 'Hernán Castillo',    age: 60, diagnosis: 'Parkinson — Estadio Leve',                 neurologicalDisease: 'parkinson',          status: 'active',   createdAt: new Date('2026-01-13'), source: 'supabase' },
  { id: 'sp-06', name: 'Gloria Zambrano',    age: 74, diagnosis: 'Parkinson — Estadio Avanzado',             neurologicalDisease: 'parkinson',          status: 'active',   createdAt: new Date('2026-01-15'), source: 'supabase' },
  { id: 'sp-07', name: 'Pedro Salazar',      age: 58, diagnosis: 'Parkinson — Estadio Moderado',             neurologicalDisease: 'parkinson',          status: 'active',   createdAt: new Date('2026-01-17'), source: 'supabase' },
  { id: 'sp-08', name: 'Inés Morales',       age: 70, diagnosis: 'Parkinson — Estadio Moderado',             neurologicalDisease: 'parkinson',          status: 'active',   createdAt: new Date('2026-01-19'), source: 'supabase' },
  { id: 'sp-09', name: 'Arturo Bermúdez',   age: 63, diagnosis: 'Parkinson — Estadio Leve',                  neurologicalDisease: 'parkinson',          status: 'active',   createdAt: new Date('2026-01-21'), source: 'supabase' },
  { id: 'sp-10', name: 'Cecilia Pardo',      age: 76, diagnosis: 'Parkinson — Estadio Avanzado',             neurologicalDisease: 'parkinson',          status: 'active',   createdAt: new Date('2026-01-23'), source: 'supabase' },
  // ELA (10)
  { id: 'sp-11', name: 'Julián Torres',      age: 45, diagnosis: 'ELA — Estadio Avanzado',                   neurologicalDisease: 'ela',                status: 'active',   createdAt: new Date('2026-01-25'), source: 'supabase' },
  { id: 'sp-12', name: 'Mónica Vargas',      age: 38, diagnosis: 'ELA — Estadio Moderado',                   neurologicalDisease: 'ela',                status: 'active',   createdAt: new Date('2026-01-27'), source: 'supabase' },
  { id: 'sp-13', name: 'Sebastián Cano',    age: 52, diagnosis: 'ELA — Estadio Avanzado',                    neurologicalDisease: 'ela',                status: 'active',   createdAt: new Date('2026-01-29'), source: 'supabase' },
  { id: 'sp-14', name: 'Adriana Muñoz',     age: 41, diagnosis: 'ELA — Estadio Leve',                        neurologicalDisease: 'ela',                status: 'active',   createdAt: new Date('2026-01-31'), source: 'supabase' },
  { id: 'sp-15', name: 'Rodrigo Ospina',    age: 48, diagnosis: 'ELA — Estadio Avanzado',                    neurologicalDisease: 'ela',                status: 'active',   createdAt: new Date('2026-02-02'), source: 'supabase' },
  { id: 'sp-16', name: 'Patricia Leal',     age: 36, diagnosis: 'ELA — Estadio Leve',                        neurologicalDisease: 'ela',                status: 'active',   createdAt: new Date('2026-02-04'), source: 'supabase' },
  { id: 'sp-17', name: 'Fernando Aguilar',  age: 55, diagnosis: 'ELA — Estadio Moderado',                    neurologicalDisease: 'ela',                status: 'active',   createdAt: new Date('2026-02-06'), source: 'supabase' },
  { id: 'sp-18', name: 'Lucía Hernández',   age: 43, diagnosis: 'ELA — Estadio Moderado',                    neurologicalDisease: 'ela',                status: 'active',   createdAt: new Date('2026-02-08'), source: 'supabase' },
  { id: 'sp-19', name: 'Camilo Restrepo',   age: 29, diagnosis: 'ELA — Estadio Leve',                        neurologicalDisease: 'ela',                status: 'active',   createdAt: new Date('2026-02-10'), source: 'supabase' },
  { id: 'sp-20', name: 'Sandra Nieto',      age: 50, diagnosis: 'ELA — Terminal',                            neurologicalDisease: 'ela',                status: 'inactive', createdAt: new Date('2026-02-12'), source: 'supabase' },
  // Alzheimer (15)
  { id: 'sp-21', name: 'Beatriz Gutiérrez', age: 79, diagnosis: 'Alzheimer — Estadio Moderado',              neurologicalDisease: 'alzheimer',          status: 'active',   createdAt: new Date('2026-02-14'), source: 'supabase' },
  { id: 'sp-22', name: 'Luis Arango',        age: 82, diagnosis: 'Alzheimer — Estadio Avanzado',              neurologicalDisease: 'alzheimer',          status: 'active',   createdAt: new Date('2026-02-16'), source: 'supabase' },
  { id: 'sp-23', name: 'Rosario Vega',       age: 75, diagnosis: 'Alzheimer — Estadio Leve',                  neurologicalDisease: 'alzheimer',          status: 'active',   createdAt: new Date('2026-02-18'), source: 'supabase' },
  { id: 'sp-24', name: 'Álvaro Pineda',     age: 80, diagnosis: 'Alzheimer — Estadio Avanzado',               neurologicalDisease: 'alzheimer',          status: 'active',   createdAt: new Date('2026-02-20'), source: 'supabase' },
  { id: 'sp-25', name: 'Constanza Molina',  age: 73, diagnosis: 'Alzheimer — Estadio Moderado',               neurologicalDisease: 'alzheimer',          status: 'active',   createdAt: new Date('2026-02-22'), source: 'supabase' },
  { id: 'sp-26', name: 'Efraín Ospina',     age: 85, diagnosis: 'Alzheimer — Terminal',                       neurologicalDisease: 'alzheimer',          status: 'inactive', createdAt: new Date('2026-02-24'), source: 'supabase' },
  { id: 'sp-27', name: 'Margarita Díaz',    age: 77, diagnosis: 'Alzheimer — Estadio Leve',                   neurologicalDisease: 'alzheimer',          status: 'active',   createdAt: new Date('2026-02-26'), source: 'supabase' },
  { id: 'sp-28', name: 'Tomás Vélez',       age: 68, diagnosis: 'Alzheimer — Estadio Leve',                   neurologicalDisease: 'alzheimer',          status: 'active',   createdAt: new Date('2026-02-28'), source: 'supabase' },
  { id: 'sp-29', name: 'Elena Sánchez',     age: 84, diagnosis: 'Alzheimer — Estadio Avanzado',               neurologicalDisease: 'alzheimer',          status: 'active',   createdAt: new Date('2026-03-01'), source: 'supabase' },
  { id: 'sp-30', name: 'Carlos Bedoya',     age: 71, diagnosis: 'Alzheimer — Estadio Moderado',               neurologicalDisease: 'alzheimer',          status: 'active',   createdAt: new Date('2026-03-03'), source: 'supabase' },
  { id: 'sp-31', name: 'Nora Castaño',      age: 76, diagnosis: 'Alzheimer — Estadio Moderado',               neurologicalDisease: 'alzheimer',          status: 'active',   createdAt: new Date('2026-03-05'), source: 'supabase' },
  { id: 'sp-32', name: 'Augusto Salcedo',   age: 83, diagnosis: 'Alzheimer — Estadio Avanzado',               neurologicalDisease: 'alzheimer',          status: 'active',   createdAt: new Date('2026-03-07'), source: 'supabase' },
  { id: 'sp-33', name: 'Helena Peralta',    age: 69, diagnosis: 'Alzheimer — Estadio Leve',                   neurologicalDisease: 'alzheimer',          status: 'active',   createdAt: new Date('2026-03-09'), source: 'supabase' },
  { id: 'sp-34', name: 'Mauricio Lagos',    age: 78, diagnosis: 'Alzheimer — Estadio Moderado',               neurologicalDisease: 'alzheimer',          status: 'active',   createdAt: new Date('2026-03-11'), source: 'supabase' },
  { id: 'sp-35', name: 'Pilar Quintero',    age: 74, diagnosis: 'Alzheimer — Terminal',                       neurologicalDisease: 'alzheimer',          status: 'inactive', createdAt: new Date('2026-03-13'), source: 'supabase' },
  // Huntington (10)
  { id: 'sp-36', name: 'Diego Montoya',     age: 42, diagnosis: 'Huntington — Estadio Moderado',              neurologicalDisease: 'huntington',         status: 'active',   createdAt: new Date('2026-03-15'), source: 'supabase' },
  { id: 'sp-37', name: 'Valentina Cruz',    age: 35, diagnosis: 'Huntington — Estadio Leve',                  neurologicalDisease: 'huntington',         status: 'active',   createdAt: new Date('2026-03-17'), source: 'supabase' },
  { id: 'sp-38', name: 'Sergio Medina',     age: 48, diagnosis: 'Huntington — Estadio Avanzado',              neurologicalDisease: 'huntington',         status: 'active',   createdAt: new Date('2026-03-19'), source: 'supabase' },
  { id: 'sp-39', name: 'Isabel Trujillo',   age: 39, diagnosis: 'Huntington — Estadio Leve',                  neurologicalDisease: 'huntington',         status: 'active',   createdAt: new Date('2026-03-21'), source: 'supabase' },
  { id: 'sp-40', name: 'Francisco Oquendo',age: 53, diagnosis: 'Huntington — Estadio Avanzado',               neurologicalDisease: 'huntington',         status: 'active',   createdAt: new Date('2026-03-23'), source: 'supabase' },
  { id: 'sp-41', name: 'Clara Jiménez',    age: 44, diagnosis: 'Huntington — Estadio Moderado',               neurologicalDisease: 'huntington',         status: 'active',   createdAt: new Date('2026-03-25'), source: 'supabase' },
  { id: 'sp-42', name: 'Andrés Ochoa',     age: 31, diagnosis: 'Huntington — Estadio Leve',                   neurologicalDisease: 'huntington',         status: 'active',   createdAt: new Date('2026-03-27'), source: 'supabase' },
  { id: 'sp-43', name: 'Liliana Posada',   age: 46, diagnosis: 'Huntington — Estadio Moderado',               neurologicalDisease: 'huntington',         status: 'active',   createdAt: new Date('2026-03-29'), source: 'supabase' },
  { id: 'sp-44', name: 'Gonzalo Varón',    age: 57, diagnosis: 'Huntington — Estadio Avanzado',               neurologicalDisease: 'huntington',         status: 'active',   createdAt: new Date('2026-04-01'), source: 'supabase' },
  { id: 'sp-45', name: 'Paula Arce',       age: 40, diagnosis: 'Huntington — Terminal',                       neurologicalDisease: 'huntington',         status: 'inactive', createdAt: new Date('2026-04-03'), source: 'supabase' },
  // Esclerosis Múltiple (5)
  { id: 'sp-46', name: 'María Claudia Ruiz', age: 34, diagnosis: 'Esclerosis Múltiple — Estadio Leve',       neurologicalDisease: 'esclerosis_multiple', status: 'active',  createdAt: new Date('2026-04-05'), source: 'supabase' },
  { id: 'sp-47', name: 'Jaime Escobar',    age: 49, diagnosis: 'Esclerosis Múltiple — Estadio Moderado',     neurologicalDisease: 'esclerosis_multiple', status: 'active',  createdAt: new Date('2026-04-07'), source: 'supabase' },
  { id: 'sp-48', name: 'Alejandra Vásquez',age: 27, diagnosis: 'Esclerosis Múltiple — Estadio Leve',         neurologicalDisease: 'esclerosis_multiple', status: 'active',  createdAt: new Date('2026-04-09'), source: 'supabase' },
  { id: 'sp-49', name: 'Ernesto Palacio',  age: 62, diagnosis: 'Esclerosis Múltiple — Estadio Avanzado',     neurologicalDisease: 'esclerosis_multiple', status: 'active',  createdAt: new Date('2026-04-11'), source: 'supabase' },
  { id: 'sp-50', name: 'Catalina Henao',   age: 55, diagnosis: 'Esclerosis Múltiple — Estadio Moderado',     neurologicalDisease: 'esclerosis_multiple', status: 'active',  createdAt: new Date('2026-04-13'), source: 'supabase' },
];

const PatientManagement: React.FC<Props> = ({ onBack, onWorkWithPatient }) => {
  const {
    managedPatients,
    activeManagedPatient,
    addManagedPatient,
    setActiveManagedPatient,
    updateManagedPatientStatus,
    setManagedPatients,
  } = useAppContext();

  const [tab, setTab] = useState<'activos' | 'todos'>('activos');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    age: '',
    diagnosis: '',
    neurologicalDisease: 'parkinson',
    notes: '',
  });

  useEffect(() => {
    if (supabaseLoaded || managedPatients.length > 0) return;
    loadFromSupabase();
  }, []);

  const loadFromSupabase = async () => {
    setIsLoading(true);
    try {
      const rows = await fetchSyntheticPatients();
      if (rows.length > 0) {
        const mapped: ManagedPatient[] = rows.map(r => ({
          id: r.id,
          name: r.name,
          age: r.age,
          diagnosis: `${DISEASE_LABELS[r.neurological_disease] ?? r.neurological_disease} — ${r.disease_stage}`,
          neurologicalDisease: r.neurological_disease,
          status: 'active' as const,
          createdAt: new Date(r.created_at),
          source: 'supabase' as const,
        }));
        setManagedPatients(mapped);
      } else {
        // Supabase not configured or empty — load representative demo patients
        setManagedPatients(FALLBACK_PATIENTS);
      }
    } catch (_) {
      setManagedPatients(FALLBACK_PATIENTS);
    }
    setSupabaseLoaded(true);
    setIsLoading(false);
  };

  const handleAddPatient = () => {
    if (!form.name.trim() || !form.age || !form.diagnosis.trim()) return;
    addManagedPatient({
      name: form.name.trim(),
      age: Number(form.age),
      diagnosis: form.diagnosis.trim(),
      neurologicalDisease: form.neurologicalDisease,
      status: 'active',
      notes: form.notes.trim() || undefined,
      source: 'manual',
    });
    setForm({ name: '', age: '', diagnosis: '', neurologicalDisease: 'parkinson', notes: '' });
    setShowAddForm(false);
  };

  const handleSelectPatient = (p: ManagedPatient) => {
    setActiveManagedPatient(p);
    onWorkWithPatient();
  };

  const filtered = managedPatients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'todos' ? true : p.status === 'active';
    return matchSearch && matchTab;
  });

  const activeCount = managedPatients.filter(p => p.status === 'active').length;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gestión de Pacientes</h2>
          <p className="text-text-sub text-sm font-medium">{activeCount} activos · {managedPatients.length} total</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Agregar paciente
        </button>
      </div>

      {/* Active patient banner */}
      {activeManagedPatient && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-success/10 border border-success/25 rounded-[20px] p-4 flex items-center gap-4"
        >
          <UserCheck className="w-6 h-6 text-success shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-success mb-0.5">Trabajando con</p>
            <p className="font-bold text-text-main">{activeManagedPatient.name} · {activeManagedPatient.diagnosis}</p>
          </div>
          <button
            onClick={() => setActiveManagedPatient(null)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-text-sub" />
          </button>
        </motion.div>
      )}

      {/* Search + tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-sub" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o diagnóstico…"
            className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-1 bg-surface-soft p-1 rounded-xl">
          {(['activos', 'todos'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                tab === t ? 'bg-white shadow text-primary' : 'text-text-sub hover:text-text-main'
              }`}
            >
              {t === 'activos' ? `Activos (${activeCount})` : `Todos (${managedPatients.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Patient list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-text-sub">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Cargando pacientes de Supabase…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-text-sub font-medium">
            {managedPatients.length === 0
              ? 'No hay pacientes registrados. Agrega el primero.'
              : 'No hay pacientes que coincidan con la búsqueda.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`bg-white rounded-[20px] border p-5 flex items-center gap-4 transition-all ${
                activeManagedPatient?.id === p.id
                  ? 'border-success/40 bg-success/5'
                  : 'border-gray-100 hover:border-primary/20 hover:shadow-sm'
              }`}
            >
              {/* Status dot */}
              <button
                onClick={() => updateManagedPatientStatus(p.id, p.status === 'active' ? 'inactive' : 'active')}
                className="shrink-0"
                title={p.status === 'active' ? 'Marcar inactivo' : 'Marcar activo'}
              >
                {p.status === 'active'
                  ? <CheckCircle2 className="w-5 h-5 text-success" />
                  : <Circle className="w-5 h-5 text-gray-300" />
                }
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-text-main truncate">{p.name}</p>
                  {p.source === 'supabase' && (
                    <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-primary/10 text-primary rounded-md shrink-0">BD</span>
                  )}
                  {p.status === 'inactive' && (
                    <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-md shrink-0">Inactivo</span>
                  )}
                </div>
                <p className="text-sm text-text-sub truncate">{p.diagnosis} · {p.age} años</p>
                {p.notes && <p className="text-xs text-text-sub mt-1 italic truncate">{p.notes}</p>}
              </div>

              {/* Action */}
              <button
                onClick={() => handleSelectPatient(p)}
                disabled={p.status === 'inactive'}
                className="flex items-center gap-1 px-3 py-2 bg-primary/10 text-primary rounded-xl font-bold text-xs hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none shrink-0"
              >
                <Brain className="w-3.5 h-3.5" />
                Trabajar
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add patient modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[28px] shadow-2xl p-8 w-full max-w-lg space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">Agregar Paciente</h3>
                <button onClick={() => setShowAddForm(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-sub uppercase tracking-wider block mb-1.5">Nombre completo *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ej: María García Rodríguez"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-sub uppercase tracking-wider block mb-1.5">Edad *</label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={form.age}
                      onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                      placeholder="68"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-sub uppercase tracking-wider block mb-1.5">Enfermedad *</label>
                    <select
                      value={form.neurologicalDisease}
                      onChange={e => setForm(f => ({ ...f, neurologicalDisease: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/20 transition-all"
                    >
                      {Object.entries(DISEASE_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-sub uppercase tracking-wider block mb-1.5">Diagnóstico principal *</label>
                  <input
                    value={form.diagnosis}
                    onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))}
                    placeholder="Ej: Parkinson avanzado, depresión mayor"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-sub uppercase tracking-wider block mb-1.5">Notas (opcional)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Observaciones generales del paciente…"
                    rows={3}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/20 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-surface-soft rounded-xl font-bold text-text-sub hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddPatient}
                  disabled={!form.name.trim() || !form.age || !form.diagnosis.trim()}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  Agregar paciente
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientManagement;
