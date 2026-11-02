export interface TaskRowProps {
  title: string;
  /** short helper, e.g. "about 2 min" */
  meta?: string;
  /** Lucide icon name for the step tile */
  icon?: string;
  required?: boolean;
  done?: boolean;
  onToggle?: (done: boolean) => void;
  /** hides the bottom divider */
  last?: boolean;
}
export declare function TaskRow(props: TaskRowProps): JSX.Element;
