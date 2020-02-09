---
title: Taro.getAccountInfoSync()
sidebar_label: getAccountInfoSync
id: version-1.3.37-getAccountInfoSync
original_id: getAccountInfoSync
---

获取当前帐号信息

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

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getAccountInfoSync | ✔️ |  |  |
