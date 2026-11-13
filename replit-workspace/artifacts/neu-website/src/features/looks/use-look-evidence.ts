import { useEffect, useRef, useState } from "react";
import { getGetNeuCatalogQueryKey, useGetNeuCatalog, useRecommendNeuShades, type NeuProfileInput, type NeuRecommendations } from "@workspace/api-client-react";
import type { QuizDraft } from "../quiz/_shared/quizDraft";
import { neuProfileInput } from "../mvp/neu-profile";
import { lookRequest, type Occasion } from "./model";
import { currentEvidence } from "./helpers";

/** Revalidation never chooses a slot. Only an explicit Generate action may do that. */
export function useLookEvidence(profile: QuizDraft, occasion: Occasion, enabled: boolean) {
  const catalog = useGetNeuCatalog({
    query: {
      queryKey: getGetNeuCatalogQueryKey(), staleTime: 60_000, retry: 1,
      refetchOnWindowFocus: true, refetchOnMount: "always", refetchInterval: 5 * 60_000,
    },
    request: { credentials: "include" },
  });
  const request = JSON.stringify(lookRequest(neuProfileInput(profile), occasion));
  const contextKey = JSON.stringify([occasion, request]);
  const key = JSON.stringify([contextKey, catalog.dataUpdatedAt]);
  const activeKey = useRef(key);
  activeKey.current = key;
  const requestId = useRef(0);
  const { mutateAsync } = useRecommendNeuShades({ mutation: { retry: 0 }, request: { credentials: "include" } });
  const mutateRef = useRef(mutateAsync);
  mutateRef.current = mutateAsync;
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; attempt: number; data?: NeuRecommendations; profile?: NeuProfileInput; error?: boolean } | null>(null);
  const canRequest = enabled && !!catalog.data && !catalog.isFetching && !catalog.isError;
  useEffect(() => {
    const id = ++requestId.current;
    if (!canRequest) return;
    let active = true;
    const requestProfile: NeuProfileInput = JSON.parse(request);
    mutateRef.current({ data: requestProfile }).then(
      data => { if (active && currentEvidence(key, activeKey.current, id, requestId.current)) setResult({ key, attempt, data, profile: requestProfile }); },
      () => { if (active && currentEvidence(key, activeKey.current, id, requestId.current)) setResult({ key, attempt, error: true }); },
    );
    return () => { active = false; };
  }, [key, request, canRequest, attempt]);
  const current = canRequest && result?.key === key && result.attempt === attempt ? result : null;
  return {
    catalog: catalog.data, data: current?.data, profile: current?.profile, contextKey,
    isLoading: catalog.isLoading || catalog.isFetching || enabled && !current && !catalog.isError,
    isError: catalog.isError || !!current?.error,
    retry: () => { if (catalog.isError) void catalog.refetch(); else setAttempt(a => a + 1); },
    refresh: () => { setAttempt(a => a + 1); void catalog.refetch(); },
  };
}
