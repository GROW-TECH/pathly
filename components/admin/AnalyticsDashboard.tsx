"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Download,
  RefreshCw,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  GraduationCap,
  Calendar,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { adminApi, BiAnalyticsData } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

// Palette matching Pathly SaaS purple/indigo theme
const COLORS = {
  purple: "#8B5CF6",
  indigo: "#6366F1",
  violet: "#7C3AED",
  emerald: "#10B981",
  amber: "#F59E0B",
  rose: "#F43F5E",
  slate: "#64748B",
  cyan: "#06B6D4",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "#10B981", // Emerald
  Intermediate: "#6366F1", // Indigo
  Advanced: "#EC4899", // Pink/Rose
};

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "#94A3B8", // Slate
  "In Progress": "#F59E0B", // Amber
  Completed: "#10B981", // Emerald
};

const BOOKING_COLORS: Record<string, string> = {
  Confirmed: "#10B981",
  Pending: "#F59E0B",
  Completed: "#6366F1",
  Cancelled: "#F43F5E",
};

// Custom tooltip renderer
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white/95 px-3.5 py-2.5 shadow-xl shadow-slate-900/10 backdrop-blur-md">
        <div className="text-[11px] font-semibold tracking-wider text-slate-500">{label}</div>
        <div className="mt-1 space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 text-[12px]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color || entry.stroke || entry.fill }}
              />
              <span className="font-medium text-slate-600">{entry.name}:</span>
              <span className="font-mono font-bold text-slate-900">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<BiAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [days, setDays] = useState<string>("30");
  const [topMetric, setTopMetric] = useState<"enrollments" | "completions" | "completion_rate">("enrollments");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(
    async (selectedDays: string, isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        const res = await adminApi.getBiAnalytics(selectedDays);
        setData(res);
      } catch (err) {
        console.error("Failed to load BI analytics", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData(days);
  }, [days, fetchData]);

  const handleExportCSV = () => {
    if (!data) return;

    let csv = `Pathly Platform Analytics - ${days} Days Report\n`;
    csv += `Exported At,${new Date().toISOString()}\n\n`;

    csv += `KEY PERFORMANCE INDICATORS\n`;
    csv += `Total Users,${data.kpis.total_users}\n`;
    csv += `New Registrations,${data.kpis.new_registrations}\n`;
    csv += `Total Courses,${data.kpis.total_courses}\n`;
    csv += `Total Enrollments,${data.kpis.total_enrollments}\n`;
    csv += `Completion Rate,${data.kpis.completion_rate}%\n`;
    csv += `Total Mentors,${data.kpis.total_mentors}\n`;
    csv += `Mentor Bookings,${data.kpis.mentor_bookings}\n\n`;

    csv += `USER REGISTRATION GROWTH\nDate,New Registrations,Cumulative Users\n`;
    data.user_registration_growth.forEach((row) => {
      csv += `"${row.date}",${row.registrations},${row.cumulative}\n`;
    });
    csv += `\n`;

    csv += `COURSES BY CATEGORY\nCategory,Count\n`;
    data.courses_by_category.forEach((row) => {
      csv += `"${row.category}",${row.count}\n`;
    });
    csv += `\n`;

    csv += `COURSES BY DIFFICULTY\nDifficulty,Count,Percentage\n`;
    data.courses_by_difficulty.forEach((row) => {
      csv += `"${row.name}",${row.value},${row.percentage}%\n`;
    });
    csv += `\n`;

    csv += `TOP PERFORMING COURSES\nCourse Title,Enrollments,Completions,Completion Rate\n`;
    data.top_performing_courses.forEach((row) => {
      csv += `"${row.title.replace(/"/g, '""')}",${row.enrollments},${row.completions},${row.completion_rate}%\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `pathly-analytics-${days}d-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted) {
    return <div className="min-h-[400px] flex items-center justify-center text-slate-400">Loading analytics engine...</div>;
  }

  return (
    <div className="space-y-8">
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Analytics</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live MongoDB
            </span>
          </div>
          <p className="mt-1 text-[13px] text-slate-500">
            Real-time insights into learners, courses, and mentorship
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date range filter pills */}
          <div className="inline-flex items-center rounded-xl bg-white/80 p-1 ring-1 ring-slate-900/10 backdrop-blur shadow-sm">
            {[
              { id: "7", label: "7 Days" },
              { id: "30", label: "30 Days" },
              { id: "90", label: "90 Days" },
              { id: "365", label: "This Year" },
              { id: "all", label: "All Time" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDays(f.id)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[12px] font-medium transition",
                  days === f.id
                    ? "bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <button
            onClick={() => fetchData(days, true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl bg-white/80 ring-1 ring-slate-900/10 text-slate-700 text-[12px] font-medium backdrop-blur transition hover:bg-white active:scale-95 shadow-sm disabled:opacity-50"
            title="Refresh analytics data"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin text-[#8B5CF6]")} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            disabled={!data || loading}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl bg-white/80 ring-1 ring-slate-900/10 text-slate-700 text-[12px] font-medium backdrop-blur transition hover:bg-white active:scale-95 shadow-sm disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. UNIFIED KPI STRIP */}
      <div className="overflow-hidden rounded-2xl border border-slate-900/[0.08] bg-white/80 shadow-sm backdrop-blur-md">
        <div className="grid grid-cols-2 divide-y divide-slate-900/[0.06] sm:grid-cols-4 sm:divide-y-0 lg:grid-cols-7 lg:divide-x lg:divide-slate-900/[0.06]">
          {[
            {
              label: "Total Users",
              val: data?.kpis.total_users ?? "—",
              icon: Users,
              tone: "text-slate-900",
            },
            {
              label: "New Registrations",
              val: data?.kpis.new_registrations ?? "—",
              sub: `In last ${days === "all" ? "period" : days + "d"}`,
              icon: TrendingUp,
              tone: "text-[#8B5CF6]",
            },
            {
              label: "Total Courses",
              val: data?.kpis.total_courses ?? "—",
              icon: BookOpen,
              tone: "text-slate-900",
            },
            {
              label: "Total Enrollments",
              val: data?.kpis.total_enrollments ?? "—",
              icon: GraduationCap,
              tone: "text-[#6366F1]",
            },
            {
              label: "Completion Rate",
              val: data?.kpis ? `${data.kpis.completion_rate}%` : "—",
              icon: Award,
              tone: "text-emerald-600",
            },
            {
              label: "Total Mentors",
              val: data?.kpis.total_mentors ?? "—",
              icon: Sparkles,
              tone: "text-slate-900",
            },
            {
              label: "Mentor Bookings",
              val: data?.kpis.mentor_bookings ?? "—",
              icon: Calendar,
              tone: "text-[#EC4899]",
            },
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="p-4 transition hover:bg-slate-50/50">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {kpi.label}
                  </span>
                  <Icon className="h-4 w-4 opacity-70" />
                </div>
                <div className={cn("mt-2 text-2xl font-bold tracking-tight font-mono", kpi.tone)}>
                  {kpi.val}
                </div>
                {kpi.sub && (
                  <div className="mt-0.5 text-[10.5px] font-medium text-slate-400">{kpi.sub}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {loading && !data ? (
        <div className="py-24 text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[#8B5CF6]" />
          <p className="mt-3 text-sm text-slate-500 font-medium">Crunching MongoDB platform metrics...</p>
        </div>
      ) : (
        <>
          {/* ROW 1: USER REGISTRATION GROWTH & COURSES BY CATEGORY */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* CHART 1: USER REGISTRATION GROWTH */}
            <div className="rounded-2xl border border-slate-900/[0.08] bg-white/80 p-5 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-900">
                    User Registration Growth
                  </h3>
                  <p className="text-[12px] text-slate-500">
                    Daily registrations & cumulative user trajectories
                  </p>
                </div>
                <span className="rounded-full bg-[#8B5CF6]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#8B5CF6]">
                  {data?.user_registration_growth.length || 0} intervals
                </span>
              </div>

              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data?.user_registration_growth || []}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="regGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="regDailyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#64748B", fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: "#CBD5E1" }}
                    />
                    <YAxis
                      tick={{ fill: "#64748B", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulative"
                      name="Cumulative Users"
                      stroke="#8B5CF6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#regGrowthGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="registrations"
                      name="New In Period"
                      stroke="#6366F1"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#regDailyGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 2: COURSES BY CATEGORY */}
            <div className="rounded-2xl border border-slate-900/[0.08] bg-white/80 p-5 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-900">
                    Courses by Category
                  </h3>
                  <p className="text-[12px] text-slate-500">
                    Distribution of published catalog across domain pillars
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                  {data?.courses_by_category.length || 0} Categories
                </span>
              </div>

              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={data?.courses_by_category || []}
                    margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis
                      type="number"
                      tick={{ fill: "#64748B", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      dataKey="category"
                      type="category"
                      tick={{ fill: "#334155", fontSize: 11, fontWeight: 500 }}
                      tickLine={false}
                      axisLine={{ stroke: "#CBD5E1" }}
                      width={105}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      name="Course Count"
                      fill="#8B5CF6"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ROW 2: DIFFICULTY DONUT & ENROLLMENT TRENDS */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* CHART 3: COURSES BY DIFFICULTY */}
            <div className="rounded-2xl border border-slate-900/[0.08] bg-white/80 p-5 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-900">
                    Courses by Difficulty
                  </h3>
                  <p className="text-[12px] text-slate-500">Skill level progression breakdown</p>
                </div>
              </div>

              <div className="mt-4 flex h-60 items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.courses_by_difficulty || []}
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                    >
                      {data?.courses_by_difficulty.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={DIFFICULTY_COLORS[entry.name] || COLORS.indigo}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 flex justify-center gap-4 border-t border-slate-900/[0.06] pt-3 text-[11.5px]">
                {data?.courses_by_difficulty.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: DIFFICULTY_COLORS[item.name] || COLORS.indigo }}
                    />
                    <span className="text-slate-600 font-medium">{item.name}:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {item.value} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CHART 4: COURSE ENROLLMENT TRENDS */}
            <div className="rounded-2xl border border-slate-900/[0.08] bg-white/80 p-5 shadow-sm backdrop-blur-md lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-900">
                    Course Enrollment Trends
                  </h3>
                  <p className="text-[12px] text-slate-500">
                    Learner enrollments over selected window
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#6366F1]">
                  Total: {data?.kpis.total_enrollments} enrollments
                </span>
              </div>

              <div className="mt-6 h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data?.course_enrollment_trends || []}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#64748B", fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: "#CBD5E1" }}
                    />
                    <YAxis
                      tick={{ fill: "#64748B", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="enrollments"
                      name="Enrollments"
                      fill="#6366F1"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ROW 3: ENROLLMENT STATUS DONUT & TOP PERFORMING COURSES */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* CHART 5: ENROLLMENT STATUS DISTRIBUTION */}
            <div className="rounded-2xl border border-slate-900/[0.08] bg-white/80 p-5 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-900">
                    Enrollment Status
                  </h3>
                  <p className="text-[12px] text-slate-500">Learner lifecycle progression</p>
                </div>
              </div>

              <div className="mt-4 flex h-60 items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.enrollment_status_distribution || []}
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                    >
                      {data?.enrollment_status_distribution.map((entry, index) => (
                        <Cell
                          key={`status-cell-${index}`}
                          fill={STATUS_COLORS[entry.name] || COLORS.purple}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 flex justify-center gap-3 border-t border-slate-900/[0.06] pt-3 text-[11px]">
                {data?.enrollment_status_distribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[item.name] || COLORS.purple }}
                    />
                    <span className="text-slate-600 font-medium">{item.name}:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {item.value} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CHART 6: TOP PERFORMING COURSES WITH METRIC SWITCHER */}
            <div className="rounded-2xl border border-slate-900/[0.08] bg-white/80 p-5 shadow-sm backdrop-blur-md lg:col-span-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-900">
                    Top Performing Courses
                  </h3>
                  <p className="text-[12px] text-slate-500">
                    Ranked by learner adoption and completion velocity
                  </p>
                </div>

                {/* Metric switcher buttons */}
                <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 text-[11px]">
                  {[
                    { id: "enrollments", label: "Enrollments" },
                    { id: "completions", label: "Completions" },
                    { id: "completion_rate", label: "Completion %" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setTopMetric(m.id as any)}
                      className={cn(
                        "rounded-md px-2 py-1 font-medium transition",
                        topMetric === m.id
                          ? "bg-white text-slate-900 shadow-sm font-semibold"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={data?.top_performing_courses || []}
                    margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis
                      type="number"
                      tick={{ fill: "#64748B", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      dataKey="title"
                      type="category"
                      tick={{ fill: "#334155", fontSize: 10.5, fontWeight: 500 }}
                      tickLine={false}
                      axisLine={{ stroke: "#CBD5E1" }}
                      width={125}
                      tickFormatter={(val) => (val.length > 20 ? `${val.substring(0, 18)}…` : val)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey={topMetric}
                      name={
                        topMetric === "enrollments"
                          ? "Total Enrolled"
                          : topMetric === "completions"
                          ? "Completed"
                          : "Completion Rate (%)"
                      }
                      fill={topMetric === "completion_rate" ? "#10B981" : "#8B5CF6"}
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ROW 4: MENTORSHIP ANALYTICS & LEARNER ENGAGEMENT */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* CHART 7: MENTORSHIP ANALYTICS */}
            <div className="rounded-2xl border border-slate-900/[0.08] bg-white/80 p-5 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-900">
                    Mentorship Sessions
                  </h3>
                  <p className="text-[12px] text-slate-500">
                    Booking status distribution and fulfillment
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                  {data?.kpis.mentor_bookings || 0} Total Bookings
                </span>
              </div>

              <div className="mt-6 h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data?.mentorship_analytics || []}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="status"
                      tick={{ fill: "#64748B", fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: "#CBD5E1" }}
                    />
                    <YAxis
                      tick={{ fill: "#64748B", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Sessions" radius={[6, 6, 0, 0]}>
                      {data?.mentorship_analytics.map((entry, index) => (
                        <Cell
                          key={`cell-m-${index}`}
                          fill={BOOKING_COLORS[entry.status] || COLORS.indigo}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 8: LEARNER ENGAGEMENT */}
            <div className="rounded-2xl border border-slate-900/[0.08] bg-white/80 p-5 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-900">
                    Learner Engagement
                  </h3>
                  <p className="text-[12px] text-slate-500">
                    Active learners interacting with coursework over time
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  Daily Activity
                </span>
              </div>

              {data && data.learner_engagement.some((l) => l.active_learners > 0) ? (
                <div className="mt-6 h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.learner_engagement}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#64748B", fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: "#CBD5E1" }}
                      />
                      <YAxis
                        tick={{ fill: "#64748B", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="active_learners"
                        name="Active Learners"
                        stroke="#8B5CF6"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#8B5CF6" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-6 flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                  <Activity className="h-8 w-8 text-slate-300" />
                  <div className="mt-2 text-sm font-semibold text-slate-700">
                    No active learner sessions in this timeframe
                  </div>
                  <div className="mt-1 text-xs text-slate-400 max-w-xs">
                    As students interact with lessons and quizzes in MongoDB, real-time activity trends will chart here.
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

