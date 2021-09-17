---
title: Taro.startGyroscope(option)
sidebar_label: startGyroscope
---

Starts listening on gyroscope data.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/gyroscope/wx.startGyroscope.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>interval</td>
      <td><code>&quot;game&quot; | &quot;ui&quot; | &quot;normal&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The execution interval of the callback function for gyroscope data listening.</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### interval

Valid values of object.interval

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

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startGyroscope | ✔️ |  | ✔️ |
