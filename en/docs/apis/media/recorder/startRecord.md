---
title: Taro.startRecord(option)
sidebar_label: startRecord
---

Starts recording.当主动调用`Taro.stopRecord`，或者录音超过1分钟时自动结束录音，返回录音文件的临时文件路径。当用户离开小程序时，此接口无法调用。 **注意：1.6.0 版本开始，本接口不再维护。Use [Taro.getRecorderManager](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.getRecorderManager.htm) instead</p>

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.startRecord.html)

## Type

```tsx
(option: Option) => Promise<SuccessCallbackResult>
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

### SuccessCallbackResult

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
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td>The temporary path to recording files</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.startRecord({
  success: function (res) {
    const tempFilePath = res.tempFilePath
  }
})
setTimeout(function () {
  Taro.stopRecord() // Stop recording
}, 10000)
```

## API Support

|       API        | WeChat Mini-Program | H5 | React Native |
|:----------------:|:-------------------:|:--:|:------------:|
| Taro.startRecord |         ✔️          |    |              |
