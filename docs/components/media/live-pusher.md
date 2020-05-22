---
title: LivePusher
sidebar_label: LivePusher
---

实时音视频录制。需要用户授权 scope.camera、scope.record

需要先通过类目审核，再在小程序管理后台，「开发」-「接口设置」中自助开通该组件权限。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html)

## 类型

```tsx
ComponentType<LivePusherProps>
```

## 示例代码

```tsx
class App extends Components {
  render () {
    return (
      <LivePusher url='url' mode='RTC' autopush  />
    )
  }
}
```

## LivePusherProps

实时音视频录制。
需要用户授权 scope.camera、scope.record
暂只针对国内主体如下类目的小程序开放，需要先通过类目审核，再在小程序管理后台，“设置”-“接口设置”中自助开通该组件权限。

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
      <td>url</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>推流地址。目前仅支持 rtmp 格式</td>
    </tr>
    <tr>
      <td>mode</td>
      <td><code>&quot;SD&quot; | &quot;HD&quot; | &quot;FHD&quot; | &quot;RTC&quot;</code></td>
      <td style="text-align:center"><code>&quot;RTC&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>SD（标清）, HD（高清）, FHD（超清）, RTC（实时通话）</td>
    </tr>
    <tr>
      <td>autopush</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>自动推流</td>
    </tr>
    <tr>
      <td>muted</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否静音。即将废弃，可用 enable-mic 替代<br /><strong>不推荐使用</strong></td>
    </tr>
    <tr>
      <td>enableCamera</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>开启摄像头</td>
    </tr>
    <tr>
      <td>autoFocus</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>自动聚集</td>
    </tr>
    <tr>
      <td>orientation</td>
      <td><code>&quot;vertical&quot; | &quot;horizontal&quot;</code></td>
      <td style="text-align:center"><code>&quot;vertical&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>画面方向</td>
    </tr>
    <tr>
      <td>beauty</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
      <td>美颜，取值范围 0-9 ，0 表示关闭</td>
    </tr>
    <tr>
      <td>whiteness</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
      <td>美白，取值范围 0-9 ，0 表示关闭</td>
    </tr>
    <tr>
      <td>aspect</td>
      <td><code>&quot;9:16&quot; | &quot;3:4&quot;</code></td>
      <td style="text-align:center"><code>&quot;9:16&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>宽高比，可选值有 3:4, 9:16</td>
    </tr>
    <tr>
      <td>minBitrate</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>200</code></td>
      <td style="text-align:center">否</td>
      <td>最小码率</td>
    </tr>
    <tr>
      <td>maxBitrate</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>1000</code></td>
      <td style="text-align:center">否</td>
      <td>最大码率</td>
    </tr>
    <tr>
      <td>audioQuality</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;high&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>高音质(48KHz)或低音质(16KHz)，值为high, low</td>
    </tr>
    <tr>
      <td>waitingImage</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>进入后台时推流的等待画面</td>
    </tr>
    <tr>
      <td>waitingImageHash</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>等待画面资源的MD5值</td>
    </tr>
    <tr>
      <td>zoom</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>调整焦距</td>
    </tr>
    <tr>
      <td>devicePosition</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;front&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>前置或后置，值为front, back</td>
    </tr>
    <tr>
      <td>backgroundMute</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>进入后台时是否静音</td>
    </tr>
    <tr>
      <td>mirror</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>设置推流画面是否镜像，产生的效果在 LivePlayer 反应到<br /><strong>不推荐使用</strong></td>
    </tr>
    <tr>
      <td>remoteMirror</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>设置推流画面是否镜像，产生的效果在 LivePlayer 反应到<br /><br /><strong>Note:</strong> 同 mirror 属性，后续 mirror 将废弃</td>
    </tr>
    <tr>
      <td>localMirror</td>
      <td><code>&quot;auto&quot; | &quot;enable&quot; | &quot;disable&quot;</code></td>
      <td style="text-align:center"><code>&quot;auto&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>控制本地预览画面是否镜像</td>
    </tr>
    <tr>
      <td>audioReverbType</td>
      <td><code>0 | 1 | 2 | 3 | 4 | 5 | 6 | 7</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
      <td>音频混响类型</td>
    </tr>
    <tr>
      <td>enableMic</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>开启或关闭麦克风</td>
    </tr>
    <tr>
      <td>enableAgc</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否开启音频自动增益</td>
    </tr>
    <tr>
      <td>enableAns</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否开启音频噪声抑制</td>
    </tr>
    <tr>
      <td>audioVolumeType</td>
      <td><code>&quot;media&quot; | &quot;voicecall&quot;</code></td>
      <td style="text-align:center"><code>&quot;voicecall&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>音量类型</td>
    </tr>
    <tr>
      <td>videoWidth</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>360</code></td>
      <td style="text-align:center">否</td>
      <td>上推的视频流的分辨率宽度</td>
    </tr>
    <tr>
      <td>videoHeight</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>640</code></td>
      <td style="text-align:center">否</td>
      <td>上推的视频流的分辨率高度</td>
    </tr>
    <tr>
      <td>onStateChange</td>
      <td><code>BaseEventOrigFunction&lt;onStateChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>状态变化事件，detail = {code}</td>
    </tr>
    <tr>
      <td>onNetstatus</td>
      <td><code>BaseEventOrigFunction&lt;onNetstatusEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>网络状态通知，detail = {info}</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;onErrorEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>渲染错误事件，detail = {errMsg, errCode}</td>
    </tr>
    <tr>
      <td>onBgmStart</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>背景音开始播放时触发</td>
    </tr>
    <tr>
      <td>onBgmProgress</td>
      <td><code>BaseEventOrigFunction&lt;onBgmProgressEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>背景音进度变化时触发，detail = {progress, duration}</td>
    </tr>
    <tr>
      <td>onBgmComplete</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>背景音播放完成时触发</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusherProps.url | ✔️ |  |  |
