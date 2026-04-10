"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, ArrowRight, Loader2, Info, Hash, Type, ChevronDown, Eye, EyeOff,
  CheckCircle2, AlertCircle, Download
} from "lucide-react";
import { DocumentGeneratorRequest, DocumentGeneratorResponse, DocumentFieldDefinition } from "../types";
import { documentService } from "../services/documentService";
import { toast } from "sonner";

interface DocumentQuestionnaireProps {
  documentTypeCode: string;
  caseRequestId?: number;
  onDocumentGenerated: (response: DocumentGeneratorResponse) => void;
}

export function DocumentQuestionnaire({
  documentTypeCode,
  caseRequestId,
  onDocumentGenerated,
}: DocumentQuestionnaireProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [fields, setFields] = useState<DocumentFieldDefinition[]>([]);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load template field definitions
  useEffect(() => {
    const loadTemplateFields = async () => {
      setIsLoadingTemplate(true);
      try {
        const templates = await documentService.getTemplates();
        const tpl = templates.find(t => t.code === documentTypeCode);
        if (tpl) {
          if (tpl.fieldDefinitions) {
            try {
              const defs = JSON.parse(tpl.fieldDefinitions);
              setFields(defs);
            } catch (e) {
              console.error("Error parsing field definitions JSON", e);
              const basicFields = tpl.requiredFields.split(',').map(f => ({
                name: f.trim(),
                label: f.trim().replace(/_/g, " "),
                type: "TEXT" as const,
                required: true
              })).filter(f => f.name);
              setFields(basicFields);
            }
          } else if (tpl.requiredFields) {
            const basicFields = tpl.requiredFields.split(',').map(f => ({
              name: f.trim(),
              label: f.trim().replace(/_/g, " "),
              type: "TEXT" as const,
              required: true
            })).filter(f => f.name);
            setFields(basicFields);
          }
        }
        // Initial empty preview
        fetchPreview({});
      } catch (error) {
        toast.error("Error al cargar la plantilla.");
        console.error(error);
      } finally {
        setIsLoadingTemplate(false);
      }
    };
    loadTemplateFields();
  }, [documentTypeCode]);

  // Debounced preview fetcher
  const fetchPreview = useCallback(async (data: Record<string, string>) => {
    setIsPreviewLoading(true);
    try {
      const payload: DocumentGeneratorRequest = {
        documentTypeCode,
        jurisdiction: "Perú",
        userData: data,
      };
      const result = await documentService.previewDocument(payload);
      setPreviewHtml(result.generatedContent);
    } catch (error) {
      console.error("Preview error:", error);
    } finally {
      setIsPreviewLoading(false);
    }
  }, [documentTypeCode]);

  const handleInputChange = (name: string, value: string) => {
    const newData = { ...formData, [name]: value };
    setFormData(newData);

    // Debounce the preview call (500ms after user stops typing)
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchPreview(newData);
    }, 500);
  };

  const handleGenerate = async () => {
    // Validate required fields
    const missing = fields.filter(f => f.required && (!formData[f.name] || formData[f.name].trim() === ""));
    if (missing.length > 0) {
      toast.error(`Por favor complete: ${missing.map(m => m.label).join(", ")}`);
      return;
    }

    setIsGenerating(true);
    try {
      const payload: DocumentGeneratorRequest = {
        documentTypeCode,
        caseRequestId,
        jurisdiction: "Perú",
        userData: formData,
      };
      const result = await documentService.generateDocument(payload);
      
      if (result.isValid) {
        toast.success("¡Documento generado y guardado exitosamente!");
      } else {
        toast.warning("Faltan campos por completar.");
      }
      onDocumentGenerated(result);
    } catch (error) {
      toast.error("Error al generar el documento.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filledCount = fields.filter(f => formData[f.name]?.trim()).length;
  const progress = fields.length > 0 ? Math.round((filledCount / fields.length) * 100) : 0;

  const renderInput = (field: DocumentFieldDefinition) => {
    const baseClasses = "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400 outline-none text-sm";
    
    switch (field.type) {
      case "SELECT":
        return (
          <div className="relative">
            <select
              id={field.name}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`${baseClasses} appearance-none pr-10`}
            >
              <option value="">Seleccione...</option>
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        );
      case "DATE":
        return (
          <input
            id={field.name}
            type="date"
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`${baseClasses}`}
          />
        );
      case "NUMBER":
        return (
          <div className="relative">
            <input
              id={field.name}
              type="number"
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder || `0`}
              className={baseClasses}
            />
            <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        );
      default:
        return (
          <input
            id={field.name}
            type="text"
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder || `Ingrese ${field.label.toLowerCase()}...`}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1500px] mx-auto h-auto lg:h-[calc(100vh-200px)] lg:min-h-[700px]">

      {/* ───── LEFT: Form Panel ───── */}
      <div className="w-full lg:w-[450px] shrink-0 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 lg:overflow-hidden h-auto lg:h-full">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest">AbogHub</span>
            </div>
            <h2 className="text-lg font-bold">Datos del Contrato</h2>
            <p className="text-indigo-100/80 text-xs mt-0.5">
              Complete los campos y vea el documento en tiempo real.
            </p>
          </div>
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4 pb-2 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Progreso</span>
            <span className="text-[11px] font-bold text-indigo-600">{filledCount}/{fields.length} campos</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 custom-scrollbar">
          {isLoadingTemplate ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-slate-400 text-xs font-medium animate-pulse">Cargando plantilla...</p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {fields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex flex-col gap-1"
                >
                  <label htmlFor={field.name} className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    {field.label}
                    {field.required && <span className="text-rose-500">*</span>}
                    {formData[field.name]?.trim() && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    )}
                  </label>
                  {renderInput(field)}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Generate Button */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isLoadingTemplate || progress < 100}
            className="w-full flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generar Documento Final
              </>
            )}
          </button>
          {progress < 100 && (
            <p className="text-center text-[10px] text-slate-400 mt-2 flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Complete todos los campos para generar
            </p>
          )}
        </div>
      </div>

      {/* ───── RIGHT: Live Preview Panel ───── */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 lg:overflow-hidden h-[800px] lg:h-full">
        {/* Preview Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider"
            >
              {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Vista Previa
            </button>
            {isPreviewLoading && (
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                <span className="text-[10px] text-slate-400 font-medium">Actualizando...</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded uppercase tracking-tighter">
              Formato A4 Estándar
            </span>
          </div>
        </div>

        {/* Document Preview */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 overflow-y-auto custom-scrollbar"
            >
              <div className="document-paper-container">
                <div className="document-paper">
                  {/* Watermark when fields are missing */}
                  {progress < 100 && (
                    <div
                      className="pointer-events-none select-none absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45"
                      style={{
                        opacity: 0.03,
                        fontSize: "clamp(60px, 10vw, 120px)",
                        fontWeight: 900,
                        color: "#000",
                        whiteSpace: "nowrap",
                      }}
                    >
                      BORRADOR
                    </div>
                  )}

                  {/* Rendered HTML Content */}
                  <div
                    className="document-content"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
