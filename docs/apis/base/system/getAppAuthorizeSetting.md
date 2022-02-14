---
title: Taro.getAppAuthorizeSetting()
sidebar_label: getAppAuthorizeSetting
---

获取微信APP授权设置

- 'authorized' 表示已经获得授权，无需再次请求授权；
- 'denied' 表示请求授权被拒绝，无法再次请求授权；（此情况需要引导用户[打开系统设置](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.openAppAuthorizeSetting.html)，在设置页中打开权限）
- 'non determined' 表示尚未请求授权，会在微信下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> H5: 暂未支持设置权限

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getAppAuthorizeSetting.html)

## 类型

```tsx
() => Result
```

## 参数

### Result

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| albumAuthorized | `keyof Authorized` | 允许微信使用相册的开关（仅 iOS 有效） |
| bluetoothAuthorized | `keyof Authorized` | 允许微信使用蓝牙的开关（仅 iOS 有效） |
| cameraAuthorized | `keyof Authorized` | 允许微信使用摄像头的开关 |
| locationAuthorized | `keyof Authorized` | 允许微信使用定位的开关 |
| locationReducedAccuracy | `boolean` | 定位准确度。true 表示模糊定位，false 表示精确定位（仅 iOS 有效） |
| microphoneAuthorized | `keyof Authorized` | 允许微信使用麦克风的开关 |
| notificationAuthorized | `keyof Authorized` | 允许微信通知的开关 |
| notificationAlertAuthorized | `keyof Authorized` | 允许微信通知带有提醒的开关（仅 iOS 有效） |
| notificationBadgeAuthorized | `keyof Authorized` | 允许微信通知带有标记的开关（仅 iOS 有效） |
| notificationSoundAuthorized | `keyof Authorized` | 允许微信通知带有声音的开关（仅 iOS 有效） |
| phoneCalendarAuthorized | `keyof Authorized` | 允许微信读写日历的开关 |

### Authorized

授权合法值

| 参数 | 说明 |
| --- | --- |
| authorized | 表示已经获得授权，无需再次请求授权 |
| denied | 表示请求授权被拒绝，无法再次请求授权 （此情况需要引导用户打开[打开系统设置](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.openAppAuthorizeSetting.html)，在设置页中打开权限） |
| not determined | 表示尚未请求授权，会在微信下一次调用系统相应权限时请求 （仅 iOS 会出现。此种情况下引导用户[打开系统设置](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.openAppAuthorizeSetting.html)，不展示开关） |

## 示例代码

```tsx
const appAuthorizeSetting = Taro.getAppAuthorizeSetting()

console.log(appAuthorizeSetting.albumAuthorized)
console.log(appAuthorizeSetting.bluetoothAuthorized)
console.log(appAuthorizeSetting.cameraAuthorized)
console.log(appAuthorizeSetting.locationAuthorized)
console.log(appAuthorizeSetting.locationReducedAccuracy)
console.log(appAuthorizeSetting.microphoneAuthorized)
console.log(appAuthorizeSetting.notificationAlertAuthorized)
console.log(appAuthorizeSetting.notificationAuthorized)
console.log(appAuthorizeSetting.notificationBadgeAuthorized)
console.log(appAuthorizeSetting.notificationSoundAuthorized)
console.log(appAuthorizeSetting.phoneCalendarAuthorized)
```
