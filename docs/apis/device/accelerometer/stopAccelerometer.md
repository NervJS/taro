---
title: Taro.stopAccelerometer(res)
sidebar_label: stopAccelerometer
---

停止监听加速度数据。

## 参数

### object res

| Name | Type | Description |
| --- | --- | --- |
| success | <code>function</code> | 接口调用成功的回调函数 |
| fail | <code>function</code> | 接口调用失败的回调函数 |
| complete | <code>function</code> | 接口调用结束的回调函数（调用成功、失败都会执行） |

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.stopAccelerometer()
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.stopAccelerometer | ✔️ | ✔️ | ✔️  |

