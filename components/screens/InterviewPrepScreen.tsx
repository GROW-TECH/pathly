"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Brain,
  Users,
  Briefcase,
  ChevronRight,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";

interface InterviewPrepScreenProps {
  onBack?: () => void;
  onStartMockInterview?: () => void;
}

interface QuestionCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bg: string;
  totalQuestions: number;
  completedQuestions: number;
}

const QUESTION_CATEGORIES: QuestionCategory[] = [
  {
    id: "technical",
    title: "Technical Questions",
    subtitle: "Based on your role",
    icon: Brain,
    color: "#635BFF",
    bg: "#EEF2FF",
    totalQuestions: 25,
    completedQuestions: 8,
  },
  {
    id: "behavioral",
    title: "Behavioral Questions",
    subtitle: "STAR method practice",
    icon: Users,
    color: "#3B82F6",
    bg: "#EFF6FF",
    totalQuestions: 15,
    completedQuestions: 3,
  },
  {
    id: "hr",
    title: "HR Questions",
    subtitle: "Common HR scenarios",
    icon: Briefcase,
    color: "#8B5CF6",
    bg: "#F5F3FF",
    totalQuestions: 12,
    completedQuestions: 5,
  },
  {
    id: "situational",
    title: "Situational Questions",
    subtitle: "Real-world scenarios",
    icon: Target,
    color: "#0EA5E9",
    bg: "#F0F9FF",
    totalQuestions: 10,
    completedQuestions: 0,
  },
];

const SAMPLE_QUESTIONS = [
  "Tell me about yourself and your background.",
  "What are your strengths and weaknesses?",
  "Explain a challenging project you worked on.",
  "How do you handle disagreements with team members?",
  "Where do you see yourself in 5 years?",
  "Why do you want to work at our company?",
  "Describe a time you failed and what you learned.",
  "How do you prioritize tasks when under pressure?",
];

export function InterviewPrepScreen({
  onBack,
  onStartMockInterview,
}: InterviewPrepScreenProps) {
  const [activeTab, setActiveTab] = useState("mock");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const totalCompleted = QUESTION_CATEGORIES.reduce((acc, c) => acc + c.completedQuestions, 0);
  const totalQuestions = QUESTION_CATEGORIES.reduce((acc, c) => acc + c.totalQuestions, 0);
  const progressPercent = Math.round((totalCompleted / totalQuestions) * 100);

  const tabs = [
    { id: "mock", label: "Mock Interview" },
    { id: "questions", label: "Questions" },
  ];

  return (
    <div className="min-h-full w-full bg-[#FAF9FF] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E5F2] px-4 pt-4 pb-4">
        <div className="flex items-center gap-3 mb-3">
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
              Interview Prep
            </h1>
            <p className="text-[11px] text-[#667085]">
              Practice. Prepare. Get hired.
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-[#F8FAFC] rounded-[12px] border border-[#E4E7EC] p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#172033]">Preparation Progress</span>
            <span className="text-[11px] font-bold text-[#635BFF]">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-[#E4E7EC] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[10px] text-[#94A3B8]">
            <span>{totalCompleted} completed</span>
            <span>{totalQuestions} total questions</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4 pb-2">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="pill"
          fullWidth
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6">
        <AnimatePresence mode="wait">
          {activeTab === "mock" && (
            <motion.div
              key="mock"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 pt-2"
            >
              {/* AI Mock Interview Card */}
              <div className="bg-gradient-to-br from-[#4338CA] via-[#635BFF] to-[#8B5CF6] rounded-[16px] p-5 text-white relative overflow-hidden">
                <div className="absolute top-3 right-3 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                <div className="relative z-10 space-y-3">
                  <div className="w-11 h-11 rounded-[12px] bg-white/15 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-5.5 h-5.5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold">AI Mock Interview</h3>
                    <p className="text-[12px] text-white/75 mt-1">
                      Practice with our AI interviewer. Get real-time feedback on your answers, communication, and confidence.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={onStartMockInterview}
                    className="bg-white text-[#635BFF] border-white/30 hover:bg-white/90 font-bold rounded-[12px] shadow-none"
                    leftIcon={<Play className="w-4 h-4" />}
                  >
                    Start Mock Interview
                  </Button>
                </div>
              </div>

              {/* Question Categories */}
              <div className="space-y-3">
                <h3 className="text-[14px] font-bold text-[#172033]">
                  Practice by Category
                </h3>
                {QUESTION_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const progress = Math.round(
                    (cat.completedQuestions / cat.totalQuestions) * 100
                  );
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className="w-full bg-white rounded-[14px] border border-[#E8E5F2] p-3.5 flex items-center gap-3 hover:border-[#C7D2FE] hover:shadow-sm transition-all text-left active:scale-[0.99]"
                    >
                      <div
                        className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: cat.bg }}
                      >
                        <Icon className="w-5 h-5" style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#172033]">
                          {cat.title}
                        </p>
                        <p className="text-[10.5px] text-[#94A3B8] mt-0.5">
                          {cat.subtitle} • {cat.completedQuestions}/{cat.totalQuestions} done
                        </p>
                        <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: cat.color,
                            }}
                          />
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "questions" && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3 pt-2"
            >
              <h3 className="text-[14px] font-bold text-[#172033]">
                Common Interview Questions
              </h3>
              {SAMPLE_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-full bg-white rounded-[12px] border border-[#E8E5F2] p-3.5 flex items-start gap-3 hover:border-[#C7D2FE] transition-all text-left active:scale-[0.99]"
                >
                  <div className="w-7 h-7 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[11px] font-bold text-[#667085] shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-[12.5px] font-medium text-[#172033] leading-relaxed">
                      {q}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] mt-0.5 shrink-0" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
