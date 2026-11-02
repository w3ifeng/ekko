export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;
