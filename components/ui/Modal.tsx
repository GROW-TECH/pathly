"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  showCloseButton = true,
  className,
  contentClassName,
}: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    full: "max-w-full h-full rounded-none sm:rounded-[20px] sm:max-w-lg sm:h-auto sm:max-h-[90vh]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={cn("absolute inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden pointer-events-auto", className)}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 0.68, 0, 1] }}
            className={cn(
              "relative w-full bg-white rounded-t-[20px] sm:rounded-[20px] shadow-2xl overflow-hidden",
              sizeStyles[size],
              contentClassName
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between p-4 pb-0">
                <div className="flex-1 min-w-0">
                  {title && (
                    <h3 className="text-[16px] font-bold text-[#172033] tracking-tight">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="text-[12px] text-[#667085] mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 -mr-1 rounded-full hover:bg-slate-100 text-[#667085] hover:text-[#172033] transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4.5 h-4.5 stroke-[2]" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-4 overflow-y-auto no-scrollbar max-h-[70vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
