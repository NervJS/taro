---
title: Taro.getNetworkType(option)
sidebar_label: getNetworkType
id: version-1.3.37-getNetworkType
original_id: getNetworkType
---

获取网络类型。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.getNetworkType.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| networkType | `"wifi" | "2g" | "3g" | "4g" | "unknown" | "none"` | 网络类型 |
| errMsg | `string` | 调用结果 |

### networkType

网络类型

| 参数 | 说明 |
| --- | --- |
| wifi | wifi 网络 |
| 2g | 2g 网络 |
| 3g | 3g 网络 |
| 4g | 4g 网络 |
| unknown | Android 下不常见的网络类型 |
| none | 无网络 |

## 示例代码

```tsx
Taro.getNetworkType({
  success: function (res)) {
    // 返回网络类型, 有效值：
    // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
    var networkType = res.networkType
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getNetworkType | ✔️ | ✔️ | ✔️ |
