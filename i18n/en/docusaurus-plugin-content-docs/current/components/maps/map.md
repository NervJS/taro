---
title: Map
sidebar_label: Map
---

Map. Related API: <code>Taro.createMapContext</code>.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/map.html#map)

## Type

```tsx
ComponentType<MapProps>
```

## Examples

### General usage

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">

```tsx
class App extends Component {
  onTap () {}
  render () {
    return (
      <Map onClick={this.onTap} />
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <map
    id="map"
    style="width: 100%; height: 300px;"
    longitude="113.324520"
    latitude="23.099994"
    scale="14"
    :markers="markers"
    :polyline="polyline"
    :show-location="true"
    @regionchange="regionchange"
    @markertap="markertap"
  />
</template>

<script>
export default {
  data() {
    return {
      markers: [{
        iconPath: "https://avatars2.githubusercontent.com/u/1782542?s=460&u=d20514a52100ed1f82282bcfca6f49052793c889&v=4",
        id: 0,
        latitude: 23.099994,
        longitude: 113.324520,
        width: 50,
        height: 50
      }],
      polyline: [{
        points: [{
          longitude: 113.3245211,
          latitude: 23.10229
        }, {
          longitude: 113.324520,
          latitude: 23.21229
        }],
        color:"#FF0000DD",
        width: 2,
        dottedLine: true
      }]
    }
  },
  methods: {
    regionchange(e) {
      console.log(e.type)
    },
    markertap(e) {
      console.log("markertap:", e.detail.markerId)
    }
  }
}
</script>

```
  
</TabItem>
</Tabs>

### Customised bubbles

```js title="Custom bubbles on marker customCallout"
import { CoverView, Map, View } from '@tarojs/components'

const normalCallout = {
  id: 1,
  latitude: 23.098994,
  longitude: 113.32252,
  callout: {
    content: 'text content',
    color: '#ff0000',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center',
  }
}

const customCallout1 = {
  id: 2,
  latitude: 23.097994,
  longitude: 113.32352,
  customCallout: {
    anchorY: 0,
    anchorX: 0,
    display: 'ALWAYS',
  },
}

const customCallout2 = {
  id: 3,
  latitude: 23.096994,
  longitude: 113.32452,
  customCallout: {
    anchorY: 0,
    anchorX: 0,
    display: 'ALWAYS',
  },
}

const customCallout3 = {
  id: 4,
  latitude: 23.095994,
  longitude: 113.32552,
  customCallout: {
    anchorY: 0,
    anchorX: 0,
    display: 'ALWAYS',
  },
}

const customMarkers = [
  customCallout1,
  customCallout2,
  customCallout3,
]

const mapMarkers = [
  normalCallout,
  ...customMarkers
]

export default function Index() {
  return (
    <Map
      setting={{}}
      markers={mapMarkers}
      latitude={23.096994}
      longitude={113.324520}
      style={{ height: '100vh', width: '100vw' }}
    >
      <CoverView slot='callout'>
        {
          customMarkers.map(item => (
            <CoverView marker-id={item.id} key={item.id} >
              <View>navigator {item.id}</View>
            </CoverView>
          ))
        }
      </CoverView>
    </Map>
  )
}
```


## MapProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The longitude of the central point.</td>
    </tr>
    <tr>
      <td>latitude</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The latitude of the central point.</td>
    </tr>
    <tr>
      <td>scale</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>16</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The zoom level. Its values range from 3 to 20.</td>
    </tr>
    <tr>
      <td>markers</td>
      <td><code>marker[]</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The marker.</td>
    </tr>
    <tr>
      <td>covers</td>
      <td><code>any[]</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td><strong>This property will be discarded soon. Use the markers property instead.</strong></td>
    </tr>
    <tr>
      <td>polyline</td>
      <td><code>polyline[]</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The polyline.</td>
    </tr>
    <tr>
      <td>circles</td>
      <td><code>circle[]</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The circle.</td>
    </tr>
    <tr>
      <td>controls</td>
      <td><code>control[]</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The control. <strong>(This property will be discarded soon. Use cover-view instead.)</strong></td>
    </tr>
    <tr>
      <td>includePoints</td>
      <td><code>point[]</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Scales the view to include all the given coordinates.</td>
    </tr>
    <tr>
      <td>showLocation</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Displays the current location with directions.</td>
    </tr>
    <tr>
      <td>polygons</td>
      <td><code>polygon[]</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Polygon.</td>
    </tr>
    <tr>
      <td>subkey</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The key used in a custom map.</td>
    </tr>
    <tr>
      <td>layerStyle</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>1</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The style set for a custom map. It cannot be dynamically modified.</td>
    </tr>
    <tr>
      <td>rotate</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Rotation angle. Its values range from 0 to 360. It is the angle between the north direction of the map and the y-axis of the device.</td>
    </tr>
    <tr>
      <td>skew</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Skew angle relative to the z-axis. Its values range from 0 to 40.</td>
    </tr>
    <tr>
      <td>enable3D</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Displays 3D blocks (Currently unsupported in the DevTools).</td>
    </tr>
    <tr>
      <td>showCompass</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Displays the compass.</td>
    </tr>
    <tr>
      <td>showScale</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Dispaly the scale</td>
    </tr>
    <tr>
      <td>enableOverlooking</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Enables overlooking.</td>
    </tr>
    <tr>
      <td>enableZoom</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to support scaling.</td>
    </tr>
    <tr>
      <td>enableScroll</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>true</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to support scrolling.</td>
    </tr>
    <tr>
      <td>enableRotate</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to support rotation.</td>
    </tr>
    <tr>
      <td>enableSatellite</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to enable the satellite images.</td>
    </tr>
    <tr>
      <td>enableTraffic</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to enable real-time traffic information.</td>
    </tr>
    <tr>
      <td>setting</td>
      <td><code>MapProps | Object</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Setting.<br /><br />The map configuration is set uniformly. Some animation properties such as rotate and skew cannot be set separately by setData and must be modified by settting.</td>
    </tr>
    <tr>
      <td>onTap</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the map is tapped.</td>
    </tr>
    <tr>
      <td>onMarkerTap</td>
      <td><code>BaseEventOrigFunction&lt;onMarkerTapEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the marker is tapped. e.detail = {`{markerId}`}</td>
    </tr>
    <tr>
      <td>onLabelTap</td>
      <td><code>BaseEventOrigFunction&lt;onLabelTapEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>Triggered when the label is tapped. e.detail = {`{markerId}`}</td>
    </tr>
    <tr>
      <td>onControlTap</td>
      <td><code>BaseEventOrigFunction&lt;onControlTapEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the control is tapped. e.detail = {`{controlId}`}</td>
    </tr>
    <tr>
      <td>onCalloutTap</td>
      <td><code>BaseEventOrigFunction&lt;onCalloutTapEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the bubble corresponding to the marker is tapped. e.detail = {`{markerId}`} </td>
    </tr>
    <tr>
      <td>onUpdated</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the map is rendered.</td>
    </tr>
    <tr>
      <td>onRegionChange</td>
      <td><code>BaseEventOrigFunction&lt;onRegionChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the view changes.</td>
    </tr>
    <tr>
      <td>onPoiTap</td>
      <td><code>BaseEventOrigFunction&lt;onPoiTapEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>Triggered when the point of interests (POI) on the map is tapped. e.detail = {`{name, longitude, latitude}`} </td>
    </tr>
    <tr>
      <td>includePadding</td>
      <td><code>{`{ left: string | number; right: string | number; top: string | number; bottom: string | number; }`}</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The view is displayed within the map padding.</td>
    </tr>
    <tr>
      <td>groundOverlays</td>
      <td><code>any[]</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Overlays, custom poster</td>
    </tr>
    <tr>
      <td>tileOverlay</td>
      <td><code>any[]</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Overlays, mesh poster</td>
    </tr>
    <tr>
      <td>optimize</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>Specifies whether to enable optimize mode. When enabled, it is not necessary to set onRegionChange to get and set the new scale value to ensure that the map does not revert to the original scale.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| MapProps.longitude | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.latitude | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.scale | ✔️ | ✔️(4-21) | ✔️(5-18) |  |  |
