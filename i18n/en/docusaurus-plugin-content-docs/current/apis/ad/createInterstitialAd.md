---
title: Taro.createInterstitialAd(option)
sidebar_label: createInterstitialAd
---

Creates an interstitial ad component. Before using this API, use the object's SDKVersion returned by `Taro.getSystemInfoSync()` to determine the base library version number. A new instance is returned each time an interstitial ad is created by calling this method (interstitial ad instances in Mini Programs cannot be used across pages).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/wx.createInterstitialAd.html)

## Type

```tsx
(option: Option) => InterstitialAd
```

## Parameters

### Option

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
      <td>adUnitId</td>
      <td><code>string</code></td>
      <td>Ad unit ID</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createInterstitialAd | ✔️ |  |  |
