import { ComponentType } from 'react'
import { StandardProps } from './common'
interface LabelProps extends StandardProps {
  /** 绑定控件的 id
   * @supported weapp, alipay, swan, tt, qq, jd, h5, harmony_hybrid
   */
  for?: string
}
/** 用来改进表单组件的可用性。
 *
 * 使用for属性找到对应的id，或者将控件放在该标签下，当点击时，就会触发对应的控件。 for优先级高于内部控件，内部有多个控件的时候默认触发第一个控件。 目前可以绑定的控件有：button, checkbox, radio, switch。
 * @classification forms
 * @supported weapp, swan, alipay, tt, h5, rn, harmony, harmony_hybrid
 * @example_react
 * ```tsx
 * class App extends Components {
 *
 *   render () {
 *     return (
 *       <RadioGroup>
 *         <Label className='example-body__label' for='1' key='1'>
 *           <Radio value='USA'>USA</Radio>
 *         </Label>
 *         <Label className='example-body__label' for='2' key='2'>
 *           <Radio value='CHN' checked>
 *           CHN
 *           </Radio>
 *         </Label>
 *       </RadioGroup>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <radio-group>
 *     <label class="example-body__label" for="1" key="1">
 *       <radio id="1" value="USA" />
 *       USA
 *     </label>
 *     <label class="example-body__label" for="2" key="2">
 *       <radio id="2" value="CHN" :checked="true" />
 *       CHN
 *     </label>
 *   </radio-group>
 * </template>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/label.html
 */
declare const Label: ComponentType<LabelProps>
export { Label, LabelProps }
