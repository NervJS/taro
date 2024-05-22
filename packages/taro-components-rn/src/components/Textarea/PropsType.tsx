import { InputProps, EventOnLineChange } from '../Input/PropsType'

import type { FormItemProps } from '@tarojs/components'
export interface TextareaProps extends InputProps, FormItemProps {
  autoHeight?: boolean;
  autoFocus?: boolean;
  onLineChange?: (evt: EventOnLineChange) => void;
}
