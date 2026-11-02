export interface PillProps {
  children?: React.ReactNode;
  tone?: 'moss' | 'ember' | 'yolk' | 'sand' | 'night' | 'neutral' | 'solid';
  icon?: string;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function Pill(props: PillProps): JSX.Element;
