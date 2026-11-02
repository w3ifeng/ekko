export interface AvatarProps {
  initial: string;
  tone?: 'clay' | 'sky' | 'moss' | 'lilac' | 'yolk';
  size?: number;
  /** yolk ring = finished their morning today */
  done?: boolean;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
