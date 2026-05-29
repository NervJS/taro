import Taro from '../../index'

declare module '../../index' {
  namespace openLocation {
    interface Option {
      /** 纬度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系 */
      latitude: number
      /** 经度，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系 */
      longitude: number
      /** 缩放比例
       * @weapp 范围 5~18，默认值18
       * @alipay 范围 3~19，默认值15
       */
      scale?: number
      /** 位置名 */
      name?: string
      /** 地址的详细说明 */
      address?: string
      /** 定义在拉起的地图 App 面板中需要被屏蔽的地图类 App
       * @supported swan
       */
      ignoredApps?: Array<any>
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace getLocation {
    interface Option {
      /** 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
       * @default false
       */
      altitude?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 高精度定位超时时间(ms)，指定时间内返回最高精度，该值3000ms以上高精度定位才有效果 */
      highAccuracyExpireTime?: number
      /** 开启高精度定位
       * @default false
       */
      isHighAccuracy?: boolean
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** wgs84 返回 gps 坐标，gcj02 返回可用于 Taro.openLocation 的坐标
       * @default "wgs84"
       */
      type?: string
      /** 针对 iOS14/Android12 及以上的新特性，其他情况本参数忽略。默认情况宿主是精确定位就返回精确定位信息。
       * 传入 true 会强制使用精确定位信息，iOS14/Android12 及以上如果没有精确定位权限，会弹出精确定位授权弹框
       * @supported swan
       * @default false
       */
      needFullAccuracy?: boolean
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 位置的精确度 */
      accuracy: number
      /** 高度，单位 m */
      altitude: number
      /** 水平精度，单位 m */
      horizontalAccuracy: number
      /** 纬度，范围为 -90~90，负数表示南纬 */
      latitude: number
      /** 经度，范围为 -180~180，负数表示西经 */
      longitude: number
      /** 速度，单位 m/s */
      speed: number
      /** 垂直精度，单位 m（Android 无法获取，返回 0） */
      verticalAccuracy: number
      /** 城市名称
       * @supported swan
       */
      street?: string
      /** 国家代码
       * @supported swan
       */
      cityCode?: string
      /** 城市名称
       * @supported swan, tt
       */
      city?: string
      /** 国家
       * @supported swan
       */
      country?: string
      /** 国家代码
       * @supported swan
       */
      countryCode?: string
      /** 省份
       * @supported swan
       */
      province?: string
      /** 街道号码
       * @supported swan
       */
      streetNumber?: string
      /** 区
       * @supported swan
       */
      district?: string
      /** 是不是精确定位信息
       * @supported swan
       */
      isFullAccuracy?: boolean
      /** 调用结果 */
      errMsg: string
    }
  }

  namespace choosePoi {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 选择城市时，值为 1，选择精确位置时，值为 2 */
      type: number
      /** 城市名称 */
      city: number
      /** 位置名称 */
      name: string
      /** 详细地址 */
      address: string
      /** 纬度，浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系 */
      latitude: number
      /** 经度，浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系 */
      longitude: number
    }
  }

  namespace chooseLocation {
    interface Option {
      /** 目标地纬度 */
      latitude?: number
      /** 目标地经度 */
      longitude?: number
      /** 地图选点组件参数
       * @supported h5
       * @h5 仅支持 H5 使用
       * @see https://lbs.qq.com/webApi/component/componentGuide/componentPicker
       */
      mapOpts?: Record<string, unknown>
      /** 页面显示标题
       * @supported alipay
       * @alipay 安卓默认值为 位置，iOS、IDE 默认值为 你在哪里?
       * @see https://opendocs.alipay.com/mini/api/location?pathHash=951b46a1
       */
      title?: string
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 详细地址 */
      address: string
      /** 纬度，浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系 */
      latitude: number
      /** 经度，浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系 */
      longitude: number
      /** 位置名称 */
      name: string
      /** 区县代码
       * @supported alipay
       */
      adCode?: number
      /** 区县名称
       * @supported alipay
       */
      adName?: string
      /** 城市代码
       * @supported alipay
       */
      cityCode?: string
      /** 城市名称
       * @supported alipay
       */
      cityName?: string
      /** 省份代码
       * @supported alipay
       */
      provinceCode?: number
      /** 省份名称
       * @supported alipay
       */
      provinceName?: string
      /** 调用结果 */
      errMsg: string
    }
  }

