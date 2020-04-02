---
title: RewardedVideoAd
sidebar_label: RewardedVideoAd
id: version-1.3.38-RewardedVideoAd
original_id: RewardedVideoAd
---

激励视频广告组件。激励视频广告组件是一个原生组件，层级比普通组件高。激励视频广告是一个单例（小游戏端是全局单例，小程序端是页面内单例，在小程序端的单例对象不允许跨页面使用），默认是隐藏的，需要调用 RewardedVideoAd.show() 将其显示。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.html)

## 方法

### load

加载激励视频广告。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.load.html)

```tsx
() => Promise<any>
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RewardedVideoAd.load | ✔️ |  |  |

### show

显示激励视频广告。激励视频广告将从屏幕下方推入。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.show.html)

```tsx
() => Promise<any>
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RewardedVideoAd.show | ✔️ |  |  |

### destroy

销毁激励视频广告实例。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.destroy.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RewardedVideoAd.destroy | ✔️ |  |  |

### offClose

取消监听用户点击 `关闭广告` 按钮的事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.offClose.html)

```tsx
(callback: OffCloseCallback) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `OffCloseCallback` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RewardedVideoAd.offClose | ✔️ |  |  |

### offError

取消监听激励视频错误事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.offError.html)

```tsx
(callback: OffErrorCallback) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `OffErrorCallback` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RewardedVideoAd.offError | ✔️ |  |  |

### offLoad

取消监听激励视频广告加载事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.offLoad.html)

```tsx
(callback: OffLoadCallback) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `OffLoadCallback` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RewardedVideoAd.offLoad | ✔️ |  |  |

### onClose

监听用户点击 `关闭广告` 按钮的事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.onClose.html)

```tsx
(callback: OnCloseCallback) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `OnCloseCallback` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RewardedVideoAd.onClose | ✔️ |  |  |

### onError

监听激励视频错误事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.onError.html)

```tsx
(callback: OnErrorCallback) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `OnErrorCallback` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RewardedVideoAd.onError | ✔️ |  |  |

### onLoad

监听激励视频广告加载事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.onLoad.html)

```tsx
(callback: OnLoadCallback) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `OnLoadCallback` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RewardedVideoAd.onLoad | ✔️ |  |  |

## 参数

### OnErrorCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errCode | 1000 or 1001 or 1002 or 1003 or 1004 or 1005 or 1006 or 1007 or 1008 | 错误码<br />[参考地址](https://nervjs.github.io/taro/docs/apis/General#AdErrCode) |
| errMsg | `string` | 错误信息 |

### OnCloseCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| isEnded | `boolean` | 视频是否是在用户完整观看的情况下被关闭的 |

### OffCloseCallback

用户点击 `关闭广告` 按钮的事件的回调函数

```tsx
(res: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `CallbackResult` |

### OffErrorCallback

激励视频错误事件的回调函数

```tsx
(res: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `CallbackResult` |

### OffLoadCallback

激励视频广告加载事件的回调函数

```tsx
(res: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `CallbackResult` |

### OnCloseCallback

用户点击 `关闭广告` 按钮的事件的回调函数

```tsx
(result: OnCloseCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `OnCloseCallbackResult` |

### OnErrorCallback

激励视频错误事件的回调函数

```tsx
(result: OnErrorCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `OnErrorCallbackResult` |

### OnLoadCallback

激励视频广告加载事件的回调函数

```tsx
(res: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `CallbackResult` |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RewardedVideoAd.load | ✔️ |  |  |
| RewardedVideoAd.show | ✔️ |  |  |
| RewardedVideoAd.destroy | ✔️ |  |  |
| RewardedVideoAd.offClose | ✔️ |  |  |
| RewardedVideoAd.offError | ✔️ |  |  |
| RewardedVideoAd.offLoad | ✔️ |  |  |
| RewardedVideoAd.onClose | ✔️ |  |  |
| RewardedVideoAd.onError | ✔️ |  |  |
| RewardedVideoAd.onLoad | ✔️ |  |  |
