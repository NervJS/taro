const globalAny:any = global;

globalAny._taroMapMap = {}

class MapContext {
  private mapRef

  constructor (mapRef) {
    this.mapRef = mapRef
  }

  /**
   * 获取当前地图中心的经纬度。返回的是 gcj02 坐标系，可以用于 wx.openLocation()
   */
  getCenterLocation(){

  }

  /**
   * 获取当前地图的视野范围
   * @param opts
   */
  getRegion(opts){

  }

  /**
   * 获取当前地图的缩放级别
   */
  getScale(){

  }

  /**
   * 缩放视野展示所有经纬度
   */
  includePoints(){

  }

  /**
   * 将地图中心移动到当前定位点。需要配合map组件的show-location使用
   */
  moveToLocation(){

  }

  /**
   * 平移marker，带动画
   */
  translateMarker(){

  }

}

/**
 * 创建 map 上下文 MapContext 对象。
 * {string} @param - id map 组件的 id
 * {object} @param t - 在自定义组件下，当前组件实例的this，以操作组件内 map 组件
 */
export function createMapContext (id: string, t: object) {
  const ref = globalAny._taroMapMap[id]
  if (ref) {
    return new MapContext(ref)
  } else {
    return undefined
  }
}
