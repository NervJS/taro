---
title: Taro.stopVoice(option)
sidebar_label: stopVoice
id: version-2.1.1-stopVoice
original_id: stopVoice
---

结束播放语音。
**注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html) 接口**

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.stopVoice.html)

## 类型

```tsx
(option?: Option) => void
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

## 示例代码

### 示例 1

```tsx
Taro.startRecord({
  success: function (res) {
    const filePath = res.tempFilePath
    Taro.playVoice({ filePath })

    setTimeout(Taro.stopVoice, 5000)
  }
})
```

### 示例 2

```tsx
Taro.startRecord(params).then(res => {
  const filePath = res.tempFilePath
  Taro.playVoice({ filePath })

  setTimeout(Taro.stopVoice, 5000)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.stopVoice | ✔️ |  |  |
