---
title: Map
sidebar_label: Map
---

地图。相关api Taro.createMapContext。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/map.html#map)

## 类型

```tsx
ComponentType<MapProps>
```

## 示例代码

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

## MapProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>中心经度</td>
    </tr>
    <tr>
      <td>latitude</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>中心纬度</td>
    </tr>
    <tr>
      <td>scale</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>16</code></td>
      <td style="text-align:center">否</td>
      <td>缩放级别，取值范围为3-20</td>
    </tr>
    <tr>
      <td>markers</td>
      <td><code>marker[]</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>标记点</td>
    </tr>
    <tr>
      <td>covers</td>
      <td><code>any[]</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>标记点<br />不推荐: 即将移除，请使用 markers</td>
    </tr>
    <tr>
      <td>polyline</td>
      <td><code>polyline[]</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>路线</td>
    </tr>
    <tr>
      <td>circles</td>
      <td><code>circle[]</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>圆</td>
    </tr>
    <tr>
      <td>controls</td>
      <td><code>control[]</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>控件（即将废弃，建议使用 cover-view 代替）<br /><strong>不推荐使用</strong></td>
    </tr>
    <tr>
      <td>includePoints</td>
      <td><code>point[]</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>缩放视野以包含所有给定的坐标点</td>
    </tr>
    <tr>
      <td>showLocation</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>显示带有方向的当前定位点</td>
    </tr>
    <tr>
      <td>polygons</td>
      <td><code>polygon[]</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>多边形</td>
    </tr>
    <tr>
      <td>subkey</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>个性化地图使用的 key</td>
    </tr>
    <tr>
      <td>layerStyle</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>1</code></td>
      <td style="text-align:center">否</td>
      <td>个性化地图配置的 style，不支持动态修改</td>
    </tr>
    <tr>
      <td>rotate</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
      <td>旋转角度，范围 0 ~ 360, 地图正北和设备 y 轴角度的夹角</td>
    </tr>
    <tr>
      <td>skew</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
      <td>倾斜角度，范围 0 ~ 40 , 关于 z 轴的倾角</td>
    </tr>
    <tr>
      <td>enable3D</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>展示 3D 楼块</td>
    </tr>
    <tr>
      <td>showCompass</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>显示指南针</td>
    </tr>
    <tr>
      <td>showScale</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>显示比例尺</td>
    </tr>
    <tr>
      <td>enableOverlooking</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>开启俯视</td>
    </tr>
    <tr>
      <td>enableZoom</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>是否支持缩放</td>
    </tr>
    <tr>
      <td>enableScroll</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>是否支持拖动</td>
    </tr>
    <tr>
      <td>enableRotate</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否支持旋转</td>
    </tr>
    <tr>
      <td>enableSatellite</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否开启卫星图</td>
    </tr>
    <tr>
      <td>enableTraffic</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否开启实时路况</td>
    </tr>
    <tr>
      <td>setting</td>
      <td><code>MapProps | { [key: string]: any; }</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>配置项<br /><br />提供 setting 对象统一设置地图配置。同时对于一些动画属性如 rotate 和 skew，通过 setData 分开设置时无法同时生效，需通过 settting 统一修改。</td>
    </tr>
    <tr>
      <td>onTap</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>点击地图时触发</td>
    </tr>
    <tr>
      <td>onMarkerTap</td>
      <td><code>BaseEventOrigFunction&lt;onMarkerTapEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>点击标记点时触发，e.detail = {markerId}</td>
    </tr>
    <tr>
      <td>onLabelTap</td>
      <td><code>BaseEventOrigFunction&lt;onLabelTapEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>点击label时触发，e.detail = {markerId}</td>
    </tr>
    <tr>
      <td>onControlTap</td>
      <td><code>BaseEventOrigFunction&lt;onControlTapEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>点击控件时触发，e.detail = {controlId}</td>
    </tr>
    <tr>
      <td>onCalloutTap</td>
      <td><code>BaseEventOrigFunction&lt;onCalloutTapEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>点击标记点对应的气泡时触发，e.detail = {markerId}</td>
    </tr>
    <tr>
      <td>onUpdated</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>在地图渲染更新完成时触发</td>
    </tr>
    <tr>
      <td>onRegionChange</td>
      <td><code>BaseEventOrigFunction&lt;onRegionChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>视野发生变化时触发</td>
    </tr>
    <tr>
      <td>onPoiTap</td>
      <td><code>BaseEventOrigFunction&lt;onPoiTapEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>点击地图poi点时触发，e.detail = {name, longitude, latitude}</td>
    </tr>
    <tr>
      <td>includePadding</td>
      <td><code>{ left: string | number; right: string | number; top: string | number; bottom: string | number; }</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>视野在地图 padding 范围内展示</td>
    </tr>
    <tr>
      <td>groundOverlays</td>
      <td><code>any[]</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>覆盖物，自定义贴图</td>
    </tr>
    <tr>
      <td>tileOverlay</td>
      <td><code>any[]</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>覆盖物，网格贴图</td>
    </tr>
    <tr>
      <td>optimize</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>开启 optimize 模式后，无需再监听 onRegionChange 来获取并设置新的 scale 值以保证地图不会再回到原来的缩放比例。</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| MapProps.longitude | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.latitude | ✔️ | ✔️ | ✔️ |  |  |
