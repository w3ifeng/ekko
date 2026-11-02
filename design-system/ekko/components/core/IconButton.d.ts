export interface IconButtonProps {
  icon: string;
  /** accessible label (required for screen readers) */
  label: string;
  variant?: 'soft' | 'ghost' | 'night' | 'accent';
  size?: number;
  onClick?: (e: any) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
