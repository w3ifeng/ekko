export interface CardProps {
  children?: React.ReactNode;
  /** default = white panel; soft = mint info panel; night = shield/asleep; sunrise = unlock celebration */
  variant?: 'default' | 'soft' | 'muted' | 'night' | 'sunrise' | 'raised';
  padding?: number | string;
  radius?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
