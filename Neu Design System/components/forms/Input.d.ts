import * as React from 'react';

/** Text / search field. Wrap the whole field; focus ring is clay. */
export interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** Leading icon node. */
  icon?: React.ReactNode;
  type?: string;
  /** Fully-rounded pill shape. @default false */
  pill?: boolean;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
