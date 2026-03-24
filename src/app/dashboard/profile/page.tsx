"use client";

import { useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Briefcase, Clock, Building2 } from "lucide-react";

import GeneralInfoForm from "./components/GeneralInfoForm";
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

  if (!user || user.role !== "LAWYER") {
    // Si no es abogado, lo mandamos al dashboard principal (por ahora)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => router.push("/dashboard")}
              className="group flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
              Volver al Dashboard
            </button>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Configuración de Perfil
            </h1>
            <p className="text-slate-500 mt-1">
              Gestiona tu información pública, horarios y especialidades para que te encuentren los clientes.
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Tabs */}
          <div className="md:w-64 shrink-0">
            <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap
                      ${isActive 
                        ? "text-emerald-700 bg-emerald-50/80 shadow-sm border border-emerald-100" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"}
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full hidden md:block"
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

          {/* Form Content Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === "general" && <GeneralInfoForm />}
                {activeTab === "specialties" && <SpecialtiesForm />}
                {activeTab === "schedules" && <ScheduleManager />}

              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  );
}
