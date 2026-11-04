"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BriefcaseBusiness,
  BookOpen,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Bookmark,
  HelpCircle,
  LogOut,
  X,
  MessageSquare,
  Crown,
  FileText,
  Target,
  Video,
  Award,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  currentRoute?: string;
}

const MENU_ITEMS = [
  { id: "home", label: "Home", icon: Home, route: "/dashboard" },
  { id: "jobs", label: "My Jobs", icon: BriefcaseBusiness, route: "/jobs" },
  { id: "learn", label: "My Learning", icon: GraduationCap, route: "/learn" },
  { id: "mentor", label: "1-on-1 Mentor (Meet)", icon: Video, route: "/mentor-connect" },
  { id: "ai", label: "AI Assistant", icon: Sparkles, route: "/ai-coach" },
  { id: "interview", label: "Interview Prep", icon: MessageSquare, route: "/interview-prep" },
  { id: "interview_debrief", label: "Real Interview AI Debrief", icon: Award, route: "/interview-debrief" },
  { id: "growth", label: "Career Growth & Promotion", icon: TrendingUp, route: "/career-progress" },
  { id: "resume", label: "Resume ATS Scanner", icon: FileText, route: "/resume-scanner" },
  { id: "skill_gap", label: "Skill Gap Analysis", icon: Target, route: "/skill-gap" },
  { id: "pricing", label: "Pathly Pro (Pricing)", icon: Crown, route: "/subscription" },
  { id: "saved", label: "Saved Jobs", icon: Bookmark, route: "/applications?tab=saved" },
  { id: "help", label: "Help & Support", icon: HelpCircle, route: "/help" },
];

export function SideMenu({
  isOpen,
  onClose,
  onNavigate,
  onLogout,
  userName = "User",
  userEmail = "user@pathly.ai",
  currentRoute,
}: SideMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 overflow-hidden pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col select-none"
          >
            {/* Header: User Info */}
            <div className="p-5 pb-4 border-b border-[#E8E5F2]">
              <div className="flex items-start justify-between mb-4">
                <Logo size="sm" showAiBadge />
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-[#667085] hover:text-[#172033] transition-colors -mr-1"
                  aria-label="Close menu"
                >
                  <X className="w-4.5 h-4.5 stroke-[2]" />
                </button>
              </div>

              {/* User Card */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#635BFF] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#172033] truncate">{userName}</p>
                  <p className="text-[11px] text-[#667085] truncate">{userEmail}</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-3">
              <div className="space-y-0.5">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.route;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.route);
                        onClose();
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-[13px] font-semibold transition-all text-left",
                        isActive
                          ? "bg-[#F1EFFF] text-[#6D5DF5]"
                          : "text-[#667085] hover:text-[#172033] hover:bg-[#F7F5FF]"
                      )}
                    >
                      <Icon className={cn("w-4.5 h-4.5", isActive ? "text-[#6D5DF5]" : "text-[#667085]")} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Footer: Logout */}
            <div className="p-3 border-t border-[#E8E5F2]">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onLogout) {
                    onLogout();
                  } else {
                    onNavigate("/login");
                  }
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-all text-left"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>Log Out</span>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
