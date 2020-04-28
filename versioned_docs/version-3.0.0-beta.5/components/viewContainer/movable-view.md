---
title: MovableView
sidebar_label: MovableView
---

##### 可移动的视图容器，在页面中可以拖拽滑动

> 支持度

| 微信小程序 | H5 | ReactNative | 百度小程序 | 支付宝小程序 | 字节跳动小程序 |
| :-: | :-: | :-: | :- | :- | :- |
| ✔️ |  | x | ️ ✔️  | ✔️  | |

具体属性参考相关小程序官网，属性值请改写为驼峰式命名。


[微信小程序 movable-view](https://developers.weixin.qq.com/miniprogram/dev/component/movable-view.html)。

[百度小程序 movable-view](https://smartprogram.baidu.com/docs/develop/component/view/#movable-area)。

[支付宝小程序 movable-view](https://docs.alipay.com/mini/component/movable-view)。

###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 MovableArea, MovableView 组件
import { MovableArea, MovableView } from '@tarojs/components'

class App extends Components {
  render () {
    return (
      <MovableArea style='height: 200px; width: 200px; background: red;'>
        <MovableView style='height: 50px; width: 50px; background: blue;' direction='all'></MovableView>
      </MovableArea>
    )
  }
}
```
