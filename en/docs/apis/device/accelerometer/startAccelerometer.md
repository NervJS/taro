---
title: Taro.startAccelerometer(res)
sidebar_label: startAccelerometer
---

Starts listening on acceleration data.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.startAccelerometer.html)

## Type

```tsx
(res?: Option) => Promise<CallbackResult>
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
      <td>interval</td>
      <td><code>&quot;game&quot; | &quot;ui&quot; | &quot;normal&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;normal&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The execution frequency of the acceleration data listening callback function.</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>The callback function for a failed API call</td>
      <td>接口调用失败的回调函数</td>
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
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>game</td>
      <td><code>&quot;game&quot;</code></td>
      <td>The execution interval of the callback for game updates, which is about 20 ms.</td>
    </tr>
    <tr>
      <td>ui</td>
      <td><code>&quot;ui&quot;</code></td>
      <td>The execution interval of the callback for UI updates, which is about 60 ms.</td>
    </tr>
    <tr>
      <td>normal</td>
      <td><code>&quot;normal&quot;</code></td>
      <td>The normal callback interval, which is about 200 ms.</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.startAccelerometer({ interval: 'game' })
```

## API Support

|           API           | WeChat Mini-Program | H5 | React Native |
|:-----------------------:|:-------------------:|:--:|:------------:|
| Taro.startAccelerometer |         ✔️          | ✔️ |      ✔️      |
