"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  GraduationCap,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/lib/context/AuthContext";
import { authApi } from "@/lib/api/auth";

interface AuthScreenProps {
  onSuccess?: (authMode: "login" | "signup") => void;
  initialMode?: "login" | "signup";
}

type CareerStatus = "fresher" | "experienced" | null;

/**
 * ============================================================================
 * WELCOME SUCCESS TRANSITION SCREEN (NO LARGE CARD, FULL-BLEED AI VISUAL)
 * ============================================================================
 */
function WelcomeSuccessScreen({
  onComplete,
  mode,
}: {
  onComplete?: (authMode: "login" | "signup") => void;
  mode: "login" | "signup";
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.(mode);
    }, 2100);
    return () => clearTimeout(timer);
  }, [onComplete, mode]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center bg-gradient-to-b from-[#EEF2FF]/60 via-[#F8FAFF] to-[#EEF2FF]/50 text-[#172033] select-none px-4 py-6 font-sans overflow-hidden"
    >
      {/* Subtle Ambient Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[8%] right-[10%] w-[280px] h-[280px] rounded-full bg-brand-200/35 blur-3xl animate-pulse" />
        <div className="absolute bottom-[12%] left-[10%] w-[300px] h-[300px] rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      {/* 1. Header: Pathly Logo + Welcome Back + Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="text-center pt-2"
      >
        <div className="flex justify-center mb-3">
          <Logo size="sm" variant="full" showAiBadge={false} showTagline={false} />
        </div>
        <h1 className="text-[24px] font-bold text-[#172033] tracking-tight leading-tight mb-1">
          {mode === "signup" ? "Welcome to Pathly" : "Welcome Back"}
        </h1>
        <p className="text-[12.5px] font-normal text-[#667085] leading-tight">
          Your career journey continues here.
        </p>
      </motion.div>

      {/* 2. Main Career AI Success Visual with Floating Glass Nodes */}
      <div className="relative w-full max-w-[270px] aspect-square flex items-center justify-center my-auto">
        {/* Soft Circular Expanding Glow Ring */}
        <motion.div
          animate={{ scale: [0.92, 1.12, 0.92], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-4 rounded-full bg-gradient-to-tr from-brand-300/30 via-indigo-200/40 to-purple-200/30 blur-xl -z-10"
        />

        {/* Faint Orbital Ring */}
        <div className="absolute inset-4 rounded-full border border-dashed border-brand-200/80 pointer-events-none" />

        {/* Central Glowing AI & Check Circle */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.15 }}
          className="relative w-20 h-20 rounded-full bg-white/95 backdrop-blur-xl border border-brand-200 shadow-[0_8px_24px_rgba(99,91,255,0.22)] flex flex-col items-center justify-center z-10"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] text-white flex items-center justify-center shadow-xs mb-0.5">
            <Check className="w-5 h-5 stroke-[2.8]" />
          </div>
          <span className="text-[8.5px] font-extrabold text-[#635BFF] tracking-wider uppercase">
            ✦ AI
          </span>
        </motion.div>

        {/* 4 Floating Circular Glass Career Nodes */}
        {/* Node 1: Learning (Top) */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -3, 0] }}
          transition={{
            scale: { delay: 0.3, type: "spring", stiffness: 320, damping: 20 },
            y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E4E7EC] shadow-2xs"
        >
          <GraduationCap className="w-3.5 h-3.5 text-amber-500 stroke-[2]" />
          <span className="text-[10px] font-bold text-[#172033]">Learning</span>
        </motion.div>

        {/* Node 2: Jobs (Right) */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, x: [0, 3, 0] }}
          transition={{
            scale: { delay: 0.4, type: "spring", stiffness: 320, damping: 20 },
            x: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E4E7EC] shadow-2xs"
        >
          <Briefcase className="w-3.5 h-3.5 text-blue-500 stroke-[2]" />
          <span className="text-[10px] font-bold text-[#172033]">Jobs</span>
        </motion.div>

        {/* Node 3: Growth (Bottom) */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, 3, 0] }}
          transition={{
            scale: { delay: 0.5, type: "spring", stiffness: 320, damping: 20 },
            y: { duration: 3.0, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E4E7EC] shadow-2xs"
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500 stroke-[2]" />
          <span className="text-[10px] font-bold text-[#172033]">Growth</span>
        </motion.div>

        {/* Node 4: AI Guidance (Left) */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, x: [0, -3, 0] }}
          transition={{
            scale: { delay: 0.6, type: "spring", stiffness: 320, damping: 20 },
            x: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E4E7EC] shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500 stroke-[2]" />
          <span className="text-[10px] font-bold text-[#172033]">AI Match</span>
        </motion.div>
      </div>

      {/* 3. Messages & Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.35 }}
        className="w-full max-w-xs text-center space-y-2.5 pb-2"
      >
        <div className="space-y-1">
          <h2 className="text-[19px] font-bold text-[#172033] tracking-tight flex items-center justify-center gap-1.5">
            <span>You&apos;re all set!</span>
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          </h2>
          <div className="flex items-center justify-center gap-1 text-[12px] text-[#667085]">
            <span>Preparing your personalized career journey</span>
            <span className="inline-flex gap-0.5">
              <span className="animate-bounce text-[#635BFF]">.</span>
              <span className="animate-bounce text-[#635BFF] [animation-delay:0.2s]">.</span>
              <span className="animate-bounce text-[#635BFF] [animation-delay:0.4s]">.</span>
            </span>
          </div>
        </div>

        {/* AI Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE]/70 text-[#635BFF] text-[11px] font-semibold shadow-2xs">
          <Sparkles className="w-3 h-3 text-[#635BFF]" />
          <span>✦ AI-powered career guidance</span>
        </div>

        {/* Progress Bar */}
        <div className="w-36 mx-auto h-1.5 bg-[#E4E7EC] rounded-full overflow-hidden mt-1.5">
          <motion.div
            className="h-full bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        </div>

        <p className="text-[10.5px] text-[#667085] pt-0.5">
          Taking you to your dashboard...
        </p>

        {/* Micro Tagline */}
        <p className="text-[11px] text-[#667085]/70 pt-1.5">
          Your Career. Smarter.
        </p>
      </motion.div>
    </motion.div>
  );
}

