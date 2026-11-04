"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder = "Select an option",
  className,
  containerClassName,
  id,
  ...props
}: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={cn("w-full text-left space-y-1", containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="block font-medium text-[11px] sm:text-[12px] text-[#172033] leading-none mb-1"
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        aria-invalid={!!error}
        className={cn(
          "w-full h-[44px] px-3.5 rounded-[12px] bg-white border text-[13px] font-normal text-[#172033] shadow-2xs transition-all duration-150 focus:outline-none appearance-none cursor-pointer",
          "bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2212%22%20height%3d%2212%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22none%22%20stroke%3d%22%23667085%22%20stroke-width%3d%222.5%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%3e%3cpolyline%20points%3d%226%209%2012%2015%2018%209%22%3e%3c%2fpolyline%3e%3c%2fsvg%3e')]",
          "bg-no-repeat bg-[right_12px_center]",
          "pr-10",
          error
            ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/15"
            : "border-[#E4E7EC] hover:border-[#CBD5E1] focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <div className="flex items-center gap-1 text-[10.5px] text-[#EF4444] font-medium mt-1">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
