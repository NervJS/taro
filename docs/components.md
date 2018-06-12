# 组件库

Taro 以 [微信小程序组件库](https://developers.weixin.qq.com/miniprogram/dev/component/) 为标准，结合 `jsx` 语法规范，定制了一套自己的组件库规范。

基于以上原则，在小程序端，我们可以使用所有的小程序原生组件，而在其他端，我们提供了对应的组件库实现

- H5 端，`@tarojs/components`，同时也是需要引入的默认标准组件库
- RN 端，`@tarojs/components-rn`

在使用时，我们需要先从 Taro 标准组件库 `@tarojs/components` 引用组件，再进行使用，例如使用 `<View />`、 `<Text />` 组件

```javascript
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
