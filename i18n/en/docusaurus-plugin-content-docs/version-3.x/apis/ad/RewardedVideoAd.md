---
title: RewardedVideoAd
sidebar_label: RewardedVideoAd
---

Rewarded video ad component. This is a native component at a higher layer than normal components. A rewarded video ad is a singleton (a global singleton in Mini Games, and an intra-page singleton in Mini Programs where singleton objects cannot be used across pages), which is hidden by default, and you must call `RewardedVideoAd.show()` to display them.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/RewardedVideoAd.html)

## Methods

### load

Loads a rewarded video ad.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/RewardedVideoAd.load.html)

```tsx
() => Promise<any>
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RewardedVideoAd.load | ✔️ |  |  |

### show

Displays rewarded video ads. These ads are pushed from the bottom of the screen.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/RewardedVideoAd.show.html)

```tsx
() => Promise<any>
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RewardedVideoAd.show | ✔️ |  |  |

### destroy

Destory rewarded video ads.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/RewardedVideoAd.destroy.html)

```tsx
() => void
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RewardedVideoAd.destroy | ✔️ |  |  |

### offClose

Un-listens on the event of tapping the `Close Ad` button.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/RewardedVideoAd.offClose.html)

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
| RewardedVideoAd.offClose | ✔️ |  |  |

### offError

Un-listens on the rewarded video error event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/RewardedVideoAd.offError.html)

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
| RewardedVideoAd.offError | ✔️ |  |  |

### offLoad

Un-listens on the rewarded video ad loading event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/RewardedVideoAd.offLoad.html)

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
| RewardedVideoAd.offLoad | ✔️ |  |  |

### onClose

Listens on the event of tapping the `Close Ad` button.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/RewardedVideoAd.onClose.html)

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
| RewardedVideoAd.onClose | ✔️ |  |  |

### onError

Listens on the rewarded video error event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/RewardedVideoAd.onError.html)

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
| RewardedVideoAd.onError | ✔️ |  |  |

### onLoad

Listens on the rewarded video ad loading event.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/RewardedVideoAd.onLoad.html)

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
| RewardedVideoAd.onLoad | ✔️ |  |  |

## Parameters

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

### OnCloseCallbackResult

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
      <td>isEnded</td>
      <td><code>boolean</code></td>
      <td>Indicates whether the video is closed when the user watches it to the end</td>
    </tr>
  </tbody>
</table>

### OffCloseCallback

The callback function for the event of tapping the `Close Ad` button.

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

The callback function for the rewarded video ad error event.

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

The callback function for the rewarded video ad loading event.

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

The callback function for the event of tapping the `Close Ad` button.

```tsx
(result: OnCloseCallbackResult) => void
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
      <td><code>OnCloseCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### OnErrorCallback

The callback function for the rewarded video ad error event.

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

The callback function for the rewarded video ad loading event.

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

## API Support

| API | WeChat Mini-Program | H5 | React Native |
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
