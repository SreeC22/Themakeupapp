import * as React from 'react';

interface TabItem { key: string; label: string; icon?: React.ReactNode; }

/** iOS bottom navigation with translucent blur. Active tab is clay. */
export interface TabBarProps {
  items: TabItem[];
  active?: string;
  onChange?: (key: string) => void;
  style?: React.CSSProperties;
}
export declare function TabBar(props: TabBarProps): JSX.Element;
