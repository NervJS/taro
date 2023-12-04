import { Component, ComponentInterface, Element, Event, EventEmitter, h, Host, Prop } from '@stencil/core'
import Hammer from 'hammerjs'
import { MapProps } from 'types'

const coordtransform = require('coordtransform')

declare const BMapGL: any
declare const BMAP_ANCHOR_TOP_RIGHT: any
declare const BMAP_ANCHOR_BOTTOM_RIGHT: any
declare const BMAP_NORMAL_MAP: any
declare const BMAP_SATELLITE_MAP: any

@Component({
  tag: 'taro-map-core',
  styleUrl: './style/map.scss',
})
export class Map implements ComponentInterface {
  /**
   * 纬度
   */
  @Prop() latitude: number

  /**
   * 经度
   */
  @Prop() longitude: number

  /**
   * 缩放级别
   */
  @Prop() scale: number

  /**
   * 最小缩放级别
   */
  @Prop() minScale: number

  /**
   * 最大缩放级别
   */
  @Prop() maxScale: number

  /**
   *标记点
   */
  @Prop() markers: MapProps.marker[]

  /**
   * 路线(问题)
   */
  @Prop() polyline: MapProps.polyline[]

  /**
   * 圆(问题)
   */
  @Prop() circles: MapProps.circle[]

  /**
   * 多边形（参数问题）
   */
  @Prop() polygons: MapProps.polygon[]

  /**
   * 个性化地图】使用的key
   */
  @Prop() subkey: string

  /**
   * 【个性化地图】配置的 style
   */
  @Prop() layerStyle: number

  /**
   * 旋转
   */
  @Prop() rotate: number

  /**
   * 倾斜
   */
  @Prop() skew: number

  /**
   * 指南针
   */
  @Prop() showCompass: boolean

  /**
   * 比例尺
   */
  @Prop() showScale: boolean

  /**
   * 是否开启俯视
   */
  @Prop() enableOverlooking: boolean

  /**
   * 是否支持缩放
   */
  @Prop() enableZoom: boolean

  /**
   * 是否支持拖动
   */
  @Prop() enableScroll: boolean

  /**
   * 是否支持旋转
   */
  @Prop() enableRotate: boolean

  /**
   * 是否开启卫星图
   */
  @Prop() enableSatellite: boolean

  /**
   * 是否开启实时路况
   */
  @Prop() enableTraffic: boolean

  /**
   * 是否展示建筑
   */
  @Prop() enableBuilding: boolean

  /**
   * 是否开启最大俯视角
   */
  @Prop() enableAutoMaxOverlooking: boolean

  /**
   * 3D楼块
   */
  @Prop() enable3D: boolean

  @Event({
    eventName: 'tap',
  })
    onTap: EventEmitter

