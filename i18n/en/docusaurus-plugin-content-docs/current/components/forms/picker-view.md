---
title: PickerView
sidebar_label: PickerView
---

The scroll picker nested into a page. Only the `picker-view-column` component can be placed in it. Other nodes are not displayed.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/component/picker-view.html)

## Type

```tsx
ComponentType<PickerViewProps>
```

## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">


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
        <View>{this.state.year}-{this.state.month}-{this.state.day}</View>
        <PickerView indicatorStyle='height: 50px;' style='width: 100%; height: 300px;' value={this.state.value} onChange={this.onChange}>
          <PickerViewColumn>
            {this.state.years.map(item => {
              return (
                <View>{item}</View>
              );
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {this.state.months.map(item => {
              return (
                <View>{item}</View>
              )
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {this.state.days.map(item => {
              return (
                <View>{item}</View>
              )
            })}
          </PickerViewColumn>
        </PickerView>
      </View>
    )
  }
}

```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class="taro-example">
  <view>{{year}}-{{month}}-{{day}}</view>
  <picker-view indicator-style="height: 30px;" style="width: 100%; height: 300px;" :value="value" @change="onChange">
    <picker-view-column>
      <view v-for="(item, index) in years" :key="index">{{item}}</view>
    </picker-view-column>
    <picker-view-column>
      <view v-for="(item, index) in months" :key="index">{{item}}</view>
    </picker-view-column>
    <picker-view-column>
      <view v-for="(item, index) in days" :key="index">{{item}}</view>
    </picker-view-column>
  </picker-view>
</view>
</template>

<script>
  export default {
    name: "Index",
    data() {
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
      return {
        years: years,
        year: date.getFullYear(),
        months: months,
        month: 2,
        days: days,
        day: 2,
        value: [3, 1, 1]
      }
    },

    methods: {
      onChange: function(e) {
        const val = e.detail.value
        console.log(val)
        this.year = this.years[val[0]]
        this.month = this.months[val[1]]
        this.day = this.days[val[2]]
      }
    }
  }
</script>
```
  
</TabItem>
</Tabs>


## PickerViewProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>number[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The number in the array indicates the sequence number (starting from 0 in the subscript) of the item selected in the picker-view-column of picker-view. When the number is greater than the maximum length of the picker-view-column, the last item is selected.</td>
    </tr>
    <tr>
      <td>indicatorStyle</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the style of the checkbox in the picker.</td>
    </tr>
    <tr>
      <td>indicatorClass</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the name of the checkbox in the picker.</td>
    </tr>
    <tr>
      <td>maskStyle</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the style of the mask.</td>
    </tr>
    <tr>
      <td>maskClass</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the name of the mask.</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>A change event triggered when the list is scrolled for selection. event.detail = {`{value}`}. The value is an array, indicating the sequence number (starting from 0 in the subscript) of the item selected in the picker-view-column of picker-view.	</td>
    </tr>
    <tr>
      <td>onPickStart</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>An event triggered when scrolling starts.</td>
    </tr>
    <tr>
      <td>onPickEnd</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>An event triggered when scrolling ends.</td>
    </tr>
  </tbody>
</table>

## Property Support

| Property | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
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
      <th>Param</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>number[]</code></td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| PickerView | ✔️ | ✔️ | ✔️ | ✔️ |  | ✔️ |
