"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Clock, BarChart3, BookOpen, Crown, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CourseCardProps {
  id: string;
  title: string;
  provider: string;
  rating: number;
  reviewCount?: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price?: string;
  progress?: number;
  thumbnail?: string;
  skills?: string[];
  isEnrolled?: boolean;
  isSaved?: boolean;
  onSelect?: () => void;
  onToggleSave?: (e: React.MouseEvent) => void;
  className?: string;
}

export function CourseCard({
  id,
  title,
  provider,
  rating,
  reviewCount,
  duration,
  level,
  price = "Free",
  progress,
  thumbnail,
  skills,
  isEnrolled = false,
  isSaved = false,
  onSelect,
  onToggleSave,
  className,
}: CourseCardProps) {
  const levelColors = {
    Beginner: "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]",
    Intermediate: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    Advanced: "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]",
  };

  const isPro = price.toLowerCase().includes("pro") || price.toLowerCase().includes("premium") || price.includes("₹");

  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      onClick={onSelect}
      className={cn(
        "bg-white rounded-[16px] border border-[#E8E5F2] overflow-hidden cursor-pointer hover:border-[#635BFF]/40 hover:shadow-md transition-all duration-200 relative group",
        className
      )}
    >
      {/* Top Banner / Thumbnail */}
      <div className="relative w-full h-[125px] bg-gradient-to-br from-[#EEF2FF] via-[#F5F3FF] to-[#FAF9FF] flex items-center justify-center overflow-hidden">
        <BookOpen className="w-10 h-10 text-[#A5B4FC] stroke-[1.2]" />

        {/* Free / Pro Badge */}
        <div className="absolute top-2.5 left-2.5">
          {isPro ? (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
              <Crown className="w-3 h-3" /> PRO
            </span>
          ) : (
            <span className="bg-[#22C995] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
              FREE
            </span>
          )}
        </div>

        {/* Save / Bookmark Button */}
        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(e);
            }}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#667085] hover:text-[#635BFF] shadow-2xs transition-colors"
          >
            <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-[#635BFF] text-[#635BFF]")} />
          </button>
        )}

        {/* Progress bar overlay for enrolled courses */}
        {isEnrolled && progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/10">
            <div
              className="h-full bg-gradient-to-r from-[#635BFF] to-[#22C995] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2.5">
        <div>
          <h3 className="text-[13.5px] font-bold text-[#172033] leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-[11.5px] text-[#667085] font-medium mt-0.5 truncate">
            {provider}
          </p>
        </div>

        {/* Rating + Duration + Level row */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
            <span className="font-bold text-[#172033]">{rating}</span>
            {reviewCount && (
              <span className="text-[#94A3B8]">({reviewCount})</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[#667085]">
            <Clock className="w-3 h-3" />
            <span>{duration}</span>
          </div>
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
              levelColors[level]
            )}
          >
            {level}
          </span>
        </div>

        {/* Skills chips */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium text-[#635BFF] bg-[#F1EFFF] rounded-md px-2 py-0.5"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-[10px] font-medium text-[#94A3B8] px-1 py-0.5">
                +{skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price / Progress Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-[#F1F3F9]">
          {isEnrolled ? (
            <span className="text-[11.5px] font-bold text-[#635BFF]">
              {progress}% complete
            </span>
          ) : (
            <span className="text-[12.5px] font-bold text-[#172033]">
              {price}
            </span>
          )}
          <span className="text-[11px] font-semibold text-[#635BFF] flex items-center gap-0.5">
            {isEnrolled ? "Continue →" : "View Details →"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
