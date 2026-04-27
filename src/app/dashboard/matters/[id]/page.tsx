"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { matterService } from "@/modules/matter/services/matterService";
import { matterEventService } from "@/modules/matter/services/matterEventService";
import { matterTaskService } from "@/modules/matter/services/matterTaskService";
import { matterParticipantService } from "@/modules/matter/services/matterParticipantService";
import { documentService } from "@/modules/document/services/documentService";
import { 
  MatterResponse, MatterStatus, MatterEventResponse, 
  MatterTaskResponse, MatterEventType, MatterParticipantResponse,
  ParticipantRole, PARTICIPANT_ROLE_LABELS
} from "@/modules/matter/types";
import { DocumentResponse } from "@/modules/document/types";
import { 
  ArrowLeft, Briefcase, Calendar, ChevronRight, Clock, 
  FileText, MessagesSquare, Scale, UserCircle, CheckCircle2,
  AlertCircle, Plus, LayoutDashboard, History, Settings2, Trash2,
  Paperclip, ExternalLink, Users, Gavel, Building2, Eye, Phone, Mail, X,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MatterTimeline } from "@/modules/matter/components/MatterTimeline";
import { MatterTaskList } from "@/modules/matter/components/MatterTaskList";
import { DocumentPreviewModal } from "@/modules/document/components/DocumentPreviewModal";