export function AuthScreen({
  onSuccess,
  initialMode = "login",
}: AuthScreenProps) {
  const { login, signUp, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [careerStatus, setCareerStatus] = useState<CareerStatus>(null);

  // Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation State
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [submitted, setSubmitted] = useState(false);

  // Field Validation Errors
  const errors = useMemo(() => {
    const errs: { [key: string]: string } = {};

    if (mode === "signup") {
      if (!name.trim()) {
        errs.name = "Full name is required";
      }

      const cleanMobile = mobile.replace(/\D/g, "");
      if (!cleanMobile) {
        errs.mobile = "Mobile number is required";
      } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
        errs.mobile = "Enter 10-digit number";
      }
    }

    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Invalid email format";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Min 6 characters";
    }

    if (mode === "signup") {
      if (!confirmPassword) {
        errs.confirmPassword = "Confirm password";
      } else if (password !== confirmPassword) {
        errs.confirmPassword = "Passwords do not match";
      }

      if (!careerStatus) {
        errs.careerStatus = "Select status";
      }
    }

    return errs;
  }, [mode, name, mobile, email, password, confirmPassword, careerStatus]);

  const isFormValid = Object.keys(errors).length === 0;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError(null);

    if (!isFormValid) return;

    setIsLoading(true);

    try {
      if (mode === "signup") {
        await signUp({
          full_name: name.trim(),
          email: email.trim().toLowerCase(),
          mobile: mobile.trim(),
          password: password,
          career_status: careerStatus || "fresher",
        });
      } else {
        await login({
          email: email.trim(),
          password: password,
        });
      }
      setIsLoading(false);
      setAuthSuccess(true);
    } catch (err: any) {
      setIsLoading(false);
      const message = err?.detail || err?.message || "Authentication failed. Please verify credentials.";
      setApiError(message);
    }
  };

  useEffect(() => {
    // Dynamically inject Google Identity Services SDK script
    const scriptId = "google-jssdk";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleGoogleAuth = () => {
    setApiError(null);
    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "22226768889-16aj6470v59qab58n12g4n9ervoc6dsn.apps.googleusercontent.com";

    if (typeof window === "undefined" || !(window as any).google?.accounts) {
      setApiError("Google Sign-In is initializing. Please click again in a moment.");
      return;
    }

    // Use OAuth2 popup client (works in all browsers, Incognito mode, and avoids iframe restrictions)
    if ((window as any).google?.accounts?.oauth2) {
      try {
        const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "email profile openid",
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              setApiError(tokenResponse.error_description || "Google authorization failed.");
              return;
            }
            if (tokenResponse.access_token) {
              setIsLoading(true);
              try {
                await loginWithGoogle({ access_token: tokenResponse.access_token });
                setAuthSuccess(true);
              } catch (err: any) {
                setIsLoading(false);
                setApiError(err?.detail || err?.message || "Google authentication failed.");
              }
            }
          },
        });
        tokenClient.requestAccessToken({ prompt: "consent" });
        return;
      } catch (err: any) {
        console.warn("Failed to initialize Google token client, trying ID fallback:", err);
      }
    }

    // Fallback: Google ID token prompt
    try {
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          if (!response?.credential) {
            setApiError("Google Sign-In was canceled or returned no credential.");
            return;
          }
          setIsLoading(true);
          try {
            await loginWithGoogle({ credential: response.credential });
            setAuthSuccess(true);
          } catch (err: any) {
            setIsLoading(false);
            setApiError(err?.detail || err?.message || "Google authentication failed.");
          }
        },
      });

      (window as any).google.accounts.id.prompt();
    } catch (err: any) {
      setApiError("Failed to open Google Sign-In prompt: " + (err?.message || err));
    }
  };

  // ==========================================================================
  // IF AUTH SUCCESS -> RENDER THE TRANSITION EXPERIENCE
  // ==========================================================================
  if (authSuccess) {
    return <WelcomeSuccessScreen onComplete={onSuccess} mode={mode} />;
  }

  // ==========================================================================
  // RENDER: LOGIN VIEW (VERTICALLY & HORIZONTALLY CENTERED)
  // ==========================================================================
  if (mode === "login") {
    return (
      <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-[#F8FAFF] text-[#172033] select-none px-4 py-6 font-sans overflow-y-auto no-scrollbar">
        {/* Subtle Ambient Blurred Gradient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-5%] right-[-5%] w-[300px] h-[300px] rounded-full bg-[#EEF2FF] opacity-60 blur-3xl" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] rounded-full bg-[#E0E7FF] opacity-50 blur-3xl" />
        </div>

        <div className="w-full max-w-[380px] my-auto flex flex-col justify-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center mb-6"
          >
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Logo size="sm" variant="full" showAiBadge={false} showTagline={false} />
            </div>

            <h1 className="text-[24px] font-bold text-[#172033] tracking-tight leading-tight mb-1.5">
              Welcome Back
            </h1>
            <p className="text-[12px] font-normal text-[#667085] leading-tight">
              Sign in to continue your career journey.
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12px] flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{apiError}</span>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="text-left space-y-1">
              <label
                htmlFor="loginEmail"
                className="block text-[12px] font-medium text-[#172033] leading-none"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-[#667085]">
                  <Mail className="w-4 h-4 stroke-[1.8]" />
                </div>
                <input
                  id="loginEmail"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full h-[46px] pl-10 pr-3.5 rounded-[12px] bg-white border text-[13px] text-[#172033] placeholder:text-[#667085]/60 placeholder:text-[12px] shadow-2xs transition-all focus:outline-none focus:ring-2 ${
                    (submitted || touched.email) && errors.email
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15 bg-[#FEF2F2]/15"
                      : "border-[#E4E7EC] hover:border-[#CBD5E1] focus:border-[#635BFF] focus:ring-[#635BFF]/15"
                  }`}
                />
              </div>
              {(submitted || touched.email) && errors.email && (
                <div className="flex items-center gap-1 text-[10.5px] text-[#EF4444] font-medium mt-1 leading-none">
                  <AlertCircle className="w-3 h-3 shrink-0 stroke-[2]" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="text-left space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="loginPassword"
                  className="block text-[12px] font-medium text-[#172033] leading-none"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-[12px] font-semibold text-[#635BFF] hover:text-[#4F46E5] hover:underline transition-colors"
                  onClick={() => alert("Password reset instructions sent to your email!")}
                >
                  Forgot?
                </button>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-[#667085]">
                  <Lock className="w-4 h-4 stroke-[1.8]" />
                </div>
                <input
                  id="loginPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`w-full h-[46px] pl-10 pr-10 rounded-[12px] bg-white border text-[13px] text-[#172033] placeholder:text-[#667085]/60 placeholder:text-[12px] shadow-2xs transition-all focus:outline-none focus:ring-2 ${
                    (submitted || touched.password) && errors.password
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15 bg-[#FEF2F2]/15"
                      : "border-[#E4E7EC] hover:border-[#CBD5E1] focus:border-[#635BFF] focus:ring-[#635BFF]/15"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 p-1 text-[#667085] hover:text-[#172033] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 stroke-[1.8]" />
                  ) : (
                    <Eye className="w-4 h-4 stroke-[1.8]" />
                  )}
                </button>
              </div>
              {(submitted || touched.password) && errors.password && (
                <div className="flex items-center gap-1 text-[10.5px] text-[#EF4444] font-medium mt-1 leading-none">
                  <AlertCircle className="w-3 h-3 shrink-0 stroke-[2]" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <motion.button
                type="submit"
                whileTap={{ scale: 0.985 }}
                disabled={isLoading}
                className="w-full h-[48px] rounded-[14px] bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white font-semibold text-[14px] tracking-wide shadow-md shadow-brand-500/25 hover:brightness-105 active:scale-[0.985] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed font-sans"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <span>Sign In →</span>
                )}
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-5">
              <div className="border-t border-[#E4E7EC] w-full" />
              <span className="bg-transparent px-3 text-[11px] text-[#667085] font-normal whitespace-nowrap">
                or continue with
              </span>
              <div className="border-t border-[#E4E7EC] w-full" />
            </div>

            {/* Google Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.985 }}
              onClick={handleGoogleAuth}
              className="w-full h-[44px] rounded-[12px] bg-white hover:bg-slate-50 border border-[#E4E7EC] text-[13px] font-semibold text-[#172033] shadow-2xs transition-all flex items-center justify-center gap-2.5 active:scale-[0.985] font-sans"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </motion.button>
          </motion.form>

          {/* Bottom Switcher */}
          <div className="w-full text-center text-[12px] text-[#667085] pt-5 font-sans">
            <p>
              New to Pathly?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setSubmitted(false);
                  setApiError(null);
                }}
                className="font-semibold text-[#635BFF] hover:text-[#4F46E5] hover:underline transition-colors"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER: SIGNUP VIEW (100% NON-SCROLLING 6-FIELD VIEWPORT)
  // ==========================================================================
  return (
    <div className="relative h-full min-h-[100dvh] max-h-[100dvh] w-full flex flex-col justify-between bg-[#F8FAFF] text-[#172033] select-none px-3.5 py-2 sm:px-5 sm:py-3 overflow-hidden font-sans">
      <div className="w-full max-w-sm mx-auto flex flex-col justify-between h-full flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center pt-0.5 pb-2"
        >
          <div className="flex justify-center mb-3">
            <Logo size="sm" variant="full" showAiBadge={false} showTagline={false} />
          </div>

          <h1 className="text-[21px] sm:text-[22px] font-bold text-[#172033] tracking-tight leading-tight mb-1">
            Create Your Career Profile
          </h1>
          <p className="text-[11px] font-normal text-[#667085] leading-tight">
            Start your personalized career journey with Pathly.
          </p>
        </motion.div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1">
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="leading-snug">{apiError}</span>
            </motion.div>
          )}
          <div className="space-y-1.5 sm:space-y-2">
            {/* Field 1: Full Name */}
            <div className="text-left">
              <label
                htmlFor="fullName"
                className="block text-[10.5px] sm:text-[11px] font-medium text-[#172033] leading-none mb-[3px]"
              >
                Full Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center pointer-events-none text-[#667085]">
                  <User className="w-[15px] h-[15px] stroke-[1.8]" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={`w-full h-[40px] pl-9 pr-3 rounded-[11px] bg-white border text-[12px] sm:text-[13px] text-[#172033] placeholder:text-[#667085]/60 placeholder:text-[11.5px] shadow-2xs transition-all focus:outline-none focus:ring-1 ${
                    (submitted || touched.name) && errors.name
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20 bg-[#FEF2F2]/15"
                      : "border-[#E4E7EC] hover:border-[#CBD5E1] focus:border-[#635BFF] focus:ring-[#635BFF]/20"
                  }`}
                />
              </div>
              {(submitted || touched.name) && errors.name && (
                <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] text-[#EF4444] font-medium mt-0.5 leading-none">
                  <AlertCircle className="w-2.5 h-2.5 shrink-0 stroke-[2]" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Field 2: Mobile Number */}
            <div className="text-left">
              <label
                htmlFor="mobileNumber"
                className="block text-[10.5px] sm:text-[11px] font-medium text-[#172033] leading-none mb-[3px]"
              >
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-1.5 flex items-center gap-1 pl-2 pr-1.5 py-0.5 bg-[#EEF2FF] rounded-[7px] border border-[#E4E7EC] text-[#172033] text-[10.5px] font-semibold pointer-events-none select-none">
                  <span>+91</span>
                </div>
                <input
                  id="mobileNumber"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  autoComplete="tel"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setMobile(val);
                  }}
                  onBlur={() => handleBlur("mobile")}
                  className={`w-full h-[40px] pl-[54px] pr-3 rounded-[11px] bg-white border text-[12px] sm:text-[13px] text-[#172033] placeholder:text-[#667085]/60 placeholder:text-[11.5px] shadow-2xs transition-all focus:outline-none focus:ring-1 font-medium ${
                    (submitted || touched.mobile) && errors.mobile
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20 bg-[#FEF2F2]/15"
                      : "border-[#E4E7EC] hover:border-[#CBD5E1] focus:border-[#635BFF] focus:ring-[#635BFF]/20"
                  }`}
                />
              </div>
              {(submitted || touched.mobile) && errors.mobile && (
                <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] text-[#EF4444] font-medium mt-0.5 leading-none">
                  <AlertCircle className="w-2.5 h-2.5 shrink-0 stroke-[2]" />
                  <span>{errors.mobile}</span>
                </div>
              )}
            </div>

            {/* Field 3: Email Address */}
            <div className="text-left">
              <label
                htmlFor="emailAddress"
                className="block text-[10.5px] sm:text-[11px] font-medium text-[#172033] leading-none mb-[3px]"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center pointer-events-none text-[#667085]">
                  <Mail className="w-[15px] h-[15px] stroke-[1.8]" />
                </div>
                <input
                  id="emailAddress"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full h-[40px] pl-9 pr-3 rounded-[11px] bg-white border text-[12px] sm:text-[13px] text-[#172033] placeholder:text-[#667085]/60 placeholder:text-[11.5px] shadow-2xs transition-all focus:outline-none focus:ring-1 ${
                    (submitted || touched.email) && errors.email
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20 bg-[#FEF2F2]/15"
                      : "border-[#E4E7EC] hover:border-[#CBD5E1] focus:border-[#635BFF] focus:ring-[#635BFF]/20"
                  }`}
                />
              </div>
              {(submitted || touched.email) && errors.email && (
                <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] text-[#EF4444] font-medium mt-0.5 leading-none">
                  <AlertCircle className="w-2.5 h-2.5 shrink-0 stroke-[2]" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Field 4: Password */}
            <div className="text-left">
              <label
                htmlFor="password"
                className="block text-[10.5px] sm:text-[11px] font-medium text-[#172033] leading-none mb-[3px]"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center pointer-events-none text-[#667085]">
                  <Lock className="w-[15px] h-[15px] stroke-[1.8]" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`w-full h-[40px] pl-9 pr-9 rounded-[11px] bg-white border text-[12px] sm:text-[13px] text-[#172033] placeholder:text-[#667085]/60 placeholder:text-[11.5px] shadow-2xs transition-all focus:outline-none focus:ring-1 ${
                    (submitted || touched.password) && errors.password
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20 bg-[#FEF2F2]/15"
                      : "border-[#E4E7EC] hover:border-[#CBD5E1] focus:border-[#635BFF] focus:ring-[#635BFF]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 p-1 text-[#667085] hover:text-[#172033] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-[15px] h-[15px] stroke-[1.8]" />
                  ) : (
                    <Eye className="w-[15px] h-[15px] stroke-[1.8]" />
                  )}
                </button>
              </div>
              {(submitted || touched.password) && errors.password && (
                <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] text-[#EF4444] font-medium mt-0.5 leading-none">
                  <AlertCircle className="w-2.5 h-2.5 shrink-0 stroke-[2]" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Field 5: Confirm Password */}
            <div className="text-left">
              <label
                htmlFor="confirmPassword"
                className="block text-[10.5px] sm:text-[11px] font-medium text-[#172033] leading-none mb-[3px]"
              >
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center pointer-events-none text-[#667085]">
                  <Lock className="w-[15px] h-[15px] stroke-[1.8]" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`w-full h-[40px] pl-9 pr-9 rounded-[11px] bg-white border text-[12px] sm:text-[13px] text-[#172033] placeholder:text-[#667085]/60 placeholder:text-[11.5px] shadow-2xs transition-all focus:outline-none focus:ring-1 ${
                    (submitted || touched.confirmPassword) &&
                    errors.confirmPassword
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20 bg-[#FEF2F2]/15"
                      : confirmPassword && password === confirmPassword
                      ? "border-[#22C55E] focus:border-[#22C55E] focus:ring-[#22C55E]/20 bg-[#F0FDF4]/25"
                      : "border-[#E4E7EC] hover:border-[#CBD5E1] focus:border-[#635BFF] focus:ring-[#635BFF]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-2.5 p-1 text-[#667085] hover:text-[#172033] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-[15px] h-[15px] stroke-[1.8]" />
                  ) : (
                    <Eye className="w-[15px] h-[15px] stroke-[1.8]" />
                  )}
                </button>
              </div>
              {(submitted || touched.confirmPassword) &&
                errors.confirmPassword && (
                  <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] text-[#EF4444] font-medium mt-0.5 leading-none">
                    <AlertCircle className="w-2.5 h-2.5 shrink-0 stroke-[2]" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
            </div>

            {/* Field 6: Career Status */}
            <div className="text-left pt-0.5">
              <label className="block text-[10.5px] sm:text-[11px] font-medium text-[#172033] leading-none mb-[3px]">
                Where are you in your career?
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCareerStatus("fresher");
                    if (errors.careerStatus) handleBlur("careerStatus");
                  }}
                  className={`h-[42px] px-2.5 rounded-[11px] flex items-center justify-between transition-all text-left ${
                    careerStatus === "fresher"
                      ? "bg-[#EEF2FF] border-2 border-[#635BFF] text-[#4338CA] shadow-2xs font-semibold"
                      : "bg-white border border-[#E4E7EC] text-[#172033] hover:bg-slate-50 font-normal"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#635BFF]" />
                    <span className="text-[12px]">Fresher</span>
                  </div>
                  {careerStatus === "fresher" && (
                    <Check className="w-3.5 h-3.5 text-[#635BFF] stroke-[2.5]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCareerStatus("experienced");
                    if (errors.careerStatus) handleBlur("careerStatus");
                  }}
                  className={`h-[42px] px-2.5 rounded-[11px] flex items-center justify-between transition-all text-left ${
                    careerStatus === "experienced"
                      ? "bg-[#EEF2FF] border-2 border-[#635BFF] text-[#4338CA] shadow-2xs font-semibold"
                      : "bg-white border border-[#E4E7EC] text-[#172033] hover:bg-slate-50 font-normal"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-[#635BFF]" />
                    <span className="text-[12px]">Experienced</span>
                  </div>
                  {careerStatus === "experienced" && (
                    <Check className="w-3.5 h-3.5 text-[#635BFF] stroke-[2.5]" />
                  )}
                </button>
              </div>
              {submitted && errors.careerStatus && (
                <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] text-[#EF4444] font-medium mt-0.5 leading-none">
                  <AlertCircle className="w-2.5 h-2.5 shrink-0 stroke-[2]" />
                  <span>{errors.careerStatus}</span>
                </div>
              )}
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="pt-1">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.985 }}
              disabled={isLoading || (submitted && !isFormValid)}
              className="w-full h-[44px] rounded-[12px] bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white font-semibold text-[13px] tracking-wide shadow-sm shadow-brand-500/20 hover:brightness-105 active:scale-[0.985] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none font-sans"
            >
              {isLoading ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <span>Create My Career Profile →</span>
              )}
            </motion.button>
          </div>

          {/* Social Divider */}
          <div className="relative flex items-center justify-center my-0.5">
            <div className="border-t border-[#E4E7EC] w-full" />
            <span className="bg-transparent px-2.5 text-[10px] text-[#667085] font-normal whitespace-nowrap">
              or continue with
            </span>
            <div className="border-t border-[#E4E7EC] w-full" />
          </div>

          {/* Google SSO Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.985 }}
            onClick={handleGoogleAuth}
            className="w-full h-[40px] rounded-[11px] bg-white hover:bg-slate-50 border border-[#E4E7EC] text-[12px] font-semibold text-[#172033] shadow-2xs transition-all flex items-center justify-center gap-2 active:scale-[0.985] font-sans"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </motion.button>
        </form>

        {/* Bottom Switcher */}
        <div className="w-full text-center text-[10.5px] sm:text-[11px] text-[#667085] pt-1 pb-0.5 font-sans">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setSubmitted(false);
                setApiError(null);
              }}
              className="font-semibold text-[#635BFF] hover:text-[#4338CA] hover:underline transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
