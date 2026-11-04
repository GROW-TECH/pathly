"use client";

import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/screens/SplashScreen";

export default function SplashPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-surface-muted">
      <SplashScreen onComplete={() => router.push("/onboarding")} />
    </div>
  );
}
