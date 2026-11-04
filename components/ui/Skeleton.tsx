"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-slate-200/80 rounded-lg";

  if (variant === "card") {
    return (
      <div className={cn("rounded-[14px] border border-slate-100 bg-white p-4 space-y-3", className)}>
        <div className={cn(baseStyles, "h-4 w-2/3")} />
        <div className={cn(baseStyles, "h-3 w-full")} />
        <div className={cn(baseStyles, "h-3 w-4/5")} />
        <div className="flex gap-2 pt-1">
          <div className={cn(baseStyles, "h-6 w-16 rounded-full")} />
          <div className={cn(baseStyles, "h-6 w-20 rounded-full")} />
        </div>
      </div>
    );
  }

  if (variant === "circular") {
    return (
      <div
        className={cn(baseStyles, "rounded-full")}
        style={{
          width: width || 40,
          height: height || 40,
        }}
      />
    );
  }

  if (variant === "rectangular") {
    return (
      <div
        className={cn(baseStyles, "rounded-[12px]", className)}
        style={{
          width: width || "100%",
          height: height || 100,
        }}
      />
    );
  }

  // Text variant: can render multiple lines
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(baseStyles, "h-3")}
          style={{
            width: width || (i === lines - 1 && lines > 1 ? "60%" : "100%"),
            height: height,
          }}
        />
      ))}
    </div>
  );
}

/** Pre-built skeleton layouts */
export function JobCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-[14px] border border-[#E4E7EC] p-3.5 space-y-3", className)}>
      <div className="flex items-start gap-3">
        <Skeleton variant="rectangular" width={36} height={36} className="rounded-[10px] shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={60} height={22} className="rounded-full" />
        <Skeleton variant="rectangular" width={50} height={22} className="rounded-full" />
        <Skeleton variant="rectangular" width={70} height={22} className="rounded-full" />
      </div>
      <Skeleton variant="text" width="40%" />
    </div>
  );
}

export function CourseCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-[14px] border border-[#E4E7EC] overflow-hidden", className)}>
      <Skeleton variant="rectangular" height={140} className="rounded-none" />
      <div className="p-3.5 space-y-2.5">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={50} height={20} className="rounded-full" />
          <Skeleton variant="rectangular" width={60} height={20} className="rounded-full" />
        </div>
      </div>
    </div>
  );
}
