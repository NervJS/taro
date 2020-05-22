---
title: VideoContext
sidebar_label: VideoContext
id: version-2.1.1-VideoContext
original_id: VideoContext
---

## 方法

### exitFullScreen

退出全屏

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.exitFullScreen.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.exitFullScreen | ✔️ |  |  |

### hideStatusBar

隐藏状态栏，仅在iOS全屏下有效

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.hideStatusBar.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.hideStatusBar | ✔️ |  |  |

### pause

暂停视频

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.pause.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.pause | ✔️ |  |  |

### play

播放视频

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.play.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.play | ✔️ |  |  |

### playbackRate

设置倍速播放

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.playbackRate.html)

```tsx
(rate: number) => void
```

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
      <td>rate</td>
      <td><code>number</code></td>
      <td>倍率，支持 0.5/0.8/1.0/1.25/1.5，2.6.3 起支持 2.0 倍速</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.playbackRate | ✔️ |  |  |

### requestFullScreen

进入全屏

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.requestFullScreen.html)

```tsx
(option: RequestFullScreenOption) => void
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
      <td>option</td>
      <td><code>RequestFullScreenOption</code></td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.requestFullScreen | ✔️ |  |  |

### seek

跳转到指定位置

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.seek.html)

```tsx
(position: number) => void
```

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
      <td>position</td>
      <td><code>number</code></td>
      <td>跳转到的位置，单位 s</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.seek | ✔️ |  |  |

### sendDanmu

发送弹幕

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.sendDanmu.html)

```tsx
(data: Danmu) => void
```

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
      <td>data</td>
      <td><code>Danmu</code></td>
      <td>弹幕内容</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.sendDanmu | ✔️ |  |  |

### showStatusBar

显示状态栏，仅在iOS全屏下有效

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.showStatusBar.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.showStatusBar | ✔️ |  |  |

### stop

停止视频

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.stop.html)

```tsx
() => void
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.stop | ✔️ |  |  |

## 参数

### RequestFullScreenOption

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
      <td>direction</td>
      <td><code>0 | 90 | -90</code></td>
      <td style="text-align:center">否</td>
      <td>设置全屏时视频的方向，不指定则根据宽高比自动判断。<br /><br />可选值：<br />- 0: 正常竖向;<br />- 90: 屏幕逆时针90度;<br />- -90: 屏幕顺时针90度;</td>
    </tr>
  </tbody>
</table>

### Danmu

弹幕内容

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
      <td>text</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>弹幕文字</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>弹幕颜色</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VideoContext.exitFullScreen | ✔️ |  |  |
| VideoContext.hideStatusBar | ✔️ |  |  |
| VideoContext.pause | ✔️ |  |  |
| VideoContext.play | ✔️ |  |  |
| VideoContext.playbackRate | ✔️ |  |  |
| VideoContext.requestFullScreen | ✔️ |  |  |
| VideoContext.seek | ✔️ |  |  |
| VideoContext.sendDanmu | ✔️ |  |  |
| VideoContext.showStatusBar | ✔️ |  |  |
| VideoContext.stop | ✔️ |  |  |
