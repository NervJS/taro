---
title: Taro.createVideoContext(id, component)
sidebar_label: createVideoContext
---

Creates the VideoContext object for the video.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/wx.createVideoContext.html)

## Type

```tsx
(id: string, component?: Record<string, any>) => VideoContext
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
      <td>id</td>
      <td><code>string</code></td>
      <td>The video component's ID</td>
    </tr>
    <tr>
      <td>component</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The <code>this</code> object of the current component instance in custom components. It is used with the video component</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
videoContext = Taro.createVideoContext('myVideo')
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createVideoContext | ✔️ | ✔️ | ✔️ |
