"use client";

import { useEffect, useState } from "react";
import { matterService } from "@/modules/matter/services/matterService";
import { clientService } from "@/modules/client/services/clientService";
import { MatterResponse, MatterStatus } from "@/modules/matter/types";
import { ClientSearchResponse } from "@/modules/client/types";
import { Briefcase, Clock, Plus, Search, Filter, AlertCircle, CheckCircle2, UserCircle, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";

export default function MattersDashboardPage() {
  const router = useRouter();
  const [matters, setMatters] = useState<MatterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"LIST" | "KANBAN">("LIST");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Search & Filter state
  const [filterSearch, setFilterSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<MatterStatus | "">("")
  
  // Autocomplete State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ClientSearchResponse[]>([]);
  const [isSearchingClient, setIsSearchingClient] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    jurisdiction: "",
    clientPublicId: "",
    unregisteredClientName: ""
  });

  useEffect(() => {
    fetchMatters();
  }, []);

  // Debounced filter search effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMatters(filterSearch, filterStatus || undefined);
    }, 400);
    return () => clearTimeout(timeout);
  }, [filterSearch, filterStatus]);

  // Debounced Search Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearchClients(searchQuery);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchClients = async (query: string) => {
    try {
      setIsSearchingClient(true);
      const results = await clientService.searchClients(query);
      setSearchResults(results);
      setShowDropdown(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingClient(false);
    }
  };

  const selectClient = (client: ClientSearchResponse) => {
    setFormData({ ...formData, clientPublicId: client.publicId, unregisteredClientName: "" });
    setSearchQuery(client.fullName + (client.companyName ? ` (${client.companyName})` : ""));
    setShowDropdown(false);
  };

  const clearClientSelection = () => {
    setFormData({ ...formData, clientPublicId: "", unregisteredClientName: "" });
    setSearchQuery("");
    setShowDropdown(false);
  };


  const handleCreateMatter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.jurisdiction) {
      toast.error("Por favor completa los campos obligatorios.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      // Fallback for demo purpose since we dont have a client list UI yet
      // For now we'll submit and handle potential 404 client error gracefully
      await matterService.createMatter(formData);
      toast.success("Expediente creado satisfactoriamente");
      setIsModalOpen(false);
      setFormData({ title: "", description: "", jurisdiction: "", clientPublicId: "", unregisteredClientName: "" });
      setSearchQuery("");
      fetchMatters();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al crear el expediente. Verifica tu conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchMatters = async (search?: string, status?: string) => {
    try {
      setLoading(true);
      const data = await matterService.getMatters(search, status);
      setMatters(data);
    } catch (error) {
      toast.error("Error al cargar los expedientes");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: MatterStatus) => {
    switch (status) {
      case 'OPEN': return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'Abierto', icon: <Briefcase className="w-3 h-3" />, dot: 'bg-emerald-500' };
      case 'IN_PROGRESS': return { color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'En Progreso', icon: <Clock className="w-3 h-3" />, dot: 'bg-blue-500' };
      case 'PENDING_CLIENT': return { color: 'bg-amber-100 text-amber-700 border-amber-200', text: 'Esperando Cliente', icon: <AlertCircle className="w-3 h-3" />, dot: 'bg-amber-500' };
      case 'IN_LITIGATION': return { color: 'bg-rose-100 text-rose-700 border-rose-200', text: 'En Litigio', icon: <Briefcase className="w-3 h-3" />, dot: 'bg-rose-500' };
      case 'SETTLED': return { color: 'bg-violet-100 text-violet-700 border-violet-200', text: 'Acuerdo', icon: <CheckCircle2 className="w-3 h-3" />, dot: 'bg-violet-500' };
      case 'CLOSED': return { color: 'bg-slate-100 text-slate-700 border-slate-200', text: 'Cerrado', icon: <CheckCircle2 className="w-3 h-3" />, dot: 'bg-slate-500' };
      default: return { color: 'bg-slate-100 text-slate-700 border-slate-200', text: status, icon: <Briefcase className="w-3 h-3" />, dot: 'bg-slate-500' };
    }
  };

  const handleUpdateStatus = async (publicId: string, newStatus: MatterStatus) => {
    try {
      await matterService.updateMatterStatus(publicId, newStatus);
      toast.success("Estado actualizado");
      fetchMatters();
    } catch (error) {
      toast.error("Error al actualizar estado");
    }
  };

  const STATUSES: MatterStatus[] = ['OPEN', 'IN_PROGRESS', 'PENDING_CLIENT', 'IN_LITIGATION', 'CLOSED'];

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-screen bg-slate-50/50">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Gestión de Expedientes
            </h1>
          </div>
          <p className="text-slate-500 text-sm">Organiza, controla y realiza seguimiento de todos tus casos activos (ERP).</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center shadow-inner border border-slate-200/60">
            <button 
              onClick={() => setViewMode("LIST")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "LIST" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Lista
            </button>
            <button 
              onClick={() => setViewMode("KANBAN")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "KANBAN" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Kanban
            </button>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all inline-flex items-center gap-2 text-sm shadow-sm hover:shadow active:scale-95"
          >
            <Plus className="w-4 h-4" /> Nuevo Expediente
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-3">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por caso, cliente o número..." 
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          {(filterSearch || filterStatus) && (
            <button 
              onClick={() => { setFilterSearch(""); setFilterStatus(""); }}
              className="px-3 py-2 text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Limpiar
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Estado:</span>
          <button
            onClick={() => setFilterStatus("")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${!filterStatus ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"}`}
          >
            Todos
          </button>
          {STATUSES.map((s) => {
            const cfg = getStatusConfig(s);
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? "" : s)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${filterStatus === s ? cfg.color + " shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
              >
                {cfg.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : matters.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-3xl border border-slate-200 border-dashed shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Briefcase className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No hay expedientes activos</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">Comienza a organizar tu trabajo creando tu primer expediente o caso en el sistema.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-6 py-2.5 rounded-xl font-semibold transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Crear mi primer Expediente
          </button>
        </div>
      ) : viewMode === "LIST" ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Nº Expediente</th>
                  <th className="p-4">Caso / Título</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Jurisdicción</th>
                  <th className="p-4 text-right pr-6">Inicio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matters.map((matter) => (
                  <tr 
                    key={matter.publicId} 
                    onClick={() => router.push(`/dashboard/matters/${matter.publicId}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="p-4 pl-6">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 group-hover:border-indigo-200 transition-colors">
                        {matter.number}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">{matter.title}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-600 font-medium">{matter.clientName}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getStatusConfig(matter.status).color}`}>
                        {getStatusConfig(matter.status).icon}
                        {getStatusConfig(matter.status).text}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> {matter.jurisdiction || "No especificada"}
                      </p>
                    </td>
                    <td className="p-4 text-right pr-6 text-sm text-slate-500 font-medium">
                      {format(new Date(matter.startDate), "dd MMM yyyy", { locale: es })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar min-h-[600px] items-start">
          {STATUSES.map((status) => {
            const statusMatters = matters.filter(m => m.status === status);
            const config = getStatusConfig(status);
            
            return (
              <div 
                key={status}
                className="flex-shrink-0 w-80 bg-slate-100/50 rounded-2xl p-4 border border-slate-200/60"
              >
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">{config.text}</h3>
                    <span className="bg-white text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
                      {statusMatters.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {statusMatters.map((matter) => (
                    <motion.div
                      layout
                      key={matter.publicId}
                      onClick={() => router.push(`/dashboard/matters/${matter.publicId}`)}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all group group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 group-hover:text-indigo-500 group-hover:border-indigo-100">
                          {matter.number}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                           <ChevronRight className="w-4 h-4 text-indigo-400" />
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {matter.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1.5">
                        <UserCircle className="w-3.5 h-3.5" /> {matter.clientName}
                      </p>

                      <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                         <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                           <Clock className="w-3 h-3" /> {format(new Date(matter.startDate), "dd MMM", { locale: es })}
                         </p>
                         
                         {/* Quick status cycle for demo/kanban feel if they dont want to drag */}
                         <div className="flex items-center gap-1">
                            {STATUSES.filter(s => s !== status).slice(0, 1).map(nextS => (
                              <button 
                                key={nextS}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(matter.publicId, nextS);
                                }}
                                className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-all border border-indigo-100"
                              >
                                {getStatusConfig(nextS).text} →
                              </button>
                            ))}
                         </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {statusMatters.length === 0 && (
                    <div className="py-8 text-center bg-white/30 border border-dashed border-slate-200 rounded-xl">
                      <p className="text-[11px] text-slate-400 font-medium">No hay casos aquí</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Matter Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    Nuevo Expediente
                  </h2>
                  <p className="text-sm text-slate-500">Registra un nuevo caso en tu firma legal.</p>
                </div>
              </div>

              <form onSubmit={handleCreateMatter} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Título del Caso *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Divorcio García vs Pérez"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre o Email del Cliente *</label>
                  
                  {formData.clientPublicId ? (
                     <div className="w-full px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between shadow-sm">
                       <div className="flex items-center gap-2">
                         <UserCircle className="w-5 h-5 text-indigo-500" />
                         <span className="font-bold text-slate-800 text-sm">{searchQuery}</span>
                         <span className="bg-indigo-100 text-indigo-700 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ml-2">Registrado</span>
                       </div>
                       <button type="button" onClick={clearClientSelection} className="text-slate-400 hover:text-red-500 transition-colors">
                         <X className="w-4 h-4" />
                       </button>
                     </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {isSearchingClient ? (
                          <div className="w-4 h-4 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                        ) : (
                          <Search className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <input
                        type="text"
                        required={!formData.clientPublicId}
                        placeholder="Buscar por correo, nombre, o empresa..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setFormData({ ...formData, unregisteredClientName: e.target.value });
                        }}
                        onFocus={() => { if(searchResults.length > 0) setShowDropdown(true); }}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                      
                      {/* Dropdown Predictive Search */}
                      {showDropdown && searchQuery.length >= 2 && (
                        <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden">
                          {searchResults.length > 0 ? (
                            <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                              {searchResults.map((client) => (
                                <li 
                                  key={client.publicId}
                                  onClick={() => selectClient(client)}
                                  className="px-4 py-3 hover:bg-indigo-50 border-b border-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                                >
                                  <div>
                                    <p className="font-bold text-sm text-slate-900 group-hover:text-indigo-700">{client.fullName} {client.companyName && <span className="text-slate-400 font-normal">| {client.companyName}</span>}</p>
                                    <p className="text-xs text-slate-500">{client.email}</p>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </li>
                              ))}
                            </ul>
                          ) : !isSearchingClient && (
                            <div className="p-4 text-center">
                              <p className="text-sm text-slate-600 mb-1">No se encontró al cliente <strong>"{searchQuery}"</strong></p>
                              <p className="text-xs text-slate-400">Si continúas, el sistema registrará este caso con un alias temporal no vinculado a un usuario (ideal para prospectos).</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {!formData.clientPublicId && <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Se recomienda buscar por Email para vincular el perfil.</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Jurisdicción / Tribunal *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Corte Superior de Justicia de Lima"
                    value={formData.jurisdiction}
                    onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Breve Descripción</label>
                  <textarea
                    rows={3}
                    placeholder="Detalles preliminares del caso..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none custom-scrollbar"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      "Crear Expediente"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
