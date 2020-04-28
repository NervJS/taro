---
title: Picker
sidebar_label: Picker
---

#### 该 Picker 组件文档仅展示 H5 与 RN 支持属性与程度，其他相关属性请看各小程序官方文档

[微信小程序 Picker](https://developers.weixin.qq.com/miniprogram/dev/component/picker.html)。

[百度小程序 Picker](https://smartprogram.baidu.com/docs/develop/component/formlist/#picker/)。

[支付宝小程序 Picker](https://docs.alipay.com/mini/component/picker)。

[字节跳动小程序 Picker](https://developer.toutiao.com/docs/comp/picker.htmll)。

##### 普通选择器：mode = selector

> 属性及支持度

| H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :- | :- | :- | :- |
| ✔ | ✔ | range      | Array / Object Array | []     | mode 为 selector 或 multiSelector 时，range 有效    |
| ✔ | ✔ | rangeKey  | String    |        | 当 range 是一个 Object Array 时，通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容 |
| ✔ | ✔ | value      | Number    | 0      | value 的值表示选择了 range 中的第几个（下标从 0 开始）   |
| ✔ | ✔ | onChange | EventHandle  || value 改变时触发 change 事件，event.detail = value: value     |
| ✔ | ✔ | onCancel | EventHandle|        | 取消选择或点遮罩层收起 picker 时触发      |
| ✔ | ✔ | disabled   | Boolean              | false  | 是否禁用  |

##### 多列选择器：mode = multiSelector

> 属性及支持度

| H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :- | :- | :- | :- |
| ✔ | ✔ | range            | 二维 Array / 二维 Object Array | []     | mode 为 selector 或 multiSelector 时，range 有效。二维数组，长度表示多少列，数组的每项表示每列的数据，如[['a','b'], ['c','d']]   |
| ✔ | ✔ | rangeKey        | String      |        | 当 range 是一个 二维 Object Array 时，通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容                             |
| ✔ | ✔ | value            | Array    | []     | value 每一项的值表示选择了 range 对应项中的第几个（下标从 0 开始）    |
| ✔ | ✔ | onChange       | EventHandle  |        | value 改变时触发 change 事件，event.detail = value: value             |
| ✔ | ✔ | onColumnChange | EventHandle  |        | 某一列的值改变时触发 columnchange 事件，event.detail = column: column, value: value，column 的值表示改变了第几列（下标从 0 开始），value 的值表示变更值的下标 |
| ✔ | ✔ | onCancel       | EventHandle  |        | 取消选择时触发     |
| ✔ | ✔ | disabled         | Boolean   | false  | 是否禁用         |

##### 时间选择器：mode = time

> 属性及支持度

| H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :- | :- | :- | :- |
| ✔ | ✔ | value      | String      |   | 表示选中的时间，格式为'hh:mm'       |
| ✔ | ✔ | start      | String      |   | 表示有效时间范围的开始，字符串格式为'hh:mm'               |
| ✔ | ✔ | end        | String      |   | 表示有效时间范围的结束，字符串格式为'hh:mm'               |
| ✔ | ✔ | onChange | EventHandle |   | value 改变时触发 change 事件，event.detail = value: value |
| ✔ | ✔ | onCancel | EventHandle |   | 取消选择或点遮罩层收起 picker 时触发                      |
| ✔ | ✔ | disabled   | Boolean     | false  | 是否禁用                                                  |

##### 日期选择器：mode = date

> 属性及支持度

| H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :- | :- | :- | :- |
| ✔ | ✔ | value      | String      | new Date() | 表示选中的日期，格式为'YYYY-MM-DD'                        |
| ✔ | ✔ | start      | String      | 1970-01-01 | 表示有效日期范围的开始，字符串格式为'YYYY-MM-DD'          |
| ✔ | ✔ | end        | String      | 2999-01-01 | 表示有效日期范围的结束，字符串格式为'YYYY-MM-DD'          |
| ✔ | x | fields     | String      | day        | 有效值 year,month,day，表示选择器的粒度                   |
| ✔ | ✔ | onChange | EventHandle |            | value 改变时触发 change 事件，event.detail = value: value |
| ✔ | ✔ | onCancel | EventHandle |            | 取消选择或点遮罩层收起 picker 时触发                      |
| ✔ | ✔ | disabled   | Boolean     | false      | 是否禁用                                                  |



###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'

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
