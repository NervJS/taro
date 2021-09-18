---
title: LivePusher
sidebar_label: LivePusher
---

Real-time audio/video recording. User Authorization is required for `scope.camera` and `scope.record`.

Currently, it is open only to Mini Programs in the following categories owned by Chinese entities. The component needs to pass the category review, and then on the Mini Program Console, you can activate the permissions for this component by choosing **Development > API Settings**.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/live-pusher.html)

## Type

```tsx
ComponentType<LivePusherProps>
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
class App extends Components {
  render () {
    return (
      <LivePusher url='url' mode='RTC' autopush  />
    )
  }
}
```

</TabItem>

<TabItem value="Vue">

```html
<template>
  <live-pusher url="url" mode="RTC" :autopush="true"  />
</template>
```
  
</TabItem>
</Tabs>


## LivePusherProps

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
      <td>url</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The stream pushing address. Only `flv` and `rtmp` formats are supported.	</td>
    </tr>
    <tr>
      <td>mode</td>
      <td><code>&quot;SD&quot; | &quot;HD&quot; | &quot;FHD&quot; | &quot;RTC&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;RTC&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Values include <code>SD</code> (Standard definition), <code>HD</code> (High definition), <code>FHD</code> (Full high definition), and <code>RTC</code> (Real-time call).</td>
    </tr>
    <tr>
      <td>autopush</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Auto stream pushing.</td>
    </tr>
    <tr>
      <td>muted</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to mute the component.<br /><strong>Not recommend</strong></td>
    </tr>
    <tr>
      <td>enableCamera</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Enables the camera.</td>
    </tr>
    <tr>
      <td>autoFocus</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Auto focusing.</td>
    </tr>
    <tr>
      <td>orientation</td>
      <td><code>&quot;vertical&quot; | &quot;horizontal&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;vertical&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The orientation of the image.</td>
    </tr>
    <tr>
      <td>beauty</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Beautifying. Values range from 0 to 9. 0 indicates disabled.</td>
    </tr>
    <tr>
      <td>whiteness</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Whitening. Values range from 0 to 9. 0 indicates disabled.</td>
    </tr>
    <tr>
      <td>aspect</td>
      <td><code>&quot;9:16&quot; | &quot;3:4&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;9:16&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The aspect ratio. Available values include <code>3:4</code> and <code>9:16</code>.</td>
    </tr>
    <tr>
      <td>minBitrate</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>200</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The minimum bitrate.</td>
    </tr>
    <tr>
      <td>maxBitrate</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>1000</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The maximum bitrate.</td>
    </tr>
    <tr>
      <td>audioQuality</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;high&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>High quality (48KHz) or low quality (16KHz). Values include &quot;high&quot; and &quot;low&quot;.</td>
    </tr>
    <tr>
      <td>waitingImage</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The waiting image for stream pushing when the component enters the background.</td>
    </tr>
    <tr>
      <td>waitingImageHash</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The MD5 value of resources on the waiting image.</td>
    </tr>
    <tr>
      <td>zoom</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Adjusts the focal length.</td>
    </tr>
    <tr>
      <td>devicePosition</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;front&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Front or back. Values include <code>front</code> and <code>back</code>.	</td>
    </tr>
    <tr>
      <td>backgroundMute</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to mute the component after the component enters the background.</td>
    </tr>
    <tr>
      <td>mirror</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to mirror the stream pushing image. The effects are reflected in live-player.<br /><strong>Not recommended.</strong></td>
    </tr>
    <tr>
      <td>remoteMirror</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to mirror the  pushstream screen. <br /><strong>Note:</strong> Same as attribute mirror, Plan to dispose of mirror</td>
    </tr>
    <tr>
      <td>localMirror</td>
      <td><code>&quot;auto&quot; | &quot;enable&quot; | &quot;disable&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;auto&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to mirror the local preview image.</td>
    </tr>
    <tr>
      <td>audioReverbType</td>
      <td><code>0 | 1 | 2 | 3 | 4 | 5 | 6 | 7</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Audio reverberation types.</td>
    </tr>
    <tr>
      <td>enableMic</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Turning the microphone on or off</td>
    </tr>
    <tr>
      <td>enableAgc</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to turn on audio auto gain.</td>
    </tr>
    <tr>
      <td>enableAns</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to turn on audio noise suppression</td>
    </tr>
    <tr>
      <td>audioVolumeType</td>
      <td><code>&quot;media&quot; | &quot;voicecall&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;voicecall&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Volume type</td>
    </tr>
    <tr>
      <td>videoWidth</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>360</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The resolution width of the video stream pushed up</td>
    </tr>
    <tr>
      <td>videoHeight</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>640</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The resolution height of the video stream pushed up</td>
    </tr>
    <tr>
      <td>onStateChange</td>
      <td><code>BaseEventOrigFunction&lt;onStateChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The status change event. detail = {`{code}`}</td>
    </tr>
    <tr>
      <td>onNetstatus</td>
      <td><code>BaseEventOrigFunction&lt;onNetstatusEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The notification of the network status. detail = {`{info}`}</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;onErrorEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The rendering error event. detail = {`{errMsg, errCode}`}</td>
    </tr>
    <tr>
      <td>onBgmStart</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the background music starts playing.</td>
    </tr>
    <tr>
      <td>onBgmProgress</td>
      <td><code>BaseEventOrigFunction&lt;onBgmProgressEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the progress of the background music changes. detail = {`{progress, duration}`}</td>
    </tr>
    <tr>
      <td>onBgmComplete</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the background music stops playing.</td>
    </tr>
  </tbody>
