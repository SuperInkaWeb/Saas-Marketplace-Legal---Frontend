"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { kycDocumentSchema, type KycDocumentFormData } from "@/modules/auth/schemas";
import { useUploadKyc, useMe, extractApiError } from "@/modules/auth/hooks";
import { useState, useEffect } from "react";
import { FormAlert } from "../../(auth)/components/FormAlert";
import RightHero from "../../(auth)/components/RighHero";
import { useRouter } from "next/navigation";
import { ShieldCheck, CreditCard, Hash, Flag, ShieldAlert } from "lucide-react";
import AuthHeader from "../../(auth)/components/AuthHeader";
import { COUNTRIES } from "@/modules/auth/constants";

export default function OnboardingKycPage() {
  const [error, setError] = useState<string | null>(null);
  const { data: user } = useMe();
  const { mutate: uploadKyc, isPending } = useUploadKyc();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<KycDocumentFormData>({
    resolver: zodResolver(kycDocumentSchema),
  });

  // Autocomplete country code based on user profile
  useEffect(() => {
    if (user?.country) {
      const countryData = COUNTRIES.find(
        (c) => c.name.toLowerCase() === user.country?.toLowerCase()
      );
      if (countryData?.code) {
        setValue("documentCountryCode", countryData.code);
      }
    }
  }, [user, setValue]);

  const onSubmit = (data: KycDocumentFormData) => {
    setError(null);
    uploadKyc(data, {
      onSuccess: () => router.push("/dashboard"),
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
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Verificación de Identidad
            </h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Como abogado, necesitamos validar tu identidad para mantener la seguridad y confianza en el marketplace.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6">
              <FormAlert message={error} type="error" />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                Tipo de Documento
              </label>
              <select
                {...register("documentType")}
                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100 ${
                  errors.documentType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Selecciona...</option>
                <option value="ID_CARD">Cédula de Identidad / DNI</option>
                <option value="PASSPORT">Pasaporte</option>
                <option value="DRIVER_LICENSE">Licencia de Conducir</option>
              </select>
              {errors.documentType && (
                <p className="text-xs text-red-600 mt-1">{errors.documentType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                Número de Documento
              </label>
              <input
                {...register("documentNumber")}
                placeholder="Ej: 12.345.678-9"
                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100 ${
                  errors.documentNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.documentNumber && (
                <p className="text-xs text-red-600 mt-1">{errors.documentNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <Flag className="w-4 h-4 text-gray-400" />
                País de Emisión (Código)
              </label>
              <input
                {...register("documentCountryCode")}
                placeholder="Ej: CL, ES, MX"
                maxLength={2}
                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100 uppercase ${
                  errors.documentCountryCode ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.documentCountryCode && (
                <p className="text-xs text-red-600 mt-1">{errors.documentCountryCode.message}</p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 mb-2">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Tu información será tratada de forma confidencial y solo se usará para fines de verificación profesional.
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all duration-200 disabled:opacity-50"
            >
              {isPending ? "Subiendo datos..." : "Finalizar verificación"}
            </button>
          </form>

          <p className="mt-8 text-xs text-gray-400 text-center uppercase tracking-widest font-semibold">
            Paso 3 de 3
          </p>
        </div>
      </div>

      {/* Lado Derecho */}
      <RightHero />
    </div>
  );
}
