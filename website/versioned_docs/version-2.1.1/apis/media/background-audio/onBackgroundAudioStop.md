---
title: Taro.onBackgroundAudioStop(callback)
sidebar_label: onBackgroundAudioStop
id: version-2.1.1-onBackgroundAudioStop
original_id: onBackgroundAudioStop
---

监听音乐停止。

**bug & tip：**

1.  `bug`: `iOS` `6.3.30` Taro.seekBackgroundAudio 会有短暂延迟

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.onBackgroundAudioStop.html)

## 类型

```tsx
(callback: (res: CallbackResult) => void) => void
```

## 参数

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>音乐停止事件的回调函数</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onBackgroundAudioStop | ✔️ |  |  |
