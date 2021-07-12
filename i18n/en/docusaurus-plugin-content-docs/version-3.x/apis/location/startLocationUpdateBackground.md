---
title: Taro.startLocationUpdateBackground(option)
sidebar_label: startLocationUpdateBackground
---

Enabled Receive location messages when the applet enters the front and back

**Note**
- WeChat for Android version 7.0.6 and iOS version 7.0.5 support the interface.
- It must be configured in app.json with `requiredBackgroundModes: ['location']`.
- To obtain location information, you need to configure [Geolocation Usage Description](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#permission).

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.startLocationUpdateBackground.html)

## Type

```tsx
(option?: Option) => void
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startLocationUpdateBackground | ✔️ |  |  |
