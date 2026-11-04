"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Briefcase,
  Target,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SkillAssessmentScreenProps {
  onBack?: () => void;
  onComplete?: () => void;
  onNavigateToLearn?: () => void;
  onNavigateToJobs?: () => void;
}

type AssessmentState = "intro" | "in-progress" | "results";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: "q1",
    question: "What does JSX stand for in React?",
    options: ["JavaScript XML", "Java Syntax Extension", "JSON XML Syntax", "JavaScript eXtension"],
    correctIndex: 0,
  },
  {
    id: "q2",
    question: "Which hook is used for side effects in React?",
    options: ["useState", "useEffect", "useMemo", "useContext"],
    correctIndex: 1,
  },
  {
    id: "q3",
    question: "What is the purpose of TypeScript?",
    options: ["Runtime compilation", "Static type checking", "Database management", "Server deployment"],
    correctIndex: 1,
  },
  {
    id: "q4",
    question: "What CSS property creates a flexible layout?",
    options: ["position", "display: flex", "float", "z-index"],
    correctIndex: 1,
  },
  {
    id: "q5",
    question: "What does API stand for?",
    options: ["Application Program Interface", "Application Protocol Integration", "Advanced Programming Interface", "Application Protocol Interface"],
    correctIndex: 0,
  },
];

