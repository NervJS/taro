import { ComponentType } from 'react'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'
/** 选择器通用参数 */
interface PickerStandardProps extends StandardProps, FormItemProps {
  /**
   * 选择器的标题，微信小程序中仅安卓可用
   * @supported weapp
   */
  headerText?: string
  /**
   * 选择器类型，默认是普通选择器
   * @default "selector"
   * @supported weapp, h5, rn, harmony_hybrid
   */
  mode?: keyof PickerStandardProps.Mode
  /**
   * 是否禁用
   * @default false
   * @supported weapp, h5, rn, harmony_hybrid
   */
  disabled?: boolean
  /**
   * 取消选择或点遮罩层收起 picker 时触发
   * @supported weapp, h5, rn, harmony_hybrid
   */
  onCancel?: CommonEventFunction
}
declare namespace PickerStandardProps {
  /** 选择器类型 */
  interface Mode {
    /** 普通选择器 */
    selector
    /** 多列选择器 */
    multiSelector
    /** 时间选择器 */
    time
    /** 日期选择器 */
    date
    /** 省市区选择器 */
    region
  }
  interface PickerText {
    okText?: string
    cancelText?: string
  }
}
/** 普通选择器：mode = selector */
interface PickerSelectorProps extends PickerStandardProps {
  /** 选择器类型 */
  mode?: 'selector'
  /**
   * mode为 selector 或 multiSelector 时，range 有效
   * @supported weapp, h5, rn, harmony_hybrid
   * @default []
   */
  range: string[] | number[] | Record<string, any>[]
  /**
   * 当 range 是一个 Object Array 时，通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容
   * @supported weapp, h5, rn, harmony_hybrid
   */
  rangeKey?: string
  /**
   * 表示选择了 range 中的第几个（下标从 0 开始）
   * @supported weapp, h5, rn, harmony_hybrid
   * @default 0
   */
  value?: number
  /** 设置 React 非受控状态下的初始取值
   * @supported weapp, h5, rn, harmony_hybrid
   */
  defaultValue?: number
  /**
   * mode为 selector 或 multiSelector 时 itemStyle 有效
   * @supported rn
   * @default {}
   */
  itemStyle?: StyleProp<TextStyle>
  /**
   * mode为 selector 或 multiSelector 时 indicatorStyle 有效
   * @supported rn
   * @default {}
   */
  indicatorStyle?: StyleProp<ViewStyle>
  /**
   * value 改变时触发 change 事件
   * @supported weapp, h5, rn, harmony_hybrid
   */
  onChange?: CommonEventFunction<PickerSelectorProps.ChangeEventDetail>
  /**
   * 用于替换组件内部文本
   * @supported h5, harmony_hybrid
   */
  textProps?: PickerStandardProps.PickerText
}
declare namespace PickerSelectorProps {
  interface ChangeEventDetail {
    /** 表示变更值的下标 */
    value: string | number
  }
}
/** 多列选择器：mode = multiSelector */
interface PickerMultiSelectorProps extends PickerStandardProps {
  /** 选择器类型 */
  mode: 'multiSelector'
  /**
   * mode为 selector 或 multiSelector 时，range 有效
   * @supported weapp, h5, rn, harmony_hybrid
   * @default []
   */
  range: Array<string[]> | Array<number[]> | Array<Record<string, any>[]>
  /**
   * 当 range 是一个 Object Array 时，通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容
   * @supported weapp, h5, rn, harmony_hybrid
   */
  rangeKey?: string
  /**
   * 表示选择了 range 中的第几个（下标从 0 开始）
   * @supported weapp, h5, rn, harmony_hybrid
   * @default []
   */
  value: number[] | string[] | Record<string, any>[]
  /**
   * mode为 selector 或 multiSelector 时 itemStyle 有效
   * @supported rn
   * @default {}
   */
  itemStyle?: StyleProp<TextStyle>
  /**
   * mode为 selector 或 multiSelector 时 indicatorStyle 有效
   * @supported rn
   * @default {}
   */
  indicatorStyle?: StyleProp<ViewStyle>
  /**
   * 当 value 改变时触发 change 事件
   * @supported weapp, h5, rn, harmony_hybrid
   */
  onChange: CommonEventFunction<PickerMultiSelectorProps.ChangeEventDetail>
  /**
   * 列改变时触发
   * @supported weapp, h5, rn, harmony_hybrid
   */
  onColumnChange?: CommonEventFunction<PickerMultiSelectorProps.ColumnChangeEventDetail>
}
declare namespace PickerMultiSelectorProps {
  interface ChangeEventDetail {
    /** 表示变更值的下标 */
    value: number[]
  }
  interface ColumnChangeEventDetail {
    /** 表示改变了第几列（下标从0开始） */
    column: number
    /** 表示变更值的下标 */
    value: number
  }
}
/** 时间选择器：mode = time */
interface PickerTimeProps extends PickerStandardProps {
  /** 选择器类型 */
  mode: 'time'
  /**
   * value 的值表示选择了 range 中的第几个（下标从 0 开始）
   * @supported weapp, h5, rn, harmony_hybrid
   */
  value?: string
  /** 设置 React 非受控状态下的初始取值
   * @supported weapp, h5, rn
   */
  defaultValue?: string
  /**
   * 仅当 mode 为 "time" 或 "date" 时有效，表示有效时间范围的开始，字符串格式为"hh:mm"
   * @supported weapp, h5, rn, harmony_hybrid
   */
  start?: string
  /**
   * 仅当 mode 为 "time" 或 "date" 时有效，表示有效时间范围的结束，字符串格式为"hh:mm"
   * @supported weapp, h5, rn, harmony_hybrid
   */
  end?: string
  /**
   * value 改变时触发 change 事件
   * @supported weapp, h5, rn, harmony_hybrid
   */
  onChange: CommonEventFunction<PickerTimeProps.ChangeEventDetail>
}
declare namespace PickerTimeProps {
  interface ChangeEventDetail {
    /** 表示选中的时间 */
    value: string
  }
}
/** 日期选择器：mode = date */
interface PickerDateProps extends PickerStandardProps {
  /** 选择器类型 */
  mode: 'date'
  /**
   * 表示选中的日期，格式为"YYYY-MM-DD"
   * @supported weapp, h5, rn, harmony_hybrid
   * @default 0
   */
  value: string
  /** 设置 React 非受控状态下的初始取值
   * @supported weapp, h5, rn
   */
  defaultValue?: string
  /**
   * 仅当 mode 为 "time" 或 "date" 时有效，表示有效时间范围的开始，字符串格式为"YYYY-MM-DD"
   * @supported weapp, h5, rn, harmony_hybrid
   */
  start?: string
  /**
   * 仅当 mode 为 "time" 或 "date" 时有效，表示有效时间范围的结束，字符串格式为"YYYY-MM-DD"
   * @supported weapp, h5, rn, harmony_hybrid
   */
  end?: string
  /**
   * 有效值 year, month, day，表示选择器的粒度
   * @supported weapp, h5, rn, harmony_hybrid
   * @default "day"
   */
  fields?: keyof PickerDateProps.Fields
  /**
   * value 改变时触发 change 事件
   * @supported weapp, h5, rn, harmony_hybrid
   */
  onChange: CommonEventFunction<PickerDateProps.ChangeEventDetail>
}
declare namespace PickerDateProps {
  interface Fields {
    /** 选择器粒度为年 */
    year
    /** 选择器粒度为月份 */
    month
    /** 选择器粒度为天 */
    day
  }
  interface ChangeEventDetail {
    /** 表示选中的日期 */
    value: string
  }
}
/** 省市区选择器：mode = region */
interface PickerRegionProps extends PickerStandardProps {
  /** 选择器类型 */
  mode: 'region'
  /**
   * 表示选中的省市区，默认选中每一列的第一个值
   * @supported weapp, h5, rn, harmony_hybrid
   * @default []
   */
  value?: string[]
  /** 设置 React 非受控状态下的初始取值
   * @supported weapp, h5, rn
   */
  defaultValue?: string[]
  /**
   * 可为每一列的顶部添加一个自定义的项
   * @supported weapp, h5, rn, harmony_hybrid
   */
  customItem?: string
  /**
   * 选择器层级
   * @supported weapp
   * @default "region"
   */
  level?: keyof PickerRegionProps.Level
  /**
   * 自定义省市区数据
   * @supported rn
   */
  regionData?: PickerRegionProps.RegionData[]
  /**
   * value 改变时触发 change 事件
   * @supported weapp, h5, rn, harmony_hybrid
   */
  onChange: CommonEventFunction<PickerRegionProps.ChangeEventDetail>
}
declare namespace PickerRegionProps {
  interface ChangeEventDetail {
    /** 表示选中的省市区 */
    value: string[]
    /** 统计用区划代码 */
    code: string[]
    /** 邮政编码 */
    postcode?: string
  }
  interface RegionData {
    value: string
    code: string
    postcode?: string
  }
  interface Level {
    /** 省级选择器 */
    province
    /** 市级选择器 */
    city
    /** 区级选择器 */
    region
    /** 街道选择器 */
    'sub-district'
  }
}
/**
 * 从底部弹起的滚动选择器
 * @classification forms
 * @supported weapp, swan, alipay, tt, h5, rn, harmony, harmony_hybrid
 * @example_react
 * ```tsx
 * export default class PagePicker extends Component {
 *   state = {
 *     selector: ['美国', '中国', '巴西', '日本'],
 *     selectorChecked: '美国',
 *     timeSel: '12:01',
 *     dateSel: '2018-04-22'
 *   }
 *
 *   onChange = e => {
 *     this.setState({
 *       selectorChecked: this.state.selector[e.detail.value]
 *     })
 *   }
 *
 *   onTimeChange = e => {
 *     this.setState({
 *       timeSel: e.detail.value
 *     })
 *   }
 *   onDateChange = e => {
 *     this.setState({
 *       dateSel: e.detail.value
 *     })
 *   }
 *
 *   render () {
 *     return (
 *       <View className='container'>
 *         <View className='page-body'>
 *           <View className='page-section'>
 *             <Text>地区选择器</Text>
 *             <View>
 *               <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
 *                 <View className='picker'>
 *                   当前选择：{this.state.selectorChecked}
 *                 </View>
 *               </Picker>
 *             </View>
 *           </View>
 *           <View className='page-section'>
 *             <Text>时间选择器</Text>
 *             <View>
 *               <Picker mode='time' onChange={this.onTimeChange}>
 *                 <View className='picker'>
 *                   当前选择：{this.state.timeSel}
 *                 </View>
 *               </Picker>
 *             </View>
 *           </View>
 *           <View className='page-section'>
 *             <Text>日期选择器</Text>
 *             <View>
 *               <Picker mode='date' onChange={this.onDateChange}>
 *                 <View className='picker'>
 *                   当前选择：{this.state.dateSel}
 *                 </View>
 *               </Picker>
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
 *   <view class="page-body">
 *     <view class="page-section">
 *       <text>地区选择器</text>
 *       <view>
 *         <picker mode="selector" :range="selector" `@change="onChange">
 *           <view class="picker">
 *             当前选择：{{selectorChecked}}
 *           </view>
 *         </picker>
 *       </view>
 *     </view>
 *     <view class="page-section">
 *       <text>时间选择器</text>
 *       <view>
 *         <picker mode="time" `@change="onTimeChange">
 *           <view class="picker">
 *             当前选择：{{timeSel}}
 *           </view>
 *         </picker>
 *       </view>
 *     </view>
 *     <view class="page-section">
 *       <text>日期选择器</text>
 *       <view>
 *         <picker mode="date" `@change="onDateChange">
 *           <view class="picker">
 *             当前选择：{{dateSel}}
 *           </view>
 *         </picker>
 *       </view>
 *     </view>
 *   </view>
 * </template>
 *
 * <script>
 *   export default {
 *     data() {
 *       return {
 *         selector: ['美国', '中国', '巴西', '日本'],
 *         selectorChecked: '美国',
 *         timeSel: '12:01',
 *         dateSel: '2018-04-22'
 *       }
 *     },
 *     methods: {
 *       onChange: function(e) {
 *         this.selectorChecked = this.selector[e.detail.value]
 *       },
 *
 *       onTimeChange: function(e) {
 *         this.timeSel = e.detail.value
 *       },
 *
 *       onDateChange: function(e) {
 *         this.dateSel = e.detail.value
 *       }
 *     }
 *   }
 * </script>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/picker.html
 */
declare const Picker: ComponentType<
  PickerMultiSelectorProps | PickerTimeProps | PickerDateProps | PickerRegionProps | PickerSelectorProps
>
export {
  Picker,
  PickerStandardProps,
  PickerSelectorProps,
  PickerMultiSelectorProps,
  PickerTimeProps,
  PickerDateProps,
  PickerRegionProps,
}
