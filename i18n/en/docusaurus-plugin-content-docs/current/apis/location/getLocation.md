---
title: Taro.getLocation(option)
sidebar_label: getLocation
---

Gets current geographic location and speed. The API cannot be called when the user exits the Mini Program.

**Note**

- Location simulation in the tool uses IP-based location, and there may have some error. The tool only supports GCJ-02 coordinates now.
- When using a third-party service for reverse address resolution, please check the default coordinate system of the third-party service and perform coordinate conversion correctly.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/location/wx.getLocation.html)

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
      <td>altitude</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Altitude information is returned if true is passed. The API will take a longer time to respond since a higher accuracy is required to obtain the altitude.</td>
    </tr>
    <tr>
      <td>highAccuracyExpireTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>High accuracy positioning timeout (ms), the specified time to return the highest accuracy, the value of 3000ms or more high accuracy positioning to have effect.</td>
    </tr>
    <tr>
      <td>isHighAccuracy</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Turn on high accuracy positioning</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>wgs84 returns the gps coordinates, gcj02 returns the coordinates available for <code>Taro.openLocation</code></td>
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
      <td>accuracy</td>
      <td><code>number</code></td>
      <td>Location accuracy</td>
    </tr>
    <tr>
      <td>altitude</td>
      <td><code>number</code></td>
      <td>Altitude (in m)</td>
    </tr>
    <tr>
      <td>horizontalAccuracy</td>
      <td><code>number</code></td>
      <td>Horizontal accuracy (in m)</td>
    </tr>
    <tr>
      <td>latitude</td>
      <td><code>number</code></td>
      <td>Latitude. The value ranges from -90 to +90, and the negative number means south latitude.</td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td>Longitude. The value ranges from -180 to +180, and the negative number means west longitude.</td>
    </tr>
    <tr>
      <td>speed</td>
      <td><code>number</code></td>
      <td>Speed (in m/s)</td>
    </tr>
    <tr>
      <td>verticalAccuracy</td>
      <td><code>number</code></td>
      <td>Vertical accuracy (in m) (Not available for Android, and 0 will be returned)</td>
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
Taro.getLocation({
 type: 'wgs84',
 success: function (res) {
   const latitude = res.latitude
   const longitude = res.longitude
   const speed = res.speed
   const accuracy = res.accuracy
 }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getLocation | ✔️ |  | ✔️ |
