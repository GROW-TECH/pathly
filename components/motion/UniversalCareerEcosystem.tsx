"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  Landmark,
  GraduationCap,
  HeartPulse,
  IndianRupee,
  Network,
  Cog,
  Briefcase,
  Palette,
  Handshake,
  Wrench,
} from "lucide-react";

interface CareerNode {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  x: number; // percentage in overlay container (0-100)
  y: number; // percentage in overlay container (0-100)
  color: string;
  bgGlow: string;
  borderCol: string;
  delay: number;
  floatDuration: number;
}

const CAREER_NODES: CareerNode[] = [
  {
    id: "healthcare",
    name: "Healthcare",
    category: "Medical & Health",
    icon: HeartPulse,
    x: 52,
    y: 12,
    color: "text-rose-500",
    bgGlow: "rgba(244, 63, 94, 0.15)",
    borderCol: "border-rose-200/80",
    delay: 0.25,
    floatDuration: 3.4,
  },
  {
    id: "education",
    name: "Education",
    category: "Teaching & Academics",
    icon: GraduationCap,
    x: 74,
    y: 11,
    color: "text-amber-500",
    bgGlow: "rgba(245, 158, 11, 0.15)",
    borderCol: "border-amber-200/80",
    delay: 0.32,
    floatDuration: 3.8,
  },
  {
    id: "govt",
    name: "Public Service",
    category: "Government & Civic",
    icon: Landmark,
    x: 91,
    y: 22,
    color: "text-indigo-600",
    bgGlow: "rgba(99, 102, 241, 0.15)",
    borderCol: "border-indigo-200/80",
    delay: 0.38,
    floatDuration: 4.1,
  },
  {
    id: "finance",
    name: "Finance",
    category: "Banking & Wealth",
    icon: IndianRupee,
    x: 90,
    y: 39,
    color: "text-emerald-600",
    bgGlow: "rgba(16, 185, 129, 0.15)",
    borderCol: "border-emerald-200/80",
    delay: 0.44,
    floatDuration: 3.5,
  },
  {
    id: "technology",
    name: "Technology",
    category: "Digital & Network",
    icon: Network,
    x: 84,
    y: 56,
    color: "text-sky-500",
    bgGlow: "rgba(14, 165, 233, 0.18)",
    borderCol: "border-sky-300/90",
    delay: 0.5,
    floatDuration: 3.2,
  },
  {
    id: "engineering",
    name: "Engineering",
    category: "Core & Systems",
    icon: Cog,
    x: 68,
    y: 63,
    color: "text-violet-600",
    bgGlow: "rgba(139, 92, 246, 0.15)",
    borderCol: "border-violet-200/80",
    delay: 0.56,
    floatDuration: 4.2,
  },
  {
    id: "business",
    name: "Business",
    category: "Management & Growth",
    icon: Briefcase,
    x: 48,
    y: 56,
    color: "text-blue-600",
    bgGlow: "rgba(37, 99, 235, 0.15)",
    borderCol: "border-blue-200/80",
    delay: 0.62,
    floatDuration: 3.6,
  },
  {
    id: "creative",
    name: "Design",
    category: "Creative & Media",
    icon: Palette,
    x: 37,
    y: 42,
    color: "text-fuchsia-500",
    bgGlow: "rgba(217, 70, 239, 0.15)",
    borderCol: "border-fuchsia-200/80",
    delay: 0.68,
    floatDuration: 3.9,
  },
  {
    id: "service",
    name: "Customer & Sales",
    category: "People & Relations",
    icon: Handshake,
    x: 39,
    y: 25,
    color: "text-orange-500",
    bgGlow: "rgba(249, 115, 22, 0.15)",
    borderCol: "border-orange-200/80",
    delay: 0.74,
    floatDuration: 4.0,
  },
  {
    id: "skilled",
    name: "Technical Work",
    category: "Applied Skills",
    icon: Wrench,
    x: 62,
    y: 2,
    color: "text-teal-600",
    bgGlow: "rgba(13, 148, 136, 0.15)",
    borderCol: "border-teal-200/80",
    delay: 0.8,
    floatDuration: 3.7,
  },
];

// Central AI Hub position in container coordinates (%)
const AI_CENTER = { x: 65, y: 36 };

