import * as React from 'react';

/** Base warm surface. Compose product content, tips, sheets inside. */
export interface CardProps {
  children: React.ReactNode;
  /** Inner padding. @default true */
  pad?: boolean;
  /** Drop the shadow. @default false */
  flat?: boolean;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
