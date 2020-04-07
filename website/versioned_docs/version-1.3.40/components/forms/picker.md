---
title: Picker
sidebar_label: Picker
id: version-1.3.40-picker
original_id: picker
---

从底部弹起的滚动选择器

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/picker.html)

## 类型

```tsx
ComponentType<PickerSelectorProps | PickerMultiSelectorProps | PickerTimeProps | PickerDateProps | PickerRegionProps>
```

## 示例代码

```tsx
export default class PagePicker extends Component {
  state = {
    selector: ['美国', '中国', '巴西', '日本'],
    selectorChecked: '美国',
    timeSel: '12:01',
    dateSel: '2018-04-22'
  }

  onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
  }

  onTimeChange = e => {
    this.setState({
      timeSel: e.detail.value
    })
  }
  onDateChange = e => {
    this.setState({
      dateSel: e.detail.value
    })
  }

  render () {
    return (
      <View className='container'>
        <View className='page-body'>
          <View className='page-section'>
            <Text>地区选择器</Text>
            <View>
              <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
                <View className='picker'>
                  当前选择：{this.state.selectorChecked}
                </View>
              </Picker>
            </View>
          </View>
          <View className='page-section'>
            <Text>时间选择器</Text>
            <View>
              <Picker mode='time' onChange={this.onTimeChange}>
                <View className='picker'>
                  当前选择：{this.state.timeSel}
                </View>
              </Picker>
            </View>
          </View>
          <View className='page-section'>
            <Text>日期选择器</Text>
            <View>
              <Picker mode='date' onChange={this.onDateChange}>
                <View className='picker'>
                  当前选择：{this.state.dateSel}
                </View>
              </Picker>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
```

## PickerStandardProps

选择器通用参数

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| mode | "selector" or "multiSelector" or "time" or "date" or "region" | `"selector"` | 是 | 选择器类型，默认是普通选择器 |
| disabled | `boolean` | `false` | 否 | 是否禁用 |
| onCancel | `BaseEventOrigFunction<any>` |  | 否 | 取消选择或点遮罩层收起 picker 时触发 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerStandardProps.mode | ✔️ | ✔️ | ✔️ |
| PickerStandardProps.disabled | ✔️ | ✔️ | ✔️ |
| PickerStandardProps.onCancel | ✔️ | ✔️ | ✔️ |

### mode

选择器类型

| 参数 | 说明 |
| --- | --- |
| selector | 普通选择器 |
| multiSelector | 多列选择器 |
| time | 时间选择器 |
| date | 日期选择器 |
| region | 省市区选择器 |

## PickerSelectorProps

普通选择器：mode = selector

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| mode | `"selector"` |  | 是 | 选择器类型 |
| range | string[] or number[] or Object[] | `[]` | 是 | mode为 selector 或 multiSelector 时，range 有效 |
| rangeKey | `string` |  | 否 | 当 range 是一个 Object Array 时，通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容 |
| value | `number` | `0` | 是 | 表示选择了 range 中的第几个（下标从 0 开始） |
| onChange | `BaseEventOrigFunction<onChangeEventDetail>` |  | 是 | value 改变时触发 change 事件，event.detail = {value} |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerSelectorProps.range | ✔️ | ✔️ | ✔️ |
| PickerSelectorProps.rangeKey | ✔️ | ✔️ | ✔️ |
| PickerSelectorProps.value | ✔️ | ✔️ | ✔️ |
| PickerSelectorProps.onChange | ✔️ | ✔️ | ✔️ |

### onChangeEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | string or number | 表示变更值的下标 |

## PickerMultiSelectorProps

多列选择器：mode = multiSelector

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| mode | `"multiSelector"` |  | 是 | 选择器类型 |
| range | string[][] or number[][] or Object[][] | `[]` | 是 | mode为 selector 或 multiSelector 时，range 有效 |
| rangeKey | `string` |  | 否 | 当 range 是一个 Object Array 时，通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容 |
| value | string[] or number[] or Object[] | `[]` | 是 | 表示选择了 range 中的第几个（下标从 0 开始） |
| onChange | `BaseEventOrigFunction<onChangeEventDetail>` |  | 是 | 当 value 改变时触发 change 事件，event.detail = {value} |
| onColumnChange | `BaseEventOrigFunction<onColumnChangeEvnetDetail>` |  | 否 | 列改变时触发 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerMultiSelectorProps.range | ✔️ | ✔️ | ✔️ |
| PickerMultiSelectorProps.rangeKey | ✔️ | ✔️ | ✔️ |
| PickerMultiSelectorProps.value | ✔️ | ✔️ | ✔️ |
| PickerMultiSelectorProps.onChange | ✔️ | ✔️ | ✔️ |
| PickerMultiSelectorProps.onColumnChange | ✔️ | ✔️ | ✔️ |

### onChangeEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | `number[]` | 表示变更值的下标 |

### onColumnChangeEvnetDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| column | `number` | 表示改变了第几列（下标从0开始） |
| value | `number` | 表示变更值的下标 |

## PickerTimeProps

时间选择器：mode = time

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| mode | `"time"` | 是 | 选择器类型 |
| value | `string` | 是 | value 的值表示选择了 range 中的第几个（下标从 0 开始） |
| start | `string` | 否 | 仅当 mode = timeordate 时有效，表示有效时间范围的开始，字符串格式为"hh:mm" |
| end | `string` | 否 | 仅当 mode = timeordate 时有效，表示有效时间范围的结束，字符串格式为"hh:mm" |
| onChange | `BaseEventOrigFunction<onChangeEventDetail>` | 是 | value 改变时触发 change 事件，event.detail = {value} |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerTimeProps.value | ✔️ | ✔️ | ✔️ |
| PickerTimeProps.start | ✔️ | ✔️ | ✔️ |
| PickerTimeProps.end | ✔️ | ✔️ | ✔️ |
| PickerTimeProps.onChange | ✔️ | ✔️ | ✔️ |

### onChangeEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | `string` | 表示选中的时间 |

## PickerDateProps

日期选择器：mode = date

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| mode | `"date"` |  | 是 | 选择器类型 |
| value | `string` | `0` | 是 | 表示选中的日期，格式为"YYYY-MM-DD" |
| start | `string` |  | 否 | 仅当 mode = timeordate 时有效，表示有效时间范围的开始，字符串格式为"hh:mm" |
| end | `string` |  | 否 | 仅当 mode = timeordate 时有效，表示有效时间范围的结束，字符串格式为"hh:mm" |
| fields | "year" or "month" or "day" | `"day"` | 否 | 有效值 year, month, day，表示选择器的粒度 |
| onChange | `BaseEventOrigFunction<onChangeEventDetail>` |  | 是 | value 改变时触发 change 事件，event.detail = {value} |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerDateProps.value | ✔️ | ✔️ | ✔️ |
| PickerDateProps.start | ✔️ | ✔️ | ✔️ |
| PickerDateProps.end | ✔️ | ✔️ | ✔️ |
| PickerDateProps.fields | ✔️ | ✔️ | ✔️ |
| PickerDateProps.onChange | ✔️ | ✔️ | ✔️ |

### fields

| 参数 | 说明 |
| --- | --- |
| year | 选择器粒度为年 |
| month | 选择器粒度为月份 |
| day | 选择器粒度为天 |

### onChangeEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | `string` | 表示选中的日期 |

## PickerRegionProps

省市区选择器：mode = region

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| mode | `"region"` |  | 是 | 选择器类型 |
| value | `string[]` | `[]` | 是 | 表示选中的省市区，默认选中每一列的第一个值 |
| customItem | `string` |  | 否 | 可为每一列的顶部添加一个自定义的项 |
| onChange | `BaseEventOrigFunction<onChangeEventDetail>` |  | 是 | value 改变时触发 change 事件，event.detail = {value, code, postcode}，其中字段 code 是统计用区划代码，postcode 是邮政编码 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerRegionProps.value | ✔️ | ✔️ | ✔️ |
| PickerRegionProps.customItem | ✔️ | ✔️ | ✔️ |
| PickerRegionProps.onChange | ✔️ | ✔️ | ✔️ |

### onChangeEventDetail

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| value | `string[]` | 是 | 表示选中的省市区 |
| code | `string[]` | 是 | 统计用区划代码 |
| postcode | `string` | 否 | 邮政编码 |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Picker | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
