"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  showLabels?: boolean;
  className?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepLabels,
  showLabels = false,
  className,
}: ProgressIndicatorProps) {
  const progressPercent = Math.min(
    100,
    Math.max(0, (currentStep / totalSteps) * 100)
  );

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span className="text-brand-600 font-bold">
          Step {currentStep} <span className="text-slate-400 font-normal">of {totalSteps}</span>
        </span>
        <span className="text-slate-400">
          {Math.round(progressPercent)}% completed
        </span>
      </div>

      {/* Main track */}
      <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        />
      </div>

      {/* Optional Step Dots / Markers */}
      {showLabels && stepLabels && (
        <div className="flex justify-between pt-2">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div
                key={i}
                className="flex flex-col items-center flex-1 text-center"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200",
                    isCompleted
                      ? "bg-brand-500 text-white"
                      : isCurrent
                      ? "border-2 border-brand-500 text-brand-600 bg-white"
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    stepNum
                  )}
                </div>
                {stepLabels[i] && (
                  <span
                    className={cn(
                      "text-[11px] mt-1 font-medium max-w-[70px] truncate",
                      isCurrent
                        ? "text-brand-700 font-semibold"
                        : "text-slate-400"
                    )}
                  >
                    {stepLabels[i]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
