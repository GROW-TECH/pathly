"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Check,
  Zap,
  Shield,
  Crown,
  ArrowRight,
  ArrowLeft,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SubscriptionScreenProps {
  onBack?: () => void;
  onSubscribe?: (planId: string) => void;
  onConnectMentor?: () => void;
}

export function SubscriptionScreen({ onBack, onSubscribe, onConnectMentor }: SubscriptionScreenProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");

  const plans = [
    {
      id: "free",
      name: "Free Starter",
      tagline: "Essential tools to start exploring careers",
      price: "₹0",
      period: "forever",
      isPopular: false,
      features: [
        "1 ATS Resume Scan / month",
        "Browse 100+ Jobs & Govt Exams",
        "Basic Skill Gap Overview",
        "5 AI Career Coach messages / day",
      ],
      ctaText: "Current Plan",
      ctaVariant: "outline" as const,
    },
    {
      id: "pro",
      name: "Pathly Pro",
      tagline: "Accelerate your hiring & interview readiness",
      price: billingCycle === "yearly" ? "₹399" : "₹499",
      period: "/ month",
      billedInfo: billingCycle === "yearly" ? "Billed annually (₹4,788/yr)" : "Billed monthly",
      isPopular: true,
      features: [
        "Advanced & Specialized Pro Courses with Full Syllabus",
        "Unlimited AI Career Coach & Personalized Guidance 24/7",
        "Deep ATS Resume Analysis & AI Bullet Rewriter",
        "Advanced Skill Assessments & Verified Certifications",
        "15 AI Mock Interviews with Live Scoring & Feedback",
        "Personalized Career Roadmaps & Actionable Skill Gap Fixes",
        "Priority Job & Exam Application Matching",
      ],
      ctaText: "Start 7-Day Free Trial →",
      ctaVariant: "primary" as const,
    },
    {
      id: "elite",
      name: "Elite Mentorship",
      tagline: "1-on-1 expert coaching & guaranteed placement support",
      price: billingCycle === "yearly" ? "₹899" : "₹999",
      period: "/ month",
      billedInfo: billingCycle === "yearly" ? "Billed annually (₹10,788/yr)" : "Billed monthly",
      isPopular: false,
      features: [
        "Everything in Pro Plan",
        "1-on-1 Monthly Senior Mentor Session",
        "Human Recruiter Resume Review",
        "Direct Referral to 50+ Partner Companies",
      ],
      ctaText: "Upgrade to Elite →",
      ctaVariant: "outline" as const,
    },
  ];

  return (
    <div className="h-full w-full bg-[#FAF9FF] text-[#18152B] font-sans antialiased flex flex-col select-none relative overflow-hidden">
      {/* Top Header */}
      <Header
        variant="back"
        title="Pathly Premium Plans"
        onBackClick={onBack}
      />

      {/* Main Scrollable Body */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4 space-y-4 max-w-lg mx-auto w-full">
        {/* Hero Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F1EFFF] text-[#635BFF] text-[11px] font-bold">
            <Crown className="w-3.5 h-3.5" />
            <span>Unlock Your Full Potential</span>
          </div>
          <h1 className="text-[20px] font-bold text-[#172033] tracking-tight">
            Supercharge Your Career
          </h1>
          <p className="text-[12px] text-[#667085] max-w-xs mx-auto">
            Get unlimited AI mock interviews, ATS optimization, and verified certificates.
          </p>
        </div>

        {/* Monthly vs Yearly Switcher */}
        <div className="flex items-center justify-center pt-1">
          <div className="p-1 rounded-[14px] bg-[#EBE9F5] flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-4 py-1.5 rounded-[11px] text-[12px] font-bold transition-all",
                billingCycle === "monthly"
                  ? "bg-white text-[#172033] shadow-xs"
                  : "text-[#667085] hover:text-[#172033]"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "px-4 py-1.5 rounded-[11px] text-[12px] font-bold transition-all flex items-center gap-1.5",
                billingCycle === "yearly"
                  ? "bg-[#635BFF] text-white shadow-xs"
                  : "text-[#667085] hover:text-[#172033]"
              )}
            >
              <span>Yearly</span>
              <span className="text-[10px] bg-[#22C995] text-white px-1.5 py-0.2 rounded-full font-extrabold">
                SAVE 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards List */}
        <div className="space-y-3 pt-1">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "p-4 rounded-[20px] border transition-all duration-200 cursor-pointer space-y-3 relative",
                  plan.isPopular
                    ? "bg-gradient-to-b from-[#F7F6FF] to-white border-[#635BFF] shadow-md ring-2 ring-[#635BFF]/20"
                    : isSelected
                    ? "bg-white border-[#635BFF] shadow-xs"
                    : "bg-white border-[#E8E5F2] hover:border-[#635BFF]/40 shadow-2xs"
                )}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>MOST POPULAR</span>
                  </div>
                )}

                {/* Plan Title & Price */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#172033]">
                      {plan.name}
                    </h3>
                    <p className="text-[11px] text-[#667085] mt-0.5">
                      {plan.tagline}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[20px] font-extrabold text-[#172033] leading-none">
                      {plan.price}
                    </div>
                    <span className="text-[10.5px] text-[#667085] font-medium">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-1.5 pt-1 border-t border-[#F1F3F9]">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11.5px] text-[#475569]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22C995] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubscribe?.(plan.id);
                  }}
                  className={cn(
                    "w-full h-10 rounded-[12px] text-[12.5px] font-bold transition-all flex items-center justify-center gap-1.5 mt-2",
                    plan.isPopular
                      ? "bg-[#635BFF] text-white hover:bg-[#5349E8] shadow-sm"
                      : "bg-[#F1EFFF] text-[#635BFF] hover:bg-[#EAE6FF]"
                  )}
                >
                  <span>{plan.ctaText}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Security & Moneyback Guarantee */}
        <div className="p-3 rounded-[14px] bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-[#15803D] shrink-0" />
          <div className="text-[11px] text-[#15803D]">
            <span className="font-bold">7-Day Money Back Guarantee.</span> Cancel anytime with 1-click in your account settings.
          </div>
        </div>
      </div>
    </div>
  );
}
