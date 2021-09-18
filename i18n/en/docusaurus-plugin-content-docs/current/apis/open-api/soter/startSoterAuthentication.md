---
title: Taro.startSoterAuthentication(option)
sidebar_label: startSoterAuthentication
---

Starts SOTER biometric authentication. For the verification procedure, see [description](https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/bio-auth.html).

**resultJSON description**

This data is the JSON data obtained in the device's TEE by combining the incoming challenge parameter and other security information in the TEE. The fields are described as follows.

| Field | Description |
|---|----|
| raw | The challenge factor passed in by the caller |
| fid | (Supported only on Android) The ID of the biometric information for the current biometric recognition and authentication (for example, for fingerprint recognition, this field indicates the ID of fingerprint information in this device). |
| counter | A parameter of the anti-replay feature |
| tee_n | TEE name (for example, Qualcomm or trustonic) |
| tee_v | TEE version |
| fp_n | The provider of the fingerprints and related logic modules (such as the FPC) |
| fp_v | The version of the fingerprints and related modules |
| cpu_id | The unique device ID |
| uid | App ID, which is similar to the UID defined on Android. |

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/soter/wx.startSoterAuthentication.html)

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
      <td>challenge</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Challenge factor, which is the key recognition information of a string used for signing that is prepared by the caller for the current biometric authentication. It serves as a part of <code>resultJSON</code> to help the caller recognize this request. For example, if the user is requested to authorize and confirm an order, the order number can be entered in this parameter.</td>
    </tr>
    <tr>
      <td>requestAuthModes</td>
      <td><code>(&quot;fingerPrint&quot; | &quot;facial&quot; | &quot;speech&quot;)[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Accepted biometric authentication methods in the request</td>
    </tr>
    <tr>
      <td>authContent</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Verification description, i.e. the hint in a dialog box displayed on the UI during recognition.</td>
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
      <td>authMode</td>
      <td><code>string</code></td>
      <td>Biometric authentication method</td>
    </tr>
    <tr>
      <td>resultJSON</td>
      <td><code>string</code></td>
      <td>The device security information (for example, the name and version of the Trusted Execution Environment (TEE), and anti-replay parameters) obtained in the TEE and information for this authentication (for example, the fingerprint ID. It is supported only on Android).</td>
    </tr>
    <tr>
      <td>resultJSONSignature</td>
      <td><code>string</code></td>
      <td>The signature (SHA-256 with RSA/PSS, saltlen=20) on <code>resultJSON</code> generated using the SOTER security key</td>
    </tr>
    <tr>
      <td>errCode</td>
      <td><code>number</code></td>
      <td>Error code</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message</td>
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

## Sample Code

```tsx
Taro.startSoterAuthentication({
   requestAuthModes: ['fingerPrint'],
   challenge: '123456',
   authContent: 'Unlock with your fingerprint',
   success: function (res) { }
})
```

```json
{
  "raw":"msg",
  "fid":"2",
  "counter":123,
  "tee_n":"TEE Name",
  "tee_v":"TEE Version",
  "fp_n":"Fingerprint Sensor Name",
  "fp_v":"Fingerprint Sensor Version",
  "cpu_id":"CPU Id",
  "uid":"21"
}
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startSoterAuthentication | ✔️ |  |  |
