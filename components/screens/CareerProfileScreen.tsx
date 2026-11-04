"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  ArrowLeft,
  MapPin,
  Building2,
  Laptop,
  CheckCircle2,
  Sparkles,
  Brain,
  Layers,
  Check,
  X,
  Mic,
  Users,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Landmark,
  Palette,
  Wrench,
  TrendingUp,
  Coins,
  BriefcaseBusiness,
  Cog,
  Megaphone,
  Scale,
  Utensils,
  Factory,
  Sprout,
  Shield,
  Truck,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Target,
} from "lucide-react";
import {
  PathlyButton,
  PathlyInput,
} from "@/components/ui/DesignSystem";
import {
  filterSkillsByQuery,
  getSuggestedSkillsForInterests,
  getSkillsByCategory,
  getSkillTheme,
  SKILL_EXPLORE_CATEGORIES,
  getAiRecommendedCareers,
  EnrichedCareerMatch,
} from "@/lib/careerData";
import { useAuth } from "@/lib/context/AuthContext";

interface CareerProfileScreenProps {
  onComplete: () => void;
  onBack?: () => void;
}

const WORK_MODES = [
  { id: "remote", label: "Remote", icon: Laptop },
  { id: "hybrid", label: "Hybrid", icon: Building2 },
  { id: "onsite", label: "On-site", icon: MapPin },
];

const GOV_EXAM_SCOPES = [
  { id: "state", label: "State Level (TNPSC)", icon: Landmark },
  { id: "central", label: "Central Level (UPSC/SSC)", icon: Shield },
  { id: "all", label: "All Opportunities", icon: Target },
];

interface InterestCategoryConfig {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bg: string;
}

const INTEREST_CATEGORIES_CONFIG: InterestCategoryConfig[] = [
  { id: "government", name: "Government & Public Service", icon: Landmark, color: "#6366F1", bg: "#EEF2FF" },
  { id: "technology", name: "Technology", icon: Laptop, color: "#3B82F6", bg: "#EFF6FF" },
  { id: "healthcare", name: "Healthcare", icon: HeartPulse, color: "#EF4444", bg: "#FEF2F2" },
  { id: "education", name: "Education", icon: GraduationCap, color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "finance", name: "Finance & Banking", icon: Coins, color: "#F59E0B", bg: "#FFFBEB" },
  { id: "business", name: "Business & Management", icon: BriefcaseBusiness, color: "#0EA5E9", bg: "#F0F9FF" },
  { id: "engineering", name: "Engineering", icon: Cog, color: "#64748B", bg: "#F1F5F9" },
  { id: "design", name: "Design & Creative", icon: Palette, color: "#EC4899", bg: "#FDF2F8" },
  { id: "marketing", name: "Marketing", icon: Megaphone, color: "#F97316", bg: "#FFF7ED" },
  { id: "sales", name: "Sales", icon: TrendingUp, color: "#10B981", bg: "#ECFDF5" },
  { id: "law", name: "Law", icon: Scale, color: "#6366F1", bg: "#EEF2FF" },
  { id: "media", name: "Media & Communication", icon: Mic, color: "#A855F7", bg: "#FAF5FF" },
  { id: "hospitality", name: "Hospitality", icon: Utensils, color: "#F97316", bg: "#FFF7ED" },
  { id: "manufacturing", name: "Manufacturing", icon: Factory, color: "#64748B", bg: "#F1F5F9" },
  { id: "agriculture", name: "Agriculture", icon: Sprout, color: "#22C55E", bg: "#F0FDF4" },
  { id: "defence", name: "Defence & Public Safety", icon: Shield, color: "#475569", bg: "#F1F5F9" },
  { id: "skilled", name: "Skilled & Technical Work", icon: Wrench, color: "#14B8A6", bg: "#F0FDFA" },
  { id: "logistics", name: "Logistics & Transport", icon: Truck, color: "#0EA5E9", bg: "#F0F9FF" },
];

