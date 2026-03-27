"use client";

import { useEffect, useState, useMemo } from "react";
import { adminApi } from "@/modules/admin/api";
import { SpecialtyResponse } from "@/modules/admin/types";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import SpecialtyModal from "./components/SpecialtyModal";

export default function AdminSpecialtiesPage() {
  const [specialties, setSpecialties] = useState<SpecialtyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyResponse | null>(null);

  const fetchSpecialties = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getAllSpecialties();
      setSpecialties(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las especialidades. Verifica tu conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const filteredSpecialties = useMemo(() => {
    return specialties.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [specialties, searchQuery]);

  const handleEdit = (specialty: SpecialtyResponse) => {
    setSelectedSpecialty(specialty);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSpecialty(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta especialidad? Si hay abogados asociados, se les quitará esta especialidad.")) {
      return;
    }

    try {
      await adminApi.deleteSpecialty(id);
      setSpecialties(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la especialidad.");
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const updated = await adminApi.toggleSpecialtyStatus(id);
      setSpecialties(prev => prev.map(s => s.id === id ? updated : s));
    } catch (err) {
      console.error(err);
      alert("Error al cambiar el estado.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-manrope">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Gestión de Especialidades
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-widest bg-emerald-500/10 text-emerald-700 px-3 py-1 rounded-full w-fit">
            Taxonomía Legal
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" />
          Nueva Especialidad
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Filters & Search Toolbar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar especialidad por nombre o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all placeholder:font-normal"
            />
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest bg-white border border-slate-200 px-4 py-2 rounded-xl">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             Total: {filteredSpecialties.length} categorías
          </div>
        </div>

        {/* Table/List Area */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm z-10 transition-all duration-300">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-slate-900 rounded-full scale-0 animate-pulse" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Cargando datos...</p>
            </div>
          ) : error ? (
            <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-6 bg-red-50 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Error de Conexión</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">{error}</p>
              </div>
              <button 
                onClick={fetchSpecialties}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
              >
                Reintentar
              </button>
            </div>
          ) : filteredSpecialties.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
               <div className="p-6 bg-slate-50 rounded-full">
                <Search className="w-12 h-12 text-slate-300" />
              </div>
              <p className="text-slate-500 font-bold max-w-sm mx-auto italic">
                {searchQuery ? `No se encontraron resultados para "${searchQuery}"` : "Aún no has creado ninguna especialidad."}
              </p>
              {!searchQuery && (
                 <button 
                  onClick={handleCreate}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                >
                  Empezar ahora
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 border-b border-slate-100">
                    <th className="px-8 py-5">Nombre</th>
                    <th className="px-8 py-5">Descripción</th>
                    <th className="px-8 py-5 text-center">Abogados</th>
                    <th className="px-8 py-5 text-center">Estado</th>
                    <th className="px-8 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {filteredSpecialties.map((specialty) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={specialty.id}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-5">
                          <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                            {specialty.name}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-slate-500 text-xs font-medium max-w-xs line-clamp-2 leading-relaxed">
                            {specialty.description}
                          </p>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px]">
                            {specialty.lawyerCount || 0}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <button
                            onClick={() => handleToggleStatus(specialty.id)}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95",
                              specialty.isActive 
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                : "bg-red-50 text-red-600 border border-red-100"
                            )}
                          >
                            {specialty.isActive ? (
                              <><CheckCircle2 className="w-3 h-3" /> Activo</>
                            ) : (
                              <><XCircle className="w-3 h-3" /> Inactivo</>
                            )}
                          </button>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(specialty)}
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(specialty.id)}
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <SpecialtyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSpecialties}
        specialty={selectedSpecialty}
      />
    </div>
  );
}
