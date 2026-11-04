"use client";

import React from "react";
import { Clock, Star, ArrowUpRight, Sparkles } from "lucide-react";
import { CourseRecommendation } from "@/lib/api/ai";

interface CourseRecommendationCardProps {
  course: CourseRecommendation;
  onSelectCourse?: (courseId: string) => void;
}

export function CourseRecommendationCard({
  course,
  onSelectCourse,
}: CourseRecommendationCardProps) {
  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-emerald-50 text-emerald-700";
      case "intermediate":
        return "bg-violet-50 text-violet-700";
      case "advanced":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-[#F4F4F5] text-[#525252]";
    }
  };

  return (
    <div className="w-full rounded-2xl border border-[#E5E5E5] bg-white p-4 transition-colors hover:bg-[#FAFAFA]">
      {course.why_recommended && (
        <div className="mb-2.5 flex items-start gap-1.5 text-[12px] leading-snug text-[#635BFF]">
          <Sparkles className="mt-[1px] h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-2">{course.why_recommended}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-[14px] font-semibold leading-snug text-[#171717]">{course.title}</h4>
          <p className="mt-0.5 text-[12px] text-[#737373]">
            {course.provider} · <span className="font-medium text-[#262626]">{course.price}</span>
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getLevelColor(
            course.level
          )}`}
        >
          {course.level}
        </span>
      </div>

      {course.description && (
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-[#525252]">
          {course.description}
        </p>
      )}

      {course.skills && course.skills.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {course.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-[#F4F4F5] px-2.5 py-0.5 text-[11px] text-[#525252]"
            >
              {skill}
            </span>
          ))}
          {course.skills.length > 4 && (
            <span className="px-1 py-0.5 text-[11px] text-[#A3A3A3]">
              +{course.skills.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="mt-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[12px] text-[#737373]">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1 font-medium text-[#262626]">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {course.rating}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelectCourse && onSelectCourse(course.id)}
          className="inline-flex items-center gap-1 rounded-full bg-[#171717] px-3.5 py-1.5 text-[12px] font-medium text-white transition-all hover:bg-[#262626] active:scale-95"
        >
          <span>View course</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}