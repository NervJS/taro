---
title: Slider
sidebar_label: Slider
---

##### 滑动选择器

> 属性

| 属性名 | 类型 | 默认值 | 说明 |
| :- | :- | :- | :- |
| min             | Number      | 0       | 最小值 |
| max             | Number      | 100     | 最大值 |
| step            | Number      | 1       | 步长，取值必须大于 0，并且可被(max - min)整除 |
| disabled        | Boolean     | false   | 是否禁用   |
| value           | Number      | 0       | 当前取值   |
| color           | Color       | #e9e9e9 | 背景条的颜色（请使用 backgroundColor）        |
| selectedColor  | Color       | #1aad19 | 已选择的颜色（请使用 activeColor）            |
| activeColor     | Color       | #1aad19 | 已选择的颜色    |
| backgroundColor | Color       | #e9e9e9 | 背景条的颜色    |
| blockSize      | Number      | 28      | 滑块的大小，取值范围为 12 - 28 |
| blockColor     | Color       | #ffffff | 滑块的颜色 |
| showValue      | Boolean     | false   | 是否显示当前 value  |
| onChange       | EventHandle |         | 完成一次拖动后触发的事件 |
| onChanging     | EventHandle |         | 拖动过程中触发的事件|

>各端支持度

| 属性 | 微信小程序 | H5 | ReactNative | 百度小程序 | 支付宝小程序 | 字节跳动小程序 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| min            | ✔ | ✔ |  ✔| ✔ | ✔ | ✔ |
| max            | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| step           | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| disabled       | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| value          | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| color          | ✔ |  |  | |  | ✔ |
| selectedColor  | ✔ |  |  |  |  | ✔ |
| activeColor    | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| backgroundColor| ✔ | ✔ |✔  | ✔ | ✔ | ✔ |
| blockSize      | ✔ | ✔ |  | ✔ | ✔ | ✔ |
| blockColor     | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| showValue      | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| onChange       | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| onChanging     | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |



###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Slider } from '@tarojs/components'

export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Text>设置 step</Text>
        <Slider step={1} value={50}/>
        <Text>显示当前 value</Text>
        <Slider step={1} value={50} showValue/>
        <Text>设置最小/最大值</Text>
        <Slider step={1} value={100} showValue min={50} max={200}/>
      </View>
    )
  }
}
```
