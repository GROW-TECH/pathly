import { apiClient } from "./client";
import { CandidateProfile } from "./types";

export const profileApi = {
  async getProfile(): Promise<CandidateProfile> {
    return apiClient<CandidateProfile>("/user/profile", {
      method: "GET",
    });
  },

  async updateProfile(data: Partial<CandidateProfile>): Promise<CandidateProfile> {
    return apiClient<CandidateProfile>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

