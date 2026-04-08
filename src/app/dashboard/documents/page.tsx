"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { documentService } from "@/modules/document/services/documentService";
import { DocumentResponse, TemplatePublicResponse } from "@/modules/document/types";
import { FileText, Download, Trash2, UploadCloud, FileType2, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState<TemplatePublicResponse[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // For lawyers we show their documents and maybe they can set them as templates
      // For clients we can show purchased documents, but for now we'll just fetch 'me'
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
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2 text-sm shadow-sm"
          >
            <FileText className="w-4 h-4" /> Generar Documento
          </button>
          <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2 text-sm">
            <UploadCloud className="w-4 h-4" /> Subir
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
          <FileType2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Sin documentos</h3>
          <p className="text-slate-500 mt-1 mb-6">Aún no has subido ningún documento a tu bóveda.</p>
          <button 
            onClick={openTemplateModal}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 text-sm mx-auto"
          >
            <Plus className="w-4 h-4" /> Generar con plantilla
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
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                
                <h3 className="font-semibold text-slate-900 text-sm mb-1 truncate" title={doc.fileName}>
                  {doc.fileName}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
                  <span>{formatBytes(doc.fileSizeBytes)}</span>
                  <span>{format(new Date(doc.createdAt), "MMM d, yyyy", { locale: es })}</span>
                </div>

                {doc.isTemplate && (
                  <span className="inline-block px-2 text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700 rounded-md mb-4 w-max">
                    Plantilla
                  </span>
                )}
                
                <div className="flex gap-2 mt-auto border-t border-slate-100 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar
                  </a>
                  <button 
                    onClick={() => handleArchive(doc.publicId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Seleccionar Plantilla</h2>
                  <p className="text-sm text-slate-500">Elija un modelo oficial para generar el documento.</p>
                </div>
                <button
                  onClick={() => setTemplateModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50">
                {loadingTemplates ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No hay plantillas disponibles.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {templates.map(t => (
                      <div 
                        key={t.publicId}
                        onClick={() => router.push(`/dashboard/documents/generate?template=${t.code}`)}
                        className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group flex items-start justify-between"
                      >
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{t.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">Jurisdicción: {t.jurisdiction}</p>
                        </div>
                        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200">
                          {t.code}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