| MapProps.markers | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.covers | ✔️ |  |  |  |  |
| MapProps.polyline | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.circles | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.controls | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.includePoints | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.showLocation | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.polygons | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.subkey | ✔️ |  |  |  |  |
| MapProps.layerStyle | ✔️ |  |  |  |  |
| MapProps.rotate | ✔️ |  |  |  |  |
| MapProps.skew | ✔️ |  |  |  |  |
| MapProps.enable3D | ✔️ | ✔️ |  |  |  |
| MapProps.showCompass | ✔️ | ✔️ |  |  |  |
| MapProps.showScale | ✔️ |  |  |  |  |
| MapProps.enableOverlooking | ✔️ | ✔️ |  |  |  |
| MapProps.enableZoom | ✔️ | ✔️ |  |  |  |
| MapProps.enableScroll | ✔️ | ✔️ |  |  |  |
| MapProps.enableRotate | ✔️ | ✔️ |  |  |  |
| MapProps.enableSatellite | ✔️ |  |  |  |  |
| MapProps.enableTraffic | ✔️ |  |  |  |  |
| MapProps.setting | ✔️ |  | ✔️ |  |  |
| MapProps.onTap | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.onMarkerTap | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.onLabelTap | ✔️ |  |  |  |  |
| MapProps.onControlTap | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.onCalloutTap | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.onUpdated | ✔️ | ✔️ |  |  |  |
| MapProps.onRegionChange | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.onPoiTap | ✔️ | ✔️ |  |  |  |
| MapProps.includePadding |  |  | ✔️ |  |  |
| MapProps.groundOverlays |  |  | ✔️ |  |  |
| MapProps.tileOverlay |  |  | ✔️ |  |  |
| MapProps.optimize |  |  | ✔️ |  |  |

### marker

