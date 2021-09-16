---
title: Taro.checkIsSoterEnrolledInDevice(option)
sidebar_label: checkIsSoterEnrolledInDevice
---

Checks whether biometric information, such as fingerprints, is enrolled in the device.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/soter/wx.checkIsSoterEnrolledInDevice.html)

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
      <td>checkAuthMode</td>
      <td><code>&quot;fingerPrint&quot; | &quot;facial&quot; | &quot;speech&quot;</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Authentication method</td>
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

### requestAuthModes

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>fingerPrint</td>
      <td>Fingerprint recognition</td>
    </tr>
    <tr>
      <td>facial</td>
      <td>Face recognition</td>
    </tr>
    <tr>
      <td>speech</td>
      <td>Voiceprint recognition (not supported)</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| requestAuthModes.speech |  |  |  |

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message</td>
    </tr>
    <tr>
      <td>isEnrolled</td>
      <td><code>boolean</code></td>
      <td>Indicates whether the information is enrolled</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.checkIsSoterEnrolledInDevice({
  checkAuthMode: 'fingerPrint',
  success: function (res) {
    console.log(res.isEnrolled)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.checkIsSoterEnrolledInDevice | ✔️ |  |  |
