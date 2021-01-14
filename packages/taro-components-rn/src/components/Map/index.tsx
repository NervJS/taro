/**
 * 地图组件【EXPERIMENTAL】
 *
 * 安卓和 iOS 统一用谷歌地图
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/map.html
 * @see https://docs.expo.io/versions/v27.0.0/sdk/map-view
 * @see https://github.com/react-community/react-native-maps
 *
 * 颜色并不支持8位十六进制
 *
 * ✔ longitude
 * ✔ latitude
 * ✘ scale
 * ✔ markers (部分支持)
 * ✔ polyline (部分属性支持)
 * ✔ polygons (不支持 zIndex)
 * ✔ circles
 * ✘ includePoints
 * ✔ showLocation
 * ✘ subkey
 * ✘ enable3D
 * ✔ showCompass
 * ✘ enableOverlooking
 * ✔ enableZoom
 * ✔ enableScroll
 * ✔ enableRotate
 * ✔ onMarkerClick (onMarkerTap)
 * ✔ onCalloutClick (onCalloutTap)
 * ✘ onControlClick (onControlTap)
 * ✔ onRegionChange (不支持 causedBy)
 * ✔ onClick (onTap)
 * ✔ onUpdated
 * ✔ onPoiClick (onPoiTap)
 */

import * as React from 'react'
import {
  Text,
  View,
  Dimensions
} from 'react-native'
// @ts-ignore // The type definitions for MapView have not been created.
import MapView, { Callout, Polygon, Circle, Polyline, Marker, MapEvent } from 'react-native-maps'
import utils from '../../utils'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

/**
 * 标记点气泡 callout
 */
type Callouts = {
  content?: string;
  color?: string;
  fontSize?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  bgColor?: string;
  padding?: number;
  display?: 'BYCLICK' | 'ALWAYS';
  textAlign?: 'left' | 'right' | 'center';
}

/**
 * 标记点
 */
type Marker = {
  id?: number;
  latitude: number;
  longitude: number;
  title?: string;
  // zIndex?: number;
  iconPath: string;
  rotate?: number;
  alpha?: number;
  // width?: number;
  // height?: number;
  callout?: Callouts;
  // label?: Label;
  anchor?: { x: number; y: number };
}

/**
 * 多段线
 */
type Polyline = {
  points: Array<{ latitude: number; longitude: number }>;
  color?: string;
  width?: number;
  // dottedLine?: boolean;
  // arrowLine?: boolean;
  // arrowIconPath?: string;
  // borderColor?: string;
  // borderWidth?: number;
}

/**
 * 多边形
 */
type Polygon = {
  points: Array<{ latitude: number; longitude: number }>;
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
  // zIndex?: number;
}

/**
 * 圆形
 */
type Circle = {
  latitude: number;
  longitude: number;
  color?: string;
  fillColor?: string;
  radius: number;
  strokeWidth?: number;
}

/**
 * 坐标
 */
type Coordinate = {
  latitude: number;
  longitude: number;
}

export interface Props {
  longitude: number;
  latitude: number;
  scale?: number;
  markers?: Array<Marker>;
  polyline?: Array<Polyline>;
  polygons?: Array<Polygon>;
  circles?: Array<Circle>;
  includePoints?: Array<Coordinate>;
  showLocation?: boolean;
  subkey?: string;
  enable3D?: boolean;
  showCompass?: boolean;
  enableOverlooking?: boolean;
  enableZoom?: boolean;
  enableScroll?: boolean;
  enableRotate?: boolean;

  onMarkerClick? (markerId?: number): void;

  onCalloutClick? (markerId?: number): void;

  onControlClick? (controlId?: number): void;

  onRegionChange? (event: { type: 'begin' | 'end'; timeStamp: number; causedBy?: 'scale' | 'drag' | 'update' }): void;

  onClick? (coordinate: Coordinate): void;

  onUpdated? (): void;

  onPoiClick? (): void;
}

export interface State {
  networkState: string;
}

