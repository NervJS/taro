---
title: InterstitialAd
sidebar_label: InterstitialAd
---

Interstitial ad component. This is a native component at a higher layer than normal components. Each time the interstitial ad component is created, a new instance (interstitial ad instances on the Mini Program cannot be used across pages) is returned. Interstitial ads are hidden by default, and InterstitialAd.show() must be called to display them.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/InterstitialAd.html)

## Methods

### destroy

Destorys an interstitial ad.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/InterstitialAd.destroy.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.destroy | ✔️ |  |  |

### offClose

Un-listens on the interstitial ad close event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/InterstitialAd.offClose.html)

```tsx
(callback: OffCloseCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OffCloseCallback</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.offClose | ✔️ |  |  |

### offError

Un-listens on the interstitial ad error event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/InterstitialAd.offError.html)

```tsx
(callback: OffErrorCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OffErrorCallback</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.offError | ✔️ |  |  |

### offLoad

Un-listens on the interstitial ad loading event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/InterstitialAd.offLoad.html)

```tsx
(callback: OffLoadCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OffLoadCallback</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.offLoad | ✔️ |  |  |

### onClose

Listens on interstitial ad close event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/InterstitialAd.onClose.html)

```tsx
(callback: OnCloseCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnCloseCallback</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.onClose | ✔️ |  |  |

### onError

Listens on the interstitial ad error event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/InterstitialAd.onError.html)

```tsx
(callback: OnErrorCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnErrorCallback</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.onError | ✔️ |  |  |

### onLoad

Listens on the interstitial ad loading event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/InterstitialAd.onLoad.html)

```tsx
(callback: OnLoadCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>OnLoadCallback</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.onLoad | ✔️ |  |  |

### load

Loads an interstitial ad.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/InterstitialAd.load.html)

```tsx
() => Promise<any>
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.load | ✔️ |  |  |

### show

Displays an interstitial ad.

**Error Codes**

If an interstitial ad fails to display. the `InterstitialAd.show()` method returns a rejected Promise, which allows the developer to obtain the error code and the error message.

| Code | Exception | Cause |
| ------ | -------------- | -------------------------- |
| 2001  | Rate limit triggered  | Interstitial ads cannot be displayed for a certain time after the Mini Program starts. |
| 2002  | Rate limit triggered  | Interstitial ads cannot be displayed until a specified interval elapses after the display of a previous interstitial ad or rewarded video ad. |
| 2003  | Rate limit triggered  | Interstitial ads cannot be displayed when a rewarded video ad or another interstitial ad is being displayed. |
| 2004  | Failed to render ad  | This error is not caused by the developer's abnormal operation. It may be a result of switching between Mini Program pages. |
| 2005  | Unusual ad call  | Cross-page calls are not allowed for interstitial ad instances. |

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/InterstitialAd.show.html)

```tsx
() => Promise<any>
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| InterstitialAd.show | ✔️ |  |  |

## Parameters

### OffCloseCallback

The callback function for the interstitial ad close event.

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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

The callback function for the interstitial ad error event.

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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

The callback function for the interstitial ad loading event.

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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

The callback function for the interstitial ad close event.

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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

The callback function for the interstitial ad error event.

```tsx
(result: OnErrorCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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

The callback function for the interstitial ad loading event.

```tsx
(res: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errCode</td>
      <td><code>1000 | 1001 | 1002 | 1003 | 1004 | 1005 | 1006 | 1007 | 1008</code></td>
      <td>Error code<br /><a href="/taro/docs/apis/General#aderrcode">Reference</a></td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
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
