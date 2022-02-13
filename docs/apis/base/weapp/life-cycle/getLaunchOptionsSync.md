---
title: Taro.getLaunchOptionsSync()
sidebar_label: getLaunchOptionsSync
---

获取小程序启动时的参数。与 [`App.onLaunch`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onlaunchobject-object) 的回调参数一致。

**注意**
部分版本在无`referrerInfo`的时候会返回 `undefined`，建议使用 `options.referrerInfo && options.referrerInfo.appId` 进行判断。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html)

## 类型

```tsx
() => LaunchOptions
```

## 参数

### LaunchOptions

启动参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| path | `string` | 是 | 启动小程序的路径 |
| query | `TaroGeneral.IAnyObject` | 是 | 启动小程序的 query 参数 |
| scene | `number` | 是 | 启动小程序的[场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) |
| shareTicket | `string` | 是 | shareTicket，详见[获取更多转发信息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) |
| referrerInfo | `ReferrerInfo` | 是 | 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 `{}`。(参见后文注意) |
| forwardMaterials | `ForwardMaterial[]` | 否 | 打开的文件信息数组，只有从聊天素材场景打开（scene为1173）才会携带该参数 |
| chatType | `keyof ChatType` | 否 | 从微信群聊/单聊打开小程序时，chatType 表示具体微信群聊/单聊类型 |
| apiCategory | `keyof ApiCategory` | 否 | API 类别 |

#### ReferrerInfo

来源信息

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| appId | `string` | 来源小程序、公众号或 App 的 appId |
| extraData | `TaroGeneral.IAnyObject` | 来源小程序传过来的数据，scene=1037或1038时支持 |

#### ForwardMaterial

ChatType 类型合法值

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| type | `string` | 文件的mimetype类型 |
| name | `string` | 文件名 |
| path | `string` | 文件路径（如果是webview则是url） |
| size | `number` | 文件大小 |

#### ChatType

ChatType 类型合法值

| 参数 | 说明 |
| --- | --- |
| 1 | 微信联系人单聊 |
| 2 | 企业微信联系人单聊 |
| 3 | 普通微信群聊 |
| 4 | 企业微信互通群聊 |

#### ApiCategory

API 类别合法值

| 参数 | 说明 |
| --- | --- |
| default | 默认类别 |
| nativeFunctionalized | 原生功能化，视频号直播商品、商品橱窗等场景打开的小程序 |
| browseOnly | 仅浏览，朋友圈快照页等场景打开的小程序 |
| embedded | 内嵌，通过打开半屏小程序能力打开的小程序 |
