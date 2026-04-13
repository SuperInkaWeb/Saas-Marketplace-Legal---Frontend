"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, FilePenLine, Loader2, Download } from "lucide-react";
import { documentService } from "../services/documentService";
import { toast } from "sonner";
import { DocumentGeneratorResponse } from "../types";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import api from "@/lib/api";

interface LegalEditorProps {
  documentId?: string;
  initialData: DocumentGeneratorResponse;
  onSaved?: () => void;
}

export function LegalEditor({ documentId, initialData, onSaved }: LegalEditorProps) {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Initialize content from the generated HTML (already rendered by Thymeleaf)
  useEffect(() => {
    if (initialData?.generatedContent) {
      setContent(initialData.generatedContent);
    }
  }, [initialData?.generatedContent]);

  const handleSave = async () => {
    if (!documentId) {
      toast.error("El documento no ha sido guardado como borrador aún.");
      return;
    }

    setIsSaving(true);
    try {
      await documentService.updateDocumentContent(documentId, { content });
      toast.success("Cambios guardados con éxito.");
      setIsEditMode(false);
      onSaved?.();
    } catch (error) {
      toast.error("Error al guardar el documento.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!documentId) return;
    setIsDownloading(true);
    try {
      toast.info("Generando PDF profesional...");
      
      const { data } = await api.get(`/documents/${documentId}/export`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `documento-${documentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF descargado con éxito.");
    } catch (error) {
      toast.error("Error al descargar el PDF.");
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-180px)] min-h-[600px]">
      {/* Premium Toolbar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FilePenLine className="w-4 h-4 text-indigo-600" />
              Editor de Documento Legal
            </h3>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Documento Completo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 mr-2">
            <button
              onClick={() => setIsEditMode(false)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${!isEditMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Vista Previa
            </button>
            <button
              onClick={() => setIsEditMode(true)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${isEditMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Editar Texto
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || !documentId}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Guardar Cambios
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading || !documentId}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-lg shadow-slate-900/10 active:scale-95 disabled:opacity-50"
          >
            {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Descargar PDF
          </button>
        </div>
      </div>

      {/* Main Workspace (Paper Simulation) */}
      <div className="flex-1 overflow-auto bg-slate-200/40 p-12 flex justify-center">
        <div className="w-full max-w-[850px] transition-all duration-300">
          <AnimatePresence mode="wait">
            {isEditMode ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-300 min-h-[1050px]"
              >
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Edite el documento legal aquí..."
                />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="document-paper min-h-[1050px] shadow-2xl mx-auto"
              >
                {/* Content — already HTML from Thymeleaf */}
                <div 
                  className="document-content selection:bg-indigo-100"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
