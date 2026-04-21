"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../../../modules/auth/schemas";
import { useForgotPassword, extractApiError } from "../../../modules/auth/hooks";
import { FormAlert } from "../components/FormAlert";
import Link from "next/link";
import RightHero from "../components/RighHero";
import AuthHeader from "../components/AuthHeader";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: forgotPassword, isPending, error } = useForgotPassword();

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data);
  };

  const apiError = error ? extractApiError(error) : null;

  return (
    <div className="min-h-screen flex bg-white font-['Inter',sans-serif]">
      {/* Lado Izquierdo: Formulario */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col px-8 sm:px-16 lg:px-24 py-20 bg-white z-10 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          {/* Header / Logo de regreso */}
          <AuthHeader />

          {/* Header de la sección */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Ingresa tu correo electrónico para recibir instrucciones de recuperación de contraseña.
            </p>
          </div>

          {/* Alerta de Error */}
          {apiError && (
            <div className="mb-6">
              <FormAlert
                message={apiError.message}
                help={apiError.help}
                type="error"
              />
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                {...register("email")}
                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white text-sm ${errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/10"
                  }`}
                type="email"
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                required
                autoFocus
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-600 font-medium mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-accent transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
            >
              {isPending ? (
                <>
                  <i className="fas fa-circle-notch animate-spin mr-2"></i>
                  Enviando correo...
                </>
              ) : (
                "Enviar enlace de recuperación"
              )}
            </button>
          </form>

          {/* Navegación de retorno */}
          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <Link
              href="/login"
              className="group flex items-center justify-center text-sm font-semibold text-primary hover:text-accent transition-colors"
            >
              <i className="fas fa-arrow-left mr-2 text-xs transition-transform group-hover:-translate-x-1"></i>
              Volver al inicio de sesión
            </Link>
          </div>

        </div>
      </div>

      {/* Lado Derecho: Hero */}
      <RightHero />

    </div>
  );
}