export default function MatterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const publicId = params.id as string;
  
  const [matter, setMatter] = useState<MatterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"RESUMEN" | "DOCUMENTOS" | "TAREAS" | "PARTICIPANTES" | "FACTURACION">("RESUMEN");

  // Data States
  const [events, setEvents] = useState<MatterEventResponse[]>([]);
  const [tasks, setTasks] = useState<MatterTaskResponse[]>([]);
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [participants, setParticipants] = useState<MatterParticipantResponse[]>([]);

  // Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const STATUSES: MatterStatus[] = ['OPEN', 'IN_PROGRESS', 'PENDING_CLIENT', 'IN_LITIGATION', 'SETTLED', 'CLOSED'];

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    eventType: "NOTE" as MatterEventType,
    eventDate: new Date().toISOString().split('T')[0]
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: ""
  });

  const [participantForm, setParticipantForm] = useState({
    fullName: "",
    role: "OPPOSING_COUNSEL" as ParticipantRole,
    email: "",
    phone: "",
    firmOrInstitution: "",
    professionalId: "",
    notes: ""
  });

  useEffect(() => {
    if (publicId) {
      fetchMatter();
      fetchEvents();
      fetchTasks();
      fetchDocuments();
      fetchParticipants();
    }
  }, [publicId]);

  const fetchMatter = async () => {
    try {
      setLoading(true);
      const data = await matterService.getMatterByPublicId(publicId);
      setMatter(data);
    } catch (error) {
      toast.error("No se pudo cargar la información del expediente");
      router.push("/dashboard/matters");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await matterEventService.getEvents(publicId);
      setEvents(data);
    } catch (e) { console.error(e); }
  };

  const fetchTasks = async () => {
    try {
      const data = await matterTaskService.getTasks(publicId);
      setTasks(data);
    } catch (e) { console.error(e); }
  };

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocumentsByMatter(publicId);
      setDocuments(data);
    } catch (e) { console.error(e); }
  };

  const fetchParticipants = async () => {
    try {
      const data = await matterParticipantService.getParticipants(publicId);
      setParticipants(data);
    } catch (e) { console.error(e); }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await matterEventService.addEvent(publicId, {
        ...eventForm,
        eventDate: new Date(eventForm.eventDate).toISOString()
      });
      toast.success("Evento agregado al historial");
      setIsEventModalOpen(false);
      setEventForm({ title: "", description: "", eventType: "NOTE", eventDate: new Date().toISOString().split('T')[0] });
      fetchEvents();
    } catch (e) {
      toast.error("Error al guardar el evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await matterTaskService.addTask(publicId, {
        ...taskForm,
        dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : undefined
      });
      toast.success("Tarea creada y notificada");
      setIsTaskModalOpen(false);
      setTaskForm({ title: "", description: "", dueDate: "" });
      fetchTasks();
    } catch (e) {
      toast.error("Error al crear tarea");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (taskPublicId: string) => {
    try {
      await matterTaskService.toggleTask(taskPublicId);
      fetchTasks();
    } catch (e) {
      toast.error("Error al actualizar tarea");
    }
  };

  const handleDeleteDocument = async (docPublicId: string) => {
    try {
      await documentService.archiveDocument(docPublicId);
      toast.success("Documento archivado/eliminado");
      fetchDocuments();
    } catch (e) {
      toast.error("Error al eliminar documento");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await documentService.uploadMatterDocument(publicId, file);
      toast.success("Documento subido correctamente a Cloudinary");
      fetchDocuments();
    } catch (e) {
      toast.error("Error al subir el archivo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  
  const handleUpdateStatus = async (newStatus: MatterStatus) => {
    try {
      await matterService.updateMatterStatus(publicId, newStatus);
      toast.success("Estado del expediente actualizado");
      setIsStatusDropdownOpen(false);
      fetchMatter(); // Recargar datos
    } catch (error) {
      toast.error("Error al actualizar el estado");
    }
  };

  const handlePreview = (doc: DocumentResponse) => {
    setSelectedDocument(doc);
    setIsPreviewModalOpen(true);
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await matterParticipantService.addParticipant(publicId, {
        fullName: participantForm.fullName,
        role: participantForm.role,
        email: participantForm.email || undefined,
        phone: participantForm.phone || undefined,
        firmOrInstitution: participantForm.firmOrInstitution || undefined,
        professionalId: participantForm.professionalId || undefined,
        notes: participantForm.notes || undefined
      });
      toast.success("Participante agregado al expediente");
      setIsParticipantModalOpen(false);
      setParticipantForm({ fullName: "", role: "OPPOSING_COUNSEL", email: "", phone: "", firmOrInstitution: "", professionalId: "", notes: "" });
      fetchParticipants();
    } catch (e) {
      toast.error("Error al agregar participante");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveParticipant = async (participantPublicId: string) => {
    try {
      await matterParticipantService.removeParticipant(participantPublicId);
      toast.success("Participante removido");
      fetchParticipants();
    } catch (e) {
      toast.error("Error al remover participante");
    }
  };

  const getRoleIcon = (role: ParticipantRole) => {
    switch (role) {
      case 'JUDGE': return <Gavel className="w-4 h-4" />;
      case 'COURT': return <Building2 className="w-4 h-4" />;
      case 'WITNESS': return <Eye className="w-4 h-4" />;
      case 'EXPERT': return <Scale className="w-4 h-4" />;
      default: return <UserCircle className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: ParticipantRole) => {
    switch (role) {
      case 'OPPOSING_COUNSEL': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'OPPOSING_PARTY': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'JUDGE': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'COURT': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      case 'WITNESS': return 'bg-cyan-50 text-cyan-600 border-cyan-200';
      case 'EXPERT': return 'bg-teal-50 text-teal-600 border-teal-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusConfig = (status: MatterStatus) => {
    switch (status) {
      case 'OPEN': return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'Abierto', icon: <Briefcase className="w-3.5 h-3.5" /> };
      case 'IN_PROGRESS': return { color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'En Progreso', icon: <Clock className="w-3.5 h-3.5" /> };
      case 'PENDING_CLIENT': return { color: 'bg-amber-100 text-amber-700 border-amber-200', text: 'Esperando Cliente', icon: <AlertCircle className="w-3.5 h-3.5" /> };
      case 'IN_LITIGATION': return { color: 'bg-rose-100 text-rose-700 border-rose-200', text: 'En Litigio', icon: <Scale className="w-3.5 h-3.5" /> };
      case 'SETTLED': return { color: 'bg-violet-100 text-violet-700 border-violet-200', text: 'Acuerdo', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
      case 'CLOSED': return { color: 'bg-slate-100 text-slate-700 border-slate-200', text: 'Cerrado', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
      default: return { color: 'bg-slate-100 text-slate-700 border-slate-200', text: status, icon: <Briefcase className="w-3.5 h-3.5" /> };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center animate-pulse mb-4">
          <Briefcase className="w-6 h-6 text-indigo-400" />
        </div>
        <p className="text-sm font-medium text-slate-500 animate-pulse">Abriendo expediente de los archivos...</p>
      </div>
    );
  }

  if (!matter) return null;

  const statusConfig = getStatusConfig(matter.status);

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-screen">
      
      {/* Breadcrumbs & Back */}
      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-6">
        <Link href="/dashboard/matters" className="hover:text-slate-900 flex items-center gap-1 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Expedientes
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <span className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {matter.number}
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8 relative">
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Scale className="w-64 h-64 -translate-y-1/4 translate-x-1/4" />
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {/* Status Selector Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all hover:shadow-sm active:scale-95 ${statusConfig.color}`}
                  >
                    {statusConfig.icon}
                    {statusConfig.text}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isStatusDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsStatusDropdownOpen(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 overflow-hidden"
                        >
                          <div className="px-3 py-1 mb-1 border-b border-slate-50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cambiar Estado</span>
                          </div>
                          {STATUSES.map((s) => {
                            const cfg = getStatusConfig(s);
                            return (
                              <button
                                key={s}
                                onClick={() => handleUpdateStatus(s)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold transition-colors hover:bg-slate-50 ${matter.status === s ? "text-indigo-600 bg-indigo-50/50" : "text-slate-600"}`}
                              >
                                <div className={`w-2 h-2 rounded-full ${s === 'OPEN' ? 'bg-emerald-500' : s === 'IN_PROGRESS' ? 'bg-blue-500' : s === 'PENDING_CLIENT' ? 'bg-amber-500' : s === 'IN_LITIGATION' ? 'bg-rose-500' : s === 'SETTLED' ? 'bg-violet-500' : 'bg-slate-500'}`} />
                                {cfg.text}
                                {matter.status === s && <CheckCircle2 className="w-3 h-3 ml-auto" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  <Scale className="w-3.5 h-3.5" />
                  {matter.jurisdiction || "Sin Jurisdicción"}
                </span>
                <span className="inline-flex items-center text-xs font-medium text-slate-400">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Aperturado {format(new Date(matter.startDate), "dd MMM yyyy", { locale: es })}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                {matter.title}
              </h1>
              <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
                {matter.description || "Este expediente no tiene una descripción detallada provista por el abogado al momento de su creación."}
              </p>
            </div>

            <div className="md:text-right shrink-0">
              <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Cliente Vinculado</p>
              <div className="flex items-center md:justify-end gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserCircle className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-base font-bold text-slate-900">{matter.clientName}</p>
                  <p className="text-xs font-medium text-indigo-600 flex items-center gap-1 cursor-pointer hover:underline">
                    Ver Pefil <ChevronRight className="w-3 h-3" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column - Tabs Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: "RESUMEN", label: "Resumen", icon: History },
            { id: "PARTICIPANTES", label: "Participantes", icon: Users, badge: participants.length },
            { id: "DOCUMENTOS", label: "Documentos", icon: FileText },
            { id: "TAREAS", label: "Tareas", icon: CheckCircle2 },
            { id: "FACTURACION", label: "Facturación", icon: Briefcase }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${activeTab === tab.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 translate-x-1 border border-indigo-500" : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"}`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-indigo-200" : "text-slate-400"}`} />
              {tab.label}
              {"badge" in tab && (tab as any).badge > 0 && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600"}`}>
                  {(tab as any).badge}
                </span>
              )}
            </button>
          ))}
          
          <div className="pt-6">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Acciones de Gestión</h4>
            <div className="space-y-1">
               <button onClick={() => setIsEventModalOpen(true)} className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Registrar Actuación
               </button>
               <button onClick={() => setIsTaskModalOpen(true)} className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Nueva Tarea
               </button>
               <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-400 cursor-not-allowed rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" /> Archivar Expediente
               </button>
            </div>
          </div>
        </div>

        {/* Right Column - Tab Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 min-h-[500px]"
            >
              
              {activeTab === "RESUMEN" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                       <History className="w-5 h-5 text-indigo-500" /> Cronología de Actuaciones
                    </h3>
                    <button 
                      onClick={() => setIsEventModalOpen(true)}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      + Agregar Evento
                    </button>
                  </div>
                  <MatterTimeline events={events} />
                </div>
              )}

              {activeTab === "DOCUMENTOS" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500" /> Archivo Digital
                    </h3>
                    <div className="flex gap-2">
                       {/* Hidden file input */}
                       <input 
                         type="file" 
                         className="hidden" 
                         ref={fileInputRef} 
                         onChange={handleFileUpload}
                         accept=".pdf,.doc,.docx,.jpg,.png"
                       />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {isUploading ? (
                          <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Paperclip className="w-3 h-3" />
                        )}
                        Subir Archivo
                      </button>
                      <Link href="/dashboard/documents" className="text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
                        Generador
                      </Link>
                    </div>
                  </div>
                  
                  {documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((doc) => (
                        <div key={doc.publicId} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 hover:bg-white transition-all cursor-pointer" onClick={() => handlePreview(doc)}>
                          <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 shadow-sm transition-all">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{doc.fileName}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                              {format(new Date(doc.createdAt), "dd MMM yyyy", { locale: es })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              className="text-slate-400 hover:text-indigo-600 p-2 transition-colors" 
                              onClick={(e) => { e.stopPropagation(); handlePreview(doc); }}
                              title="Ver documento"
                            >
                               <ExternalLink className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-slate-400 hover:text-red-500 p-2 transition-colors" 
                              onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc.publicId); }}
                              title="Eliminar"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                        <FileText className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="font-bold text-slate-700 mb-1">El expediente está vacío</p>
                      <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">Usa el sistema para generar documentos o subir archivos escaneados para centralizarlos aquí.</p>
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                          {isUploading ? (
                            <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Paperclip className="w-3 h-3" />
                          )}
                          Subir Archivo
                        </button>
                        <Link href="/dashboard/documents" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-200 inline-block hover:scale-105 transition-all">
                          Ir al Generador
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "TAREAS" && (
                <div>
                   <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                       <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Tareas del Expediente
                    </h3>
                    <button 
                      onClick={() => setIsTaskModalOpen(true)}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      + Nueva Tarea
                    </button>
                  </div>
                  <MatterTaskList tasks={tasks} onToggleStatus={handleToggleTask} />
                </div>
              )}
              
              {activeTab === "PARTICIPANTES" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-500" /> Participantes del Caso
                    </h3>
                    <button 
                      onClick={() => setIsParticipantModalOpen(true)}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Agregar
                    </button>
                  </div>

                  {participants.length > 0 ? (
                    <div className="space-y-3">
                      {participants.map((p) => (
                        <motion.div
                          key={p.publicId}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${getRoleColor(p.role)}`}>
                            {getRoleIcon(p.role)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-bold text-slate-900">{p.fullName}</h4>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRoleColor(p.role)}`}>
                                {PARTICIPANT_ROLE_LABELS[p.role]}
                              </span>
                            </div>
                            {p.firmOrInstitution && (
                              <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mb-1">
                                <Building2 className="w-3 h-3" /> {p.firmOrInstitution}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              {p.email && (
                                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                  <Mail className="w-3 h-3" /> {p.email}
                                </span>
                              )}
                              {p.phone && (
                                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                  <Phone className="w-3 h-3" /> {p.phone}
                                </span>
                              )}
                              {p.professionalId && (
                                <span className="text-[11px] text-slate-400 font-medium">
                                  Cédula: {p.professionalId}
                                </span>
                              )}
                            </div>
                            {p.notes && (
                              <p className="text-xs text-slate-400 mt-2 italic line-clamp-2">{p.notes}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveParticipant(p.publicId)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-2 transition-all"
                            title="Remover participante"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                        <Users className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="font-bold text-slate-700 mb-1">Sin participantes registrados</p>
                      <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">
                        Agrega jueces, contrapartes, abogados contrarios y peritos involucrados en el caso.
                      </p>
                      <button
                        onClick={() => setIsParticipantModalOpen(true)}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-200 hover:scale-105 transition-all inline-flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Agregar Participante
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "FACTURACION" && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                   <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 border border-amber-100">
                      <AlertCircle className="w-10 h-10 text-amber-500" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">Módulo de Facturación</h3>
                   <p className="text-slate-500 max-w-xs mx-auto">El registro de horas facturables y liquidaciones estará disponible próximamente cuando se integre una pasarela de pagos.</p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* MODALS */}
      
      {/* Event Modal */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEventModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10">
               <div className="p-6 border-b border-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">Registrar Actuación</h3>
                  <p className="text-sm text-slate-500 px-0.5">Agrega un evento relevante al historial del caso.</p>
               </div>
               <form onSubmit={handleAddEvent} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Título del Evento</label>
                    <input required type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium" placeholder="Ej. Presentación de memorial" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Categoría</label>
                      <select value={eventForm.eventType} onChange={e => setEventForm({...eventForm, eventType: e.target.value as any})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium">
                        <option value="HEARING">Audiencia</option>
                        <option value="FILING">Escrito</option>
                        <option value="NOTIFICATION">Notificación</option>
                        <option value="NOTE">Nota Interna</option>
                        <option value="MEETING">Reunión</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Fecha</label>
                      <input type="date" value={eventForm.eventDate} onChange={e => setEventForm({...eventForm, eventDate: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Notas adicionales</label>
                    <textarea rows={3} value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium resize-none" placeholder="Opcional..." />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsEventModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                    <button disabled={isSubmitting} type="submit" className="flex-1 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50">Guardar</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Modal */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTaskModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10">
               <div className="p-6 border-b border-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">Nueva Tarea</h3>
                  <p className="text-sm text-slate-500 px-0.5">Se enviará una notificación al asignar la tarea.</p>
               </div>
               <form onSubmit={handleAddTask} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">¿Qué se debe hacer?</label>
                    <input required type="text" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium" placeholder="Ej. Revisar apelación del cliente" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Fecha límite (Opcional)</label>
                    <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Instrucciones</label>
                    <textarea rows={3} value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium resize-none" placeholder="..." />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                    <button disabled={isSubmitting} type="submit" className="flex-1 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50">Asignar</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Participant Modal */}
      <AnimatePresence>
        {isParticipantModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsParticipantModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10">
               <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                 <div>
                   <h3 className="text-lg font-bold text-slate-900">Agregar Participante</h3>
                   <p className="text-sm text-slate-500">Registra a una persona o institución involucrada en el caso.</p>
                 </div>
                 <button onClick={() => setIsParticipantModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                   <X className="w-5 h-5" />
                 </button>
               </div>
               <form onSubmit={handleAddParticipant} className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Nombre Completo *</label>
                     <input required type="text" value={participantForm.fullName} onChange={e => setParticipantForm({...participantForm, fullName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium" placeholder="Ej. Lic. Juan Pérez García" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Rol *</label>
                     <select value={participantForm.role} onChange={e => setParticipantForm({...participantForm, role: e.target.value as ParticipantRole})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium">
                       <option value="OPPOSING_COUNSEL">Abogado Contrario</option>
                       <option value="OPPOSING_PARTY">Contraparte</option>
                       <option value="JUDGE">Juez</option>
                       <option value="COURT">Juzgado / Tribunal</option>
                       <option value="WITNESS">Testigo</option>
                       <option value="EXPERT">Perito</option>
                       <option value="OTHER">Otro</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Cédula Profesional</label>
                     <input type="text" value={participantForm.professionalId} onChange={e => setParticipantForm({...participantForm, professionalId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium" placeholder="Opcional" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Email</label>
                     <input type="email" value={participantForm.email} onChange={e => setParticipantForm({...participantForm, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium" placeholder="correo@ejemplo.com" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Teléfono</label>
                     <input type="tel" value={participantForm.phone} onChange={e => setParticipantForm({...participantForm, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium" placeholder="+52 ..." />
                   </div>
                   <div className="col-span-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Despacho / Institución</label>
                     <input type="text" value={participantForm.firmOrInstitution} onChange={e => setParticipantForm({...participantForm, firmOrInstitution: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium" placeholder="Ej. Juzgado 3ro de lo Civil, CDMX" />
                   </div>
                   <div className="col-span-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Notas</label>
                     <textarea rows={2} value={participantForm.notes} onChange={e => setParticipantForm({...participantForm, notes: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium resize-none" placeholder="Observaciones adicionales..." />
                   </div>
                 </div>
                 <div className="pt-4 flex gap-3">
                   <button type="button" onClick={() => setIsParticipantModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                   <button disabled={isSubmitting} type="submit" className="flex-1 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50">Guardar Participante</button>
                 </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        document={selectedDocument}
      />

    </div>
  );
}
