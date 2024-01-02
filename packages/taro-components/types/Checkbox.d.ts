import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'
interface CheckboxProps extends StandardProps {
  /** `<Checkbox/>`标识，选中时触发`<CheckboxGroup/>`的 change 事件，并携带 `<Checkbox/>` 的 value
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  value: string
  /** 是否禁用
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   * @default false
   */
  disabled?: boolean
  /** 当前是否选中，可用来设置默认选中
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   * @default false
   */
  checked?: boolean
  /** checkbox的颜色，同 css 的 color
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  color?: string
  /**
   * Checkbox 的名字
   * @supported h5, harmony
   */
  name?: string
  /** 用于透传 `WebComponents` 上的属性到内部 H5 标签上
   * @supported h5
   */
  nativeProps?: Record<string, unknown>
  /** 无障碍访问，（属性）元素的额外描述
   * @supported qq
   */
  ariaLabel?: string
  /** 选中项发生变化时触发 change 事件，小程序无此 API
   * @supported alipay, h5, rn
   */
  onChange?: CommonEventFunction<{
    value: string[]
  }>
}
/** 多选项目
 * @classification forms
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony
 * @example_react
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
 * @example_vue
 * ```html
 * <template>
 *   <view class="container">
 *     <view class="page-section">
 *       <text>默认样式</text>
 *       <checkbox value="选中" :checked="true">选中</checkbox>
 *       <checkbox style="margin-left: 20rpx;" value="未选中">未选中</checkbox>
 *     </view>
 *     <view class="page-section">
 *       <text>推荐展示样式(Taro 团队成员):</text>
 *       <label v-for="item in list" class="checkbox-list__label">
 *         <checkbox class="checkbox-list__checkbox" :value="item.value" :checked="item.checked">{{ item.text }}</checkbox>
 *       </label>
 *     </view>
 *   </view>
 * </template>
 *
 * <script>
 * export default {
 *   data() {
 *     return {
 *       list: [
 *         {
 *           value: '美国',
 *           text: '美国',
 *           checked: false
 *         },
 *         {
 *           value: '中国',
 *           text: '中国',
 *           checked: true
 *         },
 *         {
 *           value: '巴西',
 *           text: '巴西',
 *           checked: false
 *         },
 *         {
 *           value: '日本',
 *           text: '日本',
 *           checked: false
 *         },
 *         {
 *           value: '英国',
 *           text: '英国',
 *           checked: false
 *         },
 *         {
 *           value: '法国',
 *           text: '法国',
 *           checked: false
 *         }
 *       ]
 *     }
 *   }
 * }
 * </script>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/checkbox.html
 */
declare const Checkbox: ComponentType<CheckboxProps>
export { Checkbox, CheckboxProps }
