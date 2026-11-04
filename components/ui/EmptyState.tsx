"use client";

import React from "react";
import { FolderSearch, Plus } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No results found",
  description = "Try searching for a different skill, job role, or industry keyword.",
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 space-y-4",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-brand-500 flex items-center justify-center shadow-subtle">
        {icon || <FolderSearch className="w-6 h-6 stroke-[1.5]" />}
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button
          variant="soft"
          size="sm"
          onClick={onAction}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