export function CareerProfileScreen({
  onComplete,
  onBack,
}: CareerProfileScreenProps) {
  const { updateProfile } = useAuth();

  // Steps:
  // Step 1: Career Status
  // Step 2: Interests ONLY
  // Step 3: Skills ONLY
  // Step 4: Careers That Match You (Top 3 Matches + Dynamic Preferences)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1 STATE
  const [careerStatus, setCareerStatus] = useState<"fresher" | "experienced">("fresher");

  // STEP 2 STATE: Interests ONLY
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [interestLimitNotice, setInterestLimitNotice] = useState(false);

  // STEP 3 STATE: Skills ONLY
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillLevels, setSkillLevels] = useState<Record<string, "Beginner" | "Intermediate" | "Advanced">>({});
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>("all");
  const [skillLimitNotice, setSkillLimitNotice] = useState(false);
  const [aiSuggestNotice, setAiSuggestNotice] = useState(false);

  // STEP 4 STATE: Career Recommendations & Dynamic Preferences
  const [step4CategoryFilter, setStep4CategoryFilter] = useState<string>("all");
  const [selectedPrimaryCareer, setSelectedPrimaryCareer] = useState<EnrichedCareerMatch | null>(null);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [preferredLocation, setPreferredLocation] = useState("Tamil Nadu / Anywhere");
  const [workPreference, setWorkPreference] = useState<string[]>(["hybrid"]);
  const [govExamScope, setGovExamScope] = useState<string>("state");

  // AI Matching Immersive Transition (Screen 1 between Step 3 and Step 4)
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [matchStage, setMatchStage] = useState(0);

  // Final Personalization Transition (After Step 4)
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalStage, setFinalStage] = useState(0);

  // Skills displayed based on explore category or interest-based suggestions
  const displayedSkills = useMemo(() => {
    if (skillSearchQuery.trim()) {
      return filterSkillsByQuery(skillSearchQuery).map((s) => s.name);
    }
    if (activeSkillCategory !== "all") {
      return getSkillsByCategory(activeSkillCategory);
    }
    return getSuggestedSkillsForInterests(selectedInterests);
  }, [skillSearchQuery, activeSkillCategory, selectedInterests]);

  // Generate AI career recommendations for Step 4
  const recommendedCareers = useMemo(() => {
    return getAiRecommendedCareers(
      careerStatus,
      selectedInterests,
      selectedSkills,
      step4CategoryFilter
    );
  }, [careerStatus, selectedInterests, selectedSkills, step4CategoryFilter]);

  // Set default primary career if none selected
  const activePrimaryCareer = selectedPrimaryCareer || (recommendedCareers.length > 0 ? recommendedCareers[0] : null);

  // Is selected career a Government or Exam career?
  const isGovExamCareer = useMemo(() => {
    if (!activePrimaryCareer) return false;
    const cat = activePrimaryCareer.category.toLowerCase();
    const type = activePrimaryCareer.type.toLowerCase();
    return (
      cat.includes("government") ||
      cat.includes("exam") ||
      type === "government" ||
      type === "defence" ||
      type === "railways"
    );
  }, [activePrimaryCareer]);

  // STEP 2: Toggle Interest (Max 5)
  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
      setInterestLimitNotice(false);
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, id]);
        setInterestLimitNotice(false);
      } else {
        setInterestLimitNotice(true);
        setTimeout(() => setInterestLimitNotice(false), 3000);
      }
    }
  };

  // STEP 3: Toggle Skill (Max 10)
  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
      setSkillLimitNotice(false);
    } else {
      if (selectedSkills.length < 10) {
        setSelectedSkills([...selectedSkills, skillName]);
        setSkillLimitNotice(false);
      } else {
        setSkillLimitNotice(true);
        setTimeout(() => setSkillLimitNotice(false), 3000);
      }
    }
  };

  // STEP 3: Cycle Skill Level (Beginner -> Intermediate -> Advanced)
  const cycleSkillLevel = (skillName: string) => {
    const current = skillLevels[skillName] || "Intermediate";
    const nextLevel = current === "Beginner" ? "Intermediate" : current === "Intermediate" ? "Advanced" : "Beginner";
    setSkillLevels((prev) => ({ ...prev, [skillName]: nextLevel }));
  };

  // STEP 3: AI Skill Suggester Button
  const handleAiSuggestSkills = () => {
    const smartPicks = getSuggestedSkillsForInterests(selectedInterests);
    const updated = Array.from(new Set([...selectedSkills, ...smartPicks])).slice(0, 8);
    setSelectedSkills(updated);
    setAiSuggestNotice(true);
    setTimeout(() => setAiSuggestNotice(false), 3000);
  };

  // STEP 3: Add Custom Skill from Search Query
  const handleAddCustomSkillDirect = (skillName: string) => {
    const clean = skillName.trim();
    if (clean && !selectedSkills.includes(clean)) {
      if (selectedSkills.length < 10) {
        setSelectedSkills([...selectedSkills, clean]);
        setSkillSearchQuery("");
      } else {
        setSkillLimitNotice(true);
        setTimeout(() => setSkillLimitNotice(false), 3000);
      }
    }
  };

  const toggleWorkMode = (mode: string) => {
    if (workPreference.includes(mode)) {
      setWorkPreference(workPreference.filter((m) => m !== mode));
    } else {
      setWorkPreference([...workPreference, mode]);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // SCREEN 1: Trigger Immersive AI Career Matching
      setIsAiMatching(true);
      setMatchStage(0);

      setTimeout(() => setMatchStage(1), 550);
      setTimeout(() => setMatchStage(2), 1200);
      setTimeout(() => setMatchStage(3), 1850);
      setTimeout(() => {
        setIsAiMatching(false);
        setStep(4);
        if (recommendedCareers.length > 0) {
          setSelectedPrimaryCareer(recommendedCareers[0]);
        }
      }, 2400);
    } else if (step === 4) {
      startFinalAiPersonalization();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3 | 4);
    } else if (onBack) {
      onBack();
    }
  };

  const startFinalAiPersonalization = () => {
    setIsFinalizing(true);
    setFinalStage(0);

    // Persist real candidate profile to MongoDB via AuthContext
    if (updateProfile) {
      updateProfile({
        career_status: careerStatus,
        target_role: activePrimaryCareer?.title || "Technology Specialist",
        interests: selectedInterests,
        skills: selectedSkills.map((s) => ({
          name: s,
          level: skillLevels[s] || "Intermediate",
          category: activeSkillCategory !== "all" ? activeSkillCategory : "general",
        })),
        preferred_locations: preferredLocation ? [preferredLocation] : [],
        preferred_work_modes: workPreference,
        gov_exam_scope: isGovExamCareer ? govExamScope : "all",
      }).catch((err) => {
        console.warn("Failed to persist profile selections:", err);
      });
    }

    setTimeout(() => setFinalStage(1), 600);
    setTimeout(() => setFinalStage(2), 1300);
    setTimeout(() => setFinalStage(3), 2000);
    setTimeout(() => {
      onComplete();
    }, 2700);
  };

  const renderExploreCategoryIcon = (iconName: string) => {
    const iconProps = { className: "w-3.5 h-3.5 shrink-0" };
    switch (iconName) {
      case "Users": return <Users {...iconProps} />;
      case "Briefcase": return <Briefcase {...iconProps} />;
      case "Laptop": return <Laptop {...iconProps} />;
      case "Palette": return <Palette {...iconProps} />;
      case "HeartPulse": return <HeartPulse {...iconProps} />;
      case "Landmark": return <Landmark {...iconProps} />;
      case "GraduationCap": return <GraduationCap {...iconProps} />;
      default: return <Sparkles {...iconProps} />;
    }
  };

  // Helper to render career category icons cleanly using Lucide React
  const renderCareerIcon = (career: EnrichedCareerMatch) => {
    const cat = (career.category || "").toLowerCase();
    const type = (career.type || "").toLowerCase();
    const title = (career.title || "").toLowerCase();

    let IconComponent = BriefcaseBusiness;
    let iconColor = "#635BFF";
    let bgColor = "#EEF2FF";
    let borderColor = "#C7D2FE";

    if (cat.includes("government") || type.includes("government") || title.includes("tnpsc") || title.includes("upsc") || title.includes("ssc")) {
      IconComponent = Landmark;
      iconColor = "#6366F1";
      bgColor = "#EEF2FF";
      borderColor = "#C7D2FE";
    } else if (cat.includes("education") || type.includes("education") || title.includes("teacher")) {
      IconComponent = GraduationCap;
      iconColor = "#8B5CF6";
      bgColor = "#F5F3FF";
      borderColor = "#DDD6FE";
    } else if (cat.includes("health") || type.includes("health") || title.includes("nurse") || title.includes("medical")) {
      IconComponent = HeartPulse;
      iconColor = "#EF4444";
      bgColor = "#FEF2F2";
      borderColor = "#FECDD3";
    } else if (cat.includes("finance") || cat.includes("bank") || type.includes("bank") || type.includes("finance")) {
      IconComponent = Coins;
      iconColor = "#F59E0B";
      bgColor = "#FFFBEB";
      borderColor = "#FDE68A";
    } else if (cat.includes("tech") || type.includes("it") || title.includes("developer") || title.includes("data")) {
      IconComponent = Laptop;
      iconColor = "#3B82F6";
      bgColor = "#EFF6FF";
      borderColor = "#BFDBFE";
    } else if (cat.includes("engineer") || type.includes("engineer") || title.includes("engineer")) {
      IconComponent = Cog;
      iconColor = "#64748B";
      bgColor = "#F1F5F9";
      borderColor = "#CBD5E1";
    } else if (cat.includes("defence") || type.includes("defence") || title.includes("police")) {
      IconComponent = Shield;
      iconColor = "#475569";
      bgColor = "#F1F5F9";
      borderColor = "#CBD5E1";
    } else if (cat.includes("law") || type.includes("law")) {
      IconComponent = Scale;
      iconColor = "#6366F1";
      bgColor = "#EEF2FF";
      borderColor = "#C7D2FE";
    } else if (cat.includes("market") || type.includes("market")) {
      IconComponent = Megaphone;
      iconColor = "#F97316";
      bgColor = "#FFF7ED";
      borderColor = "#FFEDD5";
    } else if (cat.includes("sales") || type.includes("sales")) {
      IconComponent = TrendingUp;
      iconColor = "#10B981";
      bgColor = "#ECFDF5";
      borderColor = "#A7F3D0";
    } else if (cat.includes("skilled") || type.includes("skilled")) {
      IconComponent = Wrench;
      iconColor = "#14B8A6";
      bgColor = "#F0FDFA";
      borderColor = "#99F6E4";
    } else if (cat.includes("logistics") || type.includes("logistics")) {
      IconComponent = Truck;
      iconColor = "#0EA5E9";
      bgColor = "#F0F9FF";
      borderColor = "#BAE6FD";
    } else if (cat.includes("agriculture") || type.includes("agriculture")) {
      IconComponent = Sprout;
      iconColor = "#22C55E";
      bgColor = "#F0FDF4";
      borderColor = "#BBF7D0";
    }

    return (
      <div
        className="w-9 h-9 shrink-0 rounded-[10px] border flex items-center justify-center shadow-2xs"
        style={{ backgroundColor: bgColor, borderColor: borderColor }}
      >
        <IconComponent className="w-[18px] h-[18px]" style={{ color: iconColor }} />
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // SCREEN 1: IMMERSIVE FULL-SCREEN AI CAREER MATCHING EXPERIENCE
  // --------------------------------------------------------------------------
  if (isAiMatching) {
    const aiProgressSteps = [
      { id: 0, text: "Understanding your interests" },
      { id: 1, text: "Mapping your skills" },
      { id: 2, text: "Finding matching careers" },
      { id: 3, text: "Preparing recommendations" },
    ];

    return (
      <div className="relative h-full min-h-[640px] w-full flex flex-col justify-between items-center p-6 bg-[#F8FAFF] select-none font-sans overflow-hidden">
        {/* Ambient background glow orbs */}
        <div className="absolute top-1/4 -left-12 w-64 h-64 rounded-full bg-[#635BFF]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-12 w-64 h-64 rounded-full bg-[#8B5CF6]/10 blur-3xl pointer-events-none" />

        {/* Top Pathly Branding & Badge */}
        <div className="w-full max-w-sm mx-auto pt-2 text-center space-y-2 z-10">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#635BFF]">
            <span className="w-5 h-5 rounded-md bg-[#635BFF] text-white flex items-center justify-center text-[10px]">P</span>
            <span className="tracking-tight text-sm text-[#172033]">Pathly</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#C7D2FE] shadow-2xs text-[#635BFF] text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Guide</span>
          </div>

          <div className="space-y-0.5 pt-1">
            <h2 className="text-[22px] sm:text-[24px] font-bold text-[#172033] tracking-tight leading-tight">
              Finding Your Career Path
            </h2>
            <p className="text-[12px] text-[#667085] max-w-xs mx-auto">
              Pathly is connecting your interests, skills and career goals.
            </p>
          </div>
        </div>

        {/* Central Animated AI Visual with Orbiting Connected Nodes */}
        <div className="relative w-full max-w-xs my-auto py-6 flex items-center justify-center z-10">
          {/* Subtle Glowing Connecting Lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 260 220">
            <motion.path
              d="M 50 50 Q 130 90 130 110"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <motion.path
              d="M 210 50 Q 130 90 130 110"
              fill="none"
              stroke="#635BFF"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <motion.path
              d="M 45 170 Q 130 130 130 110"
              fill="none"
              stroke="#10B981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
            <motion.path
              d="M 215 170 Q 130 130 130 110"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />
          </svg>

          {/* Center Glowing Pathly AI Hub */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-brand-500/30 z-20"
          >
            <div className="absolute inset-0 rounded-full bg-[#635BFF]/20 animate-ping" />
            <div className="text-center">
              <Sparkles className="w-6 h-6 mx-auto animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider uppercase">AI</span>
            </div>
          </motion.div>

          {/* Orbit Node 1: Interests (Top Left) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-2 left-4 flex flex-col items-center gap-1 z-20"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] shadow-sm flex items-center justify-center">
              <Target className="w-5 h-5 text-[#635BFF]" />
            </div>
            <span className="text-[10.5px] font-semibold text-[#172033]">Interests</span>
          </motion.div>

          {/* Orbit Node 2: Skills (Top Right) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-2 right-4 flex flex-col items-center gap-1 z-20"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] shadow-sm flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <span className="text-[10.5px] font-semibold text-[#172033]">Skills</span>
          </motion.div>

          {/* Orbit Node 3: Goals / Jobs & Exams (Bottom Left) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-2 left-4 flex flex-col items-center gap-1 z-20"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] shadow-sm flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#10B981]" />
            </div>
            <span className="text-[10.5px] font-semibold text-[#172033]">Jobs & Exams</span>
          </motion.div>

          {/* Orbit Node 4: Opportunities / Growth (Bottom Right) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="absolute bottom-2 right-4 flex flex-col items-center gap-1 z-20"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] shadow-sm flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <span className="text-[10.5px] font-semibold text-[#172033]">Growth</span>
          </motion.div>
        </div>

        {/* Minimal Progress Checklist Journey */}
        <div className="w-full max-w-xs mx-auto space-y-2 text-left z-10">
          {aiProgressSteps.map((stepItem) => {
            const isDone = stepItem.id < matchStage;
            const isCurrent = stepItem.id === matchStage;

            return (
              <div
                key={stepItem.id}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[12px] transition-all ${
                  isCurrent
                    ? "bg-[#EEF2FF] text-[#4338CA] font-semibold border border-[#C7D2FE]"
                    : isDone
                    ? "text-[#15803D] font-medium"
                    : "text-[#94A3B8]"
                }`}
              >
                <span className="shrink-0 text-sm">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  ) : isCurrent ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#635BFF] border-t-transparent animate-spin" />
                  ) : (
                    <span className="w-3.5 h-3.5 inline-block text-center leading-none">○</span>
                  )}
                </span>
                <span>{stepItem.text}</span>
              </div>
            );
          })}
        </div>

        {/* Completion Message Indicator */}
        <div className="w-full max-w-sm mx-auto pt-2 pb-1 text-center z-10">
          {matchStage >= 3 ? (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-0.5"
            >
              <p className="text-[13px] font-bold text-[#172033] flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                <span>Your Career Matches Are Ready</span>
              </p>
              <p className="text-[11px] text-[#667085]">
                We found career paths based on your interests and skills.
              </p>
            </motion.div>
          ) : (
            <p className="text-[11px] text-[#667085]">
              Connecting with universal career pathways...
            </p>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // FINAL PERSONALIZATION ANIMATION (After Step 4 completion)
  // --------------------------------------------------------------------------
  if (isFinalizing) {
    return (
      <div className="relative h-full min-h-[640px] w-full flex flex-col justify-center items-center p-6 bg-[#F8FAFF] select-none font-sans no-scrollbar">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/25">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h2 className="text-[22px] font-bold text-[#172033] tracking-tight">
              Preparing Your Journey
            </h2>
            <p className="text-[12px] text-[#667085]">
              Personalizing your Pathly Career Dashboard...
            </p>
          </div>

          <div className="w-32 h-1 bg-[#E8EAF3] rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#635BFF] to-[#8B5CF6]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  const progressPercent = (step / 4) * 100;
  const isStep2Valid = selectedInterests.length > 0;
  const isStep3Valid = selectedSkills.length > 0;

  // Filtered/sliced recommendations for Step 4
  const visibleRecommendations = showAllMatches
    ? recommendedCareers
    : recommendedCareers.slice(0, 3);

  return (
    <div className="relative h-full min-h-[640px] w-full flex flex-col justify-between p-4 sm:p-5 bg-[#F8FAFF] select-none font-sans box-border overflow-hidden">
      {/* Top Header - Fixed and Stable */}
      <div className="w-full max-w-sm mx-auto space-y-2 pt-0.5 shrink-0">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1 && !onBack}
            className="text-[12px] font-medium text-[#667085] hover:text-[#172033] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <span className="text-[11px] font-bold text-[#635BFF] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-[#C7D2FE]">
            Step {step} of 4
          </span>
        </div>

        {/* Refined Progress Bar - Height 5px, Background #E8EAF3 */}
        <div className="h-[5px] w-full bg-[#E8EAF3] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] rounded-full"
            initial={{ width: `${((step - 1) / 4) * 100}%` }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>

        {/* STEP HEADINGS - Inter 700 / 24px */}
        {step === 1 && (
          <div className="pt-1 text-left space-y-0.5">
            <h2 className="text-[24px] font-bold text-[#172033] tracking-tight leading-tight">
              Where are you in your career?
            </h2>
            <p className="text-[12px] text-[#667085] font-normal leading-normal">
              Let us know your current career stage to customize your journey.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="pt-1 text-left space-y-0.5">
            <h2 className="text-[24px] font-bold text-[#172033] tracking-tight leading-tight">
              What are you interested in?
            </h2>
            <p className="text-[12px] text-[#667085] font-normal leading-normal">
              Choose the areas you&apos;d like to explore. You can select up to 5.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="pt-1 text-left space-y-0.5">
            <h2 className="text-[24px] font-bold text-[#172033] tracking-tight leading-tight">
              What skills do you have?
            </h2>
            <p className="text-[12px] text-[#667085] font-normal leading-normal">
              Select the skills you already have or want to develop.
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="pt-1 text-left space-y-0.5">
            <h2 className="text-[24px] font-bold text-[#172033] tracking-tight leading-tight">
              Careers that match you
            </h2>
            <p className="text-[12px] text-[#667085] font-normal leading-normal">
              Based on your interests and skills, here are some paths worth exploring.
            </p>
          </div>
        )}
      </div>

      {/* STEP CONTENT BODY - Scrollable with Hidden Scrollbar */}
      <div className="w-full max-w-sm mx-auto my-auto py-2 flex-1 flex flex-col justify-start overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* STEP 1: CAREER STATUS                                                     */}
          {/* ========================================================================= */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="space-y-3 w-full"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => setCareerStatus("fresher")}
                className={`p-4 rounded-[16px] border-2 cursor-pointer transition-all flex items-center justify-between ${
                  careerStatus === "fresher"
                    ? "border-[#635BFF] bg-[#EEF2FF] shadow-xs"
                    : "border-[#E4E7EC] bg-white hover:border-[#CBD5E1]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-[12px] bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center shadow-2xs">
                    <GraduationCap className="w-5 h-5 text-[#635BFF]" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-[13.5px] text-[#172033]">
                      I&apos;m a Fresher
                    </h4>
                    <p className="text-[11.5px] text-[#667085]">
                      Looking for my first opportunity or exam prep.
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    careerStatus === "fresher"
                      ? "bg-[#635BFF] border-[#635BFF] text-white"
                      : "border-[#CBD5E1] bg-white"
                  }`}
                >
                  {careerStatus === "fresher" && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setCareerStatus("experienced")}
                className={`p-4 rounded-[16px] border-2 cursor-pointer transition-all flex items-center justify-between ${
                  careerStatus === "experienced"
                    ? "border-[#635BFF] bg-[#EEF2FF] shadow-xs"
                    : "border-[#E4E7EC] bg-white hover:border-[#CBD5E1]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-[12px] bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center shadow-2xs">
                    <Briefcase className="w-5 h-5 text-[#635BFF]" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-[13.5px] text-[#172033]">
                      I&apos;m Experienced
                    </h4>
                    <p className="text-[11.5px] text-[#667085]">
                      Looking for career growth or transition.
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    careerStatus === "experienced"
                      ? "bg-[#635BFF] border-[#635BFF] text-white"
                      : "border-[#CBD5E1] bg-white"
                  }`}
                >
                  {careerStatus === "experienced" && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: INTERESTS ONLY                                                    */}
          {/* ========================================================================= */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="space-y-2.5 w-full text-left"
            >
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[13px] font-semibold text-[#172033]">
                  Career Interests
                </span>
                <span
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border transition-colors ${
                    selectedInterests.length > 0
                      ? "text-[#635BFF] bg-[#EEF2FF] border-[#C7D2FE]"
                      : "text-[#667085] bg-white border-[#E4E7EC]"
                  }`}
                >
                  {selectedInterests.length} / 5 selected
                </span>
              </div>

              {interestLimitNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] font-medium text-[#EA580C] bg-[#FFF7ED] px-3 py-1.5 rounded-[10px] border border-[#FFEDD5]"
                >
                  You can select up to 5 interests.
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-2 max-h-[380px] sm:max-h-[420px] overflow-y-auto pr-0 w-full box-border no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {INTEREST_CATEGORIES_CONFIG.map((cat) => {
                  const isSelected = selectedInterests.includes(cat.id);
                  const IconComponent = cat.icon;

                  return (
                    <motion.button
                      key={cat.id}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleInterest(cat.id)}
                      className={`h-[50px] sm:h-[52px] px-2.5 py-1.5 rounded-[12px] border text-left flex items-center justify-between gap-2 transition-all select-none box-border ${
                        isSelected
                          ? "bg-[#EEF2FF] border-[#635BFF] shadow-xs ring-1 ring-[#635BFF]/30 text-[#172033]"
                          : "bg-white border-[#E4E7EC] hover:border-[#CBD5E1] text-[#172033]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div
                          className="w-[32px] h-[32px] shrink-0 rounded-[9px] flex items-center justify-center transition-transform"
                          style={{ backgroundColor: cat.bg }}
                        >
                          <IconComponent
                            className="w-[18px] h-[18px]"
                            style={{ color: cat.color }}
                          />
                        </div>

                        <span className="text-[11.5px] sm:text-[12px] font-medium truncate leading-tight text-[#172033]">
                          {cat.name}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#635BFF] text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: SKILLS ONLY                                                       */}
          {/* ========================================================================= */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="space-y-3.5 w-full text-left"
            >
              {/* Search Field with Mic Icon */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#635BFF]" />
                <input
                  type="text"
                  placeholder="Search for a skill..."
                  value={skillSearchQuery}
                  onChange={(e) => setSkillSearchQuery(e.target.value)}
                  className="w-full h-[46px] pl-10 pr-10 rounded-[13px] bg-[#FFFFFF] border border-[#E4E7EC] text-[13px] font-normal text-[#172033] placeholder:text-[#667085]/60 placeholder:text-[12px] focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 outline-none transition-all shadow-2xs"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {skillSearchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSkillSearchQuery("")}
                      className="p-1 text-[#667085] hover:text-[#172033]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      title="Voice search"
                      className="p-1 text-[#8B5CF6] hover:text-[#635BFF] transition-colors"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Your Skills (Pastel Color Tags) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-0.5">
                  <h3 className="text-[13px] font-semibold text-[#172033]">
                    Your Skills
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                        selectedSkills.length > 0
                          ? "text-[#635BFF] bg-[#EEF2FF] border-[#C7D2FE]"
                          : "text-[#667085] bg-white border-[#E4E7EC]"
                      }`}
                    >
                      {selectedSkills.length} / 10
                    </span>
                    {selectedSkills.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedSkills([])}
                        className="text-[10.5px] font-medium text-[#667085] hover:text-[#EF4444] transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {skillLimitNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] font-medium text-[#EA580C] bg-[#FFF7ED] px-3 py-1.5 rounded-[10px] border border-[#FFEDD5]"
                  >
                    Up to 10 skills can be selected.
                  </motion.div>
                )}

                <div className="min-h-[36px] flex flex-wrap gap-1.5 items-center">
                  {selectedSkills.length > 0 ? (
                    selectedSkills.map((skill) => {
                      const theme = getSkillTheme(skill);
                      const currentLevel = skillLevels[skill];

                      return (
                        <motion.div
                          key={skill}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium border shadow-2xs transition-all"
                          style={{
                            backgroundColor: theme.bg,
                            borderColor: theme.border,
                            color: theme.text,
                          }}
                        >
                          <Check
                            className="w-3 h-3 stroke-[2.5]"
                            style={{ color: theme.accent }}
                          />
                          <span>{skill}</span>

                          <button
                            type="button"
                            onClick={() => cycleSkillLevel(skill)}
                            title="Confidence Level"
                            className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/80 hover:bg-white text-[#172033] border border-black/5 transition-all ml-0.5"
                          >
                            {currentLevel || "Mid"}
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className="hover:text-[#EF4444] transition-colors p-0.5 -mr-0.5"
                            aria-label={`Remove ${skill}`}
                          >
                            <X className="w-2.5 h-2.5 stroke-[2.5]" />
                          </button>
                        </motion.div>
                      );
                    })
                  ) : (
                    <p className="text-[12px] text-[#667085] italic py-1">
                      No skills selected yet. Choose from below or search.
                    </p>
                  )}
                </div>
              </div>

              {/* Explore Skills Category Filter Bar */}
              <div className="space-y-1.5 pt-1 border-t border-[#F1F5F9]">
                <span className="text-[10.5px] font-bold text-[#667085] uppercase tracking-wider px-0.5">
                  Explore skills
                </span>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
                  {SKILL_EXPLORE_CATEGORIES.map((cat) => {
                    const isSelected = activeSkillCategory === cat.id && !skillSearchQuery;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setActiveSkillCategory(cat.id);
                          setSkillSearchQuery("");
                        }}
                        className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] text-[11px] font-semibold border transition-all ${
                          isSelected
                            ? "bg-[#635BFF] text-white border-[#635BFF] shadow-xs"
                            : "bg-white text-[#172033] border-[#E4E7EC] hover:border-[#CBD5E1] hover:bg-slate-50"
                        }`}
                      >
                        {renderExploreCategoryIcon(cat.iconName)}
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Suggested Skills Grid */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[12.5px] font-semibold text-[#172033]">
                    {skillSearchQuery
                      ? "Matching Skills"
                      : activeSkillCategory !== "all"
                      ? `${SKILL_EXPLORE_CATEGORIES.find((c) => c.id === activeSkillCategory)?.name} Skills`
                      : "Suggested for you"}
                  </span>
                  {!skillSearchQuery && activeSkillCategory === "all" && (
                    <span className="text-[10px] font-medium text-[#635BFF] bg-[#EEF2FF] px-2 py-0.5 rounded-full">
                      Based on your interests
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-[140px] sm:max-h-[160px] overflow-y-auto pr-0 no-scrollbar">
                  {displayedSkills.length > 0 ? (
                    displayedSkills.map((skillName) => {
                      const isSelected = selectedSkills.includes(skillName);
                      const theme = getSkillTheme(skillName);

                      return (
                        <motion.button
                          key={skillName}
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleSkill(skillName)}
                          className={`h-[42px] px-2.5 rounded-[11px] border text-left flex items-center justify-between gap-1.5 transition-all select-none ${
                            isSelected
                              ? "bg-[#EEF2FF] border-[#635BFF] shadow-2xs ring-1 ring-[#635BFF]/30 text-[#172033]"
                              : "bg-white border-[#E4E7EC] hover:border-[#CBD5E1] text-[#172033]"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: theme.accent }}
                            />
                            <span className="text-[11.5px] font-medium truncate leading-tight">
                              {skillName}
                            </span>
                          </div>

                          <div className="shrink-0">
                            {isSelected ? (
                              <div className="w-4 h-4 rounded-full bg-[#635BFF] text-white flex items-center justify-center shadow-2xs">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-[#CBD5E1] bg-white flex items-center justify-center text-[#667085]">
                                <Plus className="w-2.5 h-2.5 text-[#635BFF]" />
                              </div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })
                  ) : (
                    <div className="col-span-2 p-2.5 rounded-[12px] bg-white border border-[#E4E7EC] flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10.5px] text-[#667085]">Add custom skill:</p>
                        <p className="text-[12px] font-bold text-[#172033] truncate">
                          &quot;{skillSearchQuery}&quot;
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddCustomSkillDirect(skillSearchQuery)}
                        className="shrink-0 px-3 py-1.5 rounded-[8px] bg-[#EEF2FF] text-[#635BFF] text-[11.5px] font-bold border border-[#C7D2FE] hover:bg-[#635BFF] hover:text-white transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Helper Card */}
              <div className="p-2.5 rounded-[13px] bg-gradient-to-r from-[#EEF2FF] via-[#F5F3FF] to-[#F8FAFF] border border-[#C7D2FE] flex items-center justify-between gap-2 shadow-2xs">
                <div className="space-y-0.2 min-w-0">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#4338CA]">
                    <Sparkles className="w-3 h-3 text-[#635BFF]" />
                    <span>Pathly AI Skill Suggester</span>
                  </div>
                  <p className="text-[10px] text-[#667085] truncate">
                    Not sure which skills match your interests?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAiSuggestSkills}
                  className="shrink-0 px-2.5 py-1 rounded-[8px] bg-white text-[#635BFF] text-[10.5px] font-bold border border-[#C7D2FE] shadow-2xs hover:bg-[#635BFF] hover:text-white transition-all flex items-center gap-1"
                >
                  <span>Suggest for me</span>
                </button>
              </div>

              {aiSuggestNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-1.5 text-[10.5px] font-medium text-[#15803D] bg-[#F0FDF4] px-2.5 py-1 rounded-[8px] border border-[#BBF7D0]"
                >
                  <Sparkles className="w-3 h-3 text-[#16A34A]" />
                  <span>AI matched & added recommended skills from your interests!</span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 2: CAREER MATCHES (TOP 3 MATCHES + DYNAMIC PREFERENCES)            */}
          {/* ========================================================================= */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="space-y-3 w-full text-left"
            >
              {/* Match Summary Pill */}
              <div className="flex items-center justify-between px-0.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3 text-[#635BFF]" />
                  <span>AI Career Match • Based on your profile</span>
                </div>
                <span className="text-[11px] font-bold text-[#667085]">
                  {recommendedCareers.length} matches
                </span>
              </div>

              {/* Category Filter Pills (Horizontal scrollable with hidden scrollbar) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar -mx-0.5 px-0.5">
                <button
                  type="button"
                  onClick={() => setStep4CategoryFilter("all")}
                  className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    step4CategoryFilter === "all"
                      ? "bg-[#635BFF] text-white border-[#635BFF] shadow-xs"
                      : "bg-white text-[#172033] border-[#E4E7EC] hover:bg-slate-50"
                  }`}
                >
                  All Matches ({recommendedCareers.length})
                </button>

                {selectedInterests.map((interestId) => {
                  const interestObj = INTEREST_CATEGORIES_CONFIG.find((i) => i.id === interestId);
                  if (!interestObj) return null;
                  const isSelected = step4CategoryFilter === interestId;
                  return (
                    <button
                      key={interestId}
                      type="button"
                      onClick={() => setStep4CategoryFilter(isSelected ? "all" : interestId)}
                      className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                        isSelected
                          ? "bg-[#635BFF] text-white border-[#635BFF] shadow-xs"
                          : "bg-white text-[#172033] border-[#E4E7EC] hover:bg-slate-50"
                      }`}
                    >
                      <span>{interestObj.name.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Top 3 High-Value Career Cards */}
              <div className="space-y-2">
                {visibleRecommendations.map((career, idx) => {
                  const isSelected = activePrimaryCareer?.id === career.id;

                  return (
                    <motion.div
                      key={career.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.2 }}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedPrimaryCareer(career)}
                      onKeyDown={(e) => e.key === "Enter" && setSelectedPrimaryCareer(career)}
                      className={`p-3 rounded-[14px] border text-left cursor-pointer transition-all flex flex-col gap-2 ${
                        isSelected
                          ? "bg-[#EEF2FF] border-[#635BFF] shadow-xs ring-1 ring-[#635BFF]/30"
                          : "bg-white border-[#E4E7EC] hover:border-[#CBD5E1] hover:bg-slate-50/70"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {renderCareerIcon(career)}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-[13px] text-[#172033] truncate">
                              {career.title}
                            </h4>
                            <p className="text-[11px] text-[#667085] truncate">
                              {career.category}
                            </p>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#C7D2FE] text-[#635BFF] shadow-2xs">
                            {career.matchPercentage}% Match
                          </span>
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full bg-[#635BFF] text-white flex items-center justify-center shadow-2xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
                          )}
                        </div>
                      </div>

                      {/* Matching Skills Pills Preview */}
                      <div className="flex items-center gap-1 flex-wrap pt-0.5 border-t border-black/5">
                        <span className="text-[10px] text-[#667085] font-medium">Matching skills:</span>
                        {career.matchingSkills.map((sk) => (
                          <span
                            key={sk}
                            className="text-[10px] font-semibold text-[#15803D] bg-[#F0FDF4] px-1.5 py-0.2 rounded border border-[#BBF7D0]"
                          >
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* View All Matches Toggle Button */}
              {recommendedCareers.length > 3 && (
                <div className="text-center pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowAllMatches(!showAllMatches)}
                    className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#635BFF] hover:underline"
                  >
                    <span>
                      {showAllMatches
                        ? "Show top 3 matches"
                        : `View all career matches (${recommendedCareers.length})`}
                    </span>
                    {showAllMatches ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* Personalize Your Opportunities (Dynamic Preferences) */}
              <div className="p-3 rounded-[14px] bg-white border border-[#E4E7EC] shadow-2xs space-y-2.5">
                <span className="text-[11px] font-bold text-[#172033] uppercase tracking-wider block">
                  Personalize your opportunities
                </span>

                <PathlyInput
                  label="Preferred Location / State"
                  placeholder="e.g. Tamil Nadu, Chennai, Remote, All India"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4 text-[#667085]" />}
                  className="h-[38px] text-[12px]"
                />

                {/* Dynamic Preference: Exam Scope for Govt careers, Work Mode for Private/Tech */}
                {isGovExamCareer ? (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-[#172033]">
                      Exam & Recruitment Focus
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {GOV_EXAM_SCOPES.map((scope) => {
                        const isSelected = govExamScope === scope.id;
                        return (
                          <button
                            key={scope.id}
                            type="button"
                            onClick={() => setGovExamScope(scope.id)}
                            className={`p-2 rounded-[10px] border text-center text-[11px] font-semibold transition-all ${
                              isSelected
                                ? "bg-[#635BFF] text-white border-[#635BFF] shadow-xs"
                                : "bg-white text-[#172033] border-[#E4E7EC] hover:border-[#CBD5E1]"
                            }`}
                          >
                            <span className="truncate block">{scope.label.split(" ")[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-[#172033]">
                      Work Mode Preference
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {WORK_MODES.map((mode) => {
                        const isSelected = workPreference.includes(mode.id);
                        const Icon = mode.icon;
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => toggleWorkMode(mode.id)}
                            className={`p-2 rounded-[10px] border flex items-center justify-center gap-1 text-[11px] font-semibold transition-all ${
                              isSelected
                                ? "bg-[#635BFF] text-white border-[#635BFF] shadow-xs"
                                : "bg-white text-[#172033] border-[#E4E7EC] hover:border-[#CBD5E1]"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{mode.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed/Sticky Bottom Action Area with AI Hint & CTA */}
      <div className="w-full max-w-sm mx-auto pt-2 pb-0.5 shrink-0 z-10 bg-gradient-to-t from-[#F8FAFF] via-[#F8FAFF]/95 to-transparent space-y-1.5">
        {step === 3 && (
          <div className="flex items-center justify-center gap-1 text-[11px] text-[#667085]">
            <Sparkles className="w-3 h-3 text-[#635BFF] animate-pulse" />
            <span>✦ We&apos;ll use your skills to personalize your career matches.</span>
          </div>
        )}

        {step === 4 && (
          <div className="flex items-center justify-center gap-1 text-[11px] text-[#667085]">
            <Sparkles className="w-3 h-3 text-[#635BFF]" />
            <span>✦ We&apos;ll tailor your roadmap and opportunities.</span>
          </div>
        )}

        <PathlyButton
          variant="primary"
          size="lg"
          fullWidth
          disabled={(step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)}
          onClick={handleNext}
          className="h-[48px] sm:h-[50px] rounded-[14px] text-[14px] font-semibold shadow-md shadow-brand-500/20"
        >
          {step === 4
            ? "Continue to Pathly →"
            : step === 3
            ? "Find My Career Matches →"
            : "Continue →"}
        </PathlyButton>
      </div>
    </div>
  );
}
