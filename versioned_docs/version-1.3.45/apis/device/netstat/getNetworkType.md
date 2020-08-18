---
title: Taro.getNetworkType(OBJECT)
sidebar_label: getNetworkType
---


获取网络类型，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| success | Function | 否 | 接口调用成功的回调函数，返回网络类型 networkType |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数 | 说明 |
| :-- | :-- |
| networkType | 网络类型 |


**networkType 有效值：**

| 参数 | 说明 |
| :-- | :-- |
| wifi | wifi 网络 |
| 2g | 2g 网络 |
| 3g | 3g 网络 |
| 4g | 4g 网络 |
| none | 无网络 |
| unknow | Android 下不常见的网络类型 |

**注意：**

**H5** 下此 API 兼容性较差，详见 [Can I use](https://caniuse.com/#search=connection)。并且标准不一，对于三种规范分别支持的 networkType 有效值如下。

* 仅支持不符合规范的 navigator.connetion.type，[详情](https://www.davidbcalhoun.com/2010/using-navigator-connection-android/)。networkType 有效值为：'wifi'、'3g'、'2g'、'unknown'。
* 支持 navigator.connetion.type。networkType 有效值为：'cellular'、'wifi'、'none'。
* 支持 navigator.connetion.effectiveType。networkType 有效值为：'slow-2g'、'2g'、'3g'、'4g'。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.getNetworkType({
  success: res => console.log(res.networkType)
})
  .then(res => console.log(res.networkType))
```



## API支持度


| API | 微信小程序 | H5 | ReactNative |
| :-: | :-: | :-: | :-: |
| Taro.getNetworkType | ✔️ | ✔️ | ✔️ |

