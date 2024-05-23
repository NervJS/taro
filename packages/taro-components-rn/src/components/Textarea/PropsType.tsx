import { FormItemProps } from '@tarojs/components'

import { EventOnLineChange, InputProps } from '../Input/PropsType'

export interface TextareaProps extends InputProps, FormItemProps {
  autoHeight?: boolean
  autoFocus?: boolean
  onLineChange?: (evt: EventOnLineChange) => void
}
