"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  CheckCircle2,
  Star,
  ChevronRight,
  Sparkles,
  Zap,
  Trophy,
  Shield,
  Briefcase,
  Layers,
  HelpCircle,
  MessageSquare,
  DollarSign,
  Users,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CareerGrowthScreenProps {
  onBack?: () => void;
  onExploreCourse?: (courseId: string) => void;
  onExploreJobs?: () => void;
}

type GrowthTab = "ladder" | "workplace" | "skills" | "achievements";

interface CompetencyItem {
  name: string;
  status: string;
  courseId?: string;
}

interface PromotionStage {
  level: string;
  title: string;
  salary: string;
  status: string;
  color: string;
  timeframe?: string;
  competencies: CompetencyItem[];
}

export function CareerGrowthScreen({
  onBack,
  onExploreCourse,
  onExploreJobs,
}: CareerGrowthScreenProps) {
  const [activeTab, setActiveTab] = useState<GrowthTab>("ladder");
  const [selectedSustainabilityTip, setSelectedSustainabilityTip] = useState<string | null>(null);

  const promotionStages: PromotionStage[] = [
    {
      level: "Level 1 (Current)",
      title: "Junior Frontend Engineer",
      salary: "₹6–8 LPA",
      status: "current",
      color: "#635BFF",
      competencies: [
        { name: "Component Architecture", status: "mastered" },
        { name: "Responsive UI & Tailwind", status: "mastered" },
        { name: "REST API Integration", status: "in-progress" },
      ],
    },
    {
      level: "Level 2 (Next Stage Target)",
      title: "Senior Frontend Engineer",
      salary: "₹14–20 LPA",
      status: "target",
      color: "#22C995",
      timeframe: "Next 6–12 months",
      competencies: [
        { name: "Next.js App Router & SSR Caching", status: "needed", courseId: "course-1" },
        { name: "Frontend Performance & Web Vitals", status: "needed", courseId: "course-3" },
        { name: "Automated Testing (Jest/Cypress)", status: "needed", courseId: "course-4" },
        { name: "Cross-Functional Code Reviews", status: "needed" },
      ],
    },
    {
      level: "Level 3 (Future Goal)",
      title: "Staff Engineer / Tech Lead",
      salary: "₹28–38 LPA",
      status: "future",
      color: "#8B5CF6",
      timeframe: "2–3 years",
      competencies: [
        { name: "System Design & Micro-frontends", status: "locked" },
        { name: "Engineering Team Mentorship", status: "locked" },
        { name: "Technical Roadmap Ownership", status: "locked" },
      ],
    },
  ];

  const workplaceGuides = [
    {
      id: "w1",
      title: "First 90 Days Survival in Company",
      desc: "How to impress your team, handle onboarding tasks, and build trust with your engineering manager.",
      tips: [
        "Ask clarifying questions early during sprint planning instead of getting blocked.",
        "Document setup steps in team Notion to show proactive contribution.",
        "Request bi-weekly 1-on-1s with your tech lead to align on expectations.",
      ],
    },
    {
      id: "w2",
      title: "Handling Sprint Pressure & Tight Deadlines",
      desc: "Proven techniques to manage workload without burning out while keeping stakeholders aligned.",
      tips: [
        "Break complex tickets into sub-tasks (Spikes) before starting to code.",
        "Communicate blockers in daily standups at least 24 hours before deadline.",
        "Use AI tools to accelerate boilerplate tests and repetitive tasks.",
      ],
    },
    {
      id: "w3",
      title: "Annual Appraisal & Salary Hike Strategy",
      desc: "Step-by-step formula to showcase business impact and negotiate 25%+ appraisals.",
      tips: [
        "Maintain a 'Brag Sheet' documenting bugs fixed, performance gains, and mentorship.",
        "Quantify your contribution in numbers (e.g. 'Improved checkout load time by 32%').",
        "Benchmark current market rates for your target role 2 months before appraisal.",
      ],
    },
    {
      id: "w4",
      title: "Navigating Team Code Reviews & Feedback",
      desc: "Turn PR feedback into career accelerators without taking critique personally.",
      tips: [
        "Keep Pull Requests small (<300 lines) so teammates review them promptly.",
        "Add screenshots and test proof to every PR description.",
        "Thank reviewers for catching edge cases and document lessons learned.",
      ],
    },
  ];

  const skillProgress = [
    { name: "React 18 & Next.js", level: 88, color: "#635BFF" },
    { name: "TypeScript", level: 70, color: "#3B82F6" },
    { name: "System Architecture", level: 60, color: "#8B5CF6" },
    { name: "Performance Optimization", level: 65, color: "#22C995" },
    { name: "Code Review & Mentoring", level: 75, color: "#F59E0B" },
  ];

  const achievements = [
    { title: "First Pro Course Complete", desc: "Web Development Bootcamp", icon: BookOpen, earned: true },
    { title: "ATS Resume Optimized", desc: "95% ATS Compatibility Score", icon: Award, earned: true },
    { title: "Interview Ready", desc: "Completed 5 AI Mock Interviews", icon: Target, earned: true },
    { title: "Promotion Milestone", desc: "Target Senior Role in Progress", icon: Trophy, earned: false },
  ];

  return (
    <div className="h-full w-full bg-[#FAF9FF] text-[#18152B] font-sans antialiased flex flex-col select-none relative overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-[#E8E5F2] px-4 pt-4 pb-3 shrink-0">
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
              Career Growth & Promotion Ladder
            </h1>
            <p className="text-[11px] text-[#667085]">
              Continuous advancement, workplace survival & appraisal growth.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-2 bg-[#F1F3F9] border-b border-[#E8E5F2] overflow-x-auto no-scrollbar shrink-0 px-4">
        {[
          { id: "ladder" as GrowthTab, label: "🚀 Promotion Ladder" },
          { id: "workplace" as GrowthTab, label: "🏢 Workplace AI Guide" },
          { id: "skills" as GrowthTab, label: "📊 Skill Progress" },
          { id: "achievements" as GrowthTab, label: "🏆 Milestones" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[11.5px] font-bold whitespace-nowrap transition-all",
              activeTab === tab.id
                ? "bg-white text-[#635BFF] shadow-xs"
                : "text-[#667085] hover:text-[#172033]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Body */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4 space-y-4 max-w-lg mx-auto w-full">
        {/* ================================================================= */}
        {/* TAB 1: PROMOTION LADDER & NEXT STAGE                             */}
        {/* ================================================================= */}
        {activeTab === "ladder" && (
          <motion.div
            key="ladder-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Header Value Prop Banner */}
            <div className="p-4 rounded-[20px] bg-gradient-to-br from-[#172033] to-[#2B354F] text-white space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#A5B4FC] uppercase tracking-wider">
                  Post-Employment Career Trajectory
                </span>
                <span className="text-[10px] font-bold bg-[#22C995] text-white px-2 py-0.5 rounded-full">
                  Target: Senior Level
                </span>
              </div>
              <h2 className="text-[16px] font-bold">Your Next Career Promotion Stage</h2>
              <p className="text-[11.5px] text-white/80 leading-relaxed">
                You are currently at <span className="font-bold text-white">Junior Level (₹6–8 LPA)</span>. Master 3 key senior competencies to reach <span className="font-bold text-[#22C995]">₹14–20 LPA</span> in the next 6–12 months.
              </p>
            </div>

            {/* Stages Vertical Timeline */}
            <div className="space-y-3">
              {promotionStages.map((stage, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-4 rounded-[18px] border transition-all space-y-3",
                    stage.status === "target"
                      ? "bg-gradient-to-b from-[#F7F6FF] to-white border-[#635BFF] shadow-sm ring-2 ring-[#635BFF]/15"
                      : "bg-white border-[#E8E5F2] shadow-2xs"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10.5px] font-bold text-[#667085] uppercase">
                        {stage.level}
                      </span>
                      <h3 className="text-[14.5px] font-bold text-[#172033] mt-0.5">
                        {stage.title}
                      </h3>
                      {stage.timeframe && (
                        <p className="text-[11px] text-[#635BFF] font-semibold">
                          Timeline: {stage.timeframe}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[14px] font-extrabold text-[#172033]">
                        {stage.salary}
                      </span>
                      <span
                        className={cn(
                          "block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 text-center",
                          stage.status === "current"
                            ? "bg-[#EEF2FF] text-[#635BFF]"
                            : stage.status === "target"
                            ? "bg-[#DCFCE7] text-[#15803D]"
                            : "bg-[#F1F5F9] text-[#94A3B8]"
                        )}
                      >
                        {stage.status === "current"
                          ? "Current"
                          : stage.status === "target"
                          ? "Next Target"
                          : "Future Goal"}
                      </span>
                    </div>
                  </div>

                  {/* Competency Checklist */}
                  <div className="space-y-1.5 pt-1 border-t border-[#F1F3F9]">
                    <h4 className="text-[11px] font-bold text-[#667085] uppercase">
                      Required Competencies
                    </h4>
                    <div className="space-y-1">
                      {stage.competencies.map((comp, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex items-center justify-between text-[11.5px] p-2 rounded-lg bg-[#F8FAFC]"
                        >
                          <div className="flex items-center gap-2">
                            {comp.status === "mastered" ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C995] shrink-0" />
                            ) : comp.status === "needed" ? (
                              <Zap className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                            ) : (
                              <Target className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                            )}
                            <span className="font-medium text-[#172033]">{comp.name}</span>
                          </div>

                          {comp.courseId && onExploreCourse && (
                            <button
                              type="button"
                              onClick={() => comp.courseId && onExploreCourse(comp.courseId)}
                              className="text-[10.5px] font-bold text-[#635BFF] hover:underline"
                            >
                              Learn Course →
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Related Senior Job Suggestion */}
            {onExploreJobs && (
              <div
                onClick={onExploreJobs}
                className="p-3.5 rounded-[16px] bg-[#F1EFFF] border border-[#E8E5F2] flex items-center justify-between cursor-pointer hover:bg-[#EAE6FF] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#635BFF] text-white flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12.5px] font-bold text-[#172033]">
                      View Matching Senior Roles (₹14–20 LPA)
                    </h4>
                    <p className="text-[11px] text-[#667085]">
                      See open roles matching your next stage trajectory.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#635BFF]" />
              </div>
            )}
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: WORKPLACE SUSTAINABILITY & PERFORMANCE GUIDE              */}
        {/* ================================================================= */}
        {activeTab === "workplace" && (
          <motion.div
            key="workplace-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3.5"
          >
            <div className="p-3.5 rounded-[16px] bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/80">
                <Shield className="w-3.5 h-3.5" />
                <span>Workplace Survival & Growth Coach</span>
              </div>
              <h3 className="text-[15px] font-bold">How to Sustain & Excel in Your Company</h3>
              <p className="text-[11.5px] text-white/80">
                Actionable playbooks for probation success, sprint pressure, appraisals, and conflict management.
              </p>
            </div>

            <div className="space-y-3">
              {workplaceGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="p-4 rounded-[18px] bg-white border border-[#E8E5F2] shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-[10px] bg-[#F1EFFF] text-[#635BFF] flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[13.5px] font-bold text-[#172033]">
                        {guide.title}
                      </h4>
                      <p className="text-[11.5px] text-[#667085] mt-0.5">
                        {guide.desc}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-[#F1F3F9]">
                    {guide.tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-[11.5px] text-[#475569] p-2 rounded-lg bg-[#F8FAFC]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C995] shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: SKILL PROGRESS                                            */}
        {/* ================================================================= */}
        {activeTab === "skills" && (
          <motion.div
            key="skills-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-4 rounded-[18px] bg-white border border-[#E8E5F2] shadow-2xs space-y-3">
              <h3 className="text-[13.5px] font-bold text-[#172033] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#635BFF]" />
                <span>Verified Skill Mastery</span>
              </h3>

              <div className="space-y-3">
                {skillProgress.map((sp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#172033]">{sp.name}</span>
                      <span className="font-extrabold text-[#635BFF]">{sp.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#F1F3F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${sp.level}%`, backgroundColor: sp.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: ACHIEVEMENTS & MILESTONES                                  */}
        {/* ================================================================= */}
        {activeTab === "achievements" && (
          <motion.div
            key="achievements-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-2">
              {achievements.map((ach, idx) => {
                const Icon = ach.icon;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "p-3.5 rounded-[16px] border text-center space-y-2",
                      ach.earned
                        ? "bg-[#F0FDF4] border-[#BBF7D0]"
                        : "bg-white border-[#E8E5F2] opacity-70"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full mx-auto flex items-center justify-center",
                        ach.earned ? "bg-[#22C995] text-white" : "bg-slate-100 text-slate-400"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold text-[#172033]">{ach.title}</h4>
                      <p className="text-[10px] text-[#667085] mt-0.5">{ach.desc}</p>
                    </div>
                    <span
                      className={cn(
                        "inline-block text-[9.5px] font-bold px-2 py-0.5 rounded-full",
                        ach.earned ? "bg-[#DCFCE7] text-[#15803D]" : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {ach.earned ? "Earned" : "In Progress"}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
