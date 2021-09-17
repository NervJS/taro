---
title: MapContext
sidebar_label: MapContext
---

`MapContext` instance, which can be obtained by Taro.createMapContext.
`MapContext` is bound to a &lt;map/&gt; component by id, to operate the corresponding &lt;map/&gt; component.

## Methods

### getCenterLocation

Obtain the altitude and longitude of the current map center. The gcj02 coordinate system is returned, which can be used for [wx.openLocation()](https://developers.weixin.qq.com/miniprogram/en/dev/api/location/wx.openLocation.html)

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/map/MapContext.getCenterLocation.html)

```tsx
(option?: GetCenterLocationOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>GetCenterLocationOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.getCenterLocation | ✔️ |  |  |

### getRegion

Acquire the scope of the field of view of the current map

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/map/MapContext.getRegion.html)

```tsx
(option?: GetRegionOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>GetRegionOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.getRegion | ✔️ |  |  |

### getRotate

Acquire the rotation angle of the current map

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getRotate.html)

```tsx
(option?: GetRotateOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>GetRotateOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.getRotate | ✔️ |  |  |

### getScale

Obtains the zoom level of the current map

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/map/MapContext.getScale.html)

```tsx
(option?: GetScaleOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>GetScaleOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.getScale | ✔️ |  |  |

### getSkew

Acquire the tilt angle of the current map

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getSkew.html)

```tsx
(option?: GetSkewOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>GetSkewOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.getSkew | ✔️ |  |  |

### includePoints

Zooms in/out the view to show all latitudes and longitudes.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/map/MapContext.includePoints.html)

```tsx
(option: IncludePointsOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>IncludePointsOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.includePoints | ✔️ |  |  |

### moveToLocation

Moves the map center to the current location. Use with the show-location of the map component.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/map/MapContext.moveToLocation.html)

```tsx
(option: MoveToLocationOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>MoveToLocationOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.moveToLocation | ✔️ |  |  |

### translateMarker

Translates marker with animation.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/map/MapContext.translateMarker.html)

```tsx
(option: TranslateMarkerOption) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>TranslateMarkerOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.translateMarker | ✔️ |  |  |

## Parameters

### GetCenterLocationOption

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

### GetCenterLocationSuccessCallback

The callback function for a successful API call

```tsx
(result: GetCenterLocationSuccessCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>GetCenterLocationSuccessCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### GetCenterLocationSuccessCallbackResult

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
      <td>latitude</td>
      <td><code>number</code></td>
      <td>Latitude</td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td>Longitude</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### GetRegionOption

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

### GetRegionSuccessCallback

The callback function for a successful API call

```tsx
(result: GetRegionSuccessCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>GetRegionSuccessCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### GetRegionSuccessCallbackResult

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
      <td>northeast</td>
      <td><code>number</code></td>
      <td>Altitude and longitude of the Northeast corner</td>
    </tr>
    <tr>
      <td>southwest</td>
      <td><code>number</code></td>
      <td>Altitude and longitude of the Southwest corner</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### GetRotateOption

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

### GetRotateSuccessCallback

The callback function for a successful API call

```tsx
(result: GetRotateSuccessCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>GetRotateSuccessCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### GetRotateSuccessCallbackResult

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
      <td>rotate</td>
      <td><code>number</code></td>
      <td>The rotation angle</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### GetScaleOption

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

### GetScaleSuccessCallback

The callback function for a successful API call

```tsx
(result: GetScaleSuccessCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>GetScaleSuccessCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### GetScaleSuccessCallbackResult

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
      <td>scale</td>
      <td><code>number</code></td>
      <td>Scaling value</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### GetSkewOption

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

### GetSkewSuccessCallback

The callback function for a successful API call

```tsx
(result: GetSkewSuccessCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>GetSkewSuccessCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### GetSkewSuccessCallbackResult

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
      <td>skew</td>
      <td><code>number</code></td>
      <td>Skewing value</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### IncludePointsOption

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
      <td>points</td>
      <td><code>MapPostion[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>List of coordinate points to be displayed in the visible area</td>
    </tr>
    <tr>
      <td>padding</td>
      <td><code>number[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Distance between the edge of the rectangle formed by coordinate points and the edge of the map (in pixel). The format is [top, right, bottom, left]. Only the first item of the array can be identified on Android. The padding is consistent for top, bottom, left, and right. Padding parameters are currently not supported on developer tools.</td>
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

### MapPostion

List of coordinate points to be displayed in the visual area

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
      <td>latitude</td>
      <td><code>number</code></td>
      <td>Latitude</td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td>Longitude</td>
    </tr>
  </tbody>
</table>

### MoveToLocationOption

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
      <td>Latitude</td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Longitude</td>
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

### TranslateMarkerOption

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
      <td>autoRotate</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Specifies whether to automatically rotate the marker when moving</td>
    </tr>
    <tr>
      <td>destination</td>
      <td><code>DestinationOption</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Specifies the destination to which the marker will move</td>
    </tr>
    <tr>
      <td>markerId</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Specifies the marker</td>
    </tr>
    <tr>
      <td>rotate</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The rotation angle of the marker</td>
    </tr>
    <tr>
      <td>animationEnd</td>
      <td><code>(...args: any[]) =&gt; any</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when an animation ends</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Animation duration, calculated separately for translation and rotation</td>
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

### DestinationOption

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
      <td>latitude</td>
      <td><code>number</code></td>
      <td>Latitude</td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td>Longitude</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| MapContext.getCenterLocation | ✔️ |  |  |
| MapContext.getRegion | ✔️ |  |  |
| MapContext.getRotate | ✔️ |  |  |
| MapContext.getScale | ✔️ |  |  |
| MapContext.getSkew | ✔️ |  |  |
| MapContext.includePoints | ✔️ |  |  |
| MapContext.moveToLocation | ✔️ |  |  |
| MapContext.translateMarker | ✔️ |  |  |
