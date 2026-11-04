"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Target,
  Briefcase,
  TrendingUp,
  Plus,
  Check,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SkillGapScreenProps {
  onNext: () => void;
  onBack?: () => void;
  onExploreCourse?: (courseId: string) => void;
}

export function SkillGapScreen({ onNext, onBack, onExploreCourse }: SkillGapScreenProps) {
  const [addedSkills, setAddedSkills] = useState<string[]>([]);

  const toggleAddSkill = (skill: string) => {
    if (addedSkills.includes(skill)) {
      setAddedSkills(addedSkills.filter((s) => s !== skill));
    } else {
      setAddedSkills([...addedSkills, skill]);
    }
  };

  const acquiredSkills = [
    { name: "React.js", level: "Advanced", score: 92 },
    { name: "JavaScript ES6+", level: "Advanced", score: 88 },
    { name: "Tailwind CSS", level: "Intermediate", score: 85 },
    { name: "REST API Integration", level: "Intermediate", score: 80 },
  ];

  const gapSkills = [
    {
      name: "TypeScript",
      priority: "High",
      importance: "Required in 84% of Frontend jobs",
      courseRecommendation: "TypeScript for React Developers",
      courseId: "course-3",
    },
    {
      name: "Next.js App Router",
      priority: "High",
      importance: "Required for modern fullstack & SSR roles",
      courseRecommendation: "Next.js 14 Full Stack Mastery",
      courseId: "course-1",
    },
    {
      name: "Jest & React Testing Library",
      priority: "Medium",
      importance: "Required in 62% of Mid/Senior positions",
      courseRecommendation: "Automated Testing for Frontend",
      courseId: "course-4",
    },
  ];

  return (
    <div className="h-full w-full bg-[#FAF9FF] text-[#18152B] font-sans antialiased flex flex-col select-none relative overflow-hidden">
      {/* Header */}
      <Header
        variant="back"
        title="Skill Gap Analysis"
        onBackClick={onBack}
      />

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4 space-y-4 max-w-lg mx-auto w-full">
        {/* Dream Role Card */}
        <div className="p-4 rounded-[20px] bg-gradient-to-br from-[#172033] to-[#2B354F] text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A5B4FC]">
              Target Career Pathway
            </span>
            <span className="text-[11px] font-bold bg-[#635BFF] text-white px-2.5 py-0.5 rounded-full">
              75% Match
            </span>
          </div>

          <div>
            <h2 className="text-[17px] font-bold text-white">
              Frontend Engineer (Mid/Senior)
            </h2>
            <p className="text-[12px] text-white/70 mt-0.5">
              Average Salary: ₹8–14 LPA · 42 Open Positions in Chennai/Bangalore
            </p>
          </div>

          <div className="pt-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-white/80 mb-1.5">
              <span>Overall Role Readiness</span>
              <span className="font-bold text-[#22C995]">4 of 6 Core Skills Met</span>
            </div>
            <div className="h-2 w-full bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#635BFF] to-[#22C995] rounded-full w-[75%]" />
            </div>
          </div>
        </div>

        {/* Missing Gap Skills Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-[14px] font-bold text-[#172033] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <span>Missing High-Demand Skills</span>
            </h3>
            <span className="text-[11px] font-semibold text-[#EF4444]">
              {gapSkills.length} Critical Gaps
            </span>
          </div>

          <div className="space-y-2">
            {gapSkills.map((gap, idx) => {
              const isAdded = addedSkills.includes(gap.name);
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-[16px] bg-white border border-[#E8E5F2] shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13px] font-bold text-[#172033]">
                          {gap.name}
                        </h4>
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full",
                            gap.priority === "High"
                              ? "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]"
                              : "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]"
                          )}
                        >
                          {gap.priority} Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-[#667085]">
                        {gap.importance}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleAddSkill(gap.name)}
                      className={cn(
                        "p-1.5 rounded-lg border transition-all shrink-0",
                        isAdded
                          ? "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]"
                          : "bg-[#F1EFFF] text-[#635BFF] border-[#E8E5F2] hover:bg-[#635BFF] hover:text-white"
                      )}
                      title={isAdded ? "Added to plan" : "Add to learning goal"}
                    >
                      {isAdded ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Recommended Course Link */}
                  <div
                    onClick={() => onExploreCourse?.(gap.courseId)}
                    className="p-2 rounded-[10px] bg-[#F8FAFF] border border-[#E8E5F2] flex items-center justify-between cursor-pointer hover:border-[#635BFF]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#635BFF] shrink-0" />
                      <span className="text-[11.5px] font-semibold text-[#172033] truncate">
                        {gap.courseRecommendation}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#635BFF] shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acquired Skills Section */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-[14px] font-bold text-[#172033] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C995]" />
              <span>Skills You Already Have</span>
            </h3>
            <span className="text-[11px] text-[#22C995] font-semibold">
              Verified & Strong
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {acquiredSkills.map((skill, idx) => (
              <div
                key={idx}
                className="p-3 rounded-[14px] bg-white border border-[#E8E5F2] shadow-2xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-[12px] font-bold text-[#172033] truncate">
                    {skill.name}
                  </h4>
                  <Check className="w-3.5 h-3.5 text-[#22C995]" />
                </div>
                <div className="flex items-center justify-between text-[10.5px] text-[#667085]">
                  <span>{skill.level}</span>
                  <span className="font-semibold text-[#172033]">{skill.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="p-4 bg-white/95 backdrop-blur-md border-t border-[#E8E5F2] shrink-0 max-w-lg mx-auto w-full">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onNext}
          className="h-[48px] rounded-[14px] text-[14px] font-semibold flex items-center justify-center gap-2"
        >
          <span>Continue to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
