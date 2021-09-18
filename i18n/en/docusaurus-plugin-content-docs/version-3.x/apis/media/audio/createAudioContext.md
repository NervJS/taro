---
title: Taro.createAudioContext(id, component)
sidebar_label: createAudioContext
---

Creates the AudioContext object for the audio.

**Note：As of base library 1.6.0, this API is not maintained. Use [Taro.createInnerAudioContext](./createInnerAudioContext.md) instead**

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/audio/wx.createAudioContext.html)

## Type

```tsx
(id: string, component?: Record<string, any>) => AudioContext
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
      <td>The <code>audio</code> component's ID</td>
    </tr>
    <tr>
      <td>component</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The <code>this</code> object of the current component instance in custom components. It is used with the audio component</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
const audioCtx = Taro.createAudioContext('myAudio')
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createAudioContext | ✔️ |  |  |
