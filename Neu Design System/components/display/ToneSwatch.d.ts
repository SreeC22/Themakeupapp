import * as React from 'react';

/**
 * The Monk Skin Tone dot — Neu's signature primitive. Selected state draws the olive placement ring.
 * @startingPoint section="Brand" subtitle="Monk Skin Tone swatch with placement ring" viewport="200x120"
 */
export interface ToneSwatchProps {
  /** Monk Skin Tone 1–10; pulls the official --mst-N token. */
  tone?: number;
  /** Raw CSS color, overrides `tone`. */
  color?: string;
  /** Diameter in px. @default 40 */
  size?: number;
  /** Draw the olive placement ring. @default false */
  selected?: boolean;
  /** Show the MST-0N code below. @default false */
  label?: boolean;
  style?: React.CSSProperties;
}
export declare function ToneSwatch(props: ToneSwatchProps): JSX.Element;
