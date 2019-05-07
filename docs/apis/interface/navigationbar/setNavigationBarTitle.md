---
title: Taro.setNavigationBarTitle(param)
sidebar_label: setNavigationBarTitle
---

动态设置当前页面的标题。

使用方式同 [`wx.setNavigationBarTitle`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setNavigationBarTitle.html)，支持 `Promise` 化使用。

## 参数

### object param

| Property | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | 页面标题 |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.setNavigationBarTitle(params).then(...)
```

## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.setNavigationBarTitle | ✔️ | ✔️ | ✔️ |

