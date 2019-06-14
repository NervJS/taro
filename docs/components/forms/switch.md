---
title: Switch
sidebar_label: Switch
---

##### 开关选择器

> 属性

| 属性名 | 类型 | 默认值 | 说明 |
| :- | :- | :- | :- |
| checked | Boolean | false  | 是否选中  |
| type    | String  | switch | 样式，有效值：switch, checkbox |
| color   | Color   |        | switch 的颜色，同 css 的 color |

>各端支持度

| 属性 | 微信小程序 | H5 | ReactNative | 百度小程序 | 支付宝小程序 | 字节跳动小程序 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| checked | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| type | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| color | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |

###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Switch } from '@tarojs/components'

export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Text>默认样式</Text>
        <Switch checked/>
        <Switch/>
        <Text>推荐展示样式</Text>
        <Switch checked/>
        <Switch/>
      </View>
    )
  }
}
```
