"use client";

import { useRouter } from "next/navigation";
import { DashboardScreen } from "@/components/screens/DashboardScreen";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-surface-muted">
      <DashboardScreen onRestartDemo={() => router.push("/splash")} />
    </div>
  );
}
