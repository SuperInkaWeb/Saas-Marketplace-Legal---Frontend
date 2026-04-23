"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { selectRoleSchema, type SelectRoleFormData } from "@/modules/auth/schemas";
import { useSelectRole, extractApiError } from "@/modules/auth/hooks";
import { useState } from "react";
import { FormAlert } from "../../(auth)/components/FormAlert";
import RightHero from "../../(auth)/components/RighHero";
import { User, Scale, CheckCircle2 } from "lucide-react";
import AuthHeader from "../../(auth)/components/AuthHeader";

export default function SelectRolePage() {
  const [error, setError] = useState<string | null>(null);
  const { mutate: selectRole, isPending } = useSelectRole();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SelectRoleFormData>({
    resolver: zodResolver(selectRoleSchema),
  });

  const selectedRole = watch("role");

  const onSubmit = (data: SelectRoleFormData) => {
    setError(null);
    selectRole(data, {
      onError: (err) => {
        const { message } = extractApiError(err);
        setError(message);
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-white font-['Inter',sans-serif]">
      {/* Lado Izquierdo */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col px-8 sm:px-16 lg:px-24 py-20 bg-white z-10 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          {/* Header / Logo de regreso */}
          <AuthHeader />
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              ¿Cuál es tu rol?
            </h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Dinos cómo planeas usar la plataforma para personalizar tu experiencia.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6">
              <FormAlert message={error} type="error" />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Opción Cliente */}
              <label
                className={`relative flex flex-col p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 group ${
                  selectedRole === "CLIENT"
                    ? "border-slate-900 bg-slate-50 ring-4 ring-slate-100"
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
              >
                <input
                  type="radio"
                  value="CLIENT"
                  className="sr-only"
                  {...register("role")}
                />
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className={`p-3 rounded-xl transition-colors ${
                      selectedRole === "CLIENT" ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                    }`}
                  >
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">Soy Cliente</h3>
                    <p className="text-xs text-gray-500">Busco asesoría legal y abogados</p>
                  </div>
                  {selectedRole === "CLIENT" && (
                    <CheckCircle2 className="w-6 h-6 text-slate-900" />
                  )}
                </div>
                <div className="text-xs text-gray-400 leading-relaxed pl-[60px]">
                  Podrás solicitar presupuestos, gestionar tus casos y pagar de forma segura.
                </div>
              </label>

              {/* Opción Abogado */}
              <label
                className={`relative flex flex-col p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 group ${
                  selectedRole === "LAWYER"
                    ? "border-slate-900 bg-slate-50 ring-4 ring-slate-100"
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
              >
                <input
                  type="radio"
                  value="LAWYER"
                  className="sr-only"
                  {...register("role")}
                />
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className={`p-3 rounded-xl transition-colors ${
                      selectedRole === "LAWYER" ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                    }`}
                  >
                    <Scale className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">Soy Abogado</h3>
                    <p className="text-xs text-gray-500">Ofrezco mis servicios profesionales</p>
                  </div>
                  {selectedRole === "LAWYER" && (
                    <CheckCircle2 className="w-6 h-6 text-slate-900" />
                  )}
                </div>
                <div className="text-xs text-gray-400 leading-relaxed pl-[60px]">
                  Publica tu perfil, responde solicitudes y expande tu cartera de clientes.
                </div>
              </label>
            </div>

            {errors.role && (
              <p className="text-sm text-red-600 font-medium text-center">
                {errors.role.message}
              </p>
            )}

            <button
              type="submit"
              disabled={!selectedRole || isPending}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
            >
              {isPending ? "Confirmando..." : "Continuar"}
            </button>
          </form>

          <p className="mt-8 text-xs text-gray-400 text-center uppercase tracking-widest font-semibold">
            Paso 1 de {selectedRole === "CLIENT" ? "2" : "3"}
          </p>
        </div>
      </div>

      {/* Lado Derecho */}
      <RightHero />
    </div>
  );
}
