"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
  type?: "spinner" | "ai-radar" | "skeleton";
}

export function LoadingState({
  message = "Loading AI recommendations...",
  submessage,
  className,
  type = "ai-radar",
}: LoadingStateProps) {
  if (type === "skeleton") {
    return (
      <div className={cn("w-full space-y-4 animate-pulse", className)}>
        <div className="h-6 bg-slate-200 rounded-lg w-1/3" />
        <div className="h-24 bg-slate-100 rounded-2xl w-full" />
        <div className="h-16 bg-slate-100 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center space-y-4",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Pulsing AI radar rings */}
        <motion.div
          className="absolute w-20 h-20 rounded-full bg-brand-500/15"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-14 h-14 rounded-full bg-brand-500/25"
          animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />

        <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-glow-sm">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-slate-800">{message}</h4>
        {submessage && (
          <p className="text-xs text-slate-500 max-w-xs">{submessage}</p>
        )}
      </div>
    </div>
  );
}
