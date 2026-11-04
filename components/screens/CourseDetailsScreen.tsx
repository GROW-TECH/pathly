"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Clock,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  Users,
  Play,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CourseItem } from "@/lib/coursesData";
import { cn } from "@/lib/utils";
import { learningApi } from "@/lib/api/learning";
import { Video, Calendar } from "lucide-react";

interface CourseDetailsScreenProps {
  course: CourseItem;
  onBack: () => void;
  onEnroll?: () => void;
  onConnectMentor?: () => void;
}

export function CourseDetailsScreen({
  course,
  onBack,
  onEnroll,
  onConnectMentor,
}: CourseDetailsScreenProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([course.modules[0]?.id || ""]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled || false);
  const [progress, setProgress] = useState(course.progress || 0);
  const [completedModules, setCompletedModules] = useState<string[]>(
    course.modules.filter((m) => m.isCompleted).map((m) => m.id)
  );
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load latest MongoDB progress and saved state
  useEffect(() => {
    let isMounted = true;
    async function loadCourseState() {
      try {
        const [savedList, enrichedCourses] = await Promise.all([
          learningApi.getSavedCourses().catch(() => []),
          learningApi.getCourses().catch(() => []),
        ]);

        if (!isMounted) return;

        // Check if saved
        const isSavedInDb = savedList.some((s) => s.course_id === course.id);
        setIsWishlisted(isSavedInDb);

        // Check enrollment and progress
        const dbCourse = enrichedCourses.find((c) => c.id === course.id);
        if (dbCourse) {
          setIsEnrolled(dbCourse.isEnrolled);
          setProgress(dbCourse.progress);
          if (dbCourse.completed_modules?.length) {
            setCompletedModules(dbCourse.completed_modules);
          }
          if (dbCourse.completed_lessons?.length) {
            setCompletedLessons(dbCourse.completed_lessons);
          }
        }
      } catch (err) {
        console.warn("Could not sync course state:", err);
      }
    }
    loadCourseState();
    return () => {
      isMounted = false;
    };
  }, [course.id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleToggleWishlist = async () => {
    setIsWishlisted((prev) => !prev);
    try {
      await learningApi.toggleSaveCourse(course.id);
    } catch (err) {
      console.warn("Error toggling save:", err);
    }
  };

  const handleEnrollOrContinue = async () => {
    if (!isEnrolled) {
      try {
        const res = await learningApi.enrollCourse(course.id);
        setIsEnrolled(true);
        setProgress(res.progress_percentage);
      } catch (err) {
        console.error("Enrollment failed:", err);
      }
    }
    if (onEnroll) {
      onEnroll();
    }
  };

  const handleToggleModuleCompletion = async (e: React.MouseEvent, moduleId: string) => {
    e.stopPropagation();
    if (isUpdating) return;
    setIsUpdating(true);

    const isCurrentlyCompleted = completedModules.includes(moduleId);
    const updatedModules = isCurrentlyCompleted
      ? completedModules.filter((id) => id !== moduleId)
      : [...completedModules, moduleId];

    setCompletedModules(updatedModules);

    try {
      const res = await learningApi.updateProgress(course.id, {
        moduleId,
        completed: !isCurrentlyCompleted,
      });
      setIsEnrolled(true);
      setProgress(res.progress_percentage);
      setCompletedLessons(res.completed_lessons);
      setCompletedModules(res.completed_modules);
    } catch (err) {
      console.error("Failed to update module progress:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleLessonCompletion = async (
    e: React.MouseEvent,
    moduleId: string,
    lessonIndex: number
  ) => {
    e.stopPropagation();
    if (isUpdating) return;
    setIsUpdating(true);

    const lessonKey = `${moduleId}-l${lessonIndex + 1}`;
    const isCurrentlyCompleted = completedLessons.includes(lessonKey);

    const updatedLessons = isCurrentlyCompleted
      ? completedLessons.filter((l) => l !== lessonKey)
      : [...completedLessons, lessonKey];

    setCompletedLessons(updatedLessons);

    try {
      const res = await learningApi.updateProgress(course.id, {
        lessonId: lessonKey,
        completed: !isCurrentlyCompleted,
      });
      setIsEnrolled(true);
      setProgress(res.progress_percentage);
      setCompletedLessons(res.completed_lessons);
      setCompletedModules(res.completed_modules);
    } catch (err) {
      console.error("Failed to update lesson progress:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons, 0);

  const levelColors = {
    Beginner: "success",
    Intermediate: "warning",
    Advanced: "brand",
  } as const;

  return (
    <div className="min-h-full w-full bg-[#FAF9FF] flex flex-col">
      {/* Hero / Header */}
      <div className="relative w-full h-[200px] bg-gradient-to-br from-[#4338CA] via-[#635BFF] to-[#8B5CF6] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-6 right-8 w-24 h-24 rounded-full bg-white/10 blur-xl" />
        <div className="absolute bottom-4 left-12 w-16 h-16 rounded-full bg-white/5 blur-lg" />

        {/* Back + Share + Bookmark */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5 stroke-[2]" />
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleToggleWishlist}
              className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors"
              title={isWishlisted ? "Remove from Saved" : "Save Course"}
            >
              <Heart className={cn("w-4.5 h-4.5", isWishlisted && "fill-current text-red-300")} />
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Course icon & Enrollment Status */}
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
          <div className="w-13 h-13 rounded-[16px] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-sm">
            <BookOpen className="w-6.5 h-6.5 text-white" />
          </div>
          {isEnrolled && (
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#BBF7D0]" />
              <span>{progress}% Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar -mt-3 relative z-10">
        <div className="bg-[#FAF9FF] rounded-t-[20px] px-5 pt-5 pb-32 space-y-5">
          {/* Title & Provider */}
          <div className="space-y-2">
            <h1 className="text-[19px] font-bold text-[#172033] tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-[12.5px] text-[#667085] font-medium">{course.provider}</p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <Badge variant={levelColors[course.level] as any} size="sm">
                {course.level}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="font-bold text-[#172033]">{course.rating}</span>
                <span className="text-[#94A3B8]">({course.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-[#667085]">
                <Clock className="w-3.5 h-3.5" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1 text-[#667085]">
                <Users className="w-3.5 h-3.5" />
                <span>{course.reviewCount}+ students</span>
              </div>
            </div>

            {/* Live Progress Bar for Enrolled Students */}
            {isEnrolled && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-[#635BFF]">Your Course Progress</span>
                  <span className="font-bold text-[#172033]">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#635BFF] to-[#22C995] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-[14px] font-bold text-[#172033]">About this course</h3>
            <p className="text-[12.5px] text-[#667085] leading-relaxed">{course.description}</p>
          </div>

          {/* What you'll learn */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-[#172033]">What you&apos;ll learn</h3>
            <div className="space-y-2">
              {course.whatYouLearn.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#15803D] stroke-[3]" />
                  </div>
                  <span className="text-[12.5px] text-[#172033] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-[#172033]">Skills you&apos;ll gain</h3>
            <div className="flex flex-wrap gap-1.5">
              {course.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] font-semibold text-[#635BFF] bg-[#EEF2FF] border border-[#C7D2FE] rounded-full px-2.5 py-1"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 1-on-1 Live Mentor Connect */}
          {onConnectMentor && (
            <div className="p-4 rounded-[16px] bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] border border-[#DDD6FE] space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#635BFF] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#172033]">
                    1-on-1 Live Mentor Connect
                  </h4>
                  <p className="text-[11px] text-[#667085]">
                    Included in course • Google Meet 1:1 session
                  </p>
                </div>
              </div>
              <p className="text-[11.5px] text-[#475569] leading-relaxed">
                Stuck on a project or need code review? Connect live with senior engineers from Google,
                Amazon & Microsoft.
              </p>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={onConnectMentor}
                className="bg-white border-[#635BFF] text-[#635BFF] hover:bg-[#F8F7FF] font-semibold text-[12px] h-9"
                leftIcon={<Calendar className="w-3.5 h-3.5 text-[#635BFF]" />}
              >
                Schedule Google Meet Session →
              </Button>
            </div>
          )}

          {/* Course Syllabus with Interactive Progress Tracking */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-bold text-[#172033]">Course Syllabus</h3>
                <p className="text-[11px] text-[#667085]">Click checkmarks to track lesson completions</p>
              </div>
              <span className="text-[11px] text-[#667085]">
                {course.modules.length} modules • {totalLessons} lessons
              </span>
            </div>

            <div className="space-y-2.5">
              {course.modules.map((module, idx) => {
                const isExpanded = expandedModules.includes(module.id);
                const isModuleDone = completedModules.includes(module.id);

                return (
                  <div
                    key={module.id}
                    className="bg-white rounded-[14px] border border-[#E8E5F2] overflow-hidden shadow-2xs"
                  >
                    <div className="w-full flex items-center justify-between p-3.5">
                      <div
                        onClick={() => toggleModule(module.id)}
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                      >
                        <button
                          type="button"
                          onClick={(e) => handleToggleModuleCompletion(e, module.id)}
                          className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors",
                            isModuleDone
                              ? "bg-[#DCFCE7] text-[#15803D]"
                              : "bg-[#F1F5F9] text-[#667085] hover:bg-[#E2E8F0]"
                          )}
                          title="Mark module complete"
                        >
                          {isModuleDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12.5px] font-semibold text-[#172033] truncate">
                            {module.title}
                          </p>
                          <p className="text-[10.5px] text-[#94A3B8]">
                            {module.lessons} lessons • {module.duration}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleToggleModuleCompletion(e, module.id)}
                          className={cn(
                            "text-[10.5px] font-semibold px-2 py-0.5 rounded-full border transition-all",
                            isModuleDone
                              ? "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]"
                              : "bg-white text-[#667085] border-[#E2E8F0] hover:border-[#635BFF]"
                          )}
                        >
                          {isModuleDone ? "Completed" : "Mark Done"}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleModule(module.id)}
                          className="p-1 text-[#94A3B8]"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#94A3B8] shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
                          )}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-[#F1F5F9] bg-[#FAFAFC]"
                        >
                          <div className="px-3.5 py-2.5 space-y-1.5">
                            {Array.from({ length: module.lessons }).map((_, li) => {
                              const lessonKey = `${module.id}-l${li + 1}`;
                              const isLessonDone =
                                isModuleDone || completedLessons.includes(lessonKey);

                              return (
                                <div
                                  key={li}
                                  onClick={(e) => handleToggleLessonCompletion(e, module.id, li)}
                                  className={cn(
                                    "flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-colors text-[11.5px]",
                                    isLessonDone
                                      ? "bg-[#F0FDF4] text-[#15803D]"
                                      : "hover:bg-white text-[#475467]"
                                  )}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={cn(
                                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                                        isLessonDone
                                          ? "bg-[#22C995] text-white border-[#22C995]"
                                          : "bg-white text-[#94A3B8] border-[#CBD5E1]"
                                      )}
                                    >
                                      {isLessonDone ? (
                                        <Check className="w-3 h-3 stroke-[3]" />
                                      ) : (
                                        <Play className="w-2 h-2 text-[#94A3B8] ml-0.5" />
                                      )}
                                    </div>
                                    <span
                                      className={cn(
                                        "font-medium",
                                        isLessonDone && "line-through opacity-80"
                                      )}
                                    >
                                      Lesson {li + 1}: {module.title} (Part {li + 1})
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-[#94A3B8]">
                                    {isLessonDone ? "Done" : "15m"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="sticky bottom-0 w-full bg-white/95 backdrop-blur-lg border-t border-[#E8E5F2] px-5 py-3 z-20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-[#667085] block font-medium">Pricing</span>
            <span className="text-[16px] font-bold text-[#172033]">
              {course.price || "Free"}
            </span>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleEnrollOrContinue}
            className="flex-1 max-w-[220px] bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] rounded-[14px] shadow-lg shadow-[#635BFF]/25 font-bold"
          >
            {isEnrolled ? "Continue Learning" : "Start Learning"}
          </Button>
        </div>
      </div>
    </div>
  );
}