export function SkillAssessmentScreen({
  onBack,
  onComplete,
  onNavigateToLearn,
  onNavigateToJobs,
}: SkillAssessmentScreenProps) {
  const [state, setState] = useState<AssessmentState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const question = ASSESSMENT_QUESTIONS[currentQuestion];

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state === "in-progress" && currentQuestion >= totalQuestions) {
      setState("results");
    }
  }, [state, currentQuestion, totalQuestions]);

  const handleSelectAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null || showFeedback) return;

    setShowFeedback(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setAnswers((prev) => {
        const next = [...prev];
        next[currentQuestion] = selectedAnswer;
        return next;
      });
      setShowFeedback(false);
      setSelectedAnswer(null);

      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setState("results");
      }
    }, 800);
  };

  const correctCount = answers.filter(
    (a, i) => a === ASSESSMENT_QUESTIONS[i]?.correctIndex
  ).length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  // Intro Screen
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
            <h1 className="text-[17px] font-bold text-[#172033]">Skill Assessment</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-[#635BFF] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#635BFF]/25"
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-[22px] font-bold text-[#172033]">Frontend Skills Assessment</h2>
            <p className="text-[13px] text-[#667085] max-w-sm leading-relaxed">
              Test your knowledge in React, JavaScript, TypeScript, and web fundamentals. This assessment helps identify your strengths and areas for improvement.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[12px] text-[#667085]">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#635BFF]" />
              <span>{totalQuestions} questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#635BFF]" />
              <span>~5 minutes</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setState("in-progress")}
            className="w-full max-w-xs bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] rounded-[14px] shadow-lg shadow-[#635BFF]/25 font-bold"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Assessment
          </Button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (state === "results") {
    const strengths = ["React Fundamentals", "CSS Layouts", "API Concepts"];
    const gaps = ["TypeScript Advanced", "State Management", "Testing"];
    return (
      <div className="min-h-full w-full bg-[#FAF9FF] flex flex-col">
        <div className="bg-white border-b border-[#E8E5F2] px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button type="button" onClick={onBack} className="p-1.5 rounded-full hover:bg-slate-100 text-[#667085] transition-colors">
                <ArrowLeft className="w-5 h-5 stroke-[1.8]" />
              </button>
            )}
            <h1 className="text-[17px] font-bold text-[#172033]">Assessment Results</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5 space-y-5">
          {/* Score Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#4338CA] via-[#635BFF] to-[#8B5CF6] rounded-[18px] p-6 text-white text-center"
          >
            <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
              <span className="text-[28px] font-bold">{scorePercent}%</span>
            </div>
            <h3 className="text-[18px] font-bold">
              {scorePercent >= 80 ? "Excellent!" : scorePercent >= 60 ? "Good Job!" : "Keep Learning!"}
            </h3>
            <p className="text-[12px] text-white/70 mt-1">
              {correctCount} out of {totalQuestions} correct
            </p>
          </motion.div>

          {/* Strengths */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-[#172033]">💪 Strengths</h3>
            <div className="space-y-2">
              {strengths.map((s) => (
                <div key={s} className="flex items-center gap-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[10px] px-3 py-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <span className="text-[12.5px] font-medium text-[#15803D]">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gaps */}
          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-[#172033]">📈 Areas to Improve</h3>
            <div className="space-y-2">
              {gaps.map((g) => (
                <div key={g} className="flex items-center gap-2.5 bg-[#FEF3C7] border border-[#FDE68A] rounded-[10px] px-3 py-2.5">
                  <Target className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span className="text-[12.5px] font-medium text-[#92400E]">{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                if (onComplete) onComplete();
                else if (onNavigateToLearn) onNavigateToLearn();
              }}
              className="bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] rounded-[14px] font-bold"
              leftIcon={<BookOpen className="w-4 h-4" />}
            >
              Analyze Skill Gaps & Roadmap →
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => {
                if (onNavigateToJobs) onNavigateToJobs();
                else if (onComplete) onComplete();
              }}
              leftIcon={<Briefcase className="w-4 h-4" />}
            >
              Continue to Dashboard
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => {
                setState("intro");
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setAnswers([]);
                setShowFeedback(false);
              }}
              className="text-[#667085] hover:text-[#172033]"
            >
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Guard against out of bounds or missing question
  if (!question || currentQuestion >= totalQuestions) {
    return null;
  }

  // In-Progress: Question Screen
  return (
    <div className="min-h-full w-full bg-[#FAF9FF] flex flex-col">
      <div className="bg-white border-b border-[#E8E5F2] px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => {
              if (showFeedback) return;
              if (currentQuestion > 0) {
                setCurrentQuestion((prev) => prev - 1);
                setSelectedAnswer(answers[currentQuestion - 1] ?? null);
              } else if (onBack) {
                onBack();
              } else {
                setState("intro");
              }
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#667085] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 stroke-[1.8]" />
          </button>
          <span className="text-[12px] font-bold text-[#635BFF]">
            {Math.min(currentQuestion + 1, totalQuestions)} / {totalQuestions}
          </span>
        </div>
        <div className="h-2 bg-[#E4E7EC] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] rounded-full"
            animate={{ width: `${(Math.min(currentQuestion + 1, totalQuestions) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="flex-1 px-5 py-6 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={question?.id ?? `q-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-[17px] font-bold text-[#172033] leading-snug mb-6">
              {question?.question}
            </h2>

            <div className="space-y-3 flex-1">
              {question?.options?.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = showFeedback && idx === question?.correctIndex;
                const isWrong = showFeedback && isSelected && idx !== question?.correctIndex;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAnswer(idx)}
                    className={cn(
                      "w-full text-left rounded-[14px] border p-4 transition-all active:scale-[0.99]",
                      isCorrect
                        ? "bg-[#F0FDF4] border-[#22C55E] text-[#15803D]"
                        : isWrong
                        ? "bg-[#FEF2F2] border-[#EF4444] text-[#DC2626]"
                        : isSelected
                        ? "bg-[#EEF2FF] border-[#635BFF] text-[#4338CA]"
                        : "bg-white border-[#E8E5F2] text-[#172033] hover:border-[#C7D2FE]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 border",
                          isCorrect
                            ? "bg-[#22C55E] text-white border-[#22C55E]"
                            : isWrong
                            ? "bg-[#EF4444] text-white border-[#EF4444]"
                            : isSelected
                            ? "bg-[#635BFF] text-white border-[#635BFF]"
                            : "bg-[#F8FAFC] text-[#667085] border-[#E4E7EC]"
                        )}
                      >
                        {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-[13px] font-medium">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next Button */}
        <div className="pt-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNext}
            disabled={selectedAnswer === null || showFeedback}
            className="bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] rounded-[14px] font-bold"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {showFeedback
              ? "Checking..."
              : currentQuestion === totalQuestions - 1
              ? "See Results"
              : "Next Question"}
          </Button>
        </div>
      </div>
    </div>
  );
}
