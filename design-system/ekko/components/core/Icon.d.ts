export interface IconProps {
  /** Lucide icon name, e.g. "sun", "flame", "lock", "check" */
  name: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
