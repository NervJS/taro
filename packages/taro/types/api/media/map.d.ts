import { MapProps } from '@tarojs/components';
import Taro from '../../index'

declare module '../../index' {
  /** `MapContext` 实例，可通过 [Taro.createMapContext](./createMapContext) 获取。
   * `MapContext` 通过 id 跟一个 map 组件绑定，操作对应的 map 组件。
   * @supported weapp, tt
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.html
   */
  interface MapContext {
    /** 获取当前地图中心的经纬度。返回的是 gcj02 坐标系，可以用于 [Taro.openLocation()](/docs/apis/location/openLocation)
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getCenterLocation.html
     */
    getCenterLocation(option?: MapContext.GetCenterLocationOption): Promise<MapContext.GetCenterLocationSuccessCallbackResult>

    /** 设置定位点图标，支持网络路径、本地路径、代码包路径
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.setLocMarkerIcon.html
     */
    setLocMarkerIcon(option?: MapContext.SetLocMarkerIconOption): Promise<TaroGeneral.CallbackResult>

    /** 将地图中心移置当前定位点，此时需设置地图组件 show-location 为true。
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.moveToLocation.html
     */
    moveToLocation(option: MapContext.MoveToLocationOption): Promise<TaroGeneral.CallbackResult>

    /** 平移marker，带动画
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.translateMarker.html
     */
    translateMarker(option: MapContext.TranslateMarkerOption): Promise<TaroGeneral.CallbackResult>

    /** 沿指定路径移动 marker，用于轨迹回放等场景。动画完成时触发回调事件，若动画进行中，对同一 marker 再次调用 moveAlong 方法，前一次的动画将被打断。 */
    moveAlong(object)

    /** 缩放视野展示所有经纬度
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.includePoints.html
     */
    includePoints(option: MapContext.IncludePointsOption): Promise<TaroGeneral.CallbackResult>

    /** 获取当前地图的视野范围
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getRegion.html
     */
    getRegion(option?: MapContext.GetRegionOption): Promise<MapContext.GetRegionSuccessCallbackResult>

    /** 获取当前地图的旋转角
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getRotate.html
     */
    getRotate(option?: MapContext.GetRotateOption): Promise<MapContext.GetRotateSuccessCallbackResult>

    /** 获取当前地图的倾斜角
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getSkew.html
     */
    getSkew(option?: MapContext.GetSkewOption): Promise<MapContext.GetSkewSuccessCallbackResult>

    /** 获取当前地图的缩放级别
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getScale.html
     */
    getScale(option?: MapContext.GetScaleOption): Promise<MapContext.GetScaleSuccessCallbackResult>

    /** 设置地图中心点偏移，向后向下为增长，屏幕比例范围(0.25~0.75)，默认偏移为[0.5, 0.5]
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.setCenterOffset.html
     */
    setCenterOffset(option: MapContext.SetCenterOffsetOption): Promise<TaroGeneral.CallbackResult>

    /** 移除个性化图层。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.removeCustomLayer.html
     */
    removeCustomLayer(option: MapContext.RemoveCustomLayerOption): Promise<TaroGeneral.CallbackResult>

    /** 添加个性化图层。图层创建参考文档
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.addCustomLayer.html
     */
    addCustomLayer(option: MapContext.AddCustomLayerOption): Promise<TaroGeneral.CallbackResult>

    /** 创建自定义图片图层，图片会随着地图缩放而缩放。
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.addGroundOverlay.html
     */
    addGroundOverlay(option: MapContext.AddGroundLayerOption): Promise<TaroGeneral.CallbackResult>

    /** 添加可视化图层。需要刷新时，interval 可设置的最小值为 15 s。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.addVisualLayer.html
     */
    addVisualLayer(option: MapContext.AddVisualLayerOption): Promise<TaroGeneral.CallbackResult>

    /** 移除可视化图层。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.removeVisualLayer.html
     */
    removeVisualLayer(option: MapContext.RemoveVisualLayerOption): Promise<TaroGeneral.CallbackResult>

    /** 添加弧线，途经点与夹角必须设置一个。途经点必须在起终点有效坐标范围内，否则不能生成正确的弧线，同时设置夹角角度时，以夹角角度为准。夹角定义为起点到终点，与起点外切线逆时针旋转的角度。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.addArc.html
     */
    addArc(option: MapContext.AddArcOption): Promise<TaroGeneral.CallbackResult>

    /** 删除弧线。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.removeArc.html
     */
    removeArc(option: MapContext.RemoveArcOption): Promise<TaroGeneral.CallbackResult>

    /** 限制地图的显示范围。此接口同时会限制地图的最小缩放整数级别。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.setBoundary.html
     */
    setBoundary(option: MapContext.SetBoundaryOption): Promise<TaroGeneral.CallbackResult>

