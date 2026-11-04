"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mic,
  Send,
  Clock,
  CheckCircle2,
  MessageSquare,
  Star,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface MockInterviewScreenProps {
  onBack?: () => void;
  onNavigateToLearn?: () => void;
  onNavigateToDebrief?: () => void;
}

type InterviewState = "intro" | "in-progress" | "feedback";

const INTERVIEW_QUESTIONS = [
  "Tell me about yourself and your background in frontend development.",
  "Explain the difference between state and props in React.",
  "How do you handle performance optimization in a web application?",
  "Describe a challenging project you've worked on and how you overcame obstacles.",
  "Where do you see yourself in your career in the next 3 years?",
];

const FEEDBACK_DATA = [
  {
    category: "Technical Knowledge",
    score: 78,
    feedback: "Good understanding of React fundamentals. Consider deepening knowledge in state management patterns and performance optimization.",
    color: "#635BFF",
  },
  {
    category: "Communication",
    score: 85,
    feedback: "Clear and structured responses. Try using the STAR method more consistently for behavioral questions.",
    color: "#22C55E",
  },
  {
    category: "Confidence",
    score: 72,
    feedback: "Good overall. Practice answering without filler words and pausing briefly before responding to show thoughtfulness.",
    color: "#F59E0B",
  },
];

