---
title: Taro.openLocation(option)
sidebar_label: openLocation
---

Views location using the WeChat built-in map.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/location/wx.openLocation.html)

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
      <td>latitude</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Latitude. The value ranges from -90 to +90, and the negative number means south latitude. The GCJ-02 coordinate system of the State Bureau of Surveying and Mapping is used.</td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Longitude. The value ranges from -180 to +180, and the negative number means west longitude. The GCJ-02 coordinate system of the State Bureau of Surveying and Mapping is used.</td>
    </tr>
    <tr>
      <td>address</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Detailed address</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Location name</td>
    </tr>
    <tr>
      <td>scale</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Scale, ranging from 5 to 18</td>
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

## Sample Code

```tsx
Taro.getLocation({
 type: 'gcj02', //Returns the latitude and longitude that can be used for Taro.openLocation
 success: function (res) {
   const latitude = res.latitude
   const longitude = res.longitude
   Taro.openLocation({
     latitude,
     longitude,
     scale: 18
   })
 }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.openLocation | ✔️ | ✔️ |  |
