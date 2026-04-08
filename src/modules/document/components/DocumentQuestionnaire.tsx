"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Loader2, Info } from "lucide-react";
import { DocumentGeneratorRequest, DocumentGeneratorResponse } from "../types";
import { documentService } from "../services/documentService";
import { toast } from "sonner";

interface DocumentQuestionnaireProps {
  documentTypeCode: string;
  caseRequestId?: number;
  initialMissingFields?: string[];
  onDocumentGenerated: (response: DocumentGeneratorResponse) => void;
}

export function DocumentQuestionnaire({
  documentTypeCode,
  caseRequestId,
  initialMissingFields = [],
  onDocumentGenerated,
}: DocumentQuestionnaireProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>(initialMissingFields);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  React.useEffect(() => {
    // If initial missing fields exist, use them, otherwise fetch template fields
    if (initialMissingFields.length === 0) {
      const loadTemplateFields = async () => {
        setIsLoadingTemplate(true);
        try {
          const templates = await documentService.getTemplates();
          const tpl = templates.find(t => t.code === documentTypeCode);
          if (tpl && tpl.requiredFields) {
            const fields = tpl.requiredFields.split(',').map(f => f.trim()).filter(Boolean);
            setMissingFields(fields);
          }
        } catch (error) {
          console.error("Error loading template fields", error);
        } finally {
          setIsLoadingTemplate(false);
        }
      };
      loadTemplateFields();
    }
  }, [documentTypeCode, initialMissingFields]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const payload: DocumentGeneratorRequest = {
        documentTypeCode,
        caseRequestId,
        jurisdiction: "Global",
        userData: formData,
      };
      const result = await documentService.generateDocument(payload);
      
      if (result.isValid) {
        toast.success("¡Documento generado exitosamente!");
      } else {
        toast.warning("Faltan campos por completar.");
        setMissingFields(result.missingFields);
      }
      onDocumentGenerated(result);
    } catch (error) {
      toast.error("Error al generar el documento. Por favor intente de nuevo.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cuestionario Legal</h2>
          <p className="text-slate-500 text-sm mt-1">
            Complete los siguientes datos para generar su documento estructurado.
          </p>
        </div>
      </div>

      {missingFields.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700">
            Faltan <strong>{missingFields.length} campos</strong> esenciales para que el documento sea válido. 
            Asegúrese de llenarlos correctamente.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {isLoadingTemplate ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          missingFields.map((field, index) => (
          <motion.div
            key={field}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col gap-2"
          >
            <label htmlFor={field} className="text-sm font-semibold text-slate-700 capitalize">
              {field.replace(/_/g, " ")}
            </label>
            <input
              id={field}
              type="text"
              value={formData[field] || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={`Ingrese ${field.replace(/_/g, " ")}...`}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
            />
          </motion.div>
        )))}

        {!isLoadingTemplate && !missingFields.length && (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">No hay campos estáticos que llenar. Puede proceder a generar el documento base.</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              Generar Documento
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
