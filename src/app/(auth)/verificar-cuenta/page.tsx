"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, type VerifyOtpFormData } from "../../../modules/auth/schemas";
import { useVerifyOtp, useResendOtp, extractApiError } from "../../../modules/auth/hooks";
import { FormAlert } from "../components/FormAlert";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RightHero from "../components/RighHero";
import AuthHeader from "../components/AuthHeader";

function VerifyAccountContent() {
  const searchParams = useSearchParams();
  const emailQuery = searchParams.get("email") || "";

  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: emailQuery,
    },
  });

  const { mutate: verifyOtp, isPending: isVerifying, error: verifyError } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending, error: resendError } = useResendOtp();

  const onSubmit = (data: VerifyOtpFormData) => {
    setResendSuccess(false);
    verifyOtp(data);
  };

  const codeInput = watch("code");

  const handleResend = () => {
    if (emailQuery && cooldown === 0) {
      setResendSuccess(false);
      resendOtp(
        { email: emailQuery, purpose: "ACCOUNT_VERIFICATION" },
        {
          onSuccess: () => {
            setResendSuccess(true);
            setCooldown(60);
          },
        }
      );
    }
  };

  const activeError = resendError || verifyError;
  const apiError = activeError ? extractApiError(activeError) : null;

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
              Verifica tu cuenta
            </h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Ingresa el código OTP de 6 dígitos que te hemos enviado a{" "}
              <span className="font-semibold text-slate-800">{emailQuery}</span> para activar tu cuenta.
            </p>
          </div>

          {/* Alerta de Error */}
          {apiError && (
            <div className="mb-6">
              <FormAlert 
                message={apiError.isGone ? "El código ha expirado" : apiError.message} 
                help={apiError.isGone ? "Por favor, usa el botón de abajo para solicitar uno nuevo." : apiError.help} 
                type="error" 
              />
            </div>
          )}

          {/* Alerta de Éxito para Reenvío */}
          {resendSuccess && (
            <div className="mb-6">
              <FormAlert
                message="¡Nuevo código enviado!"
                help="Revisa tu bandeja de entrada o la carpeta de spam."
                type="success"
              />
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input type="hidden" {...register("email")} />

            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Código de Activación (OTP)
              </label>
              <input
                id="code"
                {...register("code")}
                className={`w-full px-4 py-3 text-center tracking-widest text-xl rounded-lg border bg-gray-50 text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white ${errors.code
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100"
                  }`}
                type="text"
                maxLength={6}
                placeholder="••••••"
                autoComplete="one-time-code"
              />
              {errors.code ? (
                <p className="text-xs text-red-600 font-medium mt-1.5 text-center">{errors.code.message}</p>
              ) : (
                <p className="text-xs text-slate-500 mt-2 text-center">Código de 6 dígitos</p>
              )}

              <button
                type="submit"
                disabled={!codeInput || codeInput.length !== 6 || isVerifying}
                className="w-full mt-6 bg-slate-900 text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shadow-sm"
              >
                {isVerifying ? (
                  <>
                    <i className="fas fa-circle-notch animate-spin mr-2"></i>
                    Verificando...
                  </>
                ) : (
                  <>
                    Verificar y Entrar
                    <i className="fas fa-arrow-right ml-2 text-xs"></i>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Opciones Adicionales */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || cooldown > 0}
              className="group flex items-center justify-center text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <>
                  <i className="fas fa-circle-notch animate-spin mr-2"></i>
                  Enviando...
                </>
              ) : cooldown > 0 ? (
                <>
                  Reenviar código en {cooldown}s
                </>
              ) : (
                <>
                  ¿No recibiste el código? Reenviar
                </>
              )}
            </button>

            <Link
              href="/login"
              className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
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

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyAccountContent />
    </Suspense>
  );
}
