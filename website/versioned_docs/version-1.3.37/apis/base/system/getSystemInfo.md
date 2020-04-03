---
title: Taro.getSystemInfo(res)
sidebar_label: getSystemInfo
id: version-1.3.37-getSystemInfo
original_id: getSystemInfo
---

获取系统信息，支持 `Promise` 化使用。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfo.html)

## 类型

```tsx
(res?: Option) => Promise<Result>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: any) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: any) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: Result) => void` | 否 | 接口调用成功的回调函数 |

### Result

注意：**H5** 端不支持 version、statusBarHeight、fontSizeSetting、SDKVersion

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| SDKVersion | `string` | 客户端基础库版本 |
| albumAuthorized | `boolean` | 允许微信使用相册的开关（仅 iOS 有效） |
| benchmarkLevel | `number` | 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50） |
| bluetoothEnabled | `boolean` | 蓝牙的系统开关 |
| brand | `string` | 设备品牌 |
| cameraAuthorized | `boolean` | 允许微信使用摄像头的开关 |
| fontSizeSetting | `number` | 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 |
| language | `string` | 微信设置的语言 |
| locationAuthorized | `boolean` | 允许微信使用定位的开关 |
| locationEnabled | `boolean` | 地理位置的系统开关 |
| microphoneAuthorized | `boolean` | 允许微信使用麦克风的开关 |
| model | `string` | 设备型号 |
| notificationAlertAuthorized | `boolean` | 允许微信通知带有提醒的开关（仅 iOS 有效） |
| notificationAuthorized | `boolean` | 允许微信通知的开关 |
| notificationBadgeAuthorized | `boolean` | 允许微信通知带有标记的开关（仅 iOS 有效） |
| notificationSoundAuthorized | `boolean` | 允许微信通知带有声音的开关（仅 iOS 有效） |
| pixelRatio | `number` | 设备像素比 |
| platform | `string` | 客户端平台 |
| safeArea | `SafeAreaResult` | 在竖屏正方向下的安全区域 |
| screenHeight | `number` | 屏幕高度，单位px |
| screenWidth | `number` | 屏幕宽度，单位px |
| statusBarHeight | `number` | 状态栏的高度，单位px |
| system | `string` | 操作系统及版本 |
| version | `string` | 微信版本号 |
| wifiEnabled | `boolean` | Wi-Fi 的系统开关 |
| windowHeight | `number` | 可使用窗口高度，单位px |
| windowWidth | `number` | 可使用窗口宽度，单位px |
| errMsg | `string` | 调用结果 |

## 示例代码

### 示例 1

```tsx
Taro.getSystemInfo({
  success: res => console.log(res)
})
.then(res => console.log(res))
```

### 示例 2

```tsx
Taro.getSystemInfo({
  success: function (res) {
    console.log(res.model)
    console.log(res.pixelRatio)
    console.log(res.windowWidth)
    console.log(res.windowHeight)
    console.log(res.language)
    console.log(res.version)
    console.log(res.platform)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getSystemInfo | ✔️ | ✔️ | ✔️ |
