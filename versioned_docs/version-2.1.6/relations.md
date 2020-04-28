---
title: 小程序原生作用域获取
---

在 Taro 的页面和组件类中，`this` 指向的是 Taro 页面或组件的实例，例如

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

export default class Menu extends Component {
  static defaultProps = {
    data: []
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: props.checked
    }
  }

  componentWillMount () {
    console.log(this) // this -> 组件 Menu 的实例
  }

  render () {
    return <View />
  }
}
```

但是一般我们需要获取 Taro 的页面和组件所对应的小程序原生页面和组件的实例，这个时候我们可以通过 `this.$scope` 就能访问到它们。

所以当调用一些 API 需要传入小程序的页面或者组件实例时，可以直接传入 `this.$scope`，例如 `Taro.createCanvasContext(canvasId, this)` 这个 API，第二个参数就是自定义组件实例 `this`，在 Taro 中就可以如下使用

```jsx
Taro.createCanvasContext(canvasId, this.$scope)
```
