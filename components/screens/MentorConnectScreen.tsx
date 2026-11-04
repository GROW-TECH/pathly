"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Copy,
  ExternalLink,
  MessageSquare,
  UserCheck,
  Shield,
  Crown,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { mentorsApi, Mentor as MentorType, MentorshipBooking } from "@/lib/api/mentors";

interface MentorConnectScreenProps {
  onBack?: () => void;
  onNavigateToSubscription?: () => void;
}

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarBg: string;
  rating: number;
  sessionsCount: number;
  specialty: string[];
  meeting_link?: string;
  availability?: string[];
}

const FALLBACK_MENTORS: Mentor[] = [
  {
    id: "m1",
    name: "Karthik Raja",
    role: "Staff Frontend Engineer",
    company: "Google (Ex-Amazon)",
    avatarBg: "from-[#635BFF] to-[#8B5CF6]",
    rating: 4.9,
    sessionsCount: 142,
    specialty: ["React / Next.js", "System Design", "Mock Tech Interview"],
    meeting_link: "https://meet.google.com/pat-hly-pro",
  },
  {
    id: "m2",
    name: "Priya Sundaram",
    role: "Assistant Commissioner (TNPSC Rank 4)",
    company: "Govt of Tamil Nadu",
    avatarBg: "from-[#10B981] to-[#059669]",
    rating: 4.95,
    sessionsCount: 98,
    specialty: ["TNPSC Group 1/2", "General Studies", "Interview Board Prep"],
    meeting_link: "https://meet.google.com/pat-hly-pro",
  },
  {
    id: "m3",
    name: "Ananya Rao",
    role: "Lead UI/UX Engineer",
    company: "Swiggy",
    avatarBg: "from-[#F59E0B] to-[#D97706]",
    rating: 4.85,
    sessionsCount: 110,
    specialty: ["Portfolio Review", "Frontend Architecture", "Career Growth"],
    meeting_link: "https://meet.google.com/pat-hly-pro",
  },
];

const DEFAULT_TIME_SLOTS = ["10:00 AM", "02:30 PM", "05:00 PM", "07:30 PM", "09:00 PM"];
const DATES = [
  { label: "Today", date: "Oct 2" },
  { label: "Tomorrow", date: "Oct 3" },
  { label: "Sat", date: "Oct 4" },
  { label: "Sun", date: "Oct 5" },
];

