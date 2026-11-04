"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Shield,
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  GraduationCap,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  Menu,
  X,
  Edit2,
  Trash2,
  Award,
  Video,
  RefreshCw,
  TrendingUp,
  Activity,
  Server,
  Layers,
  ArrowUpRight,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import {
  adminApi,
  AdminUser,
  AdminCourse,
  AdminMentor,
  RegisteredUserSummary,
  RegisteredUserDetail,
  DashboardStats,
  EnrollmentRecord,
  MentorshipSessionRecord,
  ReportsData,
} from "@/lib/api/admin";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { cn } from "@/lib/utils";

type AdminTab =
  | "dashboard"
  | "courses"
  | "mentors"
  | "users"
  | "enrollments"
  | "mentorship-sessions"
  | "reports"
  | "settings";

/* ------------------------------------------------------------------ */
/*  Tokens & motion                                                    */
/*  ink #0F172A · muted #64748B · accent teal #A78BFA → cyan #8B5CF6   */
/* ------------------------------------------------------------------ */

const inputCls =
  "w-full h-10 px-3 rounded-xl bg-white/70 ring-1 ring-slate-900/10 text-[13px] text-[#0F172A] placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#A78BFA]/50";

const primaryBtn =
  "inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white text-[12.5px] font-semibold shadow-lg shadow-[#A78BFA]/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#A78BFA]/30 active:translate-y-0 active:scale-[0.98]";

const ghostBtn =
  "inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl bg-white/60 ring-1 ring-slate-900/10 text-[#0F172A] text-[12.5px] font-medium backdrop-blur transition hover:bg-white hover:-translate-y-0.5 active:scale-[0.98]";

const thCls = "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500";

const AVATAR_TONES = [
  "from-[#A78BFA] to-[#8B5CF6]",
  "from-[#6366F1] to-[#8B5CF6]",
  "from-[#F59E0B] to-[#F97316]",
  "from-[#EC4899] to-[#F43F5E]",
  "from-[#0EA5E9] to-[#6366F1]",
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const CHART = {
  "7d": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    a: [3, 5, 4, 7, 6, 9, 8],
    b: [2, 3, 3, 5, 4, 6, 7],
  },
  "30d": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    a: [12, 18, 15, 26],
    b: [8, 11, 13, 19],
  },
  "90d": {
    labels: ["Month 1", "Month 2", "Month 3"],
    a: [34, 52, 71],
    b: [21, 38, 49],
  },
} as const;

function smoothPath(pts: [number, number][]) {
  if (!pts.length) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

/* ------------------------------------------------------------------ */
/*  Small reusable pieces                                              */
/* ------------------------------------------------------------------ */

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1000;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <>
      {n}
      {suffix}
    </>
  );
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const tone = AVATAR_TONES[(name?.charCodeAt(0) || 0) % AVATAR_TONES.length];
  const dims =
    size === "sm" ? "h-7 w-7 text-[11px]" : size === "lg" ? "h-12 w-12 text-[16px]" : "h-9 w-9 text-[13px]";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-sm ring-2 ring-white/80",
        tone,
        dims
      )}
    >
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

