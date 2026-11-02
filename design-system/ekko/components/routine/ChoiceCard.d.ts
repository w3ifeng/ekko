export interface ChoiceCardProps {
  title: string;
  description?: string;
  icon?: string;
  selected?: boolean;
  /** danger = choices that end a streak */
  tone?: 'moss' | 'danger';
  onClick?: () => void;
}
export declare function ChoiceCard(props: ChoiceCardProps): JSX.Element;
