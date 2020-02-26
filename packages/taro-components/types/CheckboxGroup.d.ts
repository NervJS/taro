import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'

interface CheckboxGroupProps extends StandardProps, FormItemProps {
  /** 表单组件中加上 name 来作为 key
   * @supported h5
   */
  name?: string

  /** `<CheckboxGroup/>` 中选中项发生改变是触发 change 事件
   * 
   * event.detail = { value: [选中的checkbox的 value 的数组] }
   * @supported weapp, h5, rn
   */
  onChange?: CommonEventFunction<{ value: string[] }>
}

/** 多项选择器，内部由多个checkbox组成
 * @classification forms
 * @supported weapp, h5, rn
 * @example
 * ```tsx
 * export default class PageCheckbox extends Component {
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
 *       <View className='page-body'>
 *         <View className='page-section'>
 *           <Text>默认样式</Text>
 *           <Checkbox value='选中' checked>选中</Checkbox>
 *           <Checkbox style='margin-left: 20rpx' value='未选中'>未选中</Checkbox>
 *         </View>
 *         <View className='page-section'>
 *           <Text>推荐展示样式</Text>
 *           {this.state.list.map((item, i) => {
 *             return (
 *               <Label className='checkbox-list__label' for={i} key={i}>
 *                 <Checkbox className='checkbox-list__checkbox' value={item.value} checked={item.checked}>{item.text}</Checkbox>
 *               </Label>
 *             )
 *           })}
 *         </View>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/checkbox-group.html
 */
declare const CheckboxGroup: ComponentType<CheckboxGroupProps>

export { CheckboxGroup, CheckboxGroupProps }
