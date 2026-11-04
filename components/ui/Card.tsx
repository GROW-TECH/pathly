"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass" | "interactive" | "selected";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "rounded-2xl transition-all duration-200 overflow-hidden";

    const variantStyles = {
      default: "bg-white border border-slate-100 shadow-card",
      elevated: "bg-white border border-slate-100/80 shadow-card-hover",
      glass: "glass-card",
      interactive:
        "bg-white border border-slate-200/80 shadow-card hover:border-brand-300 hover:shadow-card-hover cursor-pointer active:scale-[0.99]",
      selected:
        "bg-brand-50/60 border-2 border-brand-500 shadow-glow-sm relative",
    };

    const paddingStyles = {
      none: "p-0",
      sm: "p-3.5 sm:p-4",
      md: "p-5 sm:p-6",
      lg: "p-6 sm:p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
