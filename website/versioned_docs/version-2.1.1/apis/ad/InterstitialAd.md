---
title: InterstitialAd
sidebar_label: InterstitialAd
id: version-2.1.1-InterstitialAd
original_id: InterstitialAd
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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OffCloseCallback</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OffErrorCallback</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OffLoadCallback</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnCloseCallback</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnErrorCallback</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnLoadCallback</code></td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>res</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OffErrorCallback

插屏错误事件的回调函数

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>res</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OffLoadCallback

插屏广告加载事件的回调函数

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>res</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnCloseCallback

插屏广告关闭事件的回调函数

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>res</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnErrorCallback

插屏错误事件的回调函数

```tsx
(result: OnErrorCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>OnErrorCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnLoadCallback

插屏广告加载事件的回调函数

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>res</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnErrorCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errCode</td>
      <td><code>1000 | 1001 | 1002 | 1003 | 1004 | 1005 | 1006 | 1007 | 1008</code></td>
      <td>错误码<br /><a href="https://nervjs.github.io/taro/docs/apis/General#AdErrCode">参考地址</a></td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息</td>
    </tr>
  </tbody>
</table>

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
