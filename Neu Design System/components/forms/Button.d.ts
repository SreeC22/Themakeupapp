import * as React from 'react';

/**
 * Primary tappable action. Pill-shaped, warm; clay by default.
 * @startingPoint section="Forms" subtitle="Pill CTA in clay / ink / soft / ghost" viewport="360x120"
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** Visual role. @default "primary" */
  variant?: 'primary' | 'quiet' | 'soft' | 'ghost';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to container width. @default false */
  full?: boolean;
  /** Optional leading icon node. */
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}
export declare function Button(props: ButtonProps): JSX.Element;
