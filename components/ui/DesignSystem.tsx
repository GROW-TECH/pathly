"use client";

import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

/**
 * ============================================================================
 * PATHLY GLOBAL DESIGN TOKENS
 * ============================================================================
 */

export const PathlyColors = {
  primary: "#635BFF",
  primaryHover: "#4F46E5",
  secondary: "#8B5CF6",
  primaryGradient: "linear-gradient(90deg, #635BFF 0%, #8B5CF6 100%)",
  background: "#F8FAFF",
  surface: "#FFFFFF",
  lavenderLight: "#EEF2FF",
  lavenderSoft: "#F5F3FF",
  textPrimary: "#172033",
  textSecondary: "#667085",
  border: "#E4E7EC",
  borderFocus: "#635BFF",
  error: "#EF4444",
  errorLight: "#FEF2F2",
  success: "#22C55E",
  successLight: "#F0FDF4",
} as const;

export const PathlyTypography = {
  fontFamily: "var(--font-inter), 'Inter', -apple-system, sans-serif",
  heading: "font-bold text-[22px] sm:text-[24px] text-[#172033] tracking-tight leading-tight",
  sectionHeading: "font-semibold text-[15px] sm:text-[16px] text-[#172033] tracking-tight",
  body: "font-normal text-[13px] text-[#172033] leading-relaxed",
  label: "font-medium text-[11px] sm:text-[12px] text-[#172033] leading-none",
  button: "font-semibold text-[13px] sm:text-[14px] text-white tracking-wide",
  small: "font-normal text-[11px] sm:text-[12px] text-[#667085] leading-normal",
  caption: "font-normal text-[10px] text-[#667085] leading-none",
  error: "font-medium text-[10px] sm:text-[11px] text-[#EF4444] leading-none",
} as const;

/**
 * ============================================================================
 * PATHLY LABEL COMPONENT
 * ============================================================================
 */
export interface PathlyLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export function PathlyLabel({ children, className, required, ...props }: PathlyLabelProps) {
  return (
    <label
      className={cn(
        "block font-medium text-[11px] sm:text-[12px] text-[#172033] leading-none mb-1 text-left",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-[#EF4444] ml-0.5">*</span>}
    </label>
  );
}

/**
 * ============================================================================
 * PATHLY ERROR COMPONENT
 * ============================================================================
 */
export interface PathlyErrorProps {
  message?: string;
  className?: string;
}

export function PathlyError({ message, className }: PathlyErrorProps) {
  if (!message) return null;
  return (
    <div className={cn("flex items-center gap-1 text-[10.5px] text-[#EF4444] font-medium mt-1 leading-none text-left", className)}>
      <LucideIcons.AlertCircle className="w-3 h-3 shrink-0 stroke-[2.2]" />
      <span>{message}</span>
    </div>
  );
}

/**
 * ============================================================================
 * PATHLY INPUT COMPONENT
 * ============================================================================
 */
export interface PathlyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  countryCode?: string;
  isPassword?: boolean;
  containerClassName?: string;
}

export const PathlyInput = forwardRef<HTMLInputElement, PathlyInputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightElement,
      countryCode,
      isPassword = false,
      type = "text",
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={cn("w-full text-left space-y-1", containerClassName)}>
        {label && <PathlyLabel htmlFor={inputId}>{label}</PathlyLabel>}

        <div className="relative flex items-center w-full">
          {/* Left Country Code Pill if specified */}
          {countryCode ? (
            <div className="absolute left-1.5 flex items-center gap-1 pl-2 pr-1.5 py-1 bg-[#EEF2FF] rounded-[8px] border border-[#E4E7EC] text-[#172033] text-[11px] font-semibold pointer-events-none select-none z-10">
              <span>{countryCode}</span>
            </div>
          ) : leftIcon ? (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#667085] z-10">
              {leftIcon}
            </div>
          ) : null}

          <input
            id={inputId}
            ref={ref}
            type={inputType}
            aria-invalid={!!error}
            className={cn(
              "w-full h-[44px] px-3.5 rounded-[12px] bg-[#FFFFFF] border text-[13px] font-normal text-[#172033] placeholder:text-[#667085]/60 placeholder:text-[12px] shadow-2xs transition-all duration-150 focus:outline-none",
              error
                ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/15 bg-[#FEF2F2]/20"
                : "border-[#E4E7EC] hover:border-[#CBD5E1] focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15",
              countryCode ? "pl-[62px]" : leftIcon ? "pl-10" : "pl-3.5",
              isPassword || rightElement ? "pr-10" : "pr-3.5",
              className
            )}
            {...props}
          />

          {/* Right Action (Password Show/Hide or Custom Element) */}
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 p-1 text-[#667085] hover:text-[#172033] transition-colors"
            >
              {showPassword ? (
                <LucideIcons.EyeOff className="w-4 h-4 stroke-[1.8]" />
              ) : (
                <LucideIcons.Eye className="w-4 h-4 stroke-[1.8]" />
              )}
            </button>
          ) : rightElement ? (
            <div className="absolute right-3 flex items-center">{rightElement}</div>
          ) : null}
        </div>

        {error && <PathlyError message={error} />}
      </div>
    );
  }
);

