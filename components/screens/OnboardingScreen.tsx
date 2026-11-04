"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { UniversalCareerEcosystem } from "@/components/motion/UniversalCareerEcosystem";
import { Check, Sparkles, TrendingUp, Briefcase } from "lucide-react";

interface OnboardingScreenProps {
  onFinish: () => void;
  onSkip: () => void;
}

const ONBOARDING_SLIDES = [
  {
    step: 1,
    heading: "Discover Your Career Path",
    description: "Find opportunities that match your skills, goals and ambitions.",
    image: "/images/onboarding1-clean.jpg",
    customComponent: null,
    floatingLabels: [],
    cta: "Next →",
  },
  {
    step: 2,
    heading: "Build Skills That Matter",
    description: "Get personalized learning recommendations based on your dream career and skill gaps.",
    image: "/images/onboarding2-clean.jpg",
    customComponent: <UniversalCareerEcosystem />,
    floatingLabels: [],
    cta: "Next →",
  },
  {
    step: 3,
    heading: "Prepare. Get Hired. Grow.",
    description: "Practice interviews, discover relevant jobs and keep growing throughout your career.",
    image: "/images/onboarding3-clean.jpg",
    customComponent: null,
    floatingLabels: [],
    cta: "Get Started →",
  },
];

export function OnboardingScreen({ onFinish, onSkip }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onFinish();
    } else {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentSlide = ONBOARDING_SLIDES[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 32 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 50 : -50,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 32 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="relative h-full min-h-[640px] w-full flex flex-col justify-between bg-slate-900 select-none overflow-hidden text-slate-900">
      {/* 1. Main Full-Bleed Image (Unchanged, 100% immersive) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide.step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="relative w-full h-full"
          >
            {currentSlide.customComponent ? (
              currentSlide.customComponent
            ) : (
              <img
                src={currentSlide.image}
                alt={currentSlide.heading}
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
            )}

            {/* Feathered Transparent Gradient (Only for natural text readability - NO CARD) */}
            <div className="absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. Top Header: Minimal Floating Skip Button */}
      <div className="relative z-20 w-full flex items-center justify-end pt-5 px-6">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs font-bold text-slate-700 hover:text-slate-950 bg-white/85 hover:bg-white backdrop-blur-md py-1.5 px-3.5 rounded-full shadow-sm border border-white/70 transition-all active:scale-95"
        >
          Skip
        </button>
      </div>

      {/* 3. Spacer */}
      <div className="relative z-10 w-full flex-1 pointer-events-none" />

      {/* 4. Seamless Integrated Bottom Content (NO CARD, NO WHITE BOX) */}
      <motion.div
        key={`content-${currentIndex}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-20 w-full max-w-sm mx-auto px-6 pb-8 pt-1 flex flex-col items-center text-center space-y-4"
      >
        {/* Heading in Dark Navy Bold Typography */}
        <div className="space-y-1.5 px-2">
          <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#0F172A] tracking-tight leading-snug font-sans">
            {currentSlide.heading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs mx-auto leading-relaxed">
            {currentSlide.description}
          </p>
        </div>

        {/* Minimal Progress Dots: ○ ○ ● */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {ONBOARDING_SLIDES.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="focus:outline-none p-1"
              >
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-7 bg-brand-500 shadow-sm shadow-brand-500/30"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Floating Premium CTA Button (Indigo ➔ Violet Gradient, Rounded 16-18px) */}
        <div className="w-full pt-1">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNext}
            className="shadow-glow-sm hover:shadow-brand-500/35 text-base font-bold h-13 rounded-[18px] bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 active:scale-[0.98] transition-transform"
          >
            {currentSlide.cta}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
