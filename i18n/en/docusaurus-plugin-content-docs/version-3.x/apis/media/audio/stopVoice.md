---
title: Taro.stopVoice(option)
sidebar_label: stopVoice
---

Stops the playback of a voice file.

**Note:** As of base library 1.6.0, this API is not maintained. Use [Taro.createInnerAudioContext](./createInnerAudioContext.md) instead.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/audio/wx.stopVoice.html)

## Type

```tsx
(option?: Option) => void
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
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

## Sample Code

### Example 1

```tsx
Taro.startRecord({
  success: function (res) {
    const filePath = res.tempFilePath
    Taro.playVoice({ filePath })

    setTimeout(Taro.stopVoice, 5000)
  }
})
```

### Example 2

```tsx
Taro.startRecord(params).then(res => {
  const filePath = res.tempFilePath
  Taro.playVoice({ filePath })

  setTimeout(Taro.stopVoice, 5000)
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.stopVoice | ✔️ |  |  |
