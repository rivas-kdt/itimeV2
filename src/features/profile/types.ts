/* eslint-disable @typescript-eslint/no-explicit-any */

export interface UserProfile {
  emp_id: number;
  first_name: string;
  last_name: string;
  email: string;
  group_id: string;
  group_name?: string;
  created_at: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  group_name?: string;
  group_id?: string
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
