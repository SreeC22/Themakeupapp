import { useEffect, useRef, useState } from "react";
import { getGetNeuCatalogQueryKey, useGetNeuCatalog, useRecommendNeuShades, type NeuRecommendations } from "@workspace/api-client-react";
import type { QuizDraft } from "../quiz/_shared/quizDraft";
import { neuProfileInput } from "./neu-profile";

export function useNeuCatalog() {
  return useGetNeuCatalog({
    query: { queryKey: getGetNeuCatalogQueryKey(), staleTime: 5 * 60 * 1000, retry: 1, refetchOnWindowFocus: false },
    request: { credentials: "include" },
  });
}

/** Keyed responses keep a late request from showing candidates for an old profile. */
export function useNeuRecommendations(draft: QuizDraft) {
  const key = JSON.stringify(neuProfileInput(draft));
  const { mutateAsync } = useRecommendNeuShades({ mutation: { retry: 0 }, request: { credentials: "include" } });
  const mutateRef = useRef(mutateAsync);
  mutateRef.current = mutateAsync;
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; attempt: number; data?: NeuRecommendations; error?: boolean } | null>(null);
  useEffect(() => {
    let active = true;
    // Batch quick preference edits without a mutation/invalidation effect loop.
    const timer = window.setTimeout(() => {
      mutateRef.current({ data: JSON.parse(key) }).then(
        (data) => { if (active) setResult({ key, attempt, data }); },
        () => { if (active) setResult({ key, attempt, error: true }); },
      );
    }, 200);
    return () => { active = false; window.clearTimeout(timer); };
  }, [key, attempt]);
  const current = result?.key === key && result.attempt === attempt ? result : null;
  return { data: current?.data, isLoading: !current, isError: Boolean(current?.error), retry: () => setAttempt((value) => value + 1) };
}
