import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'

interface RadioProps extends StandardProps {
  /** `<Radio/>` 标识。当该`<Radio/>` 选中时，`<RadioGroup/>`的 change 事件会携带`<Radio/>`的 value
   * @supported weapp, rn
   */
  value?: string

  /** 当前是否选中
   * @default false
   * @supported weapp, h5, rn
   */
  checked?: boolean

  /** 是否禁用
   * @default false
   * @supported weapp, h5, rn
   */
  disabled?: boolean

  /** Radio 的颜色，同 css 的 color
   * @default "#09BB07"
   * @supported weapp, rn
   */
  color?: string
}

/** 单选项目
 * @classification forms
 * @supported weapp, h5, rn
 * @example
 * ```tsx
 * export default class PageRadio extends Component {
 *   state = {
 *     list: [
 *       {
 *         value: '美国',
 *         text: '美国',
 *         checked: false
 *       },
 *       {
 *         value: '中国',
 *         text: '中国',
 *         checked: true
 *       },
 *       {
 *         value: '巴西',
 *         text: '巴西',
 *         checked: false
 *       },
 *       {
 *         value: '日本',
 *         text: '日本',
 *         checked: false
 *       },
 *       {
 *         value: '英国',
 *         text: '英国',
 *         checked: false
 *       },
 *       {
 *         value: '法国',
 *         text: '法国',
 *         checked: false
 *       }
 *     ]
 *   }
 *   render () {
 *     return (
 *       <View className='container'>
 *         <Head title='Radio' />
 *         <View className='page-body'>
 *           <View className='page-section'>
 *             <Text>默认样式</Text>
 *             <Radio value='选中' checked>选中</Radio>
 *             <Radio style='margin-left: 20rpx' value='未选中'>未选中</Radio>
 *           </View>
 *           <View className='page-section'>
 *             <Text>推荐展示样式</Text>
 *             <View className='radio-list'>
 *               <RadioGroup>
 *                 {this.state.list.map((item, i) => {
 *                   return (
 *                     <Label className='radio-list__label' for={i} key={i}>
 *                       <Radio className='radio-list__radio' value={item.value} checked={item.checked}>{item.text}</Radio>
 *                     </Label>
 *                   )
 *                 })}
 *               </RadioGroup>
 *             </View>
 *           </View>
 *         </View>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/radio.html
 */
declare const Radio: ComponentType<RadioProps>

export { Radio, RadioProps }
