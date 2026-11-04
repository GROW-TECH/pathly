import { apiClient } from "./client";

export interface MilestoneItem {
  id: string;
  title: string;
  skills: string[];
  status: "completed" | "current" | "upcoming";
  course_id?: string;
  project?: string;
  completed_at?: string;
}

export interface RoadmapStageItem {
  stage_id: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  title: string;
  description: string;
  estimated_duration: string;
  focus_skills: string[];
  progress: number;
  milestones: MilestoneItem[];
  matched_course_id?: string;
}

export interface UserRoadmap {
  id: string;
  user_id: string;
  target_role: string;
  title: string;
  description: string;
  icon_type: "tech" | "data" | "design" | "govt";
  progress: number;
  overall_progress: number;
  total_milestones: number;
  completed_milestones: number;
  milestones: MilestoneItem[];
  stages?: RoadmapStageItem[];
  course_id?: string;
  course_title?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  completed_modules: string[];
  completed_lessons: string[];
  total_lessons: number;
  progress_percentage: number;
  status: "enrolled" | "in_progress" | "completed";
  enrolled_at: string;
  last_accessed_at: string;
  completed_at?: string;
}

export interface EnrichedCourse {
  id: string;
  title: string;
  provider: string;
  rating: number;
  reviewCount: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: string;
  category: string;
  skills: string[];
  description: string;
  whatYouLearn: string[];
  isEnrolled: boolean;
  progress: number;
  status: "not_enrolled" | "enrolled" | "in_progress" | "completed";
  completed_lessons: string[];
  completed_modules: string[];
  isSaved: boolean;
  link: string;
  why_recommended?: string;
}

export interface LearningDashboardData {
  active_courses_count: number;
  completed_courses_count: number;
  skills_improved_count: number;
  overall_progress_percentage: number;
  active_courses: EnrichedCourse[];
  completed_courses: EnrichedCourse[];
  skills_improved: string[];
  upcoming_milestone?: {
    stage_title: string;
    stage_level: string;
    milestone_title: string;
    skills: string[];
    course_id?: string;
  };
}

export interface SavedCourseItem {
  id: string;
  user_id: string;
  course_id: string;
  saved_at: string;
  course_details?: any;
}

export const learningApi = {
  /**
   * Get learning dashboard metrics & stats
   */
  async getDashboard(): Promise<LearningDashboardData> {
    return apiClient<LearningDashboardData>("/learning/dashboard");
  },

  /**
   * Get user's personalized career roadmap from MongoDB
   */
  async getRoadmap(): Promise<UserRoadmap> {
    return apiClient<UserRoadmap>("/learning/roadmap");
  },

  /**
   * Generate or update AI roadmap based on user's current profile (preserves completed milestones)
   */
  async generateRoadmap(): Promise<UserRoadmap> {
    return apiClient<UserRoadmap>("/learning/roadmap/generate", {
      method: "POST",
    });
  },

  /**
   * Toggle roadmap milestone status (completed vs upcoming)
   */
  async toggleMilestone(
    milestoneId: string,
    completed: boolean,
    stageId?: string
  ): Promise<UserRoadmap> {
    return apiClient<UserRoadmap>(`/learning/roadmap/milestones/${milestoneId}/toggle`, {
      method: "POST",
      body: JSON.stringify({ milestone_id: milestoneId, completed, stage_id: stageId || null }),
    });
  },

  /**
   * Get all courses enriched with user progress & saved state
   */
  async getCourses(): Promise<EnrichedCourse[]> {
    return apiClient<EnrichedCourse[]>("/learning/courses");
  },

  /**
   * Enroll user in a course
   */
  async enrollCourse(courseId: string): Promise<CourseProgress> {
    return apiClient<CourseProgress>(`/learning/courses/${courseId}/enroll`, {
      method: "POST",
    });
  },

  /**
   * Update lesson or module progress
   */
  async updateProgress(
    courseId: string,
    options: { moduleId?: string; lessonId?: string; completed: boolean }
  ): Promise<CourseProgress> {
    return apiClient<CourseProgress>(`/learning/courses/${courseId}/progress`, {
      method: "POST",
      body: JSON.stringify({
        module_id: options.moduleId || null,
        lesson_id: options.lessonId || null,
        completed: options.completed,
      }),
    });
  },

  /**
   * Get saved/bookmarked courses
   */
  async getSavedCourses(): Promise<SavedCourseItem[]> {
    return apiClient<SavedCourseItem[]>("/learning/saved");
  },

  /**
   * Toggle save/bookmark for a course
   */
  async toggleSaveCourse(
    courseId: string
  ): Promise<{ course_id: string; is_saved: boolean; message: string }> {
    return apiClient(`/learning/saved/${courseId}`, {
      method: "POST",
    });
  },

  /**
   * Get personalized recommendations prioritizing free courses
   */
  async getRecommendations(): Promise<EnrichedCourse[]> {
    return apiClient<EnrichedCourse[]>("/learning/recommendations");
  },
};
