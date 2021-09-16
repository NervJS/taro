---
title: Taro.getScreenBrightness(option)
sidebar_label: getScreenBrightness
---

Gets screen brightness.

**Note**
- If the auto brightness adjustment feature is enabled in the Android system, the screen brightness will be automatically adjusted according to the light. And this API can only obtain the brightness value before the auto brightness adjustment, instead of the real-time brightness value.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/screen/wx.getScreenBrightness.html)

## Type

```tsx
(option?: Option) => Promise<SuccessCallbackOption>
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

### SuccessCallbackOption

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
      <td>value</td>
      <td><code>number</code></td>
      <td>Screen brightness. Range: 0 (Darkest) to 1 (Brightest).</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getScreenBrightness | ✔️ |  | ✔️ |
