export interface User {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  career_status?: "fresher" | "experienced" | string;
  is_active: boolean;
  created_at: string;
}

export interface SkillItem {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | string;
  category?: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration?: string;
  description?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year?: string;
}

export interface CandidateProfile {
  user_id: string;
  career_status?: "fresher" | "experienced" | string;
  target_role?: string;
  experience_years?: string;
  preferred_locations?: string[];
  preferred_work_modes?: string[];
  gov_exam_scope?: string;
  interests?: string[];
  skills?: SkillItem[];
  bio?: string;
  headline?: string;
  education?: EducationItem[];
  experience?: ExperienceItem[];
  resume_name?: string;
  resume_url?: string | null;
  ats_score?: number;
  profile_completion_percentage?: number;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  profile?: CandidateProfile;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ApiError {
  detail: string;
  status: number;
}

