import React from 'react';
import { PublicProfile } from '../types';
import Image from "next/image";

interface ProfileHeroProps {
  profile: PublicProfile;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ profile }) => {
  return (
    <header className="hero-border pt-40 pb-20 relative overflow-hidden bg-white" data-purpose="profile-header">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">

          <div className="relative shrink-0">
            <div className="absolute -inset-1 bg-slate-200 blur opacity-20 transition duration-1000"></div>
            <div className="relative w-48 h-64 lg:w-64 lg:h-80 bg-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
              <Image
                src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=1e293b&color=fff&size=400`}
                alt={profile.fullName}
                fill
                sizes="(max-width: 1024px) 192px, 256px"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
            {profile.isVerified !== false && (
              <div className="absolute top-4 right-4 bg-slate-900 text-white p-2 shadow-xl" title="Verified Professional">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 text-center lg:text-left flex flex-col justify-center min-h-[320px]">
            <div className="mb-10">
              <div className="inline-block px-4 py-1.5 mb-8 bg-slate-900 text-white text-[9px] font-black tracking-[0.3em] uppercase">
                Miembro Verificado
              </div>
              <div className="border-l-4 border-accent pl-8 inline-block lg:block">
                <h1 className="text-5xl lg:text-7xl font-black text-primary tracking-tighter mb-4 font-manrope uppercase leading-[0.9]">
                  {profile.fullName}
                </h1>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400 font-bold mt-4">
                  {profile.city}, {profile.country} &bull; Práctica Legal Autónoma
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-12 pt-10 border-t border-slate-100">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">Tarifa Profesional</p>
                <div className="text-3xl font-black text-primary font-manrope">
                  {profile.hourlyRate} 
                  <span className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-widest">{profile.currency} / HORA</span>
                </div>
              </div>
              
              <div className="w-px bg-slate-100 hidden sm:block"></div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">Prestigio</p>
                <div className="flex items-center justify-center lg:justify-start gap-3">
                    <div className="text-3xl font-black text-primary font-manrope">
                      {profile.reviewCount && profile.reviewCount > 0 ? profile.ratingAvg?.toFixed(1) : "NUEVO"}
                    </div>
                    {profile.reviewCount && profile.reviewCount > 0 && (
                      <div className="flex items-center gap-1 text-accent">
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 pt-1">
                          ({profile.reviewCount} Reseñas)
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Museum-style accent */}
      <div className="absolute bottom-0 right-0 w-1/3 h-[2px] bg-accent/30"></div>
    </header>
  );
};
