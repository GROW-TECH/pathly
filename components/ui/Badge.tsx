"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "lavender" | "success" | "warning" | "neutral" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "brand",
  size = "md",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    brand: "bg-brand-50 text-brand-600 border border-brand-200/70",
    lavender: "bg-indigo-50/80 text-indigo-700 border border-indigo-100",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200",
    outline: "bg-transparent text-slate-700 border border-slate-300",
  };

  const dotColors = {
    brand: "bg-brand-500",
    lavender: "bg-indigo-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    neutral: "bg-slate-400",
    outline: "bg-slate-400",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-medium rounded-md gap-1.5",
    md: "px-2.5 py-1 text-xs font-semibold rounded-lg gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center select-none shrink-0",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}
