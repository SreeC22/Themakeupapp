import { useEffect, useState } from "react";
import { DEFAULT_PROFILE, type Profile } from "@/data/neu";

const STORAGE_KEY = "neu.guest-profile.v1";

function validProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Profile>;
  return typeof item.handle === "string"
    && Number.isInteger(item.depth) && Number(item.depth) >= 1 && Number(item.depth) <= 10
    && ["Warm", "Cool", "Neutral", "Not sure"].includes(String(item.undertone))
    && typeof item.oliveCast === "boolean"
    && ["Normal", "Dry", "Oily", "Combination", "Sensitive"].includes(String(item.skinType))
    && Array.isArray(item.concerns) && item.concerns.every((concern) => typeof concern === "string");
}

export function useGuestProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [storageStatus, setStorageStatus] = useState<"loading" | "saved" | "unavailable">("loading");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (validProfile(parsed)) setProfile(parsed);
      }
      setStorageStatus("saved");
    } catch {
      setStorageStatus("unavailable");
    }
  }, []);

  useEffect(() => {
    if (storageStatus === "loading") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setStorageStatus("saved");
    } catch {
      setStorageStatus("unavailable");
    }
  }, [profile, storageStatus]);

  return {
    profile,
    storageStatus,
    updateProfile: (patch: Partial<Profile>) => setProfile((current) => ({ ...current, ...patch })),
  };
}
