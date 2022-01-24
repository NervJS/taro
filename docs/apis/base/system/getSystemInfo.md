---
title: Taro.getSystemInfo(res)
sidebar_label: getSystemInfo
---

获取系统信息，支持 `Promise` 化使用。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

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
小程序可以在微信和企业微信中调用此接口，但是在企业微信中调用此接口时，会额外返回一个 environment 字段（微信中不返回），如此字段值为 wxwork，则表示当前小程序运行在企业微信环境中。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| SDKVersion | `string` | 是 | 客户端基础库版本 |
| albumAuthorized | `boolean` | 是 | 允许微信使用相册的开关（仅 iOS 有效） |
| benchmarkLevel | `number` | 是 | 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50） |
| bluetoothEnabled | `boolean` | 是 | 蓝牙的系统开关 |
| brand | `string` | 是 | 设备品牌 |
| cameraAuthorized | `boolean` | 是 | 允许微信使用摄像头的开关 |
| fontSizeSetting | `number` | 是 | 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 |
| language | `string` | 是 | 微信设置的语言 |
| locationAuthorized | `boolean` | 是 | 允许微信使用定位的开关 |
| locationEnabled | `boolean` | 是 | 地理位置的系统开关 |
| microphoneAuthorized | `boolean` | 是 | 允许微信使用麦克风的开关 |
| model | `string` | 是 | 设备型号 |
| notificationAlertAuthorized | `boolean` | 是 | 允许微信通知带有提醒的开关（仅 iOS 有效） |
| notificationAuthorized | `boolean` | 是 | 允许微信通知的开关 |
| notificationBadgeAuthorized | `boolean` | 是 | 允许微信通知带有标记的开关（仅 iOS 有效） |
| notificationSoundAuthorized | `boolean` | 是 | 允许微信通知带有声音的开关（仅 iOS 有效） |
| pixelRatio | `number` | 是 | 设备像素比 |
| platform | `string` | 是 | 客户端平台 |
| safeArea | `TaroGeneral.SafeAreaResult` | 是 | 在竖屏正方向下的安全区域 |
| screenHeight | `number` | 是 | 屏幕高度，单位px |
| screenWidth | `number` | 是 | 屏幕宽度，单位px |
| statusBarHeight | `number` | 是 | 状态栏的高度，单位px |
| system | `string` | 是 | 操作系统及版本 |
| version | `string` | 是 | 微信版本号 |
| wifiEnabled | `boolean` | 是 | Wi-Fi 的系统开关 |
| windowHeight | `number` | 是 | 可使用窗口高度，单位px |
| windowWidth | `number` | 是 | 可使用窗口宽度，单位px |
| environment | `string` | 否 | 小程序当前运行环境 |
| errMsg | `string` | 是 | 调用结果 |

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