The marker property is used to mark locations of markers on the map.

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
      <th>Remarks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The ID of the marker</td>
      <td>This ID is returned when the marker tapping event is called back. <code>We recommend that the number-type ID be set for each marker, to ensure that the marker has better performance during updates.</code></td>
    </tr>
    <tr>
      <td>latitude</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Latitude</td>
      <td><code>The number of floating points. Its values range from –90 to +90.</code></td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Longitude</td>
      <td><code>The number of floating points. Its values range from –180 to +180.</code></td>
    </tr>
    <tr>
      <td>title</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Name of the marker</td>
      <td><code>Displayed when it is tapped. It will be ignored when there is a callout.</code></td>
    </tr>
    <tr>
      <td>zIndex</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Display level</td>
      <td></td>
    </tr>
    <tr>
      <td>iconPath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Displayed icon</td>
      <td><code>The image path in the project directory. It can be written as a relative path prefixed with a forward slash '/', which indicates a relative root directory of a Mini Program. It can also be written as a temporary path and a network image.</code></td>
    </tr>
    <tr>
      <td>rotate</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Rotation angle</td>
      <td><code>The angle of clockwise rotation. Its values range from 0 to 360. It is 0 by default.</code></td>
    </tr>
    <tr>
      <td>alpha</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Transparency of the marker</td>
      <td><code>It is 1 by default, indicating that the marker is completely not transparent. Its values range from 0 to 1.</code></td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>string | number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The width of the marker icon</td>
      <td><code>Defaults to the actual width of the image.</code></td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>string | number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The height of the marker icon</td>
      <td><code>Defaults to the actual height of the image.</code></td>
    </tr>
    <tr>
      <td>callout</td>
      <td><code>callout</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Bubble window above a custom marker</td>
      <td><code>Supported properties are shown in the following table. It can recognize line breaks.</code></td>
    </tr>
    <tr>
      <td>label</td>
      <td><code>label</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Labels added next to the marker</td>
      <td><code>Supported properties are shown in the following table. It can recognize line breaks.</code></td>
    </tr>
    <tr>
      <td>anchor</td>
      <td><code>{`{ x: number; y: number; }`}</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Anchor whose longitude and latitude fall in a marker icon. It is the central point of the bottom edge by default.</td>
      <td>Its value is in the form of<code>{`{x, y}`}</code>, where x indicates (0–1) in the horizontal direction, and y indicates (0–1) in the vertical direction. The value {`{x: 0.5, y: 1}`} indicates the central point of the bottom edge.</td>
    </tr>
    <tr>
      <td>ariaLabel</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>ARIA. Additional description of the (property's) elements.</td>
      <td></td>
    </tr>
  </tbody>
</table>

### callout

Callout of a Bubble on the Marker

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
      <td>content</td>
      <td><code>string</code></td>
      <td>The text</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td>The color of the text</td>
    </tr>
    <tr>
      <td>fontSize</td>
      <td><code>number</code></td>
      <td>The font size of the text</td>
    </tr>
    <tr>
      <td>borderRadius</td>
      <td><code>number</code></td>
      <td>The radius of the rounded corner on the border</td>
    </tr>
    <tr>
      <td>borderWidth</td>
      <td><code>number</code></td>
      <td>The width of the border</td>
    </tr>
    <tr>
      <td>borderColor</td>
      <td><code>string</code></td>
      <td>The color of the border</td>
    </tr>
    <tr>
      <td>bgColor</td>
      <td><code>string</code></td>
      <td>The background color</td>
    </tr>
    <tr>
      <td>padding</td>
      <td><code>number</code></td>
      <td>The space between the text and the border</td>
    </tr>
    <tr>
      <td>display</td>
      <td><code>&quot;BYCLICK&quot; | &quot;ALWAYS&quot;</code></td>
      <td>'BYCLICK' : Click to display. 'ALWAYS': Always on.</td>
    </tr>
    <tr>
      <td>textAlign</td>
      <td><code>&quot;left&quot; | &quot;right&quot; | &quot;center&quot;</code></td>
      <td>The text alignment mode. Valid values include left, right, and center.</td>
    </tr>
  </tbody>
</table>

### label

Label of a Bubble on the Marker

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
      <td>content</td>
      <td><code>string</code></td>
      <td>The text</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td>The color of the text</td>
    </tr>
    <tr>
      <td>fontSize</td>
      <td><code>number</code></td>
      <td>The font size of the text</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td>The X-coordinate of the label (This property has been discarded.)<br /><strong>不推荐使用</strong></td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>The Y-coordinate of the label (This property has been discarded.)<br /><strong>不推荐使用</strong></td>
    </tr>
    <tr>
      <td>anchorX</td>
      <td><code>number</code></td>
      <td>The X-coordinate of the label, with the coordinates of the origin being the longitude and latitude corresponding to the marker.</td>
    </tr>
    <tr>
      <td>anchorY</td>
      <td><code>number</code></td>
      <td>The Y-coordinate of the label, with the coordinates of the origin being the longitude and latitude corresponding to the marker.</td>
    </tr>
    <tr>
      <td>borderWidth</td>
      <td><code>number</code></td>
      <td>The width of the border</td>
    </tr>
    <tr>
      <td>borderColor</td>
      <td><code>string</code></td>
      <td>The color of the border</td>
    </tr>
    <tr>
      <td>borderRadius</td>
      <td><code>number</code></td>
      <td>The radius of the rounded corner on the border</td>
    </tr>
    <tr>
      <td>bgColor</td>
      <td><code>string</code></td>
      <td>The background color</td>
    </tr>
    <tr>
      <td>padding</td>
      <td><code>number</code></td>
      <td>The space between the text and the border</td>
    </tr>
    <tr>
      <td>textAlign</td>
      <td><code>&quot;left&quot; | &quot;right&quot; | &quot;center&quot;</code></td>
      <td>The text alignment mode. Valid values include left, right, and center.</td>
    </tr>
  </tbody>
</table>

### polyline

Specifies a series of coordinates, which are connected from the first item to the last item in an array.

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
      <th>Remarks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>points</td>
      <td><code>point[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The longitude and latitude array</td>
      <td><code>[{`{latitude: 0, longitude: 0}`}]</code></td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the line</td>
      <td><code>Hexadecimal</code></td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The width of the line</td>
      <td></td>
    </tr>
    <tr>
      <td>dottedLine</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether the line is a dotted line.</td>
      <td><code>Its value is false by default.</code></td>
    </tr>
    <tr>
      <td>arrowLine</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether the line contains an arrow.</td>
      <td><code>Its value is false by default. WeChat DevTools currently does not support this property.</code></td>
    </tr>
    <tr>
      <td>arrowIconPath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Changes the arrow icon.</td>
      <td><code>It takes effect when arrowLine is true.</code></td>
    </tr>
    <tr>
      <td>borderColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the line's border</td>
      <td></td>
    </tr>
    <tr>
      <td>borderWidth</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The thickness of the line</td>
      <td></td>
    </tr>
  </tbody>
</table>

### polygon

Specifies a series of coordinates, which form a closed polygon based on the coordinate data in the points property.

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
      <th>Remarks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>points</td>
      <td><code>point[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The longitude and latitude array</td>
      <td><code>[{`{latitude: 0, longitude: 0}`}]</code></td>
    </tr>
    <tr>
      <td>strokeWidth</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The width of the stroke</td>
      <td></td>
    </tr>
    <tr>
      <td>strokeColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the stroke</td>
      <td><code>Hexadecimal</code></td>
    </tr>
    <tr>
      <td>fillColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The fill color</td>
      <td><code>Hexadecimal</code></td>
    </tr>
    <tr>
      <td>zIndex</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Sets the value of the z-axis of the polygon.</td>
      <td></td>
    </tr>
  </tbody>
</table>

### circle

This property specifies whether to show a circle on the map.

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
      <th>Remarks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>latitude</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Latitude</td>
      <td><code>The number of floating points. Its values range from –90 to +90.</code></td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Longitude</td>
      <td><code>The number of floating points. Its values range from –180 to +180.</code></td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the stroke</td>
      <td><code>Hexadecimal</code></td>
    </tr>
    <tr>
      <td>fillColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The fill color</td>
      <td><code>Hexadecimal</code></td>
    </tr>
    <tr>
      <td>radius</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Radius</td>
      <td></td>
    </tr>
    <tr>
      <td>strokeWidth</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The width of the stroke</td>
      <td></td>
    </tr>
  </tbody>
</table>

### control

This property specifies whether to show controls on the map. The controls do not move with the map. This property will be discarded soon. Use <code>CoverView</code> instead.

<table>
  <thead>
     <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
      <th>Remarks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The ID of the control</td>
      <td><code>This ID is returned when the control tapping event is called back.</code></td>
    </tr>
    <tr>
      <td>position</td>
      <td><code>point</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The location of the control on the map</td>
      <td><code>The location of the control relative to the map.</code></td>
    </tr>
    <tr>
      <td>iconPath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Displayed icon</td>
      <td><code>The image path in the project directory. It can be written as a relative path prefixed with a forward slash '/', which indicates a relative root directory of a Mini Program. It can also be written as a temporary path.</code></td>
    </tr>
    <tr>
      <td>clickable</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether the control is clickable.</td>
      <td><code>It is unclickable by default.</code></td>
    </tr>
  </tbody>
</table>

### point

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
      <td>longitude</td>
      <td><code>number</code></td>
      <td>Longitude</td>
    </tr>
    <tr>
      <td>latitude</td>
      <td><code>number</code></td>
      <td>Latitude</td>
    </tr>
  </tbody>
</table>

### position

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td>The distance from the left edge of the map.</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td>The distance from the top edge of the map.</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>Image width</code></td>
      <td>The width of the control</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>Image height</code></td>
      <td>The height of the control</td>
    </tr>
  </tbody>
</table>

### onMarkerTapEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>markerId</td>
      <td><code>string | number</code></td>
    </tr>
  </tbody>
</table>

### onLabelTapEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>markerId</td>
      <td><code>string | number</code></td>
    </tr>
  </tbody>
</table>

### onControlTapEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>controlId</td>
      <td><code>string | number</code></td>
    </tr>
  </tbody>
</table>

### onCalloutTapEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>markerId</td>
      <td><code>string | number</code></td>
    </tr>
  </tbody>
</table>

### onRegionChangeEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
      <th>Remarks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td>Triggered at the start and end of a field of view change.</td>
      <td><code>begin</code> and <code>end</code></td>
    </tr>
    <tr>
      <td>causedBy</td>
      <td><code>string</code></td>
      <td>Causes of changes in visual field</td>
      <td><code>drag</code>, <code>scale</code>, <code>update</code></td>
    </tr>
    <tr>
      <td>detail</td>
      <td><code>regionChangeDetail</code></td>
      <td>Details of the change of region</td>
      <td></td>
    </tr>
  </tbody>
</table>

### regionChangeDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>rotate</td>
      <td><code>number</code></td>
      <td>Rotation angle</td>
    </tr>
    <tr>
      <td>skew</td>
      <td><code>number</code></td>
      <td>Skew angle</td>
    </tr>
  </tbody>
</table>

### onPoiTapEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
    </tr>
    <tr>
      <td>latitude</td>
      <td><code>number</code></td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Map | ✔️ | ✔️ | ✔️ |  |  |
