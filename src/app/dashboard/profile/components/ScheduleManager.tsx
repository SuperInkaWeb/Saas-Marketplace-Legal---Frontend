"use client";

import { useState, useEffect } from "react";
import { lawyerConfigService } from "@/modules/profile/services/lawyerConfigService";
import { ScheduleResponse, ScheduleRequest } from "@/modules/profile/types";
import { Clock, Plus, Trash2, Loader2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states for new schedule
  const [newDay, setNewDay] = useState<number>(1);
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("17:00");

  const loadSchedules = async () => {
    try {
      const config = await lawyerConfigService.getMyConfig();
      // Ordenamos para mantener consistencia
      const sorted = config.schedules.sort((a, b) => {
        if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
        return a.startTime.localeCompare(b.startTime);
      });
      setSchedules(sorted);
    } catch (error) {
      console.error("Error cargando horarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleAddSchedule = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const payload: ScheduleRequest = {
        dayOfWeek: newDay,
        startTime: newStart,
        endTime: newEnd,
      };
      await lawyerConfigService.addSchedule(payload);
      setMessage({ type: "success", text: "Horario añadido correctamente." });
      await loadSchedules();
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 409) {
        setMessage({ type: "error", text: "El horario se solapa con otro existente." });
      } else {
        setMessage({ type: "error", text: "Error al añadir el horario." });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este bloque de horario?")) return;
    
    setIsSaving(true);
    setMessage(null);
    try {
      await lawyerConfigService.deleteSchedule(id);
      setMessage({ type: "success", text: "Horario eliminado." });
      await loadSchedules();
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Error al eliminar el horario." });
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
          <Clock className="w-5 h-5 text-emerald-600" />
          Horarios de Atención
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Configura los bloques de tiempo en los que estás disponible para agendar consultas o videollamadas.
        </p>
      </div>

      {/* Add New Schedule Form */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Añadir Nuevo Bloque</h3>
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Día</label>
            <select
              value={newDay}
              onChange={(e) => setNewDay(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
            >
              {DAYS.map((day, idx) => (
                <option key={idx} value={idx}>{day}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Inicio</label>
            <input
              type="time"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
            />
          </div>

          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fin</label>
            <input
              type="time"
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
            />
          </div>

          <button
            onClick={handleAddSchedule}
            disabled={isSaving}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 h-[38px]"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Añadir
          </button>
        </div>
        {message && (
          <p className={`mt-3 text-sm ${message.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
            {message.text}
          </p>
        )}
      </div>

      {/* Schedules List */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Tus Horarios Configurados</h3>
        
        {schedules.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-slate-500 text-sm">
            No has configurado ningún horario aún.
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {schedules.map((schedule) => (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-sm group hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 font-medium text-slate-800">
                      {DAYS[schedule.dayOfWeek]}
                    </div>
                    <div className="text-slate-500 flex items-center gap-2 text-sm">
                      <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-700 font-mono">
                        {schedule.startTime}
                      </span>
                      <span>—</span>
                      <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-700 font-mono">
                        {schedule.endTime}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    disabled={isSaving}
                    title="Eliminar horario"
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
