"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Bookmark,
  Building2,
  Landmark,
  Laptop,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface JobCardData {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode?: string;
  experience?: string;
  type?: string;
  salary: string;
  matchScore?: number;
  postedAt?: string;
  postedDate?: string;
  skills?: string[];
  companyLogoType?: "google" | "microsoft" | "swiggy" | "tnpsc" | "default";
}

export interface JobCardProps {
  job?: JobCardData;
  id?: string;
  title?: string;
  company?: string;
  location?: string;
  workMode?: string;
  experience?: string;
  type?: string;
  salary?: string;
  matchScore?: number;
  postedDate?: string;
  postedAt?: string;
  skills?: string[];
  companyLogoType?: "google" | "microsoft" | "swiggy" | "tnpsc" | "default";
  isSaved?: boolean;
  onSelect?: () => void;
  onClick?: () => void;
  onToggleSave?: (idOrEvent: any, e?: React.MouseEvent) => void;
  className?: string;
}

function CompanyLogo({ type, companyName }: { type?: string; companyName?: string }) {
  const cName = (companyName || "").toLowerCase();
  const logoType =
    type ||
    (cName.includes("google")
      ? "google"
      : cName.includes("microsoft")
      ? "microsoft"
      : cName.includes("swiggy")
      ? "swiggy"
      : cName.includes("tnpsc") || cName.includes("govt") || cName.includes("officer")
      ? "tnpsc"
      : "default");

  if (logoType === "google") {
    return (
      <div className="w-10 h-10 rounded-[12px] bg-[#F8FAFC] border border-[#E8E8EF] flex items-center justify-center shrink-0 shadow-2xs">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" />
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
        </svg>
      </div>
    );
  }
  if (logoType === "microsoft") {
    return (
      <div className="w-10 h-10 rounded-[12px] bg-[#F8FAFC] border border-[#E8E8EF] flex items-center justify-center shrink-0 shadow-2xs">
        <div className="grid grid-cols-2 gap-0.5 w-4.5 h-4.5">
          <div className="bg-[#F25022] rounded-[1px]" />
          <div className="bg-[#7FBA00] rounded-[1px]" />
          <div className="bg-[#00A4EF] rounded-[1px]" />
          <div className="bg-[#FFB900] rounded-[1px]" />
        </div>
      </div>
    );
  }
  if (logoType === "swiggy") {
    return (
      <div className="w-10 h-10 rounded-[12px] bg-[#FFF5EE] border border-[#FFE4D6] flex items-center justify-center shrink-0 shadow-2xs">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FC8019">
          <path d="M12 2C7.58 2 4 5.58 4 10c0 4.9 6.2 11.24 7.42 12.44.32.32.84.32 1.16 0C13.8 21.24 20 14.9 20 10c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
        </svg>
      </div>
    );
  }
  if (logoType === "tnpsc") {
    return (
      <div className="w-10 h-10 rounded-[12px] bg-[#F1EFFF] border border-[#E8E5F2] flex items-center justify-center shrink-0 shadow-2xs">
        <Landmark className="w-5 h-5 text-[#635BFF]" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-[12px] bg-[#F1F5F9] border border-[#E4E7EC] flex items-center justify-center text-[#635BFF] shrink-0 shadow-2xs">
      <Building2 className="w-5 h-5" />
    </div>
  );
}

export function JobCard(props: JobCardProps) {
  const {
    job,
    id: propId,
    title: propTitle,
    company: propCompany,
    location: propLocation,
    workMode: propWorkMode,
    experience: propExperience,
    type: propType,
    salary: propSalary,
    matchScore: propMatchScore,
    postedDate: propPostedDate,
    postedAt: propPostedAt,
    skills: propSkills,
    companyLogoType: propCompanyLogoType,
    isSaved = false,
    onSelect,
    onClick,
    onToggleSave,
    className,
  } = props;

  const id = job?.id || propId || "";
  const title = job?.title || propTitle || "Software Engineer";
  const company = job?.company || propCompany || "Tech Corp";
  const location = job?.location || propLocation || "Remote";
  const workMode = job?.workMode || propWorkMode || "Hybrid";
  const experience = job?.experience || propExperience || job?.type || propType || "Full-time";
  const salary = job?.salary || propSalary || "Competitive";
  const matchScore = job?.matchScore ?? propMatchScore;
  const postedDate = job?.postedAt || job?.postedDate || propPostedAt || propPostedDate;
  const skills = job?.skills || propSkills || [];
  const logoType = job?.companyLogoType || propCompanyLogoType;

  const handleClick = () => {
    if (onClick) onClick();
    else if (onSelect) onSelect();
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
      onToggleSave(id, e);
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      onClick={handleClick}
      className={cn(
        "bg-white rounded-[16px] border border-[#E8E5F2] p-3.5 space-y-3 cursor-pointer hover:border-[#635BFF]/40 hover:shadow-md transition-all duration-200 relative group",
        className
      )}
    >
      {/* Top row: logo + title & company + match score badge */}
      <div className="flex items-start gap-3">
        <CompanyLogo type={logoType} companyName={company} />
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold text-[#172033] leading-snug truncate">
            {title}
          </h3>
          <p className="text-[12px] text-[#667085] font-medium truncate mt-0.5">
            {company}
          </p>
        </div>

        {/* Match score badge */}
        {typeof matchScore === "number" && (
          <div className="flex items-center gap-1 bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#22C55E]" />
            <span>{matchScore}%</span>
          </div>
        )}
      </div>

      {/* Metadata chips */}
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2 py-0.5">
          <MapPin className="w-3 h-3 text-[#64748B]" />
          <span>{location}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2 py-0.5">
          <Laptop className="w-3 h-3 text-[#64748B]" />
          <span>{workMode}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2 py-0.5">
          <Clock className="w-3 h-3 text-[#64748B]" />
          <span>{experience}</span>
        </span>
      </div>

      {/* Skills tags (if available) */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-0.5">
          {skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="text-[10.5px] font-medium text-[#635BFF] bg-[#F1EFFF] px-2 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-[10px] font-semibold text-[#94A3B8] px-1 py-0.5">
              +{skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Bottom: salary + posted date + bookmark button */}
      <div className="flex items-center justify-between pt-1 border-t border-[#F1F3F9]">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#172033]">{salary}</span>
          {postedDate && (
            <span className="text-[11px] text-[#94A3B8]">• {postedDate}</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className={cn(
            "p-1.5 rounded-full transition-all",
            isSaved
              ? "text-[#635BFF] bg-[#EEF2FF]"
              : "text-[#94A3B8] hover:text-[#635BFF] hover:bg-[#EEF2FF]"
          )}
          aria-label={isSaved ? "Unsave job" : "Save job"}
        >
          <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
        </button>
      </div>
    </motion.div>
  );
}
