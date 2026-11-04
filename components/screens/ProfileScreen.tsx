"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Sliders,
  FileText,
  Brain,
  Briefcase,
  GraduationCap,
  Target,
  Bookmark,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  Plus,
  Edit3,
  Download,
  Eye,
  Trash2,
  Upload,
  Check,
  Zap,
  MapPin,
  Clock,
  Plane,
  RefreshCw,
  Shield,
  Bell,
  Lock,
  Building2,
  DollarSign,
  X,
  Mail,
  Phone,
  Calendar,
  Layers,
  CheckSquare,
  FileCheck,
  FileUp,
} from "lucide-react";

type ProfilePage =
  | "menu"
  | "my_profile"
  | "career_preferences"
  | "resume_score"
  | "skills"
  | "experience"
  | "education"
  | "career_interests"
  | "saved_jobs"
  | "settings"
  | "help"
  | "edit_profile_full";

type EditProfileTab = "personal" | "career" | "preferences" | "experience" | "education" | "skills";

interface ProfileScreenProps {
  onNavigateToTab: (tabId: "home" | "jobs" | "learn" | "ai" | "profile") => void;
  onSelectJob?: (jobId: string) => void;
  onRestartOnboarding?: () => void;
}

export function ProfileScreen({
  onNavigateToTab,
  onSelectJob,
  onRestartOnboarding,
}: ProfileScreenProps) {
  const [currentPage, setCurrentPage] = useState<ProfilePage>("menu");
  const [showToast, setShowToast] = useState<string | null>(null);

  // Edit Profile Tab state
  const [editProfileTab, setEditProfileTab] = useState<EditProfileTab>("personal");

  // Single Preference Edit Modal
  const [editingField, setEditingField] = useState<string | null>(null);

  // Replace Resume Modal state
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState<{
    name: string;
    size: string;
    valid: boolean;
    error?: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [currentResumeName, setCurrentResumeName] = useState("Alex_Morgan_Resume.pdf");

  const { user, profile, logout, updateProfile } = useAuth();

  // Profile data states
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.full_name || "Alex Morgan",
    email: user?.email || "alex.morgan@pathly.ai",
    phone: user?.mobile || "+91 98765 43210",
    location: profile?.preferred_locations?.[0] || "Chennai, Tamil Nadu",
    gender: "Male",
    dob: "15/08/2000",
  });

  const [careerPrefs, setCareerPrefs] = useState({
    careerStatus: profile?.career_status === "experienced" ? "Experienced · 2+ Years" : "Fresher / Entry-Level",
    location: profile?.preferred_locations?.[0] || "Chennai, Tamil Nadu",
    openToRelocation: true,
    salaryMin: "₹6,00,000",
    salaryMax: "₹10,00,000",
    salaryDisplay: "₹6–10 LPA",
    workMode: profile?.preferred_work_modes?.length ? profile.preferred_work_modes.join(" / ") : "Hybrid · Open to Remote",
    rawWorkMode: profile?.preferred_work_modes?.[0] || "Hybrid",
    openToRemote: true,
    noticePeriod: "30 Days (Negotiable)",
    jobType: "Full Time",
  });

  const [targetRoles, setTargetRoles] = useState(
    profile?.target_role ? [profile.target_role, "Frontend Developer", "UI/UX Designer"] : [
      "Frontend Developer",
      "UI/UX Designer",
      "TNPSC Group 4",
      "TNPSC Group 2 & 2A",
    ]
  );

  useEffect(() => {
    if (user) {
      setPersonalInfo((prev) => ({
        ...prev,
        fullName: user.full_name || prev.fullName,
        email: user.email || prev.email,
        phone: user.mobile || prev.phone,
      }));
    }
    if (profile) {
      if (profile.career_status) {
        setCareerPrefs((prev) => ({
          ...prev,
          careerStatus: profile.career_status === "experienced" ? "Experienced · 2+ Years" : "Fresher / Entry-Level",
        }));
      }
      if (profile.skills && profile.skills.length > 0) {
        setSelectedSkills(profile.skills.map((s) => s.name));
      }
      if (profile.interests && profile.interests.length > 0) {
        setInterests(profile.interests);
      }
      if (profile.target_role) {
        setTargetRoles((prev) => Array.from(new Set([profile.target_role!, ...prev])));
      }
      if (profile.preferred_locations && profile.preferred_locations.length > 0) {
        setPersonalInfo((prev) => ({ ...prev, location: profile.preferred_locations![0] }));
        setCareerPrefs((prev) => ({ ...prev, location: profile.preferred_locations![0] }));
      }
    }
  }, [user, profile]);

  // Resume states
  const [hasResume, setHasResume] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [hasOptimized, setHasOptimized] = useState(false);
  const [activeResumeVersion, setActiveResumeVersion] = useState<"original" | "improved">("original");

  // Skills
  const [skillsSearch, setSkillsSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([
    "React",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "Git",
    "Communication",
    "Problem Solving",
  ]);
  const [suggestedSkills, setSuggestedSkills] = useState([
    "Next.js",
    "GraphQL",
    "Testing",
  ]);

  const [interests, setInterests] = useState([
    "Frontend Development",
    "UI/UX",
    "Government Jobs",
    "Banking",
    "TNPSC",
  ]);

  // Saved Jobs
  const [savedJobsList, setSavedJobsList] = useState([
    {
      id: "job-1",
      title: "Frontend Developer",
      company: "Google",
      location: "Chennai · Hybrid",
      salary: "₹6–10 LPA",
      match: 94,
    },
    {
      id: "job-2",
      title: "Frontend Engineer",
      company: "Microsoft",
      location: "Bangalore · On-site",
      salary: "₹8–12 LPA",
      match: 91,
    },
  ]);

  // Settings toggles
  const [profileVisible, setProfileVisible] = useState(true);
  const [resumeVisible, setResumeVisible] = useState(true);
  const [recruiterContact, setRecruiterContact] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  const completionPercentage = profile?.profile_completion_percentage ?? 85;
  const userInitials = personalInfo.fullName
    ? personalInfo.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AM";

  const handleSaveAllProfileChanges = async () => {
    try {
      if (updateProfile) {
        await updateProfile({
          skills: selectedSkills.map((s) => ({ name: s, level: "Intermediate" })),
          interests: interests,
          target_role: targetRoles[0] || "Frontend Engineer",
          preferred_locations: [personalInfo.location],
        });
      }
      triggerToast("✓ Profile updated successfully");
    } catch (err) {
      console.warn("Failed to update profile", err);
      triggerToast("✓ Profile saved locally");
    }
    setCurrentPage("my_profile");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = [".pdf", ".docx", ".doc"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const isAllowed = allowedExtensions.includes(ext);

    if (!isAllowed) {
      setSelectedUploadFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        valid: false,
        error: "Please upload a PDF or DOCX file.",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSelectedUploadFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        valid: false,
        error: "Resume must be smaller than 10 MB.",
      });
      return;
    }

    setSelectedUploadFile({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      valid: true,
    });
  };

  const handleUploadAndAnalyze = () => {
    if (!selectedUploadFile || !selectedUploadFile.valid) return;
    setIsUploading(true);
    setUploadPercent(0);
    setAnalysisStep(0);

    let p = 0;
    const progressTimer = setInterval(() => {
      p += 25;
      setUploadPercent(p);
      if (p >= 100) {
        clearInterval(progressTimer);
        let step = 1;
        const analysisTimer = setInterval(() => {
          setAnalysisStep(step);
          step += 1;
          if (step > 5) {
            clearInterval(analysisTimer);
            setTimeout(() => {
              setIsUploading(false);
              setCurrentResumeName(selectedUploadFile.name);
              setShowReplaceModal(false);
              setSelectedUploadFile(null);
              setHasOptimized(false);
              setActiveResumeVersion("original");
              triggerToast(`✓ Resume Updated: ${selectedUploadFile.name}`);
            }, 500);
          }
        }, 300);
      }
    }, 120);
  };

  const handleStartOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setHasOptimized(true);
      setActiveResumeVersion("improved");
      triggerToast("✓ Resume optimized (+8 points)!");
    }, 1500);
  };

  // Circular progress calculation for AI Resume Score
  const currentDisplayScore = hasOptimized && activeResumeVersion === "improved" ? 94 : 86;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentDisplayScore / 100) * circumference;

  const menuItems = [
    { id: "my_profile" as ProfilePage, label: "My Profile", icon: User },
    { id: "career_preferences" as ProfilePage, label: "Career Preferences", icon: Sliders },
    { id: "resume_score" as ProfilePage, label: "Resume & AI Score", icon: FileText, badge: `${currentDisplayScore} Score` },
    { id: "skills" as ProfilePage, label: "Skills", icon: Brain },
    { id: "experience" as ProfilePage, label: "Experience", icon: Briefcase },
    { id: "education" as ProfilePage, label: "Education", icon: GraduationCap },
    { id: "career_interests" as ProfilePage, label: "Career Interests", icon: Target },
    { id: "saved_jobs" as ProfilePage, label: "Saved Jobs", icon: Bookmark, badge: `${savedJobsList.length}` },
    { id: "settings" as ProfilePage, label: "Settings", icon: Settings },
    { id: "help" as ProfilePage, label: "Help & Support", icon: HelpCircle },
  ];

  // Helper Header for Subpages (56px)
  const renderSubpageHeader = (title: string, onBackAction?: () => void, rightAction?: React.ReactNode) => (
    <div className="h-[56px] flex items-center justify-between border-b border-[#E8E5F2] -mx-4 px-4 bg-white sticky top-0 z-20 mb-4">
      <button
        type="button"
        onClick={() => {
          if (onBackAction) onBackAction();
          else setCurrentPage("menu");
        }}
        className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#17152A] hover:text-[#6D5DF5] transition-colors p-1 -ml-1"
        aria-label="Back"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <h1 className="text-[15px] font-bold text-[#17152A] tracking-tight">{title}</h1>

      <div className="min-w-[48px] flex justify-end">
        {rightAction || <div className="w-6" />}
      </div>
    </div>
  );

  return (
    <div className="w-full text-left select-none relative pb-36 font-sans">
      {/* Toast Feedback */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-4 right-4 z-50 w-[205px] h-[60px] bg-[#18152B] text-white rounded-[16px] shadow-2xl p-3 flex items-center gap-2.5 border border-white/10 select-none"
          >
            <div className="w-5 h-5 rounded-full bg-[#22C995]/20 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-[#22C995]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold text-white leading-tight truncate">
                {showToast.includes("+8") ? "Resume optimized" : showToast}
              </p>
              <p className="text-[10.5px] font-semibold text-[#22C995] leading-tight mt-0.5">
                {showToast.includes("+8") ? "+8 points improvement" : "Updated successfully"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================================= */}
      {/* REPLACE RESUME MODAL / BOTTOM SHEET                                     */}
      {/* ======================================================================= */}
      <AnimatePresence>
        {showReplaceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4 overflow-hidden pointer-events-auto"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="w-full max-w-md bg-white rounded-t-[20px] sm:rounded-[20px] border border-[#E8E5F2] p-5 space-y-4 text-left shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#E8E5F2] pb-3">
                <div>
                  <h3 className="text-[15px] font-bold text-[#17152A]">Replace Your Resume</h3>
                  <p className="text-[11.5px] text-[#667085]">
                    Upload your latest resume to update your Pathly profile.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isUploading) {
                      setShowReplaceModal(false);
                      setSelectedUploadFile(null);
                    }
                  }}
                  className="p-1 text-[#667085] hover:text-[#17152A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!isUploading ? (
                <div className="space-y-3.5">
                  {/* Upload Drop Area */}
                  <label className="block p-6 rounded-[14px] bg-[#FAF9FF] border-2 border-dashed border-[#C7D2FE] text-center cursor-pointer hover:bg-[#F5F3FF] transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="w-11 h-11 mx-auto rounded-full bg-[#F1EFFF] flex items-center justify-center text-[#6D5DF5] mb-2">
                      <FileUp className="w-5 h-5" />
                    </div>
                    <p className="text-[13.5px] font-bold text-[#17152A]">Upload Resume</p>
                    <p className="text-[11.5px] text-[#667085] mt-0.5">PDF or DOCX · Maximum 10 MB</p>
                    <span className="inline-block mt-3 px-3.5 py-1.5 rounded-[8px] bg-white border border-[#E8E5F2] text-[12px] font-semibold text-[#6D5DF5] shadow-2xs">
                      Choose File
                    </span>
                  </label>

                  {/* Selected File Preview / Validation Notice */}
                  {selectedUploadFile && (
                    <div
                      className={`p-3 rounded-[10px] border flex items-center justify-between gap-2 text-[12px] ${
                        selectedUploadFile.valid
                          ? "bg-[#ECFBF5] border-[#A7F3D0] text-[#087F5B]"
                          : "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold truncate">{selectedUploadFile.name}</p>
                          <p className="text-[10.5px]">
                            {selectedUploadFile.valid
                              ? `${selectedUploadFile.size} · ✓ Ready to upload`
                              : selectedUploadFile.error}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedUploadFile(null)}
                        className="text-[#667085] hover:text-[#17152A]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReplaceModal(false);
                        setSelectedUploadFile(null);
                      }}
                      className="h-[44px] rounded-[10px] border border-[#E8E5F2] text-[#667085] font-semibold text-[13px] hover:bg-[#FAF9FF]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!selectedUploadFile || !selectedUploadFile.valid}
                      onClick={handleUploadAndAnalyze}
                      className={`h-[44px] rounded-[10px] text-white font-semibold text-[13px] transition-all ${
                        selectedUploadFile && selectedUploadFile.valid
                          ? "bg-[#6D5DF5] hover:bg-[#5146C7] shadow-sm"
                          : "bg-[#C7D2FE] cursor-not-allowed"
                      }`}
                    >
                      Upload & Analyze →
                    </button>
                  </div>
                </div>
              ) : (
                /* Uploading & Analyzing Progress Screen */
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[12px] font-semibold">
                      <span className="text-[#17152A]">
                        {uploadPercent < 100 ? "Uploading resume..." : "Analyzing your resume..."}
                      </span>
                      <span className="text-[#6D5DF5]">{uploadPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#E9E7F2] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#6D5DF5] rounded-full"
                        style={{ width: `${uploadPercent}%` }}
                      />
                    </div>
                  </div>

                  {uploadPercent >= 100 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3.5 rounded-[12px] bg-[#FAF9FF] border border-[#E8E5F2] space-y-1.5 text-[11.5px]"
                    >
                      <p className={`flex items-center gap-2 ${analysisStep >= 1 ? "text-[#087F5B]" : "text-[#667085]"}`}>
                        {analysisStep >= 1 ? "✓" : "○"} Reading resume
                      </p>
                      <p className={`flex items-center gap-2 ${analysisStep >= 2 ? "text-[#087F5B]" : "text-[#667085]"}`}>
                        {analysisStep >= 2 ? "✓" : "○"} Extracting skills
                      </p>
                      <p className={`flex items-center gap-2 ${analysisStep >= 3 ? "text-[#087F5B]" : "text-[#667085]"}`}>
                        {analysisStep >= 3 ? "✓" : "○"} Checking experience
                      </p>
                      <p className={`flex items-center gap-2 ${analysisStep >= 4 ? "text-[#087F5B]" : "text-[#667085]"}`}>
                        {analysisStep >= 4 ? "✓" : "○"} Matching target roles
                      </p>
                      <p className={`flex items-center gap-2 ${analysisStep >= 5 ? "text-[#087F5B]" : "text-[#667085]"}`}>
                        {analysisStep >= 5 ? "✓" : "○"} Calculating ATS score
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Single Preference Bottom Sheet Modal */}
      <AnimatePresence>
        {editingField && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4 overflow-hidden pointer-events-auto"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="w-full max-w-md bg-white rounded-t-[20px] sm:rounded-[20px] border border-[#E8E5F2] p-5 space-y-4 text-left shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#E8E5F2] pb-3">
                <h3 className="text-[15px] font-bold text-[#17152A]">
                  Edit {editingField}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingField(null)}
                  className="p-1 text-[#667085] hover:text-[#17152A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {editingField === "Expected Salary" && (
                <div className="space-y-3 text-[12.5px]">
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#667085]">Minimum Salary</label>
                    <input
                      type="text"
                      defaultValue={careerPrefs.salaryMin}
                      onChange={(e) => setCareerPrefs({ ...careerPrefs, salaryMin: e.target.value })}
                      className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#667085]">Maximum Salary</label>
                    <input
                      type="text"
                      defaultValue={careerPrefs.salaryMax}
                      onChange={(e) => setCareerPrefs({ ...careerPrefs, salaryMax: e.target.value })}
                      className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                    />
                  </div>
                  <p className="text-[11px] text-[#667085]">Currency: Indian Rupee (INR)</p>
                </div>
              )}

              {editingField === "Preferred Work Mode" && (
                <div className="space-y-3 text-[12.5px]">
                  <div className="space-y-2">
                    {["Remote", "Hybrid", "On-site"].map((mode) => (
                      <label
                        key={mode}
                        className="flex items-center justify-between p-3 rounded-[10px] border border-[#E8E5F2] cursor-pointer hover:bg-[#FAF9FF]"
                      >
                        <span className="font-semibold text-[#17152A]">{mode}</span>
                        <input
                          type="radio"
                          name="workMode"
                          checked={careerPrefs.rawWorkMode === mode}
                          onChange={() =>
                            setCareerPrefs({
                              ...careerPrefs,
                              rawWorkMode: mode,
                              workMode: `${mode} · ${careerPrefs.openToRemote ? "Open to Remote" : ""}`,
                            })
                          }
                          className="accent-[#6D5DF5]"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-[10px] bg-[#FAF9FF] border border-[#E8E5F2]">
                    <span className="font-semibold text-[#17152A]">Open to Remote</span>
                    <input
                      type="checkbox"
                      checked={careerPrefs.openToRemote}
                      onChange={(e) =>
                        setCareerPrefs({
                          ...careerPrefs,
                          openToRemote: e.target.checked,
                          workMode: `${careerPrefs.rawWorkMode} · ${e.target.checked ? "Open to Remote" : ""}`,
                        })
                      }
                      className="accent-[#6D5DF5] w-4 h-4"
                    />
                  </div>
                </div>
              )}

              {editingField === "Preferred Location" && (
                <div className="space-y-3 text-[12.5px]">
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#667085]">City / State</label>
                    <input
                      type="text"
                      defaultValue={careerPrefs.location}
                      onChange={(e) => setCareerPrefs({ ...careerPrefs, location: e.target.value })}
                      className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-[10px] bg-[#FAF9FF] border border-[#E8E5F2]">
                    <span className="font-semibold text-[#17152A]">Open to Relocation</span>
                    <input
                      type="checkbox"
                      checked={careerPrefs.openToRelocation}
                      onChange={(e) => setCareerPrefs({ ...careerPrefs, openToRelocation: e.target.checked })}
                      className="accent-[#6D5DF5] w-4 h-4"
                    />
                  </div>
                </div>
              )}

              {editingField !== "Expected Salary" &&
                editingField !== "Preferred Work Mode" &&
                editingField !== "Preferred Location" && (
                  <div className="space-y-2">
                    <label className="text-[11.5px] font-semibold text-[#667085]">{editingField}</label>
                    <input
                      type="text"
                      defaultValue="30 Days (Negotiable)"
                      className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                    />
                  </div>
                )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingField(null)}
                  className="h-[44px] rounded-[10px] border border-[#E8E5F2] text-[#667085] font-semibold text-[13px] hover:bg-[#FAF9FF]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingField(null);
                    triggerToast(`✓ ${editingField} updated successfully`);
                  }}
                  className="h-[44px] rounded-[10px] bg-[#6D5DF5] text-white font-semibold text-[13px] hover:bg-[#5146C7]"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ======================================================================= */}
        {/* 1. PROFILE MENU                                                         */}
        {/* ======================================================================= */}
        {currentPage === "menu" && (
          <motion.div
            key="profile-menu-page"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4 pt-1"
          >
            {/* Profile Menu Header */}
            <div className="flex items-center gap-3.5 pb-2">
              <div className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full aspect-square bg-[#6D5DF5] text-white flex items-center justify-center font-bold text-[15px] shadow-sm shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-[17px] font-bold text-[#17152A]">{personalInfo.fullName}</h2>
                  <span className="text-[10.5px] font-bold text-[#087F5B] bg-[#ECFBF5] px-2 py-0.5 rounded-full">
                    {completionPercentage}% Complete
                  </span>
                </div>
                <p className="text-[12px] text-[#667085] truncate">{personalInfo.email}</p>
              </div>
            </div>

            {/* Menu Items List */}
            <div className="divide-y divide-[#E8E5F2] border-y border-[#E8E5F2]">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentPage(item.id)}
                    className="w-full py-3.5 px-1 flex items-center justify-between text-[13px] font-semibold text-[#17152A] hover:text-[#6D5DF5] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] bg-[#FAF9FF] flex items-center justify-center text-[#6D5DF5] shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="text-[10.5px] font-bold text-[#6D5DF5] bg-[#F1EFFF] px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-[#98A2B3] group-hover:text-[#6D5DF5] transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Logout at bottom of menu */}
            <div className="pt-2">
              <button
                type="button"
                onClick={async () => {
                  triggerToast("Logging out of Pathly...");
                  try {
                    await logout();
                    onRestartOnboarding?.();
                  } catch (e) {
                    console.error("Logout error", e);
                  }
                }}
                className="w-full py-2.5 px-1 flex items-center gap-2.5 text-[13px] font-semibold text-[#EF4444] hover:underline"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* 2. SUBPAGE: MY PROFILE                                                  */}
        {/* ======================================================================= */}
        {currentPage === "my_profile" && (
          <motion.div
            key="subpage-my-profile"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            {renderSubpageHeader("My Profile")}

            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center text-center space-y-2 py-1">
              <div className="w-16 h-16 min-w-[64px] min-h-[64px] rounded-full aspect-square bg-[#6D5DF5] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                {userInitials}
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-[#17152A]">{personalInfo.fullName}</h3>
                <p className="text-[12px] text-[#667085]">{personalInfo.email}</p>
              </div>
            </div>

            {/* Profile Completion Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11.5px]">
                <span className="font-semibold text-[#17152A]">Profile Completion</span>
                <span className="font-bold text-[#087F5B]">{completionPercentage}% Complete</span>
              </div>
              <div className="h-2 bg-[#E9E7F2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6D5DF5] to-[#22C995] rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="border-t border-[#E8E5F2]" />

            {/* Structured Rows */}
            <div className="space-y-3.5 text-[12.5px]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF9FF] flex items-center justify-center text-[#6D5DF5] shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#667085]">Full Name</p>
                  <p className="font-semibold text-[#17152A]">{personalInfo.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF9FF] flex items-center justify-center text-[#6D5DF5] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#667085]">Email Address</p>
                  <p className="font-semibold text-[#17152A]">{personalInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF9FF] flex items-center justify-center text-[#6D5DF5] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#667085]">Mobile Number</p>
                  <p className="font-semibold text-[#17152A]">{personalInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF9FF] flex items-center justify-center text-[#6D5DF5] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#667085]">Location</p>
                  <p className="font-semibold text-[#17152A]">{personalInfo.location}</p>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  setEditProfileTab("personal");
                  setCurrentPage("edit_profile_full");
                }}
                className="w-full h-[46px] rounded-[12px] bg-[#6D5DF5] text-white text-[13px] font-semibold hover:bg-[#5146C7] transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Edit Profile →</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* 3. SUBPAGE: CAREER PREFERENCES (ROW-BASED CLEAN LAYOUT)                 */}
        {/* ======================================================================= */}
        {currentPage === "career_preferences" && (
          <motion.div
            key="subpage-career-preferences"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            {renderSubpageHeader("Career Preferences")}

            {/* Target Roles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                  Target Roles
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const role = prompt("Enter target role:");
                    if (role && role.trim()) {
                      setTargetRoles([...targetRoles, role.trim()]);
                      triggerToast(`Added ${role}`);
                    }
                  }}
                  className="text-[11.5px] font-semibold text-[#6D5DF5] hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {targetRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="h-[32px] px-3 rounded-[16px] text-[11.5px] font-semibold bg-[#F1EFFF] text-[#5146C7] flex items-center"
                  >
                    {role}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const role = prompt("Enter target role:");
                    if (role && role.trim()) {
                      setTargetRoles([...targetRoles, role.trim()]);
                      triggerToast(`Added ${role}`);
                    }
                  }}
                  className="h-[32px] px-3 rounded-[16px] text-[11.5px] font-semibold bg-white text-[#6D5DF5] border border-dashed border-[#6D5DF5] hover:bg-[#F1EFFF] flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>
            </div>

            <div className="border-t border-[#E8E5F2]" />

            {/* Structured Preference Rows: [ICON 32px] [CONTENT flex:1] [EDIT flex-shrink:0] */}
            <div className="divide-y divide-[#E8E5F2] text-[12.5px]">
              {/* Row 1: Career Status */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#FAF9FF] flex items-center justify-center text-[#6D5DF5] shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#667085]">Career Status</p>
                  <p className="text-[13px] font-semibold text-[#17152A] truncate">
                    {careerPrefs.careerStatus}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingField("Career Status")}
                  className="text-[12px] font-semibold text-[#6D5DF5] hover:underline shrink-0"
                >
                  Edit →
                </button>
              </div>

              {/* Row 2: Location */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#FAF9FF] flex items-center justify-center text-[#6D5DF5] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#667085]">Preferred Location</p>
                  <p className="text-[13px] font-semibold text-[#17152A] truncate">
                    {careerPrefs.location}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingField("Preferred Location")}
                  className="text-[12px] font-semibold text-[#6D5DF5] hover:underline shrink-0"
                >
                  Edit →
                </button>
              </div>

              {/* Row 3: Salary */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#FAF9FF] flex items-center justify-center text-[#10B981] shrink-0">
                  <span className="font-bold text-[14px]">₹</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#667085]">Expected Salary</p>
                  <p className="text-[13px] font-semibold text-[#17152A] truncate">
                    {careerPrefs.salaryDisplay}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingField("Expected Salary")}
                  className="text-[12px] font-semibold text-[#6D5DF5] hover:underline shrink-0"
                >
                  Edit →
                </button>
              </div>

              {/* Row 4: Work Mode */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#FAF9FF] flex items-center justify-center text-[#6D5DF5] shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#667085]">Preferred Work Mode</p>
                  <p className="text-[13px] font-semibold text-[#17152A] truncate">
                    {careerPrefs.workMode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingField("Preferred Work Mode")}
                  className="text-[12px] font-semibold text-[#6D5DF5] hover:underline shrink-0"
                >
                  Edit →
                </button>
              </div>

              {/* Row 5: Notice Period */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#FAF9FF] flex items-center justify-center text-[#6D5DF5] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#667085]">Notice Period</p>
                  <p className="text-[13px] font-semibold text-[#17152A] truncate">
                    {careerPrefs.noticePeriod}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingField("Notice Period")}
                  className="text-[12px] font-semibold text-[#6D5DF5] hover:underline shrink-0"
                >
                  Edit →
                </button>
              </div>

              {/* Row 6: Job Type */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#FAF9FF] flex items-center justify-center text-[#6D5DF5] shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#667085]">Job Type</p>
                  <p className="text-[13px] font-semibold text-[#17152A] truncate">
                    {careerPrefs.jobType}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingField("Job Type")}
                  className="text-[12px] font-semibold text-[#6D5DF5] hover:underline shrink-0"
                >
                  Edit →
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditProfileTab("preferences");
                  setCurrentPage("edit_profile_full");
                }}
                className="w-full h-[46px] rounded-[12px] bg-[#6D5DF5] text-white text-[13px] font-semibold hover:bg-[#5146C7] transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Edit All Preferences →</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* 4. SUBPAGE: RESUME & AI SCORE (OPTIMIZER & MATCHING)                    */}
        {/* ======================================================================= */}
        {currentPage === "resume_score" && (
          <motion.div
            key="subpage-resume-score"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            {renderSubpageHeader("Resume & AI Score", () => {
              setCurrentPage("menu");
            })}

            {!hasResume ? (
              /* Clean Upload Area */
              <div className="p-5 rounded-[16px] bg-[#FAF9FF] border border-dashed border-[#C7D2FE] text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#F1EFFF] flex items-center justify-center text-[#6D5DF5]">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[14px] font-bold text-[#17152A]">Upload Your Resume</h3>
                  <p className="text-[11.5px] text-[#667085]">
                    Upload your latest resume to get an AI-powered career analysis.
                  </p>
                  <p className="text-[10.5px] text-[#667085]">Supported: PDF, DOC, DOCX</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReplaceModal(true)}
                  className="px-5 py-2 rounded-[10px] bg-[#6D5DF5] text-white text-[12.5px] font-semibold hover:bg-[#5146C7] transition-all shadow-sm"
                >
                  Upload Resume
                </button>

                <div className="pt-2 text-[11px] text-[#667085] space-y-1 text-left bg-white p-3 rounded-[10px] border border-[#E8E5F2]">
                  <p className="font-bold text-[#17152A]">Your resume will be analyzed for:</p>
                  <p className="text-[#087F5B]">✓ ATS compatibility</p>
                  <p className="text-[#087F5B]">✓ Skills & Keyword match</p>
                  <p className="text-[#087F5B]">✓ Experience quality</p>
                  <p className="text-[#087F5B]">✓ Target-role matching</p>
                  <p className="text-[#087F5B]">✓ Formatting & Structure</p>
                </div>
              </div>
            ) : (
              /* Resume Exists View */
              <div className="space-y-4">
                {/* 1. Current Resume Row: 36px icon, flex-1 content, text action links */}
                <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[#FAF9FF] border border-[#E8E5F2]">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-[8px] bg-[#F1EFFF] flex items-center justify-center text-[#6D5DF5] shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-[#17152A] truncate">
                        {activeResumeVersion === "improved"
                          ? "Alex_Morgan_Resume_Optimized.pdf"
                          : currentResumeName}
                      </p>
                      <p className="text-[11.5px] text-[#667085]">
                        Uploaded today · 240 KB
                        {activeResumeVersion === "improved" && " · (Optimized)"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-[12.5px] font-semibold shrink-0">
                    <button
                      type="button"
                      onClick={() => triggerToast("Viewing PDF preview")}
                      className="text-[#6D5DF5] hover:underline"
                    >
                      View
                    </button>
                    <span className="text-[#D1D5DB]">•</span>
                    <button
                      type="button"
                      onClick={() => setShowReplaceModal(true)}
                      className="text-[#6D5DF5] hover:underline"
                    >
                      Replace
                    </button>
                  </div>
                </div>

                {/* 2. AI Resume Score Section */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#6D5DF5]">
                      <Sparkles className="w-4 h-4" />
                      <h3 className="text-[15px] font-bold text-[#17152A]">
                        AI Resume Score
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#ECFBF5] text-[#087F5B] border border-[#A7F3D0]">
                      {hasOptimized && activeResumeVersion === "improved" ? "Excellent Resume" : "Good Resume"}
                    </span>
                  </div>

                  {/* Centered Circular Score Gauge */}
                  <div className="flex flex-col items-center justify-center py-2 space-y-2 text-center">
                    <div className="relative w-24 h-24 min-w-[96px] min-h-[96px] flex items-center justify-center">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 88 88">
                        <circle
                          cx="44"
                          cy="44"
                          r={radius}
                          stroke="#E9E7F2"
                          strokeWidth="6"
                          fill="none"
                        />
                        <motion.circle
                          cx="44"
                          cy="44"
                          r={radius}
                          stroke="#22C995"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[22px] font-bold text-[#17152A] leading-none">
                          {currentDisplayScore}
                        </span>
                        <span className="text-[10px] text-[#667085] font-semibold mt-0.5">
                          / 100
                        </span>
                      </div>
                    </div>

                    {hasOptimized && activeResumeVersion === "improved" ? (
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFBF5] border border-[#A7F3D0] text-[11px] font-bold text-[#087F5B]">
                          <span>Previous: 86</span>
                          <span>→</span>
                          <span>New: 94 / 100</span>
                          <span className="bg-[#22C995] text-white px-1.5 py-0.2 rounded-full text-[9.5px]">
                            +8 points
                          </span>
                        </div>
                        <p className="text-[11.5px] text-[#667085] max-w-xs leading-relaxed pt-0.5">
                          Your optimized resume is a stronger match for your target roles.
                        </p>
                      </div>
                    ) : (
                      <p className="text-[12px] text-[#667085] max-w-xs leading-relaxed pt-1">
                        Your resume is a strong match for your target roles.
                      </p>
                    )}
                  </div>

                  {/* 3. Score Breakdown List (Consistent Full-Width Progress Bars) */}
                  <div className="space-y-3 text-[11.5px] pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-[#475569]">ATS Compatibility</span>
                        <span className="font-bold text-[#6D5DF5]">
                          {hasOptimized && activeResumeVersion === "improved" ? "98%" : "92%"}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[#E9E7F2] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#6D5DF5] rounded-full transition-all duration-500"
                          style={{
                            width: hasOptimized && activeResumeVersion === "improved" ? "98%" : "92%",
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-[#475569]">Skills Match</span>
                        <span className="font-bold text-[#22C995]">
                          {hasOptimized && activeResumeVersion === "improved" ? "96%" : "88%"}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[#E9E7F2] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#22C995] rounded-full transition-all duration-500"
                          style={{
                            width: hasOptimized && activeResumeVersion === "improved" ? "96%" : "88%",
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-[#475569]">Experience Quality</span>
                        <span className="font-bold text-[#3B82F6]">
                          {hasOptimized && activeResumeVersion === "improved" ? "90%" : "82%"}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[#E9E7F2] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3B82F6] rounded-full transition-all duration-500"
                          style={{
                            width: hasOptimized && activeResumeVersion === "improved" ? "90%" : "82%",
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-[#475569]">Formatting & Structure</span>
                        <span className="font-bold text-[#8B7CF6]">
                          {hasOptimized && activeResumeVersion === "improved" ? "95%" : "85%"}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[#E9E7F2] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#8B7CF6] rounded-full transition-all duration-500"
                          style={{
                            width: hasOptimized && activeResumeVersion === "improved" ? "95%" : "85%",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. AI Suggestions (Compact Rows with Natural Wrap) */}
                  <div className="space-y-2 pt-3 border-t border-[#E8E5F2] text-[12px]">
                    <h4 className="font-bold text-[#17152A]">✦ AI Suggestions</h4>
                    <div className="space-y-2 text-[#475467]">
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#22C995]" />
                        <span>Improve professional summary</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#22C995]" />
                        <span>Add measurable achievements to recent projects</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#F59E0B]" />
                        <span>Add missing skills: Next.js, GraphQL</span>
                      </p>
                    </div>
                  </div>

                  {/* 5. Optimize Resume Action & Improved Resume Highlight */}
                  <div className="pt-2">
                    {!isOptimizing && !hasOptimized && (
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={handleStartOptimization}
                          className="w-full h-[46px] rounded-[12px] bg-[#6D5DF5] text-white text-[13px] font-semibold hover:bg-[#5146C7] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Optimize My Resume →</span>
                        </button>
                        <p className="text-[11px] text-[#667085] text-center">
                          Improve your ATS score and match more opportunities.
                        </p>
                      </div>
                    )}

                    {isOptimizing && (
                      <div className="p-4 rounded-[12px] bg-[#FAF9FF] border border-[#E8E5F2] space-y-2 text-center">
                        <div className="flex items-center justify-center gap-2 text-[#6D5DF5] font-bold text-[13px]">
                          <Sparkles className="w-4 h-4 animate-spin" />
                          <span>Analyzing your resume...</span>
                        </div>
                        <div className="space-y-1 text-[11.5px] text-[#087F5B] text-left bg-white p-3 rounded-[10px] border border-[#E8E5F2]">
                          <p>✓ Analyzing profile structure</p>
                          <p>✓ Comparing target roles & keywords</p>
                          <p>✓ Enhancing measurable achievements</p>
                          <p>✓ Optimizing ATS compatibility score</p>
                        </div>
                      </div>
                    )}

                    {hasOptimized && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="p-4 rounded-[18px] bg-[#F0FBF7] border border-[#B8EBD9] space-y-3.5 shadow-xs"
                      >
                        {/* 1. Section Header: Wrap-safe flex layout */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-[#087F5B]">
                            <CheckCircle2 className="w-4 h-4 text-[#22C995] shrink-0" />
                            <h4 className="text-[15px] font-bold text-[#17152A]">
                              Your Improved Resume
                            </h4>
                          </div>
                          <span className="text-[10.5px] font-bold text-[#087F5B] bg-white border border-[#22C995] px-2.5 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                            +8 points improvement
                          </span>
                        </div>

                        {/* 2. Resume File & Score Details Container */}
                        <div className="bg-white p-3.5 rounded-[14px] border border-[#B8EBD9] space-y-3.5">
                          {/* File row: Document Icon + Non-cropped wrapped filename */}
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-[8px] bg-[#ECFBF5] flex items-center justify-center text-[#22C995] shrink-0 mt-0.5">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-bold text-[#17152A] leading-snug whitespace-normal break-words">
                                Alex_Morgan_Resume_Optimized.pdf
                              </p>
                              <p className="text-[11px] text-[#667085] mt-0.5">
                                Optimized today · Ready to apply
                              </p>
                            </div>
                          </div>

                          {/* 3. Score Comparison: 3 Clear Columns with Ample Width */}
                          <div className="p-3 rounded-[10px] bg-[#FAF9FF] border border-[#E8E5F2] flex items-center justify-between gap-2">
                            {/* Column 1: Previous Score */}
                            <div className="flex-1 min-w-0">
                              <span className="text-[11px] text-[#667085] block font-medium">Previous Score</span>
                              <span className="text-[13px] font-semibold text-[#667085] line-through">86 / 100</span>
                            </div>

                            {/* Column 2: Arrow */}
                            <div className="px-1 text-[#98A2B3] text-[15px] font-bold shrink-0">
                              →
                            </div>

                            {/* Column 3: New Score & +8 points */}
                            <div className="flex-1 min-w-0 text-right">
                              <span className="text-[11px] text-[#087F5B] block font-bold">New Score</span>
                              <div className="flex items-baseline justify-end gap-1">
                                <span className="text-[20px] font-extrabold text-[#22C995] leading-none">94</span>
                                <span className="text-[11px] font-bold text-[#087F5B]">/ 100</span>
                              </div>
                            </div>
                          </div>

                          {/* 5. Action Buttons: 2 in row 1, 1 full-width primary in row 2 */}
                          <div className="space-y-2 pt-1">
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => triggerToast("Opening preview for Alex_Morgan_Resume_Optimized.pdf")}
                                className="h-[42px] rounded-[10px] bg-[#FAF9FF] border border-[#E8E5F2] text-[#6D5DF5] text-[12px] font-bold hover:bg-[#F1EFFF] transition-all flex items-center justify-center"
                              >
                                <span>Preview</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => triggerToast("Downloading optimized PDF...")}
                                className="h-[42px] rounded-[10px] bg-white border border-[#22C995] text-[#087F5B] text-[12px] font-bold hover:bg-[#F0FDF4] transition-all flex items-center justify-center"
                              >
                                <span>Download PDF</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveResumeVersion("improved");
                                setCurrentResumeName("Alex_Morgan_Resume_Optimized.pdf");
                                triggerToast("✓ This is now your active resume");
                              }}
                              className="w-full h-[44px] rounded-[10px] bg-[#22C995] text-white text-[12.5px] font-bold hover:bg-[#1eb685] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Check className="w-4 h-4" />
                              <span>✓ Use as My Resume</span>
                            </button>
                          </div>
                        </div>

                        {/* 6. Resume Versions Section (Multi-line Responsive Rows) */}
                        <div className="pt-2 border-t border-[#B8EBD9] space-y-2.5 text-[11.5px]">
                          <p className="font-bold text-[#17152A] text-[13px]">Resume Versions</p>

                          {/* Improved Version Row */}
                          <div className="p-3 rounded-[12px] bg-white border border-[#E8E5F2] space-y-2">
                            <div className="flex items-start gap-2.5">
                              <div className="w-8 h-8 rounded-[8px] bg-[#ECFBF5] text-[#22C995] flex items-center justify-center shrink-0 mt-0.5">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-[10.5px] text-[#087F5B] bg-[#ECFBF5] px-1.5 py-0.2 rounded">Improved Resume</span>
                                  <span className="text-[11.5px] font-extrabold text-[#087F5B]">94 / 100</span>
                                </div>
                                <p className="font-semibold text-[#17152A] text-[12px] leading-snug whitespace-normal break-words mt-0.5">
                                  Alex_Morgan_Resume_Optimized.pdf
                                </p>
                              </div>
                            </div>

                            {/* Actions on dedicated bottom line */}
                            <div className="flex items-center justify-between pt-1.5 border-t border-[#F3F4F6] text-[11.5px]">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => triggerToast("Viewing improved resume")}
                                  className="font-semibold text-[#6D5DF5] hover:underline"
                                >
                                  View
                                </button>
                                <span className="text-[#D1D5DB]">•</span>
                                <button
                                  type="button"
                                  onClick={() => triggerToast("Downloading improved resume")}
                                  className="font-semibold text-[#6D5DF5] hover:underline"
                                >
                                  Download
                                </button>
                              </div>
                              {activeResumeVersion === "improved" ? (
                                <span className="text-[10.5px] font-bold bg-[#ECFBF5] text-[#087F5B] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                                  Current
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveResumeVersion("improved");
                                    triggerToast("✓ This is now your active resume");
                                  }}
                                  className="text-[11.5px] font-bold text-[#087F5B] hover:underline"
                                >
                                  Use as Resume
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Original Version Row */}
                          <div className="p-3 rounded-[12px] bg-white border border-[#E8E5F2] space-y-2">
                            <div className="flex items-start gap-2.5">
                              <div className="w-8 h-8 rounded-[8px] bg-[#FAF9FF] text-[#6D5DF5] flex items-center justify-center shrink-0 mt-0.5">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-[10.5px] text-[#667085] bg-[#F3F4F6] px-1.5 py-0.2 rounded">Original Resume</span>
                                  <span className="text-[11.5px] font-semibold text-[#667085]">86 / 100</span>
                                </div>
                                <p className="font-semibold text-[#475569] text-[12px] leading-snug whitespace-normal break-words mt-0.5">
                                  Alex_Morgan_Resume.pdf
                                </p>
                              </div>
                            </div>

                            {/* Actions on dedicated bottom line */}
                            <div className="flex items-center justify-between pt-1.5 border-t border-[#F3F4F6] text-[11.5px]">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => triggerToast("Viewing original resume")}
                                  className="font-semibold text-[#6D5DF5] hover:underline"
                                >
                                  View
                                </button>
                                <span className="text-[#D1D5DB]">•</span>
                                <button
                                  type="button"
                                  onClick={() => triggerToast("Downloading original resume")}
                                  className="font-semibold text-[#6D5DF5] hover:underline"
                                >
                                  Download
                                </button>
                              </div>
                              {activeResumeVersion === "original" ? (
                                <span className="text-[10.5px] font-bold bg-[#F1EFFF] text-[#6D5DF5] px-2.5 py-0.5 rounded-full border border-[#E8E5F2]">
                                  Current
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveResumeVersion("original");
                                    triggerToast("Switched to Original resume");
                                  }}
                                  className="text-[11.5px] font-semibold text-[#6D5DF5] hover:underline"
                                >
                                  Use as Resume
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* 7. AI Job Matching */}
                  <div className="p-3.5 rounded-[12px] bg-[#FAF9FF] border border-[#E8E5F2] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[13px] font-bold text-[#17152A]">✦ Jobs matching your improved resume</h4>
                        <p className="text-[11px] text-[#667085]">
                          Your optimized resume matches these top opportunities:
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[12px]">
                      <div className="flex items-center justify-between p-2 rounded-[8px] bg-white border border-[#E8E5F2]">
                        <span className="font-semibold text-[#17152A]">Frontend Developer</span>
                        <span className="text-[11px] font-bold text-[#087F5B] bg-[#ECFBF5] px-2 py-0.5 rounded-full">
                          94% Match
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-[8px] bg-white border border-[#E8E5F2]">
                        <span className="font-semibold text-[#17152A]">Frontend Engineer</span>
                        <span className="text-[11px] font-bold text-[#087F5B] bg-[#ECFBF5] px-2 py-0.5 rounded-full">
                          91% Match
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-[8px] bg-white border border-[#E8E5F2]">
                        <span className="font-semibold text-[#17152A]">UI/UX Developer</span>
                        <span className="text-[11px] font-bold text-[#087F5B] bg-[#ECFBF5] px-2 py-0.5 rounded-full">
                          87% Match
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigateToTab("jobs")}
                      className="w-full h-[40px] rounded-[10px] bg-[#F1EFFF] text-[#6D5DF5] text-[12px] font-semibold hover:bg-[#E4DFFF] transition-all flex items-center justify-center gap-1"
                    >
                      <span>View Matching Jobs →</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* 5. SUBPAGE: SKILLS PAGE                                                 */}
        {/* ======================================================================= */}
        {currentPage === "skills" && (
          <motion.div
            key="subpage-skills"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            {renderSubpageHeader("My Skills")}

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills..."
                value={skillsSearch}
                onChange={(e) => setSkillsSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && skillsSearch.trim()) {
                    setSelectedSkills([...selectedSkills, skillsSearch.trim()]);
                    setSkillsSearch("");
                    triggerToast(`Added ${skillsSearch}`);
                  }
                }}
                className="w-full h-[46px] pl-9 pr-3 rounded-[10px] bg-white border border-[#E8E5F2] text-[13px] text-[#17152A] focus:outline-none focus:border-[#6D5DF5]"
              />
            </div>

            {/* Selected Skills */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                Your Skills ({selectedSkills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-semibold bg-[#F1EFFF] text-[#5146C7] border border-[#E8E5F2]"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
                      }}
                      className="hover:text-[#EF4444] transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-[#E8E5F2]" />

            {/* Suggested Skills */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                Suggested Skills for Frontend
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedSkills.map((rec, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedSkills([...selectedSkills, rec]);
                      setSuggestedSkills(suggestedSkills.filter((r) => r !== rec));
                      triggerToast(`Added ${rec}`);
                    }}
                    className="px-3 py-1.5 rounded-full text-[11.5px] font-semibold bg-white border border-[#E8E5F2] text-[#667085] hover:text-[#6D5DF5] hover:border-[#6D5DF5] flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{rec}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* 6. SUBPAGE: EXPERIENCE PAGE                                             */}
        {/* ======================================================================= */}
        {currentPage === "experience" && (
          <motion.div
            key="subpage-experience"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            {renderSubpageHeader("My Experience")}

            <div className="space-y-3 text-[12.5px]">
              {/* Role 1 */}
              <div className="p-3.5 rounded-[12px] bg-[#FAF9FF] border border-[#E8E5F2] space-y-1.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#17152A]">Frontend Developer</h4>
                    <p className="text-[12px] text-[#667085]">Example Technologies · Full Time</p>
                    <p className="text-[11px] text-[#667085]">2023 – Present · 2 yrs</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditProfileTab("experience");
                      setCurrentPage("edit_profile_full");
                    }}
                    className="text-[11.5px] font-semibold text-[#6D5DF5] hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-[12px] text-[#475569] leading-relaxed pt-1">
                  Crafting high-performance web applications with React, TypeScript, and modern CSS architecture.
                </p>
              </div>

              {/* Role 2 */}
              <div className="p-3.5 rounded-[12px] bg-[#FAF9FF] border border-[#E8E5F2] space-y-1.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#17152A]">Junior Web Developer</h4>
                    <p className="text-[12px] text-[#667085]">PixelCraft Labs · Full Time</p>
                    <p className="text-[11px] text-[#667085]">2022 – 2023 · 1 yr</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditProfileTab("experience");
                      setCurrentPage("edit_profile_full");
                    }}
                    className="text-[11.5px] font-semibold text-[#6D5DF5] hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditProfileTab("experience");
                setCurrentPage("edit_profile_full");
              }}
              className="w-full h-[44px] rounded-[12px] bg-white border border-[#6D5DF5] text-[#6D5DF5] text-[12.5px] font-bold hover:bg-[#F1EFFF] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Experience</span>
            </button>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* 7. SUBPAGE: EDUCATION PAGE                                              */}
        {/* ======================================================================= */}
        {currentPage === "education" && (
          <motion.div
            key="subpage-education"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            {renderSubpageHeader("Education")}

            <div className="p-3.5 rounded-[12px] bg-[#FAF9FF] border border-[#E8E5F2] space-y-1.5 text-[12.5px]">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-[13.5px] font-bold text-[#17152A]">
                    Bachelor of Engineering
                  </h4>
                  <p className="text-[12px] text-[#667085]">Computer Science</p>
                  <p className="text-[11.5px] text-[#667085]">XYZ College of Engineering · Anna University</p>
                  <p className="text-[11px] text-[#667085]">2021 – 2025</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditProfileTab("education");
                    setCurrentPage("edit_profile_full");
                  }}
                  className="text-[11.5px] font-semibold text-[#6D5DF5] hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditProfileTab("education");
                setCurrentPage("edit_profile_full");
              }}
              className="w-full h-[44px] rounded-[12px] bg-white border border-[#6D5DF5] text-[#6D5DF5] text-[12.5px] font-bold hover:bg-[#F1EFFF] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Education</span>
            </button>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* 8. SUBPAGE: CAREER INTERESTS                                            */}
        {/* ======================================================================= */}
        {currentPage === "career_interests" && (
          <motion.div
            key="subpage-interests"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            {renderSubpageHeader("Career Interests")}

            <div className="space-y-1">
              <h4 className="text-[14px] font-bold text-[#17152A]">
                What careers are you interested in?
              </h4>
              <p className="text-[12px] text-[#667085]">
                Pathly uses these interests for job, exam, and learning recommendations.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-[#F1EFFF] text-[#5146C7] border border-[#E8E5F2]"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setInterests(interests.filter((i) => i !== interest));
                    }}
                    className="hover:text-[#EF4444] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newInt = prompt("Enter career interest:");
                  if (newInt && newInt.trim()) {
                    setInterests([...interests, newInt.trim()]);
                    triggerToast(`Added ${newInt}`);
                  }
                }}
                className="px-3 py-1.5 rounded-full text-[12px] font-semibold bg-white text-[#6D5DF5] border border-dashed border-[#6D5DF5] hover:bg-[#F1EFFF] flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Interest</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* 9. SUBPAGE: SAVED JOBS                                                  */}
        {/* ======================================================================= */}
        {currentPage === "saved_jobs" && (
          <motion.div
            key="subpage-saved-jobs"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            {renderSubpageHeader("Saved Jobs")}

            {savedJobsList.length === 0 ? (
              <p className="text-[12.5px] text-[#667085] text-center py-8">
                No saved jobs yet. Tap the bookmark icon on any job to save it here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {savedJobsList.map((job) => (
                  <div
                    key={job.id}
                    className="p-3.5 rounded-[12px] bg-[#FAF9FF] border border-[#E8E5F2] flex items-center justify-between gap-2"
                  >
                    <div
                      className="min-w-0 flex-1 cursor-pointer"
                      onClick={() => {
                        if (onSelectJob) onSelectJob(job.id);
                        else onNavigateToTab("jobs");
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13.5px] font-bold text-[#17152A] hover:text-[#6D5DF5] transition-colors truncate">
                          {job.title}
                        </h4>
                        <span className="text-[10px] font-bold text-[#087F5B] bg-[#ECFBF5] px-1.5 py-0.5 rounded-full">
                          {job.match}% Match
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[#667085]">{job.company}</p>
                      <p className="text-[11px] text-[#667085]">
                        {job.location} · {job.salary}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSavedJobsList(savedJobsList.filter((j) => j.id !== job.id));
                        triggerToast("Removed from saved");
                      }}
                      className="p-1.5 text-[#98A2B3] hover:text-[#EF4444] transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* 10. SUBPAGE: SETTINGS                                                   */}
        {/* ======================================================================= */}
        {currentPage === "settings" && (
          <motion.div
            key="subpage-settings"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            {renderSubpageHeader("Settings")}

            <div className="divide-y divide-[#E8E5F2] text-[12.5px]">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-[#17152A]">Profile Visibility</p>
                  <p className="text-[11px] text-[#667085]">Allow companies to find your profile</p>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileVisible(!profileVisible)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${
                    profileVisible ? "bg-[#6D5DF5] justify-end" : "bg-[#D1D5DB] justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-[#17152A]">Resume Visibility</p>
                  <p className="text-[11px] text-[#667085]">Include resume in recruiter search</p>
                </div>
                <button
                  type="button"
                  onClick={() => setResumeVisible(!resumeVisible)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${
                    resumeVisible ? "bg-[#6D5DF5] justify-end" : "bg-[#D1D5DB] justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-[#17152A]">Recruiter Contact</p>
                  <p className="text-[11px] text-[#667085]">Allow direct messages from verified recruiters</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRecruiterContact(!recruiterContact)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${
                    recruiterContact ? "bg-[#6D5DF5] justify-end" : "bg-[#D1D5DB] justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {/* Toggle 4 */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-[#17152A]">Job & Exam Alerts</p>
                  <p className="text-[11px] text-[#667085]">Notify me when 90%+ match roles appear</p>
                </div>
                <button
                  type="button"
                  onClick={() => setJobAlerts(!jobAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${
                    jobAlerts ? "bg-[#6D5DF5] justify-end" : "bg-[#D1D5DB] justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {onRestartOnboarding && (
                <button
                  type="button"
                  onClick={onRestartOnboarding}
                  className="w-full py-3 flex items-center justify-between text-[#6D5DF5] hover:underline"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Restart Onboarding Assessment</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* 11. SUBPAGE: HELP & SUPPORT                                             */}
        {/* ======================================================================= */}
        {currentPage === "help" && (
          <motion.div
            key="subpage-help"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            {renderSubpageHeader("Help & Support")}

            <div className="space-y-2.5 text-[12.5px]">
              <div className="p-3.5 rounded-[12px] bg-[#FAF9FF] border border-[#E8E5F2] space-y-1">
                <p className="font-bold text-[#17152A]">How does AI Match Score work?</p>
                <p className="text-[11.5px] text-[#667085] leading-relaxed">
                  Pathly analyzes your verified skills, experience, and target roles against employer job specifications to calculate your real match percentage.
                </p>
              </div>

              <div className="p-3.5 rounded-[12px] bg-[#FAF9FF] border border-[#E8E5F2] space-y-1">
                <p className="font-bold text-[#17152A]">Contact Pathly Support</p>
                <p className="text-[11.5px] text-[#667085]">
                  Email: support@pathly.ai · Response within 2 hours
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* 12. DEDICATED FULL EDIT PROFILE PAGE (WITH TABS)                        */}
        {/* ======================================================================= */}
        {currentPage === "edit_profile_full" && (
          <motion.div
            key="page-edit-profile-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            {renderSubpageHeader(
              "Edit Profile",
              () => setCurrentPage("my_profile"),
              <button
                type="button"
                onClick={handleSaveAllProfileChanges}
                className="text-[13px] font-bold text-[#6D5DF5] hover:underline"
              >
                Save
              </button>
            )}

            {/* Horizontal Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-[#E8E5F2]">
              {(
                [
                  { id: "personal", label: "Personal" },
                  { id: "career", label: "Career" },
                  { id: "preferences", label: "Preferences" },
                  { id: "experience", label: "Experience" },
                  { id: "education", label: "Education" },
                  { id: "skills", label: "Skills" },
                ] as Array<{ id: EditProfileTab; label: string }>
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setEditProfileTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                    editProfileTab === tab.id
                      ? "bg-[#6D5DF5] text-white shadow-xs"
                      : "bg-[#FAF9FF] text-[#667085] hover:text-[#17152A]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: Personal */}
            {editProfileTab === "personal" && (
              <div className="space-y-3.5 text-[12.5px]">
                <div className="flex items-center gap-3 py-1">
                  <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-full aspect-square bg-[#6D5DF5] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                    AM
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerToast("Change photo dialog")}
                    className="px-3 py-1.5 rounded-[8px] bg-[#FAF9FF] border border-[#E8E5F2] text-[11.5px] font-semibold text-[#6D5DF5]"
                  >
                    Change Photo
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Full Name</label>
                  <input
                    type="text"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Email Address</label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Mobile Number</label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Location</label>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#667085]">Gender</label>
                    <select
                      value={personalInfo.gender}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                      className="w-full h-[46px] px-3 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#667085]">Date of Birth</label>
                    <input
                      type="text"
                      value={personalInfo.dob}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                      placeholder="DD/MM/YYYY"
                      className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Career */}
            {editProfileTab === "career" && (
              <div className="space-y-3.5 text-[12.5px]">
                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Career Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Fresher", "Experienced"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          setCareerPrefs({
                            ...careerPrefs,
                            careerStatus: status === "Fresher" ? "Fresher" : "Experienced · 3 Years",
                          })
                        }
                        className={`h-[44px] rounded-[10px] font-semibold text-[12.5px] border ${
                          careerPrefs.careerStatus.startsWith(status)
                            ? "bg-[#F1EFFF] text-[#6D5DF5] border-[#6D5DF5]"
                            : "bg-white text-[#667085] border-[#E8E5F2]"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Current Role</label>
                  <input
                    type="text"
                    defaultValue="Frontend Developer"
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Total Experience</label>
                  <input
                    type="text"
                    defaultValue="3 Years"
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Career Goal</label>
                  <textarea
                    rows={2}
                    defaultValue="Build high-performance web products and explore state public administration tracks."
                    className="w-full p-3 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[12.5px] focus:outline-none focus:border-[#6D5DF5]"
                  />
                </div>
              </div>
            )}

            {/* TAB: Preferences */}
            {editProfileTab === "preferences" && (
              <div className="space-y-3.5 text-[12.5px]">
                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Preferred Location</label>
                  <input
                    type="text"
                    value={careerPrefs.location}
                    onChange={(e) => setCareerPrefs({ ...careerPrefs, location: e.target.value })}
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Expected Salary</label>
                  <input
                    type="text"
                    value={careerPrefs.salaryDisplay}
                    onChange={(e) => setCareerPrefs({ ...careerPrefs, salaryDisplay: e.target.value })}
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Work Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Remote", "Hybrid", "On-site"].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() =>
                          setCareerPrefs({
                            ...careerPrefs,
                            rawWorkMode: mode,
                            workMode: `${mode} · ${careerPrefs.openToRemote ? "Open to Remote" : ""}`,
                          })
                        }
                        className={`h-[42px] rounded-[10px] font-semibold text-[12px] border ${
                          careerPrefs.rawWorkMode === mode
                            ? "bg-[#F1EFFF] text-[#6D5DF5] border-[#6D5DF5]"
                            : "bg-white text-[#667085] border-[#E8E5F2]"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-[10px] bg-[#FAF9FF] border border-[#E8E5F2]">
                  <span className="font-semibold text-[#17152A]">Open to Relocation</span>
                  <input
                    type="checkbox"
                    checked={careerPrefs.openToRelocation}
                    onChange={(e) => setCareerPrefs({ ...careerPrefs, openToRelocation: e.target.checked })}
                    className="accent-[#6D5DF5] w-4 h-4"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Notice Period</label>
                  <input
                    type="text"
                    value={careerPrefs.noticePeriod}
                    onChange={(e) => setCareerPrefs({ ...careerPrefs, noticePeriod: e.target.value })}
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[#17152A] text-[13px] focus:outline-none focus:border-[#6D5DF5]"
                  />
                </div>
              </div>
            )}

            {/* TAB: Experience */}
            {editProfileTab === "experience" && (
              <div className="space-y-3.5 text-[12.5px]">
                <div className="p-3.5 rounded-[12px] bg-[#FAF9FF] border border-[#E8E5F2] space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#667085]">Job Title</label>
                    <input
                      type="text"
                      defaultValue="Frontend Developer"
                      className="w-full h-[44px] px-3 rounded-[8px] bg-white border border-[#E8E5F2] text-[12.5px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#667085]">Company Name</label>
                    <input
                      type="text"
                      defaultValue="Example Technologies"
                      className="w-full h-[44px] px-3 rounded-[8px] bg-white border border-[#E8E5F2] text-[12.5px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11.5px] font-semibold text-[#667085]">Start Date</label>
                      <input
                        type="text"
                        defaultValue="2023"
                        className="w-full h-[44px] px-3 rounded-[8px] bg-white border border-[#E8E5F2] text-[12.5px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11.5px] font-semibold text-[#667085]">End Date</label>
                      <input
                        type="text"
                        defaultValue="Present"
                        className="w-full h-[44px] px-3 rounded-[8px] bg-white border border-[#E8E5F2] text-[12.5px]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-semibold text-[#17152A]">Current Position</span>
                    <input type="checkbox" defaultChecked className="accent-[#6D5DF5] w-4 h-4" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => triggerToast("Added new experience slot")}
                  className="w-full h-[44px] rounded-[10px] bg-white border border-dashed border-[#6D5DF5] text-[#6D5DF5] font-semibold text-[12px] flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Experience</span>
                </button>
              </div>
            )}

            {/* TAB: Education */}
            {editProfileTab === "education" && (
              <div className="space-y-3.5 text-[12.5px]">
                <div className="p-3.5 rounded-[12px] bg-[#FAF9FF] border border-[#E8E5F2] space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#667085]">Degree</label>
                    <input
                      type="text"
                      defaultValue="Bachelor of Engineering"
                      className="w-full h-[44px] px-3 rounded-[8px] bg-white border border-[#E8E5F2] text-[12.5px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#667085]">Specialization</label>
                    <input
                      type="text"
                      defaultValue="Computer Science"
                      className="w-full h-[44px] px-3 rounded-[8px] bg-white border border-[#E8E5F2] text-[12.5px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#667085]">College / University</label>
                    <input
                      type="text"
                      defaultValue="XYZ College of Engineering"
                      className="w-full h-[44px] px-3 rounded-[8px] bg-white border border-[#E8E5F2] text-[12.5px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11.5px] font-semibold text-[#667085]">Start Year</label>
                      <input
                        type="text"
                        defaultValue="2021"
                        className="w-full h-[44px] px-3 rounded-[8px] bg-white border border-[#E8E5F2] text-[12.5px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11.5px] font-semibold text-[#667085]">End Year</label>
                      <input
                        type="text"
                        defaultValue="2025"
                        className="w-full h-[44px] px-3 rounded-[8px] bg-white border border-[#E8E5F2] text-[12.5px]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => triggerToast("Added education slot")}
                  className="w-full h-[44px] rounded-[10px] bg-white border border-dashed border-[#6D5DF5] text-[#6D5DF5] font-semibold text-[12px] flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Degree</span>
                </button>
              </div>
            )}

            {/* TAB: Skills */}
            {editProfileTab === "skills" && (
              <div className="space-y-3.5 text-[12.5px]">
                <div className="space-y-1">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Search & Add</label>
                  <input
                    type="text"
                    placeholder="Search skills..."
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#E8E5F2] text-[13px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-semibold text-[#667085]">Your Skills</label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-[11.5px] font-semibold bg-[#F1EFFF] text-[#5146C7] flex items-center gap-1"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSaveAllProfileChanges}
                className="w-full h-[48px] rounded-[12px] bg-[#6D5DF5] text-white text-[13.5px] font-bold hover:bg-[#5146C7] transition-all shadow-md shadow-[#6D5DF5]/20"
              >
                Save All Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
