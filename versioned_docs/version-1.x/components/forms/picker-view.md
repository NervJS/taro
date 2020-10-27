---
title: PickerView
sidebar_label: PickerView
---

##### 嵌入页面的滚动选择器

> 属性

| 属性名 | 类型 | 说明 |
| :- | :- | :- |
| value      | NumberArray |  数组中的数字依次表示 picker-view 内的 picker-view-column 选择的第几项（下标从 0 开始），数字大于 picker-view-column 可选项长度时，选择最后一项。    |
| indicatorStyle  | String    | 设置选择器中间选中框的样式 |
| indicatorClass      | String   | 设置选择器中间选中框的类名   |
| maskStyle | String  | 设置蒙层的样式  |
| maskClass | String| 设置蒙层的类名     |
| onChange   | EventHandle | 当滚动选择，value 改变时触发 change 事件，event.detail = {value: value}；value 为数组，表示 picker-view 内的 picker-view-column 当前选择的是第几项（下标从 0 开始） |

> 各端支持度

| 属性 | 微信小程序 | H5 | ReactNative | 百度小程序 | 支付宝小程序 | 字节跳动小程序 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| value | ✔ |  | x | ✔ | ✔ | ✔ |
| indicatorStyle | ✔ |  | x | ✔ | ✔ | ✔ |
| indicatorClass | ✔ |  | x | ✔ | ✔ |  |
| maskStyle | ✔ |  | x | ✔ | ✔ | ✔ |
| maskClass | ✔ |  | x | ✔ | ✔ |  |
| onChange | ✔ |  | x | ✔ | ✔ | ✔ |



##### PickerViewColumn

##### 仅可放置于 PickerView 中，其孩子节点的高度会自动设置成与 PickerView 的选中框的高度一致


###### 示例：

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, PickerView, PickerViewColumn } from '@tarojs/components'

export default class Picks extends Component {

  constructor () {
    super(...arguments)
    const date = new Date()
    const years = []
    const months = []
    const days = []
    for (let i = 1990; i <= date.getFullYear(); i++) {
      years.push(i)
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }
    for (let i = 1; i <= 31; i++) {
      days.push(i)
    }
    this.state = {
      years: years,
      year: date.getFullYear(),
      months: months,
      month: 2,
      days: days,
      day: 2,
      value: [9999, 1, 1]
    }
  }

  onChange = e => {
    const val = e.detail.value
    this.setState({
      year: this.state.years[val[0]],
      month: this.state.months[val[1]],
      day: this.state.days[val[2]],
      value: val
    })
  }

  render() {
    return (
      <View>
        <View>{this.state.year}年{this.state.month}月{this.state.day}日</View>
        <PickerView indicatorStyle='height: 50px;' style='width: 100%; height: 300px;' value={this.state.value} onChange={this.onChange}>
          <PickerViewColumn>
            {this.state.years.map(item => {
              return (
                <View>{item}年</View>
              );
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {this.state.months.map(item => {
              return (
                <View>{item}月</View>
              )
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {this.state.days.map(item => {
              return (
                <View>{item}日</View>
              )
            })}
          </PickerViewColumn>
        </PickerView>
      </View>
    )
  }
}

```
