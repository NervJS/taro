---
title: Taro.getAvailableAudioSources(option)
sidebar_label: getAvailableAudioSources
id: version-2.1.1-getAvailableAudioSources
original_id: getAvailableAudioSources
---

获取当前支持的音频输入源

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.getAvailableAudioSources.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
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
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

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
      <td>audioSources</td>
      <td><code>(&quot;auto&quot; | &quot;buildInMic&quot; | &quot;headsetMic&quot; | &quot;mic&quot; | &quot;camcorder&quot; | &quot;voice_communication&quot; | &quot;voice_recognition&quot;)[]</code></td>
      <td>支持的音频输入源列表，可在 <a href="https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.start.html">RecorderManager.start()</a> 接口中使用。返回值定义参考 https://developer.android.com/reference/kotlin/android/media/MediaRecorder.AudioSource</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### audioSources

支持的音频输入源

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>auto</td>
      <td>自动设置，默认使用手机麦克风，插上耳麦后自动切换使用耳机麦克风，所有平台适用</td>
    </tr>
    <tr>
      <td>buildInMic</td>
      <td>手机麦克风，仅限 iOS</td>
    </tr>
    <tr>
      <td>headsetMic</td>
      <td>耳机麦克风，仅限 iOS</td>
    </tr>
    <tr>
      <td>mic</td>
      <td>麦克风（没插耳麦时是手机麦克风，插耳麦时是耳机麦克风），仅限 Android</td>
    </tr>
    <tr>
      <td>camcorder</td>
      <td>同 mic，适用于录制音视频内容，仅限 Android</td>
    </tr>
    <tr>
      <td>voice_communication</td>
      <td>同 mic，适用于实时沟通，仅限 Android</td>
    </tr>
    <tr>
      <td>voice_recognition</td>
      <td>同 mic，适用于语音识别，仅限 Android</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getAvailableAudioSources | ✔️ |  |  |
