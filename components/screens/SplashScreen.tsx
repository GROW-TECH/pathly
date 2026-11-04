"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    // Smooth auto-transition to Onboarding after 2.4 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative h-full min-h-[640px] w-full flex flex-col justify-between items-center bg-[#2B6CB0] select-none overflow-hidden"
    >
      {/* 1. Cinematic Full-Bleed High-Res Splash Artwork */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/splash-new.png"
          alt="Pathly - Your Career. Smarter."
          fill
          priority
          sizes="(max-width: 768px) 100vw, 430px"
          className="object-cover object-center"
        />
      </div>
    </motion.div>
  );
}
