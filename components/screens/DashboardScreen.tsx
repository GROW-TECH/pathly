"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  BriefcaseBusiness,
  BookOpen,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  Bell,
  Home,
  User,
  Building2,
  Landmark,
  Laptop,
  CheckCircle2,
  RotateCcw,
  X,
  Send,
  ChevronRight,
  Bookmark,
  Briefcase,
  Check,
  Menu,
  FileText,
  Search,
  MessageSquare,
  Video,
  Award,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { JobDetailsScreen } from "@/components/screens/JobDetailsScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { LearnScreen } from "@/components/screens/LearnScreen";
import { CourseDetailsScreen } from "@/components/screens/CourseDetailsScreen";
import { SkillAssessmentScreen } from "@/components/screens/SkillAssessmentScreen";
import { AiCoachScreen } from "@/components/screens/AiCoachScreen";
import { InterviewPrepScreen } from "@/components/screens/InterviewPrepScreen";
import { MockInterviewScreen } from "@/components/screens/MockInterviewScreen";
import { ApplicationsScreen } from "@/components/screens/ApplicationsScreen";
import { CareerGrowthScreen } from "@/components/screens/CareerGrowthScreen";
import { NotificationsScreen } from "@/components/screens/NotificationsScreen";
import { SubscriptionScreen } from "@/components/screens/SubscriptionScreen";
import { ResumeScreen } from "@/components/screens/ResumeScreen";
import { SkillGapScreen } from "@/components/screens/SkillGapScreen";
import { InterviewOutcomeAnalyzerScreen } from "@/components/screens/InterviewOutcomeAnalyzerScreen";
import { MentorConnectScreen } from "@/components/screens/MentorConnectScreen";
import { BottomNav, NavTabId } from "@/components/layout/BottomNav";
import { SideMenu } from "@/components/layout/SideMenu";
import { Header } from "@/components/layout/Header";
import { JobCard } from "@/components/career/JobCard";
import { DETAILED_JOBS_AND_EXAMS } from "@/lib/jobsData";
import { COURSES_DATA, getCourseById } from "@/lib/coursesData";
import { useAuth } from "@/lib/context/AuthContext";

interface DashboardScreenProps {
  onRestartDemo?: () => void;
}

type SubScreenType =
  | "job_details"
  | "course_details"
  | "skill_assessment"
  | "interview_prep"
  | "mock_interview"
  | "interview_debrief"
  | "mentor_connect"
  | "applications"
  | "career_growth"
  | "notifications"
  | "subscription"
  | "resume"
  | "skill_gap"
  | null;

