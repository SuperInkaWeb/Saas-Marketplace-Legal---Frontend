"use client";

import { useAuthStore } from "@/modules/auth/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { handleOnboardingRedirect } from "@/modules/auth/hooks";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { user, token, hydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    // Verify if the user is in the correct step
    const step = user.onboardingStep?.toUpperCase();
    
    // Simple path verification to avoid infinite loops if handled by handleOnboardingRedirect
    // but we want to ensure they are NOT in COMPLETED
    if (step === "COMPLETED") {
      router.replace("/dashboard");
      return;
    }

    // Optional: More granular check to ensure they are on the RIGHT onboarding page
    // but handleOnboardingRedirect handles the "where should I be" logic well.
    // We can use it to "force" them to the right step if they try to skip.
    
    const expectedPath = getExpectedPath(step);
    if (expectedPath && pathname !== expectedPath) {
        router.replace(expectedPath);
        return;
    }

    setIsAuthorized(true);
  }, [user, token, hydrated, router, pathname]);

  if (!hydrated || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return <>{children}</>;
}

function getExpectedPath(step: string | undefined): string | null {
    if (!step) return "/onboarding/rol";
    
    switch (step) {
        case "ACCOUNT_CREATED":
        case "ROLE_SELECTION":
            return "/onboarding/rol";
        case "PROFILE_PENDING":
            return "/onboarding/perfil";
        case "KYC_PENDING":
            return "/onboarding/verificacion";
        default:
            return null;
    }
}
