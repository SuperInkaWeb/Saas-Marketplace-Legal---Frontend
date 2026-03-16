"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientRegisterSchema, type ClientRegisterFormData } from "@/modules/auth/schemas";
import { useRegisterClient, extractApiError } from "@/modules/auth/hooks";
import { FormAlert } from "../components/FormAlert";
import Link from "next/link";
import RightHero from "../components/RighHero";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientRegisterFormData>({
    resolver: zodResolver(clientRegisterSchema),
  });

  const { mutate: registerClient, isPending, error } = useRegisterClient();

  const onSubmit = (data: ClientRegisterFormData) => registerClient(data);

  const apiError = error ? extractApiError(error) : null;

  return (
    <div className="min-h-screen flex bg-white font-['Inter',sans-serif]">

      {/* Lado Izquierdo */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white z-10">
        <div className="w-full max-w-sm mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Crear cuenta
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-semibold text-slate-700 hover:text-black"
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nombre
              </label>
              <input
                {...register("firstName")}
                placeholder="Gabriel"
                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white text-sm ${errors.firstName
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100"
                  }`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-600 font-medium mt-1.5">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Apellidos */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Ap. paterno
                </label>
                <input
                  {...register("lastNameFather")}
                  placeholder="García"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100"
                />
                {errors.lastNameFather && (
                  <p className="text-xs text-red-600 font-medium mt-1.5">
                    {errors.lastNameFather.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Ap. materno
                </label>
                <input
                  {...register("lastNameMother")}
                  placeholder="López"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100"
                />
                {errors.lastNameMother && (
                  <p className="text-xs text-red-600 font-medium mt-1.5">
                    {errors.lastNameMother.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white text-sm ${errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100"
                  }`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 font-medium mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Contraseña
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white text-sm ${errors.password
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100"
                  }`}
              />
              {errors.password && (
                <p className="text-xs text-red-600 font-medium mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Opcionales */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Teléfono <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                {...register("phoneNumber")}
                placeholder="+51 987 654 321"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Empresa <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                {...register("companyName")}
                placeholder="Mi Empresa SAC"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
            >
              {isPending ? "Creando cuenta..." : "Crear cuenta"}
            </button>

          </form>
        </div>
      </div>

      {/* Lado Derecho */}
      <RightHero />

    </div>
  );
}