function StatusPill({
  on,
  onLabel,
  offLabel,
  onClick,
}: {
  on: boolean;
  onLabel: string;
  offLabel: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition active:scale-95",
        on
          ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
          : "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20"
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {on && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", on ? "bg-emerald-500" : "bg-slate-400")} />
      </span>
      {on ? onLabel : offLabel}
    </button>
  );
}

function PageHeader({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-[26px] font-bold tracking-tight text-[#0F172A]">{title}</h2>
        {desc && <p className="mt-1 text-[13px] text-slate-500">{desc}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

function SectionTitle({
  title,
  desc,
  right,
}: {
  title: string;
  desc?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="text-[15px] font-bold tracking-tight text-[#0F172A]">{title}</div>
        {desc && <div className="text-[12px] text-slate-500">{desc}</div>}
      </div>
      {right}
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-xl bg-white/50 p-0.5 ring-1 ring-slate-900/10 backdrop-blur">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className="relative rounded-[10px] px-3 py-1 text-[12px] font-semibold transition"
        >
          {value === o.value && (
            <motion.span
              layoutId={`seg-${options.map((x) => x.value).join("-")}`}
              className="absolute inset-0 rounded-[10px] bg-white shadow-sm"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
          )}
          <span className={cn("relative", value === o.value ? "text-[#0F172A]" : "text-slate-500 hover:text-[#0F172A]")}>
            {o.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(inputCls, "pl-9")}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[12px] font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function Sparkline({ seed, color }: { seed: number; color: string }) {
  const pts: [number, number][] = Array.from({ length: 8 }, (_, i) => [
    i * 11,
    22 - ((Math.sin(seed * 1.7 + i * 0.9) + 1) * 6 + i * 0.9),
  ]);
  return (
    <svg viewBox="0 0 77 28" className="h-7 w-[77px]">
      <motion.path
        d={smoothPath(pts)}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.3 + seed * 0.05, ease: "easeOut" }}
      />
    </svg>
  );
}

function Ring({ value }: { value: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative h-[112px] w-[112px] shrink-0">
      <svg viewBox="0 0 112 112" className="-rotate-90">
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(15,23,42,0.07)" strokeWidth="10" />
        <motion.circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct / 100) }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-extrabold tracking-tight text-[#0F172A]">
          <CountUp value={pct} suffix="%" />
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Completion</span>
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900/[0.07]">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6]"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}

function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="relative flex h-full w-full max-w-[480px] flex-col bg-gradient-to-b from-white to-[#F7F3FF] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-900/[0.07] px-6 py-4">
              <div className="min-w-0">
                <div className="truncate text-[15px] font-bold text-[#0F172A]">{title}</div>
                {subtitle && <div className="truncate text-[12px] text-slate-500">{subtitle}</div>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-900/5 hover:text-[#0F172A]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const rowAnim = (i: number) => ({
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  transition: { delay: Math.min(i, 14) * 0.035, duration: 0.35 },
});

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "reports" || tab === "analytics") {
        setActiveTab("reports");
      } else if (tab && ["dashboard", "courses", "mentors", "users", "enrollments", "mentorship-sessions", "settings"].includes(tab)) {
        setActiveTab(tab as AdminTab);
      }
    }
  }, []);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Time filter for analytics chart
  const [timeFilter, setTimeFilter] = useState<"7d" | "30d" | "90d">("30d");

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [mentors, setMentors] = useState<AdminMentor[]>([]);
  const [users, setUsers] = useState<RegisteredUserSummary[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [sessions, setSessions] = useState<MentorshipSessionRecord[]>([]);
  const [reports, setReports] = useState<ReportsData | null>(null);

  // Search & Filters
  const [globalSearch, setGlobalSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [courseCategoryFilter, setCourseCategoryFilter] = useState("all");
  const [courseStatusFilter, setCourseStatusFilter] = useState("all");

  const [mentorSearch, setMentorSearch] = useState("");
  const [mentorStatusFilter, setMentorStatusFilter] = useState("all");

  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState("all");

  const searchRef = useRef<HTMLInputElement>(null);

  // Slide-over Drawers & Modals
  const [selectedUserDetail, setSelectedUserDetail] = useState<RegisteredUserDetail | null>(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);

  const [courseDrawerOpen, setCourseDrawerOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    category: "webdev",
    description: "",
    skills: "HTML, CSS, JavaScript, React",
    duration: "12 Hours",
    level: "Beginner",
    price: "Free",
    provider: "Pathly Academy",
    instructor: "Lead Technical Specialist",
    whatYouLearn: "Core fundamentals, Responsive layouts, Real projects",
    status: "published" as "published" | "draft",
  });

  const [mentorDrawerOpen, setMentorDrawerOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<AdminMentor | null>(null);
  const [mentorForm, setMentorForm] = useState({
    name: "",
    role: "Staff Software Engineer",
    company: "Google",
    email: "",
    mobile: "",
    skills: "React, Next.js, System Design",
    specialty: "Mock Interview, Code Review",
    bio: "Senior engineer offering 1:1 guidance for aspiring tech specialists.",
    experience: "7+ Years",
    session_price: "Free",
    session_duration: "45 mins",
    meeting_link: "https://meet.google.com/pat-hly-pro",
    status: "active" as "active" | "inactive",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cmd/Ctrl + K focuses quick search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Auth & Data fetching
  useEffect(() => {
    async function init() {
      if (!adminApi.isLoggedIn()) {
        router.replace("/admin");
        return;
      }
      try {
        const me = await adminApi.getMe();
        setCurrentAdmin(me);
        await loadAllData();
      } catch (err) {
        console.error("Admin authentication check failed:", err);
        adminApi.logout();
        router.replace("/admin");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const loadAllData = async () => {
    setRefreshing(true);
    try {
      const [statsData, coursesData, mentorsData, usersData, enrollData, sessionsData, reportsData] =
        await Promise.all([
          adminApi.getDashboardStats().catch(() => null),
          adminApi.getCourses().catch(() => []),
          adminApi.getMentors().catch(() => []),
          adminApi.getRegisteredUsers().catch(() => ({ users: [] })),
          adminApi.getEnrollments().catch(() => []),
          adminApi.getMentorshipSessions().catch(() => []),
          adminApi.getReports().catch(() => null),
        ]);

      if (statsData) setStats(statsData);
      setCourses(coursesData);
      setMentors(mentorsData);
      setUsers(usersData.users || []);
      setEnrollments(enrollData);
      setSessions(sessionsData);
      if (reportsData) setReports(reportsData);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await adminApi.logout();
    router.replace("/admin");
  };

  // Course Handlers
  const openNewCourseDrawer = () => {
    setEditingCourse(null);
    setCourseForm({
      title: "",
      category: "webdev",
      description: "",
      skills: "HTML, CSS, JavaScript, React",
      duration: "12 Hours",
      level: "Beginner",
      price: "Free",
      provider: "Pathly Academy",
      instructor: "Lead Technical Specialist",
      whatYouLearn: "Core fundamentals, Responsive layouts, Real projects",
      status: "published",
    });
    setCourseDrawerOpen(true);
  };

  const openEditCourseDrawer = (c: AdminCourse) => {
    setEditingCourse(c);
    setCourseForm({
      title: c.title,
      category: c.category,
      description: c.description,
      skills: c.skills ? c.skills.join(", ") : "",
      duration: c.duration,
      level: c.level,
      price: c.price,
      provider: c.provider,
      instructor: c.instructor,
      whatYouLearn: c.whatYouLearn ? c.whatYouLearn.join(", ") : "",
      status: c.status === "archived" ? "draft" : c.status,
    });
    setCourseDrawerOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = courseForm.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const outcomesArray = courseForm.whatYouLearn
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingCourse) {
        await adminApi.updateCourse(editingCourse.id, {
          title: courseForm.title,
          category: courseForm.category,
          description: courseForm.description,
          skills: skillsArray,
          duration: courseForm.duration,
          level: courseForm.level,
          price: courseForm.price,
          provider: courseForm.provider,
          instructor: courseForm.instructor,
          whatYouLearn: outcomesArray,
          status: courseForm.status,
        });
        showToast(`Course "${courseForm.title}" updated.`);
      } else {
        await adminApi.createCourse({
          title: courseForm.title,
          category: courseForm.category,
          description: courseForm.description,
          skills: skillsArray,
          duration: courseForm.duration,
          level: courseForm.level,
          price: courseForm.price,
          provider: courseForm.provider,
          instructor: courseForm.instructor,
          whatYouLearn: outcomesArray,
          status: courseForm.status,
        });
        showToast(`Course "${courseForm.title}" published.`);
      }
      setCourseDrawerOpen(false);
      await loadAllData();
    } catch (err: any) {
      alert(err.message || "Failed to save course.");
    }
  };

  const handleToggleCourseStatus = async (course: AdminCourse) => {
    const nextStatus = course.status === "published" ? "draft" : "published";
    try {
      await adminApi.updateCourseStatus(course.id, nextStatus);
      showToast(`Status updated to ${nextStatus}.`);
      await loadAllData();
    } catch (err: any) {
      alert(err.message || "Failed to toggle status.");
    }
  };

  const handleDeleteCourse = async (course: AdminCourse) => {
    if (confirm(`Archive or delete course "${course.title}"?`)) {
      try {
        await adminApi.deleteCourse(course.id);
        showToast("Course removed.");
        await loadAllData();
      } catch (err: any) {
        alert(err.message || "Failed to delete course.");
      }
    }
  };

  // Mentor Handlers
  const openNewMentorDrawer = () => {
    setEditingMentor(null);
    setMentorForm({
      name: "",
      role: "Staff Software Engineer",
      company: "Google",
      email: "",
      mobile: "",
      skills: "React, Next.js, System Design",
      specialty: "Mock Tech Interview, Portfolio Review",
      bio: "Senior engineer offering 1:1 guidance for aspiring tech specialists.",
      experience: "7+ Years",
      session_price: "Free",
      session_duration: "45 mins",
      meeting_link: "https://meet.google.com/pat-hly-pro",
      status: "active",
    });
    setMentorDrawerOpen(true);
  };

  const openEditMentorDrawer = (m: AdminMentor) => {
    setEditingMentor(m);
    setMentorForm({
      name: m.name,
      role: m.role,
      company: m.company,
      email: m.email || "",
      mobile: m.mobile || "",
      skills: m.skills ? m.skills.join(", ") : "",
      specialty: m.specialty ? m.specialty.join(", ") : "",
      bio: m.bio || "",
      experience: m.experience || "5+ Years",
      session_price: m.session_price || "Free",
      session_duration: m.session_duration || "45 mins",
      meeting_link: m.meeting_link || "https://meet.google.com/pat-hly-pro",
      status: m.status,
    });
    setMentorDrawerOpen(true);
  };

  const handleSaveMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = mentorForm.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const specialtyArray = mentorForm.specialty
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingMentor) {
        await adminApi.updateMentor(editingMentor.id, {
          name: mentorForm.name,
          role: mentorForm.role,
          company: mentorForm.company,
          email: mentorForm.email,
          mobile: mentorForm.mobile,
          skills: skillsArray,
          specialty: specialtyArray,
          bio: mentorForm.bio,
          experience: mentorForm.experience,
          session_price: mentorForm.session_price,
          session_duration: mentorForm.session_duration,
          meeting_link: mentorForm.meeting_link,
          status: mentorForm.status,
        });
        showToast(`Mentor "${mentorForm.name}" updated.`);
      } else {
        await adminApi.createMentor({
          name: mentorForm.name,
          role: mentorForm.role,
          company: mentorForm.company,
          email: mentorForm.email,
          mobile: mentorForm.mobile,
          skills: skillsArray,
          specialty: specialtyArray,
          bio: mentorForm.bio,
          experience: mentorForm.experience,
          session_price: mentorForm.session_price,
          session_duration: mentorForm.session_duration,
          meeting_link: mentorForm.meeting_link,
          status: mentorForm.status,
        });
        showToast(`Mentor "${mentorForm.name}" added.`);
      }
      setMentorDrawerOpen(false);
      await loadAllData();
    } catch (err: any) {
      alert(err.message || "Failed to save mentor.");
    }
  };

  const handleToggleMentorStatus = async (mentor: AdminMentor) => {
    const nextStatus = mentor.status === "active" ? "inactive" : "active";
    try {
      await adminApi.updateMentor(mentor.id, { status: nextStatus });
      showToast(`Mentor marked as ${nextStatus}.`);
      await loadAllData();
    } catch (err: any) {
      alert(err.message || "Failed to toggle status.");
    }
  };

  const handleDeleteMentor = async (mentor: AdminMentor) => {
    if (confirm(`Remove mentor "${mentor.name}"?`)) {
      try {
        await adminApi.deleteMentor(mentor.id);
        showToast("Mentor removed.");
        await loadAllData();
      } catch (err: any) {
        alert(err.message || "Failed to delete mentor.");
      }
    }
  };

  // User Handlers
  const handleViewUserDetail = async (userId: string) => {
    setUserDetailLoading(true);
    try {
      const detail = await adminApi.getUserDetail(userId);
      setSelectedUserDetail(detail);
    } catch (err: any) {
      alert(err.message || "Could not fetch user details.");
    } finally {
      setUserDetailLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: RegisteredUserSummary) => {
    const nextStatus = !user.is_active;
    const action = nextStatus ? "activate" : "deactivate";
    if (confirm(`Confirm to ${action} account for "${user.name}"?`)) {
      try {
        await adminApi.updateUserStatus(user.id, nextStatus);
        showToast(`User account ${nextStatus ? "activated" : "deactivated"}.`);
        await loadAllData();
        if (selectedUserDetail && selectedUserDetail.id === user.id) {
          setSelectedUserDetail({ ...selectedUserDetail, is_active: nextStatus });
        }
      } catch (err: any) {
        alert(err.message || "Failed to update user status.");
      }
    }
  };

  // Filtered queries
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const query = (courseSearch || globalSearch).toLowerCase();
      const matchesSearch =
        query === "" ||
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        (c.skills && c.skills.some((s) => s.toLowerCase().includes(query)));
      const matchesCategory =
        courseCategoryFilter === "all" || c.category.toLowerCase() === courseCategoryFilter.toLowerCase();
      const matchesStatus = courseStatusFilter === "all" || c.status === courseStatusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [courses, courseSearch, globalSearch, courseCategoryFilter, courseStatusFilter]);

  const filteredMentors = useMemo(() => {
    return mentors.filter((m) => {
      const query = (mentorSearch || globalSearch).toLowerCase();
      const matchesSearch =
        query === "" ||
        m.name.toLowerCase().includes(query) ||
        m.role.toLowerCase().includes(query) ||
        m.company.toLowerCase().includes(query);
      const matchesStatus = mentorStatusFilter === "all" || m.status === mentorStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [mentors, mentorSearch, globalSearch, mentorStatusFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = (userSearch || globalSearch).toLowerCase();
      const matchesSearch =
        query === "" ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.mobile.includes(query) ||
        u.target_role.toLowerCase().includes(query);
      const matchesStatus =
        userStatusFilter === "all" ||
        (userStatusFilter === "active" && u.is_active) ||
        (userStatusFilter === "inactive" && !u.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [users, userSearch, globalSearch, userStatusFilter]);

  /* ---------------- Background (shared by loading + app) ---------------- */
  const Background = (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#F3EEFF] via-[#EEF4FF] to-[#F6EFFF]">
      <motion.div
        className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#C4B5FD]/45 blur-3xl"
        animate={{ x: [0, 90, 0], y: [0, 70, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-32 top-1/4 h-[480px] w-[480px] rounded-full bg-[#93C5FD]/45 blur-3xl"
        animate={{ x: [0, -80, 0], y: [0, 90, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 left-1/3 h-[520px] w-[520px] rounded-full bg-[#DDD6FE]/55 blur-3xl"
        animate={{ x: [0, 70, 0], y: [0, -60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center font-sans">
        {Background}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#8B5CF6] shadow-xl shadow-[#A78BFA]/30"
          >
            <span className="text-[20px] font-extrabold text-white">P</span>
            <span className="absolute -inset-1.5 animate-spin rounded-[20px] border-2 border-transparent border-t-[#A78BFA]" />
          </motion.div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
            Initializing workspace
          </p>
        </div>
      </div>
    );
  }

  const NAV: {
    group: string;
    items: { id: AdminTab; label: string; icon: React.ElementType; count?: number }[];
  }[] = [
    {
      group: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "reports", label: "Analytics", icon: BarChart3 },
      ],
    },
    {
      group: "Management",
      items: [
        { id: "courses", label: "Courses", icon: BookOpen, count: courses.length },
        { id: "mentors", label: "Mentors", icon: UserCheck, count: mentors.length },
        { id: "users", label: "Registered Users", icon: Users, count: users.length },
        { id: "enrollments", label: "Enrollments", icon: GraduationCap, count: enrollments.length },
        { id: "mentorship-sessions", label: "1:1 Sessions", icon: Calendar, count: sessions.length },
      ],
    },
    {
      group: "System",
      items: [{ id: "settings", label: "Settings", icon: Settings }],
    },
  ];

  const PAGE_TITLES: Record<AdminTab, string> = {
    dashboard: "Dashboard",
    courses: "Courses",
    mentors: "Mentors",
    users: "Registered Users",
    enrollments: "Enrollments",
    "mentorship-sessions": "1:1 Sessions",
    reports: "Analytics",
    settings: "Settings",
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = (currentAdmin?.full_name || "Admin").split(" ")[0];

  const kpis = [
    { label: "Total Users", value: stats?.total_users ?? 0, trend: "+12%", icon: Users, tone: "#7C3AED" },
    { label: "Active Users", value: stats?.active_users ?? 0, trend: "Live", icon: Activity, tone: "#6366F1" },
    { label: "Courses", value: stats?.total_courses ?? 0, trend: "Catalog", icon: BookOpen, tone: "#F59E0B" },
    { label: "Published", value: stats?.active_courses ?? 0, trend: "Online", icon: Layers, tone: "#0EA5E9" },
    { label: "Mentors", value: stats?.total_mentors ?? 0, trend: "Active", icon: UserCheck, tone: "#EC4899" },
    { label: "Enrollments", value: stats?.course_enrollments ?? 0, trend: "Real", icon: GraduationCap, tone: "#10B981" },
    { label: "Completed", value: stats?.completed_courses ?? 0, trend: "Grad", icon: Award, tone: "#8B5CF6" },
    { label: "Bookings", value: stats?.mentorship_bookings ?? 0, trend: "1:1", icon: Calendar, tone: "#F97316" },
  ];

  // Chart geometry
  const series = CHART[timeFilter];
  const CW = 600;
  const CH = 210;
  const maxV = Math.max(...series.a, ...series.b, 1);
  const toPts = (arr: readonly number[]): [number, number][] =>
    arr.map((v, i) => [
      arr.length === 1 ? CW / 2 : (i * CW) / (arr.length - 1),
      CH - 24 - (v / maxV) * (CH - 56),
    ]);
  const ptsA = toPts(series.a);
  const ptsB = toPts(series.b);
  const lineA = smoothPath(ptsA);
  const lineB = smoothPath(ptsB);
  const areaA = `${lineA} L ${ptsA[ptsA.length - 1][0]} ${CH} L ${ptsA[0][0]} ${CH} Z`;

  const completionRate = reports?.enrollment_metrics?.completion_rate_percentage ?? 0;
  const publishedPct = stats?.total_courses
    ? Math.round(((stats.active_courses || 0) / stats.total_courses) * 100)
    : 0;

  let navIdx = 0;

  return (
    <div className="relative flex h-screen overflow-hidden font-sans text-[#0F172A] antialiased selection:bg-[#A78BFA]/25">
      {Background}

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 16, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-[60] flex items-center gap-2 rounded-full bg-[#0F172A] px-4 py-2.5 text-[12.5px] font-medium text-white shadow-2xl"
          >
            <CheckCircle2 className="h-4 w-4 text-[#C4B5FD]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          "z-40 flex select-none flex-col border-r border-white/70 bg-white/40 backdrop-blur-2xl transition-all duration-200",
          "fixed inset-y-0 left-0 lg:static",
          mobileSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarCollapsed ? "lg:w-[76px]" : "lg:w-[256px]"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex min-w-0 items-center gap-3">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.05 }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#8B5CF6] text-[15px] font-extrabold text-white shadow-lg shadow-[#A78BFA]/30"
            >
              P
            </motion.div>
            {!sidebarCollapsed && (
              <div className="min-w-0 leading-tight">
                <div className="text-[14.5px] font-bold tracking-tight text-[#0F172A]">Pathly</div>
                <div className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate-500">
                  Admin Console
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (window.innerWidth < 1024) setMobileSidebarOpen(false);
              else setSidebarCollapsed(!sidebarCollapsed);
            }}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/70 hover:text-[#0F172A]"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        <nav className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-3">
          {NAV.map((section) => (
            <div key={section.group} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {section.group}
                </div>
              )}
              {section.items.map((navItem) => {
                const Icon = navItem.icon;
                const isActive = activeTab === navItem.id;
                const i = navIdx++;
                return (
                  <motion.button
                    key={navItem.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.35 }}
                    onClick={() => {
                      setActiveTab(navItem.id);
                      setMobileSidebarOpen(false);
                    }}
                    title={sidebarCollapsed ? navItem.label : undefined}
                    className={cn(
                      "group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] font-medium transition-colors",
                      isActive ? "text-[#0F172A]" : "text-slate-500 hover:text-[#0F172A]"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-white/90 shadow-[0_2px_14px_rgba(15,23,42,0.07)] ring-1 ring-white"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <div className="relative flex min-w-0 items-center gap-3">
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-transform group-hover:scale-110",
                          isActive ? "text-[#7C3AED]" : ""
                        )}
                      />
                      {!sidebarCollapsed && <span className="truncate">{navItem.label}</span>}
                    </div>
                    {!sidebarCollapsed && navItem.count !== undefined && (
                      <span
                        className={cn(
                          "relative rounded-md px-1.5 py-0.5 font-mono text-[10px]",
                          isActive ? "bg-[#A78BFA]/15 text-[#6D28D9]" : "bg-slate-900/5 text-slate-500"
                        )}
                      >
                        {navItem.count}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="space-y-2 border-t border-white/70 p-3">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 px-2 py-1 text-[11.5px] text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Production · DB connected
            </div>
          )}
          <div className={cn("flex items-center rounded-xl p-2", sidebarCollapsed ? "justify-center" : "justify-between")}>
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar name={currentAdmin?.full_name || "A"} size="sm" />
              {!sidebarCollapsed && (
                <div className="min-w-0 leading-tight">
                  <div className="truncate text-[12.5px] font-semibold text-[#0F172A]">
                    {currentAdmin?.full_name || "Administrator"}
                  </div>
                  <div className="truncate font-mono text-[10px] text-slate-500">
                    {currentAdmin?.role || "super_admin"}
                  </div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                title="Sign out"
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-500"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
          {sidebarCollapsed && (
            <button
              onClick={handleLogout}
              title="Sign out"
              className="flex w-full items-center justify-center rounded-xl p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-white/70 bg-white/30 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-lg p-1.5 text-slate-500 hover:text-[#0F172A] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="leading-tight">
              <div className="text-[11px] font-medium text-slate-400">Workspace</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="text-[15px] font-bold tracking-tight"
                >
                  {PAGE_TITLES[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Quick search…"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="h-9 w-52 rounded-xl bg-white/60 pl-9 pr-10 text-[12.5px] ring-1 ring-slate-900/10 outline-none transition placeholder:text-slate-400 focus:w-64 focus:bg-white focus:ring-2 focus:ring-[#A78BFA]/50"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md bg-white px-1.5 font-mono text-[9.5px] text-slate-400 ring-1 ring-slate-900/10">
                ⌘K
              </span>
            </div>

            <div className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[11.5px] font-semibold text-emerald-700 sm:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Live
            </div>

            <button
              onClick={loadAllData}
              disabled={refreshing}
              title="Refresh data"
              className="rounded-xl bg-white/60 p-2 text-slate-500 ring-1 ring-slate-900/10 transition hover:bg-white hover:text-[#0F172A] disabled:opacity-50"
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin text-[#A78BFA]")} />
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 rounded-xl bg-white/60 px-3 py-2 text-[12.5px] font-medium text-slate-600 ring-1 ring-slate-900/10 transition hover:bg-white hover:text-[#7C3AED] sm:inline-flex"
            >
              User Portal
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </header>

        {/* Content */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-8 lg:px-10">
          <div className="mx-auto w-full max-w-[1300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={container}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                className="space-y-10"
              >
                {/* ============ DASHBOARD ============ */}
                {activeTab === "dashboard" && (
                  <>
                    <motion.section variants={item} className="space-y-5">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 text-[11px] font-medium text-[#6D28D9] ring-1 ring-white backdrop-blur">
                        <Sparkles className="h-3.5 w-3.5" />
                        Synced {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div>
                        <h2 className="text-[34px] font-extrabold leading-tight tracking-tight lg:text-[42px]">
                          {greeting},{" "}
                          <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
                            {firstName}
                          </span>{" "}
                          <motion.span
                            className="inline-block origin-[70%_70%]"
                            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.5 }}
                          >
                            👋
                          </motion.span>
                        </h2>
                        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-slate-500">
                          {users.length} candidates, {courses.length} courses and {mentors.length} mentors on the
                          platform, with {enrollments.length} active enrollments right now.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button onClick={openNewCourseDrawer} className={primaryBtn}>
                          <Plus className="h-4 w-4" />
                          New Course
                        </button>
                        <button onClick={openNewMentorDrawer} className={ghostBtn}>
                          <Plus className="h-4 w-4 text-slate-500" />
                          Add Mentor
                        </button>
                        <button onClick={() => setActiveTab("users")} className={ghostBtn}>
                          <Users className="h-4 w-4 text-slate-500" />
                          Users
                        </button>
                        <button onClick={() => setActiveTab("enrollments")} className={ghostBtn}>
                          <GraduationCap className="h-4 w-4 text-slate-500" />
                          Enrollments
                        </button>
                      </div>
                    </motion.section>

                    {/* KPI strip – no boxes, just dividers */}
                    <motion.section
                      variants={item}
                      className="grid grid-cols-2 gap-y-9 border-y border-slate-900/[0.08] py-8 lg:grid-cols-4"
                    >
                      {kpis.map((kpi, idx) => {
                        const Icon = kpi.icon;
                        return (
                          <div
                            key={kpi.label}
                            className={cn(
                              "group border-l border-slate-900/[0.08] pl-6",
                              idx % 2 === 0 && "max-lg:border-l-0 max-lg:pl-0",
                              idx % 4 === 0 && "lg:border-l-0 lg:pl-0"
                            )}
                          >
                            <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                              <Icon className="h-4 w-4 transition-transform group-hover:scale-125" style={{ color: kpi.tone }} />
                              {kpi.label}
                            </div>
                            <div className="mt-2 flex items-end justify-between gap-2 pr-4">
                              <div className="text-[38px] font-extrabold leading-none tracking-tight">
                                <CountUp value={kpi.value} />
                              </div>
                              <Sparkline seed={idx + 1} color={kpi.tone} />
                            </div>
                            <div className="mt-2 text-[11px] font-semibold" style={{ color: kpi.tone }}>
                              ● {kpi.trend}
                            </div>
                          </div>
                        );
                      })}
                    </motion.section>

                    {/* Chart + health */}
                    <motion.section variants={item} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                      <div className="space-y-5 lg:col-span-8">
                        <SectionTitle
                          title="Growth & Velocity"
                          desc="Registrations vs course enrollments · sample data"
                          right={
                            <Segmented
                              value={timeFilter}
                              onChange={setTimeFilter}
                              options={[
                                { value: "7d", label: "7D" },
                                { value: "30d", label: "30D" },
                                { value: "90d", label: "90D" },
                              ]}
                            />
                          }
                        />

                        <div>
                          <svg key={timeFilter} viewBox={`0 0 ${CW} ${CH}`} className="h-auto w-full overflow-visible">
                            <defs>
                              <linearGradient id="areaA" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.32" />
                                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            {[0.25, 0.5, 0.75].map((t) => (
                              <line
                                key={t}
                                x1="0"
                                x2={CW}
                                y1={CH * t}
                                y2={CH * t}
                                stroke="rgba(15,23,42,0.08)"
                                strokeDasharray="4 5"
                              />
                            ))}
                            <motion.path
                              d={areaA}
                              fill="url(#areaA)"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5, duration: 0.8 }}
                            />
                            <motion.path
                              d={lineA}
                              fill="none"
                              stroke="#A78BFA"
                              strokeWidth="3"
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1.3, ease: "easeOut" }}
                            />
                            <motion.path
                              d={lineB}
                              fill="none"
                              stroke="#F59E0B"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeDasharray="1 6"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6, duration: 0.8 }}
                            />
                            {ptsA.map(([x, y], i) => (
                              <motion.circle
                                key={`a${i}`}
                                cx={x}
                                cy={y}
                                fill="#fff"
                                stroke="#A78BFA"
                                strokeWidth="2.5"
                                initial={{ r: 0 }}
                                animate={{ r: 4.5 }}
                                transition={{ delay: 0.9 + i * 0.1, type: "spring", stiffness: 300 }}
                              />
                            ))}
                            {ptsB.map(([x, y], i) => (
                              <motion.circle
                                key={`b${i}`}
                                cx={x}
                                cy={y}
                                fill="#fff"
                                stroke="#F59E0B"
                                strokeWidth="2"
                                initial={{ r: 0 }}
                                animate={{ r: 3.5 }}
                                transition={{ delay: 1 + i * 0.1, type: "spring", stiffness: 300 }}
                              />
                            ))}
                          </svg>
                          <div className="mt-2 flex justify-between text-[10.5px] font-medium text-slate-400">
                            {series.labels.map((l) => (
                              <span key={l}>{l}</span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
                          <div className="flex items-center gap-5">
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full bg-[#A78BFA]" />
                              <span className="font-medium text-slate-600">Registrations</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                              <span className="font-medium text-slate-600">Enrollments</span>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                            <TrendingUp className="h-3.5 w-3.5" />
                            +24.8% vs last period
                          </span>
                        </div>
                      </div>

                      <div className="space-y-5 lg:col-span-4 lg:border-l lg:border-slate-900/[0.08] lg:pl-10">
                        <SectionTitle title="Operational Health" desc="Platform status at a glance" />
                        <div className="flex items-center gap-5">
                          <Ring value={completionRate} />
                          <div className="space-y-3 text-[12px]">
                            <div>
                              <div className="font-mono text-[16px] font-bold">
                                {stats?.active_courses ?? 0}/{stats?.total_courses ?? 0}
                              </div>
                              <div className="text-slate-500">Courses live ({publishedPct}%)</div>
                            </div>
                            <div>
                              <div className="font-mono text-[16px] font-bold">{stats?.active_mentors || 0}</div>
                              <div className="text-slate-500">Mentors online</div>
                            </div>
                          </div>
                        </div>
                        <div className="divide-y divide-slate-900/[0.07] text-[12.5px]">
                          <div className="flex items-center justify-between py-3">
                            <span className="text-slate-500">Service uptime</span>
                            <span className="font-mono font-bold text-emerald-600">99.98%</span>
                          </div>
                          <div className="flex items-center justify-between py-3">
                            <span className="text-slate-500">Database</span>
                            <span className="font-mono font-semibold text-emerald-600">pathly_db · Live</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[12px] font-medium text-emerald-700">
                          <Activity className="h-4 w-4" />
                          All services running smoothly.
                        </div>
                      </div>
                    </motion.section>

                    {/* Activity + newest */}
                    <motion.section variants={item} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                      <div className="space-y-4 lg:col-span-7">
                        <SectionTitle
                          title="Live Event Stream"
                          right={<span className="text-[11px] text-slate-400">Real-time from MongoDB</span>}
                        />
                        <div className="divide-y divide-slate-900/[0.07]">
                          {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                            stats.recent_activity.map((act, i) => (
                              <motion.div
                                key={i}
                                {...rowAnim(i)}
                                className="flex items-center justify-between gap-3 py-3"
                              >
                                <div className="flex min-w-0 items-center gap-3">
                                  <span
                                    className={cn(
                                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                      act.type === "enrollment"
                                        ? "bg-sky-500/10 text-sky-600"
                                        : "bg-pink-500/10 text-pink-600"
                                    )}
                                  >
                                    {act.type === "enrollment" ? (
                                      <GraduationCap className="h-4 w-4" />
                                    ) : (
                                      <Calendar className="h-4 w-4" />
                                    )}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="truncate text-[13px] font-semibold">{act.title}</div>
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                      {act.badge}
                                    </span>
                                  </div>
                                </div>
                                <span className="shrink-0 font-mono text-[11px] text-slate-400">
                                  {new Date(act.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </motion.div>
                            ))
                          ) : (
                            <div className="py-10 text-center text-[12.5px] text-slate-400">
                              No events registered yet.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 lg:col-span-5 lg:border-l lg:border-slate-900/[0.08] lg:pl-10">
                        <SectionTitle
                          title="Newest Candidates"
                          right={
                            <button
                              onClick={() => setActiveTab("users")}
                              className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-[#7C3AED] hover:underline"
                            >
                              View all <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          }
                        />
                        <div className="divide-y divide-slate-900/[0.07]">
                          {users.slice(0, 5).map((u, i) => (
                            <motion.button
                              key={u.id}
                              {...rowAnim(i)}
                              onClick={() => handleViewUserDetail(u.id)}
                              className="group flex w-full items-center justify-between gap-3 py-3 text-left"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <Avatar name={u.name} />
                                <div className="min-w-0">
                                  <div className="truncate text-[13px] font-semibold transition-colors group-hover:text-[#7C3AED]">
                                    {u.name}
                                  </div>
                                  <div className="truncate text-[11px] text-slate-500">{u.target_role}</div>
                                </div>
                              </div>
                              <span className="shrink-0 font-mono text-[11px] text-slate-400">
                                {u.enrollments_count} courses
                              </span>
                            </motion.button>
                          ))}
                          {users.length === 0 && (
                            <div className="py-10 text-center text-[12.5px] text-slate-400">No users yet.</div>
                          )}
                        </div>
                      </div>
                    </motion.section>
                  </>
                )}

                {/* ============ COURSES ============ */}
                {activeTab === "courses" && (
                  <>
                    <motion.div variants={item}>
                      <PageHeader
                        title="Course Catalog"
                        desc="Manage published courses that appear in the candidate Learn & Pathways hub."
                      >
                        <button onClick={openNewCourseDrawer} className={primaryBtn}>
                          <Plus className="h-4 w-4" />
                          New Course
                        </button>
                      </PageHeader>
                    </motion.div>

                    <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-1 flex-wrap items-center gap-2.5">
                        <SearchBox
                          value={courseSearch}
                          onChange={setCourseSearch}
                          placeholder="Search by title or skill…"
                          className="w-full max-w-xs"
                        />
                        <select
                          value={courseCategoryFilter}
                          onChange={(e) => setCourseCategoryFilter(e.target.value)}
                          className={cn(inputCls, "w-auto font-medium text-slate-600")}
                        >
                          <option value="all">All Categories</option>
                          <option value="webdev">Web Development</option>
                          <option value="data">Data Analysis</option>
                          <option value="design">UI/UX Design</option>
                          <option value="cloud">Cloud & DevOps</option>
                          <option value="govt">TNPSC / Govt</option>
                        </select>
                        <Segmented
                          value={courseStatusFilter}
                          onChange={setCourseStatusFilter}
                          options={[
                            { value: "all", label: "All" },
                            { value: "published", label: "Published" },
                            { value: "draft", label: "Draft" },
                          ]}
                        />
                      </div>
                      <span className="font-mono text-[12px] text-slate-400">{filteredCourses.length} courses</span>
                    </motion.div>

                    <motion.div variants={item} className="overflow-x-auto">
                      <table className="w-full text-left text-[13px]">
                        <thead className="border-b border-slate-900/10">
                          <tr>
                            <th className={thCls}>Course</th>
                            <th className={thCls}>Category</th>
                            <th className={thCls}>Level · Duration</th>
                            <th className={thCls}>Price</th>
                            <th className={thCls}>Status</th>
                            <th className={cn(thCls, "text-right")}>Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/[0.07]">
                          {filteredCourses.length > 0 ? (
                            filteredCourses.map((c, i) => (
                              <motion.tr
                                key={c.id}
                                {...rowAnim(i)}
                                className="transition-colors hover:bg-white/50"
                              >
                                <td className="max-w-xs px-4 py-4">
                                  <div className="font-semibold">{c.title}</div>
                                  <div className="line-clamp-1 text-[11.5px] text-slate-500">{c.description}</div>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="rounded-full bg-[#A78BFA]/12 px-2.5 py-1 text-[11px] font-semibold capitalize text-[#6D28D9]">
                                    {c.category}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-slate-500">
                                  <span className="font-medium text-[#0F172A]">{c.level}</span> · {c.duration}
                                </td>
                                <td className="px-4 py-4 font-semibold">{c.price}</td>
                                <td className="px-4 py-4">
                                  <StatusPill
                                    on={c.status === "published"}
                                    onLabel="Published"
                                    offLabel="Draft"
                                    onClick={() => handleToggleCourseStatus(c)}
                                  />
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <div className="inline-flex items-center gap-1">
                                    <button
                                      onClick={() => openEditCourseDrawer(c)}
                                      className="rounded-lg p-2 text-slate-500 transition hover:bg-[#A78BFA]/10 hover:text-[#7C3AED]"
                                      title="Edit"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCourse(c)}
                                      className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-500"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-4 py-14 text-center text-slate-400">
                                No courses match your filters.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </motion.div>
                  </>
                )}

                {/* ============ MENTORS ============ */}
                {activeTab === "mentors" && (
                  <>
                    <motion.div variants={item}>
                      <PageHeader title="Industry Mentors" desc="Manage expert mentors for 1-on-1 Google Meet sessions.">
                        <button onClick={openNewMentorDrawer} className={primaryBtn}>
                          <Plus className="h-4 w-4" />
                          Add Mentor
                        </button>
                      </PageHeader>
                    </motion.div>

                    <motion.div variants={item} className="flex flex-wrap items-center gap-2.5">
                      <SearchBox
                        value={mentorSearch}
                        onChange={setMentorSearch}
                        placeholder="Search mentors…"
                        className="w-full max-w-xs"
                      />
                      <Segmented
                        value={mentorStatusFilter}
                        onChange={setMentorStatusFilter}
                        options={[
                          { value: "all", label: "All" },
                          { value: "active", label: "Active" },
                          { value: "inactive", label: "Inactive" },
                        ]}
                      />
                    </motion.div>

                    <motion.div variants={item} className="divide-y divide-slate-900/[0.07] border-y border-slate-900/10">
                      {filteredMentors.length > 0 ? (
                        filteredMentors.map((m, i) => (
                          <motion.div
                            key={m.id}
                            {...rowAnim(i)}
                            className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-5 transition-colors hover:bg-white/40"
                          >
                            <div className="flex min-w-[240px] items-center gap-4">
                              <Avatar name={m.name} size="lg" />
                              <div className="min-w-0">
                                <div className="truncate text-[15px] font-bold">{m.name}</div>
                                <div className="truncate text-[12px] text-slate-500">
                                  {m.role} · {m.company}
                                </div>
                              </div>
                            </div>

                            <div className="hidden min-w-[180px] flex-1 flex-wrap gap-1.5 xl:flex">
                              {m.specialty?.slice(0, 3).map((s) => (
                                <span
                                  key={s}
                                  className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-900/5"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-8 text-center">
                              {[
                                { v: m.experience, l: "Experience" },
                                { v: m.session_price, l: "Per session" },
                                { v: m.sessionsCount, l: "Booked" },
                              ].map((s) => (
                                <div key={s.l}>
                                  <div className="text-[13px] font-bold">{s.v}</div>
                                  <div className="text-[10.5px] text-slate-400">{s.l}</div>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <StatusPill
                                on={m.status === "active"}
                                onLabel="Active"
                                offLabel="Inactive"
                                onClick={() => handleToggleMentorStatus(m)}
                              />
                              <button
                                onClick={() => openEditMentorDrawer(m)}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-[#A78BFA]/10 hover:text-[#7C3AED]"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMentor(m)}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-500"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="py-16 text-center text-[13px] text-slate-400">No mentors found.</div>
                      )}
                    </motion.div>
                  </>
                )}

                {/* ============ USERS ============ */}
                {activeTab === "users" && (
                  <>
                    <motion.div variants={item}>
                      <PageHeader
                        title="Registered Candidates"
                        desc="Candidate profiles with enrollment and roadmap progress."
                      />
                    </motion.div>

                    <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <SearchBox
                          value={userSearch}
                          onChange={setUserSearch}
                          placeholder="Search name, email, role…"
                          className="w-72"
                        />
                        <Segmented
                          value={userStatusFilter}
                          onChange={setUserStatusFilter}
                          options={[
                            { value: "all", label: "All" },
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Suspended" },
                          ]}
                        />
                      </div>
                      <span className="font-mono text-[12px] text-slate-400">{filteredUsers.length} candidates</span>
                    </motion.div>

                    <motion.div variants={item} className="overflow-x-auto">
                      <table className="w-full text-left text-[13px]">
                        <thead className="border-b border-slate-900/10">
                          <tr>
                            <th className={thCls}>Candidate</th>
                            <th className={thCls}>Contact</th>
                            <th className={thCls}>Target Role</th>
                            <th className={thCls}>Skills</th>
                            <th className={thCls}>Courses</th>
                            <th className={thCls}>Status</th>
                            <th className={cn(thCls, "text-right")}>Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/[0.07]">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((u, i) => (
                              <motion.tr key={u.id} {...rowAnim(i)} className="transition-colors hover:bg-white/50">
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar name={u.name} size="sm" />
                                    <span className="font-semibold">{u.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="font-medium">{u.email}</div>
                                  <div className="font-mono text-[11px] text-slate-500">{u.mobile}</div>
                                </td>
                                <td className="px-4 py-4 font-medium text-[#6D28D9]">{u.target_role}</td>
                                <td className="px-4 py-4">
                                  <div className="flex max-w-xs flex-wrap gap-1">
                                    {u.skills?.slice(0, 3).map((s, idx) => (
                                      <span
                                        key={idx}
                                        className="rounded-full bg-white/70 px-2 py-0.5 text-[10.5px] font-medium text-slate-600 ring-1 ring-slate-900/5"
                                      >
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-4 py-4 font-mono font-bold">{u.enrollments_count}</td>
                                <td className="px-4 py-4">
                                  <StatusPill
                                    on={u.is_active}
                                    onLabel="Active"
                                    offLabel="Suspended"
                                    onClick={() => handleToggleUserStatus(u)}
                                  />
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <button
                                    onClick={() => handleViewUserDetail(u.id)}
                                    disabled={userDetailLoading}
                                    className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#7C3AED] ring-1 ring-[#A78BFA]/30 transition hover:bg-[#A78BFA] hover:text-white disabled:opacity-50"
                                  >
                                    {userDetailLoading ? "Loading…" : "Inspect"}
                                  </button>
                                </td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="px-4 py-14 text-center text-slate-400">
                                No registered users found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </motion.div>
                  </>
                )}

                {/* ============ ENROLLMENTS ============ */}
                {activeTab === "enrollments" && (
                  <>
                    <motion.div variants={item}>
                      <PageHeader
                        title="Course Enrollments"
                        desc={`${enrollments.length} learners enrolled across the catalog.`}
                      />
                    </motion.div>
                    <motion.div variants={item} className="overflow-x-auto">
                      <table className="w-full text-left text-[13px]">
                        <thead className="border-b border-slate-900/10">
                          <tr>
                            <th className={thCls}>Candidate</th>
                            <th className={thCls}>Course</th>
                            <th className={thCls}>Progress</th>
                            <th className={thCls}>Status</th>
                            <th className={thCls}>Enrolled</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/[0.07]">
                          {enrollments.map((e, i) => (
                            <motion.tr key={e.id} {...rowAnim(i)} className="transition-colors hover:bg-white/50">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar name={e.user_name} size="sm" />
                                  <div>
                                    <div className="font-semibold">{e.user_name}</div>
                                    <div className="text-[11px] text-slate-500">{e.user_email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 font-medium">{e.course_title}</td>
                              <td className="px-4 py-4">
                                <div className="w-36 space-y-1.5">
                                  <div className="font-mono text-[11px] font-semibold">{e.progress_percentage}%</div>
                                  <ProgressBar value={e.progress_percentage} />
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-600 ring-1 ring-slate-900/5">
                                  {e.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 font-mono text-[11.5px] text-slate-500">
                                {new Date(e.enrolled_at).toLocaleDateString()}
                              </td>
                            </motion.tr>
                          ))}
                          {enrollments.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-4 py-14 text-center text-slate-400">
                                No enrollments yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </motion.div>
                  </>
                )}

                {/* ============ SESSIONS ============ */}
                {activeTab === "mentorship-sessions" && (
                  <>
                    <motion.div variants={item}>
                      <PageHeader
                        title="1:1 Mentorship Sessions"
                        desc={`${sessions.length} sessions booked by candidates.`}
                      />
                    </motion.div>
                    <motion.div variants={item} className="overflow-x-auto">
                      <table className="w-full text-left text-[13px]">
                        <thead className="border-b border-slate-900/10">
                          <tr>
                            <th className={thCls}>Booking</th>
                            <th className={thCls}>Candidate</th>
                            <th className={thCls}>Mentor</th>
                            <th className={thCls}>Schedule</th>
                            <th className={thCls}>Topic</th>
                            <th className={cn(thCls, "text-right")}>Join</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/[0.07]">
                          {sessions.map((s, i) => (
                            <motion.tr key={s.id} {...rowAnim(i)} className="transition-colors hover:bg-white/50">
                              <td className="px-4 py-4 font-mono text-[11.5px] font-bold text-[#6D28D9]">
                                {s.booking_id}
                              </td>
                              <td className="px-4 py-4">
                                <div className="font-semibold">{s.user_name}</div>
                                <div className="text-[11px] text-slate-500">{s.user_email}</div>
                              </td>
                              <td className="px-4 py-4 font-semibold">{s.mentor_name}</td>
                              <td className="px-4 py-4">
                                <div className="font-medium">{s.date}</div>
                                <div className="text-[11px] text-slate-500">{s.time_slot}</div>
                              </td>
                              <td className="max-w-xs truncate px-4 py-4 text-slate-500">{s.topic}</td>
                              <td className="px-4 py-4 text-right">
                                <a
                                  href={s.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#7C3AED] ring-1 ring-[#A78BFA]/30 transition hover:bg-[#A78BFA] hover:text-white"
                                >
                                  <Video className="h-3.5 w-3.5" />
                                  Meet
                                </a>
                              </td>
                            </motion.tr>
                          ))}
                          {sessions.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-4 py-14 text-center text-slate-400">
                                No sessions booked yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </motion.div>
                  </>
                )}

                {/* ============ REPORTS / ANALYTICS ============ */}
                {activeTab === "reports" && (
                  <motion.div variants={item}>
                    <AnalyticsDashboard />
                  </motion.div>
                )}

                {/* ============ SETTINGS ============ */}
                {activeTab === "settings" && (
                  <>
                    <motion.div variants={item}>
                      <PageHeader title="System Configuration" desc="Workspace and administrator details." />
                    </motion.div>
                    <motion.div
                      variants={item}
                      className="max-w-2xl divide-y divide-slate-900/[0.07] border-y border-slate-900/10 text-[13px]"
                    >
                      {[
                        { icon: Server, label: "Workspace instance", value: "Pathly Enterprise Production" },
                        { icon: UserCheck, label: "Administrator email", value: currentAdmin?.email },
                        { icon: Shield, label: "Role authorization", value: currentAdmin?.role, mono: true },
                        {
                          icon: Layers,
                          label: "MongoDB connection",
                          value: "mongodb://localhost:27017/pathly_db",
                          mono: true,
                        },
                      ].map((row, i) => {
                        const Icon = row.icon;
                        return (
                          <motion.div
                            key={row.label}
                            {...rowAnim(i)}
                            className="flex items-center justify-between gap-4 py-4"
                          >
                            <div className="flex items-center gap-3 text-slate-500">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 ring-1 ring-slate-900/5">
                                <Icon className="h-4 w-4" />
                              </span>
                              {row.label}
                            </div>
                            <span
                              className={cn(
                                "truncate font-medium",
                                row.mono && "font-mono text-[12px] text-[#6D28D9]"
                              )}
                            >
                              {row.value}
                            </span>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* DRAWER: COURSE */}
      <Drawer
        open={courseDrawerOpen}
        title={editingCourse ? "Edit Course" : "New Course"}
        subtitle="Fill in the course details shown to candidates"
        onClose={() => setCourseDrawerOpen(false)}
      >
        <form onSubmit={handleSaveCourse} className="space-y-4 p-6">
          <Field label="Course title">
            <input
              type="text"
              required
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                value={courseForm.category}
                onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                className={inputCls}
              >
                <option value="webdev">Web Development</option>
                <option value="data">Data Analysis</option>
                <option value="design">UI/UX Design</option>
                <option value="cloud">Cloud & DevOps</option>
                <option value="govt">TNPSC / Govt</option>
              </select>
            </Field>
            <Field label="Price">
              <input
                type="text"
                required
                value={courseForm.price}
                onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Duration">
              <input
                type="text"
                required
                value={courseForm.duration}
                onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Difficulty level">
              <select
                value={courseForm.level}
                onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                className={inputCls}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Provider">
              <input
                type="text"
                value={courseForm.provider}
                onChange={(e) => setCourseForm({ ...courseForm, provider: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Instructor">
              <input
                type="text"
                value={courseForm.instructor}
                onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows={3}
              required
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              className={cn(inputCls, "h-auto py-2.5")}
            />
          </Field>

          <Field label="Skills (comma-separated)">
            <input
              type="text"
              value={courseForm.skills}
              onChange={(e) => setCourseForm({ ...courseForm, skills: e.target.value })}
              className={inputCls}
            />
          </Field>

          <Field label="What you'll learn (comma-separated)">
            <input
              type="text"
              value={courseForm.whatYouLearn}
              onChange={(e) => setCourseForm({ ...courseForm, whatYouLearn: e.target.value })}
              className={inputCls}
            />
          </Field>

          <Field label="Publishing status">
            <select
              value={courseForm.status}
              onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value as any })}
              className={inputCls}
            >
              <option value="published">Published (visible to candidates)</option>
              <option value="draft">Draft (admin only)</option>
            </select>
          </Field>

          <div className="sticky bottom-0 -mx-6 -mb-6 flex justify-end gap-2 border-t border-slate-900/[0.07] bg-white/90 px-6 py-4 backdrop-blur">
            <button type="button" onClick={() => setCourseDrawerOpen(false)} className={ghostBtn}>
              Cancel
            </button>
            <button type="submit" className={primaryBtn}>
              Save changes
            </button>
          </div>
        </form>
      </Drawer>

      {/* DRAWER: MENTOR */}
      <Drawer
        open={mentorDrawerOpen}
        title={editingMentor ? "Edit Mentor" : "New Industry Mentor"}
        subtitle="Profile shown when candidates book a session"
        onClose={() => setMentorDrawerOpen(false)}
      >
        <form onSubmit={handleSaveMentor} className="space-y-4 p-6">
          <Field label="Full name">
            <input
              type="text"
              required
              value={mentorForm.name}
              onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Designation">
              <input
                type="text"
                required
                value={mentorForm.role}
                onChange={(e) => setMentorForm({ ...mentorForm, role: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Company">
              <input
                type="text"
                required
                value={mentorForm.company}
                onChange={(e) => setMentorForm({ ...mentorForm, company: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Email">
              <input
                type="email"
                value={mentorForm.email}
                onChange={(e) => setMentorForm({ ...mentorForm, email: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Mobile">
              <input
                type="text"
                value={mentorForm.mobile}
                onChange={(e) => setMentorForm({ ...mentorForm, mobile: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Experience">
              <input
                type="text"
                value={mentorForm.experience}
                onChange={(e) => setMentorForm({ ...mentorForm, experience: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Session price">
              <input
                type="text"
                value={mentorForm.session_price}
                onChange={(e) => setMentorForm({ ...mentorForm, session_price: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Duration">
              <input
                type="text"
                value={mentorForm.session_duration}
                onChange={(e) => setMentorForm({ ...mentorForm, session_duration: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Skills (comma-separated)">
            <input
              type="text"
              value={mentorForm.skills}
              onChange={(e) => setMentorForm({ ...mentorForm, skills: e.target.value })}
              className={inputCls}
            />
          </Field>

          <Field label="Specialty (comma-separated)">
            <input
              type="text"
              value={mentorForm.specialty}
              onChange={(e) => setMentorForm({ ...mentorForm, specialty: e.target.value })}
              className={inputCls}
            />
          </Field>

          <Field label="Bio">
            <textarea
              rows={3}
              value={mentorForm.bio}
              onChange={(e) => setMentorForm({ ...mentorForm, bio: e.target.value })}
              className={cn(inputCls, "h-auto py-2.5")}
            />
          </Field>

          <Field label="Google Meet link">
            <input
              type="url"
              required
              value={mentorForm.meeting_link}
              onChange={(e) => setMentorForm({ ...mentorForm, meeting_link: e.target.value })}
              className={inputCls}
            />
          </Field>

          <Field label="Status">
            <select
              value={mentorForm.status}
              onChange={(e) => setMentorForm({ ...mentorForm, status: e.target.value as any })}
              className={inputCls}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>

          <div className="sticky bottom-0 -mx-6 -mb-6 flex justify-end gap-2 border-t border-slate-900/[0.07] bg-white/90 px-6 py-4 backdrop-blur">
            <button type="button" onClick={() => setMentorDrawerOpen(false)} className={ghostBtn}>
              Cancel
            </button>
            <button type="submit" className={primaryBtn}>
              Save mentor
            </button>
          </div>
        </form>
      </Drawer>

      {/* DRAWER: USER DETAIL */}
      <Drawer
        open={!!selectedUserDetail}
        title={selectedUserDetail?.name ?? ""}
        subtitle={selectedUserDetail?.email}
        onClose={() => setSelectedUserDetail(null)}
      >
        {selectedUserDetail && (
          <div className="space-y-7 p-6 text-[13px]">
            <div className="flex items-center gap-4">
              <Avatar name={selectedUserDetail.name} size="lg" />
              <div className="min-w-0">
                <div className="truncate text-[16px] font-bold">{selectedUserDetail.name}</div>
                <div className="truncate text-[12px] font-medium text-[#6D28D9]">
                  {selectedUserDetail.profile.target_role}
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-900/[0.07] border-y border-slate-900/[0.07]">
              <div className="flex justify-between py-3">
                <span className="text-slate-500">Career status</span>
                <span className="font-medium capitalize">{selectedUserDetail.career_status}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-slate-500">Registered</span>
                <span className="font-mono text-slate-600">
                  {new Date(selectedUserDetail.registered_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Career roadmap
              </div>
              {selectedUserDetail.roadmap ? (
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="font-semibold">{selectedUserDetail.roadmap.title}</div>
                      <div className="text-[11.5px] text-slate-500">
                        {selectedUserDetail.roadmap.milestones_count} milestones
                      </div>
                    </div>
                    <div className="text-[22px] font-extrabold text-[#7C3AED]">
                      {selectedUserDetail.roadmap.overall_progress}%
                    </div>
                  </div>
                  <ProgressBar value={selectedUserDetail.roadmap.overall_progress} />
                </div>
              ) : (
                <div className="text-[12.5px] text-slate-400">No active roadmap configured.</div>
              )}
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Enrolled courses ({selectedUserDetail.enrollments.length})
              </div>
              <div className="divide-y divide-slate-900/[0.07] border-y border-slate-900/[0.07]">
                {selectedUserDetail.enrollments.map((en) => (
                  <div key={en.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium">{en.course_title}</div>
                      <div className="text-[11px] capitalize text-slate-500">{en.status}</div>
                    </div>
                    <div className="font-mono font-bold text-[#7C3AED]">{en.progress_percentage}%</div>
                  </div>
                ))}
                {selectedUserDetail.enrollments.length === 0 && (
                  <div className="py-4 text-center text-[12.5px] text-slate-400">No enrollments.</div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Mentorship bookings ({selectedUserDetail.bookings.length})
              </div>
              <div className="divide-y divide-slate-900/[0.07] border-y border-slate-900/[0.07]">
                {selectedUserDetail.bookings.map((bk) => (
                  <div key={bk.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium">With {bk.mentor_name}</div>
                      <div className="text-[11px] text-slate-500">
                        {bk.date} · {bk.time_slot}
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10.5px] font-semibold uppercase text-emerald-700">
                      {bk.status}
                    </span>
                  </div>
                ))}
                {selectedUserDetail.bookings.length === 0 && (
                  <div className="py-4 text-center text-[12.5px] text-slate-400">No bookings.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}