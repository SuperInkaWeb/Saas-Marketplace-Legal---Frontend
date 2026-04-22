"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { documentService } from "@/modules/document/services/documentService";
import { DocumentResponse, TemplatePublicResponse } from "@/modules/document/types";
import { FileText, Download, Trash2, UploadCloud, FileType2, Plus, X, Loader2, FilePenLine, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { DocumentPreviewModal } from "@/modules/document/components/DocumentPreviewModal";

export default function DocumentsPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState<TemplatePublicResponse[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Preview Modal State
  const [selectedDocument, setSelectedDocument] = useState<DocumentResponse | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await documentService.getMyDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Error al cargar los documentos");
    } finally {
      setLoading(false);
    }
  };

  const openTemplateModal = async () => {
    setTemplateModalOpen(true);
    if (templates.length === 0) {
      setLoadingTemplates(true);
      try {
        const data = await documentService.getTemplates();
        setTemplates(data);
      } catch (error) {
        toast.error("Error al cargar plantillas");
      } finally {
        setLoadingTemplates(false);
      }
    }
  };

  const handleArchive = async (publicId: string) => {
    if (!confirm("¿Estás seguro de que quieres archivar este documento?")) return;
    try {
      await documentService.archiveDocument(publicId);
      toast.success("Documento archivado");
      setDocuments(docs => docs.filter(d => d.publicId !== publicId));
    } catch (error) {
      toast.error("Error al archivar el documento");
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleAction = (doc: DocumentResponse) => {
    // If it's a draft OR an HTML document without a file URL, go to editor
    if (doc.isDraft || (doc.fileType?.includes("html") && !doc.fileUrl)) {
      router.push(`/dashboard/documents/${doc.publicId}`);
    } else {
      // Otherwise, show preview modal (PDFs, Images, and generated HTML with proxy)
      setSelectedDocument(doc);
      setIsPreviewOpen(true);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4">
            Mis Documentos
          </h1>
          <p className="mt-2 text-slate-500 text-sm">Gestiona tus archivos, contratos y plantillas legales.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={openTemplateModal}
            className="bg-primary text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest hover:bg-accent transition-all duration-300 inline-flex items-center gap-3 text-[10px] shadow-lg shadow-primary/10"
          >
            <Plus className="w-3.5 h-3.5" /> Generar Documento
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-sm border border-gray-100 border-dashed shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileType2 className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-primary font-manrope">Tu bóveda está vacía</h3>
          <p className="text-gray-500 mt-2 mb-8 text-sm max-w-xs mx-auto leading-relaxed">
            Aún no has subido documentos legales ni generado contratos con nuestras plantillas.
          </p>
          <button 
            onClick={openTemplateModal}
            className="bg-primary text-white px-8 py-3.5 rounded-sm font-bold uppercase tracking-widest hover:bg-accent transition-all duration-300 inline-flex items-center gap-2 text-[10px]"
          >
            <Plus className="w-4 h-4" /> Comenzar Ahora
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {documents.map((doc) => (
              <motion.div
                key={doc.publicId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-sm p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-sm bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-primary transition-colors duration-300">
                    <FileText className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-sm border border-gray-100">
                    <span className="text-[10px] font-bold text-primary">{formatBytes(doc.fileSizeBytes)}</span>
                  </div>
                </div>
                
                <h3 className="font-bold text-primary text-sm mb-1 truncate font-manrope group-hover:text-accent transition-colors" title={doc.fileName}>
                  {doc.fileName}
                </h3>
                
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-5">
                  {format(new Date(doc.createdAt), "MMM d, yyyy", { locale: es })}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {doc.isTemplate && (
                    <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-accent/10 text-accent border border-accent/20 rounded-sm">
                      Plantilla
                    </span>
                  )}
                  {doc.isDraft && (
                    <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 border border-gray-200 rounded-sm">
                      Borrador
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2 mt-auto pt-5 border-t border-gray-50 transition-all duration-300">
                  <button 
                    onClick={() => handleAction(doc)}
                    className="flex-1 bg-primary text-white py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent transition-all shadow-lg shadow-primary/5"
                  >
                    {doc.isDraft ? "Editar" : "Ver"}
                  </button>
                  
                  {doc.fileUrl && (
                    <a 
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-sm text-gray-400 hover:text-primary hover:bg-gray-50 transition-all border border-gray-100"
                      title="Descargar"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}

                  <button 
                    onClick={() => handleArchive(doc.publicId)}
                    className="p-2.5 rounded-sm text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all border border-gray-100"
                    title="Archivar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Template Selection Modal */}
      <AnimatePresence>
        {isTemplateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setTemplateModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-indigo-600" />
                    Marketplace de Plantillas
                  </h2>
                  <p className="text-sm text-slate-500">Documentos legales estándar de alta calidad, listos para automatizar.</p>
                </div>
                <button
                  onClick={() => setTemplateModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50">
                {loadingTemplates ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <p className="text-sm font-medium text-slate-500 animate-pulse">Cargando catálogo...</p>
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500 font-medium">No hay plantillas disponibles en este momento.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {templates.map(t => (
                      <div 
                        key={t.publicId}
                        onClick={() => router.push(`/dashboard/documents/generate?template=${t.code}`)}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group flex items-center justify-between shadow-sm relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                            <FileText className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {t.name}
                              </h3>
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">Premium</span>
                            </div>
                            <p className="text-xs text-slate-500">Jurisdicción: <span className="text-slate-700 font-medium">{t.jurisdiction}</span></p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 text-right">
                          <div className="text-lg font-black text-slate-900 flex items-center gap-1">
                            <span className="text-sm font-bold text-indigo-600">$</span>
                            {t.price?.toFixed(2) || "0.00"}
                          </div>
                          <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500 border border-slate-200 uppercase tracking-tighter">
                            {t.code}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Preview Modal */}
      <DocumentPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        document={selectedDocument}
      />
    </div>
  );
}
