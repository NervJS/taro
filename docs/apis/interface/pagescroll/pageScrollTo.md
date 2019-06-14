---
title: Taro.pageScrollTo(param)
sidebar_label: pageScrollTo
---

将页面滚动到目标位置。

使用方式同 [`wx.pageScrollTo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.pageScrollTo.html)，支持 `Promise` 化使用。

## 参数

### object param

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| scrollTop | <code>number</code> |  | 滚动到页面的目标位置，单位 px |
| [duration] | <code>number</code> | <code>300</code> | 滚动动画的时长，单位 ms |
| [success] | <code>function</code> |  | 接口调用成功的回调函数 |
| [fail] | <code>function</code> |  | 接口调用失败的回调函数 |
| [complete] | <code>function</code> |  | 接口调用结束的回调函数（调用成功、失败都会执行） |

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.pageScrollTo(params).then(...)
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.pageScrollTo | ✔️ | ✔️ |  |

