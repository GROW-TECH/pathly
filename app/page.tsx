"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/lib/context/AuthContext";
import { SplashScreen } from "@/components/screens/SplashScreen";
import { OnboardingScreen } from "@/components/screens/OnboardingScreen";
import { AuthScreen } from "@/components/screens/AuthScreen";
import { CareerProfileScreen } from "@/components/screens/CareerProfileScreen";
import { ResumeScreen } from "@/components/screens/ResumeScreen";
import { SkillAssessmentScreen } from "@/components/screens/SkillAssessmentScreen";
import { SkillGapScreen } from "@/components/screens/SkillGapScreen";
import { DashboardScreen } from "@/components/screens/DashboardScreen";

export type ScreenState =
  | "splash"
  | "onboarding"
  | "auth"
  | "profile"
  | "resume"
  | "assessment"
  | "skill_gap"
  | "dashboard";

export default function MobileAppRoot() {
  const { user, profile, isAuthenticated, isLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenState>("splash");

  // Keep user authenticated on refresh and restore session without repeating onboarding/login
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        if (currentScreen === "splash" || currentScreen === "auth" || currentScreen === "onboarding") {
          setCurrentScreen("dashboard");
        }
      } else {
        if (currentScreen === "dashboard") {
          setCurrentScreen("auth");
        }
      }
    }
  }, [isAuthenticated, isLoading, currentScreen]);

  // Instantly resolve active screen to prevent blank screen during logout transitions
  const activeScreen = React.useMemo(() => {
    if (!isLoading && !isAuthenticated && currentScreen === "dashboard") {
      return "auth";
    }
    return currentScreen;
  }, [isLoading, isAuthenticated, currentScreen]);

  return (
    <div className="min-h-screen w-full bg-[#0F172A] flex items-center justify-center font-sans antialiased sm:p-4 md:p-6 lg:p-8">
      {/* Mobile Application Canvas */}
      <div className="relative w-full sm:max-w-[430px] h-screen sm:h-[860px] bg-surface-muted sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col">
        {/* Screen Viewport with Smooth Fade/Scale Transition */}
        <div className="flex-1 w-full h-full overflow-hidden relative flex flex-col">
          <AnimatePresence>
            {/* 1. Splash */}
            {activeScreen === "splash" && (
              <motion.div
                key="splash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex-1"
              >
                <SplashScreen
                  onComplete={() => {
                    if (isAuthenticated) {
                      setCurrentScreen("dashboard");
                    } else {
                      setCurrentScreen("onboarding");
                    }
                  }}
                />
              </motion.div>
            )}

            {/* 2. Onboarding */}
            {activeScreen === "onboarding" && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex-1"
              >
                <OnboardingScreen
                  onFinish={() => setCurrentScreen("auth")}
                  onSkip={() => setCurrentScreen("auth")}
                />
              </motion.div>
            )}

            {/* 3. Auth (Login / Signup) */}
            {activeScreen === "auth" && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex-1 overflow-y-auto no-scrollbar"
              >
                <AuthScreen
                  initialMode="login"
                  onSuccess={(authMode?: "login" | "signup") => {
                    if (authMode === "signup") {
                      setCurrentScreen("profile");
                    } else {
                      setCurrentScreen("dashboard");
                    }
                  }}
                />
              </motion.div>
            )}

            {/* 4. Career Profile Setup (4 Steps) */}
            {activeScreen === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex-1"
              >
                <CareerProfileScreen
                  onComplete={() => setCurrentScreen("dashboard")}
                  onBack={() => setCurrentScreen("auth")}
                />
              </motion.div>
            )}

            {/* 5. Resume ATS Scanner & Optimization */}
            {activeScreen === "resume" && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex-1"
              >
                <ResumeScreen
                  onNext={() => setCurrentScreen("assessment")}
                  onBack={() => setCurrentScreen("dashboard")}
                />
              </motion.div>
            )}

            {/* 6. Skill Assessment Quiz */}
            {activeScreen === "assessment" && (
              <motion.div
                key="assessment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex-1"
              >
                <SkillAssessmentScreen
                  onComplete={() => setCurrentScreen("skill_gap")}
                  onNavigateToLearn={() => setCurrentScreen("skill_gap")}
                  onNavigateToJobs={() => setCurrentScreen("dashboard")}
                  onBack={() => setCurrentScreen("dashboard")}
                />
              </motion.div>
            )}

            {/* 7. Skill Gap Analysis */}
            {activeScreen === "skill_gap" && (
              <motion.div
                key="skill_gap"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex-1"
              >
                <SkillGapScreen
                  onNext={() => setCurrentScreen("dashboard")}
                  onBack={() => setCurrentScreen("assessment")}
                />
              </motion.div>
            )}

            {/* 8. Main Dashboard & Complete App Hub */}
            {activeScreen === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex-1 flex flex-col overflow-hidden"
              >
                <DashboardScreen
                  onRestartDemo={async () => {
                    await logout();
                    setCurrentScreen("auth");
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
