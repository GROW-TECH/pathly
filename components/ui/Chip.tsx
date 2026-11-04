"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChipProps {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  removable?: boolean;
}

export function Chip({
  label,
  selected = false,
  onSelect,
  onRemove,
  icon,
  disabled = false,
  size = "md",
  className,
  removable = false,
}: ChipProps) {
  const sizeStyles = {
    sm: "h-7 px-2.5 text-xs gap-1.5",
    md: "h-9 px-3.5 text-xs sm:text-sm gap-2",
    lg: "h-11 px-4 text-sm sm:text-base gap-2.5",
  };

  const isClickable = !!onSelect && !disabled;

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="inline-flex items-center"
    >
      <div
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={isClickable ? onSelect : undefined}
        onKeyDown={(e) => {
          if (isClickable && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onSelect();
          }
        }}
        className={cn(
          "inline-flex items-center rounded-full font-medium transition-all duration-200 select-none border",
          sizeStyles[size],
          selected
            ? "bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/20"
            : "bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50/40",
          isClickable && "cursor-pointer active:scale-95",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {selected && !removable && (
          <Check className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{label}</span>

        {removable && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={cn(
              "ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors focus:outline-none",
              selected ? "text-white/90 hover:text-white" : "text-slate-400 hover:text-slate-600"
            )}
            aria-label={`Remove ${label}`}
          >
            <X className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
