---
title: Taro.chooseLocation(option)
sidebar_label: chooseLocation
---

Opens the map to select a location.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/location/wx.chooseLocation.html)

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
      <td>latitude</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Latitude.</td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Longitude.</td>
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
      <td>address</td>
      <td><code>string</code></td>
      <td>Detailed address</td>
    </tr>
    <tr>
      <td>latitude</td>
      <td><code>string</code></td>
      <td>Latitude. The value ranges from -90 to +90, and the negative number means south latitude. The GCJ-02 coordinate system of the State Bureau of Surveying and Mapping is used.</td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>string</code></td>
      <td>Longitude. The value ranges from -180 to +180, and the negative number means west longitude. The GCJ-02 coordinate system of the State Bureau of Surveying and Mapping is used.</td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td>Location name</td>
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
// config/index.js

// Once you have obtained the api key, you will need to fill it into the project's constant configuration `defineConstants.LOCATION_APIKEY`:
const config = {
  defineConstants: {
    LOCATION_APIKEY: JSON.stringify('XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX')
  },
  // ...
}
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseLocation | ✔️ | ✔️ |  |
