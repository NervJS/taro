---
title: CoverView
sidebar_label: CoverView
---

##### 覆盖在原生组件之上的文本视图，可覆盖的原生组件包括 map、video、canvas、camera、live-player、live-pusher，只支持嵌套 cover-view、cover-image，可在 cover-view 中使用 button。


> 支持度

| 微信小程序 | H5 | ReactNative | 百度小程序 | 支付宝小程序 | 字节跳动小程序 |
| :-: | :-: | :-: | :- | :- | :- |
| ✔️ |  | x | ️ ✔️  | ✔️  | |

具体属性参考相关小程序官网，属性值请改写为驼峰式命名。


[微信小程序 cover-view](https://developers.weixin.qq.com/miniprogram/dev/component/cover-view.html)。

[百度小程序 cover-view](https://smartprogram.baidu.com/docs/develop/component/view/#cover-view)。

[支付宝小程序 cover-view](https://docs.alipay.com/mini/component/cover-view)。

###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 CoverImage, CoverView 组件
import { Video, CoverImage, CoverView } from '@tarojs/components'

class App extends Components {
  render () {
    return (
      <Video id='myVideo' src='src'>
        <CoverView class='controls'>
          <CoverView class='play' onClick='play'>
            <CoverImage class='img' src='src' />
          </CoverView>
        </CoverView>
      </Video>
    )
  }
}
```

