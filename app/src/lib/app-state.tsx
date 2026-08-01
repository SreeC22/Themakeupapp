import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { ToneProfile } from './tone';

const PROFILE_KEY = 'neu.profile.v1';
const SAVED_KEY = 'neu.saved.v1';

interface AppState {
  ready: boolean;
  profile: ToneProfile | null;
  setProfile: (p: ToneProfile | null) => void;
  savedIds: string[];
  toggleSaved: (id: string) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfileState] = useState<ToneProfile | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [p, s] = await Promise.all([
          AsyncStorage.getItem(PROFILE_KEY),
          AsyncStorage.getItem(SAVED_KEY),
        ]);
        if (p) setProfileState(JSON.parse(p));
        if (s) setSavedIds(JSON.parse(s));
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setProfile = useCallback((p: ToneProfile | null) => {
    setProfileState(p);
    if (p) AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    else AsyncStorage.removeItem(PROFILE_KEY);
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ ready, profile, setProfile, savedIds, toggleSaved }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAppState(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppState outside AppStateProvider');
  return v;
}
