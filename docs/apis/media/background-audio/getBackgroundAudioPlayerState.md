---
title: Taro.getBackgroundAudioPlayerState(option)
sidebar_label: getBackgroundAudioPlayerState
---

获取后台音乐播放状态。
**注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.getBackgroundAudioManager](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.getBackgroundAudioManager.html) 接口**

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.getBackgroundAudioPlayerState.html)

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
      <td>currentPosition</td>
      <td><code>number</code></td>
      <td>选定音频的播放位置（单位：s），只有在音乐播放中时返回</td>
    </tr>
    <tr>
      <td>dataUrl</td>
      <td><code>string</code></td>
      <td>歌曲数据链接，只有在音乐播放中时返回</td>
    </tr>
    <tr>
      <td>downloadPercent</td>
      <td><code>number</code></td>
      <td>音频的下载进度百分比，只有在音乐播放中时返回</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td>选定音频的长度（单位：s），只有在音乐播放中时返回</td>
    </tr>
    <tr>
      <td>status</td>
      <td><code>0 | 1 | 2</code></td>
      <td>播放状态</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### status

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>暂停中</td>
    </tr>
    <tr>
      <td>1</td>
      <td>播放中</td>
    </tr>
    <tr>
      <td>2</td>
      <td>没有音乐播放</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.getBackgroundAudioPlayerState({
  success: function (res) {
    var status = res.status
    var dataUrl = res.dataUrl
    var currentPosition = res.currentPosition
    var duration = res.duration
    var downloadPercent = res.downloadPercent
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBackgroundAudioPlayerState | ✔️ |  |  |