| LivePusherProps.mode | ✔️ |  |  |
| LivePusherProps.autopush | ✔️ |  |  |
| LivePusherProps.muted | ✔️ |  |  |
| LivePusherProps.enableCamera | ✔️ |  |  |
| LivePusherProps.autoFocus | ✔️ |  |  |
| LivePusherProps.orientation | ✔️ |  |  |
| LivePusherProps.beauty | ✔️ |  |  |
| LivePusherProps.whiteness | ✔️ |  |  |
| LivePusherProps.aspect | ✔️ |  |  |
| LivePusherProps.minBitrate | ✔️ |  |  |
| LivePusherProps.maxBitrate | ✔️ |  |  |
| LivePusherProps.audioQuality | ✔️ |  |  |
| LivePusherProps.waitingImage | ✔️ |  |  |
| LivePusherProps.waitingImageHash | ✔️ |  |  |
| LivePusherProps.zoom | ✔️ |  |  |
| LivePusherProps.devicePosition | ✔️ |  |  |
| LivePusherProps.backgroundMute | ✔️ |  |  |
| LivePusherProps.mirror | ✔️ |  |  |
| LivePusherProps.remoteMirror | ✔️ |  |  |
| LivePusherProps.localMirror | ✔️ |  |  |
| LivePusherProps.audioReverbType | ✔️ |  |  |
| LivePusherProps.enableMic | ✔️ |  |  |
| LivePusherProps.enableAgc | ✔️ |  |  |
| LivePusherProps.enableAns | ✔️ |  |  |
| LivePusherProps.audioVolumeType | ✔️ |  |  |
| LivePusherProps.videoWidth | ✔️ |  |  |
| LivePusherProps.videoHeight | ✔️ |  |  |
| LivePusherProps.onStateChange | ✔️ |  |  |
| LivePusherProps.onNetstatus | ✔️ |  |  |
| LivePusherProps.onError | ✔️ |  |  |
| LivePusherProps.onBgmStart | ✔️ |  |  |
| LivePusherProps.onBgmProgress | ✔️ |  |  |
| LivePusherProps.onBgmComplete | ✔️ |  |  |

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

### localMirror

localMirror 的合法值

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
      <td>前置摄像头镜像，后置摄像头不镜像</td>
    </tr>
    <tr>
      <td>enable</td>
      <td>前后置摄像头均镜像</td>
    </tr>
    <tr>
      <td>disable</td>
      <td>前后置摄像头均不镜像</td>
    </tr>
  </tbody>
</table>

### audioReverbType

audioReverbType 的合法值

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
      <td>关闭</td>
    </tr>
    <tr>
      <td>1</td>
      <td>KTV</td>
    </tr>
    <tr>
      <td>2</td>
      <td>小房间</td>
    </tr>
    <tr>
      <td>3</td>
      <td>大会堂</td>
    </tr>
    <tr>
      <td>4</td>
      <td>低沉</td>
    </tr>
    <tr>
      <td>5</td>
      <td>洪亮</td>
    </tr>
    <tr>
      <td>6</td>
      <td>金属声</td>
    </tr>
    <tr>
      <td>7</td>
      <td>磁性</td>
    </tr>
  </tbody>
</table>

### audioVolumeType

audioVolumeType 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>media</td>
      <td>媒体音量</td>
    </tr>
    <tr>
      <td>voicecall</td>
      <td>通话音量</td>
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

### onNetstatusEventDetail

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
      <td>info</td>
      <td><code>netStatus</code></td>
      <td>网络状态</td>
    </tr>
  </tbody>
</table>

### onErrorEventDetail

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息</td>
    </tr>
    <tr>
      <td>errCode</td>
      <td><code>string | number</code></td>
      <td>错误码</td>
    </tr>
  </tbody>
</table>

### onBgmProgressEventDetail

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
      <td>progress</td>
      <td><code>any</code></td>
      <td>进展</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td>持续时间</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusher | ✔️ |  |  |
