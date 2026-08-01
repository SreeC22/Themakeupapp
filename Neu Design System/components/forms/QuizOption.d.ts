import * as React from 'react';

/** A large tappable quiz answer for the 30-second quiz. Radio-like selection. */
export interface QuizOptionProps {
  children: React.ReactNode;
  /** @default false */
  selected?: boolean;
  /** Secondary line under the label. */
  sublabel?: string;
  /** Optional leading color swatch (e.g. a Monk tone). */
  swatch?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function QuizOption(props: QuizOptionProps): JSX.Element;
