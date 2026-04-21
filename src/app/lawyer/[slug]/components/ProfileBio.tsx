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
      {/* 
        Using dangerouslySetInnerHTML because the bio comes from a rich text editor (Quill).
        Added target-nested classes so Tailwind can style basic HTML elements (lists, bold).
      */}
      <div 
        className="text-lg text-slate-600 font-light leading-relaxed [&>p]:mb-4 [&_strong]:font-semibold [&_strong]:text-slate-800 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-1 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-primary [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mb-3 [&_u]:underline break-words"
        dangerouslySetInnerHTML={{ __html: bio }}
      />
    </article>
  );
};
