import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Map, Button } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 媒体-地图
 * @returns
 */
let mapContext
export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [
        {
          id: 'createMapContext',
          func: (apiIndex) => {
            TestConsole.consoleTest('createMapContext')
            mapContext = Taro.createMapContext('Map')
            TestConsole.consoleNormal('createMapContext ', mapContext)
          },
        },

        {
          id: 'getCenterLocation',
          func: (apiIndex) => {
            if (mapContext) {
              TestConsole.consoleTest('getCenterLocation')
              mapContext = Taro.createMapContext('Map')
              mapContext.getCenterLocation({
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'setLocMarkerIcon',
          inputData: {
            iconPath: 'https://img0.baidu.com/it/u=2604176863,3349829508&fm=253&fmt=auto&app=138&f=PNG?w=243&h=243',
          },
          func: (apiIndex, data) => {
            if (mapContext) {
              TestConsole.consoleTest('setLocMarkerIcon')
              mapContext = Taro.createMapContext('Map')
              mapContext.setLocMarkerIcon({
                ...data,
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'moveToLocation',
          func: (apiIndex) => {
            TestConsole.consoleTest('moveToLocation')
            mapContext.moveToLocation()
            TestConsole.consoleNormal('moveToLocation暂不支持')
          },
        },

        {
          id: 'translateMarker',
          inputData: {
            markerId: 1,
            destination: { longitude: 116.418, latitude: 39.925 },
            duration: 5000,
            rotate: 90,
            moveWithRotate: true,
            autoRotate: true,
          },
          func: (apiIndex, data) => {
            if (mapContext) {
              TestConsole.consoleTest('translateMarker')
              mapContext = Taro.createMapContext('Map')
              mapContext.translateMarker({
                ...data,
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
                animationEnd: (...args) => {
                  TestConsole.consoleComplete.call(this, ...args, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'moveAlong',
          inputData: {
            markerId: 1,
            path: [
              { latitude: 39.916263, longitude: 116.403119},
              { latitude: 39.951671, longitude: 116.488781},
              { latitude: 39.968041, longitude: 116.534775},
            ],
            duration: 5000,
            autoRotate: true,
          },
          func: (apiIndex, data) => {
            if (mapContext) {
              TestConsole.consoleTest('moveAlong')
              mapContext = Taro.createMapContext('Map')
              mapContext.moveAlong({
                ...data,
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'includePoints',
          inputData: {
            points: [
              { longitude: 113.397428, latitude: 33.90923 },
              { longitude: 113.117278, latitude: 33.938546 },
            ],
          },
          func: (apiIndex, data) => {
            if (mapContext) {
              TestConsole.consoleTest('includePoints')
              mapContext = Taro.createMapContext('Map')
              mapContext.includePoints({
                ...data,
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'getRegion',
          func: (apiIndex) => {
            if (mapContext) {
              TestConsole.consoleTest('getRegion')
              mapContext = Taro.createMapContext('Map')
              mapContext.getRegion({
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'getRotate',
          func: (apiIndex) => {
            if (mapContext) {
              TestConsole.consoleTest('getRotate')
              mapContext = Taro.createMapContext('Map')
              mapContext.getRotate({
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'getSkew',
          func: (apiIndex) => {
            if (mapContext) {
              TestConsole.consoleTest('getSkew')
              mapContext = Taro.createMapContext('Map')
              mapContext.getSkew({
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'getScale',
          func: (apiIndex) => {
            if (mapContext) {
              TestConsole.consoleTest('getScale')
              mapContext = Taro.createMapContext('Map')
              mapContext.getScale({
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'setCenterOffset',
          inputData: {
            offset: [0.5, 0.5],
          },
          func: (apiIndex, data) => {
            if (mapContext) {
              TestConsole.consoleTest('setCenterOffset')
              mapContext = Taro.createMapContext('Map')
              mapContext.setCenterOffset({
                ...data,
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'addMarkers',
          inputData: {
            markers: [
              {
                id: 2,
                latitude: 31.4,
                longitude: 121.35,
                title: '上海迪士尼',
                zIndex: 9,
                iconPath: 'https://img0.baidu.com/it/u=2604176863,3349829508&fm=253&fmt=auto&app=138&f=PNG?w=243&h=243',
                rotate: 0,
                width: 20,
                height: 20,
                callout: {
                  content: '上海迪士尼',
                  color: '#ffffff',
                  fontSize: 20,
                  borderRadius: 24,
                  borderWidth: 10,
                  borderColor: '#FF0000',
                  bgColor: '#4294ff',
                  padding: 8,
                  display: 'BYCLICK',
                  textAlign: 'center',
                  anchorX: 10,
                  anchorY: 20,
                },
                label: {
                  content: '中国上海',
                  color: '#000',
                  fontSize: 16,
                  anchorX: 0,
                  anchorY: 0,
                  borderWidth: 10,
                  borderColor: 'red',
                  borderRadius: 10,
                  bgColor: '#fff',
                  padding: 20,
                  textAlign: 'left',
                },
                anchor: { x: 0, y: 0 },
                ariaLabel: '迪士尼度假区',
              },
            ],
            clear: false,
          },
          func: (apiIndex, data) => {
            if (mapContext) {
              TestConsole.consoleTest('addMarkers')
              mapContext = Taro.createMapContext('Map')
              mapContext.addMarkers({
                ...data,
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'removeMarkers',
          inputData: {
            markerIds: ['1', '2'],
          },
          func: (apiIndex, data) => {
            if (mapContext) {
              TestConsole.consoleTest('removeMarkers')
              mapContext = Taro.createMapContext('Map')
              mapContext.removeMarkers({
                ...data,
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'addGroundOverlay',
          inputData: {
            id: 'groundoverlay1',
            src: 'https://img0.baidu.com/it/u=2604176863,3349829508&fm=253&fmt=auto&app=138&f=PNG?w=243&h=243',
            bounds: {
              southwest: {
                latitude: 39.90955,
                longitude: 116.406616,
              },
              northeast: {
                latitude: 39.911487,
                longitude: 116.408013,
              },
            },
            opacity: 1,
            visible: true,
            zIndex: 1,
          },
          func: (apiIndex, data) => {
            if (mapContext) {
              TestConsole.consoleTest('addGroundOverlay')
              mapContext = Taro.createMapContext('Map')
              mapContext.addGroundOverlay({
                ...data,
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'updateGroundOverlay',
          inputData: {
            id: 'groundoverlay1',
            src: 'https://img1.baidu.com/it/u=4261206956,1866846027&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=415',
            bounds: {
              southwest: {
                latitude: 39.915,
                longitude: 116.404,
              },
              northeast: {
                latitude: 39.925,
                longitude: 116.414,
              },
            },
            opacity: 1,
            visible: true,
            zIndex: 1,
          },
          func: (apiIndex, data) => {
            if (mapContext) {
              TestConsole.consoleTest('updateGroundOverlay')
              mapContext = Taro.createMapContext('Map')
              mapContext.updateGroundOverlay({
                ...data,
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'removeGroundOverlay',
          inputData: {
            id: 'groundoverlay1',
          },
          func: (apiIndex, data) => {
            if (mapContext) {
              TestConsole.consoleTest('removeGroundOverlay')
              mapContext = Taro.createMapContext('Map')
              mapContext.removeGroundOverlay({
                ...data,
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },

        {
          id: 'setBoundary',
          inputData: {
            southwest: {
              latitude: 39.25961,
              longitude: 116.219375,
            },
            northeast: {
              latitude: 39.25961,
              longitude: 115.220375,
            },
          },
          func: (apiIndex, data) => {
            if (mapContext) {
              TestConsole.consoleTest('setBoundary')
              mapContext = Taro.createMapContext('Map')
              mapContext.setBoundary({
                ...data,
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              })
            } else {
              TestConsole.consoleTest('------mapContext未创建------')
            }
          },
        },
      ],
      lat: 39.914887,
      latitude: 39.914887,
      lng: 116.403694,
      longitude: 116.403694,
      isShow: true,
      rotated: 0,
      rotate: 0,
      Skew: 0,
      skew: 0,
      Scale: 16,
      scale: 16,
    }
  }

  handleInputChangeLatitude = (e) => {
    this.setState({
      lat: e.target.value,
    })
  }

  handleClickLatitude = async () => {
    const latitude = this.state.lat
    await this.setState(
      {
        latitude,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeLongitude = (e) => {
    this.setState({
      lng: e.target.value,
    })
  }

  handleClickLongitude = async () => {
    const longitude = this.state.lng
    await this.setState(
      {
        longitude,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeRotate = (e) => {
    this.setState({
      rotated: e.target.value,
    })
  }

  handleClickRotate = async () => {
    const rotate = this.state.rotated
    await this.setState(
      {
        rotate,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeSkew = (e) => {
    this.setState({
      Skew: e.target.value,
    })
  }

  handleClickSkew = async () => {
    const skew = this.state.Skew
    await this.setState(
      {
        skew,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeScale = (e) => {
    if (Number(e.target.value) >= 3 && Number(e.target.value) <= 20) {
      this.setState({
        Scale: e.target.value,
      })
    } else {
      console.error('请输入正确的缩放级别,范围是3-20')
    }
  }

  handleClickScale = async () => {
    const scale = this.state.Scale
    await this.setState(
      {
        scale,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  render() {
    const { list } = this.state
    function onTaps(e) {
      console.log(e.detail)
    }
    const markers = [
      {
        id: 1,
        latitude: 39.914887,
        longitude: 116.403694,
        title: '北京天安门',
        zIndex: 999,
        iconPath: 'https://img1.baidu.com/it/u=4261206956,1866846027&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=415',
        rotate: 0,
        width: 20,
        height: 20,
        callout: {
          content: '我是天安门!',
          color: '#ffffff',
          fontSize: 20,
          borderRadius: 24,
          borderWidth: 10,
          borderColor: '#FF0000',
          bgColor: 'red',
          padding: 8,
          display: 'BYCLICK',
          textAlign: 'center',
          anchorX: -10,
          anchorY: -10,
        },
        label: {
          content: '天安门',
          color: '#000',
          fontSize: 16,
          anchorX: 0,
          anchorY: 0,
          borderWidth: 10,
          borderColor: 'red',
          borderRadius: 10,
          bgColor: '#fff',
          padding: 20,
          textAlign: 'left',
        },
        anchor: { x: 0.5, y: 1 },
        ariaLabel: '中国首都',
      },
    ]
    return (
      <View className='api-page'>
        {this.state.isShow && (
          <Map
            id='Map'
            latitude={this.state.latitude}
            longitude={this.state.longitude}
            scale={this.state.scale}
            minScale={3}
            maxScale={20}
            markers={markers}
            covers={[
              [
                { latitude: 40.91451, longitude: 116.40459 },
                { latitude: 41.23039, longitude: 121.4737 },
              ],
            ]}
            polyline={[
              {
                points: [
                  { longitude: 120.219375, latitude: 30.25961 },
                  { longitude: 110.220375, latitude: 30.25961 },
                  { longitude: 111.220375, latitude: 30.26061 },
                  { longitude: 112.219375, latitude: 30.26061 },
                ],
                color: 'yellow', // 路线颜色
                width: 10, // 路线宽度
                dottedLine: true, // 是否为虚线
              },
            ]}
            circles={[
              {
                latitude: 39.90923,
                longitude: 116.397428,
                radius: 3000,
                color: 'red',
                fillColor: 'white',
                strokeWidth: 10,
              },
              {
                latitude: 39.938546,
                longitude: 116.117278,
                radius: 5000,
                color: 'red',
                fillColor: 'blue',
                strokeWidth: 10,
              },
            ]}
            polygons={[
              {
                points: [
                  { latitude: 31.230416, longitude: 121.473701 },
                  { latitude: 39.938102, longitude: 122.473701 },
                  { latitude: 39.934744, longitude: 123.473701 },
                  { latitude: 38.934744, longitude: 113.473701 },
                ],
                fillColor: 'red',
                strokeColor: 'blue',
                strokeWidth: 10,

                zIndex: 2,
              },
            ]}
            subkey='8f6f47446dd14bb28e0227ad168ab0a3'
            layerStyle={0}
            rotate={this.state.rotate} //旋转角度
            skew={this.state.skew} //倾斜角度
            showCompass={false} //指南针
            showScale={false} //是否开启比例尺
            enableOverlooking={false} //是否开启俯视
            enableZoom //是否缩放
            enableScroll //是否拖动
            enableRotate //是否支持旋转
            enableSatellite={false} //卫星
            enableTraffic={false} //是否展示交通
            enableBuilding={false} //是否展示建筑物
            enableAutoMaxOverlooking={false} //是否开启最大俯视角
            enable3D //是否开启3D
            onTap={onTaps}
          ></Map>
        )}
        latitude:<input onBlur={this.handleInputChangeLatitude}></input>
        <Button onClick={this.handleClickLatitude}>确定</Button>
        longitude:<input onBlur={this.handleInputChangeLongitude}></input>
        <Button onClick={this.handleClickLongitude}>确定</Button>
        rotate:<input onBlur={this.handleInputChangeRotate}></input>
        <Button onClick={this.handleClickRotate}>确定</Button>
        skew:<input onBlur={this.handleInputChangeSkew}></input>
        <Button onClick={this.handleClickSkew}>确定</Button>
        scale:<input onBlur={this.handleInputChangeScale}></input>
        <Button onClick={this.handleClickScale}>确定</Button>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
