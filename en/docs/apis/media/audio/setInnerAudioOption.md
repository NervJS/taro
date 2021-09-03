---
title: Taro.setInnerAudioOption(option)
sidebar_label: setInnerAudioOption
---

Sets the playback options for [InnerAudioContext](./InnerAudioContext.md).The options apply to the current Mini Program globally once set.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.setInnerAudioOption.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
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
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>mixWithOther</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>obeyMuteSwitch</td>
      <td><code>boolean</code></td>
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

## API Support

|           API            | WeChat Mini-Program | H5 | React Native |
|:------------------------:|:-------------------:|:--:|:------------:|
| Taro.setInnerAudioOption |         ✔️          |    |              |
