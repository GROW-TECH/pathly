"use client";

import React, { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
  containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
          <Search className="w-4 h-4 stroke-[1.8]" />
        </div>

        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            "w-full h-[44px] pl-10 pr-9 rounded-[12px] bg-white border border-[#E4E7EC] text-[13px] font-normal text-[#172033]",
            "placeholder:text-[#667085]/60 placeholder:text-[12px]",
            "shadow-2xs transition-all duration-150",
            "focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15",
            "hover:border-[#CBD5E1]",
            className
          )}
          {...props}
        />

        {value && String(value).length > 0 && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#667085] hover:text-[#172033] transition-colors rounded-full hover:bg-slate-100"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
