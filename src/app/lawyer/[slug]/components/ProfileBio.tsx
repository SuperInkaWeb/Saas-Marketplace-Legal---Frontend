import React from 'react';

interface ProfileBioProps {
  bio: string;
}

export const ProfileBio: React.FC<ProfileBioProps> = ({ bio }) => {
  if (!bio) return null;

  return (
    <article data-purpose="biography">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
        Perfil Profesional
        <span className="h-px flex-1 bg-slate-100"></span>
      </h2>
      <div className="text-lg text-slate-600 font-light leading-relaxed space-y-6 whitespace-pre-line">
        <p>{bio}</p>
      </div>
    </article>
  );
};