    /** 更新自定义图片图层。
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.updateGroundOverlay.html
     */
    updateGroundOverlay(option: MapContext.UpdateGroundOverlayOption): Promise<TaroGeneral.CallbackResult>

    /** 移除自定义图片图层。
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.removeGroundOverlay.html
     */
    removeGroundOverlay(option: MapContext.RemoveGroundOverlayOption): Promise<TaroGeneral.CallbackResult>

    /** 获取经纬度对应的屏幕坐标，坐标原点为地图左上角。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.toScreenLocation.html
     */
    toScreenLocation(option: MapContext.ToScreenLocationOption): Promise<TaroGeneral.CallbackResult>

    /** 获取屏幕上的点对应的经纬度，坐标原点为地图左上角。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.fromScreenLocation.html
     */
    fromScreenLocation(option: MapContext.FromScreenLocationOption): Promise<TaroGeneral.CallbackResult>

    /** 拉起地图APP选择导航。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.openMapApp.html
     */
    openMapApp(option: MapContext.OpenMapAppOption): Promise<TaroGeneral.CallbackResult>

    /** 添加 marker。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.addMarkers.html
     */
    addMarkers(option: MapContext.AddMarkersOption): Promise<TaroGeneral.CallbackResult>

    /** 移除 marker。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.removeMarkers.html
     */
    removeMarkers(option: MapContext.RemoveMarkersOption): Promise<TaroGeneral.CallbackResult>

    /** 初始化点聚合的配置，未调用时采用默认配置。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.initMarkerCluster.html
     */
    initMarkerCluster(option?: MapContext.InitMarkerClusterOption): Promise<TaroGeneral.CallbackResult>

