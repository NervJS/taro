---
title: Taro.getAppBaseInfo()
sidebar_label: getAppBaseInfo
---

获取微信APP基础信息

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> H5: 不支持 SDKVersion、host、version

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getAppBaseInfo.html)

## 类型

```tsx
() => Result
```

## 参数

### Result

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| SDKVersion | `string` | 否 | 客户端基础库版本 |
| enableDebug | `boolean` | 否 | 是否已打开调试。可通过右上角菜单或 [Taro.setEnableDebug](/docs/apis/base/debug/setEnableDebug) 打开调试。 |
| host | `Host` | 否 | 当前小程序运行的宿主环境 |
| language | `string` | 是 | 微信设置的语言 |
| version | `string` | 否 | 微信版本号 |
| theme | `keyof Theme` | 否 | 系统当前主题，取值为light或dark，全局配置"darkmode":true时才能获取，否则为 undefined （不支持小游戏） |

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

## 示例代码

```tsx
const appBaseInfo = Taro.getAppBaseInfo()

console.log(appBaseInfo.SDKVersion)
console.log(appBaseInfo.enableDebug)
console.log(appBaseInfo.host)
console.log(appBaseInfo.language)
console.log(appBaseInfo.version)
console.log(appBaseInfo.theme)
```
