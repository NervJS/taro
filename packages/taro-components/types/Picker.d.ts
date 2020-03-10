import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction, FormItemProps } from './common'

/** 选择器通用参数 */
interface PickerStandardProps extends StandardProps, FormItemProps {
  /** 选择器类型，默认是普通选择器
   * @default "selector"
   * @supported weapp, h5, rn
   */
  mode: keyof PickerStandardProps.mode
  /** 是否禁用
   * @default false
   * @supported weapp, h5, rn
   */
  disabled?: boolean
  /** 取消选择或点遮罩层收起 picker 时触发
   * @supported weapp, h5, rn
   */
  onCancel?: CommonEventFunction
}

declare namespace PickerStandardProps {
  /** 选择器类型 */
  interface mode {
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
}

/** 普通选择器：mode = selector */
interface PickerSelectorProps extends PickerStandardProps {
  /** 选择器类型 */
  mode: 'selector'
  /** mode为 selector 或 multiSelector 时，range 有效
   * @supported weapp, h5, rn
   * @default []
   */
  range: string[] | number[] | Object[]
  /** 当 range 是一个 Object Array 时，通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容
   * @supported weapp, h5, rn
   */
  rangeKey?: string
  /** 表示选择了 range 中的第几个（下标从 0 开始）
   * @supported weapp, h5, rn
   * @default 0
   */
  value: number
  /** value 改变时触发 change 事件，event.detail = {value}
   * @supported weapp, h5, rn
   */
  onChange: CommonEventFunction<PickerSelectorProps.onChangeEvnetDetail>
}

declare namespace PickerSelectorProps {
  interface onChangeEvnetDetail {
    /** 表示变更值的下标 */
    value: number
  }
}

/** 多列选择器：mode = multiSelector */
interface PickerMultiSelectorProps extends PickerStandardProps {
  /** 选择器类型 */
  mode: 'multiSelector'
  /** mode为 selector 或 multiSelector 时，range 有效
   * @supported weapp, h5, rn
   * @default []
   */
  range: Array<string[]> | Array<number[]> | Array<Object[]>
  /** 当 range 是一个 Object Array 时，通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容
   * @supported weapp, h5, rn
   */
  rangeKey?: string
  /** 表示选择了 range 中的第几个（下标从 0 开始）
   * @supported weapp, h5, rn
   * @default []
   */
  value: number[] | string[] | Object[]
  /** 当 value 改变时触发 change 事件，event.detail = {value}
   * @supported weapp, h5, rn
   */
  onChange: CommonEventFunction<PickerMultiSelectorProps.onChangeEvnetDetail>
  /** 列改变时触发
   * @supported weapp, h5, rn
   */
  onColumnChange?: CommonEventFunction<PickerMultiSelectorProps.onColumnChangeEvnetDetail>
}

declare namespace PickerMultiSelectorProps {
  interface onChangeEvnetDetail {
    /** 表示变更值的下标 */
    value: number
  }
  interface onColumnChangeEvnetDetail {
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
  /** value 的值表示选择了 range 中的第几个（下标从 0 开始）
   * @supported weapp, h5, rn
   */
  value: string
  /** 仅当 mode = time|date 时有效，表示有效时间范围的开始，字符串格式为"hh:mm"
   * @supported weapp, h5, rn
   */
  start?: string
  /** 仅当 mode = time|date 时有效，表示有效时间范围的结束，字符串格式为"hh:mm"
   * @supported weapp, h5, rn
   */
  end?: string
  /** value 改变时触发 change 事件，event.detail = {value}
   * @supported weapp, h5, rn
   */
  onChange: CommonEventFunction<PickerTimeProps.onChangeEvnetDetail>
}

declare namespace PickerTimeProps {
  interface onChangeEvnetDetail {
    /** 表示变更值的下标 */
    value: number
  }
}

/** 日期选择器：mode = date */
interface PickerDateProps extends PickerStandardProps {
  /** 选择器类型 */
  mode: 'date'
  /** 表示选中的日期，格式为"YYYY-MM-DD"
   * @supported weapp, h5, rn
   * @default 0
   */
  value: string
  /** 仅当 mode = time|date 时有效，表示有效时间范围的开始，字符串格式为"hh:mm"
   * @supported weapp, h5, rn
   */
  start?: string
  /** 仅当 mode = time|date 时有效，表示有效时间范围的结束，字符串格式为"hh:mm"
   * @supported weapp, h5, rn
   */
  end?: string
  /** 有效值 year, month, day，表示选择器的粒度
   * @supported weapp, h5, rn
   * @default "day"
   */
  fields?: keyof PickerDateProps.fields
  /** value 改变时触发 change 事件，event.detail = {value}
   * @supported weapp, h5, rn
   */
  onChange: CommonEventFunction<PickerDateProps.onChangeEvnetDetail>
}

declare namespace PickerDateProps {
  interface fields {
    /** 选择器粒度为年 */
    year
    /** 选择器粒度为月份 */
    month
    /** 选择器粒度为天 */
    day
  }
  interface onChangeEvnetDetail {
    /** 表示变更值的下标 */
    value: number
  }
}

/** 省市区选择器：mode = region */
interface PickerRegionProps extends PickerStandardProps {
  /** 选择器类型 */
  mode: 'region'
  /** 表示选中的省市区，默认选中每一列的第一个值
   * @supported weapp, h5, rn
   * @default []
   */
  value: string[]
  /** 可为每一列的顶部添加一个自定义的项
   * @supported weapp, h5, rn
   */
  customItem?: string
  /** value 改变时触发 change 事件，event.detail = {value, code, postcode}，其中字段 code 是统计用区划代码，postcode 是邮政编码	
   * @supported weapp, h5, rn
   */
  onChange: CommonEventFunction<PickerRegionProps.onChangeEvnetDetail>
}

declare namespace PickerRegionProps {
  interface onChangeEvnetDetail {
    /** 表示变更值的下标 */
    value: number
    /** 统计用区划代码 */
    code: string | number
    /** 邮政编码 */
    postcode: string | number
  }
}

/** 从底部弹起的滚动选择器
 * @classification forms
 * @supported weapp, h5, rn, swan, alipay, tt
 * @example
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
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/picker.html
 */
declare const Picker: ComponentType<
  | PickerSelectorProps
  | PickerMultiSelectorProps
  | PickerTimeProps
  | PickerDateProps
  | PickerRegionProps
>

export {
  Picker,
  PickerStandardProps,
  PickerSelectorProps,
  PickerMultiSelectorProps,
  PickerTimeProps,
  PickerDateProps,
  PickerRegionProps
}
