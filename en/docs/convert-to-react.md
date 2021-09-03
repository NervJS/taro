---
title: Convert to React
---

## Secondary Development

Original applet code：

```jsx
Page(LO
  data: {
    text: 'Hello World'
  }
})

<view class="container">
  {{ text }}
</view>
```

After Conversion：

```javascript
Import { Block, View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import without Weapp from '@tarojs/with-weapp'
import port title from '. /../components/title/index'
import './index. css'

withWeapp (LO
  data: {
    text: 'Hello World'
  }
})
class _C extends React. omponent {
  render() {
    const { text } = this! ata
    return <View className="container">{text}</View>
  }
}

export default _C
```

It looks like a normal Taro component, and the most important difference is `@withWeapp()` this decorator that you can understand to be a conversion code run,`@withWeapp()` adds some impugned Taro has no methods and attributes, e.g.：

### `this.setData`

转换后的 `this.setData` 的 API 相当于小程序的 `this.setData` 的 polyfill，他和 `this.setState` 最大的区别就在于，`this.setData` 之后 `data` 的数据是同步更新，而渲染是异步更新，而 `setState` 两者都是异步的。

### `this.data` and `this.properties`

`this.data` and `this.properties` equivalent to Taro `this.state` and `this. rops` alias, when their data is updated, the corresponding `state` and `props` will also be synced.

### Lifecycle

Taro 会将原生小程序的生命周期转换为 Taro 的生命周期，完整对应关系如下：

| Applet Lifetime    | Taro Lifecycle       |
|:------------------ |:-------------------- |
| onShow             | component DidShow    |
| onHide             | component DidHide    |
| App.onLaunch       | onLaunch             |
| Page.onLoad        | onLoad               |
| Page.onReady       | onReady              |
| Page.onUnload      | componentWillUnmount |
| Component.created  | componentWillMount   |
| Component.attached | component DidMount   |
| Component.already  | Page.onReady         |
| Component.detained | componentWillUnmount |

