---
title: Taro.getSystemInfoSync()
sidebar_label: getSystemInfoSync
---

The synchronous version of [Taro.getSystemInfo](./getSystemInfo).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/base/system/system-info/wx.getSystemInfoSync.html)

## Type

```tsx
() => Result
```

## Parameters

### Result

**NOTE：** Version, statusBarHeight, fontSizeSetting, SDKVersion are not supported on the **H5**.

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
      <td>SDKVersion</td>
      <td><code>string</code></td>
      <td>Client base library version</td>
    </tr>
   <tr>
      <td>albumAuthorized</td>
      <td><code>boolean</code></td>
      <td>The switch that allows WeChat to use Photos (only for iOS)</td>
    </tr>
    <tr>
      <td>benchmarkLevel</td>
      <td><code>number</code></td>
      <td>The device performance grade (only for Mini Games on Android). Values: -2 or 0 (the device cannot run the Mini Game), -1 (unknown performance), ≥1 (a higher value (up to 50) indicates a better performance).</td>
    </tr>
    <tr>
      <td>bluetoothEnabled</td>
      <td><code>boolean</code></td>
      <td>The system switch for Bluetooth</td>
    </tr>
    <tr>
      <td>brand</td>
      <td><code>string</code></td>
      <td>Device brand</td>
    </tr>
    <tr>
      <td>cameraAuthorized</td>
      <td><code>boolean</code></td>
      <td>The switch that allows WeChat to use the camera</td>
    </tr>
    <tr>
      <td>fontSizeSetting</td>
      <td><code>number</code></td>
      <td>User's font size in px. The setting in <strong>Me > Settings > General > Text Size</strong> in the WeChat app prevails.</td>
    </tr>
    <tr>
      <td>language</td>
      <td><code>string</code></td>
      <td>Language set in WeChat</td>
    </tr>
    <tr>
      <td>locationAuthorized</td>
      <td><code>boolean</code></td>
      <td>The switch that allows WeChat to use the location function</td>
    </tr>
    <tr>
      <td>locationEnabled</td>
      <td><code>boolean</code></td>
      <td>The system switch for the GPS function</td>
    </tr>
    <tr>
      <td>microphoneAuthorized</td>
      <td><code>boolean</code></td>
      <td>The switch that allows WeChat to use the microphone</td>
    </tr>
    <tr>
      <td>model</td>
      <td><code>string</code></td>
      <td>Device model</td>
    </tr>
    <tr>
      <td>notificationAlertAuthorized</td>
      <td><code>boolean</code></td>
      <td>The switch that allows WeChat to send notifications with reminders (only for iOS)</td>
    </tr>
    <tr>
      <td>notificationAuthorized</td>
      <td><code>boolean</code></td>
      <td>The switch that allows WeChat to send notifications</td>
    </tr>
    <tr>
      <td>notificationBadgeAuthorized</td>
      <td><code>boolean</code></td>
      <td>The switch that allows WeChat to send notifications with flags (only for iOS)</td>
    </tr>
    <tr>
      <td>notificationSoundAuthorized</td>
      <td><code>boolean</code></td>
      <td>The switch that allows WeChat to send notifications with sound (only for iOS).</td>
    </tr>
    <tr>
      <td>pixelRatio</td>
      <td><code>number</code></td>
      <td>Device's pixel ratio</td>
    </tr>
    <tr>
      <td>platform</td>
      <td><code>string</code></td>
      <td>Client platform</td>
    </tr>
    <tr>
      <td>safeArea</td>
      <td><code>SafeAreaResult</code></td>
      <td>Safe area when the screen is in vertical orientation</td>
    </tr>
    <tr>
      <td>screenHeight</td>
      <td><code>number</code></td>
      <td>Screen height in px</td>
    </tr>
    <tr>
      <td>screenWidth</td>
      <td><code>number</code></td>
      <td>Screen width in px</td>
    </tr>
    <tr>
      <td>statusBarHeight</td>
      <td><code>number</code></td>
      <td>Status bar height in px</td>
    </tr>
    <tr>
      <td>system</td>
      <td><code>string</code></td>
      <td>Operating system and version</td>
    </tr>
    <tr>
      <td>version</td>
      <td><code>string</code></td>
      <td>WeChat version</td>
    </tr>
    <tr>
      <td>wifiEnabled</td>
      <td><code>boolean</code></td>
      <td>The system switch for Wi-Fi</td>
    </tr>
    <tr>
      <td>windowHeight</td>
      <td><code>number</code></td>
      <td>Available window height in px</td>
    </tr>
    <tr>
      <td>windowWidth</td>
      <td><code>number</code></td>
      <td>Available window width in px</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
try {
  const res = Taro.getSystemInfoSync()
  console.log(res.model)
  console.log(res.pixelRatio)
  console.log(res.windowWidth)
  console.log(res.windowHeight)
  console.log(res.language)
  console.log(res.version)
  console.log(res.platform)
} catch (e) {
  // Do something when catch error
}
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getSystemInfoSync | ✔️ | ✔️ | ✔️ |
