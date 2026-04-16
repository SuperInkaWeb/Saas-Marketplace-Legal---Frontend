"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientProfileSchema, lawyerProfileSchema, type ClientProfileFormData, type LawyerProfileFormData } from "@/modules/auth/schemas";
import { useCreateClientProfile, useCreateLawyerProfile, useMe, extractApiError } from "@/modules/auth/hooks";
import { COUNTRIES } from "@/modules/auth/constants";
import { useState, useEffect } from "react";
import { FormAlert } from "../../(auth)/components/FormAlert";
import RightHero from "../../(auth)/components/RighHero";
import { Building2, MapPin, Globe, Loader2 } from "lucide-react";
import AuthHeader from "../../(auth)/components/AuthHeader";

export default function OnboardingProfilePage() {
  const { data: user, isLoading: isLoadingUser } = useMe();
  const [error, setError] = useState<string | null>(null);

  const { mutate: createClient, isPending: isSavingClient } = useCreateClientProfile();
  const { mutate: createLawyer, isPending: isSavingLawyer } = useCreateLawyerProfile();

  // Client Form
  const clientForm = useForm<ClientProfileFormData>({
    resolver: zodResolver(clientProfileSchema),
  });

  // Lawyer Form
  const lawyerForm = useForm<LawyerProfileFormData>({
    resolver: zodResolver(lawyerProfileSchema),
    defaultValues: {
      city: "",
      country: ""
    }
  });

  const selectedCountryName = lawyerForm.watch("country");
  const availableCities = COUNTRIES.find(c => c.name === selectedCountryName)?.cities || [];

  // Reset city when country changes
  useEffect(() => {
    lawyerForm.setValue("city", "");
  }, [selectedCountryName, lawyerForm]);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  const role = user?.role?.toUpperCase().replace("ROLE_", "");

  const onClientSubmit = (data: ClientProfileFormData) => {
    setError(null);
    // Convert empty strings to undefined so the API treats them as optional
    const cleanData = {
      companyName: data.companyName === "" ? undefined : data.companyName,
      billingAddress: data.billingAddress === "" ? undefined : data.billingAddress,
    };
    createClient(cleanData, {
      onError: (err) => setError(extractApiError(err).message),
    });
  };

  const onLawyerSubmit = (data: LawyerProfileFormData) => {
    setError(null);
    createLawyer(data, {
      onError: (err) => setError(extractApiError(err).message),
    });
  };

  return (
    <div className="min-h-screen flex bg-white font-['Inter',sans-serif]">
      {/* Lado Izquierdo */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col px-8 sm:px-16 lg:px-24 py-20 bg-white z-10 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          {/* Header / Logo de regreso */}
          <AuthHeader />
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Completa tu perfil
            </h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Necesitamos unos detalles finales para preparar tu espacio de trabajo.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6">
              <FormAlert message={error} type="error" />
            </div>
          )}

          {role === "CLIENT" ? (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-2">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "Si eres una persona particular, puedes dejar estos campos en blanco. Estos datos solo son necesarios si representas a una empresa o requieres facturación formal."
                </p>
              </div>

              <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    Nombre de Empresa <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    {...clientForm.register("companyName")}
                    placeholder="Ej: LegalTech Solutions"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Dirección de Facturación <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <textarea
                    {...clientForm.register("billingAddress")}
                    placeholder="Calle, Ciudad, Estado, Código Postal"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingClient}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all duration-200 disabled:opacity-50"
                >
                  {isSavingClient ? "Guardando..." : "Completar perfil"}
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={lawyerForm.handleSubmit(onLawyerSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  País
                </label>
                <select
                  {...lawyerForm.register("country")}
                  className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100 appearance-none ${
                    lawyerForm.formState.errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecciona un país</option>
                  {COUNTRIES.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                {lawyerForm.formState.errors.country && (
                  <p className="text-xs text-red-600 mt-1">{lawyerForm.formState.errors.country.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Ciudad
                </label>
                <select
                  {...lawyerForm.register("city")}
                  disabled={!selectedCountryName}
                  className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100 appearance-none ${
                    lawyerForm.formState.errors.city ? "border-red-500" : "border-gray-300"
                  } ${!selectedCountryName ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="">
                    {!selectedCountryName ? "Primero selecciona un país" : "Selecciona una ciudad"}
                  </option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {lawyerForm.formState.errors.city && (
                  <p className="text-xs text-red-600 mt-1">{lawyerForm.formState.errors.city.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSavingLawyer}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all duration-200 disabled:opacity-50"
              >
                {isSavingLawyer ? "Guardando..." : "Siguiente paso"}
              </button>
            </form>
          )}

          <p className="mt-8 text-xs text-gray-400 text-center uppercase tracking-widest font-semibold">
            Paso 2 de 3
          </p>
        </div>
      </div>

      {/* Lado Derecho */}
      <RightHero />
    </div>
  );
}
