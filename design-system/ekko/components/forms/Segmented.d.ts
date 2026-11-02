export interface SegmentedProps {
  options: Array<string | { value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function Segmented(props: SegmentedProps): JSX.Element;
