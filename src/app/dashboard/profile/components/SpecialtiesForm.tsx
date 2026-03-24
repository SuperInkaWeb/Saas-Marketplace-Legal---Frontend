"use client";

import { useState, useEffect } from "react";
import { lawyerConfigService } from "@/modules/profile/services/lawyerConfigService";
import { SpecialtyResponse, UpdateSpecialtiesRequest } from "@/modules/profile/types";
import { Briefcase, Save, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function SpecialtiesForm() {
  const [allSpecialties, setAllSpecialties] = useState<SpecialtyResponse[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [specialties, config] = await Promise.all([
          lawyerConfigService.getAllSpecialties(),
          lawyerConfigService.getMyConfig(),
        ]);
        setAllSpecialties(specialties);
        
        const myIds = config.specialties.map(s => s.id);
        setSelectedIds(new Set(myIds));
      } catch (error) {
        console.error("Error cargando especialidades:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleSpecialty = (id: number) => {
    setMessage(null);
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const onSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const payload: UpdateSpecialtiesRequest = {
        specialtyIds: Array.from(selectedIds),
      };
      await lawyerConfigService.updateSpecialties(payload);
      setMessage({ type: "success", text: "Especialidades actualizadas correctamente." });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Error al guardar especialidades." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-emerald-600">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-600" />
          Tus Especialidades
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Selecciona las áreas del derecho en las que te especializas. Esto ayudará a los clientes a encontrarte más fácilmente.
        </p>
      </div>

      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSpecialties.map((spec) => {
            const isSelected = selectedIds.has(spec.id);
            return (
              <motion.button
                key={spec.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSpecialty(spec.id)}
                className={`
                  relative flex flex-col p-4 text-left border rounded-xl transition-all duration-200
                  ${isSelected 
                    ? "bg-emerald-50 border-emerald-500 shadow-sm" 
                    : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50"}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-medium ${isSelected ? "text-emerald-900" : "text-slate-700"}`}>
                    {spec.name}
                  </span>
                  <div className={`
                    w-5 h-5 rounded-full flex items-center justify-center border transition-colors
                    ${isSelected ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"}
                  `}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
                {spec.description && (
                  <p className={`text-xs ${isSelected ? "text-emerald-700/80" : "text-slate-500"}`}>
                    {spec.description}
                  </p>
                )}
              </motion.button>
            );
          })}
        </div>
        
        {allSpecialties.length === 0 && (
          <div className="text-center py-12 text-slate-500 border-2 border-dashed rounded-xl">
            No se encontraron especialidades disponibles.
          </div>
        )}
      </div>

      <div className="pt-6 mt-8 border-t border-slate-100 flex items-center justify-between shrink-0">
        <div className="text-sm">
          {message && (
            <span className={message.type === "success" ? "text-emerald-600" : "text-red-600"}>
              {message.text}
            </span>
          )}
        </div>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar Especialidades
        </button>
      </div>
    </div>
  );
}
