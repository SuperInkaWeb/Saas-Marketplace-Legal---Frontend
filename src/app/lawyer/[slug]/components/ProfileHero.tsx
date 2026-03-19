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

            <div className="flex justify-center lg:justify-start pt-4 border-t border-slate-100">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-slate-900">{profile.hourlyRate} <span className="text-sm font-normal text-slate-500">{profile.currency}</span></div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Tarifa por Hora</div>
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
