import * as React from 'react';

/** Small status/label pill. Use `good` for verdicts like "no cast". */
export interface BadgeProps {
  children: React.ReactNode;
  /** @default "neutral" */
  tone?: 'good' | 'warm' | 'berry' | 'neutral' | 'olive';
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
