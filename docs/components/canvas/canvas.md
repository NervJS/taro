---
title: Canvas
sidebar_label: Canvas
---

##### 画布

`<Canvas />` 组件的 RN 版本尚未实现。

>小程序端参数支持详见各小程序官网

[微信小程序 Canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html)。

[百度小程序 Canvas](https://smartprogram.baidu.com/docs/develop/component/canvas/#canvas)。

[支付宝小程序 Canvas](https://docs.alipay.com/mini/component/canvas)。

[字节跳动小程序 Canvas](https://developer.toutiao.com/docs/comp/canvas.html)。

```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 Canvas 组件
import { Canvas } from '@tarojs/components'

class App extends Components {
  render () {
    return (
      <Canvas style='width: 300px; height: 200px;' canvasId='canvas' />
    )
  }
}
```
