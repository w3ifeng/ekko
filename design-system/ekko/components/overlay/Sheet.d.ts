export interface SheetProps {
  open?: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
}
export declare function Sheet(props: SheetProps): JSX.Element;
