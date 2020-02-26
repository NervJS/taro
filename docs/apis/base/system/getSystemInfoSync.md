---
title: Taro.getSystemInfoSync()
sidebar_label: getSystemInfoSync
---

获取系统信息同步接口。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfoSync.html)

## 类型

```tsx
() => Result
```

## 参数

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

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getSystemInfoSync | ✔️ | ✔️ | ✔️ |
