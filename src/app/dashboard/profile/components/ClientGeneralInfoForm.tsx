"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Camera } from "lucide-react";
import { profileService } from "@/modules/profile/services/profileService";
import { UpdateClientProfileRequest } from "@/modules/profile/types";
import { useAuthStore } from "@/modules/auth/store";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useUpdateAvatar } from "@/modules/profile/hooks";

import ImageCropperModal from "@/components/common/ImageCropperModal";
import { motion, AnimatePresence } from "framer-motion";

const schema = z.object({
  firstName: z.string().min(2, "Nombre requerido"),
  lastNameFather: z.string().min(2, "Apellido requerido"),
  lastNameMother: z.string().min(2, "Apellido requerido"),
  phoneNumber: z.string().min(6, "Teléfono inválido"),
  companyName: z.string().optional(),
  billingAddress: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }
};

export default function ClientGeneralInfoForm() {
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
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const currentPhone = watch("phoneNumber");

  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName || "");
      setValue("lastNameFather", user.lastNameFather || "");
      setValue("lastNameMother", user.lastNameMother || "");
      setValue("phoneNumber", user.phoneNumber || "");
      // For clients, we try to access companyName if available in user object
      setValue("companyName", (user as any).companyName || "");
      setValue("billingAddress", (user as any).billingAddress || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    setMessage(null);
    try {
      const payload: UpdateClientProfileRequest = {
        ...data,
      };
      await profileService.updateClientProfile(payload);
      setMessage({ type: "success", text: "Información actualizada correctamente." });

      // Update global store
      if (user) {
        updateUser({
          firstName: data.firstName,
          lastNameFather: data.lastNameFather,
          lastNameMother: data.lastNameMother,
          phoneNumber: data.phoneNumber,
          // Since our types might lack companyName, we cast to any or just pass it to updateUser
          ...({ companyName: data.companyName, billingAddress: data.billingAddress } as any)
        });
      }

    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Error al actualizar la información." });
    } finally {
      setIsSaving(false);
    }
  };

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
            className="w-2 h-2 bg-emerald-500 shrink-0"
          ></motion.span>
          Detalles de la Cuenta
        </h2>
        <p className="text-slate-400 text-[11px] font-medium uppercase tracking-widest mt-4 leading-relaxed max-w-xl">
          Actualiza tu información personal y los datos que los abogados verán al interactuar contigo.
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

        {/* Avatar Upload - Client Style */}
        <motion.div variants={sectionVariants} className="flex flex-col md:flex-row items-center gap-10 bg-slate-50 p-10 border border-slate-100 shadow-sm rounded-2xl">
          <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
            <motion.div 
              whileHover={{ y: -5 }}
              className="w-32 h-32 rounded-full bg-slate-200 overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-4 border-white"
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
                <span className="text-[9px] text-white font-black uppercase tracking-[0.2em]">Cambiar</span>
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
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-3">Foto de Perfil</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
              Sube una fotografía reciente. Una imagen amigable genera más confianza al contactar expertos legales.
            </p>
          </div>
        </motion.div>

        {/* Basic Personal Info */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-2 border-emerald-500 pl-4">Información Personal</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Nombre", key: "firstName" },
              { label: "Apellido Paterno", key: "lastNameFather" },
              { label: "Apellido Materno", key: "lastNameMother" }
            ].map((field) => (
              <div key={field.key} className="space-y-3">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{field.label}</label>
                <motion.input
                  whileFocus={{ scale: 1.01, borderColor: "#10b981" }}
                  {...register(field.key as any)}
                  className={`w-full px-5 py-3.5 bg-white border font-bold text-slate-900 text-sm rounded-xl focus:outline-none transition-all ${errors[field.key as keyof FormData] ? "border-red-300" : "border-slate-200 shadow-sm"}`}
                />
                {errors[field.key as keyof FormData] && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{errors[field.key as keyof FormData]?.message}</p>}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Contact Info */}
        <motion.section variants={sectionVariants}>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-2 border-emerald-500 pl-4">Contacto</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Número de Teléfono</label>
              <PhoneInput
                  defaultCountry="pe"
                  value={currentPhone}
                  onChange={(val) => setValue("phoneNumber", val)}
                  className="w-full"
                  inputClassName={`!w-full !h-[50px] !px-5 !rounded-lg !rounded-l-none !border-y !border-r !border-l-0 !bg-white !text-slate-900 !text-sm !font-bold !transition-all focus:!ring-1 focus:!ring-emerald-500 ${
                    errors.phoneNumber ? "!border-red-300" : "!border-slate-200 !shadow-sm"
                  }`}
                  countrySelectorStyleProps={{
                    buttonClassName: `!h-[50px] !rounded-l-lg !rounded-r-none !border !bg-slate-50 !transition-all ${
                      errors.phoneNumber ? "!border-red-300" : "!border-slate-200"
                    }`,
                  }}
              />
              {errors.phoneNumber && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.phoneNumber.message}</p>}
            </div>
          </div>
        </motion.section>

        {/* Company Info (Optional) */}
        <motion.section variants={sectionVariants} className="bg-slate-50 p-10 border border-slate-100 shadow-sm mt-12 rounded-2xl">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Datos de Empresa (Opcional)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Nombre de la Empresa</label>
              <input
                {...register("companyName")}
                placeholder="Razón social o comercial"
                className="w-full px-5 py-3.5 bg-white border border-slate-200 font-bold text-slate-900 text-sm rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Dirección de Facturación</label>
              <input
                {...register("billingAddress")}
                placeholder="Dirección fiscal"
                className="w-full px-5 py-3.5 bg-white border border-slate-200 font-bold text-slate-900 text-sm rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
        </motion.section>

        {/* Actions - Client Style */}
        <motion.div variants={sectionVariants} className="pt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <AnimatePresence>
              {message && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] border-l-4 rounded-r-lg ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-500" : "bg-red-50 text-red-700 border-red-500"}`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#047857" }} // emerald-700
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto bg-emerald-600 text-white px-12 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Guardar Cambios"}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}
