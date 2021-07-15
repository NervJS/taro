---
title: Taro.createRewardedVideoAd(option)
sidebar_label: createRewardedVideoAd
---

Creates a rewarded video ad component.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ad/wx.createRewardedVideoAd.html)

## Type

```tsx
(option: Option) => RewardedVideoAd
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>adUnitId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Ad unit ID</td>
    </tr>
    <tr>
      <td>multiton</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to enable multi-instance mode.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createRewardedVideoAd | ✔️ |  |  |
