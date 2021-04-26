import { InputProps, EventOnLineChange } from '../Input/PropsType'

export interface TextareaProps extends InputProps {
  autoHeight?: boolean;
  autoFocus?: boolean;
  onLineChange?: (evt: EventOnLineChange) => void;
}
