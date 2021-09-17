---
title: Taro.vibrateShort(option)
sidebar_label: vibrateShort
---

Allows the phone to vibrate for a short period of time (15 ms). This only works on iPhone 7/7 Plus and Android models.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/vibrate/wx.vibrateShort.html)

## Type

```tsx
(option?: Option) => Promise<CallbackResult>
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

## Sample Code

```tsx
Taro.vibrateShort(params).then(...)
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.vibrateShort | ✔️ | ✔️ | ✔️ |
