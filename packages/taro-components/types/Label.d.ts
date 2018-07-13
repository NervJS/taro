import { ComponentType } from 'react'
import { StandardProps } from './common'

interface LabelProps extends StandardProps {

  /**
   * 绑定控件的 id
   */
  for?: string
}

declare const Label: ComponentType<LabelProps>

export { Label }
