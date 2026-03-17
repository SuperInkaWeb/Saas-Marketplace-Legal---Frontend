"use client";

import { useAuthStore } from "@/modules/auth/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    if (user?.onboardingStep && user.onboardingStep !== "COMPLETED") {
       // Si de alguna forma llegó aquí sin terminar el onboarding, lo devolvemos
       router.replace("/onboarding/rol");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">¡Bienvenido, {user?.fullName}!</h1>
      <p className="text-slate-600 mb-8 max-w-md">
        Has completado el proceso de onboarding exitosamente. Este es tu panel de control (en desarrollo).
      </p>
      
      <div className="flex gap-4">
        <button 
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
        >
          Ir al Inicio
        </button>
        <button 
          onClick={() => logout()}
          className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
