"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "default" | "pill" | "underline";
  size?: "sm" | "md";
  fullWidth?: boolean;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
  size = "md",
  fullWidth = false,
  className,
}: TabsProps) {
  const sizeStyles = {
    sm: "text-[11px] h-8 px-3 gap-1",
    md: "text-[12.5px] h-9 px-4 gap-1.5",
  };

  if (variant === "pill") {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-[12px] overflow-x-auto no-scrollbar",
          fullWidth && "w-full",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative inline-flex items-center justify-center font-semibold rounded-[10px] transition-all duration-200 whitespace-nowrap select-none",
                sizeStyles[size],
                fullWidth && "flex-1",
                isActive
                  ? "bg-white text-[#172033] shadow-sm"
                  : "text-[#667085] hover:text-[#172033]"
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    isActive
                      ? "bg-[#EEF2FF] text-[#635BFF]"
                      : "bg-slate-200 text-[#667085]"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "underline") {
    return (
      <div
        className={cn(
          "flex items-center border-b border-[#E4E7EC] overflow-x-auto no-scrollbar",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative inline-flex items-center justify-center font-semibold transition-colors duration-200 whitespace-nowrap select-none pb-2.5 border-b-2",
                sizeStyles[size],
                fullWidth && "flex-1",
                isActive
                  ? "text-[#635BFF] border-[#635BFF]"
                  : "text-[#667085] border-transparent hover:text-[#172033]"
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    isActive
                      ? "bg-[#EEF2FF] text-[#635BFF]"
                      : "bg-slate-200 text-[#667085]"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: rounded chip tabs (horizontal scroll)
  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto no-scrollbar pb-1",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "inline-flex items-center font-semibold rounded-full border transition-all duration-200 whitespace-nowrap select-none active:scale-95",
              sizeStyles[size],
              isActive
                ? "bg-[#635BFF] text-white border-[#635BFF] shadow-sm shadow-[#635BFF]/20"
                : "bg-white text-[#667085] border-[#E4E7EC] hover:border-[#A5B4FC] hover:bg-[#EEF2FF]/40"
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-[#667085]"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
