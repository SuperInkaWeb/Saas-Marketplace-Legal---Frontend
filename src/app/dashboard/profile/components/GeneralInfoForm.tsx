"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Camera } from "lucide-react";
import { lawyerConfigService } from "@/modules/profile/services/lawyerConfigService";
import { profileService } from "@/modules/profile/services/profileService";
import { UpdateLawyerProfileRequest } from "@/modules/profile/types";
import { useAuthStore } from "@/modules/auth/store";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useUpdateAvatar } from "@/modules/profile/hooks";

import RichTextEditor from "./RichTextEditor";
import ImageCropperModal from "@/components/common/ImageCropperModal";

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

import { motion, AnimatePresence } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }
};

export default function GeneralInfoForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const updateUser = useAuthStore((s) => s.updateUser);
  const user = useAuthStore((s) => s.user);

  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useUpdateAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    updateAvatar(croppedFile);
    setImageToCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropCancel = () => {
    setImageToCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
      <div className="flex justify-center items-center h-48 text-slate-900">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
      className="w-full"
    >
      <motion.div variants={sectionVariants} className="mb-12">
        <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
          <motion.span 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-amber-500 shrink-0"
          ></motion.span>
          Información Operativa
        </h2>
        <p className="text-slate-400 text-[11px] font-medium uppercase tracking-widest mt-4 leading-relaxed max-w-xl">
          Especifique sus credenciales y biografía técnica. Esta información será procesada y expuesta en su galería pública.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">

        {/* Image Cropper Modal */}
        {imageToCrop && (
          <ImageCropperModal
            image={imageToCrop}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        )}

        {/* Avatar Upload - Architectural Style */}
        <motion.div variants={sectionVariants} className="flex flex-col md:flex-row items-center gap-10 bg-slate-50 p-10 border border-slate-100 shadow-sm">
          <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
            <motion.div 
              whileHover={{ y: -5 }}
              className="w-32 h-40 bg-slate-200 overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" crossOrigin="anonymous" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl">person</span>
                </div>
              )}
              {isUpdatingAvatar && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
                </div>
              )}
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white mb-2" />
                <span className="text-[9px] text-white font-black uppercase tracking-[0.2em]">Sustituir</span>
              </div>
            </motion.div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-3">Identidad Visual</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
              Sube una fotografía técnica con iluminación neutra. El formato arquitectónico resaltará su profesionalismo en el marketplace.
            </p>
          </div>
        </motion.div>

        {/* Basic Personal Info */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-2 border-amber-500 pl-4">Identificación Legal</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Nombre de Pila", key: "firstName" },
              { label: "Apellido Paterno", key: "lastNameFather" },
              { label: "Apellido Materno", key: "lastNameMother" }
            ].map((field) => (
              <div key={field.key} className="space-y-3">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{field.label}</label>
                <motion.input
                  whileFocus={{ scale: 1.01, borderColor: "#f59e0b" }}
                  {...register(field.key as any)}
                  className={`w-full px-5 py-3.5 bg-white border font-bold text-slate-900 text-sm focus:outline-none transition-all ${errors[field.key as keyof FormData] ? "border-red-300" : "border-slate-100 shadow-sm"}`}
                />
                {errors[field.key as keyof FormData] && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{errors[field.key as keyof FormData]?.message}</p>}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Contact & Location Info */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-2 border-amber-500 pl-4">Logística y Ubicación</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Contacto Directo</label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    defaultCountry="pe"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    inputClassName={`!w-full !h-[50px] !px-5 !rounded-none !border-y !border-r !border-l-0 !bg-white !text-slate-900 !text-sm !font-bold !transition-all focus:!ring-1 focus:!ring-amber-500 ${
                      errors.phoneNumber ? "!border-red-300" : "!border-slate-100 !shadow-sm"
                    }`}
                    countrySelectorStyleProps={{
                      buttonClassName: `!h-[50px] !rounded-none !border !bg-slate-50 !transition-all ${
                        errors.phoneNumber ? "!border-red-300" : "!border-slate-100"
                      }`,
                    }}
                  />
                )}
              />
              {errors.phoneNumber && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.phoneNumber.message}</p>}
            </div>
            
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Ciudad</label>
              <motion.input
                whileFocus={{ scale: 1.01, borderColor: "#f59e0b" }}
                {...register("city")}
                className={`w-full px-5 py-3.5 bg-white border font-bold text-slate-900 text-sm focus:outline-none transition-all ${errors.city ? "border-red-300" : "border-slate-100 shadow-sm"}`}
              />
              {errors.city && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.city.message}</p>}
            </div>
            
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">País de Operación</label>
              <motion.input
                whileFocus={{ scale: 1.01, borderColor: "#f59e0b" }}
                {...register("country")}
                className={`w-full px-5 py-3.5 bg-white border font-bold text-slate-900 text-sm focus:outline-none transition-all ${errors.country ? "border-red-300" : "border-slate-100 shadow-sm"}`}
              />
              {errors.country && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.country.message}</p>}
            </div>
          </div>
        </motion.section>

        {/* Bio (Rich Text Editor) */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-2 border-amber-500 pl-4">Manifiesto Profesional</h3>
          </div>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <motion.div 
                whileFocus={{ boxShadow: "0 0 0 1px #f59e0b" }}
                className={`overflow-hidden border transition-all ${errors.bio ? "border-red-300 ring-1 ring-red-100" : "border-slate-100 shadow-sm"}`}
              >
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  className="bg-white"
                />
              </motion.div>
            )}
          />
          {errors.bio && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-4">{errors.bio.message}</p>}
        </motion.section>

        {/* Rates & Bar Info */}
        <motion.section variants={sectionVariants} className="bg-slate-50 p-10 border border-slate-100 shadow-sm mt-12">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Honorarios y Acreditación</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-3 col-span-1">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Costo por Hora</label>
              <input
                type="number"
                {...register("hourlyRate", { valueAsNumber: true })}
                className={`w-full px-5 py-3.5 bg-white border font-black text-slate-900 text-sm focus:ring-1 focus:ring-amber-500 outline-none transition-all ${errors.hourlyRate ? "border-red-300" : "border-slate-200"}`}
              />
            </div>
            
            <div className="space-y-3 col-span-1">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Divisa</label>
              <select
                {...register("currency")}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 font-bold text-slate-900 text-sm focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              >
                <option value="USD">USD ($)</option>
                <option value="MXN">MXN ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="COP">COP ($)</option>
                <option value="PEN">SOL (S/.)</option>
              </select>
            </div>
            
            <div className="space-y-3 col-span-1">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">N° Colegiatura</label>
              <input
                {...register("barRegistrationNumber")}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 font-bold text-slate-900 text-sm focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-3 col-span-1">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Colegio</label>
              <input
                {...register("barAssociation")}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 font-bold text-slate-900 text-sm focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
          </div>
        </motion.section>

        {/* Actions - Architectural Block */}
        <motion.div variants={sectionVariants} className="pt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <AnimatePresence>
              {message && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] border-l-4 ${message.type === "success" ? "bg-slate-900 text-white border-amber-500" : "bg-red-50 text-red-700 border-red-500"}`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#000" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto bg-slate-900 text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Ejecutar Cambios"}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}
