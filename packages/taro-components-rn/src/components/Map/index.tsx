/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

import * as React from 'react'
import {
  Text,
  View,
  Dimensions
} from 'react-native'
// @ts-ignore // The type definitions for MapView have not been created.
import MapView, { Callout, Polygon, Circle, Polyline, Marker, MapEvent } from 'react-native-maps'
import { noop } from '../../utils'

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
    onMarkerClick: noop,
    onCalloutClick: noop,
    onControlClick: noop,
    onRegionChange: noop,
    onClick: noop,
    onUpdated: noop,
    onPoiClick: noop
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
