import { useEffect, useState } from "react";
import {
    UserProfile,
    UpdateProfileRequest,
    ChangePasswordRequest,
} from "../types";
import { fetchUserProfile } from "../services/userProfile.service";
import { changePassword, updateUserProfile } from "@/features/auth/services/auth.service";

export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchUserProfile();
            setProfile(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load profile",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false
        loadProfile()
        return () => {
            cancelled = true;
        };
    }, [])

    const handleUpdateProfile = async (updates: UpdateProfileRequest) => {
        setLoading(true);
        setError(null);

        try {
            const updated = await updateUserProfile(updates);
            setProfile(updated);
            return updated;
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to update profile";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (payload: ChangePasswordRequest) => {
    setLoading(true);
    setError(null);

    try {
      const result = await changePassword(payload);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to change password";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

    return { profile, loading, error, updateProfile: handleUpdateProfile, changePassword: handleChangePassword };
}