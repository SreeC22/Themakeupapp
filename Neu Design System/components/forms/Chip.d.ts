import * as React from 'react';

/** Selectable filter / undertone / tone pill. Optional leading color dot. */
export interface ChipProps {
  children: React.ReactNode;
  /** @default false */
  selected?: boolean;
  /** CSS color for the leading dot (undertone or Monk tone). */
  swatch?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Chip(props: ChipProps): JSX.Element;
