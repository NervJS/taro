---
title: Taro.checkIsSupportSoterAuthentication(option)
sidebar_label: checkIsSupportSoterAuthentication
---

Gets SOTER biometric authentication methods supported by this device.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/soter/wx.checkIsSupportSoterAuthentication.html)

## Type

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
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
      <td>supportMode</td>
      <td><code>(&quot;fingerPrint&quot; | &quot;facial&quot; | &quot;speech&quot;)[]</code></td>
      <td>Biometric recognition methods recognized by SOTER and supported by this device</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
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
      <td>Face recognition (not supported)</td>
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

## Sample Code

```tsx
Taro.checkIsSupportSoterAuthentication({
  success: function (res) {
    // res.supportMode = [] No biometric recognition methods supported by SOTER are available
    // res.supportMode = ['fingerPrint'] Only fingerprint recognition is supported
    // res.supportMode = ['fingerPrint', 'facial'] Fingerprint recognition and face recognition are supported
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.checkIsSupportSoterAuthentication | ✔️ |  |  |
