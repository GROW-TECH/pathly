"use client";

import { useRouter } from "next/navigation";
import { OnboardingScreen } from "@/components/screens/OnboardingScreen";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-surface-muted flex flex-col">
      <OnboardingScreen
        onFinish={() => router.push("/signup")}
        onSkip={() => router.push("/login")}
      />
    </div>
  );
}
