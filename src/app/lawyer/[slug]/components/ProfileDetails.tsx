import React from 'react';

interface ProfileDetailsProps {
  barAssociation?: string;
  barRegistrationNumber?: string;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ 
  barAssociation, 
  barRegistrationNumber 
}) => {
  return (
    <section className="bg-white border border-slate-200 p-10 rounded-sm shadow-sm" data-purpose="professional-details">
      <h2 className="text-xl font-bold text-primary mb-8">Información Ejecutiva</h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center py-4 border-b border-slate-100">
          <span className="text-sm uppercase tracking-widest text-slate-400 font-semibold">Firma Principal</span>
          <span className="text-slate-900 font-medium">Independiente</span>
        </div>
        {barAssociation && (
          <div className="flex justify-between items-center py-4 border-b border-slate-100">
            <span className="text-sm uppercase tracking-widest text-slate-400 font-semibold">Colegio/Asociación</span>
            <span className="text-primary font-medium">{barAssociation}</span>
          </div>
        )}
        {barRegistrationNumber && (
          <div className="flex justify-between items-center py-4 border-b border-slate-100">
            <span className="text-sm uppercase tracking-widest text-slate-400 font-semibold">N° Colegiatura</span>
            <span className="text-primary font-medium">{barRegistrationNumber}</span>
          </div>
        )}
      </div>
    </section>
  );
};
