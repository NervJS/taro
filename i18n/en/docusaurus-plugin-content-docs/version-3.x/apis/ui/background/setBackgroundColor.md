---
title: Taro.setBackgroundColor(option)
sidebar_label: setBackgroundColor
---

Dynamically sets the background color of the window.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/background/wx.setBackgroundColor.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
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
      <td>backgroundColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The background color of the window, which must be a hexadecimal value</td>
    </tr>
    <tr>
      <td>backgroundColorBottom</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The background color of the bottom window (only for iOS), which must be a hexadecimal value</td>
    </tr>
    <tr>
      <td>backgroundColorTop</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The background color of the top window (only for iOS), which must be a hexadecimal value</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.setBackgroundColor({
  backgroundColor: '#ffffff', // The background color of the window is white.
})
Taro.setBackgroundColor({
  backgroundColorTop: '#ffffff', // The background color of the top window is white.
  backgroundColorBottom: '#ffffff', // The background color of the bottom window is white.
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setBackgroundColor | ✔️ |  | ✔️(Only Android) |
