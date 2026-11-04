/**
 * Admin API Client for Pathly Administration Panel (/admin).
 * Connects to /api/v1/admin endpoints with role-based JWT auth.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login?: string | null;
}

export interface AdminCourse {
  id: string;
  title: string;
  category: string;
  description: string;
  skills: string[];
  duration: string;
  level: string;
  price: string;
  provider: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  whatYouLearn: string[];
  modules?: any[];
  status: "published" | "draft" | "archived";
  link: string;
  created_at: string;
  updated_at: string;
}

export interface AdminMentor {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  mobile: string;
  skills: string[];
  specialty: string[];
  bio: string;
  experience: string;
  languages: string[];
  session_duration: string;
  session_price: string;
  availability: string[];
  meeting_link: string;
  avatarBg: string;
  photo_url?: string;
  rating: number;
  sessionsCount: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface RegisteredUserSummary {
  id: string;
  name: string;
  email: string;
  mobile: string;
  career_status: string;
  target_role: string;
  career_goal: string;
  education: string;
  skills: string[];
  enrollments_count: number;
  is_active: boolean;
  registered_at: string;
}

export interface RegisteredUserDetail {
  id: string;
  name: string;
  email: string;
  mobile: string;
  career_status: string;
  is_active: boolean;
  registered_at: string;
  profile: {
    target_role: string;
    career_goal: string;
    skills: any[];
    education: any;
    experience: any[];
    interests: string[];
  };
  roadmap?: {
    title: string;
    overall_progress: number;
    milestones_count: number;
  } | null;
  enrollments: {
    id: string;
    course_id: string;
    course_title: string;
    progress_percentage: number;
    status: string;
    enrolled_at: string;
  }[];
  bookings: any[];
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_courses: number;
  active_courses: number;
  total_mentors: number;
  active_mentors: number;
  course_enrollments: number;
  completed_courses: number;
  mentorship_bookings: number;
  recent_activity: {
    type: string;
    title: string;
    timestamp: string;
    badge: string;
  }[];
}

export interface EnrollmentRecord {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  course_id: string;
  course_title: string;
  progress_percentage: number;
  status: string;
  enrolled_at: string;
}

export interface MentorshipSessionRecord {
  id: string;
  booking_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  mentor_id: string;
  mentor_name: string;
  date: string;
  time_slot: string;
  topic: string;
  meeting_link: string;
  status: string;
  created_at: string;
}

export interface ReportsData {
  courses_by_category: { category: string; count: number }[];
  courses_by_level: { level: string; count: number }[];
  users_by_career_status: { status: string; count: number }[];
  enrollment_metrics: {
    total_users: number;
    total_enrollments: number;
    completed_courses: number;
    completion_rate_percentage: number;
  };
}

export interface BiAnalyticsData {
  period: string;
  kpis: {
    total_users: number;
    new_registrations: number;
    total_courses: number;
    total_enrollments: number;
    completion_rate: number;
    total_mentors: number;
    mentor_bookings: number;
  };
  user_registration_growth: {
    date: string;
    registrations: number;
    cumulative: number;
  }[];
  courses_by_category: {
    category: string;
    raw_category: string;
    count: number;
  }[];
  courses_by_difficulty: {
    name: string;
    value: number;
    percentage: number;
  }[];
  course_enrollment_trends: {
    date: string;
    enrollments: number;
  }[];
  enrollment_status_distribution: {
    name: string;
    value: number;
    percentage: number;
  }[];
  top_performing_courses: {
    id: string;
    title: string;
    enrollments: number;
    completions: number;
    completion_rate: number;
  }[];
  mentorship_analytics: {
    status: string;
    count: number;
  }[];
  learner_engagement: {
    date: string;
    active_learners: number;
  }[];
}

class AdminApiClient {
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("pathly_admin_token");
  }

  private setAuthToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("pathly_admin_token", token);
    }
  }

  private removeAuthToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pathly_admin_token");
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "application/json");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      let errorMsg = `Admin API error (${response.status})`;
      try {
        const errJson = await response.json();
        errorMsg = errJson.detail || errorMsg;
      } catch {
        // use default errorMsg
      }
      throw new Error(errorMsg);
    }

    return response.json();
  }

  // 1. AUTHENTICATION
  async login(email: string, password: string): Promise<{ admin: AdminUser; access_token: string }> {
    const res = await this.request<{ admin: AdminUser; access_token: string }>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res.access_token) {
      this.setAuthToken(res.access_token);
    }
    return res;
  }

  async getMe(): Promise<AdminUser> {
    return this.request<AdminUser>("/admin/auth/me");
  }

  async logout(): Promise<void> {
    try {
      await this.request("/admin/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors on logout
    }
    this.removeAuthToken();
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  // 2. DASHBOARD
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>("/admin/dashboard/stats");
  }

  // 3. COURSES
  async getCourses(filters?: { status?: string; category?: string; search?: string }): Promise<AdminCourse[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.category) params.set("category", filters.category);
    if (filters?.search) params.set("search", filters.search);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return this.request<AdminCourse[]>(`/admin/courses${qs}`);
  }

  async createCourse(data: Partial<AdminCourse>): Promise<AdminCourse> {
    return this.request<AdminCourse>("/admin/courses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCourse(id: string): Promise<AdminCourse> {
    return this.request<AdminCourse>(`/admin/courses/${id}`);
  }

  async updateCourse(id: string, data: Partial<AdminCourse>): Promise<AdminCourse> {
    return this.request<AdminCourse>(`/admin/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateCourseStatus(id: string, status: "published" | "draft" | "archived"): Promise<AdminCourse> {
    return this.request<AdminCourse>(`/admin/courses/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async deleteCourse(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/courses/${id}`, {
      method: "DELETE",
    });
  }

  // 4. MENTORS
  async getMentors(filters?: { status?: string; search?: string }): Promise<AdminMentor[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.search) params.set("search", filters.search);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return this.request<AdminMentor[]>(`/admin/mentors${qs}`);
  }

  async createMentor(data: Partial<AdminMentor>): Promise<AdminMentor> {
    return this.request<AdminMentor>("/admin/mentors", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMentor(id: string): Promise<AdminMentor> {
    return this.request<AdminMentor>(`/admin/mentors/${id}`);
  }

  async updateMentor(id: string, data: Partial<AdminMentor>): Promise<AdminMentor> {
    return this.request<AdminMentor>(`/admin/mentors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteMentor(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/mentors/${id}`, {
      method: "DELETE",
    });
  }

  // 5. REGISTERED USERS
  async getRegisteredUsers(params?: { search?: string; status?: string; page?: number; page_size?: number }): Promise<{
    users: RegisteredUserSummary[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  }> {
    const qp = new URLSearchParams();
    if (params?.search) qp.set("search", params.search);
    if (params?.status) qp.set("status", params.status);
    if (params?.page) qp.set("page", String(params.page));
    if (params?.page_size) qp.set("page_size", String(params.page_size));
    const qs = qp.toString() ? `?${qp.toString()}` : "";
    return this.request(`/admin/users${qs}`);
  }

  async getUserDetail(userId: string): Promise<RegisteredUserDetail> {
    return this.request<RegisteredUserDetail>(`/admin/users/${userId}`);
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/admin/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  // 6. ENROLLMENTS & MENTORSHIP SESSIONS
  async getEnrollments(): Promise<EnrollmentRecord[]> {
    return this.request<EnrollmentRecord[]>("/admin/enrollments");
  }

  async getMentorshipSessions(): Promise<MentorshipSessionRecord[]> {
    return this.request<MentorshipSessionRecord[]>("/admin/mentorship-sessions");
  }

  // 7. REPORTS & BI ANALYTICS
  async getReports(): Promise<ReportsData> {
    return this.request<ReportsData>("/admin/reports");
  }

  async getBiAnalytics(days: string = "30"): Promise<BiAnalyticsData> {
    return this.request<BiAnalyticsData>(`/admin/analytics?days=${encodeURIComponent(days)}`);
  }
}

export const adminApi = new AdminApiClient();

