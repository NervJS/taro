---
title: Convert to React
---

## Secondary Development

Mini Program Native Code:

```jsx
Page({
  data: {
    text: 'Hello World'
  }
})

<view class="container">
  {{ text }}
</view>
```

After conversion:

```javascript
import { Block, View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import Title from '../../components/title/index'
import './index.scss'

@withWeapp({
  data: {
    text: 'Hello World'
  }
})
class _C extends React.Component {
  render() {
    const { text } = this.data
    return <View className="container">{text}</View>
  }
}

export default _C
```

t looks like a normal Taro component, the most important difference is the `@withWeapp()` decorator, which you can interpret as a runtime for conversion code. `@withWeapp()` adds some methods and properties that were not available in the original Taro, eg:

### `this.setData`

The API of the converted `this.setData` is equivalent to the polyfill of `this.setData` of the mini program, the biggest difference between it and `this.setState` is that after `this.setData` the data of `data` is updated synchronously, while rendering is updated asynchronously, while `setState` is updated asynchronously. both are asynchronous.

### `this.data` 和 `this.properties`

`this.data` and `this.properties` are aliases of Taro's `this.state` and `this.props`, and when their data is updated, the corresponding `state` and `props` will be updated as well.

### Lifecycle

Taro converts the lifecycle of the native mini program into the lifecycle of Taro, and the complete correspondence is as follows.


|Mini Program Lifecycle|Taro Lifecycle|
| :-- | :-- |
| onShow | componentDidShow |
| onHide | componentDidHide |
| App.onLaunch | onLaunch |
| Page.onLoad | onLoad |
| Page.onReady | onReady |
| Page.onUnload | componentWillUnmount |
| Component.created | componentWillMount |
| Component.attached | componentDidMount |
| Component.ready | Page.onReady  |
| Component.detached | componentWillUnmount |

