---
title: InterstitialAd
sidebar_label: InterstitialAd
---

插屏广告组件。插屏广告组件是一个原生组件，层级比普通组件高。插屏广告组件每次创建都会返回一个全新的实例（小程序端的插屏广告实例不允许跨页面使用），默认是隐藏的，需要调用 InterstitialAd.show() 将其显示。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.html)

## 方法

### destroy

销毁插屏广告实例。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.destroy.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.destroy | ✔️ |  |  |

### offClose

取消监听插屏广告关闭事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.offClose.html)

```tsx
(callback: OffCloseCallback) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `OffCloseCallback` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.offClose | ✔️ |  |  |

### offError

取消监听插屏错误事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.offError.html)

```tsx
(callback: OffErrorCallback) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `OffErrorCallback` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.offError | ✔️ |  |  |

### offLoad

取消监听插屏广告加载事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.offLoad.html)

```tsx
(callback: OffLoadCallback) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `OffLoadCallback` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.offLoad | ✔️ |  |  |

### onClose

监听插屏广告关闭事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.onClose.html)

```tsx
(callback: OnCloseCallback) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `OnCloseCallback` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.onClose | ✔️ |  |  |

### onError

监听插屏错误事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.onError.html)

```tsx
(callback: OnErrorCallback) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `OnErrorCallback` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.onError | ✔️ |  |  |

### onLoad

监听插屏广告加载事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.onLoad.html)

```tsx
(callback: OnLoadCallback) => void
```

| 参数 | 类型 |
| --- | --- |
| callback | `OnLoadCallback` |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.onLoad | ✔️ |  |  |

### load

加载插屏广告。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.load.html)

```tsx
() => Promise<any>
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.load | ✔️ |  |  |

### show

显示插屏广告。

**错误码信息表**

如果插屏广告显示失败，InterstitialAd.show() 方法会返回一个rejected Promise，开发者可以获取到错误码及对应的错误信息。

| 代码 | 异常情况 | 理由 |
| ------ | -------------- | -------------------------- |
| 2001  | 触发频率限制  | 小程序启动一定时间内不允许展示插屏广告 |
| 2002  | 触发频率限制  | 距离小程序插屏广告或者激励视频广告上次播放时间间隔不足，不允许展示插屏广告 |
| 2003  | 触发频率限制  | 当前正在播放激励视频广告或者插屏广告，不允许再次展示插屏广告 |
| 2004  | 广告渲染失败  | 该项错误不是开发者的异常情况，或因小程序页面切换导致广告渲染失败 |
| 2005  | 广告调用异常  | 插屏广告实例不允许跨页面调用 |

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.show.html)

```tsx
() => Promise<any>
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.show | ✔️ |  |  |

## 参数

### OffCloseCallback

插屏广告关闭事件的回调函数

```tsx
(res: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `CallbackResult` |

### OffErrorCallback

插屏错误事件的回调函数

```tsx
(res: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `CallbackResult` |

### OffLoadCallback

插屏广告加载事件的回调函数

```tsx
(res: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `CallbackResult` |

### OnCloseCallback

插屏广告关闭事件的回调函数

```tsx
(res: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `CallbackResult` |

### OnErrorCallback

插屏错误事件的回调函数

```tsx
(result: OnErrorCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `OnErrorCallbackResult` |

### OnLoadCallback

插屏广告加载事件的回调函数

```tsx
(res: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| res | `CallbackResult` |

### OnErrorCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errCode | 1000 or 1001 or 1002 or 1003 or 1004 or 1005 or 1006 or 1007 or 1008 | 错误码<br />[参考地址](https://nervjs.github.io/taro/docs/apis/General#AdErrCode) |
| errMsg | `string` | 错误信息 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.destroy | ✔️ |  |  |
| InterstitialAd.offClose | ✔️ |  |  |
| InterstitialAd.offError | ✔️ |  |  |
| InterstitialAd.offLoad | ✔️ |  |  |
| InterstitialAd.onClose | ✔️ |  |  |
| InterstitialAd.onError | ✔️ |  |  |
| InterstitialAd.onLoad | ✔️ |  |  |
| InterstitialAd.load | ✔️ |  |  |
| InterstitialAd.show | ✔️ |  |  |
