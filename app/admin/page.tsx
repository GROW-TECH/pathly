"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { adminApi } from "@/lib/api/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already authenticated as admin
    async function checkAuth() {
      if (adminApi.isLoggedIn()) {
        try {
          await adminApi.getMe();
          router.replace("/admin/dashboard");
          return;
        } catch {
          // Token expired or invalid
          adminApi.logout();
        }
      }
      setCheckingAuth(false);
    }
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await adminApi.login(email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid administrator credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@pathly.io");
    setPassword("AdminPassword123!");
    setError(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF9FF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#635BFF] animate-spin" />
          <p className="text-[13px] font-semibold text-[#667085]">Checking administrator session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0F0E1E] via-[#16142A] to-[#1E1B3E] text-white flex items-center justify-center p-4 selection:bg-[#635BFF]">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#1C1A35]/90 backdrop-blur-xl border border-[#2E2B54] rounded-[28px] p-7 md:p-9 shadow-2xl shadow-black/40 space-y-6"
        >
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] text-white shadow-lg shadow-[#635BFF]/30 mb-2">
              <Shield className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#635BFF]/15 border border-[#635BFF]/30 text-[#A5B4FC] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#635BFF]" />
              <span>Pathly Control Center</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Admin Authentication</h1>
            <p className="text-[12.5px] text-[#A5A0C8] max-w-xs mx-auto">
              Secure access for managing platform courses, mentors, and registered candidate accounts.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-[12px] flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#C7C3E8]">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7C77A5] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pathly.io"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#252244] border border-[#353260] text-white text-[13px] placeholder:text-[#6C6794] outline-none focus:border-[#635BFF] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#C7C3E8]">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7C77A5] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#252244] border border-[#353260] text-white text-[13px] placeholder:text-[#6C6794] outline-none focus:border-[#635BFF] transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] hover:from-[#5349E8] hover:to-[#7A4BE0] text-white font-bold text-[13.5px] flex items-center justify-center gap-2 shadow-lg shadow-[#635BFF]/30 transition-all disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="pt-2 border-t border-[#2E2B54]/80 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11.5px] font-semibold text-[#A5B4FC] hover:text-white underline underline-offset-4 transition-colors"
            >
              Fill Default Admin Credentials (admin@pathly.io)
            </button>
            <a
              href="/"
              className="text-[11px] text-[#7C77A5] hover:text-[#A5A0C8] transition-colors"
            >
              ← Return to Candidate Portal
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

