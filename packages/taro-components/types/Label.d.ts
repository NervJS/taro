import { ComponentType } from 'react'
import { StandardProps } from './common'

interface LabelProps extends StandardProps {

  /** 绑定控件的 id
   */
  for?: string
}

/** 用来改进表单组件的可用性。
 * 
 * 使用for属性找到对应的id，或者将控件放在该标签下，当点击时，就会触发对应的控件。 for优先级高于内部控件，内部有多个控件的时候默认触发第一个控件。 目前可以绑定的控件有：button, checkbox, radio, switch。
 * @classification forms
 */
declare const Label: ComponentType<LabelProps>

export { Label, LabelProps }
