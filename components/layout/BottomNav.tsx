"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Home,
  BriefcaseBusiness,
  BookOpen,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavTabId = "home" | "jobs" | "learn" | "ai" | "profile";

interface BottomNavProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  className?: string;
}

const NAV_ITEMS: { id: NavTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "jobs", label: "Jobs", icon: BriefcaseBusiness },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "ai", label: "AI", icon: Sparkles },
  { id: "profile", label: "Profile", icon: User },
];

export function BottomNav({ activeTab, onTabChange, className }: BottomNavProps) {
  return (
    <nav
      className={cn(
        "sticky bottom-0 z-40 w-full bg-white/95 backdrop-blur-lg border-t border-[#E8E5F2] px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] select-none",
        className
      )}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 min-w-[52px] rounded-xl transition-all duration-200",
                isActive
                  ? "text-[#635BFF]"
                  : "text-[#94A3B8] hover:text-[#64748B]"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-[22px] h-[22px] transition-all duration-200",
                    isActive ? "stroke-[2.2]" : "stroke-[1.6]"
                  )}
                />
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#635BFF]"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] leading-none transition-all duration-200",
                  isActive ? "font-bold" : "font-medium"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
