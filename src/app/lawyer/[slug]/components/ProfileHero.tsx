import React from 'react';
import { PublicProfile } from '../types';
import Image from "next/image";

interface ProfileHeroProps {
  profile: PublicProfile;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ profile }) => {
  return (
    <header className="hero-border pt-16 pb-20 relative overflow-hidden" data-purpose="profile-header">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
            <Image
              src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=1e293b&color=fff&size=200`}
              alt={profile.fullName}
              width={224}
              height={224}
              className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-full border-4 border-white object-cover shadow-xl"
              priority
            />
            {profile.isVerified !== false && (
              <div className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full border-4 border-white shadow-lg" title="Verified Professional">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6">
              <div className="inline-block px-3 py-1 mb-4 rounded bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold tracking-[0.2em] uppercase">
                Práctica Independiente
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-4">{profile.fullName}</h1>
              <p className="text-xl text-slate-500 font-light flex items-center justify-center lg:justify-start gap-3 flex-wrap">
                <span className="text-blue-600 font-medium">Práctica Legal Autónoma</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                <span>{profile.city}, {profile.country}</span>
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-6 mt-4 border-t border-slate-100">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-slate-900">{profile.hourlyRate} <span className="text-sm font-normal text-slate-500">{profile.currency}</span></div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">Tarifa por Hora</div>
              </div>
              
              <div className="w-px bg-slate-100 hidden sm:block"></div>

              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1">
                  <div className="text-2xl font-bold text-slate-900">
                    {profile.reviewCount && profile.reviewCount > 0 ? profile.ratingAvg?.toFixed(1) : "Nuevo"}
                  </div>
                  {profile.reviewCount && profile.reviewCount > 0 ? (
                    <svg className="w-5 h-5 text-amber-500 fill-amber-500 pb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ) : (
                    <span className="text-sm text-slate-400 ml-1"></span>
                  )}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">
                  {profile.reviewCount && profile.reviewCount > 0 ? `Basado en ${profile.reviewCount} reseñas` : "Sin reseñas aún"}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative subtle line */}
      <div className="absolute bottom-0 left-0 w-32 h-1 bg-blue-600 ml-[10%]"></div>
    </header>
  );
};
