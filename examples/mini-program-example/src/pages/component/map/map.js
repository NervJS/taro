import './map.scss'
import React from 'react'

import Taro from '@tarojs/taro'
import { View, Text, Map, Button } from '@tarojs/components'

import Header from '../../../components/head/head'

import ComponentState from '../../../components/component_state/component_state'

export default class PageView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: true,
      latitude: 39.914889,
      lat: 39.914889,
      longitude: 116.403696,
      lng: 116.403696,
      scale: 16,
      sca: 16,
      minScale: 3,
      min: 3,
      maxScale: 20,
      max: 20,
      enableBuilding: true,
      build: true,
      skew: 0,
      rotate: 0,
      showScale: false,
      subkey: '',
      layerStyle: 1,
      enableZoom: true,
      enableScroll: true,
      enableSatellite: false,
      showCompass: false,
      enable3D: false,
      enableOverlooking: false,
      enableAutoMaxOverlooking: false,
      enableTraffic: false,
      Traffic: false,
      markers: [
        {
          id: 8888888888,
          latitude: 39.914887,
          longitude: 116.403694,
          title: '北京天安门',
          iconPath: 'https://img1.baidu.com/it/u=4261206956,1866846027&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=415',
          rotate: 0,
          width: 20,
          height: 20,
          callout: {
            content: '我在天安门!',
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
            anchorY: -20,
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
          },
          anchor: { x: 0.5, y: 1 },
        },
        {
          id: 666666666,
          latitude: 38.914887,
          longitude: 116.403694,
          title: '北京天安门',
          zIndex: 999,
          iconPath: 'https://img1.baidu.com/it/u=4261206956,1866846027&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=415',
          rotate: 0,
          width: 20,
          height: 20,
          callout: {
            content: 'hahhaa天安门!',
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
            anchorY: -20,
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
          },
          anchor: { x: 0.5, y: 1 },
        },
      ],

      polyline: [
        {
          points: [
            { longitude: 120.219375, latitude: 30.25961 },
            { longitude: 110.220375, latitude: 30.25961 },
            { longitude: 111.220375, latitude: 30.26061 },
            { longitude: 112.219375, latitude: 30.26061 },
          ],
          color: 'red', // 路线颜色
          width: 5, // 路线宽度
          dottedLine: false, // 是否为虚线
        },
      ],

      circles: [
        {
          latitude: 39.90923,
          longitude: 116.397428,
          radius: 1000,
          color: 'green',
          fillColor: 'yellow',
          strokeWidth: 20,
        },
        {
          latitude: 39.938546,
          longitude: 116.117278,
          radius: 5000,
          color: 'red',
          fillColor: 'blue',
          strokeWidth: 10,
        },
      ],

      polygons: [
        {
          points: [
            { latitude: 31.230416, longitude: 121.473701 },
            { latitude: 39.938102, longitude: 122.473701 },
            { latitude: 39.934744, longitude: 123.473701 },
            { latitude: 38.934744, longitude: 113.473701 },
          ],
          fillColor: 'yellow',
          strokeColor: 'pink',
          strokeWidth: 5,
        },
      ],
    }
  }
  handleInputChangeLatitude = (e) => {
    this.setState({
      lat: e.target.value,
    })
  }

  handleClickLatitude = async () => {
    const latitude = /^-?\d+(\.\d+)?$/.test(this.state.lat.toString()) || this.state.lat === 0 ? this.state.lat : ''
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
    const longitude = /^-?\d+(\.\d+)?$/.test(this.state.lng.toString()) || this.state.lng === 0 ? this.state.lng : ''
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

  handleInputChangeScale = (e) => {
    this.setState({
      sca: e.target.value,
    })
  }

  handleClickScale = async () => {
    const scale = /^\d+$/.test(this.state.sca) ? this.state.sca : ''
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

  handleInputChangeMinScale = (e) => {
    this.setState({
      min: e.target.value,
    })
  }

  handleClickMinScale = async () => {
    const minScale = /^\d+$/.test(this.state.min) ? this.state.min : ''
    await this.setState(
      {
        minScale,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeMaxScale = (e) => {
    this.setState({
      max: e.target.value,
    })
  }

  handleClickMaxScale = async () => {
    const maxScale = /^\d+$/.test(this.state.max) ? this.state.max : ''
    await this.setState(
      {
        maxScale,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeEnableBuilding = (e) => {
    this.setState({
      build: e.target.value,
    })
  }

  handleClickEnableBuilding = async () => {
    const enableBuilding = this.state.build === 'false' ? this.state.build : true
    await this.setState(
      {
        enableBuilding,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeEnable3D = (e) => {
    this.setState({
      enable3d: e.target.value,
    })
  }

  handleClickEnable3d = async () => {
    const enable3D = this.state.enable3d === 'true' ? this.state.enable3d : false
    await this.setState(
      {
        enable3D,
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
      sk: e.target.value,
    })
  }

  handleClickEnableSkew = async () => {
    const skew = /^\d+(\.\d+)?$/.test(this.state.sk) ? this.state.sk : ''
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

  handleInputChangeEnableOverlooking = (e) => {
    this.setState({
      overlooking: e.target.value,
    })
  }

  handleClickEnableOverlooking = async () => {
    const enableOverlooking = this.state.overlooking === 'true' ? this.state.overlooking : false
    await this.setState(
      {
        enableOverlooking,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeEnableAutoMaxOverlooking = (e) => {
    this.setState({
      AutoMaxOverlooking: e.target.value,
    })
  }

  handleClickEnableAutoMaxOverlooking = async () => {
    const enableAutoMaxOverlooking = this.state.AutoMaxOverlooking === 'true' ? this.state.AutoMaxOverlooking : false
    await this.setState(
      {
        enableAutoMaxOverlooking,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeEnableTraffic = (e) => {
    this.setState({
      Traffic: e.target.value,
    })
  }

  handleClickEnableTraffic = async () => {
    const enableTraffic = this.state.Traffic === 'true' ? this.state.Traffic : false
    this.setState(
      {
        enableTraffic,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeEnableSatellite = (e) => {
    this.setState({
      Satellite: e.target.value,
    })
  }

  handleClickEnableSatellite = async () => {
    const enableSatellite = this.state.Satellite === 'true' ? this.state.Satellite : false
    await this.setState(
      {
        enableSatellite,
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
    const rotate = /^\d+(\.\d+)?$/.test(this.state.rotated) ? this.state.rotated : ''
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

  handleInputChangeEnableScroll = (e) => {
    this.setState({
      Scroll: e.target.value,
    })
  }

  handleClickEnableScroll = async () => {
    const enableScroll = this.state.Scroll === 'false' ? this.state.Scroll : true
    await this.setState(
      {
        enableScroll,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeShowCompass = (e) => {
    this.setState({
      compass: e.target.value,
    })
  }

  handleClickShowCompass = async () => {
    const showCompass = this.state.compass === 'true' ? this.state.compass : false
    await this.setState(
      {
        showCompass,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeEnableZoom = (e) => {
    this.setState({
      zoom: e.target.value,
    })
  }

  handleClickEnableZoom = async () => {
    const enableZoom = this.state.zoom === 'false' ? this.state.zoom : true
    await this.setState(
      {
        enableZoom,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeSubkey = (e) => {
    this.setState({
      key: e.target.value,
    })
  }

  handleClickSubkey = async () => {
    const subkey = this.state.key
    await this.setState(
      {
        subkey,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeLayerStyle = (e) => {
    this.setState({
      style: e.target.value,
    })
  }

  handleClickLayerStyle = async () => {
    const layerStyle = /^\d+$/.test(this.state.style) ? this.state.style : ''
    await this.setState(
      {
        layerStyle,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeShowScale = (e) => {
    this.setState({
      ShowScaled: e.target.value,
    })
  }

  handleClickShowScale = async () => {
    const showScale = this.state.ShowScaled === 'true' ? this.state.ShowScaled : false
    await this.setState(
      {
        showScale,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeMakers = async (e) => {
    const markers = JSON.parse(e.target.value)
    await this.setState(
      {
        markers,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangePolyline = async (e) => {
    const polyline = JSON.parse(e.target.value)
    await this.setState(
      {
        polyline,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangeCircles = async (e) => {
    const circles = JSON.parse(e.target.value)
    await this.setState(
      {
        circles,
        isShow: false,
      },
      () => {
        this.setState({
          isShow: true,
        })
      }
    )
  }

  handleInputChangePolygons = async (e) => {
    const polygons = JSON.parse(e.target.value)
    await this.setState(
      {
        polygons,
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
    function onTaps(e) {
      console.log(e.detail)
    }

    return (
      <View className='container'>
        <Header title='Map'></Header>
        <ComponentState platform='H5' rate='60'>
          {' '}
        </ComponentState>
        {this.state.isShow && (
          <Map
            longitude={this.state.longitude}
            latitude={this.state.latitude}
            scale={this.state.scale}
            minScale={this.state.minScale}
            maxScale={this.state.maxScale}
            markers={this.state.markers}
            polyline={this.state.polyline}
            circles={this.state.circles}
            polygons={this.state.polygons}
            setting={this.state.setting}
            enableBuilding={this.state.enableBuilding} //是否展示建筑物
            skew={this.state.skew}
            rotate={this.state.rotate}
            showScale={this.state.showScale}
            subkey={this.state.subkey}
            layerStyle={this.state.layerStyle}
            enableZoom={this.state.enableZoom}
            enableScroll={this.state.enableScroll}
            enableSatellite={this.state.enableSatellite}
            showCompass={this.state.showCompass}
            enable3D={this.state.enable3D}
            enableOverlooking={this.state.enableOverlooking}
            enableAutoMaxOverlooking={this.state.enableAutoMaxOverlooking}
            enableTraffic={this.state.enableTraffic}
            onTap={onTaps}
          ></Map>
        )}
        latitude:<input onBlur={this.handleInputChangeLatitude}></input>
        <Button onClick={this.handleClickLatitude}>确定</Button>
        longitude:<input onBlur={this.handleInputChangeLongitude}></input>
        <Button onClick={this.handleClickLongitude}>确定</Button>
        scale:<input onBlur={this.handleInputChangeScale}></input>
        <Button onClick={this.handleClickScale}>确定</Button>
        minScale:<input onBlur={this.handleInputChangeMinScale}></input>
        <Button onClick={this.handleClickMinScale}>确定</Button>
        maxScale:<input onBlur={this.handleInputChangeMaxScale}></input>
        <Button onClick={this.handleClickMaxScale}>确定</Button>
        enableBuilding:<input onBlur={this.handleInputChangeEnableBuilding}></input>
        <Button onClick={this.handleClickEnableBuilding}>确定</Button>
        enable3D:<input onBlur={this.handleInputChangeEnable3D}></input>
        <Button onClick={this.handleClickEnable3d}>确定</Button>
        rotate:<input onBlur={this.handleInputChangeRotate}></input>
        <Button onClick={this.handleClickRotate}>确定</Button>
        skew:<input onBlur={this.handleInputChangeSkew}></input>
        <Button onClick={this.handleClickEnableSkew}>确定</Button>
        enableOverlooking:<input onBlur={this.handleInputChangeEnableOverlooking}></input>
        <Button onClick={this.handleClickEnableOverlooking}>确定</Button>
        enableAutoMaxOverlooking:<input onBlur={this.handleInputChangeEnableAutoMaxOverlooking}></input>
        <Button onClick={this.handleClickEnableAutoMaxOverlooking}>确定</Button>
        enableTraffic:<input onBlur={this.handleInputChangeEnableTraffic}></input>
        <Button onClick={this.handleClickEnableTraffic}>确定</Button>
        enableSatellite:<input onBlur={this.handleInputChangeEnableSatellite}></input>
        <Button onClick={this.handleClickEnableSatellite}>确定</Button>
        enableScroll:<input onBlur={this.handleInputChangeEnableScroll}></input>
        <Button onClick={this.handleClickEnableScroll}>确定</Button>
        enableZoom:<input onBlur={this.handleInputChangeEnableZoom}></input>
        <Button onClick={this.handleClickEnableZoom}>确定</Button>
        showCompass:<input onBlur={this.handleInputChangeShowCompass}></input>
        <Button onClick={this.handleClickShowCompass}>确定</Button>
        showScale:<input onBlur={this.handleInputChangeShowScale}></input>
        <Button onClick={this.handleClickShowScale}>确定</Button>
        subkey:<input onBlur={this.handleInputChangeSubkey}></input>
        <Button onClick={this.handleClickSubkey}>确定</Button>
        layerStyle:<input onBlur={this.handleInputChangeLayerStyle}></input>
        <Button onClick={this.handleClickLayerStyle}>确定</Button>
        markers:
        <textarea
          onBlur={this.handleInputChangeMakers}
          style={{ height: '500px', width: '300px' }}
          defaultValue={JSON.stringify(this.state.markers)}
        ></textarea>
        polyline:
        <textarea
          onBlur={this.handleInputChangePolyline}
          style={{ height: '300px', width: '300px' }}
          defaultValue={JSON.stringify(this.state.polyline)}
        ></textarea>
        circles:
        <textarea
          onBlur={this.handleInputChangeCircles}
          style={{ height: '300px', width: '300px' }}
          defaultValue={JSON.stringify(this.state.circles)}
        ></textarea>
        polygons:
        <textarea
          onBlur={this.handleInputChangePolygons}
          style={{ height: '300px', width: '300px' }}
          defaultValue={JSON.stringify(this.state.polygons)}
        ></textarea>
      </View>
    )
  }
}
