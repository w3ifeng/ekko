/**
 * @startingPoint section="Core" subtitle="Primary, secondary, ghost, sunrise and night buttons" viewport="700x320"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = moss CTA; sunrise = celebration/unlock; night = on dark shield surfaces */
  variant?: 'primary' | 'secondary' | 'ghost' | 'sunrise' | 'night' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  pill?: boolean;
  disabled?: boolean;
  iconLeft?: string;
  iconRight?: string;
  onClick?: (e: any) => void;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
