---
title: 组件库说明
---

Taro 以 [微信小程序组件库](https://developers.weixin.qq.com/miniprogram/dev/component/) 为标准，结合 `jsx` 语法规范，定制了一套自己的组件库规范。

基于以上原则，在小程序端，我们可以使用所有的小程序原生组件，而在其他端，我们提供了对应的组件库实现

- H5 端，`@tarojs/components`，同时也是需要引入的默认标准组件库
- RN 端为，`@tarojs/components-rn`

在使用时，我们需要先从 Taro 标准组件库 `@tarojs/components` 引用组件，再进行使用，例如使用 `<View />`、 `<Text />` 组件

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class C extends Component {
  render () {
    return (
      <View className='c'>
        <Text>c component</Text>
      </View>
    )
  }
}
```

## 注意

在组件的详细文档中列出了组件在不同端的支持程度，以及基本的使用示例。 部分未列出示例的，标明仅在小程序端支持的组件的用法可以直接参考[小程序组件文档](https://developers.weixin.qq.com/miniprogram/dev/component/)。

需要注意的是仍需遵循 Taro 的开发规范：

### 首字母大写与驼峰式命名

例如使用 H5 端尚未支持 map 组件

```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 map 组件
import { Map } from '@tarojs/components'

class App extends Components {
  onTap () {}
  render () {
    return (
      <Map onClick={this.onTap} />
    )
  }
}
```

### 组件的事件传递都要以 on 开头

在微信小程序中 bind 开头这样的用法，都需要转成以 on 开头的形式。
