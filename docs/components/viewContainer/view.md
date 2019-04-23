---
title: View
sidebar_label: View
---

##### 视图容器


> 属性

| 属性名 | 类型 | 默认值 | 说明 |
| :- | :- | :- | :- |
| hoverClass            | String  | none   | 指定按下去的样式类。当 hover-class='none' 时，没有点击态效果 |
| hoverStartTime       | Number  | 50     | 按住后多久出现点击态，单位毫秒                               |
|hoverStayTime        | Number  | 400    | 手指松开后点击态保留时间，单位毫秒                           |
| hoverStopPropagation | Boolean | false  | 指定是否阻止本节点的祖先节点出现点击态                       |

>各端支持度

| 属性 | 微信小程序 | H5 | ReactNative | 百度小程序 | 支付宝小程序 | 字节跳动小程序 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| hoverClass | ✔ | ✔ |  (支持 hoverStyle 属性，但框架未支持 hoverClass)| ✔ | ✔ | ✔ |
| hoverStartTime | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| hoverStayTime | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| hoverStopPropagation | ✔ | | x | ✔ | ✔ | ✔ |

###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Text>flex-direction: row 横向布局</Text>
        <View className='flex-wrp' style='flex-direction:row;'>
          <View className='flex-item demo-text-1'/>
          <View className='flex-item demo-text-2'/>
          <View className='flex-item demo-text-3'/>
        </View>
        <Text>flex-direction: column 纵向布局</Text>
        <View className='flex-wrp' style='flex-direction:column;'>
          <View className='flex-item flex-item-V demo-text-1'/>
          <View className='flex-item flex-item-V demo-text-2'/>
          <View className='flex-item flex-item-V demo-text-3'/>
        </View>
      </View>
    )
  }
}
```
