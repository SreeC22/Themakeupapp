import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "../neu.css";
export function Navigation({ onBack, onContinue, continueLabel, secondary }: { onBack: () => void; onContinue: () => void; continueLabel: string; secondary?: ReactNode }) {
  return <div className="wj-quiz-navigation"><button type="button" className="wj-text-action" onClick={onBack}><ArrowLeft size={15} /> Back</button>{secondary}<button type="button" className="wj-primary" onClick={onContinue}>{continueLabel} <ArrowRight size={15} /></button></div>;
}