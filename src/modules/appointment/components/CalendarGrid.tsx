"use client";

import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AppointmentResponse } from '../types';

interface CalendarGridProps {
  appointments: AppointmentResponse[];
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ appointments, onSelectDate, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getDayAppointments = (day: Date) => {
    return appointments.filter(apt => isSameDay(new Date(apt.scheduledStart), day));
  };

  const dayNames = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-200">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 first-letter:uppercase">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </h2>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Resumen Mensual</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-lg border border-slate-100 transition-all"
          >
            Hoy
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {dayNames.map((day) => (
          <div key={day} className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMonth.toString()}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="contents"
          >
            {calendarDays.map((day, idx) => {
              const dayApts = getDayAppointments(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, monthStart);
              
              return (
                <button
                  key={day.toString()}
                  onClick={() => onSelectDate(day)}
                  className={cn(
                    "min-h-[100px] p-2 border-r border-b border-slate-50 transition-all hover:bg-emerald-50/30 group relative flex flex-col items-start text-left",
                    !isCurrentMonth && "bg-slate-50/30",
                    isSelected && "bg-emerald-50 ring-2 ring-emerald-600 ring-inset z-10",
                    idx % 7 === 6 && "border-r-0"
                  )}
                >
                  <span className={cn(
                    "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                    isToday(day) ? "bg-emerald-600 text-white" : "text-slate-700",
                    !isCurrentMonth && "text-slate-300",
                    isSelected && !isToday(day) && "text-emerald-700 font-black"
                  )}>
                    {format(day, 'd')}
                  </span>

                  <div className="mt-2 space-y-1 w-full overflow-hidden">
                    {dayApts.slice(0, 3).map((apt) => (
                      <div 
                        key={apt.publicId}
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded border truncate font-bold uppercase tracking-tighter",
                          apt.status === 'CONFIRMED' ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                          apt.status === 'PENDING' ? "bg-amber-100 text-amber-800 border-amber-200" :
                          "bg-slate-100 text-slate-800 border-slate-200"
                        )}
                      >
                        {format(new Date(apt.scheduledStart), 'HH:mm')} {apt.clientName || 'Cita'}
                      </div>
                    ))}
                    {dayApts.length > 3 && (
                      <div className="text-[9px] text-slate-400 font-bold px-1">
                        + {dayApts.length - 3} más
                      </div>
                    )}
                  </div>

                  {dayApts.length > 0 && !isSelected && (
                    <div className="absolute top-2 right-2 flex gap-0.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
