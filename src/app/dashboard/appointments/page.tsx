"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { appointmentService } from "@/modules/appointment/services/appointmentService";
import { AppointmentResponse } from "@/modules/appointment/types";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, Video, CheckCircle, XCircle, User, Info, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CalendarGrid } from "@/modules/appointment/components/CalendarGrid";

export default function AppointmentsPage() {
  const user = useAuthStore((s) => s.user);
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = user.role === "LAWYER" 
        ? await appointmentService.getLawyerAppointments()
        : await appointmentService.getClientAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (publicId: string, status: string) => {
    try {
      await appointmentService.updateStatus(publicId, status);
      toast.success("Estado actualizado correctamente");
      fetchAppointments();
    } catch (error) {
      toast.error("Error al actualizar estado");
    }
  };

  const selectedDayAppointments = appointments.filter(apt => 
    isSameDay(new Date(apt.scheduledStart), selectedDate)
  );

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string, classes: string }> = {
      PENDING: { label: "Pendiente", classes: "bg-amber-100 text-amber-800 border-amber-200" },
      CONFIRMED: { label: "Confirmada", classes: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      CANCELLED: { label: "Cancelada", classes: "bg-red-100 text-red-800 border-red-200" },
      COMPLETED: { label: "Completada", classes: "bg-blue-100 text-blue-800 border-blue-200" },
      NO_SHOW: { label: "No Asistió", classes: "bg-slate-100 text-slate-800 border-slate-200" }
    };
    const b = badges[status] || badges.PENDING;
    return (
      <span className={cn("px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border", b.classes)}>
        {b.label}
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Mi Calendario
          </h1>
          <p className="mt-2 text-slate-500 font-medium">Gestiona tu agenda legal con precisión y estilo.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
           <div className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-md shadow-emerald-100">
              Vista Mensual
           </div>
           <div className="px-4 py-2 text-slate-400 text-sm font-bold cursor-not-allowed">
              Próximamente: Lista
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calendar Main View */}
        <div className="lg:col-span-8">
          <CalendarGrid 
            appointments={appointments}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        {/* Details Sidebar */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl text-white relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
             <div className="relative z-10">
                <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Detalles del Día</p>
                <h3 className="text-2xl font-bold">
                  {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                </h3>
                <div className="mt-4 flex items-center gap-4">
                   <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-bold">{selectedDayAppointments.length} Citas</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {loading ? (
                 <div key="loading" className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                 </div>
              ) : selectedDayAppointments.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-10 border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center gap-3"
                >
                  <div className="bg-slate-50 p-4 rounded-full">
                    <Calendar className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">No hay citas para este día.</p>
                </motion.div>
              ) : (
                <div key="list" className="space-y-4">
                  {selectedDayAppointments.map((apt) => (
                    <motion.div
                      key={apt.publicId}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                            <User className="w-4 h-4 text-slate-500 group-hover:text-emerald-600" />
                           </div>
                           <span className="font-bold text-slate-900">{user?.role === "LAWYER" ? apt.clientName : apt.lawyerName}</span>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>

                      <div className="space-y-3 mb-5">
                        <div className="flex items-center gap-3 text-slate-600 text-sm border-l-2 border-emerald-500 pl-3">
                           <Clock className="w-4 h-4" />
                           <span className="font-semibold">{format(new Date(apt.scheduledStart), "HH:mm")} - {format(new Date(apt.scheduledEnd), "HH:mm")}</span>
                        </div>
                        {apt.notes && (
                          <div className="bg-slate-50 p-3 rounded-lg flex gap-2">
                            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-500 leading-relaxed italic">{apt.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {apt.meetingLink && apt.status === 'CONFIRMED' && (
                          <a 
                            href={apt.meetingLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                          >
                            <Video className="w-4 h-4" /> Unirse
                          </a>
                        )}

                        {user?.role === "LAWYER" && apt.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(apt.publicId, "CONFIRMED")}
                              className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => handleStatusChange(apt.publicId, "CANCELLED")}
                              className="p-2.5 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-xl transition-colors"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        {user?.role === "LAWYER" && apt.status === "CONFIRMED" && (
                          <button
                            onClick={() => handleStatusChange(apt.publicId, "COMPLETED")}
                            className="flex-1 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-colors shadow-lg"
                          >
                            Completada
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
