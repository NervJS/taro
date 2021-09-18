---
title: Video
sidebar_label: Video
---

Video. Related AP: <code>Taro.createVideoContext</code>

**Note:** No test on h5, so for now it says "pending", need `Video` to confirm.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/video.html)

## Type

```tsx
ComponentType<VideoProps>
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
        <Video
          id='video'
          src='https://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
          poster='https://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'
          initialTime='0'
          controls={true}
          autoplay={false}
          loop={false}
          muted={false}
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
  <video
    id="video"
    src="https://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
    poster="https://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg"
    initial-time="0"
    :controls="true"
    :autoplay="false"
    :loop="false"
    :muted="false"
  />
</template>
```
  
</TabItem>
</Tabs>

## VideoProps

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
      <td>src</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The address of the video to be played.</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The duration of the video</td>
    </tr>
    <tr>
      <td>controls</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to display default playback controls (Play/Pause buttons, playback progress, and timeline).</td>
    </tr>
    <tr>
      <td>danmuList</td>
      <td><code>any[]</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>List of barrage comments</td>
    </tr>
    <tr>
      <td>danmuBtn</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to display the barrage button. It is valid only during initialization, and cannot be dynamically changed.</td>
    </tr>
    <tr>
      <td>enableDanmu</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to display barrage comments. It is valid only during initialization, and cannot be dynamically changed.</td>
    </tr>
    <tr>
      <td>autoplay</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to enable auto playback</td>
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
      <td>Specifies whether to enable muted playback</td>
    </tr>
    <tr>
      <td>initialTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the initial time point at which the video starts to play</td>
    </tr>
    <tr>
      <td>pageGesture</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>(Discarded. See vslide-gesture.) Specifies whether to enable brightness and volume adjusting gestures in the non-full-screen mode.</td>
    </tr>
    <tr>
      <td>direction</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the direction of the video in the full screen. If it is not specified, the direction is set automatically based on the aspect ratio.</td>
    </tr>
    <tr>
      <td>showProgress</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>If this property is not specified, the progress bar is displayed only when the width is greater than 240 px.</td>
    </tr>
    <tr>
      <td>showFullscreenBtn</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to display the full screen button</td>
    </tr>
    <tr>
      <td>showPlayBtn</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to display the play button in the bottom control bar of the video</td>
    </tr>
    <tr>
      <td>showCenterPlayBtn</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to display the play button in the center of the video</td>
    </tr>
    <tr>
      <td>enableProgressGesture</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to enable progress control gestures</td>
    </tr>
    <tr>
      <td>objectFit</td>
      <td><code>&quot;contain&quot; | &quot;fill&quot; | &quot;cover&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;contain&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The presentation of the video when the video size differs from the video container size</td>
    </tr>
    <tr>
      <td>poster</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The URL or cloud file ID of the image on the video cover. If the value of the controls property is false, the setting of the poster does not take effect.</td>
    </tr>
    <tr>
      <td>showMuteBtn</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to display the mute button</td>
    </tr>
    <tr>
      <td>title</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The title of the video. It is displayed on the top in the full screen mode.</td>
    </tr>
    <tr>
      <td>playBtnPosition</td>
      <td><code>&quot;bottom&quot; | &quot;center&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>'bottom'</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The location of the play button</td>
    </tr>
    <tr>
      <td>enablePlayGesture</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to enable the playback gestures: Double-tap to switch between play/pause.</td>
    </tr>
    <tr>
      <td>autoPauseIfNavigate</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to automatically pause the video on the current page when the user is navigated to another Mini Program page.</td>
    </tr>
    <tr>
      <td>autoPauseIfOpenNative</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to automatically pause the real-/video on the current page upon the navigation to another native page of WeChat.</td>
    </tr>
    <tr>
      <td>vslideGesture</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>(Same as <code>pageGesture</code>) Specifies whether to enable brightness and volume adjusting gestures in the non-full-screen mode.</td>
    </tr>
    <tr>
      <td>vslideGestureInFullscreen</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to enable brightness and volume adjusting gestures in the full screen mode.</td>
    </tr>
    <tr>
      <td>adUnitId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Unit IDs for pre-video posting ads, see Open Capabilities for more details <a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/ad/video-patch-ad.html">Advertising before the video.</a></td>
    </tr>
    <tr>
      <td>posterForCrawler</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>It is recommended to use a video cover image without a play icon and only supports network addresses.</td>
    </tr>
    <tr>
      <td>showCastingButton</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to show cast button. Android only and rendered on the same layer, DLNA protocol supported.</td>
    </tr>
    <tr>
      <td>onPlay</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggers the play event when the playback is started/resumed</td>
    </tr>
    <tr>
      <td>onPause</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggers the pause event when the playback is paused</td>
    </tr>
    <tr>
      <td>onEnded</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggers the ended event at the end of the video.</td>
    </tr>
    <tr>
      <td>onTimeUpdate</td>
      <td><code>BaseEventOrigFunction&lt;onTimeUpdateEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the playback progress changes.<br /><br />event.detail = {`{currentTime, duration}`}. It is triggered every 250 ms.</td>
    </tr>
    <tr>
      <td>onFullscreenChange</td>
      <td><code>BaseEventOrigFunction&lt;onFullscreenChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the video enters or exits the full screen.<br />event.detail = {`{fullScreen, direction}`}. Valid values of direction include vertical and horizontal.</td>
    </tr>
    <tr>
      <td>onWaiting</td>
      <td><code>BaseEventOrigFunction&lt;onWaitingEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the video starts buffering</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when an error occurs during video playback</td>
    </tr>
    <tr>
      <td>onProgress</td>
      <td><code>BaseEventOrigFunction&lt;onProgressEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the loading progress changes. It is supported only for a section of progress. event.detail = {`{buffered}`}. Its value is a percentage.</td>
    </tr>
    <tr>
      <td>onLoadedMetaData</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the video metadata has finished loading. event.detail = {`{width, height, duration}`}</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| VideoProps.src | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| VideoProps.duration | ✔️ | ✔️ | ✔️ |  | (Pending) | ✔️ |
