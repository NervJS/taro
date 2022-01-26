---
title: Taro.getAccountInfoSync()
sidebar_label: getAccountInfoSync
---

获取当前帐号信息

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/account-info/wx.getAccountInfoSync.html)

## 类型

```tsx
() => AccountInfo
```

## 参数

### AccountInfo

帐号信息

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| miniProgram | `MiniProgram` | 小程序帐号信息 |
| plugin | `Plugin` | 插件帐号信息（仅在插件中调用时包含这一项） |

### MiniProgram

小程序帐号信息

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| appId | `string` | 小程序 appId |
| envVersion | "develop" or "trial" or "release" | 小程序版本<br />since: 2.10.0 |
| version | `string` | 线上小程序版本号<br />since: 2.10.2 |

### Plugin

插件帐号信息（仅在插件中调用时包含这一项）

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| appId | `string` | 插件 appId |
| version | `string` | 插件版本号 |

## 示例代码

```tsx
const accountInfo = Taro.getAccountInfoSync();

console.log(accountInfo.miniProgram.appId) // 小程序 appId
console.log(accountInfo.plugin.appId) // 插件 appId
console.log(accountInfo.plugin.version) // 插件版本号， 'a.b.c' 这样的形式
```
