export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: number;
  tone?: 'moss' | 'sun';
  label?: string;
  style?: React.CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