export function MockInterviewScreen({
  onBack,
  onNavigateToLearn,
  onNavigateToDebrief,
}: MockInterviewScreenProps) {
  const [state, setState] = useState<InterviewState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submittedAnswers, setSubmittedAnswers] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const totalQuestions = INTERVIEW_QUESTIONS.length;

  // Timer
  useEffect(() => {
    if (state !== "in-progress") return;
    const timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [state]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;
    setSubmittedAnswers((prev) => [...prev, answer.trim()]);
    setAnswer("");

    setCurrentQuestion((prev) => {
      if (prev < totalQuestions - 1) {
        return prev + 1;
      } else {
        setState("feedback");
        return prev;
      }
    });
  };

  // Intro
  if (state === "intro") {
    return (
      <div className="min-h-full w-full bg-[#FAF9FF] flex flex-col">
        <div className="bg-white border-b border-[#E8E5F2] px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button type="button" onClick={onBack} className="p-1.5 rounded-full hover:bg-slate-100 text-[#667085] transition-colors">
                <ArrowLeft className="w-5 h-5 stroke-[1.8]" />
              </button>
            )}
            <h1 className="text-[17px] font-bold text-[#172033]">Mock Interview</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-[#8B5CF6] to-[#635BFF] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/25"
          >
            <MessageSquare className="w-10 h-10 text-white" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-[22px] font-bold text-[#172033]">Frontend Developer Interview</h2>
            <p className="text-[13px] text-[#667085] max-w-sm leading-relaxed">
              Practice with AI-powered questions. Get feedback on your answers, communication, and areas to improve.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[12px] text-[#667085]">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#8B5CF6]" />
              <span>{totalQuestions} questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8B5CF6]" />
              <span>~15 minutes</span>
            </div>
          </div>

          <div className="w-full max-w-xs space-y-2.5">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setState("in-progress")}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#635BFF] rounded-[14px] shadow-lg shadow-[#8B5CF6]/25 font-bold"
            >
              Start Interview
            </Button>
            {onNavigateToDebrief && (
              <button
                type="button"
                onClick={onNavigateToDebrief}
                className="w-full py-2.5 px-3 rounded-[12px] bg-[#F1EFFF] border border-[#E0DAFC] text-[12px] font-semibold text-[#635BFF] hover:bg-[#EAE6FF] transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#635BFF]" />
                <span>Attended Real Interview? Debrief Outcome</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Feedback
  if (state === "feedback") {
    const overallScore = Math.round(FEEDBACK_DATA.reduce((acc, f) => acc + f.score, 0) / FEEDBACK_DATA.length);
    return (
      <div className="min-h-full w-full bg-[#FAF9FF] flex flex-col">
        <div className="bg-white border-b border-[#E8E5F2] px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button type="button" onClick={onBack} className="p-1.5 rounded-full hover:bg-slate-100 text-[#667085] transition-colors">
                <ArrowLeft className="w-5 h-5 stroke-[1.8]" />
              </button>
            )}
            <h1 className="text-[17px] font-bold text-[#172033]">Interview Feedback</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5 space-y-5">
          {/* Overall Score */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#8B5CF6] via-[#635BFF] to-[#4338CA] rounded-[18px] p-6 text-white text-center"
          >
            <p className="text-[12px] text-white/70 mb-2">Overall Performance</p>
            <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-2">
              <span className="text-[28px] font-bold">{overallScore}%</span>
            </div>
            <p className="text-[12px] text-white/60">
              Completed in {formatTime(elapsedSeconds)}
            </p>
          </motion.div>

          {/* Category Feedback */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-[#172033]">Detailed Feedback</h3>
            {FEEDBACK_DATA.map((item) => (
              <div key={item.category} className="bg-white rounded-[14px] border border-[#E8E5F2] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#172033]">{item.category}</span>
                  <span className="text-[12px] font-bold" style={{ color: item.color }}>{item.score}%</span>
                </div>
                <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                </div>
                <p className="text-[11.5px] text-[#667085] leading-relaxed">{item.feedback}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            {onNavigateToDebrief && (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={onNavigateToDebrief}
                className="bg-gradient-to-r from-[#22C995] to-[#10B981] text-white rounded-[14px] font-bold shadow-md shadow-[#22C995]/20"
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Debrief Real Interview with AI →
              </Button>
            )}
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={onNavigateToLearn}
              className="rounded-[14px] font-bold border-[#635BFF] text-[#635BFF] hover:bg-[#F1EFFF]"
              leftIcon={<BookOpen className="w-4 h-4" />}
            >
              Improve Weak Areas in Courses
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => {
                setState("intro");
                setCurrentQuestion(0);
                setSubmittedAnswers([]);
                setElapsedSeconds(0);
                setAnswer("");
              }}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Try Another Interview
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // In-Progress
  return (
    <div className="min-h-full w-full bg-[#FAF9FF] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E5F2] px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <button type="button" onClick={onBack} className="p-1.5 rounded-full hover:bg-slate-100 text-[#667085]">
            <ArrowLeft className="w-5 h-5 stroke-[1.8]" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-[#667085]">
              <Clock className="w-3.5 h-3.5 inline mr-1" />
              {formatTime(elapsedSeconds)}
            </span>
            <span className="text-[12px] font-bold text-[#635BFF]">
              {currentQuestion + 1}/{totalQuestions}
            </span>
          </div>
        </div>
        <div className="h-2 bg-[#E4E7EC] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#635BFF] rounded-full"
            animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-5 py-6 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2 mb-6"
          >
            <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>AI Interviewer</span>
            </div>
            <div className="bg-white rounded-[14px] border border-[#E8E5F2] p-4 shadow-sm">
              <p className="text-[14px] font-medium text-[#172033] leading-relaxed">
                {INTERVIEW_QUESTIONS[currentQuestion] || ""}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Answer Input */}
        <div className="flex-1 flex flex-col justify-end">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="w-full h-32 p-4 rounded-[14px] bg-white border border-[#E4E7EC] text-[13px] text-[#172033] placeholder:text-[#94A3B8] resize-none focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15 transition-all"
          />

          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-[#F1F5F9] border border-[#E4E7EC] flex items-center justify-center text-[#667085] hover:bg-slate-200 transition-colors"
            >
              <Mic className="w-4.5 h-4.5" />
            </button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmitAnswer}
              disabled={!answer.trim()}
              className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#635BFF] rounded-[14px] font-bold"
              rightIcon={<Send className="w-4 h-4" />}
            >
              Submit Answer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
