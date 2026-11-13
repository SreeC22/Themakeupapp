import { useEffect, useRef, useState } from "react";
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
  const profileRef = useRef(profile);
  const [storageStatus, setStorageStatus] = useState<"loading" | "saved" | "unavailable">("loading");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (validProfile(parsed)) { profileRef.current = parsed; setProfile(parsed); }
        else { setStorageStatus("unavailable"); return; }
      }
      setStorageStatus("saved");
    } catch {
      setStorageStatus("unavailable");
    }
  }, []);

  return {
    profile,
    storageStatus,
    // Legacy compatibility only. Do not write defaults on mount or overwrite unreadable data.
    updateProfile: (patch: Partial<Profile>) => {
      const next = { ...profileRef.current, ...patch };
      profileRef.current = next;
      setProfile(next);
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw && !validProfile(JSON.parse(raw))) { setStorageStatus("unavailable"); return; }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setStorageStatus("saved");
      } catch { setStorageStatus("unavailable"); }
    },
  };
}
