import * as React from 'react';

/** iOS-style segmented control over an array of string labels. */
export interface SegmentedControlProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
