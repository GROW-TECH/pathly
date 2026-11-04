/**
 * Mentorship API Client for Pathly 1:1 Industry Mentors.
 */

import { apiClient } from "./client";

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  email?: string;
  mobile?: string;
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
  status: string;
}

export interface MentorshipBooking {
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

export const mentorsApi = {
  /**
   * Fetch all active industry mentors from MongoDB
   */
  async getActiveMentors(): Promise<Mentor[]> {
    try {
      return await apiClient<Mentor[]>("/mentors");
    } catch {
      return [];
    }
  },

  /**
   * Get specific mentor detail
   */
  async getMentor(mentorId: string): Promise<Mentor> {
    return apiClient<Mentor>(`/mentors/${mentorId}`);
  },

  /**
   * Book a 1:1 session with real-time slot conflict check in MongoDB
   */
  async bookSession(mentorId: string, payload: { date: string; time_slot: string; topic?: string }): Promise<MentorshipBooking> {
    return apiClient<MentorshipBooking>(`/mentors/${mentorId}/book`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch candidate's own booked sessions
   */
  async getMyBookings(): Promise<MentorshipBooking[]> {
    try {
      return await apiClient<MentorshipBooking[]>("/mentors/my-bookings");
    } catch {
      return [];
    }
  },
};

