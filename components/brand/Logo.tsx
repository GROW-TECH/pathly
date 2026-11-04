"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  showAiBadge?: boolean;
  tagline?: string;
  className?: string;
  animate?: boolean;
  variant?: "full" | "icon" | "stacked";
}

export function Logo({
  size = "md",
  showTagline = false,
  showAiBadge = false,
  tagline = "Your Career. Smarter.",
  className,
  animate = false,
  variant = "full",
}: LogoProps) {
  const sizeMap = {
    sm: { container: "w-8 h-8 rounded-[9px]", iconSize: 18, text: "text-[17px]", tag: "text-[10px]" },
    md: { container: "w-9.5 h-9.5 rounded-[11px]", iconSize: 22, text: "text-[22px]", tag: "text-xs" },
    lg: { container: "w-12 h-12 rounded-[14px]", iconSize: 28, text: "text-3xl", tag: "text-sm" },
    xl: { container: "w-16 h-16 rounded-[18px]", iconSize: 38, text: "text-4xl", tag: "text-base" },
  };

  const currentSize = sizeMap[size];

  // Robust, high-contrast Pathly Logo Mark
  const IconSvg = (
    <div
      className={cn(
        "relative flex items-center justify-center bg-gradient-to-tr from-[#5146C7] via-[#635BFF] to-[#7467F5] shadow-sm text-white shrink-0",
        currentSize.container
      )}
    >
      <svg
        width={currentSize.iconSize}
        height={currentSize.iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-xs"
      >
        {/* Stylized Pathly P Loop and Career Acceleration Path */}
        <path
          d="M5.5 3.5H13.5C17.0899 3.5 20 6.41015 20 10C20 13.5899 17.0899 16.5 13.5 16.5H9.5V20.5C9.5 21.0523 9.05228 21.5 8.5 21.5C7.94772 21.5 7.5 21.0523 7.5 20.5V5.5C7.5 4.39543 6.60457 3.5 5.5 3.5Z"
          fill="white"
          fillOpacity="0.95"
        />
        <path
          d="M9.5 7.5H13.5C14.8807 7.5 16 8.61929 16 10C16 11.3807 14.8807 12.5 13.5 12.5H9.5V7.5Z"
          fill="#5146C7"
        />
        <circle cx="18" cy="4" r="1.5" fill="#A7F3D0" />
      </svg>
    </div>
  );

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 select-none",
        variant === "stacked" && "flex-col text-center gap-2",
        className
      )}
    >
      {animate ? (
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {IconSvg}
        </motion.div>
      ) : (
        IconSvg
      )}

      {variant !== "icon" && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-bold tracking-tight text-[#18152B] font-sans leading-none",
                currentSize.text
              )}
            >
              Pathly
            </span>
            {showAiBadge && (
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9.5px] font-bold bg-[#F1EFFF] text-[#6D5DF5] border border-[#E8E5F2]">
                AI
              </span>
            )}
          </div>

          {showTagline && (
            <span
              className={cn(
                "font-medium text-[#667085] tracking-normal pt-0.5",
                currentSize.tag
              )}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