</table>

### Property Support

| API | WeChat Mini-Program | H5 | React Native |
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

Valid values of orientation

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>vertical</td>
      <td>Vertical</td>
    </tr>
    <tr>
      <td>horizontal</td>
      <td>Horizontal</td>
    </tr>
  </tbody>
</table>

### localMirror

Valid values of localMirror

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>auto</td>
      <td>Front camera mirroring, rear camera not mirroring</td>
    </tr>
    <tr>
      <td>enable</td>
      <td>Both front and rear cameras mirrored</td>
    </tr>
    <tr>
      <td>disable</td>
      <td>Neither the front nor the rear camera is mirrored</td>
    </tr>
  </tbody>
</table>

### audioReverbType

Valid values of audioReverbType

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
      <td>Off</td>
    </tr>
    <tr>
      <td>1</td>
      <td>KTV</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Small room</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Assembly Hall</td>
    </tr>
    <tr>
      <td>4</td>
      <td>The muffled</td>
    </tr>
    <tr>
      <td>5</td>
      <td>Loud and clear</td>
    </tr>
    <tr>
      <td>6</td>
      <td>Metallic sound</td>
    </tr>
    <tr>
      <td>7</td>
      <td>Magnetic</td>
    </tr>
  </tbody>
</table>

### audioVolumeType

Valid values of audioVolumeType

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>media</td>
      <td>Media volume</td>
    </tr>
    <tr>
      <td>voicecall</td>
      <td>Call volume</td>
    </tr>
  </tbody>
</table>

### onStateChangeEventDetail

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
      <td>code</td>
      <td><code>number</code></td>
      <td>Status Code</td>
    </tr>
  </tbody>
</table>

### onNetstatusEventDetail

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
      <td>info</td>
      <td><code>netStatus</code></td>
      <td>Network Status</td>
    </tr>
  </tbody>
</table>

### onErrorEventDetail

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message</td>
    </tr>
    <tr>
      <td>errCode</td>
      <td><code>string | number</code></td>
      <td>Error code</td>
    </tr>
  </tbody>
</table>

### onBgmProgressEventDetail

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
      <td>progress</td>
      <td><code>any</code></td>
      <td>Progress</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td>Duration</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePusher | ✔️ |  |  |
