import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'
interface RadioProps extends StandardProps {
  /** `<Radio/>` 标识。当该`<Radio/>` 选中时，`<RadioGroup/>`的 change 事件会携带`<Radio/>`的 value
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  value?: string
  /** 当前是否选中
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  checked?: boolean
  /** 是否禁用
   * @default false
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  disabled?: boolean
  /** Radio 的颜色，同 css 的 color
   * @default "#09BB07"
   * @supported weapp, alipay, swan, tt, qq, jd, rn
   */
  color?: string
  /**
   * Radio 的名字
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
  /** <radio-group/> 中的选中项发生变化时触发 change 事件
   * @supported h5, rn
   */
  onChange?: CommonEventFunction<{
    value?: string
  }>
}
/** 单选项目
 * @classification forms
 * @supported weapp, alipay, swan, tt, qq, h5, rn, harmony
 * @example_react
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
 * @example_vue
 * ```html
 * <template>
 *   <view class="container">
 *     <view class="page-section">
 *       <text>默认样式</text>
 *       <radio value="选中" :checked="true">选中</radio>
 *       <radio style="margin-left: 20rpx;" value="未选中">未选中</radio>
 *     </view>
 *     <view class="page-section">
 *       <text>推荐展示样式(Taro 团队成员):</text>
 *         <radio-group `@change="onChange">
 *           <label v-for="item in list" class="checkbox-list__label">
 *             <radio class="checkbox-list__checkbox" :value="item.value" :checked="item.checked">{{ item.text }}</radio>
 *           </label>
 *         </radio-group>
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
 *           value: 'yuche',
 *           text: 'yuche',
 *           checked: false
 *         },
 *         {
 *           value: 'cjj',
 *           text: 'cjj',
 *           checked: false
 *         },
 *         {
 *           value: 'xiexiaoli',
 *           text: 'xiexiaoli',
 *           checked: false
 *         },
 *         {
 *           value: 'honly',
 *           text: 'honly',
 *           checked: false
 *         },
 *         {
 *           value: 'cs',
 *           text: 'cs',
 *           checked: false
 *         },
 *         {
 *           value: 'zhutianjian',
 *           text: 'zhutianjian',
 *           checked: false
 *         },
 *         {
 *           value: '隔壁老李',
 *           text: '隔壁老李',
 *           checked: true
 *         }
 *       ]
 *     }
 *   },
 *   methods: {
 *     onChange: function(e) {
 *       console.log(e.detail.value)
 *     }
 *   }
 * }
 * </script>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/radio.html
 */
declare const Radio: ComponentType<RadioProps>
export { Radio, RadioProps }
