"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Save, Loader2, MapPin, DollarSign, BookOpen } from "lucide-react";
import { lawyerConfigService } from "@/modules/profile/services/lawyerConfigService";
import { profileService } from "@/modules/profile/services/profileService";
import { UpdateLawyerProfileRequest } from "@/modules/profile/types";
import { useAuthStore } from "@/modules/auth/store";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import RichTextEditor from "./RichTextEditor";

const schema = z.object({
  firstName: z.string().min(2, "Nombre requerido"),
  lastNameFather: z.string().min(2, "Apellido requerido"),
  lastNameMother: z.string().min(2, "Apellido requerido"),
  phoneNumber: z.string().min(6, "Teléfono inválido"),
  bio: z.string().max(10000, "La biografía es muy larga").optional(), // Increased max length because HTML tags add length
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
    control,
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
    <div className="w-full">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-600" />
          Información General
        </h2>
        <p className="text-slate-500 text-sm mt-1.5 leading-relaxed max-w-2xl">
          Tus datos personales, biografía profesional e información de valor que verán tus clientes al visitar tu perfil público. Asegúrate de incluir palabras clave relevantes.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

        {/* Basic Personal Info */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Datos Personales</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Nombre(s)</label>
              <input
                {...register("firstName")}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${errors.firstName ? "border-red-300 ring-red-100" : "border-slate-200"}`}
              />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Apellido Paterno</label>
              <input
                {...register("lastNameFather")}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${errors.lastNameFather ? "border-red-300 ring-red-100" : "border-slate-200"}`}
              />
              {errors.lastNameFather && <p className="text-xs text-red-500">{errors.lastNameFather.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Apellido Materno</label>
              <input
                {...register("lastNameMother")}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${errors.lastNameMother ? "border-red-300 ring-red-100" : "border-slate-200"}`}
              />
              {errors.lastNameMother && <p className="text-xs text-red-500">{errors.lastNameMother.message}</p>}
            </div>
          </div>
        </section>

        {/* Contact & Location Info */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Contacto y Ubicación</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Teléfono</label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    defaultCountry="pe"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    inputClassName={`!w-full !h-[44px] !px-4 !rounded-r-xl !border-y !border-r !border-l-0 !bg-slate-50 !text-slate-900 !text-sm !transition-all !duration-200 focus:!bg-white focus:!ring-2 focus:!ring-emerald-500/50 ${
                      errors.phoneNumber ? "!border-red-400" : "!border-slate-200"
                    }`}
                    countrySelectorStyleProps={{
                      buttonClassName: `!h-[44px] !rounded-l-xl !border !bg-slate-50 !transition-all ${
                        errors.phoneNumber ? "!border-red-400" : "!border-slate-200 hover:!border-slate-300"
                      }`,
                    }}
                  />
                )}
              />
              {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Ciudad
              </label>
              <input
                {...register("city")}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${errors.city ? "border-red-300" : "border-slate-200"}`}
              />
              {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">País</label>
              <input
                {...register("country")}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${errors.country ? "border-red-300" : "border-slate-200"}`}
              />
              {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
            </div>
          </div>
        </section>

        {/* Bio (Rich Text Editor) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Biografía Profesional
            </h3>
          </div>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <div className={errors.bio ? "ring-2 ring-red-400/50 rounded-lg" : ""}>
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  className="shadow-sm border border-slate-200 rounded-lg"
                />
              </div>
            )}
          />
          {errors.bio && <p className="text-xs text-red-500 mt-2">{errors.bio.message}</p>}
        </section>

        {/* Rates & Bar Info */}
        <section className="bg-slate-50/50 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mt-8">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Honorarios y Colegiatura</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2 col-span-1">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Tarifa Base / hora
              </label>
              <input
                type="number"
                {...register("hourlyRate", { valueAsNumber: true })}
                className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all ${errors.hourlyRate ? "border-red-300" : "border-slate-200"}`}
              />
              {errors.hourlyRate && <p className="text-xs text-red-500">{errors.hourlyRate.message}</p>}
            </div>
            
            <div className="space-y-2 col-span-1">
              <label className="block text-sm font-medium text-slate-700">Moneda</label>
              <select
                {...register("currency")}
                className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all ${errors.currency ? "border-red-300" : "border-slate-200"}`}
              >
                <option value="USD">USD ($)</option>
                <option value="MXN">MXN ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="COP">COP ($)</option>
                <option value="PEN">SOL (S/.)</option>
              </select>
            </div>
            
            <div className="space-y-2 col-span-1">
              <label className="block text-sm font-medium text-slate-700">
                N° Colegiatura
              </label>
              <input
                {...register("barRegistrationNumber")}
                placeholder="Ej. CAL 12345"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2 col-span-1">
              <label className="block text-sm font-medium text-slate-700">
                Colegio de Abogados
              </label>
              <input
                {...register("barAssociation")}
                placeholder="Ej. Ilustre Colegio..."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm order-2 sm:order-1">
            {message && (
              <div className={`px-4 py-2 rounded-lg font-medium ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {message.text}
              </div>
            )}
            {Object.keys(errors).length > 0 && !message && (
              <span className="text-red-500 bg-red-50 border border-red-200 px-4 py-2 rounded-lg inline-block">
                Por favor corrige los errores resaltados en el formulario.
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-md shadow-slate-900/10 hover:shadow-lg disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
