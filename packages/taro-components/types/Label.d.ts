import { ComponentType } from 'react'
import { StandardProps } from './common'

export interface LabelProps extends StandardProps {

  /**
   * 绑定控件的 id
   */
  for?: string
}

/**
 * @classification forms
 */
declare const Label: ComponentType<LabelProps>

export { Label }
