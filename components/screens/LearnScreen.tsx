"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Lock,
  Crown,
  GraduationCap,
  Laptop,
  BarChart3,
  Compass,
  Landmark,
  RotateCcw,
  Trophy,
  Target,
  Zap,
  Play,
  UserCheck,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SearchInput } from "@/components/ui/SearchInput";
import { Tabs } from "@/components/ui/Tabs";
import { CourseCard } from "@/components/career/CourseCard";
import { COURSE_CATEGORIES } from "@/lib/coursesData";
import { cn } from "@/lib/utils";
import {
  learningApi,
  EnrichedCourse,
  UserRoadmap,
  LearningDashboardData,
  SavedCourseItem,
} from "@/lib/api/learning";

interface LearnScreenProps {
  onSelectCourse: (courseId: string) => void;
  onBack?: () => void;
  onNavigateToSubscription?: () => void;
  onNavigateToProfile?: () => void;
}

type LearnTab = "courses" | "roadmaps" | "saved";

export function LearnScreen({
  onSelectCourse,
  onBack,
  onNavigateToSubscription,
  onNavigateToProfile,
}: LearnScreenProps) {
  const [activeTab, setActiveTab] = useState<LearnTab>("courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Dynamic MongoDB state
  const [dashboardData, setDashboardData] = useState<LearningDashboardData | null>(null);
  const [courses, setCourses] = useState<EnrichedCourse[]>([]);
  const [roadmap, setRoadmap] = useState<UserRoadmap | null>(null);
  const [savedCourses, setSavedCourses] = useState<SavedCourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingRoadmap, setIsUpdatingRoadmap] = useState(false);

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    setIsLoading(true);
    try {
      const [dash, courseList, rMap, saved] = await Promise.all([
        learningApi.getDashboard().catch(() => null),
        learningApi.getCourses().catch(() => []),
        learningApi.getRoadmap().catch(() => null),
        learningApi.getSavedCourses().catch(() => []),
      ]);

      if (dash) setDashboardData(dash);
      if (courseList.length > 0) setCourses(courseList);
      if (rMap) setRoadmap(rMap);
      setSavedCourses(saved);
    } catch (err) {
      console.warn("Error loading learning module data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSave = async (courseId: string) => {
    // Optimistic toggle
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isSaved: !c.isSaved } : c))
    );

    try {
      await learningApi.toggleSaveCourse(courseId);
      const updatedSaved = await learningApi.getSavedCourses();
      setSavedCourses(updatedSaved);
    } catch (err) {
      console.error("Failed to toggle save:", err);
      // Revert optimistic update
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, isSaved: !c.isSaved } : c))
      );
    }
  };

  const handleToggleMilestone = async (milestoneId: string, currentStatus: string) => {
    const isCompleted = currentStatus === "completed";
    try {
      const updated = await learningApi.toggleMilestone(milestoneId, !isCompleted);
      setRoadmap(updated);
      learningApi.getDashboard().then((d) => d && setDashboardData(d));
    } catch (err) {
      console.error("Failed to toggle milestone:", err);
    }
  };

  const handleUpdateRoadmap = async () => {
    setIsUpdatingRoadmap(true);
    try {
      const updated = await learningApi.generateRoadmap();
      setRoadmap(updated);
      const dash = await learningApi.getDashboard();
      if (dash) setDashboardData(dash);
    } catch (err) {
      console.error("Failed to update roadmap:", err);
    } finally {
      setIsUpdatingRoadmap(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = activeCategory === "all" || c.category === activeCategory;
    const matchesSearch = searchQuery
      ? c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCategory && matchesSearch;
  });

  const activeEnrolledCourses = courses.filter((c) => c.isEnrolled);
  const continueCourse =
    activeEnrolledCourses.find((c) => c.status !== "completed") || activeEnrolledCourses[0];

  const learnTabs = [
    { id: "courses", label: "Courses" },
    { id: "roadmaps", label: "Roadmaps" },
    { id: "saved", label: `Saved (${savedCourses.length})` },
  ];

  // Helper icon for roadmap track
  const getTrackIcon = (iconType: string) => {
    switch (iconType) {
      case "data":
        return { Icon: BarChart3, color: "#10B981", bg: "#ECFDF5" };
      case "design":
        return { Icon: Compass, color: "#F59E0B", bg: "#FEF3C7" };
      case "govt":
        return { Icon: Landmark, color: "#635BFF", bg: "#EEF2FF" };
      default:
        return { Icon: Laptop, color: "#635BFF", bg: "#EEF2FF" };
    }
  };

  return (
    <div className="h-full w-full bg-[#FAF9FF] flex flex-col overflow-hidden">
      {/* Header */}
      <Header
        variant="back"
        title="Learn & Pathways"
        onBackClick={onBack}
        rightElement={
          onNavigateToSubscription && (
            <button
              type="button"
              onClick={onNavigateToSubscription}
              className="inline-flex items-center gap-1 bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white text-[10.5px] font-bold px-2.5 py-1 rounded-full shadow-2xs hover:opacity-90 transition-all"
            >
              <Crown className="w-3 h-3" />
              <span>Get Pro</span>
            </button>
          )
        }
      />

      {/* Tab Switcher */}
      <div className="px-4 pb-2 shrink-0">
        <Tabs
          tabs={learnTabs}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as LearnTab)}
          variant="pill"
          fullWidth
        />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4 space-y-4 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* ================================================================= */}
          {/* TAB 1: COURSES & DASHBOARD                                        */}
          {/* ================================================================= */}
          {activeTab === "courses" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* LEARNING DASHBOARD OVERVIEW METRICS */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-white border border-[#E8E5F2] shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#667085]">Active Courses</span>
                    <div className="w-6 h-6 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#635BFF]">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[20px] font-bold text-[#172033]">
                      {dashboardData?.active_courses_count ?? 0}
                    </span>
                    <span className="text-[10px] text-[#635BFF] font-semibold">Enrolled</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#E8E5F2] shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#667085]">Completed</span>
                    <div className="w-6 h-6 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#15803D]">
                      <Trophy className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[20px] font-bold text-[#172033]">
                      {dashboardData?.completed_courses_count ?? 0}
                    </span>
                    <span className="text-[10px] text-[#15803D] font-semibold">Finished</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#E8E5F2] shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#667085]">Skills Gained</span>
                    <div className="w-6 h-6 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#B45309]">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[20px] font-bold text-[#172033]">
                      {dashboardData?.skills_improved_count ?? 0}
                    </span>
                    <span className="text-[10px] text-[#B45309] font-semibold">Skills</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#E8E5F2] shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#667085]">Overall Progress</span>
                    <div className="w-6 h-6 rounded-lg bg-[#F5F3FF] flex items-center justify-center text-[#635BFF]">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[20px] font-bold text-[#172033]">
                      {dashboardData?.overall_progress_percentage ?? 0}%
                    </span>
                    <span className="text-[10px] text-[#635BFF] font-semibold">Tracked</span>
                  </div>
                </div>
              </div>

              {/* CONTINUE LEARNING HERO BANNER */}
              {continueCourse && (
                <div className="p-4 rounded-[18px] bg-gradient-to-r from-[#172033] to-[#2B354F] text-white space-y-3 shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A5B4FC]">
                        <Play className="w-3 h-3 fill-current" />
                        <span>Continue Learning</span>
                      </div>
                      <h4 className="text-[14px] font-bold text-white line-clamp-1">
                        {continueCourse.title}
                      </h4>
                      <p className="text-[11px] text-white/70">
                        {continueCourse.provider} · {continueCourse.duration}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-[#A5B4FC] bg-white/10 px-2 py-0.5 rounded-full shrink-0">
                      {continueCourse.progress}% Done
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#635BFF] to-[#22C995] rounded-full transition-all duration-300"
                      style={{ width: `${continueCourse.progress}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCourse(continueCourse.id)}
                    className="w-full h-9 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white text-[12px] font-bold shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Resume Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Category Filters */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {COURSE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "inline-flex items-center whitespace-nowrap text-[11.5px] font-semibold rounded-full border px-3 h-8 transition-all shrink-0",
                      activeCategory === cat.id
                        ? "bg-[#635BFF] text-white border-[#635BFF] shadow-xs"
                        : "bg-white text-[#667085] border-[#E8E5F2] hover:border-[#635BFF]/30"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                placeholder="Search courses, skills, roadmaps..."
              />

              {/* Course Catalog List */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between px-0.5">
                  <h3 className="text-[14px] font-bold text-[#172033]">
                    {searchQuery ? "Search Results" : "Featured & In-Demand Courses"}
                  </h3>
                  <span className="text-[11px] text-[#667085]">{filteredCourses.length} available</span>
                </div>

                {filteredCourses.length > 0 ? (
                  <div className="space-y-3">
                    {filteredCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        {...course}
                        isSaved={course.isSaved}
                        isEnrolled={course.isEnrolled}
                        progress={course.progress}
                        onToggleSave={() => handleToggleSave(course.id)}
                        onSelect={() => onSelectCourse(course.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-10 text-center space-y-2">
                    <Search className="w-8 h-8 text-[#94A3B8]" />
                    <p className="text-[13px] font-semibold text-[#667085]">
                      No courses found matching &quot;{searchQuery}&quot;
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: PERSONALIZED AI CAREER ROADMAP (MATCHES SCREENSHOT EXACTLY) */}
          {/* ================================================================= */}
          {activeTab === "roadmaps" && (
            <motion.div
              key="roadmaps"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Top Banner (Identical to Screenshot) */}
              <div className="p-4 rounded-[18px] bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white space-y-1 shadow-sm">
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-white/80">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Personalized Roadmaps</span>
                </div>
                <h3 className="text-[16px] font-bold">Your Custom Career Pathways</h3>
                <p className="text-[11.5px] text-white/80 leading-relaxed">
                  Curated sequence of lessons and projects tailored to your target roles.
                </p>
              </div>

              {/* Check if Profile is incomplete */}
              {!roadmap?.target_role ? (
                <div className="p-6 rounded-[18px] bg-white border border-[#E8E5F2] text-center space-y-3 shadow-2xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#635BFF] mx-auto">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-[14px] font-bold text-[#172033]">
                    Complete Your Profile to Generate Your Career Roadmap
                  </h4>
                  <p className="text-[11.5px] text-[#667085] max-w-xs mx-auto leading-relaxed">
                    Set your target career role and skills to unlock your personalized learning milestones.
                  </p>
                  {onNavigateToProfile && (
                    <button
                      type="button"
                      onClick={onNavigateToProfile}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white text-[12px] font-bold shadow-sm hover:opacity-95 transition-all inline-flex items-center gap-1.5"
                    >
                      <span>Complete Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                /* Dynamic Roadmap Card (Identical to Screenshot) */
                (() => {
                  const { Icon, color, bg } = getTrackIcon(roadmap.icon_type);
                  const progressValue = roadmap.progress ?? roadmap.overall_progress ?? 0;

                  return (
                    <div className="p-4 rounded-[18px] bg-white border border-[#E8E5F2] shadow-2xs space-y-3.5">
                      {/* Card Header: Icon + Title + Progress + Active Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 shadow-xs"
                            style={{ backgroundColor: bg }}
                          >
                            <Icon className="w-5 h-5" style={{ color }} />
                          </div>
                          <div>
                            <h4 className="text-[13.5px] font-bold text-[#172033] leading-tight">
                              {roadmap.title}
                            </h4>
                            <p className="text-[11px] text-[#667085] font-medium mt-0.5">
                              {progressValue}% Overall Progress
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold text-[#635BFF] bg-[#F1EFFF] px-2.5 py-0.5 rounded-full shrink-0">
                          Active
                        </span>
                      </div>

                      {/* Overall Progress Bar */}
                      <div className="h-1.5 w-full bg-[#F1F3F9] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progressValue}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>

                      {/* Milestone List Header */}
                      <div className="space-y-2 pt-1 border-t border-[#F1F3F9]">
                        <div className="flex items-center justify-between">
                          <h5 className="text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                            Pathway Milestones
                          </h5>
                          <span className="text-[10px] text-[#94A3B8]">
                            {roadmap.completed_milestones} of {roadmap.total_milestones} Done
                          </span>
                        </div>

                        {/* Sequential Milestones List */}
                        <div className="space-y-1.5">
                          {roadmap.milestones?.map((m) => {
                            const isDone = m.status === "completed";
                            const isCurrent = m.status === "current";

                            return (
                              <div
                                key={m.id}
                                onClick={() => handleToggleMilestone(m.id, m.status)}
                                className={cn(
                                  "flex items-center justify-between text-[11.5px] p-2 rounded-lg cursor-pointer transition-all border",
                                  isDone
                                    ? "bg-[#F8FAFC] border-transparent"
                                    : isCurrent
                                    ? "bg-[#F5F3FF] border-[#DDD6FE]"
                                    : "bg-[#F8FAFC] border-transparent"
                                )}
                              >
                                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-[#22C995] shrink-0" />
                                  ) : isCurrent ? (
                                    <div className="w-4 h-4 rounded-full border-2 border-[#635BFF] border-t-transparent animate-spin shrink-0" />
                                  ) : (
                                    <Lock className="w-4 h-4 text-[#94A3B8] shrink-0" />
                                  )}

                                  <span
                                    className={cn(
                                      "truncate",
                                      isDone
                                        ? "text-[#172033] font-medium"
                                        : isCurrent
                                        ? "text-[#635BFF] font-bold"
                                        : "text-[#94A3B8] font-medium"
                                    )}
                                  >
                                    {m.title}
                                  </span>
                                </div>

                                <span
                                  className={cn(
                                    "text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0",
                                    isDone
                                      ? "bg-[#DCFCE7] text-[#15803D]"
                                      : isCurrent
                                      ? "bg-[#EEF2FF] text-[#635BFF]"
                                      : "bg-[#F1F5F9] text-[#94A3B8]"
                                  )}
                                >
                                  {isDone ? "Done" : isCurrent ? "Current" : "Upcoming"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Buttons: Continue Roadmap Modules & Update My Roadmap */}
                      <div className="pt-2 space-y-2">
                        <button
                          type="button"
                          onClick={() => onSelectCourse(roadmap.course_id || "course-1")}
                          className="w-full h-9 rounded-xl bg-[#F1EFFF] text-[#635BFF] text-[12px] font-bold hover:bg-[#635BFF] hover:text-white transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Continue Roadmap Modules</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={handleUpdateRoadmap}
                          disabled={isUpdatingRoadmap}
                          className="w-full h-9 rounded-xl bg-white border border-[#E8E5F2] text-[#475467] hover:text-[#635BFF] hover:border-[#635BFF]/40 text-[11.5px] font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <Sparkles
                            className={cn("w-3.5 h-3.5 text-[#635BFF]", isUpdatingRoadmap && "animate-spin")}
                          />
                          <span>{isUpdatingRoadmap ? "Updating Roadmap..." : "Update My Roadmap"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: SAVED COURSES                                              */}
          {/* ================================================================= */}
          {activeTab === "saved" && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between px-0.5">
                <h3 className="text-[14px] font-bold text-[#172033]">
                  Saved & Wishlisted Courses
                </h3>
                <span className="text-[11px] text-[#667085]">{savedCourses.length} saved</span>
              </div>

              {savedCourses.length > 0 ? (
                <div className="space-y-3">
                  {savedCourses.map((item) => {
                    const c =
                      courses.find((x) => x.id === item.course_id) || item.course_details;
                    if (!c) return null;

                    return (
                      <CourseCard
                        key={item.id}
                        {...c}
                        isSaved={true}
                        onToggleSave={() => handleToggleSave(item.course_id)}
                        onSelect={() => onSelectCourse(item.course_id)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center py-12 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#F1F5F9] flex items-center justify-center text-[#94A3B8]">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <p className="text-[13px] font-bold text-[#172033]">No Saved Courses Yet</p>
                  <p className="text-[11.5px] text-[#667085] max-w-xs">
                    Click the bookmark icon on any course to save it for later review.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
