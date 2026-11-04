"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowUp,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  AlertCircle,
  ArrowLeft,
  Plus,
  History,
  Trash2,
  X,
  BookOpen,
  Code2,
  Briefcase,
  FileText,
  GraduationCap,
  MessageSquare,
  Compass,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  aiApi,
  ChatMessage as ApiChatMessage,
  ConversationSummary,
  CourseRecommendation,
} from "@/lib/api/ai";
import { CourseRecommendationCard } from "@/components/ai/CourseRecommendationCard";
import { SafeMarkdown } from "@/components/ai/SafeMarkdown";

interface AiCoachScreenProps {
  onBack?: () => void;
  onSelectCourse?: (courseId: string) => void;
}

interface UiChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
  courseRecommendations?: CourseRecommendation[];
  feedback?: "up" | "down" | null;
}

const SUGGESTED_PROMPTS = [
  { text: "What are the best skills for a frontend developer?", icon: Code2 },
  { text: "Why am I not getting interviews?", icon: Briefcase },
  { text: "Improve my resume", icon: FileText },
  { text: "What should I learn next?", icon: GraduationCap },
  { text: "Help me prepare for interviews", icon: MessageSquare },
  { text: "Suggest career paths for me", icon: Compass },
];

const WELCOME_MESSAGE: UiChatMessage = {
  id: "welcome",
  sender: "ai",
  text: "Hello! 👋 I'm your Pathly AI Career Assistant. I can help you with personalized career guidance, skill gap analysis, interview preparation, and real course recommendations.\n\nWhat would you like to explore today?",
  timestamp: new Date(),
};

const isWelcomeId = (id: string) => id === "welcome" || id.startsWith("welcome-");

