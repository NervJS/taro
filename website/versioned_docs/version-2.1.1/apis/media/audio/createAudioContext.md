---
title: Taro.createAudioContext(id, component)
sidebar_label: createAudioContext
id: version-2.1.1-createAudioContext
original_id: createAudioContext
---

创建 audio 上下文 AudioContext 对象。
**注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html) 接口**

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createAudioContext.html)

## 类型

```tsx
(id: string, component?: Record<string, any>) => AudioContext
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
      <td>id</td>
      <td><code>string</code></td>
      <td><a href="https://developers.weixin.qq.com/miniprogram/dev/component/audio.html">audio</a> 组件的 id</td>
    </tr>
    <tr>
      <td>component</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>在自定义组件下，当前组件实例的this，以操作组件内 <a href="https://developers.weixin.qq.com/miniprogram/dev/component/audio.html">audio</a> 组件</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
const audioCtx = Taro.createAudioContext('myAudio')
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createAudioContext | ✔️ |  |  |
