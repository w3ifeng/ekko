export interface StreakBadgeProps {
  count: number;
  size?: 'md' | 'lg';
  /** greyed when a full-day skip ended the streak */
  ended?: boolean;
  style?: React.CSSProperties;
}
export declare function StreakBadge(props: StreakBadgeProps): JSX.Element;
