---
title: Audio
sidebar_label: Audio
id: version-2.1.1-audio
original_id: audio
---

音频。1.6.0版本开始，该组件不再维护。建议使用能力更强的 Taro.createInnerAudioContext 接口

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/audio.html)

## 类型

```tsx
ComponentType<AudioProps>
```

## 示例代码

```tsx
export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Audio
          src='http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46'
          controls={true}
          autoplay={false}
          loop={false}
          muted={true}
          initialTime='30'
          id='video'
        />
      </View>
    )
  }
}
```

## AudioProps

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
      <td>id</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>audio 组件的唯一标识符</td>
    </tr>
    <tr>
      <td>src</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>要播放音频的资源地址</td>
    </tr>
    <tr>
      <td>loop</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">是</td>
      <td>是否循环播放</td>
    </tr>
    <tr>
      <td>muted</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否静音播放<br /><strong>不推荐使用</strong></td>
    </tr>
    <tr>
      <td>controls</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">是</td>
      <td>是否显示默认控件</td>
    </tr>
    <tr>
      <td>poster</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>默认控件上的音频封面的图片资源地址，如果 controls 属性值为 false 则设置 poster 无效</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;未知音频&quot;</code></td>
      <td style="text-align:center">是</td>
      <td>默认控件上的音频名字，如果 controls 属性值为 false 则设置 name 无效</td>
    </tr>
    <tr>
      <td>author</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;未知作者&quot;</code></td>
      <td style="text-align:center">是</td>
      <td>默认控件上的作者名字，如果 controls 属性值为 false 则设置 author 无效</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;onErrorEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当发生错误时触发 error 事件，detail = {errMsg: MediaError.code}</td>
    </tr>
    <tr>
      <td>onPlay</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当开始/继续播放时触发play事件</td>
    </tr>
    <tr>
      <td>onPause</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当暂停播放时触发 pause 事件</td>
    </tr>
    <tr>
      <td>onTimeUpdate</td>
      <td><code>BaseEventOrigFunction&lt;onTimeUpdateEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当播放进度改变时触发 timeupdate 事件，detail = {currentTime, duration}</td>
    </tr>
    <tr>
      <td>onEnded</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当播放到末尾时触发 ended 事件</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | 百度小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| AudioProps.id | ✔️ |  |  |  |
| AudioProps.src | ✔️ | ✔️ | ✔️ |  |
| AudioProps.loop | ✔️ | ✔️ | ✔️ |  |
| AudioProps.muted |  |  | ✔️ |  |
| AudioProps.controls | ✔️ | ✔️ | ✔️ |  |
| AudioProps.poster | ✔️ | ✔️ |  |  |
| AudioProps.name | ✔️ |  |  |  |
| AudioProps.author | ✔️ |  |  |  |
| AudioProps.onError | ✔️ | ✔️ | ✔️ |  |
| AudioProps.onPlay | ✔️ | ✔️ | ✔️ |  |
| AudioProps.onPause | ✔️ | ✔️ | ✔️ |  |
| AudioProps.onTimeUpdate | ✔️ | ✔️ | ✔️ |  |
| AudioProps.onEnded | ✔️ | ✔️ | ✔️ |  |

### onErrorEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>1 | 2 | 3 | 4</code></td>
    </tr>
  </tbody>
</table>

### onTimeUpdateEventDetail

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
      <td>currentTime</td>
      <td><code>number</code></td>
      <td>当前时间</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td>持续时间</td>
    </tr>
  </tbody>
</table>

### MediaError

#### code

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>获取资源被用户禁止</td>
    </tr>
    <tr>
      <td>2</td>
      <td>网络错误</td>
    </tr>
    <tr>
      <td>3</td>
      <td>解码错误</td>
    </tr>
    <tr>
      <td>4</td>
      <td>不合适资源</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | 百度小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| Audio | ✔️ | ✔️ | ✔️ |  |
