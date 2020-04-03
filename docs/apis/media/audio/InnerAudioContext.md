---
title: InnerAudioContext
sidebar_label: InnerAudioContext
---

InnerAudioContext 实例，可通过 Taro.createInnerAudioContext 接口获取实例。

**支持格式**

| 格式 | iOS  | Android |
| ---- | ---- | ------- |
| flac | x    | √       |
| m4a  | √    | √       |
| ogg  | x    | √       |
| ape  | x    | √       |
| amr  | x    | √       |
| wma  | x    | √       |
| wav  | √    | √       |
| mp3  | √    | √       |
| mp4  | x    | √       |
| aac  | √    | √       |
| aiff | √    | x       |
| caf  | √    | x       |

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/InnerAudioContext.html)

## 方法

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">只读</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>autoplay</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否自动开始播放</td>
    </tr>
    <tr>
      <td>buffered</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲</td>
    </tr>
    <tr>
      <td>currentTime</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>当前音频的播放位置（单位 s）。只有在当前有合法的 src 时返回，时间保留小数点后 6 位</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>当前音频的长度（单位 s）。只有在当前有合法的 src 时返回</td>
    </tr>
    <tr>
      <td>loop</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否循环播放</td>
    </tr>
    <tr>
      <td>obeyMuteSwitch</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>是否遵循系统静音开关。当此参数为 <code>false</code> 时，即使用户打开了静音开关，也能继续发出声音。从 2.3.0 版本开始此参数不生效，使用 <a href="https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.setInnerAudioOption.html">Taro.setInnerAudioOption</a> 接口统一设置。</td>
    </tr>
    <tr>
      <td>paused</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>当前是是否暂停或停止状态</td>
    </tr>
    <tr>
      <td>src</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>音频资源的地址，用于直接播放。</td>
    </tr>
    <tr>
      <td>startTime</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
      <td>开始播放的位置（单位：s）</td>
    </tr>
    <tr>
      <td>volume</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>1</code></td>
      <td style="text-align:center">否</td>
      <td>音量。范围 0~1。</td>
    </tr>
  </tbody>
</table>

### play

播放

```tsx
() => void
```

### pause

暂停

```tsx
() => void
```

### stop

停止

```tsx
() => void
```

### seek

跳转到指定位置，单位 s

```tsx
(position: number) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>position</td>
      <td><code>number</code></td>
    </tr>
  </tbody>
</table>

### destroy

销毁当前实例

```tsx
() => void
```

### onCanplay

音频进入可以播放状态，但不保证后面可以流畅播放

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onPlay

音频播放事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onPause

音频暂停事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onStop

音频停止事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onEnded

音频自然播放结束事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onTimeUpdate

音频播放进度更新事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onError

音频播放错误事件

```tsx
(callback?: (res: onErrorDetail) => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(res: onErrorDetail) =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onWaiting

音频加载中事件，当音频因为数据不足，需要停下来加载时会触发

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onSeeking

音频进行 seek 操作事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### onSeeked

音频完成 seek 操作事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offCanplay

取消监听 onCanplay 事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offPlay

取消监听 onPlay 事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offPause

取消监听 onPause 事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offStop

取消监听 onStop 事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offEnded

取消监听 onEnded 事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offTimeUpdate

取消监听 onTimeUpdate 事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offError

取消监听 onError 事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offWaiting

取消监听 onWaiting 事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offSeeking

取消监听 onSeeking 事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

### offSeeked

取消监听 onSeeked 事件

```tsx
(callback?: () => void) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>() =&gt; void</code></td>
    </tr>
  </tbody>
</table>

## 参数

### onErrorDetail

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
      <td>errCode</td>
      <td><code>number</code></td>
      <td>错误码</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息</td>
    </tr>
  </tbody>
</table>

### onErrorDetailErrCode

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>10001</td>
      <td>系统错误</td>
    </tr>
    <tr>
      <td>10002</td>
      <td>网络错误</td>
    </tr>
    <tr>
      <td>10003</td>
      <td>文件错误</td>
    </tr>
    <tr>
      <td>10004</td>
      <td>格式错误</td>
    </tr>
    <tr>
      <td>-1</td>
      <td>未知错误</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
const innerAudioContext = Taro.createInnerAudioContext()
innerAudioContext.autoplay = true
innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
innerAudioContext.onPlay(() => {
  console.log('开始播放')
})
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})
```
