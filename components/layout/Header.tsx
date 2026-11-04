"use client";

import React from "react";
import { Bell, Menu } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";

interface HeaderProps {
  variant?: "default" | "greeting" | "back" | "title";
  title?: string;
  greeting?: string;
  subtitle?: string;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  onBackClick?: () => void;
  notificationCount?: number;
  showLogo?: boolean;
  rightElement?: React.ReactNode;
  className?: string;
}

export function Header({
  variant = "default",
  title,
  greeting,
  subtitle,
  onMenuClick,
  onNotificationClick,
  onBackClick,
  notificationCount = 0,
  showLogo = true,
  rightElement,
  className,
}: HeaderProps) {
  if (variant === "greeting") {
    return (
      <header className={cn("w-full px-5 pt-4 pb-3 flex items-center justify-between", className)}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {onMenuClick && (
            <IconButton variant="ghost" size="sm" onClick={onMenuClick}>
              <Menu className="w-5 h-5 stroke-[1.8]" />
            </IconButton>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-[16px] font-bold text-[#172033] truncate">
              {greeting || "Hello! 👋"}
            </h1>
            {subtitle && (
              <p className="text-[11px] text-[#667085] truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {rightElement}
          {onNotificationClick && (
            <IconButton
              variant="default"
              size="sm"
              badge={notificationCount}
              onClick={onNotificationClick}
            >
              <Bell className="w-4 h-4 stroke-[1.8]" />
            </IconButton>
          )}
        </div>
      </header>
    );
  }

  if (variant === "back") {
    return (
      <header className={cn("w-full px-4 pt-4 pb-3 flex items-center gap-3", className)}>
        {onBackClick && (
          <IconButton variant="ghost" size="sm" onClick={onBackClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </IconButton>
        )}
        <h1 className="text-[16px] font-bold text-[#172033] flex-1">{title}</h1>
        <div className="flex items-center gap-1.5 shrink-0">
          {rightElement}
        </div>
      </header>
    );
  }

  if (variant === "title") {
    return (
      <header className={cn("w-full px-5 pt-4 pb-3", className)}>
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-bold text-[#172033] tracking-tight">{title}</h1>
          <div className="flex items-center gap-1.5 shrink-0">
            {rightElement}
            {onNotificationClick && (
              <IconButton
                variant="default"
                size="sm"
                badge={notificationCount}
                onClick={onNotificationClick}
              >
                <Bell className="w-4 h-4 stroke-[1.8]" />
              </IconButton>
            )}
          </div>
        </div>
        {subtitle && (
          <p className="text-[12px] text-[#667085] mt-0.5">{subtitle}</p>
        )}
      </header>
    );
  }

  // Default: logo + actions
  return (
    <header className={cn("w-full px-5 pt-4 pb-3 flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <IconButton variant="ghost" size="sm" onClick={onMenuClick}>
            <Menu className="w-5 h-5 stroke-[1.8]" />
          </IconButton>
        )}
        {showLogo && <Logo size="sm" showAiBadge />}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {rightElement}
        {onNotificationClick && (
          <IconButton
            variant="default"
            size="sm"
            badge={notificationCount}
            onClick={onNotificationClick}
          >
            <Bell className="w-4 h-4 stroke-[1.8]" />
          </IconButton>
        )}
      </div>
    </header>
  );
}