| VideoProps.controls | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| VideoProps.danmuList | ✔️ | ✔️ |  |  | (Pending) |  |
| VideoProps.danmuBtn | ✔️ | ✔️ |  |  | (Pending) |  |
| VideoProps.enableDanmu | ✔️ | ✔️ |  |  | (Pending) |  |
| VideoProps.autoplay | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| VideoProps.loop | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| VideoProps.muted | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| VideoProps.initialTime | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| VideoProps.direction | ✔️ | ✔️ | ✔️ |  | (Pending) |  |
| VideoProps.showProgress | ✔️ | ✔️ |  |  | (Pending) |  |
| VideoProps.showFullscreenBtn | ✔️ | ✔️ | ✔️ |  | (Pending) |  |
| VideoProps.showPlayBtn | ✔️ | ✔️ | ✔️ |  | (Pending) |  |
| VideoProps.showCenterPlayBtn | ✔️ | ✔️ | ✔️ |  | (Pending) | ✔️ |
| VideoProps.enableProgressGesture | ✔️ | ✔️ | ✔️ |  | (Pending) |  |
| VideoProps.objectFit | ✔️ | ✔️ | ✔️ |  | (Pending) |  |
| VideoProps.poster | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| VideoProps.showMuteBtn | ✔️ |  |  |  | (Pending) |  |
| VideoProps.title | ✔️ |  |  |  | (Pending) |  |
| VideoProps.playBtnPosition | ✔️ |  |  |  | (Pending) |  |
| VideoProps.enablePlayGesture | ✔️ |  |  |  | (Pending) |  |
| VideoProps.autoPauseIfNavigate | ✔️ |  |  |  | (Pending) |  |
| VideoProps.autoPauseIfOpenNative | ✔️ |  |  |  | (Pending) |  |
| VideoProps.vslideGesture | ✔️ | ✔️ |  |  | (Pending) |  |
| VideoProps.vslideGestureInFullscreen | ✔️ |  |  |  | (Pending) |  |
| VideoProps.adUnitId | ✔️ |  |  |  |  |  |
| VideoProps.posterForCrawler | ✔️ |  |  |  |  |  |
| VideoProps.showCastingButton | ✔️ |  |  |  |  |  |
| VideoProps.onPlay | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| VideoProps.onPause | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| VideoProps.onEnded | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| VideoProps.onTimeUpdate | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| VideoProps.onFullscreenChange | ✔️ | ✔️ | ✔️ |  | (Pending) | ✔️ |
| VideoProps.onWaiting | ✔️ | ✔️ |  |  | (Pending) |  |
| VideoProps.onError | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| VideoProps.onProgress | ✔️ |  | ✔️ |  | (Pending) |  |
| VideoProps.onLoadedMetaData | ✔️ |  |  |  |  | ✔️ |

### direction

Valid values of direction

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>Retains the normal vertical direction</td>
    </tr>
    <tr>
      <td>90</td>
      <td>Rotates the screen 90 degrees counter-clockwise</td>
    </tr>
    <tr>
      <td>-90</td>
      <td>Rotates the screen 90 degrees clockwise</td>
    </tr>
  </tbody>
</table>

### objectFit

Valid values of objectFit

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>contain</td>
      <td>Contain</td>
    </tr>
    <tr>
      <td>fill</td>
      <td>Fill</td>
    </tr>
    <tr>
      <td>cover</td>
      <td>Cover</td>
    </tr>
  </tbody>
</table>

### playBtnPosition

Valid values of playBtnPosition

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>bottom</td>
      <td>In the controls bar</td>
    </tr>
    <tr>
      <td>center</td>
      <td>In the center of the video</td>
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
      <td>Current time</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td>Duration</td>
    </tr>
  </tbody>
</table>

### onFullscreenChangeEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Descrtiption</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>direction</td>
      <td><code>number</code></td>
      <td>Direction</td>
    </tr>
    <tr>
      <td>fullScreen</td>
      <td><code>number | boolean</code></td>
      <td>Full Screen</td>
    </tr>
  </tbody>
</table>

### onWaitingEventDetail

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
      <td>direction</td>
      <td><code>number</code></td>
      <td>Direction</td>
    </tr>
    <tr>
      <td>fullScreen</td>
      <td><code>number | boolean</code></td>
      <td>Full Screen</td>
    </tr>
  </tbody>
</table>

### onProgressEventDetail

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
      <td>buffered</td>
      <td><code>number</code></td>
      <td>Percentage</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Video | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
