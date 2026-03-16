"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../../modules/auth/schemas";
import { useLogin, extractApiError } from "../../../modules/auth/hooks";
import { FormAlert } from "../components/FormAlert";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending, error } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const apiError = error ? extractApiError(error) : null;

  return (
    <div className="min-h-screen flex bg-white font-['Inter',sans-serif]">
      
      {/* Lado Izquierdo - Panel de Autenticación */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white z-10">
        <div className="w-full max-w-sm mx-auto">
          
          {/* Logo / Emblema Universal */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Bienvenido!
            </h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Inicia sesión para continuar
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
            
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                {...register("email")}
                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white text-sm ${
                  errors.email 
                    ? "border-red-500 focus:ring-2 focus:ring-red-200" 
                    : "border-gray-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100"
                }`}
                type="email"
                placeholder="example@gmail.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-red-600 font-medium mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  {...register("password")}
                  className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 transition-all duration-200 focus:outline-none focus:bg-white text-sm ${
                    errors.password 
                      ? "border-red-500 focus:ring-2 focus:ring-red-200" 
                      : "border-gray-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100"
                  }`}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 font-medium mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/*Recordar / Recuperar */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Recordar sesión</span>
              </label>
              
              <Link 
                href="/forgot-password" 
                className="text-sm font-semibold text-slate-700 hover:text-black transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-2 shadow-sm"
            >
              {isPending ? (
                <>
                  <i className="fas fa-circle-notch animate-spin mr-2"></i>
                  Iniciando sesión...
                </>
              ) : (
                "Ingresar a mi cuenta"
              )}
            </button>
          </form>

          {/* Registro y Políticas (Ajustado para ambos) */}
          <div className="mt-10 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="font-bold text-slate-900 hover:underline">
                Regístrate aquí
              </Link>
            </p>
            <p className="mt-6 text-xs text-gray-400">
              Al continuar, aceptas nuestros{" "}
              <a href="#" className="underline hover:text-gray-600">Términos de servicio</a> y la{" "}
              <a href="#" className="underline hover:text-gray-600">Política de privacidad</a>.
            </p>
          </div>

        </div>
      </div>

      {/* Lado Derecho - Imagen y Copy Inclusivo */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
        {/* Imagen de fondo */}
        <Image
          src="/banner-login.jpg" 
          alt="banner-login"
          fill
          className="object-cover opacity-40 mix-blend-overlay"
          priority
        />
        
        {/* Degradado para mejorar legibilidad */}
        <div className="absolute inset-0 bg-linear-to-tr to-transparent"></div>

        {/* Contenido de la derecha */}
        <div className="relative z-10 max-w-xl text-left">
          <div className="w-12 h-1 bg-blue-500 mb-6 rounded-full"></div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Transparencia y excelencia <br />en cada paso legal.
          </h2>
          <p className="text-lg text-gray-300 font-light leading-relaxed max-w-md">
            Conectamos a profesionales del derecho y clientes en un entorno seguro. Gestiona documentos, comunícate fácilmente y haz seguimiento a tus procesos en tiempo real.
          </p>
        </div>
      </div>

    </div>
  );
}