| MapProps.scale | ✔️ | ✔️(取值范围为4-21) | ✔️(取值范围为5-18) |  |  |
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

标记点用于在地图上显示标记的位置

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>标记点id</td>
      <td><code>marker 点击事件回调会返回此id。建议为每个 marker 设置上 Number 类型 id，保证更新 marker 时有更好的性能。</code></td>
    </tr>
    <tr>
      <td>latitude</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>纬度</td>
      <td><code>浮点数，范围 -90 ~ 90</code></td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>经度</td>
      <td><code>浮点数，范围 -180 ~ 180</code></td>
    </tr>
    <tr>
      <td>title</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>标注点名</td>
      <td><code>点击时显示，callout 存在时将被忽略</code></td>
    </tr>
    <tr>
      <td>zIndex</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>显示层级</td>
      <td></td>
    </tr>
    <tr>
      <td>iconPath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>显示的图标</td>
      <td><code>项目目录下的图片路径，支持相对路径写法，以'/'开头则表示相对小程序根目录；也支持临时路径和网络图片</code></td>
    </tr>
    <tr>
      <td>rotate</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>旋转角度</td>
      <td><code>顺时针旋转的角度，范围 0 ~ 360，默认为 0</code></td>
    </tr>
    <tr>
      <td>alpha</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>标注的透明度</td>
      <td><code>默认1，无透明，范围 0 ~ 1</code></td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>string | number</code></td>
      <td style="text-align:center">否</td>
      <td>标注图标宽度</td>
      <td><code>默认为图片实际宽度</code></td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>string | number</code></td>
      <td style="text-align:center">否</td>
      <td>标注图标高度</td>
      <td><code>默认为图片实际高度</code></td>
    </tr>
    <tr>
      <td>callout</td>
      <td><code>callout</code></td>
      <td style="text-align:center">否</td>
      <td>自定义标记点上方的气泡窗口</td>
      <td><code>支持的属性见下表，可识别换行符。</code></td>
    </tr>
    <tr>
      <td>label</td>
      <td><code>label</code></td>
      <td style="text-align:center">否</td>
      <td>为标记点旁边增加标签</td>
      <td><code>支持的属性见下表，可识别换行符。</code></td>
    </tr>
    <tr>
      <td>anchor</td>
      <td><code>{ x: number; y: number; }</code></td>
      <td style="text-align:center">否</td>
      <td>经纬度在标注图标的锚点，默认底边中点</td>
      <td><code>{x, y}，x表示横向(0-1)，y表示竖向(0-1)。{x: .5, y: 1} 表示底边中点</code></td>
    </tr>
    <tr>
      <td>ariaLabel</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>无障碍访问，（属性）元素的额外描述</td>
      <td></td>
    </tr>
  </tbody>
