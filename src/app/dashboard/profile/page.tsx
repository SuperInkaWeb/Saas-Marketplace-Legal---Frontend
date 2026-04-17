"use client";

import { useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Briefcase, Clock, Building2, Scale } from "lucide-react";

import GeneralInfoForm from "./components/GeneralInfoForm";
import ClientGeneralInfoForm from "./components/ClientGeneralInfoForm";
import SpecialtiesForm from "./components/SpecialtiesForm";
import ScheduleManager from "./components/ScheduleManager";

const TABS = [
  { id: "general", label: "Información General", icon: User },
  { id: "specialties", label: "Especialidades", icon: Briefcase },
  { id: "schedules", label: "Horarios", icon: Clock },
];

export default function ProfileSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <Scale className="w-12 h-12 text-emerald-500 animate-pulse" />
      </div>
    );
  }

  const isLawyer = user.role === "LAWYER" || user.role === "ROLE_LAWYER";
  
  // Clientes solo tienen acceso a "Información General"
  const availableTabs = isLawyer ? TABS : [TABS[0]];

  return (
    <div className="min-h-screen bg-surface py-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16">
          <button 
            onClick={() => router.push("/dashboard")}
            className="group flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-3 h-3 mr-2 transition-transform group-hover:-translate-x-1" />
            Volver
          </button>
          <div className={isLawyer ? "border-l-4 border-amber-500 pl-8" : "border-l-4 border-emerald-500 pl-8"}>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase font-manrope">
              Configuración <br /> de Perfil
            </h1>
            <p className="text-slate-400 font-inter text-sm max-w-lg mt-6 leading-relaxed">
              {isLawyer 
                ? "Gestione su identidad pública, disponibilidad técnica y especialidades operativas dentro del ecosistema legal."
                : "Actualice su información personal y detalles de contacto para facilitar la comunicación con sus asesores."
              }
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Architectural Tabs Navigation */}
          <div className="lg:w-64 shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide sticky top-24">
              {availableTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative flex items-center gap-4 px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap
                      ${isActive 
                        ? "text-slate-900 bg-white shadow-sm border border-slate-100" 
                        : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}
                    `}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? (isLawyer ? "text-amber-600" : "text-emerald-600") : "text-slate-300"}`} />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicatorSettings"
                        className={`absolute left-0 w-1 h-6 hidden lg:block ${isLawyer ? "bg-amber-500" : "bg-emerald-500"}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white border border-slate-50 p-8 lg:p-12 min-h-[700px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                {activeTab === "general" && (
                  isLawyer ? <GeneralInfoForm /> : <ClientGeneralInfoForm />
                )}
                {activeTab === "specialties" && isLawyer && <SpecialtiesForm />}
                {activeTab === "schedules" && isLawyer && <ScheduleManager />}
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  );
}
