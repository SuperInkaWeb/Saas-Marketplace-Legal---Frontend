"use client";

import { useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { authApi } from "@/modules/auth/api";
import { profileService } from "@/modules/profile/services/profileService";
import { UpdateClientProfileRequest, UpdateLawyerProfileRequest } from "@/modules/profile/types";

export default function DebugProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const refreshUser = async () => {
    try {
      const data = await authApi.getMe();
      updateUser(data as any);
      setStatus("Información del usuario refrescada en el store");
    } catch (e: any) {
      console.error("Error refreshing user", e);
      setStatus("Error al refrescar usuario: " + e.message);
    }
  };

  const handleFileUpload = async (type: "avatar" | "client-logo", file: File) => {
    setLoading(true);
    setStatus(`Subiendo ${type}...`);
    try {
      let res;
      if (type === "avatar") res = await profileService.updateAvatar(file);
      else if (type === "client-logo") res = await profileService.updateClientLogo(file);
      
      setStatus(`Éxito al subir ${type}: ${JSON.stringify(res)}`);
      await refreshUser();
    } catch (error: any) {
      console.error("Error upload:", error.response?.data || error);
      setStatus(`Error al subir ${type}: ${JSON.stringify(error.response?.data) || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClientUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: UpdateClientProfileRequest = {
      firstName: formData.get("firstName") as string,
      lastNameFather: formData.get("lastNameFather") as string,
      lastNameMother: formData.get("lastNameMother") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      companyName: formData.get("companyName") as string,
      billingAddress: formData.get("billingAddress") as string,
    };

    setLoading(true);
    setStatus("Actualizando perfil de cliente...");
    try {
      await profileService.updateClientProfile(data);
      setStatus("Perfil de cliente actualizado con éxito");
      await refreshUser();
    } catch (error: any) {
      console.error("Error client update:", error.response?.data || error);
      setStatus(`Error al actualizar cliente: ${JSON.stringify(error.response?.data) || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLawyerUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: UpdateLawyerProfileRequest = {
      firstName: formData.get("firstName") as string,
      lastNameFather: formData.get("lastNameFather") as string,
      lastNameMother: formData.get("lastNameMother") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      bio: formData.get("bio") as string,
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      hourlyRate: Number(formData.get("hourlyRate")),
      currency: formData.get("currency") as string,
      barRegistrationNumber: formData.get("barRegistrationNumber") as string,
      barAssociation: formData.get("barAssociation") as string,
    };

    setLoading(true);
    setStatus("Actualizando perfil de abogado...");
    try {
      await profileService.updateLawyerProfile(data);
      setStatus("Perfil de abogado actualizado con éxito");
      await refreshUser();
    } catch (error: any) {
      console.error("Error lawyer update:", error.response?.data || error);
      setStatus(`Error al actualizar abogado: ${JSON.stringify(error.response?.data) || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8">Cargando usuario o no autenticado...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 bg-white text-black">
      <h1 className="text-2xl font-bold">Debug Profile Updates</h1>
      
      <div className="bg-blue-50 p-4 rounded border border-blue-200">
        <p className="font-mono text-sm">Status: {loading ? "⏳ " : "✅ "} {status || "Listo"}</p>
      </div>

      {/* Public Profile Link */}
      {user && user.role === 'LAWYER' && (
        <div className="p-6 bg-indigo-50 border border-indigo-200 rounded shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-indigo-900 font-bold uppercase tracking-wider text-sm">Perfil Público</h3>
            <p className="text-indigo-700 text-xs">Visualiza cómo ven los clientes tu perfil profesional.</p>
          </div>
          <a 
            href={`/lawyer/${user.slug}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition-all text-sm uppercase tracking-widest shadow-md hover:shadow-lg active:scale-95"
          >
            Ver Mi Perfil Público
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* IMAGE UPLOADS */}
        <div className="space-y-6">
          <section className="border p-4 rounded">
            <h2 className="font-bold mb-2">Imágenes</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm">Avatar (General)</label>
                {user.avatarUrl && <img src={user.avatarUrl} alt="Avatar" crossOrigin="anonymous" className="w-16 h-16 rounded-full mb-1" />}
                <input type="file" onChange={(e) => e.target.files && handleFileUpload("avatar", e.target.files[0])} />
              </div>

              {user.role === "CLIENT" && (
                <div>
                  <label className="block text-sm text-blue-600">Company Logo (Client Only)</label>
                  {user.companyLogoUrl && <img src={user.companyLogoUrl} alt="Logo" crossOrigin="anonymous" className="w-24 h-12 object-contain mb-1" />}
                  <input type="file" onChange={(e) => e.target.files && handleFileUpload("client-logo", e.target.files[0])} />
                </div>
              )}


            </div>
          </section>
        </div>

        {/* FORMS */}
        <div className="space-y-6">
          {user.role === "CLIENT" && (
            <section className="border p-4 rounded bg-blue-50">
              <h2 className="font-bold mb-4">Actualizar Cliente</h2>
              <form onSubmit={handleClientUpdate} className="space-y-2">
                <input name="firstName" placeholder="Nombre" className="w-full border p-1" defaultValue={user.firstName} required />
                <input name="lastNameFather" placeholder="Apellido Paterno" className="w-full border p-1" defaultValue={user.lastNameFather} required />
                <input name="lastNameMother" placeholder="Apellido Materno" className="w-full border p-1" defaultValue={user.lastNameMother} required />
                <input name="phoneNumber" placeholder="Teléfono" className="w-full border p-1" defaultValue={user.phoneNumber} required />
                <input name="companyName" placeholder="Empresa" className="w-full border p-1" defaultValue={user.companyName} />
                <textarea name="billingAddress" placeholder="Dirección de Facturación" className="w-full border p-1" defaultValue={user.billingAddress} />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 w-full disabled:opacity-50" disabled={loading}>Actualizar Cliente</button>
              </form>
            </section>
          )}

          {user.role === "LAWYER" && (
            <section className="border p-4 rounded bg-green-50">
              <h2 className="font-bold mb-4">Actualizar Abogado</h2>
              <form onSubmit={handleLawyerUpdate} className="space-y-2">
                <input name="firstName" placeholder="Nombre" className="w-full border p-1" defaultValue={user.firstName} required />
                <input name="lastNameFather" placeholder="Apellido Paterno" className="w-full border p-1" defaultValue={user.lastNameFather} required />
                <input name="lastNameMother" placeholder="Apellido Materno" className="w-full border p-1" defaultValue={user.lastNameMother} required />
                <input name="phoneNumber" placeholder="Teléfono" className="w-full border p-1" defaultValue={user.phoneNumber} required />
                <textarea name="bio" placeholder="Biografía" className="w-full border p-1" defaultValue={user.bio} />
                <input name="city" placeholder="Ciudad" className="w-full border p-1" defaultValue={user.city} required />
                <input name="country" placeholder="País" className="w-full border p-1" defaultValue={user.country} required />
                <input name="hourlyRate" type="number" step="0.01" placeholder="Tarifa por Hora" className="w-full border p-1" defaultValue={user.hourlyRate} required />
                <input name="currency" placeholder="Moneda (USD)" className="w-full border p-1" defaultValue={user.currency || "USD"} required />
                <input name="barRegistrationNumber" placeholder="N° Colegiatura" className="w-full border p-1" defaultValue={user.barRegistrationNumber} />
                <input name="barAssociation" placeholder="Asociación de Abogados" className="w-full border p-1" defaultValue={user.barAssociation} />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 w-full disabled:opacity-50" disabled={loading}>Actualizar Abogado</button>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