</table>

### callout

marker 上的气泡 callout

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>content</td>
      <td><code>string</code></td>
      <td>文本</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td>文本颜色</td>
    </tr>
    <tr>
      <td>fontSize</td>
      <td><code>number</code></td>
      <td>文字大小</td>
    </tr>
    <tr>
      <td>borderRadius</td>
      <td><code>number</code></td>
      <td>边框圆角</td>
    </tr>
    <tr>
      <td>borderWidth</td>
      <td><code>number</code></td>
      <td>边框宽度</td>
    </tr>
    <tr>
      <td>borderColor</td>
      <td><code>string</code></td>
      <td>边框颜色</td>
    </tr>
    <tr>
      <td>bgColor</td>
      <td><code>string</code></td>
      <td>背景色</td>
    </tr>
    <tr>
      <td>padding</td>
      <td><code>number</code></td>
      <td>文本边缘留白</td>
    </tr>
    <tr>
      <td>display</td>
      <td><code>&quot;BYCLICK&quot; | &quot;ALWAYS&quot;</code></td>
      <td>'BYCLICK':点击显示; 'ALWAYS':常显</td>
    </tr>
    <tr>
      <td>textAlign</td>
      <td><code>&quot;left&quot; | &quot;right&quot; | &quot;center&quot;</code></td>
      <td>文本对齐方式。有效值: left, right, center</td>
    </tr>
  </tbody>
</table>

### label

marker 上的气泡 label

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>content</td>
      <td><code>string</code></td>
      <td>文本</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td>文本颜色</td>
    </tr>
    <tr>
      <td>fontSize</td>
      <td><code>number</code></td>
      <td>文字大小</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td>label的坐标（废弃）<br /><strong>不推荐使用</strong></td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>label的坐标（废弃）<br /><strong>不推荐使用</strong></td>
    </tr>
    <tr>
      <td>anchorX</td>
      <td><code>number</code></td>
      <td>label的坐标，原点是 marker 对应的经纬度</td>
    </tr>
    <tr>
      <td>anchorY</td>
      <td><code>number</code></td>
      <td>label的坐标，原点是 marker 对应的经纬度</td>
    </tr>
    <tr>
      <td>borderWidth</td>
      <td><code>number</code></td>
      <td>边框宽度</td>
    </tr>
    <tr>
      <td>borderColor</td>
      <td><code>string</code></td>
      <td>边框颜色</td>
    </tr>
    <tr>
      <td>borderRadius</td>
      <td><code>number</code></td>
      <td>边框圆角</td>
    </tr>
    <tr>
      <td>bgColor</td>
      <td><code>string</code></td>
      <td>背景色</td>
    </tr>
    <tr>
      <td>padding</td>
      <td><code>number</code></td>
      <td>文本边缘留白</td>
    </tr>
    <tr>
      <td>textAlign</td>
      <td><code>&quot;left&quot; | &quot;right&quot; | &quot;center&quot;</code></td>
      <td>文本对齐方式。有效值: left, right, center</td>
    </tr>
  </tbody>
</table>

### polyline

指定一系列坐标点，从数组第一项连线至最后一项

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>points</td>
      <td><code>point[]</code></td>
      <td style="text-align:center">是</td>
      <td>经纬度数组</td>
      <td><code>[{latitude: 0, longitude: 0}]</code></td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>线的颜色</td>
      <td><code>十六进制</code></td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>线的宽度</td>
      <td></td>
    </tr>
    <tr>
      <td>dottedLine</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否虚线</td>
      <td><code>默认 false</code></td>
    </tr>
    <tr>
      <td>arrowLine</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>带箭头的线</td>
      <td><code>默认 false，开发者工具暂不支持该属性</code></td>
    </tr>
    <tr>
      <td>arrowIconPath</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>更换箭头图标</td>
      <td><code>在 arrowLine 为 true 时生效</code></td>
    </tr>
    <tr>
      <td>borderColor</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>线的边框颜色</td>
      <td></td>
    </tr>
    <tr>
      <td>borderWidth</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>线的厚度</td>
      <td></td>
    </tr>
  </tbody>