class _Map extends React.Component<Props, State> {
  static defaultProps: Props = {
    longitude: 0,
    latitude: 0,
    scale: 16,
    markers: [],
    polyline: [],
    polygons: [],
    circles: [],
    includePoints: [],
    subkey: '',
    enableZoom: true,
    enableScroll: true,
    onMarkerClick: utils.noop,
    onCalloutClick: utils.noop,
    onControlClick: utils.noop,
    onRegionChange: utils.noop,
    onClick: utils.noop,
    onUpdated: utils.noop,
    onPoiClick: utils.noop
  }

  state: State = {
    networkState: ''
  }

  _onRegionChange = (): void => {
    const { onRegionChange } = this.props
    onRegionChange && onRegionChange({
      type: 'begin',
      timeStamp: Date.now()
    })
  }

  _onRegionChangeComplete = (): void => {
    const { onRegionChange } = this.props
    onRegionChange && onRegionChange({
      type: 'end',
      timeStamp: Date.now()
    })
  }

  _onClick = (e: MapEvent): void => {
    const { onClick } = this.props
    onClick && onClick(e.nativeEvent.coordinate)
  }

  _onMapReady = (): void => {
    const { onUpdated } = this.props
    onUpdated && onUpdated()
  }

  _onPoiClick = (): void => {
    const { onPoiClick } = this.props
    onPoiClick && onPoiClick()
  }

  getCallout = (marker: Marker): JSX.Element | null => {
    const { onCalloutClick } = this.props
    const { id, callout } = marker
    if (!callout) return null
    return (
      <Callout
        onPress={() => {
          onCalloutClick && onCalloutClick(id)
        }}
      >
        <View
          style={{
            borderRadius: callout.borderRadius,
            borderWidth: callout.borderWidth,
            borderColor: callout.borderColor,
            backgroundColor: callout.bgColor,
            padding: callout.padding
          }}
        >
          <Text
            style={{
              fontSize: callout.fontSize,
              color: callout.color,
              textAlign: callout.textAlign
            }}
          >
            {callout.content}
          </Text>
        </View>
      </Callout>
    )
  }

  render (): JSX.Element {
    const {
      latitude,
      longitude,
      markers,
      polyline,
      polygons,
      circles,
      showLocation,
      showCompass,
      enableZoom,
      enableScroll,
      enableRotate,
      onMarkerClick
    } = this.props

    return (
      <MapView
        style={{ flex: 1 }}
        // provider={MapView.PROVIDER_GOOGLE}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }}
        region={{
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }}
        minZoomLevel={5}
        maxZoomLevel={18}
        showsUserLocation={showLocation}
        showsCompass={showCompass}
        zoomEnabled={enableZoom}
        scrollEnabled={enableScroll}
        rotateEnabled={enableRotate}
        onRegionChange={this._onRegionChange}
        onRegionChangeComplete={this._onRegionChangeComplete}
        onPress={this._onClick}
        onMapReady={this._onMapReady}
        onPoiClick={this._onPoiClick}
      >
        {(markers || []).map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude
            }}
            title={marker.title}
            image={{ uri: marker.iconPath }}
            rotation={marker.rotate}
            opacity={marker.alpha}
            anchor={marker.anchor}
            onPress={() => {
              onMarkerClick && onMarkerClick(marker.id)
            }}
          >
            {this.getCallout(marker)}
          </Marker>
        ))}
        {(polyline || []).map((p, index) => (
          <Polyline
            key={`polyline_${index}`}
            coordinates={p.points}
            strokeColor={p.color}
            strokeWidth={p.width}
          />
        ))}
        {(polygons || []).map((p, index) => (
          <Polygon
            key={`polygon_${index}`}
            coordinates={p.points}
            strokeColor={p.strokeColor}
            strokeWidth={p.strokeWidth}
            fillColor={p.fillColor}
          />
        ))}
        {(circles || []).map((c, index) => (
          <Circle
            key={`circle_${index}`}
            center={{ latitude: c.latitude, longitude: c.longitude }}
            strokeColor={c.color}
            fillColor={c.fillColor}
            radius={c.radius}
            strokeWidth={c.strokeWidth}
          />
        ))}
      </MapView>
    )
  }
}

export default _Map
