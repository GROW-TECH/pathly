"use client";

import { useRouter } from "next/navigation";
import { CareerProfileScreen } from "@/components/screens/CareerProfileScreen";

export default function CareerProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-surface-muted flex items-center justify-center p-4">
      <CareerProfileScreen
        onComplete={() => router.push("/dashboard")}
        onBack={() => router.push("/login")}
      />
    </div>
  );
}
