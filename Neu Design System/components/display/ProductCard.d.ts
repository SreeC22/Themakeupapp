import * as React from 'react';

/**
 * A product surfaced through your tone twins — the heart of the Neu feed.
 * @startingPoint section="Display" subtitle="Product card with tone-twin verdicts" viewport="260x300"
 */
export interface ProductCardProps {
  brand: string;
  name: string;
  price?: string;
  /** CSS color/gradient placeholder for the product image. */
  image?: string;
  /** Short verdict strings, e.g. ["Didn't oxidize","No white cast"]. */
  verdicts?: string[];
  /** Tone-twin summary. */
  twins?: { count: number; tone: number };
  saved?: boolean;
  onSave?: () => void;
  style?: React.CSSProperties;
}
export declare function ProductCard(props: ProductCardProps): JSX.Element;
