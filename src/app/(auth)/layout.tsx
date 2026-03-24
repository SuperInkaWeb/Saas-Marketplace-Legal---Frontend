"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store";
import { handleOnboardingRedirect } from "@/modules/auth/hooks";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    // Si ya hay token, no deberíamos estar en las páginas de auth (login/register/verify)
    // a menos que sea necesario completar el onboarding.
    if (hydrated && token && user) {
      handleOnboardingRedirect(user.onboardingStep, router, user.role);
    }
  }, [hydrated, token, user, router]);

  if (!hydrated) return null;

  return <>{children}</>;
}