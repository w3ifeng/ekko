export interface AppIconProps {
  /** 1–2 characters standing in for the app (no third-party logos) */
  glyph: string;
  tone?: 'clay' | 'slate' | 'moss' | 'sky' | 'lilac' | 'yolk' | 'night';
  size?: number;
  /** shows the little "z" badge used when the app is paused */
  asleep?: boolean;
  style?: React.CSSProperties;
}
export declare function AppIcon(props: AppIconProps): JSX.Element;
