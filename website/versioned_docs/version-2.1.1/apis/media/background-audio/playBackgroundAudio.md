---
title: Taro.playBackgroundAudio(option)
sidebar_label: playBackgroundAudio
id: version-2.1.1-playBackgroundAudio
original_id: playBackgroundAudio
---

使用后台播放器播放音乐，对于微信客户端来说，只能同时有一个后台音乐在播放。当用户离开小程序后，音乐将暂停播放；当用户点击“显示在聊天顶部”时，音乐不会暂停播放；当用户在其他小程序占用了音乐播放器，原有小程序内的音乐将停止播放。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.playBackgroundAudio.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
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
      <td>dataUrl</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>音乐链接，目前支持的格式有 m4a, aac, mp3, wav</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>coverImgUrl</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>封面URL</td>
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
    <tr>
      <td>title</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>音乐标题</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.playBackgroundAudio({
  dataUrl: '',
  title: '',
  coverImgUrl: ''
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.playBackgroundAudio | ✔️ |  |  |
