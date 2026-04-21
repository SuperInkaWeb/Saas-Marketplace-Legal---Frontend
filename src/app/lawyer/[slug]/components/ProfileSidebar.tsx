import React, { useState } from 'react';
import { Schedule } from '../types';
import { BookingModal } from './BookingModal';
import { useAuthStore } from '@/modules/auth/store';
import { useRouter, usePathname } from 'next/navigation';

interface ProfileSidebarProps {
  schedules: Schedule[];
  lawyerPublicId: string;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ schedules, lawyerPublicId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const pathname = usePathname();

  const handleBookingClick = () => {
    if (!token) {
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/login?redirect=${returnUrl}`);
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <aside className="lg:col-span-4" data-purpose="sidebar-appointment">
      <div className="bg-white p-10 sticky top-32 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-slate-50">
        
        <div className="mb-12">
          <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-b-2 border-accent pb-4 inline-block">
            Disponibilidad
          </h3>
        </div>

        {/* Dynamic Schedule List */}
        <div className="mb-12">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Horario Regular de Consulta</p>
          {schedules.length > 0 ? (
            <div className="space-y-6">
              {schedules.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <span className="text-[11px] font-black text-primary uppercase tracking-widest group-hover:text-accent transition-colors">
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][s.dayOfWeek - 1]}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 border border-slate-100 italic">
                    {s.startTime} - {s.endTime}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 border border-slate-100">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Sin horarios definidos</p>
            </div>
          )}
        </div>

        {/* Booking Button */}
        <button 
          onClick={handleBookingClick}
          className="w-full bg-primary hover:bg-accent text-white text-[10px] font-black tracking-[0.3em] py-6 transition-all shadow-xl active:scale-[0.98] uppercase"
        >
          Agendar Consulta
        </button>
        <p className="mt-8 text-center text-[9px] text-slate-400 uppercase tracking-[0.2em] font-bold">
          Acuerdo de precisión técnica requerido
        </p>

      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        schedules={schedules} 
        lawyerPublicId={lawyerPublicId} 
      />
    </aside>
  );
};
