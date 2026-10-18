import { X } from "lucide-react";
import { Button } from "@workspace/neu-design-system/components/neu/button";
import { QuizFlow } from "./QuizFlow";
import type { QuizDraft } from "./_shared/quizDraft";
import "./quiz-route.css";

export function QuizPage({ draft, onChange, onHome, onLearn, onComplete, guideNote }: {
  draft: QuizDraft;
  onChange: (draft: QuizDraft) => void;
  onHome: () => void;
  onLearn: () => void;
  onComplete: () => void;
  guideNote: string;
}) {
  return <main className="wj-app neu-quiz">
    <header className="wj-quiz-header">
      <Button variant="text" className="wj-quiz-wordmark" aria-label="Neu home, keep quiz draft" onClick={onHome}>Neu</Button>
      <Button variant="text" className="wj-quiz-close" aria-label="Close quiz and keep draft" onClick={onHome}><X size={17} /></Button>
    </header>
    {guideNote && <p className="quiz-guide-note" role="status">{guideNote}</p>}
    <QuizFlow draft={draft} onDraftChange={onChange} onLearn={onLearn} onComplete={onComplete} />
  </main>;
}
