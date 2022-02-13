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

| 参数 | 类型 |
| --- | --- |
| res | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| success | `(res: Result) => void` | 否 | 接口调用成功的回调函数 |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| complete | `(res: any) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

### Result

注意：**H5** 端不支持 version、statusBarHeight、fontSizeSetting、SDKVersion
小程序可以在微信和企业微信中调用此接口，但是在企业微信中调用此接口时，会额外返回一个 environment 字段（微信中不返回），如此字段值为 wxwork，则表示当前小程序运行在企业微信环境中。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| brand | `string` | 是 | 设备品牌 |
| model | `string` | 是 | 设备型号 |
| pixelRatio | `number` | 是 | 设备像素比 |
| screenWidth | `number` | 是 | 屏幕宽度，单位px |
| screenHeight | `number` | 是 | 屏幕高度，单位px |
| windowWidth | `number` | 是 | 可使用窗口宽度，单位px |
| windowHeight | `number` | 是 | 可使用窗口高度，单位px |
| statusBarHeight | `number` | 否 | 状态栏的高度，单位px |
| language | `string` | 是 | 微信设置的语言 |
| version | `string` | 否 | 微信版本号 |
| system | `string` | 是 | 操作系统及版本 |
| platform | `string` | 是 | 客户端平台 |
| fontSizeSetting | `number` | 否 | 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 |
| SDKVersion | `string` | 否 | 客户端基础库版本 |
| benchmarkLevel | `number` | 是 | 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50） |
| albumAuthorized | `boolean` | 否 | 允许微信使用相册的开关（仅 iOS 有效） |
| cameraAuthorized | `boolean` | 否 | 允许微信使用摄像头的开关 |
| locationAuthorized | `boolean` | 否 | 允许微信使用定位的开关 |
| microphoneAuthorized | `boolean` | 否 | 允许微信使用麦克风的开关 |
| notificationAuthorized | `boolean` | 否 | 允许微信通知的开关 |
| notificationAlertAuthorized | `boolean` | 否 | 允许微信通知带有提醒的开关（仅 iOS 有效） |
| notificationBadgeAuthorized | `boolean` | 否 | 允许微信通知带有标记的开关（仅 iOS 有效） |
| notificationSoundAuthorized | `boolean` | 否 | 允许微信通知带有声音的开关（仅 iOS 有效） |
| phoneCalendarAuthorized | `boolean` | 否 | 允许微信使用日历的开关 |
| bluetoothEnabled | `boolean` | 否 | 蓝牙的系统开关 |
| locationEnabled | `boolean` | 否 | 地理位置的系统开关 |
| wifiEnabled | `boolean` | 否 | Wi-Fi 的系统开关 |
| safeArea | `TaroGeneral.SafeAreaResult` | 否 | 在竖屏正方向下的安全区域 |
| locationReducedAccuracy | `boolean` | 否 | `true` 表示模糊定位，`false` 表示精确定位，仅 iOS 支持 |
| theme | `keyof Theme` | 否 | 系统当前主题，取值为light或dark，全局配置"darkmode":true时才能获取，否则为 undefined （不支持小游戏） |
| host | `Host` | 否 | 当前小程序运行的宿主环境 |
| enableDebug | `boolean` | 否 | 是否已打开调试。可通过右上角菜单或 [Taro.setEnableDebug](/docs/apis/base/debug/setEnableDebug) 打开调试。 |
| deviceOrientation | `keyof DeviceOrientation` | 否 | 设备方向 |
| environment | `string` | 否 | 小程序当前运行环境 |

### Theme

系统主题合法值

| 参数 | 说明 |
| --- | --- |
| dark | 深色主题 |
| light | 浅色主题 |

### Host

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| appId | `string` | 宿主 app 对应的 appId |

### DeviceOrientation

设备方向合法值

| 参数 | 说明 |
| --- | --- |
| portrait | 竖屏 |
| landscape | 横屏 |

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
