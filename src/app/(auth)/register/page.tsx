"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientRegisterSchema, type ClientRegisterFormData } from "@/modules/auth/schemas";
import { useRegisterClient, extractApiError } from "@/modules/auth/hooks";
import Link from "next/link";

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

  // Extraemos la información detallada del error
  const apiError = error ? extractApiError(error) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Crear cuenta</h1>
        <p className="text-gray-500 text-sm mb-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Nombre */}
          <div>
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <input
              {...register("firstName")}
              placeholder="Gabriel"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>

          {/* Apellidos */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Ap. paterno</label>
              <input
                {...register("lastNameFather")}
                placeholder="García"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.lastNameFather && (
                <p className="text-red-500 text-xs mt-1">{errors.lastNameFather.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Ap. materno</label>
              <input
                {...register("lastNameMother")}
                placeholder="López"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.lastNameMother && (
                <p className="text-red-500 text-xs mt-1">{errors.lastNameMother.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="gabriel@gmail.com"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Mínimo 8 caracteres"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Campos opcionales */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Teléfono <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              {...register("phoneNumber")}
              placeholder="+51 987 654 321"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Empresa <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              {...register("companyName")}
              placeholder="Mi Empresa SAC"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bloque de Error Dinámico con Ayuda */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm font-bold">
                {apiError.message}
              </p>
              {apiError.help && (
                <p className="text-red-600 text-xs mt-2 pt-2 border-t border-red-200 italic">
                  💡 Sugerencia: {apiError.help}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors shadow-sm"
          >
            {isPending ? "Creando cuenta..." : "Crear cuenta"}
          </button>

        </form>
      </div>
    </div>
  );
}