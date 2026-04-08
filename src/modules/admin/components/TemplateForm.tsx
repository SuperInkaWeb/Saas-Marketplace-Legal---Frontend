"use client";

import { DocumentTemplateRequest } from "@/modules/admin/types";
import { Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { useState } from "react";

interface TemplateFormProps {
  initialData?: DocumentTemplateRequest;
  onSubmit: (data: DocumentTemplateRequest) => Promise<void>;
  loading?: boolean;
}

export function TemplateForm({ initialData, onSubmit, loading }: TemplateFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<DocumentTemplateRequest>(
    initialData || {
      name: "",
      code: "",
      jurisdiction: "Global",
      content: "",
      requiredFields: "",
      isActive: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: DocumentTemplateRequest) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white transition-colors">
            {initialData ? "Editar Plantilla" : "Nueva Plantilla"}
          </h1>
          <p className="text-slate-400 text-sm">Configura el contenido y los campos dinámicos.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Información General</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Nombre de la Plantilla</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Contrato de Arrendamiento"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Código Único</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="Ej: RENT_001"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Jurisdicción</label>
                <input
                  type="text"
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleChange}
                  required
                  placeholder="Ej: España, México, Global"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-700 bg-slate-800/80">
              <h2 className="text-lg font-bold text-white">Contenido (Editor Visual)</h2>
            </div>
            <div className="flex-1 bg-white">
              <RichTextEditor
                value={formData.content}
                onChange={(html) => setFormData((p: DocumentTemplateRequest) => ({ ...p, content: html }))}
                placeholder="Escribe el contenido legal aquí. Utiliza {{NOMBRE_CAMPO}} para campos dinámicos..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Configuración</h2>
            
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800"
                />
                <span className="text-sm font-medium text-slate-300">Plantilla Activa</span>
              </label>
              <p className="text-xs text-slate-500 mt-2 ml-8">Las plantillas inactivas no serán visibles para los abogados.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Campos Dinámicos</label>
              <p className="text-xs text-slate-400 mb-3">Separados por coma. Deben coincidir con los de uso en el contenido: {"{{CAMPO}}"}</p>
              <textarea
                name="requiredFields"
                value={formData.requiredFields}
                onChange={handleChange}
                rows={5}
                placeholder="NOMBRE_CLIENTE, DIRECCION, PRECIO..."
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-mono text-sm resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Plantilla
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
