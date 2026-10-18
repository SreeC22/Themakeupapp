import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./button";
import "../neu.css";
export function Navigation({ onBack, onContinue, continueLabel, secondary, hideBack = false }: {
  onBack: () => void;
  onContinue: () => void;
  continueLabel: string;
  secondary?: ReactNode;
  hideBack?: boolean;
}) {
  return <div className="wj-quiz-navigation">
    {hideBack ? <span aria-hidden="true" /> : <Button variant="text" onClick={onBack}><ArrowLeft size={15} /> Back</Button>}
    {secondary}
    <Button onClick={onContinue}>{continueLabel} <ArrowRight size={15} /></Button>
  </div>;
}
