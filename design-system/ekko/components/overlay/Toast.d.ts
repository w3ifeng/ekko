export interface ToastProps {
  message: string;
  icon?: string;
  visible?: boolean;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
