'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Inter } from 'next/font/google';

// Layout Components
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

// Module Components
import { ProfileHero } from './components/ProfileHero';
import { ProfileBio } from './components/ProfileBio';
import { ProfileSpecialties } from './components/ProfileSpecialties';
import { ProfileDetails } from './components/ProfileDetails';
import { ProfileSidebar } from './components/ProfileSidebar';

// Hooks & Types
import { usePublicProfile } from './hooks/usePublicProfile';

const inter = Inter({ subsets: ['latin'] });

export default function LawyerPublicProfile() {
  const { slug } = useParams();
  const { profile, loading, error } = usePublicProfile(slug);

  // States: Loading & Error (Rendered within site layout)
  if (loading || error || !profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          {loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          ) : (
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
              <p className="text-slate-600">{error || 'El abogado no existe'}</p>
            </div>
          )}
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={`${inter.className} min-h-screen bg-sophisticated antialiased pt-16`}>
        <style jsx global>{`
          .bg-sophisticated {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.97) 0%, rgba(248, 250, 252, 0.95) 100%), 
                        url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
          }
          .glass-panel {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(0, 0, 0, 0.05);
          }
        `}</style>

        <ProfileHero profile={profile} />

        <main className="max-w-7xl mx-auto py-20 px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-20">
              <ProfileBio bio={profile.bio} />
              
              <ProfileSpecialties specialties={profile.specialties} />

              <ProfileDetails 
                lawFirmName={profile.lawFirmName}
                barAssociation={profile.barAssociation}
                barRegistrationNumber={profile.barRegistrationNumber}
              />
            </div>

            {/* Sidebar */}
            <ProfileSidebar schedules={profile.schedules} />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
