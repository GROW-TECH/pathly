import { apiClient, API_BASE_URL } from "./client";

export interface CourseRecommendation {
  id: string;
  title: string;
  provider: string;
  level: string;
  duration: string;
  skills: string[];
  description: string;
  price: string;
  rating: number;
  why_recommended: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: "user" | "ai";
  text: string;
  course_recommendations?: CourseRecommendation[];
  roadmap?: any;
  created_at: string;
  feedback?: "up" | "down" | null;
}

export interface ConversationSummary {
  id: string;
  user_id: string;
  title: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail {
  conversation: ConversationSummary;
  messages: ChatMessage[];
}

export interface SkillGapAnalysisResult {
  id: string;
  user_id: string;
  target_role: string;
  readiness_score: number;
  existing_strengths: string[];
  missing_skills: string[];
  priority_skills: string[];
  recommended_courses: CourseRecommendation[];
  project_suggestions: string[];
  summary: string;
  created_at: string;
}

export interface LearningRoadmapStage {
  stage_number: number;
  title: string;
  focus_skills: string[];
  action_items: string[];
  matched_course_ids: string[];
  courses: CourseRecommendation[];
}

export interface LearningRoadmap {
  id: string;
  user_id: string;
  goal: string;
  duration_weeks: number;
  stages: LearningRoadmapStage[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const aiApi = {
  /**
   * Send a chat message with JSON response.
   */
  async sendMessage(
    message: string,
    conversationId?: string | null
  ): Promise<{ conversation_id: string; message: ChatMessage }> {
    return apiClient<{ conversation_id: string; message: ChatMessage }>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        conversation_id: conversationId || null,
        stream: false,
      }),
    });
  },

  /**
   * Stream a chat response via Server-Sent Events.
   */
  async streamMessage(
    message: string,
    conversationId: string | null,
    onMeta: (data: { conversation_id: string; user_message_id: string }) => void,
    onDelta: (text: string) => void,
    onDone: (aiMessage: ChatMessage) => void,
    onError: (err: any) => void
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message,
          conversation_id: conversationId || null,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server responded with ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("ReadableStream not supported by browser");

      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const block of lines) {
          if (!block.trim()) continue;
          const matchEvent = block.match(/event:\s*([a-zA-Z0-9_-]+)/);
          const matchData = block.match(/data:\s*(.+)/);
          const eventType = matchEvent ? matchEvent[1] : "message";
          const dataStr = matchData ? matchData[1] : "";

          if (eventType === "meta" && dataStr) {
            try {
              onMeta(JSON.parse(dataStr));
            } catch (e) {}
          } else if (eventType === "delta" && dataStr) {
            try {
              const parsed = JSON.parse(dataStr);
              onDelta(parsed.text || "");
            } catch (e) {}
          } else if (eventType === "done" && dataStr) {
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.message) onDone(parsed.message);
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      onError(err);
    }
  },

  /**
   * List all conversations for current user.
   */
  async listConversations(): Promise<ConversationSummary[]> {
    return apiClient<ConversationSummary[]>("/ai/conversations");
  },

  /**
   * Get specific conversation with full messages.
   */
  async getConversation(id: string): Promise<ConversationDetail> {
    return apiClient<ConversationDetail>(`/ai/conversations/${id}`);
  },

  /**
   * Delete conversation.
   */
  async deleteConversation(id: string): Promise<{ message: string; id: string }> {
    return apiClient<{ message: string; id: string }>(`/ai/conversations/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Submit thumbs up/down feedback on a message.
   */
  async submitFeedback(
    messageId: string,
    feedback: "up" | "down" | null
  ): Promise<{ message: string; id: string; feedback: string | null }> {
    return apiClient(`/ai/messages/${messageId}/feedback`, {
      method: "POST",
      body: JSON.stringify({ feedback }),
    });
  },

  /**
   * Run skill gap analysis.
   */
  async getSkillGap(targetRole?: string, skills?: string[]): Promise<SkillGapAnalysisResult> {
    return apiClient<SkillGapAnalysisResult>("/ai/skill-gap", {
      method: "POST",
      body: JSON.stringify({ target_role: targetRole || null, skills: skills || null }),
    });
  },

  /**
   * Generate structured learning roadmap.
   */
  async createLearningRoadmap(goal: string, durationWeeks: number = 4): Promise<LearningRoadmap> {
    return apiClient<LearningRoadmap>("/ai/learning-roadmap", {
      method: "POST",
      body: JSON.stringify({ goal, duration_weeks: durationWeeks }),
    });
  },

  /**
   * Get user's saved learning roadmaps.
   */
  async listLearningRoadmaps(): Promise<LearningRoadmap[]> {
    return apiClient<LearningRoadmap[]>("/ai/learning-roadmaps");
  },
};
