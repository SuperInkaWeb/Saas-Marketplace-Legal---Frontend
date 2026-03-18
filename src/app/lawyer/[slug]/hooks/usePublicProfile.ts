import { useState, useEffect } from 'react';
import axios from 'axios';
import { PublicProfile } from '../types';

export function usePublicProfile(slug: string | string[] | undefined) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${baseUrl}/profile/public/${slug}`);
        setProfile(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Perfil no encontrado');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug]);

  return { profile, loading, error };
}
