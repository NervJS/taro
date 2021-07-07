---
title: LivePlayer
sidebar_label: LivePlayer
---

Real-time audio/video playback. Related API: `Taro.createLivePlayerContext`

Currently, it is open only to Mini Programs in the following categories owned by Chinese entities. The component needs to pass the category review, and then on the Mini Program Console, you can activate the permissions for this component by choosing **Development > API Settings**.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/live-player.html)

## Type

```tsx
ComponentType<LivePlayerProps>
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
      <LivePlayer src='url' mode='live' autoplay  />
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <live-player src="url" mode="live" :autoplay="true"  />
</template>
```
  
</TabItem>
</Tabs>


## LivePlayerProps

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
      <td style={{ textAlign: "center"}}>No</td>
      <td>Audio/video address. Only flv and rtmp formats are supported.</td>
    </tr>
    <tr>
      <td>mode</td>
      <td><code>&quot;live&quot; | &quot;RTC&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;live&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Mode</td>
    </tr>
    <tr>
      <td>autoplay</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Auto playback</td>
    </tr>
    <tr>
      <td>muted</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to mute the component.</td>
    </tr>
    <tr>
      <td>orientation</td>
      <td><code>&quot;vertical&quot; | &quot;horizontal&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;vertical&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The orientation of the image.</td>
    </tr>
    <tr>
      <td>objectFit</td>
      <td><code>&quot;contain&quot; | &quot;fillCrop&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;contain&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Filling mode. Available values include `contain` and `fillCrop`.</td>
    </tr>
    <tr>
      <td>backgroundMute</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to mute the component when it enters the background. <br />(This property has been discarded. By default, the component is muted when entering the background.)</td>
    </tr>
    <tr>
      <td>minCache</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>1</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Minimum buffer (in s)</td>
    </tr>
    <tr>
      <td>maxCache</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>3</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Maximum buffer (in s)</td>
    </tr>
    <tr>
      <td>soundMode</td>
      <td><code>&quot;speaker&quot; | &quot;ear&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;speaker&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Sound output mode</td>
    </tr>
    <tr>
      <td>autoPauseIfNavigate</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to automatically pause the real-time audio/video playback on the current page upon the navigation to another Mini Program page.</td>
    </tr>
    <tr>
      <td>autoPauseIfOpenNavigate</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to automatically pause the real-time audio/video playback on the current page upon the navigation to another native page of WeChat.</td>
    </tr>
    <tr>
      <td>onStateChange</td>
      <td><code>BaseEventOrigFunction&lt;onStateChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>A playback status change. detail = {`{code}`}</td>
    </tr>
    <tr>
      <td>onFullScreenChange</td>
      <td><code>BaseEventOrigFunction&lt;onFullScreenChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>A full-screen mode change. detail = {`{direction, fullScreen}`}</td>
    </tr>
    <tr>
      <td>onNetstatus</td>
      <td><code>BaseEventOrigFunction&lt;onNetStatusEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The notification of the network status. detail = {`{info}`}</td>
    </tr>
    <tr>
      <td>onAudioVolumenotify</td>
      <td><code>BaseEventOrigFunction&lt;{}&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>Playback volume level change. detail = {`{}`}</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
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

Valid values of mode

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description	</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>live</td>
      <td>Live stream</td>
    </tr>
    <tr>
      <td>RTC</td>
      <td>Real-time call. The latency is lower in this mode.</td>
    </tr>
  </tbody>
</table>

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

### objectFit

Valid values of object-fit

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
      <td>Indicates that the longer edge of the image fills the screen, and the shorter edge is filled with black.</td>
    </tr>
    <tr>
      <td>fillCrop</td>
      <td>Indicates that the image fills the screen, and the part out of the display area will be truncated.</td>
    </tr>
  </tbody>
</table>

### soundMode

Valid values of soundMode

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>speaker</td>
      <td>Loudspeaker</td>
    </tr>
    <tr>
      <td>ear</td>
      <td>Receiver</td>
    </tr>
  </tbody>
</table>

### onStateChangeEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Decription</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>code</td>
      <td><code>number</code></td>
      <td>status code</td>
    </tr>
  </tbody>
</table>

### onFullScreenChangeEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Decription</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>direction</td>
      <td><code>number</code></td>
      <td>Screen orientation</td>
    </tr>
    <tr>
      <td>fullScreen</td>
      <td><code>number | boolean</code></td>
      <td>Full screen or not</td>
    </tr>
  </tbody>
</table>

### onNetStatusEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
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

Status codes

<table>
  <thead>
    <tr>
      <th>Code</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2001</td>
      <td>Connected to the server</td>
    </tr>
    <tr>
      <td>2002</td>
      <td>Connected to the server. Pull started.</td>
    </tr>
    <tr>
      <td>2003</td>
      <td>The network has received the first video packet (IDR)</td>
    </tr>
    <tr>
      <td>2004</td>
      <td>Video playback started</td>
    </tr>
    <tr>
      <td>2005</td>
      <td>Video playback in progress</td>
    </tr>
    <tr>
      <td>2006</td>
      <td>Video playback ended</td>
    </tr>
    <tr>
      <td>2007</td>
      <td>Video playback loading</td>
    </tr>
    <tr>
      <td>2008</td>
      <td>Decoder started</td>
    </tr>
    <tr>
      <td>2009</td>
      <td>Video resolution changed</td>
    </tr>
    <tr>
      <td>-2301</td>
      <td>Network disconnected. Too many failed reconnection attempts. Restart the playback for more retries.</td>
    </tr>
    <tr>
      <td>-2302</td>
      <td>Failed to get the accelerated pull address</td>
    </tr>
    <tr>
      <td>2101</td>
      <td>Failed to decode the current video frame</td>
    </tr>
    <tr>
      <td>2102</td>
      <td>Failed to decode the current audio frame</td>
    </tr>
    <tr>
      <td>2103</td>
      <td>Network disconnected and auto reconnection has started</td>
    </tr>
    <tr>
      <td>2104</td>
      <td>Unstable inbound packet: This may be caused by insufficient downstream bandwidth, or inconsistent outbound stream from the VJ end.</td>
    </tr>
    <tr>
      <td>2105</td>
      <td>Stutter occurred during the video playback</td>
    </tr>
    <tr>
      <td>2106</td>
      <td>Failed to start hard decoding. Soft decoding is used instead.</td>
    </tr>
    <tr>
      <td>2107</td>
      <td>Discontinuous sequence of video frames. Some frames may be dropped.</td>
    </tr>
    <tr>
      <td>2108</td>
      <td>Hard decoding of the first I-frame of current stream failed. Switched to soft decoding automatically.</td>
    </tr>
    <tr>
      <td>3001</td>
      <td>RTMP DNS resolution failed</td>
    </tr>
    <tr>
      <td>3002</td>
      <td>Failed to connect to the RTMP server</td>
    </tr>
    <tr>
      <td>3003</td>
      <td>Failed to shake hands with the RTMP server</td>
    </tr>
    <tr>
      <td>3005</td>
      <td>Failed to read/write data on the RTMP server</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| LivePlayer | ✔️ |  |  |
