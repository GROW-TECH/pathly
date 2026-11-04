"use client";

import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "soft" | "glow";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none";

    const variantStyles = {
      primary:
        "bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:bg-brand-700 shadow-brand-500/25",
      secondary:
        "bg-brand-700 text-white shadow-sm hover:bg-brand-800 active:bg-brand-900",
      outline:
        "border border-slate-200 bg-white text-content-primary hover:bg-slate-50 hover:border-slate-300 shadow-sm",
      ghost:
        "text-content-secondary hover:text-content-primary hover:bg-slate-100",
      soft:
        "bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-100",
      glow:
        "bg-brand-500 text-white shadow-glow hover:shadow-brand-500/40 hover:bg-brand-600",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs gap-1.5 font-semibold",
      md: "h-11 px-5 text-sm gap-2 font-semibold",
      lg: "h-13 px-6 text-base gap-2.5 font-bold py-3.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2 text-current" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
