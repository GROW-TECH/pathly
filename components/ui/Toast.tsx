"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  className?: string;
}

export function Toast({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 2500,
  className,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle2,
      bg: "bg-[#F0FDF4]",
      border: "border-[#BBF7D0]",
      text: "text-[#15803D]",
      iconColor: "text-[#22C55E]",
    },
    error: {
      icon: AlertCircle,
      bg: "bg-[#FEF2F2]",
      border: "border-[#FECACA]",
      text: "text-[#DC2626]",
      iconColor: "text-[#EF4444]",
    },
    info: {
      icon: Info,
      bg: "bg-[#EEF2FF]",
      border: "border-[#C7D2FE]",
      text: "text-[#4338CA]",
      iconColor: "text-[#635BFF]",
    },
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "absolute top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-[14px] border shadow-lg max-w-[90%] sm:max-w-sm",
            currentConfig.bg,
            currentConfig.border,
            className
          )}
        >
          <Icon className={cn("w-4.5 h-4.5 shrink-0 stroke-[2]", currentConfig.iconColor)} />
          <span className={cn("text-[12.5px] font-semibold flex-1", currentConfig.text)}>
            {message}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-0.5 rounded-full hover:bg-black/5 transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5 text-[#667085]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