export function AiCoachScreen({ onBack, onSelectCourse }: AiCoachScreenProps) {
  const [messages, setMessages] = useState<UiChatMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages or typing state change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-grow textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [inputValue]);

  // Load previous conversations list on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const convs = await aiApi.listConversations();
      setConversations(convs);
      // Automatically load the latest conversation if available
      if (convs.length > 0 && !activeConversationId) {
        selectConversation(convs[0].id);
      }
    } catch (err: any) {
      console.warn("Could not fetch conversation history:", err);
    }
  };

  const selectConversation = async (convId: string) => {
    setIsLoadingHistory(true);
    setErrorMessage(null);
    try {
      const detail = await aiApi.getConversation(convId);
      setActiveConversationId(convId);
      const mapped: UiChatMessage[] = detail.messages.map((m) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: new Date(m.created_at),
        courseRecommendations: m.course_recommendations,
        feedback: m.feedback,
      }));
      setMessages(mapped.length > 0 ? mapped : [WELCOME_MESSAGE]);
      setShowHistory(false);
    } catch (err: any) {
      console.error("Failed to load conversation details:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const startNewConversation = () => {
    setActiveConversationId(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "ai",
        text: "Started a fresh conversation! 🚀 How can I help advance your career today?",
        timestamp: new Date(),
      },
    ]);
    setErrorMessage(null);
    setShowHistory(false);
  };

  const handleDeleteConversation = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    try {
      await aiApi.deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConversationId === convId) {
        startNewConversation();
      }
    } catch (err: any) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    setErrorMessage(null);

    const userMsg: UiChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const resp = await aiApi.sendMessage(text, activeConversationId);
      setActiveConversationId(resp.conversation_id);

      const aiMsg: UiChatMessage = {
        id: resp.message.id,
        sender: "ai",
        text: resp.message.text,
        timestamp: new Date(resp.message.created_at),
        courseRecommendations: resp.message.course_recommendations,
        feedback: resp.message.feedback,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Refresh conversations list in background
      aiApi.listConversations().then(setConversations).catch(() => {});
    } catch (err: any) {
      console.error("AI error:", err);
      const detail = err?.detail || err?.message || "Failed to communicate with AI Assistant.";
      setErrorMessage(detail);

      const errorMsg: UiChatMessage = {
        id: `error-${Date.now()}`,
        sender: "ai",
        text: `⚠️ ${detail}\n\nPlease check your configuration in \`backend/.env\` and try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = async (messageId: string, type: "up" | "down") => {
    const currentMsg = messages.find((m) => m.id === messageId);
    const newFeedback = currentMsg?.feedback === type ? null : type;

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback: newFeedback } : m))
    );

    try {
      await aiApi.submitFeedback(messageId, newFeedback);
    } catch (err) {
      console.warn("Could not save feedback:", err);
    }
  };

  const handleCopy = async (messageId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId((cur) => (cur === messageId ? null : cur)), 1500);
    } catch (err) {
      console.warn("Could not copy:", err);
    }
  };

  const isEmptyState = messages.length <= 1 && !!messages[0] && isWelcomeId(messages[0].id);

  const iconBtn =
    "rounded-lg p-1.5 text-[#A3A3A3] transition-colors hover:bg-[#F4F4F5] hover:text-[#525252] active:scale-90";

  return (
    <div className="relative flex min-h-full w-full flex-col overflow-x-hidden bg-white">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-[#EDEDED] bg-white/90 px-3 py-2.5 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="rounded-full p-2 text-[#525252] transition-colors hover:bg-[#F4F4F5]"
                title="Back"
              >
                <ArrowLeft className="h-5 w-5 stroke-[1.8]" />
              </button>
            )}
            <div className="flex items-center gap-2 pl-1">
              <Sparkles className="h-[18px] w-[18px] text-[#635BFF]" />
              <h1 className="truncate text-[14px] font-semibold text-[#171717]">
                AI Career Assistant
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={startNewConversation}
              className="rounded-full p-2 text-[#525252] transition-colors hover:bg-[#F4F4F5] active:scale-90"
              title="New chat"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              className={cn(
                "rounded-full p-2 transition-colors active:scale-90",
                showHistory ? "bg-[#F4F4F5] text-[#171717]" : "text-[#525252] hover:bg-[#F4F4F5]"
              )}
              title="Chat history"
            >
              <History className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* History drawer */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="pb-1 pt-3">
                <div className="flex items-center justify-between px-2 pb-1.5">
                  <span className="text-[12px] font-medium text-[#737373]">Recent chats</span>
                  <button
                    type="button"
                    onClick={() => setShowHistory(false)}
                    className="rounded-full p-1 text-[#A3A3A3] hover:bg-[#F4F4F5] hover:text-[#525252]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {conversations.length === 0 ? (
                  <p className="px-2 py-3 text-[12.5px] text-[#A3A3A3]">
                    No previous conversations yet.
                  </p>
                ) : (
                  <div className="no-scrollbar max-h-56 space-y-0.5 overflow-y-auto">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => selectConversation(conv.id)}
                        className={cn(
                          "group flex cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[13px] transition-colors",
                          activeConversationId === conv.id
                            ? "bg-[#F4F4F5] font-medium text-[#171717]"
                            : "text-[#404040] hover:bg-[#F7F7F8]"
                        )}
                      >
                        <span className="flex-1 truncate">{conv.title}</span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteConversation(e, conv.id)}
                          className="rounded-lg p-1 text-[#A3A3A3] transition-colors hover:bg-red-50 hover:text-[#EF4444]"
                          title="Delete chat"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-4 mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="flex-1">
              <span className="block font-semibold">Assistant Configuration Notice</span>
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="rounded-full p-0.5 text-amber-600 hover:bg-amber-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat area */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          {isLoadingHistory && (
            <div className="flex items-center justify-center gap-2 py-2 text-[12px] text-[#737373]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading conversation…
            </div>
          )}

          {/* Empty state */}
          {isEmptyState && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center pt-10 text-center"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F2FF]">
                <Sparkles className="h-6 w-6 text-[#635BFF]" />
              </div>
              <h2 className="text-[19px] font-semibold tracking-tight text-[#171717]">
                How can I help you today?
              </h2>
              <p className="mt-2 max-w-[300px] text-[12.5px] leading-relaxed text-[#737373]">
                Career guidance, skill gaps, interview prep and course recommendations.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {SUGGESTED_PROMPTS.map(({ text, icon: Icon }) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => handleSend(text)}
                    disabled={isTyping}
                    className="flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-3.5 py-2 text-left text-[12px] text-[#404040] transition-all hover:bg-[#F7F7F8] active:scale-[0.98] disabled:opacity-50"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[#635BFF]" />
                    <span>{text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          {!isEmptyState &&
            messages.map((msg) => {
              const isAi = msg.sender === "ai";
              const showActions = isAi && !isWelcomeId(msg.id);

              if (!isAi) {
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] whitespace-pre-line break-words rounded-3xl bg-[#F4F4F5] px-4 py-2.5 text-[13px] leading-relaxed text-[#171717]">
                      {msg.text}
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <SafeMarkdown content={msg.text} />

                  {msg.courseRecommendations && msg.courseRecommendations.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#737373]">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Recommended Pathly courses</span>
                      </div>
                      {msg.courseRecommendations.map((course) => (
                        <CourseRecommendationCard
                          key={course.id}
                          course={course}
                          onSelectCourse={onSelectCourse}
                        />
                      ))}
                    </div>
                  )}

                  {showActions && (
                    <div className="-ml-1.5 flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className={iconBtn}
                        title="Copy"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFeedback(msg.id, "up")}
                        className={cn(iconBtn, msg.feedback === "up" && "!text-[#171717]")}
                        title="Helpful"
                      >
                        <ThumbsUp
                          className={cn("h-4 w-4", msg.feedback === "up" && "fill-[#171717]")}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFeedback(msg.id, "down")}
                        className={cn(iconBtn, msg.feedback === "down" && "!text-[#171717]")}
                        title="Not helpful"
                      >
                        <ThumbsDown
                          className={cn("h-4 w-4", msg.feedback === "down" && "fill-[#171717]")}
                        />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-[13px] text-[#737373]"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#635BFF]/50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#635BFF]" />
              </span>
              <span>Thinking…</span>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 z-10 bg-gradient-to-t from-white via-white to-white/0 px-4 pb-3 pt-3">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-end gap-2 rounded-[26px] border border-[#E0E0E0] bg-white py-2 pl-4 pr-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-colors focus-within:border-[#A3A3A3]">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message AI Career Assistant"
              className="max-h-[140px] min-h-[28px] flex-1 resize-none bg-transparent py-1 text-[13px] leading-6 text-[#171717] placeholder:text-[#A3A3A3] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white transition-all active:scale-90 disabled:bg-[#E5E5E5] disabled:text-white"
              title="Send"
            >
              <ArrowUp className="h-[18px] w-[18px] stroke-[2.4]" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10.5px] text-[#A3A3A3]">
            AI can make mistakes. Verify credentials and prerequisites.
          </p>
        </div>
      </div>
    </div>
  );
}