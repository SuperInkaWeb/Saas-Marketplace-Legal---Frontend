import React from 'react';
import { Specialty } from '../types';
import { Briefcase } from 'lucide-react'; // default icon

interface ProfileSpecialtiesProps {
  specialties: Specialty[];
}

export const ProfileSpecialties: React.FC<ProfileSpecialtiesProps> = ({ specialties }) => {
  if (!specialties || specialties.length === 0) return null;

  return (
    <section data-purpose="specialties">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
        Áreas de Práctica
        <span className="h-px flex-1 bg-slate-100"></span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 border border-slate-200 rounded-sm overflow-hidden shadow-sm">
        {specialties.map((s, idx) => (
          <div key={idx} className="bg-white p-10 group hover:bg-slate-50 transition-colors">
            <div className={`w-12 h-12 mb-8 ${idx % 2 === 0 ? 'text-blue-600' : 'text-cyan-600'}`}>
              <Briefcase className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{s.name}</h3>
            <p className="text-slate-500 font-light leading-relaxed text-sm">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
