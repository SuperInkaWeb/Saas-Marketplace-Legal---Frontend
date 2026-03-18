import React from 'react';
import { Schedule } from '../types';

interface ProfileSidebarProps {
  schedules: Schedule[];
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ schedules }) => {
  return (
    <aside className="lg:col-span-4">
      <div className="bg-white p-8 sticky top-32 border border-slate-200 rounded-sm shadow-xl">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest">Horarios</h3>
          <div className="flex items-center gap-2 text-[10px] text-green-600 font-bold uppercase tracking-tighter">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Disponible ahora
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-4 mb-10">
          {schedules.length > 0 ? (
            schedules.map((s, idx) => (
              <div key={idx} className="flex justify-between text-sm py-2 border-b border-slate-50">
                <span className="text-slate-400 font-medium">
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][s.dayOfWeek - 1]}
                </span>
                <span className="text-slate-900 font-bold">{s.startTime} - {s.endTime}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-sm italic">Sin horarios definidos</p>
          )}
        </div>

        <button className="w-full bg-slate-900 hover:bg-black text-white text-sm font-bold tracking-widest py-5 rounded-sm transition-all shadow-lg active:scale-[0.98] uppercase">
          Reservar Cita
        </button>
        <p className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest font-medium">
          Se aplican acuerdos de confidencialidad
        </p>
      </div>
    </aside>
  );
};
