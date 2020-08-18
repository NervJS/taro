---
title: RewardedVideoAd
sidebar_label: RewardedVideoAd
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
| RewardedVideoAd.offClose | ✔️ |  |  |

### offError

取消监听激励视频错误事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.offError.html)

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
| RewardedVideoAd.offError | ✔️ |  |  |

### offLoad

取消监听激励视频广告加载事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.offLoad.html)

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
| RewardedVideoAd.offLoad | ✔️ |  |  |

### onClose

监听用户点击 `关闭广告` 按钮的事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.onClose.html)

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
| RewardedVideoAd.onClose | ✔️ |  |  |

### onError

监听激励视频错误事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.onError.html)

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
| RewardedVideoAd.onError | ✔️ |  |  |

### onLoad

监听激励视频广告加载事件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.onLoad.html)

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
| RewardedVideoAd.onLoad | ✔️ |  |  |

## 参数

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

### OnCloseCallbackResult

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
      <td>isEnded</td>
      <td><code>boolean</code></td>
      <td>视频是否是在用户完整观看的情况下被关闭的</td>
    </tr>
  </tbody>
</table>

### OffCloseCallback

用户点击 `关闭广告` 按钮的事件的回调函数

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

激励视频错误事件的回调函数

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

激励视频广告加载事件的回调函数

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

用户点击 `关闭广告` 按钮的事件的回调函数

```tsx
(result: OnCloseCallbackResult) => void
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
      <td><code>OnCloseCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnErrorCallback

激励视频错误事件的回调函数

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

激励视频广告加载事件的回调函数

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
