"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "brand";
  size?: "sm" | "md" | "lg";
  badge?: number;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = "ghost",
      size = "md",
      badge,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default:
        "bg-white border border-[#E4E7EC] text-[#667085] hover:text-[#172033] hover:bg-slate-50 shadow-2xs",
      ghost:
        "text-[#667085] hover:text-[#172033] hover:bg-slate-100",
      outline:
        "border border-[#E4E7EC] text-[#667085] hover:text-[#172033] hover:border-[#CBD5E1] bg-transparent",
      brand:
        "bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] border border-[#C7D2FE]",
    };

    const sizeStyles = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          "relative inline-flex items-center justify-center rounded-[10px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF] focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-95 select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}

        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-[#EF4444] text-white text-[9px] font-bold px-1 shadow-sm">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
