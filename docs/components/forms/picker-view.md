---
title: PickerView
sidebar_label: PickerView
---

嵌入页面的滚动选择器
其中只可放置 picker-view-column 组件，其它节点不会显示

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/picker-view.html)

## 类型

```tsx
ComponentType<PickerViewProps>
```

## 示例代码

```tsx
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

## PickerViewProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>number[]</code></td>
      <td style="text-align:center">否</td>
      <td>数组中的数字依次表示 picker-view 内的 picker-view-column 选择的第几项（下标从 0 开始），数字大于 picker-view-column 可选项长度时，选择最后一项。</td>
    </tr>
    <tr>
      <td>indicatorStyle</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>设置选择器中间选中框的样式</td>
    </tr>
    <tr>
      <td>indicatorClass</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>设置选择器中间选中框的类名</td>
    </tr>
    <tr>
      <td>maskStyle</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>设置蒙层的样式</td>
    </tr>
    <tr>
      <td>maskClass</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>设置蒙层的类名</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>当滚动选择，value 改变时触发 change 事件，event.detail = {value: value}；value为数组，表示 picker-view 内的 picker-view-column 当前选择的是第几项（下标从 0 开始）</td>
    </tr>
    <tr>
      <td>onPickStart</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>当滚动选择开始时候触发事件</td>
    </tr>
    <tr>
      <td>onPickEnd</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>当滚动选择结束时候触发事件</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| PickerViewProps.value | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| PickerViewProps.indicatorStyle | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| PickerViewProps.indicatorClass | ✔️ | ✔️ | ✔️ |  |  |  |
| PickerViewProps.maskStyle | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| PickerViewProps.maskClass | ✔️ | ✔️ | ✔️ |  |  |  |
| PickerViewProps.onChange | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| PickerViewProps.onPickStart | ✔️ |  |  |  |  |  |
| PickerViewProps.onPickEnd | ✔️ |  |  |  |  |  |

### onChangeEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>number[]</code></td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| PickerView | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
