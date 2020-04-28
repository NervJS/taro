---
title: OpenData
sidebar_label: OpenData
---

##### 用于展示小程序开放的数据。

> 组件 支持度

| 微信小程序 | 百度小程序 |
| :-: | :-: |
| ✔ | ✔ |


>具体用法请看小程序官方文档

[微信小程序 OpenData](https://developers.weixin.qq.com/miniprogram/dev/component/open-data.html)。

[百度小程序 OpenData](https://smartprogram.baidu.com/docs/develop/component/open/#open-data/)。

```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 OpenData 组件
import { OpenData } from '@tarojs/components'

class App extends Component {
  render () {
    return (
      <OpenData type=''/>
    )
  }
}
```
