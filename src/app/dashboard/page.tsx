"use client";

import { useAuthStore } from "@/modules/auth/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { lawyerConfigService } from "@/modules/profile/services/lawyerConfigService";
import { DashboardStatsResponse } from "@/modules/marketplace/types";
import { ClientDashboardHome } from "@/components/dashboard/ClientDashboardHome";
import { LawyerDashboardHome } from "@/components/dashboard/LawyerDashboardHome";
import { Scale } from "lucide-react";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const router = useRouter();
  
  const [greeting, setGreeting] = useState("Hola");
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [appointmentCount, setAppointmentCount] = useState(0);

  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.onboardingStep !== "COMPLETED") {
      router.replace("/onboarding/rol");
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Buenos días");
    else if (hour < 19) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");

    const role = user.role?.toUpperCase().trim();
    if (role === "LAWYER") {
      loadStats();
    } else {
      loadClientStats();
    }
  }, [user, router, hydrated]);

  const loadClientStats = async () => {
    try {
      const { appointmentService } = await import("@/modules/appointment/services/appointmentService");
      const appointments = await appointmentService.getClientAppointments();
      setAppointmentCount(appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length);
    } catch (e) {
      console.error("Error loading client stats", e);
    }
  };

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const data = await lawyerConfigService.getDashboardStats();
      setStats(data);
    } catch (e: any) {
      // Ignore 403 as it might happen during role transitions or for unauthorized roles
      if (e.response?.status !== 403) {
        console.error("Error loading stats", e);
      }
    } finally {
      setLoadingStats(false);
    }
  };

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <Scale className="w-12 h-12 text-emerald-500 animate-pulse" />
      </div>
    );
  }

  const role = user.role?.toUpperCase().trim();
  const isLawyer = role === "LAWYER";

  return (
    <>
      {isLawyer ? (
        <LawyerDashboardHome 
          user={user} 
          stats={stats} 
          loadingStats={loadingStats} 
          greeting={greeting} 
        />
      ) : (
        <ClientDashboardHome user={user} appointmentCount={appointmentCount} />
      )}
    </>
  );
}
