---
title: Taro.startDeviceMotionListening(option)
sidebar_label: startDeviceMotionListening
---

Starts listening on device orientation changes.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.startDeviceMotionListening.html)

## Type

```tsx
(option: Option) => void
```

## Parameters

### Option

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
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The execution interval of the callback function for device orientation change listening</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>interval</td>
      <td><code>&quot;game&quot; | &quot;ui&quot; | &quot;normal&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;normal&quot;</code></td>
      <td style={{ textAlign: "center"}}>The callback function for a failed API call</td>
      <td>监听设备方向的变化回调函数的执行频率</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>The callback function for a successful API call</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### interval

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>game</td>
      <td>The execution interval of the callback for game updates, which is about 20 ms.</td>
    </tr>
    <tr>
      <td>ui</td>
      <td>The execution interval of the callback for UI updates, which is about 60 ms.</td>
    </tr>
    <tr>
      <td>normal</td>
      <td>The normal callback interval, which is about 200 ms.</td>
    </tr>
  </tbody>
</table>

## API Support

|               API               | WeChat Mini-Program | H5 | React Native |
|:-------------------------------:|:-------------------:|:--:|:------------:|
| Taro.startDeviceMotionListening |         ✔️          | ✔️ |      ✔️      |
