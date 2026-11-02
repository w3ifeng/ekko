export interface FriendRowProps {
  name: string;
  initial: string;
  tone?: 'clay' | 'sky' | 'moss' | 'lilac' | 'yolk';
  streak?: number;
  /** finished their morning today */
  done?: boolean;
  status?: string;
  cheered?: boolean;
  onCheer?: () => void;
  last?: boolean;
}
export declare function FriendRow(props: FriendRowProps): JSX.Element;
