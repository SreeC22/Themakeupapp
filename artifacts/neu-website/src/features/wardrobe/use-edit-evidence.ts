import { useEffect, useRef, useState } from "react";
import { getGetNeuCatalogQueryKey, useGetNeuCatalog, useRecommendNeuShades, type NeuProfileInput, type NeuRecommendations } from "@workspace/api-client-react";
import type { QuizDraft } from "../quiz/_shared/quizDraft";
import { neuProfileInput } from "../mvp/neu-profile";
import { currentEvidence } from "../looks/helpers";
import { editRequest } from "./helpers";

export function useEditEvidence(profile: QuizDraft) {
  const catalog = useGetNeuCatalog({
    query: { queryKey: getGetNeuCatalogQueryKey(), staleTime: 60_000, retry: 1, refetchOnWindowFocus: true, refetchOnMount: "always", refetchInterval: 300_000 },
    request: { credentials: "include" },
  });
  const request = JSON.stringify(editRequest(neuProfileInput(profile)));
  const key = JSON.stringify([request, catalog.dataUpdatedAt]);
  const activeKey = useRef(key);
  activeKey.current = key;
  const requestId = useRef(0);
  const { mutateAsync } = useRecommendNeuShades({ mutation: { retry: 0 }, request: { credentials: "include" } });
  const mutateRef = useRef(mutateAsync);
  mutateRef.current = mutateAsync;
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; attempt: number; data?: NeuRecommendations; profile?: NeuProfileInput; error?: boolean } | null>(null);
  const canRequest = !!catalog.data && !catalog.isFetching && !catalog.isError;
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
    catalog: catalog.data, data: current?.data, profile: current?.profile,
    isLoading: catalog.isLoading || catalog.isFetching || !current && !catalog.isError,
    isError: catalog.isError || !!current?.error,
    retry: () => { if (catalog.isError) void catalog.refetch(); else setAttempt(a => a + 1); },
  };
}
