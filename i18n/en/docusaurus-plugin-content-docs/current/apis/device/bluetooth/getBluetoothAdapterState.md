---
title: Taro.getBluetoothAdapterState(option)
sidebar_label: getBluetoothAdapterState
---

Gets the status of the local Bluetooth adapter.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth/wx.getBluetoothAdapterState.html)

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
      <td>available</td>
      <td><code>boolean</code></td>
      <td>Indicates whether the Bluetooth adapter is available</td>
    </tr>
    <tr>
      <td>discovering</td>
      <td><code>boolean</code></td>
      <td>Indicates whether a device discovery is performed</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>success: ok; fail: error message.</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.getBluetoothAdapterState({
  success: function (res) {
    console.log(res)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getBluetoothAdapterState | ✔️ |  |  |
