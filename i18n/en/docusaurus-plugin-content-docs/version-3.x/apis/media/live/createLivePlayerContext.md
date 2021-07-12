---
title: Taro.createLivePlayerContext(id, component)
sidebar_label: createLivePlayerContext
---

Creates the [LivePlayerContext](./LivePlayerContext.md) object for the live-player.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/live/wx.createLivePlayerContext.html)

## Type

```tsx
(id: string, component?: Record<string, any>) => LivePlayerContext
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
      <td>The <a href="https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html">live-player</a> component's ID</td>
    </tr>
    <tr>
      <td>component</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The <code>this</code> object of the current component instance in custom components. It is used with the <code>live-player</code> component</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createLivePlayerContext | ✔️ |  |  |
