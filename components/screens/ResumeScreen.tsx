"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Download,
  Check,
  ChevronRight,
  ShieldCheck,
  Eye,
  TrendingUp,
  FileCheck,
  X,
  FileUp,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ResumeScreenProps {
  onNext: () => void;
  onBack?: () => void;
}

type ScreenMode = "upload" | "scanning" | "results";

export function ResumeScreen({ onNext, onBack }: ResumeScreenProps) {
  const [mode, setMode] = useState<ScreenMode>("upload");
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
  }>({
    name: "Alex_Morgan_Frontend_Resume.pdf",
    size: "142 KB",
  });
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState(0);
  const [atsScore, setAtsScore] = useState(78);
  const [appliedFixes, setAppliedFixes] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
      });
      startScan();
    }
  };

  const startScan = () => {
    setMode("scanning");
    setScanProgress(0);
    setScanStage(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setMode("results"), 400);
          return 100;
        }
        if (prev === 25) setScanStage(1);
        if (prev === 55) setScanStage(2);
        if (prev === 85) setScanStage(3);
        return prev + 5;
      });
    }, 80);
  };

  const handleApplyFix = (fixId: string, scoreBoost: number) => {
    if (!appliedFixes.includes(fixId)) {
      setAppliedFixes([...appliedFixes, fixId]);
      setAtsScore((prev) => Math.min(100, prev + scoreBoost));
    }
  };

  const pillars = [
    { name: "ATS Formatting", score: 92, status: "Good", color: "#22C995" },
    { name: "Keyword Match", score: 72, status: "Needs Work", color: "#F59E0B" },
    { name: "Action & Impact", score: 68, status: "Improve", color: "#EF4444" },
    { name: "Skill Coverage", score: 80, status: "Good", color: "#635BFF" },
  ];

  const suggestions = [
    {
      id: "fix-1",
      title: "Add In-Demand Missing Keywords",
      desc: "Target Frontend roles require 'TypeScript', 'Next.js App Router', and 'Tailwind CSS'.",
      boost: 8,
      type: "keywords",
    },
    {
      id: "fix-2",
      title: "Strengthen Impact Metrics in Work Experience",
      desc: "Change 'Built frontend components' to 'Architected responsive Next.js components improving load time by 35%'.",
      boost: 10,
      type: "impact",
    },
    {
      id: "fix-3",
      title: "Add GitHub & Portfolio Live Links",
      desc: "Include clickable project live URLs to increase recruiter engagement by 2.4x.",
      boost: 4,
      type: "links",
    },
  ];

  const scanSteps = [
    "Extracting text & formatting structure...",
    "Validating ATS parser compatibility...",
    "Matching keywords with top job openings...",
    "Generating AI optimization score...",
  ];

  return (
    <div className="h-full w-full bg-[#FAF9FF] text-[#18152B] font-sans antialiased flex flex-col select-none relative overflow-hidden">
      {/* Top Header */}
      <Header
        variant="back"
        title={mode === "upload" ? "Upload Resume" : "Resume ATS Optimization"}
        onBackClick={mode === "results" ? () => setMode("upload") : onBack}
        rightElement={
          mode === "results" ? (
            <button
              type="button"
              onClick={() => setMode("upload")}
              className="p-1.5 rounded-lg text-[#635BFF] hover:bg-[#F1EFFF] transition-colors text-[11.5px] font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-upload</span>
            </button>
          ) : undefined
        }
      />

      <AnimatePresence mode="wait">
        {/* =================================================================== */}
        {/* STAGE 1: RESUME UPLOAD UI                                           */}
        {/* =================================================================== */}
        {mode === "upload" && (
          <motion.div
            key="upload-stage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4 flex flex-col justify-between max-w-lg mx-auto w-full space-y-4"
          >
            <div className="space-y-4">
              {/* Headline */}
              <div className="text-center space-y-1 pt-1">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F1EFFF] text-[#635BFF] text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Powered ATS Scanner</span>
                </div>
                <h2 className="text-[20px] font-bold text-[#172033] tracking-tight">
                  Upload Your Resume
                </h2>
                <p className="text-[12px] text-[#667085] max-w-xs mx-auto">
                  Get instant ATS compatibility scoring, keyword gaps, and 1-click AI enhancements.
                </p>
              </div>

              {/* Drag & Drop Upload Card */}
              <label
                htmlFor="resume-file-input"
                className="block p-6 rounded-[22px] border-2 border-dashed border-[#C7D2FE] bg-white hover:bg-[#F8FAFF] hover:border-[#635BFF] transition-all cursor-pointer text-center space-y-3 shadow-2xs group"
              >
                <input
                  id="resume-file-input"
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-[#F1EFFF] to-[#EEF2FF] flex items-center justify-center mx-auto text-[#635BFF] group-hover:scale-105 transition-transform shadow-xs">
                  <FileUp className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-[14px] font-bold text-[#172033]">
                    Click to browse or drag & drop
                  </h3>
                  <p className="text-[11.5px] text-[#667085]">
                    Supports PDF or DOCX (Max 10 MB)
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#635BFF] bg-[#F1EFFF] px-3 py-1 rounded-full">
                  <Upload className="w-3 h-3" />
                  <span>Choose File</span>
                </div>
              </label>

              {/* Selected / Demo File Box */}
              <div className="p-3.5 rounded-[16px] bg-white border border-[#E8E5F2] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-[10px] bg-[#F1EFFF] text-[#635BFF] flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-bold text-[#172033] truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10.5px] text-[#667085]">{selectedFile.size} · Ready to scan</p>
                  </div>
                </div>

                <span className="text-[10.5px] font-bold text-[#22C995] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                  Loaded
                </span>
              </div>

              {/* Features List */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-[12px] text-[#475569]">
                  <CheckCircle2 className="w-4 h-4 text-[#22C995] shrink-0" />
                  <span>Instant ATS Compatibility Score (0 to 100)</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#475569]">
                  <CheckCircle2 className="w-4 h-4 text-[#22C995] shrink-0" />
                  <span>Missing skills & keyword density analysis</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#475569]">
                  <CheckCircle2 className="w-4 h-4 text-[#22C995] shrink-0" />
                  <span>1-Click AI action-verb rewrites & impact metrics</span>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={startScan}
                className="h-[48px] rounded-[14px] text-[14px] font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] shadow-md shadow-[#635BFF]/25"
              >
                <Sparkles className="w-4 h-4" />
                <span>Scan Resume with AI →</span>
              </Button>
            </div>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* STAGE 2: LIVE AI SCANNING ANIMATION                                 */}
        {/* =================================================================== */}
        {mode === "scanning" && (
          <motion.div
            key="scanning-stage"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex-1 min-h-0 p-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full space-y-6"
          >
            {/* Pulsing Animated Scanner Icon */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#635BFF]/15 animate-ping" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#635BFF] to-[#8B5CF6] flex items-center justify-center text-white shadow-xl relative z-10">
                <FileCheck className="w-9 h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-[19px] font-bold text-[#172033]">
                Analyzing Your Resume...
              </h2>
              <p className="text-[12.5px] text-[#635BFF] font-semibold">
                {scanSteps[scanStage]}
              </p>
            </div>

            {/* Progress Bar & Percent */}
            <div className="w-full max-w-xs space-y-2">
              <div className="h-2.5 w-full bg-[#E8EAF3] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#635BFF] to-[#22C995] rounded-full"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <div className="text-[12px] font-bold text-[#667085]">
                {scanProgress}% Completed
              </div>
            </div>

            <div className="p-3 rounded-[14px] bg-[#F1EFFF] text-[#635BFF] text-[11.5px] font-medium max-w-xs">
              Comparing against 10,000+ hired frontend & state exam candidate profiles...
            </div>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* STAGE 3: ATS SCORE & AI FIXES RESULTS                               */}
        {/* =================================================================== */}
        {mode === "results" && (
          <motion.div
            key="results-stage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4 space-y-4 max-w-lg mx-auto w-full"
          >
            {/* Current Resume Banner */}
            <div className="p-3.5 rounded-[16px] bg-white border border-[#E8E5F2] flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-[12px] bg-[#F1EFFF] flex items-center justify-center shrink-0 text-[#635BFF]">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[13px] font-bold text-[#172033] truncate">
                    {selectedFile.name}
                  </h3>
                  <p className="text-[11px] text-[#667085] flex items-center gap-1.5 mt-0.5">
                    <span>PDF · {selectedFile.size}</span>
                    <span>•</span>
                    <span className="text-[#22C995] font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> ATS Compatible
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* ATS Score Overview Card */}
            <div className="p-4 rounded-[20px] bg-gradient-to-br from-[#635BFF] to-[#8B5CF6] text-white shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                  Pathly ATS Scanner
                </span>
                <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                  {atsScore >= 90 ? "Excellent" : atsScore >= 75 ? "Good Match" : "Needs Review"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[32px] font-extrabold tracking-tight leading-none">
                    {atsScore}
                    <span className="text-[16px] font-medium text-white/70">/100</span>
                  </div>
                  <p className="text-[11.5px] text-white/90 leading-relaxed">
                    {appliedFixes.length === 3
                      ? "All optimizations applied! Your resume is top-tier."
                      : `Apply ${3 - appliedFixes.length} quick AI recommendations to reach 95%+`}
                  </p>
                </div>

                {/* Circular Progress Ring */}
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 52 52">
                    <circle
                      cx="26"
                      cy="26"
                      r="22"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="22"
                      stroke="#FFFFFF"
                      strokeWidth="5"
                      strokeDasharray="138.2"
                      initial={{ strokeDashoffset: 138.2 }}
                      animate={{ strokeDashoffset: 138.2 * (1 - atsScore / 100) }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <Sparkles className="w-5 h-5 text-white absolute" />
                </div>
              </div>
            </div>

            {/* 4 Score Pillars Grid */}
            <div className="grid grid-cols-2 gap-2">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-[14px] bg-white border border-[#E8E5F2] shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#667085] truncate">
                      {pillar.name}
                    </span>
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: pillar.color }}
                    >
                      {pillar.score}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#F1F3F9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pillar.score}%`,
                        backgroundColor: pillar.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Recommendations List */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between px-0.5">
                <h3 className="text-[14px] font-bold text-[#172033] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#635BFF]" />
                  <span>AI Recommended Fixes</span>
                </h3>
                <span className="text-[11px] text-[#667085]">
                  {appliedFixes.length} of {suggestions.length} applied
                </span>
              </div>

              <div className="space-y-2">
                {suggestions.map((sug) => {
                  const isApplied = appliedFixes.includes(sug.id);
                  return (
                    <div
                      key={sug.id}
                      className={cn(
                        "p-3.5 rounded-[16px] border transition-all duration-200 space-y-2",
                        isApplied
                          ? "bg-[#F0FDF4] border-[#BBF7D0]"
                          : "bg-white border-[#E8E5F2] hover:border-[#635BFF]/30 shadow-2xs"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-[12.5px] font-bold text-[#172033]">
                              {sug.title}
                            </h4>
                            <span className="text-[10px] font-bold text-[#635BFF] bg-[#F1EFFF] px-1.5 py-0.5 rounded-full shrink-0">
                              +{sug.boost} pts
                            </span>
                          </div>
                          <p className="text-[11.5px] text-[#667085] leading-relaxed">
                            {sug.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-1">
                        {isApplied ? (
                          <span className="text-[11px] font-bold text-[#15803D] flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            Fix Applied
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApplyFix(sug.id, sug.boost)}
                            className="px-3 py-1.5 rounded-lg bg-[#635BFF] text-white text-[11.5px] font-semibold hover:bg-[#5349E8] transition-all flex items-center gap-1 shadow-xs"
                          >
                            <Sparkles className="w-3 h-3" />
                            Apply AI Fix
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="pt-2 pb-1">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={onNext}
                className="h-[48px] rounded-[14px] text-[14px] font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-[#635BFF] to-[#8B5CF6]"
              >
                <span>Proceed to Skill Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
