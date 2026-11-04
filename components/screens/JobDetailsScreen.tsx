"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  Landmark,
  FileText,
  Calendar,
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight,
  Zap,
  Check,
  BarChart3,
  Settings,
  ChevronRight,
  ExternalLink,
  Target,
  Users,
  Compass,
} from "lucide-react";

export interface JobDetailItem {
  id: string;
  type: "job" | "exam";
  title: string;
  companyOrOrg: string;
  companyLogoType: "google" | "microsoft" | "swiggy" | "tnpsc" | "ssc" | "upsc";
  location: string;
  workMode?: string;
  salaryOrScale: string;
  experienceOrAge: string;
  jobType?: string;
  industry?: string;
  matchScore: number;
  matchBreakdown: {
    skills: number;
    experienceOrEligibility: number;
    interest: number;
    locationOrPreferences: number;
  };
  matchReasons: string[];
  overview: Array<{
    label: string;
    value: string;
    iconType: "briefcase" | "salary" | "map" | "mode" | "type" | "industry" | "calendar" | "grad" | "age";
  }>;
  description: string;
  responsibilitiesOrProcess: string[];
  requiredSkillsOrSyllabus: string[];
  matchingSkills: string[];
  missingSkills: string[];
  aiInsight: {
    title: string;
    summary: string;
    actionLabel: string;
  };
  examSpecific?: {
    examName: string;
    conductingOrg: string;
    eligibility: string;
    qualification: string;
    ageLimit: string;
    applicationDates: string;
    examDate: string;
    selectionProcess: string[];
    officialNotificationUrl: string;
    preparationReadiness: number;
  };
}

type TabType = "overview" | "about" | "requirements" | "match";

interface JobDetailsScreenProps {
  job: JobDetailItem;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onBack: () => void;
  onNavigateToLearn?: () => void;
}

