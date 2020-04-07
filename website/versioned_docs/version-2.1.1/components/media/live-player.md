---
title: LivePlayer
sidebar_label: LivePlayer
id: version-2.1.1-live-player
original_id: live-player
---

实时音视频播放。相关api：Taro.createLivePlayerContext

需要先通过类目审核，再在小程序管理后台，“设置”-“接口设置”中自助开通该组件权限。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html)

## 类型

```tsx
ComponentType<LivePlayerProps>
```

## 示例代码

```tsx
class App extends Components {
  render () {
    return (
      <LivePlayer src='url' mode='live' autoplay  />
    )
  }
}
```

## LivePlayerProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>src</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>音视频地址。目前仅支持 flv, rtmp 格式</td>
    </tr>
    <tr>
      <td>mode</td>
      <td><code>&quot;live&quot; | &quot;RTC&quot;</code></td>
      <td style="text-align:center"><code>&quot;live&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>模式</td>
    </tr>
    <tr>
      <td>autoplay</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>自动播放</td>
    </tr>
    <tr>
      <td>muted</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否静音</td>
    </tr>
    <tr>
      <td>orientation</td>
      <td><code>&quot;vertical&quot; | &quot;horizontal&quot;</code></td>
      <td style="text-align:center"><code>&quot;vertical&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>画面方向</td>
    </tr>
    <tr>
      <td>objectFit</td>
      <td><code>&quot;contain&quot; | &quot;fillCrop&quot;</code></td>
      <td style="text-align:center"><code>&quot;contain&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>填充模式</td>
    </tr>
    <tr>
      <td>backgroundMute</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>进入后台时是否静音（已废弃，默认退台静音）<br /><strong>不推荐使用</strong></td>
    </tr>
    <tr>
      <td>minCache</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>1</code></td>
      <td style="text-align:center">否</td>
      <td>进最小缓冲区，单位s</td>
    </tr>
    <tr>
      <td>maxCache</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>3</code></td>
      <td style="text-align:center">否</td>
      <td>进最小缓冲区，单位s</td>
    </tr>
    <tr>
      <td>soundMode</td>
      <td><code>&quot;speaker&quot; | &quot;ear&quot;</code></td>
      <td style="text-align:center"><code>&quot;speaker&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>声音输出方式</td>
    </tr>
    <tr>
      <td>autoPauseIfNavigate</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>当跳转到本小程序的其他页面时，是否自动暂停本页面的实时音视频播放</td>
    </tr>
    <tr>
      <td>autoPauseIfOpenNavigate</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>当跳转到其它微信原生页面时，是否自动暂停本页面的实时音视频播放</td>
    </tr>
    <tr>
      <td>onStateChange</td>
      <td><code>BaseEventOrigFunction&lt;onStateChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>播放状态变化事件，detail = {code}</td>
    </tr>
    <tr>
      <td>onFullScreenChange</td>
      <td><code>BaseEventOrigFunction&lt;onFullScreenChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>全屏变化事件，detail = {direction, fullScreen}</td>
    </tr>
    <tr>
      <td>onNetstatus</td>
      <td><code>BaseEventOrigFunction&lt;onNetStatusEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>网络状态通知，detail = {info}</td>
    </tr>
    <tr>
      <td>onAudioVolumenotify</td>
      <td><code>BaseEventOrigFunction&lt;{}&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>播放音量大小通知，detail = {}</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayerProps.src | ✔️ |  |  |
| LivePlayerProps.mode | ✔️ |  |  |
| LivePlayerProps.autoplay | ✔️ |  |  |
| LivePlayerProps.muted | ✔️ |  |  |
| LivePlayerProps.orientation | ✔️ |  |  |
| LivePlayerProps.objectFit | ✔️ |  |  |
| LivePlayerProps.backgroundMute | ✔️ |  |  |
| LivePlayerProps.minCache | ✔️ |  |  |
| LivePlayerProps.maxCache | ✔️ |  |  |
| LivePlayerProps.soundMode | ✔️ |  |  |
| LivePlayerProps.autoPauseIfNavigate | ✔️ |  |  |
| LivePlayerProps.autoPauseIfOpenNavigate | ✔️ |  |  |
| LivePlayerProps.onStateChange | ✔️ |  |  |
| LivePlayerProps.onFullScreenChange | ✔️ |  |  |
| LivePlayerProps.onNetstatus | ✔️ |  |  |
| LivePlayerProps.onAudioVolumenotify | ✔️ |  |  |