export function MentorConnectScreen({
  onBack,
  onNavigateToSubscription,
}: MentorConnectScreenProps) {
  const [mentors, setMentors] = useState<Mentor[]>(FALLBACK_MENTORS);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMentor, setSelectedMentor] = useState<string>("m1");
  const [selectedDate, setSelectedDate] = useState<number>(1);
  const [selectedTime, setSelectedTime] = useState<string>("07:30 PM");
  const [meetingTopic, setMeetingTopic] = useState("Career Roadmap & Resume Review");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<MentorshipBooking | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadMentors() {
      try {
        const liveMentors = await mentorsApi.getActiveMentors();
        if (liveMentors && liveMentors.length > 0) {
          const mapped: Mentor[] = liveMentors.map((m) => ({
            id: m.id,
            name: m.name,
            role: m.role,
            company: m.company,
            avatarBg: m.avatarBg || "from-[#635BFF] to-[#8B5CF6]",
            rating: m.rating || 4.9,
            sessionsCount: m.sessionsCount || 0,
            specialty: m.specialty || m.skills || ["Mentorship"],
            meeting_link: m.meeting_link,
            availability: m.availability,
          }));
          setMentors(mapped);
          setSelectedMentor(mapped[0].id);
        }
      } catch (err) {
        console.warn("Could not load mentors from backend, using fallback list:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMentors();
  }, []);

  const activeMentorObj = mentors.find((m) => m.id === selectedMentor) || mentors[0] || FALLBACK_MENTORS[0];
  const timeSlots = activeMentorObj?.availability && activeMentorObj.availability.length > 0
    ? activeMentorObj.availability
    : DEFAULT_TIME_SLOTS;

  const meetUrl = bookingResult?.meeting_link || activeMentorObj?.meeting_link || "https://meet.google.com/pat-hly-pro";

  const handleBook = async () => {
    setBookingLoading(true);
    setBookingError(null);
    try {
      const dateStr = `${DATES[selectedDate].date} (${DATES[selectedDate].label})`;
      const result = await mentorsApi.bookSession(selectedMentor, {
        date: dateStr,
        time_slot: selectedTime,
        topic: meetingTopic,
      });
      setBookingResult(result);
      setIsBooked(true);
    } catch (err: any) {
      setBookingError(err.message || "Failed to book mentorship session. The slot may be taken.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(meetUrl);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="h-full w-full bg-[#FAF9FF] text-[#18152B] font-sans antialiased flex flex-col select-none relative overflow-hidden">
      <Header
        variant="back"
        title="1-on-1 Mentor Connect"
        onBackClick={onBack}
        rightElement={
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] text-white text-[10.5px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
            <Crown className="w-3 h-3" /> PRO ACCESS
          </span>
        }
      />

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4 space-y-4 max-w-lg mx-auto w-full">
        {!isBooked ? (
          <>
            {/* Header Value Prop */}
            <div className="p-3.5 rounded-[18px] bg-gradient-to-br from-[#172033] to-[#2B354F] text-white space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A5B4FC] uppercase tracking-wider">
                <Video className="w-3.5 h-3.5" />
                <span>Live Google Meet Sessions</span>
              </div>
              <h2 className="text-[16px] font-bold">Connect 1-on-1 with Senior Industry Mentors</h2>
              <p className="text-[11.5px] text-white/80 leading-relaxed">
                Get your code, portfolio, and interview strategy reviewed live by senior engineers and top-rank officers.
              </p>
            </div>

            {/* Mentor Selection */}
            <div className="space-y-2.5">
              <h3 className="text-[13px] font-bold text-[#172033] uppercase tracking-wider">
                Select Your Expert Mentor
              </h3>

              <div className="space-y-2">
                {mentors.map((mentor) => {
                  const isSelected = selectedMentor === mentor.id;
                  return (
                    <div
                      key={mentor.id}
                      onClick={() => setSelectedMentor(mentor.id)}
                      className={cn(
                        "p-3.5 rounded-[16px] border transition-all cursor-pointer space-y-2",
                        isSelected
                          ? "bg-white border-[#635BFF] shadow-sm ring-2 ring-[#635BFF]/15"
                          : "bg-white border-[#E8E5F2] hover:border-[#635BFF]/40 shadow-2xs"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-11 h-11 rounded-[14px] bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shadow-xs",
                              mentor.avatarBg
                            )}
                          >
                            {mentor.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-[13.5px] font-bold text-[#172033]">
                                {mentor.name}
                              </h4>
                              <UserCheck className="w-3.5 h-3.5 text-[#22C995]" />
                            </div>
                            <p className="text-[11px] text-[#635BFF] font-semibold">
                              {mentor.role}
                            </p>
                            <p className="text-[10.5px] text-[#667085]">{mentor.company}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#F59E0B] bg-[#FFFBEB] px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{mentor.rating}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1 border-t border-[#F1F3F9]">
                        {mentor.specialty.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-md"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="p-4 rounded-[18px] bg-white border border-[#E8E5F2] shadow-2xs space-y-3">
              <h3 className="text-[13px] font-bold text-[#172033] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#635BFF]" />
                <span>Choose Schedule Date & Time</span>
              </h3>

              {/* Date Pills */}
              <div className="grid grid-cols-4 gap-1.5">
                {DATES.map((d, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDate(idx)}
                    className={cn(
                      "p-2 rounded-[12px] border text-center transition-all",
                      selectedDate === idx
                        ? "bg-[#635BFF] text-white border-[#635BFF] shadow-xs"
                        : "bg-[#F8FAFC] text-[#172033] border-[#E8E5F2] hover:border-[#635BFF]/30"
                    )}
                  >
                    <div className="text-[10px] uppercase font-bold opacity-80">{d.label}</div>
                    <div className="text-[12px] font-extrabold mt-0.5">{d.date}</div>
                  </button>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-[#667085] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Available Google Meet Slots</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {timeSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={cn(
                        "p-2 rounded-[10px] border text-center text-[11.5px] font-semibold transition-all",
                        selectedTime === slot
                          ? "bg-[#F1EFFF] text-[#635BFF] border-[#635BFF] font-bold"
                          : "bg-white text-[#475569] border-[#E8E5F2] hover:border-[#635BFF]/30"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-[#667085]">
                  What would you like to focus on?
                </label>
                <input
                  type="text"
                  value={meetingTopic}
                  onChange={(e) => setMeetingTopic(e.target.value)}
                  className="w-full h-9 px-3 rounded-[10px] bg-[#F8FAFC] border border-[#E8E5F2] text-[12px] text-[#172033] outline-none focus:border-[#635BFF]"
                />
              </div>

              {/* Booking Conflict / Error Banner */}
              {bookingError && (
                <div className="p-3 rounded-[12px] bg-red-50 border border-red-200 text-red-700 text-[11.5px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{bookingError}</span>
                </div>
              )}
            </div>

            {/* Book CTA */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={bookingLoading}
                onClick={handleBook}
                className="h-[48px] rounded-[14px] text-[14px] font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] shadow-md shadow-[#635BFF]/25 disabled:opacity-60"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Booking Session...</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    <span>Confirm & Generate Google Meet Link →</span>
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          /* Confirmation State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-[22px] bg-white border border-[#E8E5F2] shadow-md space-y-4 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#22C995] mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-[18px] font-bold text-[#172033]">
                1-on-1 Session Confirmed! 🎉
              </h2>
              <p className="text-[12px] text-[#667085]">
                Your Google Meet mentorship session with{" "}
                <span className="font-bold text-[#172033]">{activeMentorObj.name}</span> is scheduled.
              </p>
            </div>

            {/* Schedule Details Card */}
            <div className="p-3.5 rounded-[14px] bg-[#F8FAFF] border border-[#E8E5F2] text-left space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-[#667085]">Date & Time:</span>
                <span className="font-bold text-[#172033]">
                  {DATES[selectedDate].date} ({DATES[selectedDate].label}) · {selectedTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#667085]">Topic:</span>
                <span className="font-bold text-[#635BFF] truncate max-w-[200px]">{meetingTopic}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#667085]">Platform:</span>
                <span className="font-bold text-[#15803D] flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" /> Google Meet Video Call
                </span>
              </div>
            </div>

            {/* Google Meet Link Card */}
            <div className="p-3 rounded-[12px] bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Video className="w-4 h-4 text-[#635BFF] shrink-0" />
                <span className="text-[12px] font-bold text-[#635BFF] truncate">{meetUrl}</span>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded-md bg-white text-[#635BFF] text-[11px] font-bold hover:bg-[#F1EFFF] shadow-2xs border border-[#C7D2FE] flex items-center gap-1 shrink-0 ml-2"
              >
                {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-[#22C995]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Copied" : "Copy Link"}</span>
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 rounded-[14px] bg-[#635BFF] text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#5349E8] shadow-md shadow-[#635BFF]/25"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Join Google Meet Room Now</span>
              </a>

              <button
                type="button"
                onClick={onBack}
                className="w-full h-10 rounded-[14px] bg-[#F1EFFF] text-[#635BFF] text-[12px] font-bold hover:bg-[#EAE6FF] transition-all"
              >
                Back to Learning Hub
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
