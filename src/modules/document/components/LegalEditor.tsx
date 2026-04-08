"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, FilePenLine, Loader2 } from "lucide-react";
import { documentService } from "../services/documentService";
import { toast } from "sonner";
import { DocumentGeneratorResponse } from "../types";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

interface LegalEditorProps {
  documentId?: string;
  initialData: DocumentGeneratorResponse;
  onSaved?: () => void;
}

export function LegalEditor({ documentId, initialData, onSaved }: LegalEditorProps) {
  const [content, setContent] = useState(initialData.generatedContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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

  const hasPendingPlaceholders = content.includes("[COMPLETAR:");

  return (
    <div className="w-full bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
      {/* Editor Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <FilePenLine className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Editor Legal AI</h3>
            <div className="flex items-center gap-2 text-sm">
              {hasPendingPlaceholders ? (
                <span className="flex items-center gap-1 text-amber-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Borrador (Marcadores pendientes)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Verificado y Completo
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {isEditMode ? "Vista Previa" : "Editar"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !documentId}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/20"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Guardar
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-auto bg-slate-50/50 p-6">
        <div className="max-w-4xl mx-auto shadow-sm">
          {isEditMode ? (
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Escriba o edite el documento aquí..."
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full min-h-[60vh] p-10 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-800 leading-chill font-serif"
            >
              {/* Render HTML content safely */}
              <div 
                className="whitespace-pre-wrap font-serif text-[1.1rem] leading-relaxed break-words quill-content"
                dangerouslySetInnerHTML={{ 
                  __html: content.replace(/\[COMPLETAR: (.*?)\]/g, '<span class="bg-amber-100 text-amber-800 px-1 rounded animate-pulse">[COMPLETAR: $1]</span>')
                }} 
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