    /** 监听地图事件。
     * @supported weapp
     * @example
     * ```tsx
     * MapContext.on('markerClusterCreate', (res) => {})
     * MapContext.on('markerClusterClick', (res) => {})
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.on.html
     */
    on(
      /** 事件名 */
      event: keyof MapContext.MapEvent,
      /** 事件的回调函数 */
      callback: (res: MapContext.MapEvent[keyof MapContext.MapEvent]) => void
    ): void
  }
  namespace MapContext {
    interface GetCenterLocationOption {
      /** 图标路径，支持网络路径、本地路径、代码包路径 */
      iconPath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (
        result: GetCenterLocationSuccessCallbackResult,
      ) => void
    }
    interface GetCenterLocationSuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 纬度 */
      latitude: number
      /** 经度 */
      longitude: number
      /** 调用结果 */
      errMsg: string
    }
    interface SetLocMarkerIconOption {
      /** 图标路径，支持网络路径、本地路径、代码包路径 */
      iconPath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface GetRegionOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (
        result: GetRegionSuccessCallbackResult,
      ) => void
    }
    interface GetRegionSuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 东北角经纬度 */
      northeast: MapPosition
      /** 西南角经纬度 */
      southwest: MapPosition
    }
    interface GetRotateOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (
        result: GetRotateSuccessCallbackResult,
      ) => void
    }
    interface GetRotateSuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 旋转角 */
      rotate: number
      /** 调用结果 */
      errMsg: string
    }
    interface GetScaleOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (
        result: GetScaleSuccessCallbackResult,
      ) => void
    }
    interface GetScaleSuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 缩放值 */
      scale: number
      /** 调用结果 */
      errMsg: string
    }
    interface GetSkewOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: GetSkewSuccessCallbackResult) => void
    }
    interface GetSkewSuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 倾斜角 */
      skew: number
      /** 调用结果 */
      errMsg: string
    }
    interface IncludePointsOption {
      /** 要显示在可视区域内的坐标点列表 */
      points: MapPosition[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 坐标点形成的矩形边缘到地图边缘的距离，单位像素。格式为[上,右,下,左]，安卓上只能识别数组第一项，上下左右的padding一致。开发者工具暂不支持padding参数。 */
      padding?: number[]
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    /** 坐标点 */
    interface MapPosition {
      /** 纬度 */
      latitude: number
      /** 经度 */
      longitude: number
    }
    /** 经纬度范围 */
    interface MapBoundary {
      /** 西南角经纬度 */
      southwest: MapPosition
      /** 东北角经纬度 */
      northeast: MapPosition
    }
    interface MoveToLocationOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 纬度 */
      latitude?: number
      /** 经度 */
      longitude?: number
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface TranslateMarkerOption {
      /** 移动过程中是否自动旋转 marker */
      autoRotate: boolean
      /** 指定 marker 移动到的目标点 */
      destination: MapPosition
      /** 指定 marker */
      markerId: number
      /** marker 的旋转角度 */
      rotate: number
      /** 平移和旋转同时进行 */
      moveWithRotate:boolean
      /** 动画结束回调函数 */
      animationEnd?: (...args: any[]) => any
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 动画持续时长，平移与旋转分别计算 */
      duration?: number
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface SetCenterOffsetOption {
      /** 偏移量，两位数组 */
      offset: number[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface RemoveCustomLayerOption {
      /** 个性化图层id */
      layerId: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface AddCustomLayerOption {
      /** 个性化图层id */
      layerId: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface AddGroundLayerOption {
      /** 图片图层 id */
      id: number
      /** 图片路径，支持网络图片、临时路径、代码包路径 */
      src: string
      /** 图片覆盖的经纬度范围 */
      bounds: MapBoundary
      /** 是否可见
       * @default true
       */
      visible?: boolean
      /** 图层绘制顺序
       * @default 1
       */
      zIndex?: number
      /** 图层透明度
       * @default 1
       */
      opacity?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface AddVisualLayerOption {
      /** 个性化图层id（[创建图层指引](https://lbs.qq.com/dev/console/layers/layerEdit)) */
      layerId: number
      /** 刷新周期，单位秒
       * @default 0
       */
      interval?: number
      /** 图层绘制顺序
       * @default 1
       */
      zIndex?: number
      /** 图层透明度
       * @default 1
       */
      opacity?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface RemoveVisualLayerOption {
      /** 可视化图层 id */
      layerId: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface AddArcOption {
      /** 圆弧 id */
      id: number
      /** 起始点 */
      start: MapPosition
      /** 终点 */
      end: MapPosition
      /** 途经点 */
      pass?: MapPosition
      /** 夹角角度
       * @default 0
       */
      angle?: number
      /** 线宽
       * @default 5
       */
      width?: number
      /** 线的颜色
       * @default "#000000"
       */
      color?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface RemoveArcOption {
      /** 圆弧 id */
      id: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface SetBoundaryOption {
      /** 西南角经纬度 */
      southwest: MapPosition
      /** 东北角经纬度 */
      northeast: MapPosition
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface UpdateGroundOverlayOption {
      /** 图片图层 id */
      id: number
      /** 图片路径，支持网络图片、临时路径、代码包路径 */
      src: string
      /** 图片覆盖的经纬度范围 */
      bounds: MapBoundary
      /** 是否可见
       * @default true
       */
      visible?: boolean
      /** 图层绘制顺序
       * @default 1
       */
      zIndex?: number
      /** 图层透明度
       * @default 1
       */
      opacity?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface RemoveGroundOverlayOption {
      /** 图片图层 id */
      id: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface ToScreenLocationOption {
      /** 纬度 */
      latitude: number
      /** 经度 */
      longitude: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface FromScreenLocationOption {
      /** x 坐标值 */
      x: number
      /** y 坐标值 */
      y: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface OpenMapAppOption {
      /** 目的地经度 */
      longitude: number
      /** 目的地纬度 */
      latitude: number
      /** 目的地名称 */
      destination: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface AddMarkersOption {
      /** 同传入 map 组件的 marker 属性 */
      markers: MapProps.marker[]
      /** 是否先清空地图上所有 marker
       * @default false
       */
      clear?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface RemoveMarkersOption {
      /** marker 的 id 集合。 */
      markerIds: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface InitMarkerClusterOption {
      /** 启用默认的聚合样式
       * @default true
       */
      enableDefaultStyle?: boolean
      /** 点击已经聚合的标记点时是否实现聚合分离
       * @default true
       */
      zoomOnClick?: boolean
      /** 聚合算法的可聚合距离，即距离小于该值的点会聚合至一起，以像素为单位
       * @default 60
       */
      gridSize?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    /** event 的合法值 */
    interface MapEvent {
      /** 缩放或拖动导致新的聚合簇产生时触发，仅返回新创建的聚合簇信息 */
      markerClusterCreate: MapEventMarkerClusterCreate
      /** 聚合簇的点击事件 */
      markerClusterClick: MapEventMarkerClusterClick
    }
    interface MapEventMarkerClusterCreate {
      /** 聚合簇数据 */
      clusters: ClusterInfo[]
    }
    interface MapEventMarkerClusterClick {
      /** 聚合簇 */
      cluster: ClusterInfo
    }
    interface ClusterInfo {
      /** 聚合簇的 id */
      clusterId: number
      /** 聚合簇的坐标 */
      center: LatLng
      /** 该聚合簇内的点标记数据数组 */
      markerIds: string[]
    }
    interface LatLng {
      /** 纬度值 */
      lat: number
      /** 经度值 */
      lng: number
    }
  }

  interface TaroStatic {
    /** 创建 [map](/docs/components/maps/map) 上下文 [MapContext](/docs/apis/media/map/MapContext) 对象。
     * @supported weapp, tt
     * @example
     * ```tsx
     * const mapCtx = Taro.createMapContext('myMap')
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/wx.createMapContext.html
     */
    createMapContext(
      /** Map 组件的 id */
      mapId: string,
      /** 在自定义组件下，当前组件实例的this，以操作组件内 Map 组件 */
      component?: TaroGeneral.IAnyObject,
    ): MapContext
  }
}
