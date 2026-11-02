/**
 * @startingPoint section="Signature" subtitle="The rising-sun progress window — ekko's hero motif" viewport="700x260"
 */
export interface SunriseProps {
  /** 0 = still night (apps asleep), 1 = sun fully up (apps awake) */
  value?: number;
  width?: number | string;
  height?: number;
  /** force deep-night palette (shield screens) */
  night?: boolean;
  /** overlaid content, bottom-aligned on the horizon */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Sunrise(props: SunriseProps): JSX.Element;
