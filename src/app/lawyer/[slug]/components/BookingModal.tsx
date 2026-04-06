"use client";

import React, { useState } from 'react';
import { Schedule } from '../types';
import { X, Calendar as Clock } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store';
import { appointmentService } from '@/modules/appointment/services/appointmentService';
import { toast } from 'sonner';
import { format, addDays, startOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, addMonths, subMonths, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedules: Schedule[];
  lawyerPublicId: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, schedules, lawyerPublicId }) => {
  const user = useAuthStore((s) => s.user);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{start: string, end: string} | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Calendar Logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  if (!isOpen) return null;

  // Generate next 14 days
  const nextDays = Array.from({ length: 14 }, (_, i) => addDays(startOfDay(new Date()), i + 1));

  // Find available days based on schedule
  const availableDays = nextDays.filter(date => {
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // JS Sunday is 0, our DB is 1=Mon, 7=Sun
    return schedules.some(s => s.dayOfWeek === dayOfWeek);
  });

  const getDaySchedule = (date: Date) => {
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
    return schedules.find(s => s.dayOfWeek === dayOfWeek);
  };

  const handleBook = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión como cliente para agendar.");
      return;
    }
    if (user.role === "LAWYER") {
      toast.error("Los abogados no pueden agendar citas.");
      return;
    }
    if (!selectedDate || !selectedTimeSlot) {
      toast.error("Por favor selecciona una fecha y horario.");
      return;
    }

    try {
      setLoading(true);
      // Construct date times
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const startDateTimeStr = `${dateStr}T${selectedTimeSlot.start}:00Z`; // Using UTC for simplicity, should use real timezone
      const endDateTimeStr = `${dateStr}T${selectedTimeSlot.end}:00Z`;

      await appointmentService.createAppointment({
        lawyerPublicId,
        scheduledStart: startDateTimeStr,
        scheduledEnd: endDateTimeStr,
        notes
      });
      
      toast.success("Cita agendada exitosamente");
      onClose();
      const errorDetail = error.response?.data?.detail || error.response?.data?.message || "Error al agendar la cita. Es posible que el horario ya esté reservado.";
      toast.error(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Agendar Consulta</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {!user ? (
            <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-sm mb-4 border border-amber-200">
              Debes iniciar sesión en tu cuenta para poder agendar una consulta.
            </div>
          ) : null}

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-900">1. Selecciona una Fecha</label>
              <div className="flex gap-1">
                <button 
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-500" />
                </button>
                <span className="text-xs font-bold text-slate-600 min-w-[80px] text-center first-letter:uppercase">
                  {format(currentMonth, 'MMM yyyy', { locale: es })}
                </span>
                <button 
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
              <div className="grid grid-cols-7 mb-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <div key={i} className="text-[10px] font-black text-slate-400 text-center uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const dayOfWeek = day.getDay() === 0 ? 7 : day.getDay();
                  const hasSchedule = schedules.some(s => s.dayOfWeek === dayOfWeek);
                  const isPast = day < startOfDay(new Date());
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrMonth = isSameMonth(day, currentMonth);

                  return (
                    <button
                      key={idx}
                      disabled={!hasSchedule || isPast || !isCurrMonth}
                      onClick={() => {
                        setSelectedDate(day);
                        setSelectedTimeSlot(null);
                      }}
                      className={cn(
                        "h-9 w-full flex items-center justify-center rounded-lg text-sm transition-all relative",
                        isSelected 
                          ? "bg-slate-900 text-white font-bold shadow-md shadow-slate-200" 
                          : isCurrMonth && hasSchedule && !isPast
                            ? "hover:bg-white hover:shadow-sm text-slate-700 font-medium" 
                            : "text-slate-300 cursor-not-allowed opacity-20"
                      )}
                    >
                      {format(day, 'd')}
                      {hasSchedule && !isPast && isCurrMonth && !isSelected && (
                        <div className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {selectedDate && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <label className="block text-sm font-semibold text-slate-900 mb-3">2. Horario Disponible</label>
              <div className="grid grid-cols-2 gap-3">
                {(() => {
                  const schedule = getDaySchedule(selectedDate);
                  if (!schedule) return <p className="text-sm text-slate-500 col-span-2">No hay horarios definidos.</p>;
                  
                  return (
                    <button
                      onClick={() => setSelectedTimeSlot({start: schedule.startTime, end: schedule.endTime})}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all",
                        selectedTimeSlot?.start === schedule.startTime
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100"
                          : "bg-white border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/30"
                      )}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="font-bold text-sm tracking-tight">{schedule.startTime} - {schedule.endTime}</span>
                    </button>
                  );
                })()}
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">3. Notas (Opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe brevemente el motivo de tu consulta..."
              className="w-full text-sm rounded-xl border border-slate-200 p-4 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none resize-none h-24 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <button
            disabled={!selectedDate || !selectedTimeSlot || loading || !user}
            onClick={handleBook}
            className="w-full bg-slate-900 hover:bg-black text-white text-sm font-bold tracking-widest py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Confirmar Cita"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
