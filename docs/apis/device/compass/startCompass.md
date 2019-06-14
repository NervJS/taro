---
title: Taro.startCompass(param)
sidebar_label: startCompass
---

开始监听罗盘数据。

使用方式同 [`wx.startCompass`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startCompass.html)。

## 参数

### object param

| Param | Type | Description |
| --- | --- | --- |
| [success] | <code>function</code> | 接口调用成功的回调函数 |
| [fail] | <code>function</code> | 接口调用失败的回调函数 |
| [complete] | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.startCompass()
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.startCompass | ✔️ | ✔️ |  |

