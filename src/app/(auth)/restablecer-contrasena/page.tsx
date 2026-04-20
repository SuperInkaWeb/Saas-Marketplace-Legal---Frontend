"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormData } from "../../../modules/auth/schemas";
import { useResetPassword, useValidateResetOtp, extractApiError } from "../../../modules/auth/hooks";
import { FormAlert } from "../components/FormAlert";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RightHero from "../components/RighHero";
import AuthHeader from "../components/AuthHeader";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const emailQuery = searchParams.get("email") || "";

  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailQuery,
    },
  });

  const { mutate: resetPassword, isPending: isResetting, error: resetError } = useResetPassword();
  const { mutate: validateOtp, isPending: isValidating, error: validateError } = useValidateResetOtp();

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword(data);
  };

  const codeInput = watch("code");
  const emailInput = watch("email");

  const handleNextStep = () => {
    if (codeInput && codeInput.length === 6) {
      validateOtp({ email: emailInput, code: codeInput }, {
        onSuccess: () => {
          setStep(2);
        }
      });
    }
  };

  const activeError = step === 1 ? validateError : resetError;
  const apiError = activeError ? extractApiError(activeError) : null;
  const isPending = step === 1 ? isValidating : isResetting;

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
              Restablecer Contraseña
            </h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              {step === 1 ? (
                <>
                  Ingresa el código OTP de 6 dígitos que te hemos enviado a{" "}
                  <span className="font-semibold text-slate-800">{emailQuery}</span>.
                </>
              ) : (
                "Elige una nueva contraseña segura para tu cuenta."
              )}
            </p>
          </div>

          {/* Alerta de Error */}
          {apiError && (
            <div className="mb-6">
              <FormAlert message={apiError.message} help={apiError.help} type="error" />
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input type="hidden" {...register("email")} />

            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Código de Seguridad (OTP)
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
                  type="button"
                  onClick={handleNextStep}
                  disabled={!codeInput || codeInput.length !== 6}
                  className="w-full mt-6 bg-slate-900 text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shadow-sm"
                >
                  Continuar
                  <i className="fas fa-arrow-right ml-2 text-xs"></i>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-5">
                {/* Nueva Contraseña */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      {...register("newPassword")}
                      className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white text-sm ${errors.newPassword
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100"
                        }`}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
                    >
                      <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-red-600 font-medium mt-1.5">{errors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      {...register("confirmPassword")}
                      className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white text-sm ${errors.confirmPassword
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100"
                        }`}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
                    >
                      <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 font-medium mt-1.5">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-white text-slate-700 border border-slate-300 py-3.5 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate-100"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-2/3 bg-slate-900 text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                  >
                    {isPending ? (
                      <>
                        <i className="fas fa-circle-notch animate-spin mr-2"></i>
                        Guardando...
                      </>
                    ) : (
                      "Cambiar Contraseña"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Navegación de retorno */}
          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <Link
              href="/login"
              className="group flex items-center justify-center text-sm font-semibold text-slate-700 hover:text-black transition-colors"
            >
              <i className="fas fa-arrow-left mr-2 text-xs transition-transform group-hover:-translate-x-1"></i>
              Cancelar y volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Hero */}
      <RightHero />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
