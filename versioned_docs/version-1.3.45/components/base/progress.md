---
title: Progress
sidebar_label: Progress
---

##### 进度条


> 属性

| 属性名 | 类型 | 默认值 | 说明 |
| :- | :- | :- | :- |
| percent    | Float   | 无 | 百分比 0~100 |
| showInfo  | Boolean | false | 在进度条右侧显示百分比 |
| strokeWidth | Number  | 6 | 进度条线的宽度，单位 px |
| color | Color   | #09BB07 | 进度条颜色 （请使用 activeColor）|
| activeColor | Color   | #09BB07 | 已选择的进度条的颜色 |
|backgroundColor | Color   | #09BB07 | 未选择的进度条的颜色 |
| active | Boolean | false     | 进度条从左往右的动画 |
|activeMode | String  | backwards | backwards: 动画从头播；forwards：动画从上次结束点接着播 |

>各端支持度

| 属性 | 微信小程序 | H5 | ReactNative | 百度小程序 | 支付宝小程序 | 字节跳动小程序 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| percent | ✔ | ✔ |  ✔| ✔ | ✔ | ✔ |
| showInfo | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| strokeWidth | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| color | ✔ |  |  | ✔ | ✔ | ✔ |
| activeColor | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| backgroundColor | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| active | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| activeMode | ✔ |  | ✔ | ✔ |  | ✔ |


###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Progress } from '@tarojs/components'

export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Progress percent={20} showInfo strokeWidth={2} />
        <Progress percent={40} strokeWidth={2} active />
        <Progress percent={60}  strokeWidth={2} active />
        <Progress percent={80}  strokeWidth={2} active activeColor='blue' />
      </View>
    )
  }
}