export function JobDetailsScreen({
  job,
  isSaved,
  onToggleSave,
  onBack,
  onNavigateToLearn,
}: JobDetailsScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showSkillGaps, setShowSkillGaps] = useState(false);
  const [showAppliedToast, setShowAppliedToast] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const isExam = job.type === "exam";

  const handleApply = () => {
    setShowAppliedToast(true);
    setTimeout(() => setShowAppliedToast(false), 3000);
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  const renderLogo = (type: string) => {
    if (type === "google") {
      return (
        <div className="w-12 h-12 rounded-[12px] bg-[#F8FAFC] border border-[#E8E8EF] flex items-center justify-center shrink-0 shadow-2xs">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        </div>
      );
    }
    if (type === "microsoft") {
      return (
        <div className="w-12 h-12 rounded-[12px] bg-[#F8FAFC] border border-[#E8E8EF] flex items-center justify-center shrink-0 shadow-2xs">
          <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
            <div className="bg-[#F25022] rounded-[1px]" />
            <div className="bg-[#7FBA00] rounded-[1px]" />
            <div className="bg-[#00A4EF] rounded-[1px]" />
            <div className="bg-[#FFB900] rounded-[1px]" />
          </div>
        </div>
      );
    }
    if (type === "swiggy") {
      return (
        <div className="w-12 h-12 rounded-[12px] bg-[#FFF5EE] border border-[#FFE4D6] flex items-center justify-center shrink-0 shadow-2xs">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FC8019">
            <path d="M12 2C7.58 2 4 5.58 4 10c0 4.9 6.2 11.24 7.42 12.44.32.32.84.32 1.16 0C13.8 21.24 20 14.9 20 10c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-[12px] bg-[#F1EFFF] border border-[#E8E5F2] flex items-center justify-center text-[#6D5DF5] font-bold text-sm shrink-0 shadow-2xs">
        <Landmark className="w-6 h-6 text-[#6D5DF5]" />
      </div>
    );
  };

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "about", label: "About" },
    { id: "requirements", label: "Requirements" },
    { id: "match", label: "AI Match" },
  ];

  // Circular progress calculation for AI Match
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (job.matchScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="min-h-screen w-full bg-white text-[#18152B] flex flex-col justify-between font-sans select-none relative pb-28"
    >
      {/* Toast Feedback */}
      <AnimatePresence>
        {showAppliedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#18152B] text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-[12px] font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-[#22C995]" />
            <span>
              {isExam ? "Official Notification opened!" : "Application initiated via Pathly!"}
            </span>
          </motion.div>
        )}
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#18152B] text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-[12px] font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-[#22C995]" />
            <span>Job link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. TOP HEADER (54px, WHITE BG, THIN BOTTOM BORDER)                        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 h-[54px] bg-white border-b border-[#E8E5F2] px-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-[14px] font-medium text-[#18152B] hover:text-[#6D5DF5] transition-colors p-1 -ml-1"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-[#18152B]" />
          <span>Back</span>
        </button>

        <span className="text-[14px] font-semibold text-[#18152B]">
          Job Details
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onToggleSave(job.id)}
            className="w-8 h-8 rounded-full bg-[#FAF9FF] border border-[#E8E5F2] flex items-center justify-center text-[#667085] hover:text-[#6D5DF5] transition-colors"
            aria-label="Save"
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${isSaved ? "fill-[#6D5DF5] text-[#6D5DF5]" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-[#FAF9FF] border border-[#E8E5F2] flex items-center justify-center text-[#667085] hover:text-[#6D5DF5] transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. COMPACT JOB SUMMARY (CARD-FREE)                                        */}
      {/* ========================================================================= */}
      <div className="w-full max-w-lg mx-auto px-4 pt-3.5 pb-2 space-y-3">
        <div className="flex items-start gap-3.5">
          {renderLogo(job.companyLogoType)}
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#ECFBF5] text-[#087F5B]">
              <Check className="w-3 h-3 text-[#22C995] stroke-[3]" />
              <span>{isExam ? "Official Opportunity" : "Verified Opportunity"}</span>
            </div>
            <h1 className="text-[19px] font-bold text-[#18152B] leading-tight">
              {job.title}
            </h1>
            <p className="text-[13px] font-medium text-[#667085]">
              {job.companyOrOrg}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-[11.5px] text-[#667085]">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#98A2B3]" />
            <span>{job.location}</span>
          </span>
          <span className="text-[#D1D5DB]">•</span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-[#98A2B3]" />
            <span>{job.workMode || "State Govt"}</span>
          </span>
          <span className="text-[#D1D5DB]">•</span>
          <span className="font-semibold text-[#18152B]">
            ₹ {job.salaryOrScale}
          </span>
          <span className="text-[#D1D5DB]">•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#98A2B3]" />
            <span>{job.experienceOrAge}</span>
          </span>
        </div>

        {/* Primary Action Buttons (Height 44-46px) */}
        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          <button
            type="button"
            onClick={() => onToggleSave(job.id)}
            className={`h-[44px] rounded-[12px] text-[13px] font-semibold border flex items-center justify-center gap-1.5 transition-all ${
              isSaved
                ? "bg-[#F1EFFF] text-[#6D5DF5] border-[#6D5DF5]"
                : "bg-white text-[#6D5DF5] border-[#6D5DF5] hover:bg-[#F1EFFF]"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[#6D5DF5]" : ""}`} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="h-[44px] rounded-[12px] bg-[#6D5DF5] text-white text-[13px] font-semibold hover:bg-[#5146C7] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-[#6D5DF5]/20"
          >
            <span>{isExam ? "View Notification →" : "Apply Now →"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. HORIZONTAL TAB NAVIGATION (STICKY WITH PURPLE INDICATOR)               */}
      {/* ========================================================================= */}
      <div className="sticky top-[54px] z-20 bg-white border-y border-[#E8E5F2]">
        <div className="w-full max-w-lg mx-auto px-2 flex items-center justify-between no-scrollbar overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-3 px-3 text-[12px] font-semibold transition-colors shrink-0 whitespace-nowrap ${
                  isActive ? "text-[#6D5DF5]" : "text-[#667085] hover:text-[#18152B]"
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#6D5DF5] rounded-t-full"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT AREA (SMOOTH TRANSITION, NO CARD-HEAVY BOXES)                 */}
      {/* ========================================================================= */}
      <main className="w-full max-w-lg mx-auto px-4 py-4 flex-1 text-left">
        <AnimatePresence mode="wait">
          {/* ===================================================================== */}
          {/* TAB 1: OVERVIEW TAB (DEFAULT - SHORT & PUNCHY)                         */}
          {/* ===================================================================== */}
          {activeTab === "overview" && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* Job Overview 4-Column Grid */}
              <div className="space-y-2">
                <h2 className="text-[14px] font-bold text-[#18152B]">
                  Job Overview
                </h2>
                <div className="grid grid-cols-4 divide-x divide-[#E8E5F2] text-center pt-1">
                  <div className="px-1 space-y-0.5">
                    <div className="flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-[#EF4444]" />
                    </div>
                    <p className="text-[11.5px] font-bold text-[#18152B] truncate">
                      {job.location}
                    </p>
                    <p className="text-[10px] text-[#667085]">Location</p>
                  </div>
                  <div className="px-1 space-y-0.5">
                    <div className="flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                    </div>
                    <p className="text-[11.5px] font-bold text-[#18152B] truncate">
                      {job.workMode || "State Govt"}
                    </p>
                    <p className="text-[10px] text-[#667085]">Work Mode</p>
                  </div>
                  <div className="px-1 space-y-0.5">
                    <div className="flex items-center justify-center">
                      <span className="text-[12px] font-bold text-[#10B981]">₹</span>
                    </div>
                    <p className="text-[11.5px] font-bold text-[#18152B] truncate">
                      {job.salaryOrScale.replace("₹", "")}
                    </p>
                    <p className="text-[10px] text-[#667085]">Salary</p>
                  </div>
                  <div className="px-1 space-y-0.5">
                    <div className="flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-[#8B7CF6]" />
                    </div>
                    <p className="text-[11.5px] font-bold text-[#18152B] truncate">
                      {job.experienceOrAge.replace("Age: ", "")}
                    </p>
                    <p className="text-[10px] text-[#667085]">Experience</p>
                  </div>
                </div>
              </div>

              {/* Section Divider */}
              <div className="border-t border-[#E8E5F2]" />

              {/* Key Skills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-[14px] font-bold text-[#18152B]">
                    Key Skills
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab("requirements")}
                    className="text-[11.5px] font-semibold text-[#6D5DF5] hover:underline flex items-center gap-0.5"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.matchingSkills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1EFFF] text-[11.5px] font-semibold text-[#6D5DF5]"
                    >
                      <Check className="w-3 h-3 text-[#6D5DF5] stroke-[3]" />
                      <span>{skill}</span>
                    </span>
                  ))}
                  {job.matchingSkills.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("requirements")}
                      className="px-2.5 py-1.5 rounded-full bg-[#FAF9FF] border border-[#E8E5F2] text-[11.5px] font-semibold text-[#667085] hover:text-[#6D5DF5]"
                    >
                      +{job.matchingSkills.length - 3}
                    </button>
                  )}
                </div>
              </div>

              {/* Section Divider */}
              <div className="border-t border-[#E8E5F2]" />

              {/* AI Match Overview Cardlet */}
              <div className="space-y-2 pt-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#6D5DF5]">
                    <Sparkles className="w-4 h-4" />
                    <h2 className="text-[14px] font-bold text-[#18152B]">
                      AI Match
                    </h2>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-[#ECFBF5] text-[#087F5B]">
                    {job.matchScore}% Strong Match
                  </span>
                </div>

                <p className="text-[12px] text-[#667085] leading-relaxed">
                  Your profile is a strong fit for this opportunity.
                </p>

                {/* Progress bar preview */}
                <div className="h-2 bg-[#E9E7F2] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#6D5DF5] via-[#8B7CF6] to-[#22C995] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${job.matchScore}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("match")}
                    className="text-[12px] font-semibold text-[#6D5DF5] hover:underline flex items-center gap-1"
                  >
                    <span>View full AI breakdown →</span>
                  </button>
                </div>
              </div>

              {/* Section Divider */}
              <div className="border-t border-[#E8E5F2]" />

              {/* Quick Apply Callout */}
              <div className="pt-1 flex items-center justify-between bg-[#FAF9FF] p-3 rounded-[12px] border border-[#E8E5F2]">
                <div className="space-y-0.5">
                  <p className="text-[12px] font-bold text-[#18152B]">Ready to apply?</p>
                  <p className="text-[11px] text-[#667085]">Instant referral match available</p>
                </div>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-3.5 py-1.5 rounded-[10px] bg-[#6D5DF5] text-white text-[11.5px] font-semibold hover:bg-[#5146C7] transition-all"
                >
                  Apply Now →
                </button>
              </div>
            </motion.div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: ABOUT TAB (FULL ROLE DETAILS & COMPANY INFO)                    */}
          {/* ===================================================================== */}
          {activeTab === "about" && (
            <motion.div
              key="tab-about"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* About the Role */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#6D5DF5]" />
                  <h2 className="text-[14px] font-bold text-[#18152B]">
                    {isExam ? "About The Examination" : "About the Role"}
                  </h2>
                </div>
                <p className="text-[13px] text-[#475569] leading-relaxed">
                  {showFullDesc
                    ? job.description
                    : `${job.description.slice(0, 160)}...`}
                </p>
                <button
                  type="button"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="text-[12px] font-semibold text-[#6D5DF5] hover:underline inline-flex items-center gap-0.5"
                >
                  <span>{showFullDesc ? "Read less ↑" : "Read more →"}</span>
                </button>
              </div>

              {/* Section Divider */}
              <div className="border-t border-[#E8E5F2]" />

              {/* Responsibilities */}
              <div className="space-y-2.5">
                <h3 className="text-[14px] font-bold text-[#18152B]">
                  {isExam ? "Selection Process & Stages" : "Responsibilities"}
                </h3>
                <ul className="space-y-2 text-[12.5px] text-[#475569]">
                  {job.responsibilitiesOrProcess.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#6D5DF5] font-bold shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section Divider */}
              <div className="border-t border-[#E8E5F2]" />

              {/* Company Section */}
              <div className="space-y-2">
                <h3 className="text-[14px] font-bold text-[#18152B]">
                  {isExam ? "Exam Authority" : "Company"}
                </h3>
                <div className="space-y-1 text-[12.5px] text-[#475569]">
                  <p className="font-bold text-[#18152B]">{job.companyOrOrg}</p>
                  <p className="text-[12px] text-[#667085]">
                    {job.industry || "Technology & Software Solutions"} • Large Organization
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===================================================================== */}
          {/* TAB 3: REQUIREMENTS TAB (SKILLS, EDUCATION, SKILL GAPS)                */}
          {/* ===================================================================== */}
          {activeTab === "requirements" && (
            <motion.div
              key="tab-requirements"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* Required Skills */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-[#6D5DF5]" />
                  <h2 className="text-[14px] font-bold text-[#18152B]">
                    {isExam ? "Core Syllabus Subjects" : "Required Skills"}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {job.requiredSkillsOrSyllabus.map((req, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-[10px] bg-[#F5F3FF] text-[11.5px] font-medium text-[#5146C7]"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Section Divider */}
              <div className="border-t border-[#E8E5F2]" />

              {/* Experience & Education */}
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <h3 className="text-[13px] font-bold text-[#18152B]">Experience</h3>
                  <p className="text-[12.5px] text-[#475569]">{job.experienceOrAge}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-[13px] font-bold text-[#18152B]">Education</h3>
                  <p className="text-[12.5px] text-[#475569]">
                    {job.examSpecific?.qualification || "Bachelor's degree in Computer Science, Engineering, or equivalent practical experience"}
                  </p>
                </div>
              </div>

              {/* Section Divider */}
              <div className="border-t border-[#E8E5F2]" />

              {/* Preferred Skills */}
              <div className="space-y-2">
                <h3 className="text-[13px] font-bold text-[#18152B]">
                  Preferred Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {["Next.js", "GraphQL", "Testing & Performance"].map((pref, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-[8px] bg-[#FAF9FF] border border-[#E8E5F2] text-[11.5px] font-medium text-[#667085]"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>

              {/* Section Divider */}
              <div className="border-t border-[#E8E5F2]" />

              {/* Skill Gap Component */}
              <div className="space-y-2">
                <h3 className="text-[13px] font-bold text-[#18152B]">Skill Gap</h3>
                <div className="p-3 rounded-[10px] bg-[#FFFBEB] border border-[#FDE68A] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#B45309] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                      <span>{job.missingSkills.length} skills could improve your match</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSkillGaps(!showSkillGaps)}
                      className="text-[11.5px] font-bold text-[#6D5DF5] hover:underline flex items-center gap-0.5"
                    >
                      <span>{showSkillGaps ? "Hide" : "View Skill Gaps"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showSkillGaps && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 pt-1 overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-1.5">
                          {job.missingSkills.map((gap, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-[8px] bg-white border border-[#FDE68A] text-[11px] font-medium text-[#B45309]"
                            >
                              + {gap}
                            </span>
                          ))}
                        </div>
                        {onNavigateToLearn && (
                          <button
                            type="button"
                            onClick={onNavigateToLearn}
                            className="text-[11px] font-bold text-[#6D5DF5] hover:underline flex items-center gap-1 pt-0.5"
                          >
                            <span>Learn in Pathly Roadmap →</span>
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: AI MATCH TAB (FLAGSHIP AI CAREER INTELLIGENCE)                 */}
          {/* ===================================================================== */}
          {activeTab === "match" && (
            <motion.div
              key="tab-match"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* Header & Circular Progress Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#6D5DF5]">
                  <Sparkles className="w-4 h-4" />
                  <h2 className="text-[15px] font-bold text-[#18152B]">
                    AI Career Match
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#ECFBF5] text-[#087F5B]">
                  Strong Match
                </span>
              </div>

              {/* Circular Progress & Score */}
              <div className="flex items-center gap-4 py-1">
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      stroke="#E9E7F2"
                      strokeWidth="6"
                      fill="none"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r={radius}
                      stroke="#6D5DF5"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[17px] font-extrabold text-[#18152B] leading-none">
                      {job.matchScore}%
                    </span>
                    <span className="text-[9px] font-semibold text-[#6D5DF5] mt-0.5">
                      MATCH
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[14px] font-bold text-[#18152B]">
                    Strong Career Match
                  </h3>
                  <p className="text-[12px] text-[#667085] leading-relaxed">
                    Your profile is a strong fit for this role.
                  </p>
                </div>
              </div>

              {/* Section Divider */}
              <div className="border-t border-[#E8E5F2]" />

              {/* Match Breakdown with Individual Progress Bars */}
              <div className="space-y-3">
                <h3 className="text-[12px] font-bold text-[#667085] tracking-wider uppercase">
                  MATCH BREAKDOWN
                </h3>

                <div className="space-y-3 text-[12px]">
                  {/* Skills Match */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-[#475569]">Skills Match</span>
                      <span className="font-bold text-[#6D5DF5]">{job.matchBreakdown.skills}%</span>
                    </div>
                    <div className="h-1.5 bg-[#E9E7F2] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#6D5DF5] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${job.matchBreakdown.skills}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Experience Fit */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-[#475569]">Experience Fit</span>
                      <span className="font-bold text-[#22C995]">{job.matchBreakdown.experienceOrEligibility}%</span>
                    </div>
                    <div className="h-1.5 bg-[#E9E7F2] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#22C995] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${job.matchBreakdown.experienceOrEligibility}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Career Interest */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-[#475569]">Career Interest</span>
                      <span className="font-bold text-[#6D5DF5]">{job.matchBreakdown.interest}%</span>
                    </div>
                    <div className="h-1.5 bg-[#E9E7F2] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#6D5DF5] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${job.matchBreakdown.interest}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Location & Preferences */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-[#475569]">Location</span>
                      <span className="font-bold text-[#3B82F6]">{job.matchBreakdown.locationOrPreferences}%</span>
                    </div>
                    <div className="h-1.5 bg-[#E9E7F2] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#3B82F6] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${job.matchBreakdown.locationOrPreferences}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Divider */}
              <div className="border-t border-[#E8E5F2]" />

              {/* Why this matches you */}
              <div className="space-y-2.5">
                <h3 className="text-[13px] font-bold text-[#18152B]">
                  Why this matches you
                </h3>
                <div className="space-y-2 text-[12px] text-[#475569]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C995] fill-[#ECFBF5] shrink-0" />
                    <span>Your skills match the role</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C995] fill-[#ECFBF5] shrink-0" />
                    <span>Your career interests align</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C995] fill-[#ECFBF5] shrink-0" />
                    <span>Your experience fits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C995] fill-[#ECFBF5] shrink-0" />
                    <span>Your location preference matches</span>
                  </div>
                </div>
              </div>

              {/* Section Divider */}
              <div className="border-t border-[#E8E5F2]" />

              {/* Improve My Match CTA */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onNavigateToLearn || handleApply}
                  className="w-full py-2.5 rounded-[12px] bg-[#F1EFFF] text-[#6D5DF5] text-[12.5px] font-bold hover:bg-[#E4DFFF] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-[#6D5DF5]" />
                  <span>Improve My Match →</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ========================================================================= */}
      {/* 11. STICKY FIXED BOTTOM ACTION BAR (HEIGHT 64-68px, SAFE-AREA AWARE)      */}
      {/* ========================================================================= */}
      <footer className="sticky bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E8EF] px-4 py-2.5 shadow-[0_-4px_16px_rgba(24,21,43,0.05)]">
        <div className="w-full max-w-lg mx-auto flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onToggleSave(job.id)}
            className={`h-[44px] px-5 rounded-[12px] border flex items-center justify-center gap-1.5 text-[13px] font-semibold transition-all shrink-0 ${
              isSaved
                ? "bg-[#F1EFFF] text-[#6D5DF5] border-[#6D5DF5]"
                : "bg-white text-[#6D5DF5] border-[#6D5DF5] hover:bg-[#F1EFFF]"
            }`}
            aria-label="Save"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[#6D5DF5]" : ""}`} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 h-[44px] rounded-[12px] bg-[#6D5DF5] text-white text-[13px] font-semibold hover:bg-[#5146C7] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#6D5DF5]/25"
          >
            <span>{isExam ? "Apply Now →" : "Apply Now →"}</span>
          </button>
        </div>
      </footer>
    </motion.div>
  );
}
