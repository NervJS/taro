---
title: Taro.onUserCaptureScreen(callback)
sidebar_label: onUserCaptureScreen
---

Listens on the event that the user actively takes screenshots. It is triggered when the user uses the screenshot button of the system to take a screenshot.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/screen/wx.onUserCaptureScreen.html)

## Type

```tsx
(callback: (res: CallbackResult) => void) => void
```

## Parameters

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
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>The callback function for the event that the user actively takes screenshots.</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.onUserCaptureScreen(function (res) {
  console.log('User took a screenshot')
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onUserCaptureScreen | ✔️ |  |  |
