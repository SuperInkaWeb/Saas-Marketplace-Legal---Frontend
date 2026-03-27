"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateSpecialtyRequest, SpecialtyResponse } from "@/modules/admin/types";
import { adminApi } from "@/modules/admin/api";

const specialtySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  // We use z.boolean() without default(true) to avoid Resolver type mismatch in useForm.
  // The default value is handled by useForm's defaultValues and the useEffect reset.
  isActive: z.boolean(),
});

type SpecialtyFormData = z.infer<typeof specialtySchema>;

interface SpecialtyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  specialty?: SpecialtyResponse | null; // If present, we are editing
}

export default function SpecialtyModal({ isOpen, onClose, onSuccess, specialty }: SpecialtyModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SpecialtyFormData>({
    resolver: zodResolver(specialtySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (specialty) {
      reset({
        name: specialty.name,
        description: specialty.description,
        isActive: specialty.isActive,
      });
    } else {
      reset({
        name: "",
        description: "",
        isActive: true,
      });
    }
    setError(null);
  }, [specialty, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: SpecialtyFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (specialty) {
        await adminApi.updateSpecialty(specialty.id, data);
      } else {
        await adminApi.createSpecialty(data);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("[SpecialtyModal] Error saving specialty:", err);
      
      // Extraction of API error details following standard backend response pattern
      let errorMessage = "Ocurrió un error inesperado al guardar la especialidad.";
      
      if (err && typeof err === 'object' && 'response' in err) {
        const apiError = err as { response?: { data?: { detail?: string } } };
        errorMessage = apiError.response?.data?.detail || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">
            {specialty ? "Editar Especialidad" : "Nueva Especialidad"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Nombre de la Especialidad
            </label>
            <input
              {...register("name")}
              placeholder="Ej: Derecho Digital"
              className={`w-full px-4 py-3 rounded-2xl border bg-slate-50 text-sm font-medium focus:outline-none focus:ring-4 transition-all ${
                errors.name 
                  ? "border-red-300 ring-red-50 focus:border-red-500" 
                  : "border-slate-200 ring-emerald-50 focus:border-emerald-500"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-2 ml-1 font-semibold italic">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Descripción
            </label>
            <textarea
              {...register("description")}
              placeholder="Describe brevemente de qué trata esta área..."
              rows={4}
              className={`w-full px-4 py-3 rounded-2xl border bg-slate-50 text-sm font-medium focus:outline-none focus:ring-4 transition-all resize-none ${
                errors.description 
                  ? "border-red-300 ring-red-50 focus:border-red-500" 
                  : "border-slate-200 ring-emerald-50 focus:border-emerald-500"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-2 ml-1 font-semibold italic">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <input
              id="isActive"
              type="checkbox"
              {...register("isActive")}
              className="w-5 h-5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">
              Especialidad Activa
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] py-3 px-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
