"use client";

import { useRouter } from "next/navigation";
import { AuthScreen } from "@/components/screens/AuthScreen";

export default function SignupPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#F8FAFF] to-[#FFFFFF] flex flex-col items-center justify-center">
      <AuthScreen
        initialMode="signup"
        onSuccess={() => router.push("/career-profile")}
      />
    </main>
  );
}
