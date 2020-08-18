---
title: Taro.onNetworkStatusChange(CALLBACK)
sidebar_label: onNetworkStatusChange
---


监听网络状态变化。

**CALLBACK 返回参数：**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| isConnected | Boolean | 当前是否有网络连接 |
| networkType | String | 网络类型 |

注意：**H5** 端兼容情况较差，只有当 navigator.connection 支持监听 onChange 事件时才会生效。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.onNetworkStatusChange(res => {
  console.log(res.isConnected)
  console.log(res.networkType)
})
```

## API支持度


| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.onNetworkStatusChange | ✔️ | ✔️ | ✔️ |

