"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Briefcase,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Sparkles,
  Trash2,
  Check,
} from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";

interface NotificationsScreenProps {
  onBack?: () => void;
  onNotificationClick?: (type: string, id: string) => void;
}

interface NotificationItem {
  id: string;
  type: "job" | "learning" | "interview" | "application" | "system";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionRoute?: string;
  actionId?: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    type: "job",
    title: "New Job Match!",
    message: "Frontend Developer at Google matches 92% of your profile.",
    time: "2 hours ago",
    isRead: false,
    actionRoute: "jobs",
    actionId: "job-1",
  },
  {
    id: "n2",
    type: "interview",
    title: "Interview Reminder",
    message: "Your technical round with Google is scheduled for tomorrow at 10:00 AM.",
    time: "5 hours ago",
    isRead: false,
    actionRoute: "applications",
  },
  {
    id: "n3",
    type: "learning",
    title: "Continue Learning",
    message: "You're 35% through Web Development Bootcamp. Keep going! 💪",
    time: "1 day ago",
    isRead: true,
    actionRoute: "learn",
    actionId: "course-1",
  },
  {
    id: "n4",
    type: "application",
    title: "Application Update",
    message: "Your application to Microsoft has been viewed by the recruiter.",
    time: "2 days ago",
    isRead: true,
    actionRoute: "applications",
  },
  {
    id: "n5",
    type: "system",
    title: "Profile Tip",
    message: "Add 2 more skills to increase your job match by 15%.",
    time: "3 days ago",
    isRead: true,
    actionRoute: "profile",
  },
  {
    id: "n6",
    type: "job",
    title: "Job Recommendation",
    message: "3 new frontend roles posted in Chennai matching your preferences.",
    time: "4 days ago",
    isRead: true,
    actionRoute: "jobs",
  },
];

const TYPE_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; bg: string }> = {
  job: { icon: Briefcase, color: "#635BFF", bg: "#EEF2FF" },
  learning: { icon: BookOpen, color: "#22C55E", bg: "#F0FDF4" },
  interview: { icon: CalendarCheck, color: "#8B5CF6", bg: "#F5F3FF" },
  application: { icon: CheckCircle2, color: "#3B82F6", bg: "#EFF6FF" },
  system: { icon: Sparkles, color: "#F59E0B", bg: "#FFFBEB" },
};

export function NotificationsScreen({
  onBack,
  onNotificationClick,
}: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const tabs = [
    { id: "all", label: "All", count: notifications.length },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "job", label: "Jobs" },
    { id: "learning", label: "Learning" },
  ];

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications.filter((n) => n.type === activeTab);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-full w-full bg-[#FAF9FF] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E5F2] px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-1.5 rounded-full hover:bg-slate-100 text-[#667085] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[1.8]" />
              </button>
            )}
            <div>
              <h1 className="text-[17px] font-bold text-[#172033] tracking-tight">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-[11px] text-[#635BFF] font-medium">
                  {unreadCount} unread
                </p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-[11px] font-semibold text-[#635BFF] hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 pt-4 pb-2">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="default"
          size="sm"
        />
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6 space-y-2 pt-2">
        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
              const Icon = config.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={cn(
                    "rounded-[14px] border p-3.5 flex items-start gap-3 cursor-pointer transition-all active:scale-[0.99]",
                    notif.isRead
                      ? "bg-white border-[#E8E5F2]"
                      : "bg-[#FAFAFE] border-[#C7D2FE] shadow-sm"
                  )}
                  onClick={() => {
                    markAsRead(notif.id);
                    onNotificationClick?.(notif.type, notif.actionId || "");
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: config.bg }}
                  >
                    <Icon className="w-4.5 h-4.5" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className={cn(
                        "text-[12.5px] leading-tight",
                        notif.isRead ? "font-medium text-[#172033]" : "font-bold text-[#172033]"
                      )}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-[#635BFF] shrink-0 mt-1.5 ml-2" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#667085] mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-1.5">{notif.time}</p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
                <Bell className="w-7 h-7 text-[#94A3B8]" />
              </div>
              <p className="text-[14px] font-bold text-[#172033]">All caught up!</p>
              <p className="text-[12px] text-[#667085] max-w-xs">
                You don&apos;t have any notifications right now. We&apos;ll let you know when something comes up.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
