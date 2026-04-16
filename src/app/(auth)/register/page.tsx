"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/modules/auth/schemas";
import { useRegister, extractApiError } from "@/modules/auth/hooks";
import Link from "next/link";
import { useState } from "react";
import { FormAlert } from "../components/FormAlert";
import RightHero from "../components/RighHero";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import AuthInput from "../components/AuthInput";
import AuthHeader from "../components/AuthHeader";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const { mutate: register, isPending } = useRegister();

  const {
    control,
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setError(null);
    register(data, {
      onError: (err) => {
        const { message } = extractApiError(err);
        setError(message);
      },
    });
  };

  const apiError = error
    ? {
      message: error,
      help: "Si ya tienes una cuenta, intenta iniciar sesión.",
    }
    : null;

  return (
    <div className="min-h-screen flex bg-white font-['Inter',sans-serif]">
      {/* Lado Izquierdo */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col px-8 sm:px-16 lg:px-24 py-12 sm:py-20 bg-white z-10 overflow-y-auto">
        <div className="w-full max-sm:px-0 max-w-sm mx-auto">
          {/* Header / Logo de regreso */}
          <AuthHeader />
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Crear cuenta
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-semibold text-slate-700 hover:text-black decoration-slate-300 underline-offset-4 hover:underline transition-all"
              >
                Inicia sesión
              </Link>
            </p>
          </div>

          {/* Error */}
          {apiError && (
            <div className="mb-6">
              <FormAlert
                message={apiError.message}
                help={apiError.help}
                type="error"
              />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AuthInput
              label="Nombre"
              {...registerField("firstName")}
              placeholder="Gabriel"
              error={errors.firstName}
            />

            {/* Apellidos */}
            <div className="grid grid-cols-2 gap-4">
              <AuthInput
                label="Ap. paterno"
                {...registerField("lastNameFather")}
                placeholder="García"
                error={errors.lastNameFather}
              />

              <AuthInput
                label="Ap. materno"
                {...registerField("lastNameMother")}
                placeholder="López"
                error={errors.lastNameMother}
              />
            </div>

            <AuthInput
              label="Correo electrónico"
              {...registerField("email")}
              type="email"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              error={errors.email}
            />

            <AuthInput
              label="Contraseña"
              {...registerField("password")}
              type="password"
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              error={errors.password}
            />

            {/* Teléfono Profesional */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center justify-between tracking-tight">
                Teléfono móvil
                <span className="text-[10px] text-slate-400 font-black tracking-tighter">Obligatorio</span>
              </label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    defaultCountry="pe"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    inputClassName={`!w-full !h-[48px] !px-4 !rounded-xl !border !bg-gray-50/50 !text-gray-900 !text-sm !transition-all !duration-200 focus:!bg-white !shadow-sm focus:!ring-4 focus:!ring-slate-50 ${errors.phoneNumber
                        ? "!border-red-500 focus:!ring-red-100"
                        : "!border-gray-200 focus:!border-slate-800"
                      }`}
                    countrySelectorStyleProps={{
                      buttonClassName: `!h-[48px] !rounded-xl !border !bg-gray-50/50 !mr-2 !transition-all ${errors.phoneNumber ? "!border-red-500" : "!border-gray-200 hover:!border-slate-300"
                        }`,
                      dropdownStyleProps: {
                        className: "!rounded-xl !shadow-xl !border-gray-100",
                      },
                    }}
                  />
                )}
              />
              {errors.phoneNumber && (
                <p className="text-[11px] text-red-600 font-bold mt-1.5 px-1 italic tracking-tight">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-slate-200 border border-slate-900 hover:border-slate-800 mt-2"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Creando cuenta...</span>
                </div>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>

          <div className="mt-8 p-5 rounded-2xl bg-slate-50/50 border border-slate-100/80 backdrop-blur-sm">
            <p className="text-[11px] text-slate-500 leading-relaxed text-center font-medium">
              Al registrarte, podrás elegir tu perfil (Abogado o Cliente) y completar tu información en los siguientes pasos de onboarding.
            </p>
          </div>
        </div>
      </div>

      {/* Lado Derecho */}
      <RightHero />

      {/* Overrides for react-international-phone to match premium look */}
      <style jsx global>{`
        .react-international-phone-input-container .react-international-phone-country-selector-button {
          padding-left: 12px !important;
          padding-right: 8px !important;
        }
        .react-international-phone-input-container .react-international-phone-country-selector-button__dropdown-arrow {
          border-top-color: #64748b !important;
        }
      `}</style>
    </div>
  );
}