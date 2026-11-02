export interface ProgressBarProps {
  /** 0–1 */
  value?: number;
  tone?: 'moss' | 'sun' | 'night';
  height?: number;
  style?: React.CSSProperties;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
