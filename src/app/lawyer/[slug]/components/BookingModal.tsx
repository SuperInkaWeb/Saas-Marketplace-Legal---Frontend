"use client";

import React, { useState, useEffect } from 'react';
import { Schedule } from '../types';
import { X, Calendar as Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store';
import { appointmentService } from '@/modules/appointment/services/appointmentService';
import { toast } from 'sonner';
import { format, addDays, startOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, addMonths, subMonths, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedules: Schedule[];
  lawyerPublicId: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, schedules, lawyerPublicId }) => {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{start: string, end: string} | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [busySlots, setBusySlots] = useState<{start: string, end: string}[]>([]);

  const refreshBusySlots = () => {
    if (lawyerPublicId) {
      appointmentService.getBusySlots(lawyerPublicId)
        .then(data => {
          const formatted = data.map(slot => {
            const d = new Date(slot.start);
            d.setSeconds(0, 0);
            return { start: d.getTime() };
          });
          setBusySlots(formatted as any);
        })
        .catch(err => console.error("Error fetching busy slots", err));
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshBusySlots();
    }
  }, [isOpen, lawyerPublicId]);

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

  const getDaySchedules = (date: Date) => {
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
    return schedules.filter(s => s.dayOfWeek === dayOfWeek);
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
      // Construct date times respecting local timezone
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const startDateTime = new Date(`${dateStr}T${selectedTimeSlot.start}:00`);
      const endDateTime = new Date(`${dateStr}T${selectedTimeSlot.end}:00`);
      
      // Safety check: Ensure the selected time is at least 5 minutes in the future
      const now = new Date();
      if (startDateTime <= new Date(now.getTime() + 5 * 60000)) {
        toast.error("La hora de inicio debe ser al menos 5 minutos en el futuro respecto a la hora actual.");
        setLoading(false);
        return;
      }
      
      const startDateTimeStr = startDateTime.toISOString();
      const endDateTimeStr = endDateTime.toISOString();

      await appointmentService.createAppointment({
        lawyerPublicId,
        scheduledStart: startDateTimeStr,
        scheduledEnd: endDateTimeStr,
        notes
      });
      
      toast.success("Cita agendada exitosamente");
      setIsSuccess(true);
      refreshBusySlots(); // Update busy slots immediately
      // Automatically close after 3 seconds if user doesn't
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error: any) {
      const errorDetail = error.response?.data?.detail || error.response?.data?.message || "Error al agendar la cita. Es posible que el horario ya esté reservado.";
      toast.error(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset all states after modal animation finishes
    setTimeout(() => {
      setSelectedDate(null);
      setSelectedTimeSlot(null);
      setNotes("");
      setIsSuccess(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-primary">Agendar Consulta</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 relative flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white z-20"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-xl shadow-emerald-500/10">
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <ShieldCheck className="w-10 h-10 text-emerald-600" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">¡Cita Confirmada!</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto mb-8">
                  Tu consulta ha sido agendada con éxito. Podrás ver los detalles y gestionar tu cita desde tu panel de control.
                </p>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg"
                >
                  Entendido
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6"
              >
                {!user ? (
                  <div className="bg-accent/5 text-primary p-4 rounded-lg text-sm mb-4 border border-accent/20">
                    Debes iniciar sesión en tu cuenta para poder agendar una consulta.
                  </div>
                ) : null}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-primary">1. Selecciona una Fecha</label>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 text-accent" />
                      </button>
                      <span className="text-xs font-bold text-primary min-w-[80px] text-center first-letter:uppercase">
                        {format(currentMonth, 'MMM yyyy', { locale: es })}
                      </span>
                      <button 
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-accent" />
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
                                ? "bg-primary text-white font-bold shadow-md shadow-primary/10" 
                                : isCurrMonth && hasSchedule && !isPast
                                  ? "hover:bg-white hover:shadow-sm text-slate-700 font-medium" 
                                  : "text-slate-300 cursor-not-allowed opacity-20"
                            )}
                          >
                            {format(day, 'd')}
                            {hasSchedule && !isPast && isCurrMonth && !isSelected && (
                              <div className="absolute bottom-1 w-1 h-1 bg-accent rounded-full" />
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
                    <label className="block text-sm font-semibold text-primary mb-3">2. Horario Disponible</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(() => {
                    const daySchedules = getDaySchedules(selectedDate);
                    if (daySchedules.length === 0) return <p className="text-sm text-slate-500 col-span-2">El abogado no atiende este día.</p>;
                        
                        return (
                          <>
                            {(() => {
                              const now = new Date();
                              const availableSlots = daySchedules.map(schedule => {
                      const datePart = format(selectedDate, 'yyyy-MM-dd');
                      const slotDate = new Date(`${datePart}T${schedule.startTime}:00`);
                      const isPast = isSameDay(selectedDate, now) && slotDate <= now;
                      
                      // Check if this slot is busy using timestamps (normalized to minute)
                      const slotDateNormalized = new Date(slotDate);
                      slotDateNormalized.setSeconds(0, 0);
                      const isBusy = busySlots.some((bs: any) => 
                        bs.start === slotDateNormalized.getTime()
                      );

                      return { ...schedule, isPast, isBusy };
                    });

                    const futureSlotsCount = availableSlots.filter(s => !s.isPast).length;

                              if (futureSlotsCount === 0 && isSameDay(selectedDate, now)) {
                                return (
                                  <div className="col-span-2 bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                      <p className="text-sm font-bold text-amber-900">Horarios agotados para hoy</p>
                                      <p className="text-xs text-amber-700">Ya no hay más horas disponibles para este día. Por favor, selecciona otra fecha en el calendario.</p>
                                    </div>
                                  </div>
                                );
                              }

                              return availableSlots.map((s, i) => (
                                <button
                                  key={i}
                                  disabled={s.isPast || s.isBusy}
                                  onClick={() => setSelectedTimeSlot({start: s.startTime, end: s.endTime})}
                                  className={cn(
                                    "flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all relative overflow-hidden",
                                    selectedTimeSlot?.start === s.startTime
                                      ? "bg-accent border-accent text-white shadow-lg shadow-accent/20"
                                      : s.isBusy 
                                        ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                                        : "bg-white border-slate-200 text-slate-700 hover:border-accent/50 hover:bg-accent/5",
                                    s.isPast ? "opacity-30 cursor-not-allowed grayscale" : ""
                                  )}
                                >
                                  <Clock className="w-4 h-4" />
                                  <span className="font-bold text-sm tracking-tight">
                                    {s.startTime} - {s.endTime}
                                  </span>
                                  {s.isBusy && (
                                    <span className="absolute inset-0 flex items-center justify-center bg-slate-50/80 text-[8px] font-black uppercase tracking-widest text-slate-400 rotate-12">
                                      Reservado
                                    </span>
                                  )}
                                </button>
                              ));
                            })()}
                          </>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3">3. Notas (Opcional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe brevemente el motivo de tu consulta..."
                    className="w-full text-sm rounded-xl border border-slate-200 p-4 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none resize-none h-24 bg-slate-50/50"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          {!user ? (
            <button
              onClick={() => router.push("/login?redirect=" + window.location.pathname)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold tracking-widest py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] uppercase flex items-center justify-center gap-2"
            >
              Iniciar Sesión para Agendar
            </button>
          ) : (
            <div className="space-y-4">
              {/* Status Helper */}
              {(!selectedDate || !selectedTimeSlot) && (
                <div className="flex flex-col gap-1 px-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Pasos pendientes:</p>
                  <div className="flex gap-3">
                    <span className={cn("text-[10px] font-bold flex items-center gap-1", selectedDate ? "text-emerald-500" : "text-amber-500")}>
                      {selectedDate ? "✓" : "○"} 1. Fecha
                    </span>
                    <span className={cn("text-[10px] font-bold flex items-center gap-1", selectedTimeSlot ? "text-emerald-500" : "text-amber-500")}>
                      {selectedTimeSlot ? "✓" : "○"} 2. Horario
                    </span>
                  </div>
                </div>
              )}
              
              <button
                disabled={!selectedDate || !selectedTimeSlot || loading}
                onClick={handleBook}
                className={cn(
                  "w-full text-sm font-bold tracking-widest py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] uppercase flex items-center justify-center",
                  !selectedDate || !selectedTimeSlot 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
                    : "bg-primary hover:bg-accent text-white shadow-primary/20"
                )}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : !selectedDate ? (
                  "Selecciona una fecha"
                ) : !selectedTimeSlot ? (
                  "Selecciona un horario"
                ) : (
                  "Confirmar Cita"
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