  private map: any
  private mapRef: HTMLDivElement
  @Element() el: HTMLElement
  groundOverlay: any
  componentDidLoad () {
    // 加载地图脚本
    this.loadMapScript().then(() => {
      // 如果容器元素存在
      if (this.mapRef) {
        // 创建地图对象
        this.map = new BMapGL.Map(this.mapRef)
        // 移除百度地图版权信息
        this.map.removeControl(this.map.getMapType())
        // 创建中心点坐标对象
        // 中心经纬度为必填值
        if (this.latitude < -90 || this.latitude > 90 || this.longitude < -180 || this.longitude > 180 || !this.longitude || !this.latitude) {
          console.error('请正确设置中心经纬度')
          return
        }
        const minScale = this.minScale ? this.minScale : 3
        const maxScale = this.maxScale ? this.maxScale : 20
        const point = new BMapGL.Point(this.longitude, this.latitude)
        if (this.minScale < 3 || this.minScale > 20) {
          this.map.setMinZoom(3)
        } else {
          // 设置最小缩放级别
          this.map.setMinZoom(minScale) 
        }
        if (this.maxScale > 20 || this.maxScale < 3) {
          this.map.setMaxZoom(20)
        } else {
          // 设置最大缩放级别
          this.map.setMaxZoom(maxScale)
        }
        if (this.minScale > this.maxScale) {
          this.map.setMinZoom(minScale)
          this.map.setMaxZoom(maxScale)
        }

        // 设置地图中心和缩放级别
        if (this.scale >= minScale && this.scale <= maxScale) {
          this.map.centerAndZoom(point, this.scale) // 使用this.scale来设置缩放级别
        } else if (this.scale <= minScale) {
          this.map.centerAndZoom(point, minScale)
        } else if (this.scale >= this.maxScale) {
          this.map.centerAndZoom(point, maxScale)
        } else {
          this.map.centerAndZoom(point, 16)
        }

        // 添加标记点markers
        if (Array.isArray(this.markers)) {
          this.addMarkers(this.markers)
        }

        // 创建polyline路线
        if (Array.isArray(this.polyline)) {
          this.polyline.forEach((line) => {
            if (line.points) {
              const points = line.points.map((point) => new BMapGL.Point(point.longitude, point.latitude))
              const polyline = new BMapGL.Polyline(points, {
                strokeColor: line.color,
                strokeWeight: line.width,
                strokeStyle: line.dottedLine ? 'dashed' : 'solid',
                strokeOpacity: 1,
              })
              // 将polyline路线添加到地图上
              this.map.addOverlay(polyline)
            }
          })
        }

        // 添加圆形覆盖物circles
        if (Array.isArray(this.circles)) {
          this.circles.forEach((circle) => {
            if (circle.latitude && circle.longitude && circle.radius) {
              const point = new BMapGL.Point(circle.longitude, circle.latitude)
              const circleObj = new BMapGL.Circle(point, circle.radius, {
                strokeColor: circle.color,
                fillColor: circle.fillColor,
                strokeWeight: circle.strokeWidth,
              })
              this.map.addOverlay(circleObj)
            }
          })
        }

        //  多边形
        if (Array.isArray(this.polygons)) {
          this.polygons.forEach((polygon) => {
            // 创建多边形的点坐标数组
            const points = polygon.points.map((point) => new BMapGL.Point(point.longitude, point.latitude))
            // 创建多边形对象
            const polygonObj = new BMapGL.Polygon(points, {
              strokeColor: polygon.strokeColor,
              fillColor: polygon.fillColor,
              strokeWeight: polygon.strokeWidth,
            })
            // 将多边形添加到地图上
            this.map.addOverlay(polygonObj)
          })
        }

        if (this.layerStyle === 0) {
          const layerStyle = this.layerStyle
          if (layerStyle) {
            // 使用个性化地图样式
            this.map.setMapStyleV2({ styleId: this.subkey })
          }
        } else {
          const layerStyle = this.layerStyle ? this.layerStyle : 1
          if (layerStyle === 1) {
            // 使用个性化地图样式
            this.map.setMapStyleV2({ styleId: this.subkey })
          }
        }

        const enable3D = this.enable3D === true ? this.enable3D : false
        const enableOverlooking = this.enableOverlooking === true ? this.enableOverlooking : false
        const enableAutoMaxOverlooking = this.enableAutoMaxOverlooking === true ? this.enableAutoMaxOverlooking : false
        const skew =this.skew ? this.skew : 0
        if (enable3D === true) {
          if (enableOverlooking === true) {
            // /开启最大俯视角
            if (enableAutoMaxOverlooking === true) {
              this.map.setTilt(75)
            } else {
              // 开启俯视角度
              this.map.setTilt(45)
            }
          } else if (skew >= 0 && skew <= 40) {
            // 设置倾斜角度
            this.map.setTilt(skew)
          } else {
            this.map.setTilt(0)
          }
        } else {
          this.map.setTilt(0)
        }

        // 显示指南针
        const showCompass = this.showCompass === true ? this.showCompass : false
        if (showCompass === true) {
          const compassControl = new BMapGL.NavigationControl3D({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            type: 3, // 3代表显示指南针
          })
          this.map.addControl(compassControl)
        }

        // 显示比例尺
        const showScale = this.showScale === true ? this.showScale : false
        if (showScale === true) {
          const scaleControl = new BMapGL.ScaleControl({
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
          })
          this.map.addControl(scaleControl)
        }

        const enableZoom = this.enableZoom === false ? this.enableZoom : true
        if (enableZoom === true) {
          // 启用缩放
          this.map.enableScrollWheelZoom(this.enableZoom)
        }
        // 启用缩放
        if (this.enableZoom === true && this.mapRef) {
          this.map.enablePinchToZoom()
        } else {
          this.map.disablePinchToZoom()
        }

        // 拖拽
        const enableScroll = this.enableScroll === false ? this.enableScroll : true
        if (enableScroll === true) {
          this.map.enableDragging()
        } else {
          this.map.disableDragging()
        }

        const rotate = this.rotate ? this.rotate : 0
        if (rotate >= 0 && this.rotate <= 360) {
          this.map.setHeading(this.rotate)
        } else {
          this.map.setHeading(0)
        }

        // 设置旋转角度
        if (this.enableRotate === true) {
          this.map.enableRotateGestures()
        }

        // 启用卫星图
        const enableSatellite = this.enableSatellite === true ? this.enableSatellite : false
        if (enableSatellite === true && this.mapRef) {
          const mapTypeControl = new BMapGL.MapTypeControl({
            mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP],
          })
          this.map.addControl(mapTypeControl)
        }

        const enableTraffic = this.enableTraffic === true ? this.enableTraffic : false
        if (enableTraffic === true && this.mapRef) {
          this.map.setTrafficOn()
        }

        // 是否开启建筑物
        const enableBuilding = this.enableBuilding === false ? this.enableBuilding : true
        if (enableBuilding === false) {
          this.map.setDisplayOptions({ building: false })
        }
      }
      if (this.map) {
        // 创建Hammer对象，绑定到地图容器
        const hammer = new Hammer(this.mapRef)
        hammer.on('tap', (e) => {
          // 将Hammer事件对象中的坐标转换为百度地图坐标
          const point = this.map.pixelToPoint({ x: e.center.x, y: e.center.y })
          this.onTap.emit({
            longitude: point.lng,
            latitude: point.lat,
          })
        })
      }
    })
  }

  addMarkers (markers) {
    // 维护已存在的marker id 列表
    const existingIds: string[] = [] 
    markers.forEach((marker) => {
      if (existingIds.includes(marker.id)) {
        // 如果id已存在，直接返回，不执行后续操作
        console.error('请输入不同的marker的id')
        return
      }
      existingIds.push(marker.id) 
      if (marker.latitude && marker.longitude && marker.iconPath&&marker.id) {
        if (marker.latitude < -90 || marker.latitude > 90 || marker.longitude < -180 || marker.longitude > 180) {
          console.error('请正确设置marker的经纬度')
          return
        }
        const pt = new BMapGL.Point(marker.longitude, marker.latitude)
        const markerObj = new BMapGL.Marker(pt, { enableClicking: true })

        markerObj.id = marker.id // 设置标记点的唯一标识符
        markerObj.alpha = marker.alpha
        if (marker.zIndex) {
          markerObj.setZIndex(marker.zIndex)
        }
        if (marker.width && marker.height) {
          const icon = new BMapGL.Icon(marker.iconPath, new BMapGL.Size(marker.width, marker.height))
          markerObj.setIcon(icon)
        } else {
          const img = new Image()
          img.src = marker.iconPath
          img.style.opacity = String(marker.alpha)
          img.onload = () => {
            const iconSize = new BMapGL.Size(img.width, img.height)
            const icon = new BMapGL.Icon(img.src, iconSize)
            icon.imageOffset = new BMapGL.Size(0, 0, marker.alpha || 1)
            markerObj.setIcon(icon)
          }
        }
        const rotate = marker.rotate ? marker.rotate : 0
        if (rotate) {
          markerObj.setRotation(rotate)
        }
        if (marker.anchor) {
          const offsetX = (marker.anchor?.x ?? 0) * ((marker.width as number) || 0)
          const offsetY = (marker.anchor?.y ?? 0) * ((marker.height as number) || 0)
          markerObj.setOffset(new BMapGL.Size(offsetX, offsetY))
        }
        // 创建title
        if (!marker.callout && marker.title) {
          const hammer = new Hammer(this.mapRef) // 创建Hammer对象，绑定到地图容器
          hammer.on('tap', (e) => {
            // 使用tap事件替代click事件
            const touch = e.center
            const x = touch.x
            const y = touch.y
            // 假设阈值为 10，表示点击距离小于 10 个像素时认为是点击到了标记点
            const threshold = 15
            // 遍历标记点数组，计算触摸位置与每个标记点的距离
            this.markers.forEach((marker) => {
              // 通过class名获取地图容器
              const mapContainer = document.getElementsByClassName('bmap-container')[0]
              // 获取地图容器在屏幕上的偏移量
              const mapContainerRect = mapContainer.getBoundingClientRect()
              const mapOffsetX = mapContainerRect.left
              const mapOffsetY = mapContainerRect.top
              const point = new BMapGL.Point(marker.longitude, marker.latitude)
              const pixel = this.map.pointToPixel(point)
              const markerX = pixel.x + mapOffsetX
              const markerY = pixel.y + mapOffsetY
              // 计算触摸位置与标记点的距离
              const distance = Math.sqrt(Math.pow(x - markerX, 2) + Math.pow(y - markerY, 2))
              if (distance < threshold && marker.id === markerObj.id) {
                // 最近的标记点距离小于阈值，表示用户点击到了标记点
                const content = `<div style="text-align:center">${marker.title}</div>`
                const infoWindow = new BMapGL.InfoWindow(content)
                this.map.openInfoWindow(infoWindow, pt)
              }
            })
          })
        }
        if (marker.callout) {
          const offsetX = marker.callout?.anchorX ? marker.callout?.anchorX : 0 // 横向偏移量
          const offsetY = marker.callout?.anchorY ? marker.callout?.anchorY : 0 // 纵向偏移量
          // 创建气泡(callout)对象
          const callout = new BMapGL.InfoWindow(
            `<div style="background-color: ${marker.callout?.bgColor}; 
              border: ${marker.callout?.borderWidth}px solid ${marker.callout?.borderColor}; 
              padding: ${marker.callout?.padding}px;
              color:${marker.callout?.color};
              text-align:${marker.callout?.textAlign};
              border-radius:${marker.callout?.borderRadius}px";>
             <p style="font-size:${marker.callout?.fontSize}px">${marker.callout?.content || ''}</p>
             </div>`,
            {
              width: 200, // 气泡宽度
              height: 100, // 气泡高度
              offset: new BMapGL.Size(offsetX, offsetY), // 设置偏移量
            }
          )
          // 自定义属性存储气泡(callout)对象
          markerObj.callout = callout
          // 将气泡(callout)对象绑定到标记(marker)对象上
          this.map.addOverlay(markerObj)
          if (marker.callout?.display === 'ALWAYS') {
            markerObj.callout.disableCloseOnClick()
            this.map.openInfoWindow(markerObj.callout, pt)
          } else {
            const hammer = new Hammer(this.mapRef) // 创建Hammer对象，绑定到地图容器
            hammer.on('tap', (e) => {
              // 使用tap事件替代click事件
              const touch = e.center
              const x = touch.x
              const y = touch.y
              // 假设阈值为 10，表示点击距离小于 10 个像素时认为是点击到了标记点
              const threshold = 15
              // 遍历标记点数组，计算触摸位置与每个标记点的距离
              this.markers.forEach((marker) => {
                // 通过class名获取地图容器
                const mapContainer = document.getElementsByClassName('bmap-container')[0]
                // 获取地图容器在屏幕上的偏移量
                const mapContainerRect = mapContainer.getBoundingClientRect()
                const mapOffsetX = mapContainerRect.left
                const mapOffsetY = mapContainerRect.top
                const point = new BMapGL.Point(marker.longitude, marker.latitude)
                const pixel = this.map.pointToPixel(point)
                const markerX = pixel.x + mapOffsetX
                const markerY = pixel.y + mapOffsetY
                // 计算触摸位置与标记点的距离
                const distance = Math.sqrt(Math.pow(x - markerX, 2) + Math.pow(y - markerY, 2))
                if (distance < threshold && marker.id === markerObj.id) {
                  // 最近的标记点距离小于阈值，表示用户点击到了标记点
                  this.map.openInfoWindow(markerObj.callout, pt)
                } else {
                  markerObj.callout.enableCloseOnClick()
                  // 用户点击到了地图上的其他位置，不是标记点
                }
              })
            })
          }
        }

        // 判断是否有label属性
        if (marker.label) {
          const labelContent = marker.label.content || ''
          const labelOpts = {
            position: pt,
            offset: new BMapGL.Size(marker.label.anchorX || 0, marker.label.anchorY || 0),
          }
          const label = new BMapGL.Label(labelContent, labelOpts)
          const borderColor = marker.label.borderColor ? marker.label.borderColor : 'white'
          // 设置标签样式
          label.setStyle({
            color: marker.label.color,
            fontSize: marker.label.fontSize + 'px',
            borderWidth: marker.label.borderWidth + 'px',
            borderColor: borderColor,
            borderRadius: marker.label.borderRadius + 'px',
            background: marker.label.bgColor,
            padding: marker.label.padding + 'px',
          })
          markerObj.setLabel(label)
        }
        this.map.addOverlay(markerObj)
      } else {
        console.error('请检查marker经纬度和marker自定义图标路径和id值')
      }
    })
  }

  public loadMapScript (): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://api.map.baidu.com/getscript?v=3.0&type=webgl&ak=Mb1FLBD3gfnY6bup4v6zEWh6MXwsZ9eo'
      script.defer = true
      script.onload = () => resolve()
      script.onerror = reject
      script.type = 'text/javascript'
      document.head.appendChild(script)
    })
  }

  /* 获取当前地图中心的经纬度 */

  _getCenterLocation = (option) => {
    // 遍历当前的覆盖物，找到之前添加的中心点图标并删除它
    this.map.getOverlays().forEach((overlay) => {
      if (overlay instanceof BMapGL.Marker && overlay.isCenterMarker) {
        this.map.removeOverlay(overlay)
      }
    })
    // 创建自定义图标并设置图标位置
    option.iconPath = 'https://img0.baidu.com/it/u=2604176863,3349829508&fm=253&fmt=auto&app=138&f=PNG?w=243&h=243'
    const icon = new BMapGL.Icon(option.iconPath, new BMapGL.Size(20, 30))
    // 将经纬度从BD09转换为GCJ02
    const gcj02Point = coordtransform.bd09togcj02(this.longitude, this.latitude)
    const marker = new BMapGL.Marker(new BMapGL.Point(gcj02Point[0], gcj02Point[1]), { icon })
    marker.isCenterMarker = true // 标记该覆盖物是中心点图标
    // 添加新的图标
    this.map.addOverlay(marker)
    return gcj02Point
  }

  /* 设置定位点图标，支持网络路径、本地路径、代码包路径 */
  _setLocMarkerIcon = (option) => {
    // 创建自定义图标
    const icon = new BMapGL.Icon(option.iconPath, new BMapGL.Size(20, 30))

    // 创建定位点并设置图标
    const point = new BMapGL.Point(116.404, 39.915)
    const marker = new BMapGL.Marker(point, { icon })
    this.map.addOverlay(marker)
  }

  /* 平移marker，带动画 */
  _translateMarker = (option) => {
    const latitude = option.destination.latitude
    const longitude = option.destination.longitude
    const destinationPoint = new BMapGL.Point(longitude, latitude)
    // 获取所有覆盖物
    const overlays = this.map.getOverlays()
    // 查找指定 id 的 Marker 对象
    const targetMarker = overlays.find(
      (overlay: any) => overlay instanceof BMapGL.Marker && overlay.id === option.markerId
    )
    if (!targetMarker) {
      console.error(`Marker "${option.markerId}" not found.`)
      return
    }
    // 计算平移步长
    const startLngLat = targetMarker.getPosition()
    const step = {
      lng: (destinationPoint.lng - startLngLat.lng) / (option.duration / 16), // 每帧移动的经度增量
      lat: (destinationPoint.lat - startLngLat.lat) / (option.duration / 16), // 每帧移动的纬度增量
    }

    // 计算旋转角度的步长
    const startRotation = targetMarker.getRotation() // 获取起始旋转角度
    const targetRotation = option.rotate // 设置目标旋转角度
    const rotationStep = (targetRotation - startRotation) / (option.duration / 16)

    // 执行平移动画
    let currentLngLat = startLngLat
    let currentFrame = 0
    let currentRotation = startRotation

    const animationInterval = setInterval(() => {
      currentLngLat = new BMapGL.Point(currentLngLat.lng + step.lng, currentLngLat.lat + step.lat)
      targetMarker.setPosition(currentLngLat)
      // 如果moveWithRotate为true且autoRotate为true，则同时进行旋转
      if (option.moveWithRotate && option.autoRotate) {
        currentRotation += rotationStep
        targetMarker.setRotation(currentRotation)
      }
      currentFrame++
      if (currentFrame >= option.duration / 16) {
        clearInterval(animationInterval)
      }
    }, 16)
  }

  /* 缩放视野展示所有经纬度 */
  _includePoints = (option) => {
    const bPoints = option.points.map((point) => new BMapGL.Point(point.longitude, point.latitude))
    this.map.setViewport(bPoints)
  }

  /* 获取当前地图的视野范围 */
  _getRegion = () => {
    // 获取地图当前视野范围
    const bounds = this.map.getBounds()
    const sw = bounds.getSouthWest() // 西南角坐标
    const ne = bounds.getNorthEast() // 东北角坐标

    return {
      southwest: { lat: sw.lat, lng: sw.lng },
      northeast: { lat: ne.lat, lng: ne.lng },
    }
  }

  /* 获取当前地图的旋转角 */
  _getRotate = () => {
    // 获取地图当前旋转角度
    const rotation = this.rotate
    return rotation
  }

  /* 获取当前地图的倾斜角 */
  _getSkew = () => {
    const Skew = this.skew
    return Skew
  }

  /* 获取当前地图的缩放级别 */
  _getScale = () => {
    const Scale = this.scale
    return Scale
  }

  /* 设置地图中心点偏移，向后向下为增长 */
  _setCenterOffset = (option) => {
    // 解构获取偏移量参数
    const [x, y] = option.offset
    // 获取地图尺寸
    const mapSize = this.map.getSize()
    // 计算水平偏移量
    const offsetX = Math.max(0.25 * mapSize.width, Math.min(0.75 * mapSize.width, x * mapSize.width))
    // 计算垂直偏移量
    const offsetY = Math.max(0.25 * mapSize.height, Math.min(0.75 * mapSize.height, y * mapSize.height))
    // 创建像素坐标对象
    const pixel = new BMapGL.Pixel(offsetX, offsetY)
    // 将像素坐标转换为地理坐标
    const center = this.map.pixelToPoint(pixel)
    // 平移地图至指定中心点
    this.map.panTo(center)
  }

  /* 添加 marker */
  _addMarkers = (option) => {
    if (option.clear) {
      // 清除地图上所有marker
      this.map.clearOverlays(this.markers)
    }

    option.markers.forEach((marker) => {
      if (marker.latitude && marker.longitude && marker.iconPath) {
        const pt = new BMapGL.Point(marker.longitude, marker.latitude)
        const markerObj = new BMapGL.Marker(pt, { enableClicking: true })
        this.map.addOverlay(markerObj)
        markerObj.id = marker.id // 设置标记点的唯一标识符
        markerObj.alpha = marker.alpha
        if (marker.zIndex) {
          markerObj.setZIndex(marker.zIndex)
        }
        if (marker.width && marker.height && marker.iconPath) {
          const icon = new BMapGL.Icon(marker.iconPath, new BMapGL.Size(marker.width, marker.height))
          markerObj.setIcon(icon)
        } else if (marker.iconPath) {
          const img = new Image()
          img.src = marker.iconPath
          img.style.opacity = String(marker.alpha)
          img.onload = () => {
            const iconSize = new BMapGL.Size(img.width, img.height)
            const icon = new BMapGL.Icon(img.src, iconSize)
            icon.imageOffset = new BMapGL.Size(0, 0, marker.alpha || 1)
            markerObj.setIcon(icon)
          }
        } else {
          console.error('没有找到iconPath图片路径')
          return
        }
        const rotate = marker.rotate ? marker.rotate : 0
        if (rotate) {
          markerObj.setRotation(rotate)
        }
        if (marker.anchor) {
          const offsetX = (marker.anchor?.x ?? 0) * ((marker.width as number) || 0)
          const offsetY = (marker.anchor?.y ?? 0) * ((marker.height as number) || 0)
          markerObj.setOffset(new BMapGL.Size(offsetX, offsetY))
        }
        // 创建title
        if (!marker.callout && marker.title) {
          const hammer = new Hammer(this.mapRef) // 创建Hammer对象，绑定到地图容器
          hammer.on('tap', (e) => {
            // 使用tap事件替代click事件
            const touch = e.center
            const x = touch.x
            const y = touch.y
            // 假设阈值为 10，表示点击距离小于 10 个像素时认为是点击到了标记点
            const threshold = 15
            // 遍历标记点数组，计算触摸位置与每个标记点的距离
            option.markers.forEach((marker) => {
              // 通过class名获取地图容器
              const mapContainer = document.getElementsByClassName('bmap-container')[0]
              // 获取地图容器在屏幕上的偏移量
              const mapContainerRect = mapContainer.getBoundingClientRect()
              const mapOffsetX = mapContainerRect.left
              const mapOffsetY = mapContainerRect.top
              const point = new BMapGL.Point(marker.longitude, marker.latitude)
              const pixel = this.map.pointToPixel(point)
              const markerX = pixel.x + mapOffsetX
              const markerY = pixel.y + mapOffsetY
              // 计算触摸位置与标记点的距离
              const distance = Math.sqrt(Math.pow(x - markerX, 2) + Math.pow(y - markerY, 2))
              if (distance < threshold && marker.id === markerObj.id) {
                // 最近的标记点距离小于阈值，表示用户点击到了标记点
                const content = `<div style="text-align:center">${marker.title}</div>`
                const infoWindow = new BMapGL.InfoWindow(content)
                this.map.openInfoWindow(infoWindow, pt)
              }
            })
          })
        }
        if (marker.callout) {
          const offsetX = marker.callout?.anchorX ? marker.callout?.anchorX : 0 // 横向偏移量
          const offsetY = marker.callout?.anchorY ? marker.callout?.anchorY : 0 // 纵向偏移量
          // 创建气泡(callout)对象
          const callout = new BMapGL.InfoWindow(
            `<div style="background-color: ${marker.callout?.bgColor}; 
              border: ${marker.callout?.borderWidth}px solid ${marker.callout?.borderColor}; 
              padding: ${marker.callout?.padding}px;
              color:${marker.callout?.color};
              text-align:${marker.callout?.textAlign};
              border-radius:${marker.callout?.borderRadius}px";>
             <p style="font-size:${marker.callout?.fontSize}px">${marker.callout?.content || ''}</p>
             </div>`,
            {
              width: 200, // 气泡宽度
              height: 100, // 气泡高度
              offset: new BMapGL.Size(offsetX, offsetY), // 设置偏移量
            }
          )
          // 自定义属性存储气泡(callout)对象
          markerObj.callout = callout
          // 将气泡(callout)对象绑定到标记(marker)对象上
          this.map.addOverlay(markerObj)
          if (marker.callout?.display === 'ALWAYS') {
            markerObj.callout.disableCloseOnClick()
            this.map.openInfoWindow(markerObj.callout, pt)
          } else {
            const hammer = new Hammer(this.mapRef) // 创建Hammer对象，绑定到地图容器
            hammer.on('tap', (e) => {
              // 使用tap事件替代click事件
              const touch = e.center
              const x = touch.x
              const y = touch.y
              // 假设阈值为 10，表示点击距离小于 10 个像素时认为是点击到了标记点
              const threshold = 15
              // 遍历标记点数组，计算触摸位置与每个标记点的距离
              option.markers.forEach((marker) => {
                // 通过class名获取地图容器
                const mapContainer = document.getElementsByClassName('bmap-container')[0]
                // 获取地图容器在屏幕上的偏移量
                const mapContainerRect = mapContainer.getBoundingClientRect()
                const mapOffsetX = mapContainerRect.left
                const mapOffsetY = mapContainerRect.top
                const point = new BMapGL.Point(marker.longitude, marker.latitude)
                const pixel = this.map.pointToPixel(point)
                const markerX = pixel.x + mapOffsetX
                const markerY = pixel.y + mapOffsetY
                // 计算触摸位置与标记点的距离
                const distance = Math.sqrt(Math.pow(x - markerX, 2) + Math.pow(y - markerY, 2))
                if (distance < threshold && marker.id === markerObj.id) {
                  // 最近的标记点距离小于阈值，表示用户点击到了标记点
                  this.map.openInfoWindow(markerObj.callout, pt)
                } else {
                  markerObj.callout.enableCloseOnClick()
                  // 用户点击到了地图上的其他位置，不是标记点
                }
              })
            })
          }
        }

        // 判断是否有label属性
        if (marker.label) {
          const labelContent = marker.label.content || ''
          const labelOpts = {
            position: pt,
            offset: new BMapGL.Size(marker.label.anchorX || 0, marker.label.anchorY || 0),
          }
          const label = new BMapGL.Label(labelContent, labelOpts)
          // 设置标签样式
          label.setStyle({
            color: marker.label.color,
            fontSize: marker.label.fontSize + 'px',
            borderWidth: marker.label.borderWidth + 'px',
            borderColor: marker.label.borderColor,
            borderRadius: marker.label.borderRadius + 'px',
            background: marker.label.bgColor,
            padding: marker.label.padding + 'px',
          })
          markerObj.setLabel(label)
        }
      }
    })
  }

  /* 移除 marker */
  _removeMarkers = (option) => {
    // 获取所有覆盖物
    const overlays = this.map.getOverlays()
    option.markerIds.forEach((id) => {
      // 查找指定 id 的 Marker 对象
      const targetMarker = overlays.find(
        (overlay: any) => overlay instanceof BMapGL.Marker && String(overlay.id) === id
      )
      this.map.removeOverlay(targetMarker)
    })
  }

  /* 沿指定路径移动 marker，用于轨迹回放等场景。动画完成时触发回调事件，若动画进行中，对同一 marker 再次调用 moveAlong 方法，前一次的动画将被打断 */
  _moveAlong = (object) => {
    const path = object.path
    const duration = object.duration
    const autoRotate = object.autoRotate || true // 默认为 true
    const overlays = this.map.getOverlays()
    const targetMarker = overlays.find((overlay) => overlay instanceof BMapGL.Marker && overlay.id === object.markerId)

    if (!targetMarker) {
      console.error(`Marker "${object.markerId}" not found.`)
      return
    }

    const points = path.map((p) => new BMapGL.Point(p.longitude, p.latitude))
    const startTime = performance.now()

    const animate = (timestamp) => {
      const elapsedTime = timestamp - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      const currentPointIndex = Math.floor(progress * (points.length - 1))
      const nextPointIndex = Math.ceil(progress * (points.length - 1))

      const currentPoint = points[currentPointIndex]
      const nextPoint = points[nextPointIndex]

      // 确保当前路径点和下一个路径点索引不超出有效范围
      const validCurrentPoint = currentPoint || points[points.length - 1]
      const validNextPoint = nextPoint || points[points.length - 1]

      const deltaX = validNextPoint.lng - validCurrentPoint.lng
      const deltaY = validNextPoint.lat - validCurrentPoint.lat

      const markerPosition = new BMapGL.Point(
        validCurrentPoint.lng + deltaX * progress,
        validCurrentPoint.lat + deltaY * progress
      )

      targetMarker.setPosition(markerPosition)

      if (autoRotate) {
        const rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
        targetMarker.setRotation(rotation)
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  /* 创建自定义图片图层，图片会随着地图缩放而缩放 */
  _addGroundOverlay = (option) => {
    const { src, opacity, bounds, visible, id, zIndex } = option
    // 创建覆盖物边界对象
    const overlayBounds = new BMapGL.Bounds(
      new BMapGL.Point(bounds.southwest.longitude, bounds.southwest.latitude),
      new BMapGL.Point(bounds.northeast.longitude, bounds.northeast.latitude)
    )
    // 定义 GroundOverlay 类
    function GroundOverlay (bounds, imageUrl, map, visible, opacity, zIndex, id) {
      this._bounds = bounds
      this._imageUrl = imageUrl
      this._map = map
      this._visible = visible
      this._opacity = opacity
      this._zIndex = zIndex
      this._id = id
    }
    // 继承 BMapGL.Overlay
    GroundOverlay.prototype = new BMapGL.Overlay()
    // 初始化方法
    GroundOverlay.prototype.initialize = function (map) {
      // 移除已存在的元素
      if (document.getElementById(this._id)) {
        const element = document.getElementById(this._id)
        element?.remove()
      }

      this._map = map

      if (!this._div) {
        // 创建 div 元素并设置样式
        const div = document.createElement('div')
        div.id = this._id
        div.style.position = 'absolute'
        div.style.border = 'none'
        div.style.zIndex = this._zIndex

        // 创建 img 元素并设置样式
        const img = document.createElement('img')
        img.src = this._imageUrl
        // 确保opacity值在0到1之间
        const validOpacity = (this._opacity < 0 ) ? '1' : this._opacity
        img.style.opacity = validOpacity
        div.appendChild(img)
        this._div = div
      }

      // 监听地图缩放事件，调整覆盖物尺寸
      map.addEventListener('zoomend', () => {
        const swPixel = map.pointToOverlayPixel(this._bounds.getSouthWest())
        const nePixel = map.pointToOverlayPixel(this._bounds.getNorthEast())
        const width = nePixel.x - swPixel.x
        const height = swPixel.y - nePixel.y

        this._div.style.width = width + 'px'
        this._div.style.height = height + 'px'

        const img = this._div.querySelector('img')
        img.style.width = width + 'px'
        img.style.height = height + 'px'
      })

      // 将 div 元素添加到地图覆盖物层
      map.getPanes().labelPane.appendChild(this._div)

      return this._div
    }

    // 绘制方法
    GroundOverlay.prototype.draw = function () {
      // 设置 div 元素位置和尺寸
      const position = this._map.pointToOverlayPixel(this._bounds.getNorthEast())
      this._div.style.left = position.x + 'px'
      this._div.style.top = position.y + 'px'

      const bounds = this._map.getBounds()
      const sw = this._map.pointToPixel(bounds.getSouthWest())
      const ne = this._map.pointToPixel(bounds.getNorthEast())
      const width = ne.x - sw.x
      const height = ne.y - sw.y

      const zoom = this._map.getZoom()
      const imageWidth = width * Math.pow(2, 18 - zoom)
      const imageHeight = height * Math.pow(2, 18 - zoom)

      this._div.style.width = imageWidth + 'px'
      this._div.style.height = imageHeight + 'px'
      this._div.style.display = this._visible ? 'block' : 'none'
      const validOpacity = (this._opacity < 0 ) ? '1' : this._opacity
      this._div.getElementsByTagName('img')[0].style.opacity = validOpacity
    }

    // 创建 GroundOverlay 实例
    const overlay = new GroundOverlay(overlayBounds, src, this.map, visible, opacity, zIndex, id)

    this.map.addOverlay(overlay)
    // 对所有覆盖物进行排序
    const overlays = this.map.getOverlays().sort((a, b) => a._zIndex - b._zIndex)
    this.groundOverlay = overlay
    // 将所有覆盖物重新绘制
    overlays.forEach((overlay) => overlay.draw())
  }

  /* 更新自定义图片图层 */
  _updateGroundOverlay = (option) => {
    const { src, opacity, bounds, visible, id, zIndex } = option
    const targetBounds = new BMapGL.Bounds(
      new BMapGL.Point(bounds.southwest.longitude, bounds.southwest.latitude),
      new BMapGL.Point(bounds.northeast.longitude, bounds.northeast.latitude)
    )

    const zoom = this.map.getZoom()
    // 获取所有图层
    const overlays = this.map.getOverlays()

    // 找到要更新的图层
    const targetOverlay = overlays.find((overlay) => overlay._id === id)

    if (targetOverlay) {
      // 更新DOM元素
      const element = document.getElementById(id)
      if (element) {
        const imgElement = element.querySelector('img')
        if (imgElement) {
          // 找到了对应的元素
          const validOpacity = (opacity < 0 ) ? '1' : opacity
          element.style.opacity = validOpacity
          imgElement.style.display = visible ? 'block' : 'none'
          element.style.zIndex = zIndex

          // 加载图片
          const image = new Image()
          image.onload = () => {
            // 图片加载完成后执行
            imgElement.src = src // 设置图片的src

            // 根据当前缩放级别设置图片宽高
            const lngSpan = targetBounds.getNorthEast().lng - targetBounds.getSouthWest().lng
            const mapWidth = this.map.getSize().width // 获取地图容器的宽度
            const updatedImageWidth = (mapWidth / Math.pow(2, 18 - zoom)) * lngSpan
            const imageAspectRatio = image.naturalHeight / image.naturalWidth
            const updatedImageHeight = updatedImageWidth * imageAspectRatio

            imgElement.style.width = `${updatedImageWidth}px`
            imgElement.style.height = `${updatedImageHeight}px`

            // 重新绘制图层
            targetOverlay._bounds = targetBounds
            targetOverlay.draw()

            // 更新完图片后，立即重绘地图
            this.map.panTo(this.map.getCenter())
            targetOverlay.draw()
          }
          image.src = src
        } else {
          // 没有找到对应的元素
          console.error(`未找到id为${id}的元素`)
        }
      }
    }
  }

  /* 移除自定义图片图层 */
  _removeGroundOverlay = (option) => {
    // 获取所有图层
    const overlays = this.map.getOverlays()

    // 找到要更新的图层
    const targetOverlay = overlays.find((overlay) => overlay._id === option.id)

    if (targetOverlay) {
      // 如果找到了对应的图层，执行删除操作
      this.map.removeOverlay(targetOverlay)
    } else {
      console.error(`未找到id为${option.id}的自定义图片图层`)
    }
  }

  /* 限制地图的显示范围。此接口同时会限制地图的最小缩放整数级别。 */
  _setBoundary = (option) => {
    // 创建百度地图的边界对象
    const bounds = new BMapGL.Bounds(
      new BMapGL.Point(option.southwest.longitude, option.southwest.latitude),
      new BMapGL.Point(option.northeast.longitude, option.northeast.latitude)
    )

    // 将边界坐标从BD09转换成GCJ02
    const sw = coordtransform.bd09togcj02(option.southwest.longitude, option.southwest.latitude)
    const ne = coordtransform.bd09togcj02(option.northeast.longitude, option.northeast.latitude)
    // 创建新的边界对象
    const newBounds = new BMapGL.Bounds(new BMapGL.Point(sw[0], sw[1]), new BMapGL.Point(ne[0], ne[1]))
    this.map.setBounds(bounds)
    this.map.setViewport([
      new BMapGL.Point(newBounds.sw.lng, newBounds.sw.lat),
      new BMapGL.Point(newBounds.ne.lng, newBounds.ne.lat),
    ])
    this.map.setMinZoom(10) // 最小缩放级别
    this.map.setMaxZoom(18) // 最大缩放级别
  }

  render () {
    return (
      <Host>
        <div
          id = "mapContainer"
          ref = {(dom) => {
            if (dom) {
              this.mapRef = dom as HTMLDivElement
            }
          }}
          style = {{ height: '400px' }}
        ></div>
      </Host>
    )
  }
}
