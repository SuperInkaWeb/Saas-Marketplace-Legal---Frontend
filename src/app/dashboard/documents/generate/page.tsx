"use client";

import React, { useState } from "react";
import { DocumentQuestionnaire } from "@/modules/document/components/DocumentQuestionnaire";
import { LegalEditor } from "@/modules/document/components/LegalEditor";
import { DocumentGeneratorResponse } from "@/modules/document/types";
import { FileText, ArrowLeft, Send, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DocumentGenerationContent() {
  const searchParams = useSearchParams();
  const templateCode = searchParams.get("template");
  
  const [step, setStep] = useState<1 | 2>(1);
  const [genResponse, setGenResponse] = useState<DocumentGeneratorResponse | null>(null);

  const handleDocumentGenerated = (res: DocumentGeneratorResponse) => {
    setGenResponse(res);
    // If it's completely valid, move to step 2
    if (res.isValid && res.generatedContent) {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              Generador de Documentos
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
                Pro
              </span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Cree documentos legales precisos en segundos.
            </p>
          </div>
          
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Cuestionario
            </button>
          )}
        </div>

        {/* Dynamic Content */}
        <div className="relative relative min-h-[60vh]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {templateCode ? (
                  <DocumentQuestionnaire 
                    documentTypeCode={templateCode}
                    onDocumentGenerated={handleDocumentGenerated}
                    initialMissingFields={genResponse?.missingFields || []}
                  />
                ) : (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
                    <Scale className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No se seleccionó plantilla</h3>
                    <p className="text-slate-500">Por favor, regrese a la sección de documentos y elija una plantilla oficial para comenzar.</p>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && genResponse && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Borrador Generado</p>
                      <p className="text-sm text-slate-500">Revise y aplique ajustes finales.</p>
                    </div>
                  </div>
                  
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                    <Send className="w-4 h-4" />
                    Enviar a Firma Digital
                  </button>
                </div>

                <LegalEditor
                  documentId={genResponse.documentPublicId}
                  initialData={genResponse}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

export default function DocumentGenerationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Scale className="w-10 h-10 text-indigo-500 animate-pulse" />
      </div>
    }>
      <DocumentGenerationContent />
    </Suspense>
  );
}
