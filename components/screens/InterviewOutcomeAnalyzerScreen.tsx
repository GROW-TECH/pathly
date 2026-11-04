"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Building2,
  Briefcase,
  HelpCircle,
  TrendingUp,
  BookOpen,
  Calendar,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface InterviewOutcomeAnalyzerProps {
  onBack?: () => void;
  onExploreCourse?: (courseId: string) => void;
  onNavigateToLearn?: () => void;
  onNavigateToJobs?: () => void;
}

type OutcomeStatus = "passed" | "failed" | "pending";

export function InterviewOutcomeAnalyzerScreen({
  onBack,
  onExploreCourse,
  onNavigateToJobs,
}: InterviewOutcomeAnalyzerProps) {
  const [companyName, setCompanyName] = useState("Google");
  const [roleTitle, setRoleTitle] = useState("Frontend Developer");
  const [outcome, setOutcome] = useState<OutcomeStatus>("failed");
  const [feedbackNotes, setFeedbackNotes] = useState(
    "Recruiter mentioned my React fundamentals were strong, but I struggled with the Next.js Server Components optimization question and time complexity calculation in round 2."
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(true);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasSubmitted(true);
    }, 1000);
  };

  const aiRootCauses = [
    {
      area: "Technical Architecture",
      severity: "High",
      issue: "Lack of deep knowledge in Server Components & Caching",
      recommendation: "Complete Module 3 & 4 of Next.js 14 Full Stack Mastery",
      courseId: "course-1",
    },
    {
      area: "Algorithmic Complexity",
      severity: "Medium",
      issue: "Hesitant in explaining Big-O Time & Space tradeoffs",
      recommendation: "Review Data Structures & Big-O Quick Refresher",
      courseId: "course-2",
    },
  ];

  const passHighlights = [
    "Clear communication using the STAR methodology",
    "Strong portfolio demonstration of React & UI architecture",
    "Positive cultural fit and growth mindset responses",
  ];

  return (
    <div className="h-full w-full bg-[#FAF9FF] text-[#18152B] font-sans antialiased flex flex-col select-none relative overflow-hidden">
      <Header
        variant="back"
        title="AI Interview Outcome Debrief"
        onBackClick={onBack}
      />

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4 space-y-4 max-w-lg mx-auto w-full">
        {/* Top Context Card */}
        <div className="p-4 rounded-[20px] bg-white border border-[#E8E5F2] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-[12px] bg-[#F1EFFF] flex items-center justify-center text-[#635BFF] font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-[#172033]">{companyName}</h3>
                <p className="text-[11.5px] text-[#667085]">{roleTitle} Interview</p>
              </div>
            </div>

            <span className="text-[11px] font-medium text-[#667085]">
              Round 2 Debrief
            </span>
          </div>

          {/* Outcome Status Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
              Interview Result
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOutcome("passed")}
                className={cn(
                  "p-2.5 rounded-[12px] border text-center text-[12px] font-bold transition-all flex items-center justify-center gap-1.5",
                  outcome === "passed"
                    ? "bg-[#F0FDF4] border-[#22C55E] text-[#15803D] shadow-xs"
                    : "bg-white border-[#E8E5F2] text-[#667085] hover:border-[#22C55E]/40"
                )}
              >
                <CheckCircle2 className="w-4 h-4 text-[#22C995]" />
                <span>Offer / Passed 🎉</span>
              </button>

              <button
                type="button"
                onClick={() => setOutcome("failed")}
                className={cn(
                  "p-2.5 rounded-[12px] border text-center text-[12px] font-bold transition-all flex items-center justify-center gap-1.5",
                  outcome === "failed"
                    ? "bg-[#FEF2F2] border-[#EF4444] text-[#DC2626] shadow-xs"
                    : "bg-white border-[#E8E5F2] text-[#667085] hover:border-[#EF4444]/40"
                )}
              >
                <XCircle className="w-4 h-4 text-[#EF4444]" />
                <span>Rejected / Didn&apos;t Clear</span>
              </button>
            </div>
          </div>

          {/* Interview Details & Notes */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#172033]">
              What questions were asked or what feedback did you receive?
            </label>
            <textarea
              rows={3}
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              placeholder="E.g., struggled with system design, salary negotiation, or coding question..."
              className="w-full p-3 rounded-[12px] bg-[#F8FAFC] border border-[#E8E5F2] text-[12px] text-[#172033] outline-none focus:border-[#635BFF] transition-all resize-none"
            />
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            className="w-full h-9 rounded-[11px] bg-[#635BFF] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#5349E8] transition-all"
          >
            <Sparkles className={cn("w-3.5 h-3.5", isAnalyzing && "animate-spin")} />
            <span>{isAnalyzing ? "Analyzing Outcome..." : "Analyze with Pathly AI"}</span>
          </button>
        </div>

        {/* AI Analysis Outcome Card */}
        {hasSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {outcome === "failed" ? (
              <div className="p-4 rounded-[20px] bg-gradient-to-br from-[#FEF2F2] to-[#FFF5F5] border border-[#FECACA] space-y-3">
                <div className="flex items-center gap-2 text-[#DC2626]">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <h3 className="text-[14px] font-bold">Root-Cause Failure Analysis</h3>
                    <p className="text-[11px] text-[#991B1B]">
                      Don&apos;t worry! 73% of candidates succeed within their next 2 attempts with targeted fixes.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {aiRootCauses.map((cause, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-[14px] bg-white border border-[#FECACA] shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#172033]">
                          {cause.area}
                        </span>
                        <span className="text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] px-2 py-0.5 rounded-full border border-[#FECACA]">
                          {cause.severity} Impact
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[#667085]">
                        <span className="font-semibold text-[#172033]">Problem: </span>
                        {cause.issue}
                      </p>
                      <div
                        onClick={() => onExploreCourse?.(cause.courseId)}
                        className="p-2 rounded-[8px] bg-[#F8FAFF] border border-[#E8E5F2] flex items-center justify-between cursor-pointer hover:border-[#635BFF] transition-colors mt-1"
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <BookOpen className="w-3.5 h-3.5 text-[#635BFF] shrink-0" />
                          <span className="text-[11px] font-semibold text-[#635BFF] truncate">
                            Fix: {cause.recommendation}
                          </span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-[#635BFF] shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-[20px] bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] border border-[#BBF7D0] space-y-3">
                <div className="flex items-center gap-2 text-[#15803D]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div>
                    <h3 className="text-[14px] font-bold">Congratulations on the Offer! 🎉</h3>
                    <p className="text-[11px] text-[#166534]">
                      AI Analysis shows strong candidate readiness. Here is why you stood out:
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {passHighlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-[12px] bg-white border border-[#BBF7D0] text-[11.5px] font-medium text-[#15803D]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#22C995] shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Recommended Actions */}
            <div className="p-4 rounded-[18px] bg-white border border-[#E8E5F2] shadow-2xs space-y-3">
              <h3 className="text-[13.5px] font-bold text-[#172033] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#635BFF]" />
                <span>Next Recommended Steps</span>
              </h3>

              <div className="space-y-2">
                <div
                  onClick={onNavigateToJobs}
                  className="p-3 rounded-[12px] bg-[#F8FAFF] border border-[#E8E5F2] flex items-center justify-between cursor-pointer hover:border-[#635BFF] transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Briefcase className="w-4 h-4 text-[#635BFF] shrink-0" />
                    <div>
                      <h4 className="text-[12px] font-bold text-[#172033]">
                        Apply to 3 High-Match Alternative Roles
                      </h4>
                      <p className="text-[10.5px] text-[#667085]">
                        Swiggy, Microsoft, and Zoho are actively hiring for your profile.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#635BFF] shrink-0" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
