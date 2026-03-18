import React from 'react';
import { PublicProfile } from '../types';

interface ProfileHeroProps {
  profile: PublicProfile;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ profile }) => {
  return (
    <header className="relative h-[400px] overflow-hidden">
      {profile.lawFirmCoverUrl ? (
        <img 
          src={profile.lawFirmCoverUrl} 
          alt="Law Firm Cover"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-slate-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-10 max-w-7xl mx-auto flex items-end gap-8">
        <div className="w-40 h-40 rounded-sm border-4 border-white shadow-2xl overflow-hidden bg-white">
          <img 
            src={profile.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.fullName)} 
            alt={profile.fullName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mb-4 text-white">
          <h1 className="text-5xl font-bold mb-2">{profile.fullName}</h1>
          <p className="text-xl font-light opacity-90">{profile.lawFirmName || 'Abogado Independiente'}</p>
          <div className="flex items-center gap-4 mt-4 text-sm font-medium">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
              {profile.city}, {profile.country}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              ${profile.hourlyRate} {profile.currency}/hr
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
