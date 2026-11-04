"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Brain,
  Compass,
  Code2,
  Layers,
  Search,
  Rocket,
  Target,
  ArrowUpRight,
  BookOpen,
  Check,
} from "lucide-react";

// ==========================================
// 1. SPLASH SCREEN ILLUSTRATION
// Glowing upward career path with floating AI, Skills, Jobs, Growth nodes
// ==========================================
export function SplashCareerHero() {
  return (
    <div className="relative w-full max-w-[320px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Ambient glowing radial aura */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500/25 via-indigo-400/20 to-purple-400/15 blur-3xl"
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-b from-brand-50/90 via-white/95 to-indigo-50/60 border border-brand-100 shadow-card flex items-center justify-center overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#635BFF_1px,transparent_1px)] [background-size:14px_14px]" />

        {/* Dynamic Upward Career S-Curve SVG */}
        <svg
          viewBox="0 0 280 280"
          className="absolute inset-0 w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="splash-glow-path" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#635BFF" stopOpacity="0.2" />
              <stop offset="40%" stopColor="#635BFF" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#818CF8" stopOpacity="1" />
              <stop offset="100%" stopColor="#C7D2FE" stopOpacity="1" />
            </linearGradient>
            <filter id="splash-path-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Central sun glow at career horizon */}
          <circle cx="140" cy="90" r="50" fill="url(#splash-glow-path)" opacity="0.12" />

          {/* Glowing trajectory path drawn upward */}
          <motion.path
            d="M 45 250 C 95 230, 115 170, 140 140 C 165 110, 175 75, 225 45"
            stroke="url(#splash-glow-path)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />

          {/* Trajectory Guide Markers */}
          <circle cx="58" cy="242" r="4" fill="#635BFF" />
          <circle cx="118" cy="168" r="4.5" fill="#4F46E5" />
          <circle cx="162" cy="108" r="5" fill="#635BFF" />
          <circle cx="225" cy="45" r="7" fill="#818CF8" />
          <circle cx="225" cy="45" r="3.5" fill="#FFFFFF" />
        </svg>

        {/* Center AI Intelligence Core */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-glow"
        >
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-brand-600 shadow-inner">
            <Brain className="w-8 h-8 text-brand-600 animate-pulse" />
          </div>
        </motion.div>

        {/* Floating Node: Growth */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute top-7 right-8 bg-white/95 px-3 py-1.5 rounded-xl shadow-card border border-brand-100 flex items-center gap-1.5 z-20"
        >
          <div className="w-4 h-4 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[10px]">
            <TrendingUp className="w-2.5 h-2.5" />
          </div>
          <span className="text-[11px] font-bold text-slate-800">Growth</span>
        </motion.div>

        {/* Floating Node: AI Matched */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="absolute bottom-9 left-6 bg-white/95 px-3 py-1.5 rounded-xl shadow-card border border-brand-100 flex items-center gap-1.5 z-20"
        >
          <div className="w-4 h-4 rounded-md bg-brand-500 text-white flex items-center justify-center text-[10px]">
            <Sparkles className="w-2.5 h-2.5" />
          </div>
          <span className="text-[11px] font-bold text-slate-800">AI Match</span>
        </motion.div>

        {/* Floating Node: Skills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute top-24 left-5 bg-white/95 px-2.5 py-1 rounded-xl shadow-card border border-brand-100 flex items-center gap-1.5 z-20"
        >
          <div className="w-4 h-4 rounded-md bg-indigo-100 text-brand-600 flex items-center justify-center">
            <GraduationCap className="w-2.5 h-2.5" />
          </div>
          <span className="text-[10px] font-semibold text-slate-700">Skills</span>
        </motion.div>

        {/* Floating Node: Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="absolute bottom-16 right-5 bg-white/95 px-2.5 py-1 rounded-xl shadow-card border border-brand-100 flex items-center gap-1.5 z-20"
        >
          <div className="w-4 h-4 rounded-md bg-blue-500 text-white flex items-center justify-center">
            <Briefcase className="w-2.5 h-2.5" />
          </div>
          <span className="text-[10px] font-semibold text-slate-700">Jobs</span>
        </motion.div>
      </div>
    </div>
  );
}

// ==========================================
// 2. ONBOARDING SCREEN 1 ILLUSTRATION
// Young professional discovering multiple career paths & AI recommendations
// ==========================================
export function Onboarding1Illustration() {
  return (
    <div className="relative w-full max-w-[340px] aspect-[4/3] mx-auto flex items-center justify-center select-none">
      <div className="absolute inset-0 bg-brand-500/10 rounded-3xl blur-2xl" />

      <div className="relative w-full h-full rounded-3xl bg-gradient-to-b from-white via-indigo-50/40 to-slate-50 border border-brand-100/80 p-4 sm:p-5 shadow-card flex flex-col justify-between overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-brand-100/60 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Card: AI Radar Scanner */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-sm">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Career Discovery Radar</p>
              <p className="text-[10px] text-slate-500">2,400+ paths analyzed</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
            98% Accuracy
          </span>
        </div>

        {/* Discovered Path Nodes */}
        <div className="space-y-2.5 my-auto py-1">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-brand-200/90 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-sm shadow-inner">
                💻
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Frontend Engineer</p>
                <p className="text-[10px] text-slate-500">High Growth • $115k avg</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                Top Match
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
                🤖
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">AI & Machine Learning</p>
                <p className="text-[10px] text-slate-400">Emerging • High Demand</p>
              </div>
            </div>
            <span className="text-[10px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              92% Match
            </span>
          </motion.div>
        </div>

        {/* Footer info pill */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            Personalized to your unique strengths
          </span>
          <span className="font-bold text-brand-600">Explore →</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. ONBOARDING SCREEN 2 ILLUSTRATION
// Current Skills → AI Analysis → Skill Gap → Learning Path → Career Goal
// ==========================================
export function Onboarding2Illustration() {
  return (
    <div className="relative w-full max-w-[340px] aspect-[4/3] mx-auto flex items-center justify-center select-none">
      <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-2xl" />

      <div className="relative w-full h-full rounded-3xl bg-gradient-to-b from-white via-indigo-50/30 to-slate-50 border border-indigo-100/80 p-4 sm:p-5 shadow-card flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Skill Gap Analyzer</p>
              <p className="text-[10px] text-slate-500">Target: Senior Engineer</p>
            </div>
          </div>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
            4 / 5 Ready
          </span>
        </div>

        {/* Skill Matrix Grid */}
        <div className="grid grid-cols-2 gap-2 my-auto py-1">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800">React & Next.js</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[95%]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800">TypeScript</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[85%]" />
            </div>
          </motion.div>

          {/* AI Recommended Gap Bridge */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="col-span-2 p-2.5 rounded-2xl bg-gradient-to-r from-brand-50 to-indigo-50/80 border border-brand-200 shadow-sm flex flex-col gap-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                <span className="text-[11px] font-bold text-brand-900">
                  Recommended: System Design Patterns
                </span>
              </div>
              <span className="text-[9px] font-bold text-brand-700 bg-brand-100/90 px-2 py-0.5 rounded-full">
                Next Up
              </span>
            </div>
            <p className="text-[10px] text-slate-600">
              Closes your remaining 15% skill gap to unlock Senior roles.
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            Bite-sized adaptive learning modules
          </span>
          <span className="font-bold text-indigo-600">Start Track</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. ONBOARDING SCREEN 3 ILLUSTRATION
// Learn → Practice → Interview → Job → Growth milestone
// ==========================================
export function Onboarding3Illustration() {
  return (
    <div className="relative w-full max-w-[340px] aspect-[4/3] mx-auto flex items-center justify-center select-none">
      <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-2xl" />

      <div className="relative w-full h-full rounded-3xl bg-gradient-to-b from-white via-emerald-50/30 to-slate-50 border border-emerald-100/80 p-4 sm:p-5 shadow-card flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Interview & Placement</p>
              <p className="text-[10px] text-slate-500">AI Mock Practice & Offer Ready</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-bold border border-brand-200">
            Interview Ready
          </span>
        </div>

        {/* 5-Stage Career Path Progress */}
        <div className="my-auto py-2">
          <div className="relative flex items-center justify-between px-1">
            {/* Horizontal timeline bar */}
            <div className="absolute top-1/2 left-3 right-3 h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
            <div className="absolute top-1/2 left-3 w-4/5 h-1 bg-gradient-to-r from-brand-500 to-emerald-500 -translate-y-1/2 z-0 rounded-full" />

            {[
              { label: "Learn", icon: "📚", active: true },
              { label: "Practice", icon: "🎙️", active: true },
              { label: "Apply", icon: "📨", active: true },
              { label: "Offer", icon: "🎉", active: true },
              { label: "Grow", icon: "🚀", active: false },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.08 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs shadow-sm border ${
                    step.active
                      ? "bg-white border-brand-500 ring-2 ring-brand-100 text-slate-900 font-bold"
                      : "bg-slate-100 border-slate-300 text-slate-400"
                  }`}
                >
                  <span>{step.icon}</span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold text-slate-700 mt-1">
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Matched Job Offer Card */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-2.5 rounded-2xl bg-white border border-emerald-200 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-900">TechCorp Solutions</p>
              <p className="text-[9px] text-slate-500">Full-time • $120k • 98% AI Match</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Hired!
          </span>
        </motion.div>
      </div>
    </div>
  );
}
