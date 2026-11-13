import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import type { QuizDraft } from "../quiz/_shared/quizDraft";
import { createInitialPreviewState, deletePreviewState, persistPreviewState, readPreviewState, type LocalReview, type PreviewState, type StorageLike, type StorageStatus } from "./storage";

function browserStorage(): StorageLike | null {
  try { return window.localStorage; } catch { return null; }
}

function usePreviewResource() {
  const [initial] = useState(() => readPreviewState(browserStorage()));
  const [state, setState] = useState(initial.state);
  const [status, setStatus] = useState<StorageStatus>(initial.status);
  const stateRef = useRef(state);
  const locked = useRef(initial.status === "corrupt" || initial.status === "unsupported");
  const commit = (next: PreviewState) => {
    stateRef.current = next;
    setState(next);
    if (locked.current) return;
    setStatus(persistPreviewState(browserStorage(), next) ? "saved" : "unavailable");
  };
  return {
    state, status,
    updateQuiz: (quiz: QuizDraft) => commit({ ...stateRef.current, quiz }),
    setPrivacy: (privacy: PreviewState["privacy"]) => commit({ ...stateRef.current, privacy }),
    toggleSave: (id: string) => {
      const current = stateRef.current;
      commit({ ...current, savedIds: current.savedIds.includes(id) ? current.savedIds.filter((item) => item !== id) : [...current.savedIds, id] });
    },
    saveReview: (review: LocalReview) => {
      const current = stateRef.current;
      commit({ ...current, reviews: [...current.reviews.filter((item) => item.id !== review.id), review] });
    },
    deleteReview: (id: string) => commit({ ...stateRef.current, reviews: stateRef.current.reviews.filter((review) => review.id !== id) }),
    retryStorage: () => {
      if (locked.current) return;
      setStatus(persistPreviewState(browserStorage(), stateRef.current) ? "saved" : "unavailable");
    },
    reset: () => {
      const deleted = deletePreviewState(browserStorage());
      const next = createInitialPreviewState();
      stateRef.current = next;
      setState(next);
      locked.current = !deleted && locked.current;
      setStatus(deleted ? "ready" : locked.current ? initial.status : "unavailable");
      return deleted;
    },
  };
}
type PreviewResource = ReturnType<typeof usePreviewResource>;
const PreviewContext = createContext<PreviewResource | null>(null);
export function PreviewProvider({ children }: { children: ReactNode }) {
  const preview = usePreviewResource();
  return <PreviewContext.Provider value={preview}>{children}</PreviewContext.Provider>;
}
export function usePreview() {
  const preview = useContext(PreviewContext);
  if (!preview) throw new Error("PreviewProvider is required");
  return preview;
}
