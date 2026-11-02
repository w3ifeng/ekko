export interface AppRowProps {
  name: string;
  glyph: string;
  tone?: 'clay' | 'slate' | 'moss' | 'sky' | 'lilac' | 'yolk';
  paused?: boolean;
  onChange?: (paused: boolean) => void;
  last?: boolean;
}
export declare function AppRow(props: AppRowProps): JSX.Element;
