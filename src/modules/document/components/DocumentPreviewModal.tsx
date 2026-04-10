"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DocumentResponse } from "../types";
import api from "@/lib/api";
import { X, Download, FileText, ExternalLink, Loader2 } from "lucide-react";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentResponse | null;
}

export const DocumentPreviewModal = ({ isOpen, onClose, document }: DocumentPreviewModalProps) => {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsReady(false);
      // If it's HTML, it renders instantly
      if (document?.fileType?.includes("html") || document?.content) {
        setIsReady(true);
      }
    }
  }, [isOpen, document?.fileUrl, document?.content]);

  if (!document) return null;

  const isImage = document.fileType?.includes("image") || 
                  /\.(jpg|jpeg|png|gif|webp)$/i.test(document.fileUrl);
  const isPdf = document.fileType?.includes("pdf") || 
                /\.pdf$/i.test(document.fileUrl);
  const isHtml = document.fileType?.includes("html") || document.content;

  const handleOpenFull = async () => {
    if (!document) return;
    try {
      const response = await api.get(`/documents/${document.publicId}/file`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      window.open(url, "_blank");
    } catch (e) {
      console.error("Error opening document", e);
    }
  };

  const handleDownload = async () => {
    if (!document) return;
    try {
      const response = await api.get(`/documents/${document.publicId}/file`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      const link = window.document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.fileName);
      window.document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error("Error downloading document", e);
    }
  };

  // Helper to generate a foolproof preview URL using Cloudinary transformations
  const getPreviewUrl = () => {
    if (!document) return "";
    
    // If it's a PDF, transform it to a JPG of the first page to bypass iframe blocks
    if (isPdf && document.fileUrl.includes("cloudinary")) {
      return document.fileUrl
        .replace("/upload/", "/upload/f_auto,q_auto,pg_1,w_1200/")
        .replace(".pdf", ".jpg");
    }
    return document.fileUrl;
  };

  const previewUrl = getPreviewUrl();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] overflow-hidden flex flex-col relative z-50 border border-slate-200"
          >
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 truncate pr-4">
                    {document.fileName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                      Vista Previa Profesional
                    </p>
                    {isPdf && (
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100 uppercase">
                        Primera Página
                      </span>
                    )}
                    {isHtml && (
                      <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">
                        Borrador Legal
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenFull}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                   <ExternalLink className="w-3.5 h-3.5" />
                   Cargar Completo
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                  title="Descargar"
                >
                  <Download className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 bg-slate-50 overflow-hidden relative flex flex-col items-center justify-center">
              {!isReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 text-center p-6">
                   <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
                     Optimizando vista previa...
                   </p>
                </div>
              )}

              <div className="w-full h-full p-4 md:p-8 flex flex-col items-center justify-start overflow-auto scrollbar-hide">
                {isHtml ? (
                  <div className="w-full max-w-4xl bg-white shadow-xl border border-slate-200 p-12 min-h-screen mb-8">
                    <div 
                      className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: document.content || "El documento no tiene contenido." }}
                    />
                    {isReady && (
                       <div className="mt-12 flex flex-col items-center border-t border-slate-100 pt-8">
                         <button 
                           onClick={handleOpenFull}
                           className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                         >
                           <ExternalLink className="w-4 h-4" />
                           Generar y Ver PDF Oficial
                         </button>
                       </div>
                    )}
                  </div>
                ) : isPdf || isImage ? (
                  <div className="relative group max-w-full">
                    <img
                      src={previewUrl}
                      onLoad={() => setIsReady(true)}
                      alt={document.fileName}
                      className={`max-w-full h-auto object-contain rounded shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 transition-all duration-500 ${isReady ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    />
                    {isPdf && isReady && (
                      <div className="mt-8 mb-12 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <p className="text-xs font-medium text-slate-500 mb-4 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                          Estás viendo una previsualización de la primera página
                        </p>
                        <button 
                          onClick={handleOpenFull}
                          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Ver Documento Completo
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-slate-200 max-w-md my-auto">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="w-10 h-10 text-amber-500" />
                    </div>
                    <h4 className="text-xl font-extrabold text-slate-900 mb-2">Vista previa no disponible</h4>
                    <p className="text-slate-500 mb-6 font-medium">
                      Este formato no permite previsualización instantánea.
                    </p>
                    <button 
                      onClick={handleDownload}
                      className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                    >
                      Descargar Archivo
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer / Status */}
            <div className="p-3 bg-white border-t border-slate-50 flex items-center justify-center">
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 {isReady ? (
                   <span className="text-emerald-500 flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Conexión segura establecida
                   </span>
                 ) : (
                   <span className="flex items-center gap-1.5">
                     <Loader2 className="w-3 h-3 animate-spin text-indigo-400" /> Negociando protocolo de vista previa
                   </span>
                 )}
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Helper for generic icon inside conditional
const AlertCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
