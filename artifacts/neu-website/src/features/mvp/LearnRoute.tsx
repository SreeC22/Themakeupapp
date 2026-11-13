import { Link, useLocation, useSearch } from "wouter";
import { usePreview } from "./use-preview";
import { QUIZ_SWATCHES } from "../quiz/_shared/quizDraft";
import LearnPage from "@/pages/LearnPage";
import type { Profile } from "@/data/neu";

export function LearnRoute() {
  const { state, updateQuiz } = usePreview();
  const [, navigate] = useLocation();
  const requestedReturn = new URLSearchParams(useSearch()).get("returnTo");
  const returnPath = requestedReturn === "results" ? "/results" : requestedReturn === "profile" ? "/profile" : "/quiz";
  const draft = state.quiz;
  const shade = QUIZ_SWATCHES.find((item) => item.id === draft.shadeId);
  // The preserved Learn lab uses broad exploratory controls. These defaults never enter the quiz.
  const guideProfile: Profile = {
    handle: "", depth: shade?.profileDepth ?? 5,
    undertone: draft.undertone === "Warm" || draft.undertone === "Cool" || draft.undertone === "Neutral" ? draft.undertone : "Not sure",
    oliveCast: draft.olive === "yes" || draft.undertone === "Olive",
    skinType: ["Normal", "Dry", "Oily", "Combination", "Sensitive"].includes(draft.skinType) ? draft.skinType as Profile["skinType"] : "Combination",
    concerns: [],
  };
  return <>
    {requestedReturn && <aside className="quiz-return"><p>Your local answers and place are still here. The guide is optional.</p><Link href={returnPath} className="mvp-link">Return to {requestedReturn === "results" ? "your results" : requestedReturn === "profile" ? "your profile" : "your quiz"}</Link></aside>}
    <LearnPage profile={guideProfile} onUseProfile={(patch) => {
      const changedDepth = patch.depth !== undefined && patch.depth !== shade?.profileDepth;
      updateQuiz({
        ...draft,
        ...(patch.undertone ? { undertone: patch.undertone === "Not sure" ? "Still exploring" : patch.undertone } : {}),
        ...(patch.oliveCast !== undefined ? { olive: patch.oliveCast ? "yes" : "no", ...(!patch.oliveCast ? { oliveSubtype: "", ...(draft.undertone === "Olive" && !patch.undertone ? { undertone: "Still exploring" as const } : {}) } : {}) } : {}),
        ...(changedDepth ? { shadeId: null, depthUnsure: true, step: "depth" } : {}),
      });
      navigate(changedDepth ? "/quiz?guideDepth=changed" : returnPath);
    }} />
  </>;
}