### mode

mode 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>live</td>
      <td>直播</td>
    </tr>
    <tr>
      <td>RTC</td>
      <td>实时通话，该模式时延更低</td>
    </tr>
  </tbody>
</table>

### orientation

orientation 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>vertical</td>
      <td>竖直</td>
    </tr>
    <tr>
      <td>horizontal</td>
      <td>水平</td>
    </tr>
  </tbody>
</table>

### objectFit

objectFit 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>contain</td>
      <td>图像长边填满屏幕，短边区域会被填充⿊⾊</td>
    </tr>
    <tr>
      <td>fillCrop</td>
      <td>图像铺满屏幕，超出显示区域的部分将被截掉</td>
    </tr>
  </tbody>
</table>

### soundMode

soundMode 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>speaker</td>
      <td>扬声器</td>
    </tr>
    <tr>
      <td>ear</td>
      <td>听筒</td>
    </tr>
  </tbody>
</table>

### onStateChangeEventDetail

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
      <td>code</td>
      <td><code>number</code></td>
      <td>状态码</td>
    </tr>
  </tbody>
</table>

### onFullScreenChangeEventDetail

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
      <td>direction</td>
      <td><code>number</code></td>
      <td>方向</td>
    </tr>
    <tr>
      <td>fullScreen</td>
      <td><code>number | boolean</code></td>
      <td>全屏</td>
    </tr>
  </tbody>
</table>

### onNetStatusEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>info</td>
      <td><code>netStatus</code></td>
    </tr>
  </tbody>
</table>

### status

状态码

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2001</td>
      <td>已经连接服务器</td>
    </tr>
    <tr>
      <td>2002</td>
      <td>已经连接 RTMP 服务器,开始拉流</td>
    </tr>
    <tr>
      <td>2003</td>
      <td>网络接收到首个视频数据包(IDR)</td>
    </tr>
    <tr>
      <td>2004</td>
      <td>视频播放开始</td>
    </tr>
    <tr>
      <td>2005</td>
      <td>视频播放进度</td>
    </tr>
    <tr>
      <td>2006</td>
      <td>视频播放结束</td>
    </tr>
    <tr>
      <td>2007</td>
      <td>视频播放Loading</td>
    </tr>
    <tr>
      <td>2008</td>
      <td>解码器启动</td>
    </tr>
    <tr>
      <td>2009</td>
      <td>视频分辨率改变</td>
    </tr>
    <tr>
      <td>-2301</td>
      <td>网络断连，且经多次重连抢救无效，更多重试请自行重启播放</td>
    </tr>
    <tr>
      <td>-2302</td>
      <td>获取加速拉流地址失败</td>
    </tr>
    <tr>
      <td>2101</td>
      <td>当前视频帧解码失败</td>
    </tr>
    <tr>
      <td>2102</td>
      <td>当前音频帧解码失败</td>
    </tr>
    <tr>
      <td>2103</td>
      <td>网络断连, 已启动自动重连</td>
    </tr>
    <tr>
      <td>2104</td>
      <td>网络来包不稳：可能是下行带宽不足，或由于主播端出流不均匀</td>
    </tr>
    <tr>
      <td>2105</td>
      <td>当前视频播放出现卡顿</td>
    </tr>
    <tr>
      <td>2106</td>
      <td>硬解启动失败，采用软解</td>
    </tr>
    <tr>
      <td>2107</td>
      <td>当前视频帧不连续，可能丢帧</td>
    </tr>
    <tr>
      <td>2108</td>
      <td>当前流硬解第一个I帧失败，SDK自动切软解</td>
    </tr>
    <tr>
      <td>3001</td>
      <td>RTMP -DNS解析失败</td>
    </tr>
    <tr>
      <td>3002</td>
      <td>RTMP服务器连接失败</td>
    </tr>
    <tr>
      <td>3003</td>
      <td>RTMP服务器握手失败</td>
    </tr>
    <tr>
      <td>3005</td>
      <td>RTMP 读/写失败</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayer | ✔️ |  |  |