PathlyInput.displayName = "PathlyInput";

/**
 * ============================================================================
 * PATHLY BUTTON COMPONENT
 * ============================================================================
 */
export interface PathlyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "google" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function PathlyButton({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className,
  disabled,
  ...props
}: PathlyButtonProps) {
  const sizeClasses = {
    sm: "h-[38px] px-3.5 rounded-[12px] text-[12px]",
    md: "h-[44px] px-4 rounded-[12px] text-[13px]",
    lg: "h-[48px] px-5 rounded-[14px] text-[14px]",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white font-semibold shadow-md shadow-brand-500/25 hover:brightness-105 active:scale-[0.99] border-0",
    secondary:
      "bg-[#EEF2FF] text-[#4338CA] font-semibold border border-[#C7D2FE] hover:bg-[#E0E7FF] active:scale-[0.99]",
    outline:
      "bg-white text-[#172033] font-semibold border border-[#E4E7EC] hover:bg-slate-50 hover:border-slate-300 shadow-2xs active:scale-[0.99]",
    google:
      "bg-white text-[#172033] font-semibold border border-[#E4E7EC] hover:bg-slate-50 shadow-2xs active:scale-[0.99]",
    ghost:
      "bg-transparent text-[#635BFF] font-semibold hover:bg-[#EEF2FF]/50 active:scale-[0.99]",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.985 }}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all font-sans select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && "w-full",
        className
      )}
      {...(props as HTMLMotionProps<"button">)}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}

/**
 * ============================================================================
 * PATHLY CARD & GLASS COMPONENT
 * ============================================================================
 */
export interface PathlyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "selectable";
  isSelected?: boolean;
}

export function PathlyCard({
  children,
  variant = "default",
  isSelected = false,
  className,
  ...props
}: PathlyCardProps) {
  return (
    <div
      className={cn(
        "rounded-[14px] transition-all",
        variant === "default" && "bg-white border border-[#E4E7EC] shadow-2xs p-3.5",
        variant === "glass" && "bg-white/90 backdrop-blur-md border border-[#E4E7EC] shadow-sm p-4",
        variant === "selectable" &&
          (isSelected
            ? "bg-[#EEF2FF] border-2 border-[#635BFF] text-[#4338CA] shadow-2xs"
            : "bg-white border border-[#E4E7EC] text-[#172033] hover:bg-slate-50"),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * ============================================================================
 * PATHLY ICON WRAPPER
 * ============================================================================
 */
export interface PathlyIconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function PathlyIcon({
  name,
  size = 18,
  className,
  strokeWidth = 2,
}: PathlyIconProps) {
  const IconComponent = LucideIcons[name] as React.ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>;

  if (!IconComponent) return null;
  return <IconComponent size={size} strokeWidth={strokeWidth} className={className} />;
}

/**
 * ============================================================================
 * PATHLY PROGRESS BAR
 * ============================================================================
 */
export function PathlyProgress({
  value,
  max = 100,
  className,
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full h-1.5 bg-[#E4E7EC] rounded-full overflow-hidden", className)}>
      <motion.div
        className="h-full bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}
