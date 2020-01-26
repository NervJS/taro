---
title: Taro.setNavigationBarColor(param)
sidebar_label: setNavigationBarColor
---

设置页面导航条颜色。

使用方式同 [`wx.setNavigationBarColor`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setNavigationBarColor.html)，支持 `Promise` 化使用。

## 参数

### object param

| Name | Type | Description |
| --- | --- | --- |
| frontColor | <code>string</code> | 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000 |
| backgroundColor | <code>string</code> | 背景颜色值，有效值为十六进制颜色 |
| animation | <code>Object</code> | 动画效果 |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |
注：h5端使用 meta 标签的 theme-color 属性实现，所以仅支持 backgroundColor 参数。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.setNavigationBarColor(params).then(...)
```


## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.setNavigationBarColor | ✔️ | ✔️ | ✔️(不支持 animation 参数) |