</table>

### polygon

指定一系列坐标点，根据 points 坐标数据生成闭合多边形

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>points</td>
      <td><code>point[]</code></td>
      <td style="text-align:center">是</td>
      <td>经纬度数组</td>
      <td><code>[{latitude: 0, longitude: 0}]</code></td>
    </tr>
    <tr>
      <td>strokeWidth</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>描边的宽度</td>
      <td></td>
    </tr>
    <tr>
      <td>strokeColor</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>描边的颜色</td>
      <td><code>十六进制</code></td>
    </tr>
    <tr>
      <td>fillColor</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>填充颜色</td>
      <td><code>十六进制</code></td>
    </tr>
    <tr>
      <td>zIndex</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>设置多边形Z轴数值</td>
      <td></td>
    </tr>
  </tbody>
</table>

### circle

在地图上显示圆

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>latitude</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>纬度</td>
      <td><code>浮点数，范围 -90 ~ 90</code></td>
    </tr>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>经度</td>
      <td><code>浮点数，范围 -180 ~ 180</code></td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>描边的颜色</td>
      <td><code>十六进制</code></td>
    </tr>
    <tr>
      <td>fillColor</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>填充颜色</td>
      <td><code>十六进制</code></td>
    </tr>
    <tr>
      <td>radius</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>半径</td>
      <td></td>
    </tr>
    <tr>
      <td>strokeWidth</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>描边的宽度</td>
      <td></td>
    </tr>
  </tbody>
</table>

### control

在地图上显示控件，控件不随着地图移动。即将废弃，请使用 cover-view

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>控件id</td>
      <td><code>在控件点击事件回调会返回此id</code></td>
    </tr>
    <tr>
      <td>position</td>
      <td><code>point</code></td>
      <td style="text-align:center">是</td>
      <td>控件在地图的位置</td>
      <td><code>控件相对地图位置</code></td>
    </tr>
    <tr>
      <td>iconPath</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>显示的图标</td>
      <td><code>项目目录下的图片路径，支持本地路径、代码包路径</code></td>
    </tr>
    <tr>
      <td>clickable</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否可点击</td>
      <td><code>默认不可点击</code></td>
    </tr>
  </tbody>
</table>

### point

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>longitude</td>
      <td><code>number</code></td>
      <td>经度</td>
    </tr>
    <tr>
      <td>latitude</td>
      <td><code>number</code></td>
      <td>纬度</td>
    </tr>
  </tbody>
</table>

### position

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td>距离地图的左边界多远</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td>距离地图的上边界多远</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>图片宽度</code></td>
      <td>控件宽度</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>图片宽度</code></td>
      <td>控件高度</td>
    </tr>
  </tbody>
</table>

### onMarkerTapEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
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
      <th>参数</th>
      <th>类型</th>
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
      <th>参数</th>
      <th>类型</th>
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
      <th>参数</th>
      <th>类型</th>
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
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td>视野变化开始、结束时触发</td>
      <td><code>视野变化开始为begin，结束为end</code></td>
    </tr>
    <tr>
      <td>causedBy</td>
      <td><code>string</code></td>
      <td>导致视野变化的原因</td>
      <td><code>拖动地图导致(drag)、缩放导致(scale)、调用接口导致(update)</code></td>
    </tr>
    <tr>
      <td>detail</td>
      <td><code>regionChangeDetail</code></td>
      <td>视野改变详情</td>
      <td></td>
    </tr>
  </tbody>
</table>

### regionChangeDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>rotate</td>
      <td><code>number</code></td>
      <td>旋转角度</td>
    </tr>
    <tr>
      <td>skew</td>
      <td><code>number</code></td>
      <td>倾斜角度</td>
    </tr>
  </tbody>
</table>

### onPoiTapEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
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

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Map | ✔️ | ✔️ | ✔️ |  |  |
