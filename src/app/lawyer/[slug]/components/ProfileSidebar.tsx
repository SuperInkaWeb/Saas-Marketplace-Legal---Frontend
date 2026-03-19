import React from 'react';
import { Schedule } from '../types';

interface ProfileSidebarProps {
  schedules: Schedule[];
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ schedules }) => {
  return (
    <aside className="lg:col-span-4" data-purpose="sidebar-appointment">
      <div className="bg-white p-8 sticky top-32 border border-slate-200 rounded-sm shadow-xl">
        
        <div className="mb-10">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Horarios</h3>
        </div>

        {/* Dynamic Schedule List styled as time slots */}
        <div className="mb-10">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Disponibilidad Regular</span>
          {schedules.length > 0 ? (
            <div className="space-y-3">
              {schedules.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][s.dayOfWeek - 1]}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 bg-slate-50 px-2 py-1 rounded-sm border border-slate-200">
                    {s.startTime} - {s.endTime}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-slate-50 border border-slate-100 rounded-sm">
              <p className="text-slate-400 text-sm font-medium">Horarios no configurados</p>
            </div>
          )}
        </div>

        {/* Booking Button */}
        <button className="w-full bg-slate-900 hover:bg-black text-white text-sm font-bold tracking-widest py-5 rounded-sm transition-all shadow-lg active:scale-[0.98] uppercase">
          Agendar Consulta
        </button>
        <p className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest font-medium">
          Se aplican acuerdos de confidencialidad
        </p>

      </div>
    </aside>
  );
};
