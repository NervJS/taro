---
title: Taro.offAudioInterruptionEnd(callback)
sidebar_label: offAudioInterruptionEnd
id: version-2.1.1-offAudioInterruptionEnd
original_id: offAudioInterruptionEnd
---

取消监听音频中断结束事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offAudioInterruptionEnd.html)

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
      <td>音频中断结束事件的回调函数</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offAudioInterruptionEnd | ✔️ |  |  |
