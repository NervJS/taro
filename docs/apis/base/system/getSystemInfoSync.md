---
title: Taro.getSystemInfoSync()
sidebar_label: getSystemInfoSync
---

获取系统信息同步接口。

注意：**H5** 端不支持 version、statusBarHeight、fontSizeSetting、SDKVersion

## 类型

```tsx
() => Return
```

## 参数

### Return

| Name | Type | Description |
| --- | --- | --- |
| brand | `string` | 手机品牌 |
| model | `string` | 手机型号 |
| pixelRatio | `number` | 设备像素比 |
| screenWidth | `number` | 屏幕宽度 |
| screenHeight | `number` | 屏幕高度 |
| windowWidth | `number` | 可使用窗口宽度 |
| windowHeight | `number` | 可使用窗口高度 |
| statusBarHeight | `number` | 状态栏的高度 |
| language | `string` | 微信设置的语言 |
| version | `string` | 微信版本号 |
| system | `string` | 操作系统版本 |
| platform | `string` | 客户端平台 |
| fontSizeSetting | `number` | 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px |
| SDKVersion | `string` | 客户端基础库版本 |

## 示例代码

```tsx
try {
  const res = Taro.getSystemInfoSync()
  console.log(res.model)
  console.log(res.pixelRatio)
  console.log(res.windowWidth)
  console.log(res.windowHeight)
  console.log(res.language)
  console.log(res.version)
  console.log(res.platform)
} catch (e) {
  // Do something when catch error
}
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.getSystemInfoSync | ✔️ |  |  |  |  | ✔️ | ✔️ |  |

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfoSync.html)
