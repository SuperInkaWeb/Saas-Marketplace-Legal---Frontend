"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/modules/admin/api";
import { DocumentTemplateResponse } from "@/modules/admin/types";
import { Plus, Edit2, Trash2, FileText, FileCode2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<DocumentTemplateResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error("Error al cargar las plantillas");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta plantilla? Esta acción no se puede deshacer.")) return;
    
    try {
      await adminApi.deleteTemplate(publicId);
      toast.success("Plantilla eliminada correctamente");
      setTemplates((prev) => prev.filter((t) => t.publicId !== publicId));
    } catch (error) {
      toast.error("Error al eliminar la plantilla");
    }
  };

  const toggleStatus = async (template: DocumentTemplateResponse) => {
    try {
      const updated = await adminApi.updateTemplate(template.publicId, {
        name: template.name,
        code: template.code,
        jurisdiction: template.jurisdiction,
        content: template.content,
        requiredFields: template.requiredFields,
        fieldDefinitions: template.fieldDefinitions,
        isActive: !template.isActive
      });
      toast.success(updated.isActive ? "Plantilla activada" : "Plantilla desactivada");
      setTemplates(prev => prev.map(t => t.publicId === updated.publicId ? updated : t));
    } catch (e) {
      toast.error("Error al cambiar el estado");
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">Plantillas Legales</h1>
          <p className="text-slate-400">Gestiona los modelos de contratos y documentos oficiales para que los abogados puedan generarlos.</p>
        </div>
        <Link 
          href="/admin/templates/new"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Crear Plantilla
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 flex flex-col items-center text-center">
          <FileCode2 className="w-16 h-16 text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No hay plantillas</h3>
          <p className="text-slate-400 mb-6 max-w-md">No se han encontrando plantillas en el sistema. Crea la primera para que los abogados comiencen a generar documentos.</p>
          <Link 
            href="/admin/templates/new"
            className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Crear Primera Plantilla
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {templates.map((template) => (
              <motion.div
                key={template.publicId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col group relative overflow-hidden"
              >
                {!template.isActive && (
                  <div className="absolute inset-0 bg-slate-900/60 z-10 backdrop-blur-[1px] pointer-events-none" />
                )}
                
                <div className="flex justify-between items-start mb-4 relative z-20">
                  <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center border border-slate-600">
                    <FileText className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(template)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium border transition-colors ${template.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'}`}
                    >
                      {template.isActive ? 'Activo' : 'Inactivo'}
                    </button>
                  </div>
                </div>

                <div className="relative z-20">
                  <h3 className="text-lg font-bold text-white mb-1 truncate" title={template.name}>
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                    <span className="bg-slate-700 px-2 py-0.5 rounded text-xs font-mono">{template.code}</span>
                    <span className="truncate">{template.jurisdiction}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-700 flex items-center justify-between relative z-20">
                  <span className="text-xs text-slate-500">
                    {format(new Date(template.createdAt), "dd MMM yyyy", { locale: es })}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/admin/templates/${template.publicId}`}
                      className="p-2 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(template.publicId)}
                      className="p-2 text-slate-400 hover:text-red-400 bg-slate-700/50 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
