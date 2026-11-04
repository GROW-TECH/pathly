"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  Send,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Building2,
  MapPin,
  Sparkles,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";

interface ApplicationsScreenProps {
  onBack?: () => void;
  onSelectJob?: (jobId: string) => void;
}

type AppStatus = "saved" | "applied" | "interview" | "selected" | "rejected";

interface ApplicationItem {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  status: AppStatus;
  appliedDate?: string;
  updatedDate?: string;
  notes?: string;
}

const MOCK_APPLICATIONS: ApplicationItem[] = [
  {
    id: "app-1",
    jobId: "job-1",
    title: "Frontend Developer",
    company: "Google",
    location: "Chennai · Hybrid",
    salary: "₹6–10 LPA",
    status: "interview",
    appliedDate: "Sep 25, 2026",
    updatedDate: "Oct 1, 2026",
    notes: "Technical round scheduled Oct 5",
  },
  {
    id: "app-2",
    jobId: "job-2",
    title: "Frontend Engineer",
    company: "Microsoft",
    location: "Bangalore · On-site",
    salary: "₹8–12 LPA",
    status: "applied",
    appliedDate: "Sep 28, 2026",
  },
  {
    id: "app-3",
    jobId: "job-3",
    title: "UI Frontend Developer",
    company: "Swiggy",
    location: "Bangalore · Hybrid",
    salary: "₹7–12 LPA",
    status: "saved",
  },
  {
    id: "app-4",
    jobId: "job-4",
    title: "React Developer",
    company: "Flipkart",
    location: "Chennai · Remote",
    salary: "₹5–8 LPA",
    status: "rejected",
    appliedDate: "Sep 15, 2026",
    updatedDate: "Sep 22, 2026",
  },
  {
    id: "app-5",
    jobId: "job-5",
    title: "Junior Frontend Dev",
    company: "Zoho",
    location: "Chennai · On-site",
    salary: "₹4–6 LPA",
    status: "selected",
    appliedDate: "Sep 10, 2026",
    updatedDate: "Sep 30, 2026",
  },
];

const STATUS_CONFIG: Record<AppStatus, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  saved: { label: "Saved", color: "#667085", bg: "#F1F5F9", icon: Bookmark },
  applied: { label: "Applied", color: "#3B82F6", bg: "#EFF6FF", icon: Send },
  interview: { label: "Interview", color: "#8B5CF6", bg: "#F5F3FF", icon: CalendarCheck },
  selected: { label: "Selected", color: "#22C55E", bg: "#F0FDF4", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "#EF4444", bg: "#FEF2F2", icon: XCircle },
};

export function ApplicationsScreen({ onBack, onSelectJob }: ApplicationsScreenProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const tabs = [
    { id: "all", label: "All", count: MOCK_APPLICATIONS.length },
    { id: "saved", label: "Saved", count: MOCK_APPLICATIONS.filter((a) => a.status === "saved").length },
    { id: "applied", label: "Applied", count: MOCK_APPLICATIONS.filter((a) => a.status === "applied").length },
    { id: "interview", label: "Interview", count: MOCK_APPLICATIONS.filter((a) => a.status === "interview").length },
    { id: "selected", label: "Selected", count: MOCK_APPLICATIONS.filter((a) => a.status === "selected").length },
    { id: "rejected", label: "Rejected", count: MOCK_APPLICATIONS.filter((a) => a.status === "rejected").length },
  ];

  const filteredApps =
    activeTab === "all"
      ? MOCK_APPLICATIONS
      : MOCK_APPLICATIONS.filter((a) => a.status === activeTab);

  return (
    <div className="min-h-full w-full bg-[#FAF9FF] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E5F2] px-4 pt-4 pb-3">
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
              My Applications
            </h1>
            <p className="text-[11px] text-[#667085]">
              Track your job applications
            </p>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="px-5 pt-4 pb-2">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="default"
          size="sm"
        />
      </div>

      {/* Applications List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6 space-y-3 pt-2">
        <AnimatePresence>
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => {
              const config = STATUS_CONFIG[app.status];
              const StatusIcon = config.icon;
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-[14px] border border-[#E8E5F2] p-3.5 space-y-2.5 hover:border-[#C7D2FE] transition-all cursor-pointer active:scale-[0.99]"
                  onClick={() => onSelectJob?.(app.jobId)}
                >
                  {/* Top: Company + Status */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-[10px] bg-[#F1F5F9] border border-[#E4E7EC] flex items-center justify-center text-[#667085] shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-bold text-[#172033] truncate">
                          {app.title}
                        </h3>
                        <p className="text-[11px] text-[#667085] truncate">
                          {app.company} • {app.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full shrink-0"
                      style={{ color: config.color, backgroundColor: config.bg }}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-[10.5px] text-[#94A3B8]">
                    <span className="font-semibold text-[#172033]">{app.salary}</span>
                    {app.appliedDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Applied {app.appliedDate}
                      </span>
                    )}
                  </div>

                  {/* Notes for interview/rejection */}
                  {app.notes && (
                    <div className="flex items-start gap-2 bg-[#F8FAFC] border border-[#E4E7EC] rounded-[10px] px-3 py-2">
                      <FileText className="w-3.5 h-3.5 text-[#667085] mt-0.5 shrink-0" />
                      <p className="text-[11px] text-[#667085]">{app.notes}</p>
                    </div>
                  )}

                  {/* Rejection → AI feedback CTA */}
                  {app.status === "rejected" && (
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#635BFF] bg-[#EEF2FF] border border-[#C7D2FE] rounded-[10px] py-2 hover:bg-[#E0E7FF] transition-colors active:scale-[0.99]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Get AI Improvement Feedback
                    </button>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
                <FileText className="w-7 h-7 text-[#94A3B8]" />
              </div>
              <p className="text-[14px] font-bold text-[#172033]">No applications yet</p>
              <p className="text-[12px] text-[#667085] max-w-xs">
                Start applying to jobs and track your progress here.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
