---
title: Taro.offAudioInterruptionBegin(callback)
sidebar_label: offAudioInterruptionBegin
---

取消监听音频因为受到系统占用而被中断开始事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offAudioInterruptionBegin.html)

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
      <td>音频因为受到系统占用而被中断开始事件的回调函数</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.offAudioInterruptionBegin | ✔️ |  |  |