export function DashboardScreen({ onRestartDemo }: DashboardScreenProps) {
  const { user, profile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTabId>("home");
  const [subScreen, setSubScreen] = useState<SubScreenType>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>("course-1");
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>(["job-1"]);
  const [jobsFilter, setJobsFilter] = useState<"all" | "tech" | "govt">("all");
  const [jobsSearch, setJobsSearch] = useState("");

  const toggleSaveJob = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const handleSideNav = (route: string) => {
    setIsSideMenuOpen(false);
    if (route === "/dashboard") {
      setActiveTab("home");
      setSubScreen(null);
    } else if (route === "/jobs") {
      setActiveTab("jobs");
      setSubScreen(null);
    } else if (route === "/learn") {
      setActiveTab("learn");
      setSubScreen(null);
    } else if (route === "/ai-coach") {
      setActiveTab("ai");
      setSubScreen(null);
    } else if (route === "/interview-prep") {
      setSubScreen("interview_prep");
    } else if (route === "/interview-debrief") {
      setSubScreen("interview_debrief");
    } else if (route === "/mentor-connect") {
      setSubScreen("mentor_connect");
    } else if (route === "/career-progress") {
      setSubScreen("career_growth");
    } else if (route === "/subscription") {
      setSubScreen("subscription");
    } else if (route === "/resume-scanner") {
      setSubScreen("resume");
    } else if (route === "/skill-gap") {
      setSubScreen("skill_gap");
    } else if (route === "/applications" || route.startsWith("/applications")) {
      setSubScreen("applications");
    } else if (route === "/login") {
      onRestartDemo?.();
    }
  };

  // ---------------------------------------------------------------------------
  // SUB-SCREENS ROUTING
  // ---------------------------------------------------------------------------
  if (subScreen === "job_details" && selectedJobId) {
    const activeJobDetail =
      DETAILED_JOBS_AND_EXAMS[selectedJobId] || DETAILED_JOBS_AND_EXAMS["job-1"];
    return (
      <JobDetailsScreen
        job={activeJobDetail}
        isSaved={savedJobs.includes(activeJobDetail.id)}
        onToggleSave={(id) => toggleSaveJob(id)}
        onBack={() => setSubScreen(null)}
        onNavigateToLearn={() => {
          setSubScreen(null);
          setActiveTab("learn");
        }}
      />
    );
  }

  if (subScreen === "course_details" && selectedCourseId) {
    const course = getCourseById(selectedCourseId) || COURSES_DATA[0];
    return (
      <CourseDetailsScreen
        course={course}
        onBack={() => setSubScreen(null)}
        onConnectMentor={() => setSubScreen("mentor_connect")}
      />
    );
  }

  if (subScreen === "skill_assessment") {
    return (
      <SkillAssessmentScreen
        onBack={() => setSubScreen(null)}
        onComplete={() => setSubScreen(null)}
      />
    );
  }

  if (subScreen === "interview_prep") {
    return (
      <InterviewPrepScreen
        onBack={() => setSubScreen(null)}
        onStartMockInterview={() => setSubScreen("mock_interview")}
      />
    );
  }

  if (subScreen === "mock_interview") {
    return (
      <MockInterviewScreen
        onBack={() => setSubScreen(null)}
        onNavigateToLearn={() => {
          setSubScreen(null);
          setActiveTab("learn");
        }}
        onNavigateToDebrief={() => setSubScreen("interview_debrief")}
      />
    );
  }

  if (subScreen === "interview_debrief") {
    return (
      <InterviewOutcomeAnalyzerScreen
        onBack={() => setSubScreen(null)}
        onNavigateToLearn={() => {
          setSubScreen(null);
          setActiveTab("learn");
        }}
        onNavigateToJobs={() => {
          setSubScreen(null);
          setActiveTab("jobs");
        }}
      />
    );
  }

  if (subScreen === "mentor_connect") {
    return (
      <MentorConnectScreen
        onBack={() => setSubScreen(null)}
      />
    );
  }

  if (subScreen === "applications") {
    return (
      <ApplicationsScreen
        onBack={() => setSubScreen(null)}
        onSelectJob={(id) => {
          setSelectedJobId(id);
          setSubScreen("job_details");
        }}
      />
    );
  }

  if (subScreen === "career_growth") {
    return (
      <CareerGrowthScreen
        onBack={() => setSubScreen(null)}
      />
    );
  }

  if (subScreen === "notifications") {
    return (
      <NotificationsScreen
        onBack={() => setSubScreen(null)}
      />
    );
  }

  if (subScreen === "subscription") {
    return (
      <SubscriptionScreen
        onBack={() => setSubScreen(null)}
        onSubscribe={() => setSubScreen(null)}
        onConnectMentor={() => setSubScreen("mentor_connect")}
      />
    );
  }

  if (subScreen === "resume") {
    return (
      <ResumeScreen
        onNext={() => setSubScreen("skill_gap")}
        onBack={() => setSubScreen(null)}
      />
    );
  }

  if (subScreen === "skill_gap") {
    return (
      <SkillGapScreen
        onNext={() => setSubScreen(null)}
        onBack={() => setSubScreen(null)}
        onExploreCourse={(courseId) => {
          setSelectedCourseId(courseId);
          setSubScreen("course_details");
        }}
      />
    );
  }

  // Raw job objects for lists
  const allJobsList = [
    {
      id: "job-1",
      title: "Frontend Developer",
      company: "Google",
      location: "Chennai",
      type: "Full-time",
      workMode: "Hybrid" as const,
      salary: "₹6–10 LPA",
      postedAt: "2d ago",
      matchScore: 92,
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      category: "tech",
    },
    {
      id: "job-2",
      title: "Frontend Engineer",
      company: "Microsoft",
      location: "Bangalore",
      type: "Full-time",
      workMode: "On-site" as const,
      salary: "₹8–12 LPA",
      postedAt: "1d ago",
      matchScore: 88,
      skills: ["React", "JavaScript", "Redux", "REST API"],
      category: "tech",
    },
    {
      id: "job-3",
      title: "Assistant Section Officer (ASO)",
      company: "TNPSC Group 2",
      location: "Chennai",
      type: "Government",
      workMode: "On-site" as const,
      salary: "₹37k–1.2L /mo",
      postedAt: "Exam: Nov 24",
      matchScore: 85,
      skills: ["General Studies", "Aptitude", "Tamil Eligibility"],
      category: "govt",
    },
    {
      id: "job-4",
      title: "UI/UX Developer",
      company: "Swiggy",
      location: "Remote",
      type: "Full-time",
      workMode: "Remote" as const,
      salary: "₹5–9 LPA",
      postedAt: "3d ago",
      matchScore: 82,
      skills: ["Figma", "HTML/CSS", "React", "Design Systems"],
      category: "tech",
    },
  ];

  const filteredJobs = allJobsList.filter((job) => {
    const matchesCategory =
      jobsFilter === "all" ||
      (jobsFilter === "tech" && job.category === "tech") ||
      (jobsFilter === "govt" && job.category === "govt");
    const matchesSearch =
      !jobsSearch ||
      job.title.toLowerCase().includes(jobsSearch.toLowerCase()) ||
      job.company.toLowerCase().includes(jobsSearch.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(jobsSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full w-full bg-[#FAF9FF] text-[#18152B] font-sans antialiased flex flex-col select-none relative overflow-hidden">
      {/* Side Menu Drawer */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        onNavigate={handleSideNav}
        onLogout={async () => {
          setIsSideMenuOpen(false);
          await logout();
          onRestartDemo?.();
        }}
        userName={user?.full_name || "Alex Morgan"}
        userEmail={user?.email || "alex.morgan@pathly.ai"}
      />

      {/* TOP HEADER */}
      <header className="shrink-0 h-[56px] bg-white/95 backdrop-blur-md border-b border-[#E8E5F2] px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSideMenuOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#667085] hover:bg-[#F1EFFF] hover:text-[#635BFF] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo size="sm" showAiBadge />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubScreen("notifications")}
            className="w-8 h-8 rounded-full bg-[#FAFAFC] border border-[#E8E5F2] text-[#667085] flex items-center justify-center hover:text-[#18152B] transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#635BFF] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs shadow-xs"
            aria-label="User profile"
          >
            {user?.full_name ? user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "AM"}
          </button>
        </div>
      </header>

      {/* MAIN SCROLLABLE CONTENT */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
        {/* ========================================================================= */}
        {/* TAB 1: HOME                                                               */}
        {/* ========================================================================= */}
        {activeTab === "home" && (
          <motion.div
            key="home-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 space-y-4 max-w-lg mx-auto"
          >
            {/* Track Eyebrow */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1EFFF] border border-[#E8E5F2] text-[11px] font-semibold text-[#635BFF] cursor-pointer hover:bg-[#E9E4FF] transition-colors">
              <Laptop className="w-3.5 h-3.5 text-[#635BFF]" />
              <span>{profile?.target_role ? `${profile.target_role} Path` : "Frontend Engineer Path"}</span>
              <span className="text-[#98A2B3]">•</span>
              <span className="text-[#22C995] font-bold">85% Readiness</span>
              <ChevronRight className="w-3 h-3 text-[#635BFF] ml-0.5" />
            </div>

            {/* Greeting */}
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <h1 className="text-[20px] font-bold text-[#18152B] tracking-tight">
                  Hello, {user?.full_name || "Alex Morgan"} 👋
                </h1>
                <p className="text-[12px] text-[#667085] leading-relaxed">
                  Your AI career roadmap is ready. You have 3 recommended lessons waiting to help you become interview-ready.
                </p>
              </div>

              {/* 3D Character Illustration */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-[96px] h-[96px] sm:w-[104px] sm:h-[104px] shrink-0 rounded-2xl overflow-hidden shadow-xs border border-[#E8E5F2] bg-[#F4F2FF]"
              >
                <img
                  src="/images/dashboard-hero-3d.jpg"
                  alt="Alex Morgan"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </motion.div>
            </div>

            {/* Career Readiness Score Card */}
            <div
              onClick={() => setSubScreen("career_growth")}
              className="p-3.5 rounded-[18px] bg-white border border-[#E8E5F2] shadow-sm flex items-center justify-between gap-3.5 cursor-pointer hover:border-[#635BFF]/40 transition-all"
            >
              <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 44 44">
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    stroke="#E9E7F5"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="22"
                    cy="22"
                    r="18"
                    stroke="#22C995"
                    strokeWidth="4"
                    strokeDasharray="113.1"
                    initial={{ strokeDashoffset: 113.1 }}
                    animate={{ strokeDashoffset: 113.1 * (1 - 0.85) }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11.5px] font-extrabold text-[#18152B]">
                  85%
                </span>
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-bold text-[#18152B]">Career Readiness</h3>
                </div>
                <p className="text-[11px] font-medium text-[#667085]">High Match Potential</p>
                <div className="h-[5px] w-full bg-[#E9E7F5] rounded-full overflow-hidden mt-1">
                  <div className="h-full w-[85%] bg-gradient-to-r from-[#635BFF] to-[#22C995] rounded-full" />
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#98A2B3] shrink-0" />
            </div>

            {/* My Career 2x2 Grid */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-0.5">
                <h2 className="text-[15px] font-bold text-[#18152B]">My Career</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("jobs")}
                  className="text-[12px] font-semibold text-[#635BFF] hover:underline flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Jobs */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("jobs")}
                  className="p-3 rounded-[16px] bg-white border border-[#E9E7F2] hover:border-[#635BFF]/30 shadow-xs flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-[32px] h-[32px] rounded-[10px] bg-[#F1EFFF] flex items-center justify-center shrink-0">
                      <BriefcaseBusiness className="w-4 h-4 text-[#635BFF]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[12px] font-semibold text-[#18152B] truncate">Jobs</h4>
                      <p className="text-[10px] text-[#667085] truncate">14 Open Roles</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#98A2B3]" />
                </motion.div>

                {/* Skill Roadmap */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("learn")}
                  className="p-3 rounded-[16px] bg-white border border-[#E9E7F2] hover:border-[#635BFF]/30 shadow-xs flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-[32px] h-[32px] rounded-[10px] bg-[#EFF6FF] flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[12px] font-semibold text-[#18152B] truncate">Skill Roadmap</h4>
                      <p className="text-[10px] text-[#667085] truncate">4 Active Lessons</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#98A2B3]" />
                </motion.div>

                {/* AI Interview */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSubScreen("interview_prep")}
                  className="p-3 rounded-[16px] bg-white border border-[#E9E7F2] hover:border-[#635BFF]/30 shadow-xs flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-[32px] h-[32px] rounded-[10px] bg-[#F7F5FF] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[12px] font-semibold text-[#18152B] truncate">AI Interview</h4>
                      <p className="text-[10px] text-[#667085] truncate">3 Sessions</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#98A2B3]" />
                </motion.div>

                {/* Career Growth */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSubScreen("career_growth")}
                  className="p-3 rounded-[16px] bg-white border border-[#E9E7F2] hover:border-[#635BFF]/30 shadow-xs flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-[32px] h-[32px] rounded-[10px] bg-[#ECFBF5] flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4 text-[#22C995]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[12px] font-semibold text-[#18152B] truncate">Career Growth</h4>
                      <p className="text-[10px] text-[#667085] truncate">Top 10% in Level</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#98A2B3]" />
                </motion.div>
              </div>

              {/* Live Mentor & Interview Debrief Row */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* 1:1 Live Mentor */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSubScreen("mentor_connect")}
                  className="p-3 rounded-[16px] bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] border border-[#DDD6FE] hover:border-[#8B5CF6]/50 shadow-xs flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-[30px] h-[30px] rounded-[10px] bg-[#635BFF] flex items-center justify-center shrink-0 text-white">
                      <Video className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[11.5px] font-bold text-[#18152B] truncate">1:1 Mentor</h4>
                      <p className="text-[9.5px] text-[#635BFF] font-semibold truncate">Google Meet</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-[#8B5CF6]" />
                </motion.div>

                {/* Real Interview Debrief */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSubScreen("interview_debrief")}
                  className="p-3 rounded-[16px] bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] border border-[#A7F3D0] hover:border-[#10B981]/50 shadow-xs flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-[30px] h-[30px] rounded-[10px] bg-[#10B981] flex items-center justify-center shrink-0 text-white">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[11.5px] font-bold text-[#18152B] truncate">AI Debrief</h4>
                      <p className="text-[9.5px] text-[#059669] font-semibold truncate">Pass/Fail Analysis</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-[#10B981]" />
                </motion.div>
              </div>

              {/* Quick Resume Scanner Banner */}
              <div
                onClick={() => setSubScreen("resume")}
                className="p-3.5 rounded-[16px] bg-gradient-to-r from-[#F0FDF4] to-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-between cursor-pointer hover:border-[#38BDF8] transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-[10px] bg-[#0284C7] flex items-center justify-center shrink-0 text-white shadow-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[12px] font-bold text-[#0F172A] truncate">Resume ATS Scanner</h4>
                      <span className="text-[9.5px] font-extrabold bg-[#22C995] text-white px-1.5 py-0.2 rounded-full">Score 78%</span>
                    </div>
                    <p className="text-[10px] text-[#64748B] truncate">Upload & optimize your resume for AI match</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#0284C7] shrink-0" />
              </div>
            </div>

            {/* In-Progress Course Card */}
            <div
              onClick={() => {
                setSelectedCourseId("course-1");
                setSubScreen("course_details");
              }}
              className="p-4 rounded-[18px] bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white shadow-md cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                  Continue Learning
                </span>
                <span className="text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  65% Done
                </span>
              </div>
              <h3 className="text-[14px] font-bold mb-1">
                React 18 & Next.js Full Stack Mastery
              </h3>
              <p className="text-[11px] text-white/80 mb-3">
                Module 3: Server Components & Actions
              </p>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full w-[65%]" />
              </div>
            </div>

            {/* AI-Recommended Jobs */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-0.5">
                <div>
                  <h2 className="text-[15px] font-bold text-[#18152B]">AI-Recommended Jobs</h2>
                  <p className="text-[11px] text-[#667085]">Based on your skills & preferences</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("jobs")}
                  className="text-[12px] font-semibold text-[#635BFF] hover:underline flex items-center gap-0.5"
                >
                  <span>View all (14)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {allJobsList.slice(0, 3).map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobs.includes(job.id)}
                    onToggleSave={(id) => toggleSaveJob(id)}
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setSubScreen("job_details");
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Quick AI Help Banner */}
            <div
              onClick={() => setActiveTab("ai")}
              className="p-3.5 rounded-[16px] bg-[#F1EFFF] border border-[#E8E5F2] flex items-center justify-between cursor-pointer hover:bg-[#EAE6FF] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#635BFF] text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[12px] font-bold text-[#18152B]">Ask Pathly AI</h4>
                  <p className="text-[10.5px] text-[#667085]">Get instant career, interview & resume advice</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#635BFF]" />
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: JOBS LISTING                                                       */}
        {/* ========================================================================= */}
        {activeTab === "jobs" && (
          <motion.div
            key="jobs-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 space-y-3.5 max-w-lg mx-auto"
          >
            <div>
              <h1 className="text-[18px] font-bold text-[#18152B]">Find Opportunities</h1>
              <p className="text-[12px] text-[#667085]">Matched based on your skills & preferences</p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
              <input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                value={jobsSearch}
                onChange={(e) => setJobsSearch(e.target.value)}
                className="w-full h-10 pl-9.5 pr-4 rounded-xl bg-white border border-[#E8E5F2] text-[13px] outline-none focus:border-[#635BFF] transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setJobsFilter("all")}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                  jobsFilter === "all"
                    ? "bg-[#635BFF] text-white shadow-xs"
                    : "bg-white text-[#667085] border border-[#E8E5F2]"
                }`}
              >
                All Roles
              </button>
              <button
                type="button"
                onClick={() => setJobsFilter("tech")}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                  jobsFilter === "tech"
                    ? "bg-[#635BFF] text-white shadow-xs"
                    : "bg-white text-[#667085] border border-[#E8E5F2]"
                }`}
              >
                Tech & Engineering
              </button>
              <button
                type="button"
                onClick={() => setJobsFilter("govt")}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                  jobsFilter === "govt"
                    ? "bg-[#635BFF] text-white shadow-xs"
                    : "bg-white text-[#667085] border border-[#E8E5F2]"
                }`}
              >
                Govt Exams
              </button>
            </div>

            {/* Job Cards */}
            <div className="space-y-2.5 pt-1">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedJobs.includes(job.id)}
                  onToggleSave={(id) => toggleSaveJob(id)}
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setSubScreen("job_details");
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: LEARN                                                              */}
        {/* ========================================================================= */}
        {activeTab === "learn" && (
          <LearnScreen
            onSelectCourse={(courseId) => {
              setSelectedCourseId(courseId);
              setSubScreen("course_details");
            }}
            onNavigateToSubscription={() => setSubScreen("subscription")}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 4: AI COACH                                                           */}
        {/* ========================================================================= */}
        {activeTab === "ai" && (
          <AiCoachScreen
            onSelectCourse={(courseId) => {
              setSelectedCourseId(courseId);
              setSubScreen("course_details");
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PROFILE                                                            */}
        {/* ========================================================================= */}
        {activeTab === "profile" && (
          <ProfileScreen
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onSelectJob={(id) => {
              setSelectedJobId(id);
              setSubScreen("job_details");
            }}
            onRestartOnboarding={onRestartDemo}
          />
        )}
      </div>

      {/* BOTTOM NAVIGATION */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setSubScreen(null);
          setActiveTab(tab);
        }}
      />
    </div>
  );
}
