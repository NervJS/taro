---
title: Audio
sidebar_label: Audio
---

Audio. This component is no longer maintained as of 1.6.0. `Taro.createInnerAudioContext` API with more powerful capabilities is recommended.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/audio.html)

## Type

```tsx
ComponentType<AudioProps>
```

## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">


```tsx
export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Audio
          src='https://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46'
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

</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class="components-page">
    <audio
      id="video"
      src="http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46"
      :controls="true"
      :autoplay="false"
      :loop="false"
      :muted="true"
    />
  </view>
</template>
```
  
</TabItem>
</Tabs>

## AudioProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The unique identifier of the audio component</td>
    </tr>
    <tr>
      <td>src</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The resource address of the audio to be played</td>
    </tr>
    <tr>
      <td>loop</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to enable loop playback</td>
    </tr>
    <tr>
      <td>muted</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to enable mute playback.<br /><strong>Not recommended</strong></td>
    </tr>
    <tr>
      <td>controls</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to display default controls</td>
    </tr>
    <tr>
      <td>poster</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The image resource address of the audio cover on a default control. If the value of the controls property is false, the setting of poster does not take effect.</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;An unknown audio&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The audio name on a default control. If the value of the controls property is false, the setting of name does not take effect.</td>
    </tr>
    <tr>
      <td>author</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;An unknown author&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The author name on a default control. If the value of the controls property is false, the setting of author does not take effect.</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;onErrorEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggers the error event when an error occurs. detail = {`{errMsg: MediaError.code}`}</td>
    </tr>
    <tr>
      <td>onPlay</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggers the play event when the playback is started/resumed.</td>
    </tr>
    <tr>
      <td>onPause</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggers the pause event when the playback is paused.</td>
    </tr>
    <tr>
      <td>onTimeUpdate</td>
      <td><code>BaseEventOrigFunction&lt;onTimeUpdateEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggers the timeupdate event when the playback progress changes. detail = {`{currentTime, duration}`}</td>
    </tr>
    <tr>
      <td>onEnded</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggers the ended event at the end of the video.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program  | Baidu Smart-Program | H5 | React Native |
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
      <th>Param</th>
      <th>Value</th>
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
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>currentTime</td>
      <td><code>number</code></td>
      <td>current time</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td>duration</td>
    </tr>
  </tbody>
</table>

### MediaError

#### code

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Request for getting resources is rejected by the user</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Network error</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Decoding error</td>
    </tr>
    <tr>
      <td>4</td>
      <td>Improper resource</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program  | Baidu Smart-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| Audio | ✔️ | ✔️ | ✔️ |  |