export function UniversalCareerEcosystem() {
  const [activeNode, setActiveNode] = useState<string>("technology");

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 1. Base Woman Visual Layer with Clean Background */}
      <Image
        src="/images/onboarding2-clean.jpg"
        alt="Pathly AI Career Discovery"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 430px"
        className="object-cover object-top"
      />

      {/* 2. Soft Ambient Luminous Gradient Light Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EDE9FE]/15 to-[#E0E7FF]/30 pointer-events-none" />

      {/* 3. The Interactive Radial AI Career Ecosystem Overlay (Upper Right region) */}
      <div className="absolute top-[6%] right-[1%] w-[88%] sm:w-[78%] max-w-[360px] aspect-[1/1] z-10 pointer-events-auto">
        {/* SVG Glowing Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Soft subtle connection line gradient */}
            <linearGradient id="subtleLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.25" />
            </linearGradient>

            {/* Glowing Active Path Gradient */}
            <linearGradient id="activePathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="1" />
            </linearGradient>

            {/* Glowing Soft Filter */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Render Organic Curved Connection Lines to Each Career Node */}
          {CAREER_NODES.map((node) => {
            const isTarget = node.id === activeNode;
            // Gentle curved bezier control point
            const midX = (AI_CENTER.x + node.x) / 2 + (node.y > AI_CENTER.y ? 2.5 : -2.5);
            const midY = (AI_CENTER.y + node.y) / 2 + (node.x > AI_CENTER.x ? -2.5 : 2.5);
            const pathD = `M ${AI_CENTER.x} ${AI_CENTER.y} Q ${midX} ${midY} ${node.x} ${node.y}`;

            return (
              <g key={`path-${node.id}`}>
                {/* Base Connection Line */}
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke={isTarget ? "url(#activePathGrad)" : "url(#subtleLineGrad)"}
                  strokeWidth={isTarget ? "2" : "0.9"}
                  strokeDasharray={isTarget ? "none" : "2.5,2.5"}
                  filter={isTarget ? "url(#softGlow)" : undefined}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: node.delay, ease: "easeOut" }}
                />

                {/* Animated Flowing Energy Pulse along the Highlighted Path */}
                {isTarget && (
                  <motion.circle
                    r="1.5"
                    fill="#38BDF8"
                    filter="url(#softGlow)"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    style={{
                      offsetPath: `path('${pathD}')`,
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Central Small Elegant Glass Circle: ✦ AI */}
        <motion.div
          style={{
            left: `${AI_CENTER.x}%`,
            top: `${AI_CENTER.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 24,
            delay: 0.15,
          }}
          className="absolute z-20"
        >
          <div className="relative group cursor-pointer flex flex-col items-center">
            {/* Ambient Pulse Ring */}
            <motion.div
              animate={{ scale: [1, 1.28, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-400 to-indigo-300 blur-xs -z-10"
            />

            {/* Central Glass Node */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-xl border border-indigo-200/90 shadow-[0_4px_18px_rgba(99,102,241,0.24)] flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95">
              <div className="flex items-center justify-center text-brand-600">
                <Sparkles className="w-4 h-4 text-brand-600 fill-brand-500/20 stroke-[2.2] animate-pulse" />
              </div>
              <span className="text-[7.5px] font-black tracking-tight text-slate-800 uppercase leading-none mt-0.5">
                ✦ AI
              </span>
            </div>
          </div>
        </motion.div>

        {/* 8-10 Universal Career Icon Nodes */}
        {CAREER_NODES.map((node) => {
          const Icon = node.icon;
          const isActive = node.id === activeNode;

          return (
            <motion.div
              key={node.id}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, -3.5, 0],
              }}
              transition={{
                scale: {
                  type: "spring",
                  stiffness: 320,
                  damping: 26,
                  delay: node.delay,
                },
                opacity: { duration: 0.3, delay: node.delay },
                y: {
                  duration: node.floatDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: node.delay * 0.5,
                },
              }}
              className="absolute z-20 cursor-pointer"
              onClick={() => setActiveNode(node.id)}
            >
              {/* Glass Circle Icon Container (34-40px) */}
              <div className="relative group flex flex-col items-center">
                {/* Highlight Glow for active/selected path */}
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                    className="absolute -inset-1 rounded-full bg-sky-400/30 blur-xs -z-10"
                  />
                )}

                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-white/95 backdrop-blur-xl border-2 border-sky-400 shadow-[0_4px_16px_rgba(14,165,233,0.3)] scale-110"
                      : "bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_3px_10px_rgba(0,0,0,0.05)] hover:bg-white hover:scale-105 hover:shadow-[0_4px_14px_rgba(99,102,241,0.15)]"
                  }`}
                  style={{
                    backgroundColor: isActive ? "rgba(255,255,255,0.96)" : undefined,
                  }}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.8] transition-colors duration-200 ${
                      isActive ? "text-sky-600 scale-105" : node.color
                    }`}
                  />
                </div>

                {/* Minimal Subtle Label on Hover/Tap */}
                <div
                  className={`absolute -bottom-4.5 px-1.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xs text-[7.5px] font-bold text-slate-700 whitespace-nowrap transition-all duration-200 pointer-events-none ${
                    isActive
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                  }`}
                >
                  {node.name}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