  namespace stopLocationUpdate {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace startLocationUpdateBackground {
    interface Option {
      /** wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
       * @default "gcj02"
       */
      type?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace startLocationUpdate {
    interface Option {
      /** wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
       * @default "gcj02"
       */
      type?: string
      /** 针对 iOS14/Android12 及以上的新特性，其他情况本参数忽略。默认情况宿主是精确定位就返回精确定位信息。
       * 传入 true 会强制使用精确定位信息，iOS14/Android12 及以上如果没有精确定位权限，会弹出精确定位授权弹框
       * @supported swan
       * @default false
       */
      needFullAccuracy?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace onLocationChangeError {
    /** 监听持续定位接口返回失败时触发的回调函数 */
    type Callback = (
      result: CallbackResult,
    ) => void

    interface CallbackResult {
      /** 错误码 */
      errCode: number
      /** 错误信息
       * @supported tt
       * @tt 最低支持版本 2.48.0
       */
      errMsg?: string
    }
  }

  namespace onLocationChange {
    /** 实时地理位置变化事件的回调函数 */
    type Callback = (
      result: CallbackResult,
    ) => void

    interface CallbackResult {
      /** 位置的精确度 */
      accuracy: number
      /** 高度，单位 m */
      altitude: number
      /** 水平精度，单位 m */
      horizontalAccuracy: number
      /** 纬度，范围为 -90~90，负数表示南纬 */
      latitude: number
      /** 经度，范围为 -180~180，负数表示西经 */
      longitude: number
      /** 速度，单位 m/s */
      speed: number
      /** 垂直精度，单位 m（Android 无法获取，返回 0） */
      verticalAccuracy: number
      /** 街道名称
       * @supported swan
       */
      street?: string
      /** 城市编码
       * @supported swan
       */
      cityCode?: string
      /** 城市名称
       * @supported swan, tt
       * @tt iOS 不支持
       */
      city?: string
      /** 国家
       * @supported swan
       */
      country?: string
      /** 国家代码
       * @supported swan
       */
      countryCode?: string
      /** 省份
       * @supported swan
       */
      province?: string
      /** 街道号码
       * @supported swan
       */
      streetNumber?: string
      /** 区
       * @supported swan
       */
      district?: string
      /** 是不是精确定位信息
       * @supported swan
       */
      isFullAccuracy?: boolean
    }
  }

  namespace getFuzzyLocation {
    interface Option {
      /** wgs84 返回 gps 坐标，gcj02 返回可用于 Taro.openLocation 的坐标 */
      type?: keyof Type
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface Type {
      /** 返回 gps 坐标 */
      wgs84
      /** 返回 gcj02 坐标*/
      gcj02
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 纬度，范围为 -90~90，负数表示南纬 */
      latitude: number
      /** 经度，范围为 -180~180，负数表示西经 */
      longitude: number
    }
  }

  interface TaroStatic {
    /** 关闭监听实时位置变化，前后台都停止消息接收
     * @supported weapp, swan, tt, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.stopLocationUpdate.html
     */
    stopLocationUpdate(option?: stopLocationUpdate.Option): void

    /** 开启小程序进入前后台时均接收位置消息，需引导用户开启[授权](../open-api/authorize/authorize.md#后台定位)。授权以后，小程序在运行中或进入后台均可接受位置消息变化。
     *
     * **注意**
     * - 安卓微信7.0.6版本，iOS 7.0.5版本起支持该接口
     * - 需在app.json中配置requiredBackgroundModes: ['location']后使用
     * - 获取位置信息需配置[地理位置用途说明](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#permission)。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.startLocationUpdateBackground.html
     */
    startLocationUpdateBackground(
      option?: startLocationUpdateBackground.Option,
    ): void

    /** 开启小程序进入前台时接收位置消息
     *
     * **注意**
     * - 获取位置信息需配置[地理位置用途说明](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#permission)。
     * @supported weapp, swan, tt, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.startLocationUpdate.html
     */
    startLocationUpdate(option?: startLocationUpdate.Option): void

    /** 使用微信内置地图查看位置
     * @supported weapp, alipay, swan, jd, tt, h5, harmony_hybrid
     * @example
     * ```tsx
     * Taro.getLocation({
     *  type: 'gcj02', //返回可以用于 Taro.openLocation的经纬度
     *  success: function (res) {
     *    const latitude = res.latitude
     *    const longitude = res.longitude
     *    Taro.openLocation({
     *      latitude,
     *      longitude,
     *      scale: 18
     *    })
     *  }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html
     */
    openLocation(option: openLocation.Option): Promise<TaroGeneral.CallbackResult>

    /** 监听持续定位接口返回失败时触发
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.onLocationChangeError.html
     */
    onLocationChangeError(
      /** 监听持续定位接口返回失败时触发的回调函数 */
      callback: onLocationChangeError.Callback,
    ): void

    /** 监听实时地理位置变化事件，需结合 Taro.startLocationUpdateBackground、Taro.startLocationUpdate 使用。
     * @supported weapp, swan, tt, rn
     * @example
     * ```tsx
     * const _locationChangeFn = function (res) {
     *  console.log('location change', res)
     * }
     * Taro.onLocationChange(_locationChangeFn)
     * Taro.offLocationChange(_locationChangeFn)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.onLocationChange.html
     */
    onLocationChange(
      /** 实时地理位置变化事件的回调函数 */
      callback: onLocationChange.Callback,
    ): void

    /** 取消监听持续定位接口返回失败时触发
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.offLocationChangeError.html
     */
    offLocationChangeError(
      /** 监听持续定位接口返回失败时触发的回调函数 */
      callback?: onLocationChangeError.Callback,
    ): void

    /** 取消监听实时地理位置变化事件
     * @supported weapp, swan, tt, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.offLocationChange.html
     */
    offLocationChange(
      /** 实时地理位置变化事件的回调函数 */
      callback?: onLocationChange.Callback,
    ): void

    /** 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用。开启高精度定位，接口耗时会增加，可指定 highAccuracyExpireTime 作为超时时间。
     *
     * **注意**
     * - 工具中定位模拟使用IP定位，可能会有一定误差。且工具目前仅支持 gcj02 坐标。
     * - 使用第三方服务进行逆地址解析时，请确认第三方服务默认的坐标系，正确进行坐标转换。
     * @supported weapp, swan, jd, qq, tt, rn, harmony_hybrid, harmony
     * @example
     *  ```tsx
     * Taro.getLocation({
     *  type: 'wgs84',
     *  success: function (res) {
     *    const latitude = res.latitude
     *    const longitude = res.longitude
     *    const speed = res.speed
     *    const accuracy = res.accuracy
     *  }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html
     */
    getLocation(option: getLocation.Option): Promise<getLocation.SuccessCallbackResult>

    /** 打开POI列表选择位置，支持模糊定位（精确到市）和精确定位混选。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.choosePoi.html
     */
    choosePoi(option: choosePoi.Option): Promise<choosePoi.SuccessCallbackResult>

    /** 打开地图选择位置。
     *
     * `chooseLocation` api功能是依赖于腾讯位置服务，所以需要使用 api 密钥。如果您没有，可以前往腾讯位置服务[开发者控制台](https://lbs.qq.com/console/mykey.html?console=mykey)进行申请。
     * @supported weapp, alipay, swan, jd, tt, h5, harmony_hybrid
     * @example
     * ```tsx
     * // config/index.js
     *
     * // 获得 api 密钥后，您需要将它填入项目的常量配置`defineConstants.LOCATION_APIKEY`中：
     * const config = {
     *   defineConstants: {
     *     LOCATION_APIKEY: JSON.stringify('XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX')
     *   },
     *   // ...
     * }
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html
     */
    chooseLocation(option: chooseLocation.Option): Promise<chooseLocation.SuccessCallbackResult>

    /** 获取当前的模糊地理位置
     * @supported weapp, harmony_hybrid
     * @example
     * ```tsx
     * Taro.getFuzzyLocation({
     *   type: 'wgs84',
     *   success (res) {
     *     const latitude = res.latitude
     *     const longitude = res.longitude
     *   },
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getFuzzyLocation.html
     */
    getFuzzyLocation(option: getFuzzyLocation.Option): Promise<getFuzzyLocation.SuccessCallbackResult>
  }
}
