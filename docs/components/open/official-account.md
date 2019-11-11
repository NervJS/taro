---
title: OfficialAccount
sidebar_label: OfficialAccount
---

##### 公众号关注组件。当用户扫小程序码打开小程序时，开发者可在小程序内配置公众号关注组件，方便用户快捷关注公众号，可嵌套在原生组件内。

> 组件 支持度

| 微信小程序 |
| :-: |
| ✔ |


>具体用法请看小程序官方文档

[微信小程序 OfficialAccount](https://developers.weixin.qq.com/miniprogram/dev/component/official-account.html)。

```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 OfficialAccount 组件
import { OfficialAccount } from '@tarojs/components'

class App extends Component {
  render () {
    return (
      <OfficialAccount
        onLoad={() => console.log('official-account onLoad')}
        onError={() => console.log('official-account onError')}
      />
    )
  }
}
```
