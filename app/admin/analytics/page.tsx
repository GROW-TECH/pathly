"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    // Seamlessly navigate to the interactive analytics dashboard in admin console
    router.replace("/admin/dashboard?tab=reports");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] text-slate-400">
      <div className="text-center">
        <div className="h-7 w-7 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Redirecting to Platform Analytics...</p>
      </div>
    </div>
  );
}

