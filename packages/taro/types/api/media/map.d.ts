declare namespace Taro {
  /**
   * 创建 [map](https://developers.weixin.qq.com/miniprogram/dev/component/map.html) 上下文 [MapContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.html) 对象。
   * @supported weapp
   * @example
   * ```tsx
   * const mapCtx = Taro.createMapContext('myMap')
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/wx.createMapContext.html
   */
  function createMapContext(
    /** Map 组件的 id */
    mapId: string,
    /** 在自定义组件下，当前组件实例的this，以操作组件内 Map 组件 */
    component?: General.IAnyObject,
  ): MapContext

  /** `MapContext` 实例，可通过 Taro.createMapContext 获取。
   * `MapContext` 通过 id 跟一个 map 组件绑定，操作对应的 map 组件。
   */
  interface MapContext {
    /** 获取当前地图中心的经纬度。返回的是 gcj02 坐标系，可以用于 [wx.openLocation()](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html)
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getCenterLocation.html
     */
    getCenterLocation(option?: MapContext.GetCenterLocationOption): void
    /** 获取当前地图的视野范围
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getRegion.html
     */
    getRegion(option?: MapContext.GetRegionOption): void
    /** 获取当前地图的旋转角
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getRotate.html
     */
    getRotate(option?: MapContext.GetRotateOption): void
    /** 获取当前地图的缩放级别
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getScale.html
     */
    getScale(option?: MapContext.GetScaleOption): void
    /** 获取当前地图的倾斜角
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.getSkew.html
     */
    getSkew(option?: MapContext.GetSkewOption): void
    /** 缩放视野展示所有经纬度
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.includePoints.html
     */
    includePoints(option: MapContext.IncludePointsOption): void
    /** 将地图中心移置当前定位点，此时需设置地图组件 show-location 为true。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.moveToLocation.html
     */
    moveToLocation(option: MapContext.MoveToLocationOption): void
    /** 平移marker，带动画
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.translateMarker.html
     */
    translateMarker(option: MapContext.TranslateMarkerOption): void
  }
  namespace MapContext {
    interface GetCenterLocationOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: GetCenterLocationSuccessCallback
    }
    /** 接口调用成功的回调函数 */
    type GetCenterLocationSuccessCallback = (
      result: GetCenterLocationSuccessCallbackResult,
    ) => void
    interface GetCenterLocationSuccessCallbackResult extends General.CallbackResult {
      /** 纬度 */
      latitude: number
      /** 经度 */
      longitude: number
      /** 调用结果 */
      errMsg: string
    }
    interface GetRegionOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: GetRegionSuccessCallback
    }
    /** 接口调用成功的回调函数 */
    type GetRegionSuccessCallback = (
      result: GetRegionSuccessCallbackResult,
    ) => void
    interface GetRegionSuccessCallbackResult extends General.CallbackResult {
      /** 东北角经纬度 */
      northeast: number
      /** 西南角经纬度 */
      southwest: number
      /** 调用结果 */
      errMsg: string
    }
    interface GetRotateOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: GetRotateSuccessCallback
    }
    /** 接口调用成功的回调函数 */
    type GetRotateSuccessCallback = (
      result: GetRotateSuccessCallbackResult,
    ) => void
    interface GetRotateSuccessCallbackResult extends General.CallbackResult {
      /** 旋转角 */
      rotate: number
      /** 调用结果 */
      errMsg: string
    }
    interface GetScaleOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: GetScaleSuccessCallback
    }
    /** 接口调用成功的回调函数 */
    type GetScaleSuccessCallback = (
      result: GetScaleSuccessCallbackResult,
    ) => void
    interface GetScaleSuccessCallbackResult extends General.CallbackResult {
      /** 缩放值 */
      scale: number
      /** 调用结果 */
      errMsg: string
    }
    interface GetSkewOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: GetSkewSuccessCallback
    }
    /** 接口调用成功的回调函数 */
    type GetSkewSuccessCallback = (result: GetSkewSuccessCallbackResult) => void
    interface GetSkewSuccessCallbackResult extends General.CallbackResult {
      /** 倾斜角 */
      skew: number
      /** 调用结果 */
      errMsg: string
    }
    interface IncludePointsOption {
      /** 要显示在可视区域内的坐标点列表 */
      points: MapPostion[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 坐标点形成的矩形边缘到地图边缘的距离，单位像素。格式为[上,右,下,左]，安卓上只能识别数组第一项，上下左右的padding一致。开发者工具暂不支持padding参数。 */
      padding?: number[]
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    /** 要显示在可视区域内的坐标点列表 */
    interface MapPostion {
      /** 纬度 */
      latitude: number
      /** 经度 */
      longitude: number
    }
    interface MoveToLocationOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 纬度 */
      latitude?: number
      /** 经度 */
      longitude?: number
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface TranslateMarkerOption {
      /** 移动过程中是否自动旋转 marker */
      autoRotate: boolean
      /** 指定 marker 移动到的目标点 */
      destination: DestinationOption
      /** 指定 marker */
      markerId: number
      /** marker 的旋转角度 */
      rotate: number
      /** 动画结束回调函数 */
      animationEnd?: (...args: any[]) => any
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 动画持续时长，平移与旋转分别计算 */
      duration?: number
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }    /** 指定 marker 移动到的目标点 */
    interface DestinationOption {
      /** 纬度 */
      latitude: number
      /** 经度 */
      longitude: number
    }
  }
}
