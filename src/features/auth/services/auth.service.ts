/* eslint-disable @typescript-eslint/no-explicit-any */
// features/auth/services/login-api.ts
export type Auth = {
  token: string;
  user: any; // replace with your ItimeAuthUser type if you want
};

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}


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


export async function login(
  email: string,
  password: string
): Promise<Auth> {
  const res = await fetch("/api/v2/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // your route returns { error: "..." }
    throw new Error(data?.error || "Login failed");
  }

  return data as Auth;
}

export async function signup(
  email: string,
  password: string,
  first_name: string,
  last_name: string
): Promise<Auth> {
  const res = await fetch("/api/v2/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, first_name, last_name }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Signup failed");
  }

  return data as Auth;
}


export async function changePassword(
  payload: ChangePasswordRequest
): Promise<{ message: string }> {
  const res = await fetch("/api/v2/profile/change-password", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Failed to change password");
  }

  return data as { message: string };
}

export async function updateUserProfile(
  updates: UpdateProfileRequest
): Promise<UserProfile> {
  const res = await fetch("/api/v2/profile", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Failed to update profile");
  }

  return data as UserProfile;
}