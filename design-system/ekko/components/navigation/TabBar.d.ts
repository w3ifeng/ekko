export interface TabBarItem { id: string; label: string; icon: string }
export interface TabBarProps {
  items: TabBarItem[];
  active?: string;
  onChange?: (id: string) => void;
  /** use on dark (asleep) screens */
  night?: boolean;
  style?: React.CSSProperties;
}
export declare function TabBar(props: TabBarProps): JSX.Element;
