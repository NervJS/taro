---
title: Taro.openBluetoothAdapter(option)
sidebar_label: openBluetoothAdapter
---

Initializes the Bluetooth module.

**Notes**
- Other Bluetooth-related APIs can only be used after `Taro.openBluetoothAdapter` is called. Otherwise, the API will return an error (errCode=10000).
- When the user's Bluetooth switch is off or the phone does not support Bluetooth, calls to `Taro.openBluetoothAdapter` will return an error (errCode=10001). This indicates the phone's Bluetooth feature is unavailable. In such cases, after initializing the Mini Program Bluetooth module, you can use `Taro.onBluetoothAdapterStateChange` to listen on changes to the phone's Bluetooth status. You can also call all Bluetooth module APIs.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/bluetooth/wx.openBluetoothAdapter.html)

## Type

```tsx
(option?: Option) => Promise<CallbackResult>
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

### state

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>Unknown</td>
    </tr>
    <tr>
      <td>1</td>
      <td>Reseting</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Not support</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Unauthorised</td>
    </tr>
    <tr>
      <td>4</td>
      <td>Not open</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.openBluetoothAdapter({
  success: function (res) {
    console.log(res)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.openBluetoothAdapter | ✔️ |  |  |
