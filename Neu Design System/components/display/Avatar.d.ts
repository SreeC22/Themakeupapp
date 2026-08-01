import * as React from 'react';

/** A tone twin. Initials fallback; optional Monk-tone dot in the corner. */
export interface AvatarProps {
  name?: string;
  src?: string;
  /** Monk Skin Tone 1–10 — renders a corner tone dot. */
  tone?: number;
  /** Diameter in px. @default 44 */
  size?: number;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
