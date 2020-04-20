declare namespace Taro {
  /**
   * 创建并返回 map 上下文 `mapContext` 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 `<map/>` 组件
   *
   * **mapContext：**
   *
   * `mapContext` 通过 mapId 跟一个 `<map/>` 组件绑定，通过它可以操作对应的 `<map/>` 组件。
   *
   * **示例代码：**
   *
   ```html
   <!-- map.wxml -->
   <map id="myMap" show-location />
         <button type="primary" bindtap="getCenterLocation">获取位置</button>
   <button type="primary" bindtap="moveToLocation">移动位置</button>
   <button type="primary" bindtap="translateMarker">移动标注</button>
   <button type="primary" bindtap="includePoints">缩放视野展示所有经纬度</button>
   ```
   *
   * **示例代码：**
   *
   ```javascript
   // map.js
   Page({
     onReady: function (e) {
       // 使用 Taro.createMapContext 获取 map 上下文
       this.mapCtx = Taro.createMapContext('myMap')
     },
     getCenterLocation: function () {
       this.mapCtx.getCenterLocation({
         success: function(res){
           console.log(res.longitude)
           console.log(res.latitude)
         }
       })
     },
     moveToLocation: function () {
       this.mapCtx.moveToLocation()
     },
     translateMarker: function() {
       this.mapCtx.translateMarker({
         markerId: 0,
         autoRotate: true,
         duration: 1000,
         destination: {
           latitude:23.10229,
           longitude:113.3345211,
         },
         animationEnd() {
           console.log('animation end')
         }
       })
     },
     includePoints: function() {
       this.mapCtx.includePoints({
         padding: [10],
         points: [{
           latitude:23.10229,
           longitude:113.3345211,
         }, {
           latitude:23.00229,
           longitude:113.3345211,
         }]
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/wx.createMapContext.html
   */
  function createMapContext(mapId: any, instance?: any): MapContext

  namespace MapContext {
    namespace getCenterLocation {
      type Param = {
        /**
         * 接口调用成功的回调函数 ，res = { longitude: "经度", latitude: "纬度"}
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数 ，res = { longitude: "经度", latitude: "纬度"}
       */
      type ParamPropSuccess = (res: { longitude: number; latitude: number }) => void
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace translateMarker {
      type Param = {
        /**
         * 指定marker
         */
        markerId: number
        /**
         * 指定marker移动到的目标点
         */
        destination: any
        /**
         * 移动过程中是否自动旋转marker
         */
        autoRotate: boolean
        /**
         * marker的旋转角度
         */
        rotate: number
        /**
         * 动画持续时长，默认值1000ms，平移与旋转分别计算
         */
        duration?: number
        /**
         * 动画结束回调函数
         */
        animationEnd?: ParamPropAnimationEnd
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
      }
      /**
       * 动画结束回调函数
       */
      type ParamPropAnimationEnd = () => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = () => any
    }
    namespace includePoints {
      type Param = {
        /**
         * 要显示在可视区域内的坐标点列表，[{latitude, longitude}]
         */
        points: any[]
        /**
         * 坐标点形成的矩形边缘到地图边缘的距离，单位像素。格式为[上,右,下,左]，安卓上只能识别数组第一项，上下左右的padding一致。开发者工具暂不支持padding参数。
         */
        padding?: any[]
      }
    }
    namespace getRegion {
      type Param = {
        /**
         * 接口调用成功的回调函数，res = {southwest, northeast}，西南角与东北角的经纬度
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数，res = {southwest, northeast}，西南角与东北角的经纬度
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace getScale {
      type Param = {
        /**
         * 接口调用成功的回调函数，res = {scale}
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数，res = {scale}
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
  }
  class MapContext {
    /**
     * 获取当前地图中心的经纬度，返回的是 gcj02 坐标系，可以用于 [`Taro.openLocation`](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html)
     */
    getCenterLocation(OBJECT: MapContext.getCenterLocation.Param): any
    /**
     * 将地图中心移动到当前定位点，需要配合map组件的show-location使用
     */
    moveToLocation(): void
    /**
     * 平移marker，带动画
     *
     * @since 1.2.0
     */
    translateMarker(OBJECT: MapContext.translateMarker.Param): any
    /**
     * 缩放视野展示所有经纬度
     *
     * @since 1.2.0
     */
    includePoints(OBJECT: MapContext.includePoints.Param): any
    /**
     * 获取当前地图的视野范围
     *
     * @since 1.4.0
     */
    getRegion(OBJECT: MapContext.getRegion.Param): any
    /**
     * 获取当前地图的缩放级别
     *
     * @since 1.4.0
     */
    getScale(OBJECT: MapContext.getScale.Param): any
  }
}
