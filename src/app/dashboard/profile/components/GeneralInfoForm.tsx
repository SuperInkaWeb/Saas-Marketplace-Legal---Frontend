"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Save, Loader2, MapPin, DollarSign, BookOpen } from "lucide-react";
import { lawyerConfigService } from "@/modules/profile/services/lawyerConfigService";
import { profileService } from "@/modules/profile/services/profileService";
import { UpdateLawyerProfileRequest } from "@/modules/profile/types";
import { useAuthStore } from "@/modules/auth/store";

const schema = z.object({
  firstName: z.string().min(2, "Nombre requerido"),
  lastNameFather: z.string().min(2, "Apellido requerido"),
  lastNameMother: z.string().min(2, "Apellido requerido"),
  phoneNumber: z.string().min(6, "Teléfono inválido"),
  bio: z.string().max(1500, "La biografía es muy larga").optional(),
  city: z.string().min(2, "Ciudad requerida"),
  country: z.string().min(2, "País requerido"),
  hourlyRate: z.number().min(1, "Tarifa mínima es 1"),
  currency: z.string().min(2, "Ej: USD, MXN"),
  barRegistrationNumber: z.string().optional(),
  barAssociation: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function GeneralInfoForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const updateUser = useAuthStore((s) => s.updateUser);
  const user = useAuthStore((s) => s.user);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await lawyerConfigService.getMyConfig();
        setValue("firstName", config.firstName);
        setValue("lastNameFather", config.lastNameFather);
        setValue("lastNameMother", config.lastNameMother);
        setValue("phoneNumber", config.phoneNumber);
        setValue("bio", config.bio || "");
        setValue("city", config.city || "");
        setValue("country", config.country || "");
        setValue("hourlyRate", config.hourlyRate || 0);
        setValue("currency", config.currency || "USD");
        setValue("barRegistrationNumber", config.barRegistrationNumber || "");
        setValue("barAssociation", config.barAssociation || "");
      } catch (error) {
        console.error("Error cargando perfil general:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    setMessage(null);
    try {
      const payload: UpdateLawyerProfileRequest = {
        ...data,
      };
      await profileService.updateLawyerProfile(payload);
      setMessage({ type: "success", text: "Información actualizada correctamente." });
      
      // Update global store
      if (user) {
        updateUser({
          firstName: data.firstName,
          lastNameFather: data.lastNameFather,
          lastNameMother: data.lastNameMother,
          phoneNumber: data.phoneNumber,
          bio: data.bio,
          city: data.city,
          country: data.country,
          hourlyRate: data.hourlyRate,
          currency: data.currency,
          barRegistrationNumber: data.barRegistrationNumber,
          barAssociation: data.barAssociation,
        });
      }

    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Error al actualizar la información." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 text-emerald-600">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600" />
          Información General
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Tus datos personales, biografía profesional y detalles de honorarios.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Nombre</label>
            <input
              {...register("firstName")}
              className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${errors.firstName ? "border-red-300" : "border-slate-200"}`}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Apellido Paterno</label>
            <input
              {...register("lastNameFather")}
              className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${errors.lastNameFather ? "border-red-300" : "border-slate-200"}`}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Apellido Materno</label>
            <input
              {...register("lastNameMother")}
              className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${errors.lastNameMother ? "border-red-300" : "border-slate-200"}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bio & Contact */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Biografía Profesional
              </label>
              <textarea
                {...register("bio")}
                rows={5}
                placeholder="Cuenta tu experiencia y tu enfoque principal..."
                className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none ${errors.bio ? "border-red-300" : "border-slate-200"}`}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Teléfono</label>
              <input
                {...register("phoneNumber")}
                className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${errors.phoneNumber ? "border-red-300" : "border-slate-200"}`}
              />
            </div>
          </div>

          {/* Rates, Location & Bar Info */}
          <div className="space-y-6 bg-slate-50/50 p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Ciudad
                </label>
                <input
                  {...register("city")}
                  className={`w-full px-3 py-2 bg-white border rounded-md focus:ring-2 focus:ring-emerald-500/50 outline-none ${errors.city ? "border-red-300" : "border-slate-200"}`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">País</label>
                <input
                  {...register("country")}
                  className={`w-full px-3 py-2 bg-white border rounded-md focus:ring-2 focus:ring-emerald-500/50 outline-none ${errors.country ? "border-red-300" : "border-slate-200"}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Tarifa Base /hr
                </label>
                <input
                  type="number"
                  {...register("hourlyRate", { valueAsNumber: true })}
                  className={`w-full px-3 py-2 bg-white border rounded-md focus:ring-2 focus:ring-emerald-500/50 outline-none ${errors.hourlyRate ? "border-red-300" : "border-slate-200"}`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Moneda</label>
                <select
                  {...register("currency")}
                  className={`w-full px-3 py-2 bg-white border rounded-md focus:ring-2 focus:ring-emerald-500/50 outline-none ${errors.currency ? "border-red-300" : "border-slate-200"}`}
                >
                  <option value="USD">USD ($)</option>
                  <option value="MXN">MXN ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="COP">COP ($)</option>
                  <option value="PEN">SOL (S/.)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200/60">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Colegiatura Num.
                </label>
                <input
                  {...register("barRegistrationNumber")}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Colegio de Abogados
                </label>
                <input
                  {...register("barAssociation")}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm order-2 sm:order-1">
            {message && (
              <span className={message.type === "success" ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                {message.text}
              </span>
            )}
            {Object.keys(errors).length > 0 && !message && (
              <span className="text-red-600">Por favor corrige los errores del formulario.</span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
