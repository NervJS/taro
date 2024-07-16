import Taro from '@tarojs/api'
import { shouldBeObject } from 'src/api/apis/utils'
import { MethodHandler } from 'src/api/apis/utils/handler'

import { temporarilyNotSupport } from '../../utils'

export class HosMapContext implements Taro.MapContext {
  private nativeMapContextId: string

  constructor (mapId: string) {
    // @ts-ignore 若原生侧创建MapContext成功，则返回mapId字符串，否则返回undefined。
    this.nativeMapContextId = window.JSBridge && window.JSBridge.createMapContext(mapId)
  }

  getCenterLocation (option?: Taro.MapContext.GetCenterLocationOption): Promise<Taro.MapContext.GetCenterLocationSuccessCallbackResult> {
    return new Promise((resolve, reject) => {
      const name = 'getCenterLocation'
      const isValid = shouldBeObject(option).flag || typeof option === 'undefined'
      if (!isValid) {
        const res = { errMsg: `${name}:fail invalid params` }
        return reject(res)
      }
      const { success, fail, complete } = option || {}
      const handle = new MethodHandler({ name, success, fail, complete })
      if (this.nativeMapContextId === 'undefined') {
        const res = { errMsg: `${name}:fail native map controller was not found` }
        reject(res)
      } else {
        // @ts-ignore
        const result = window.JSBridge && window.JSBridge.callMapContextFunction(null,
          { instanceId: this.nativeMapContextId, callType: 'get', funcName: 'getCenterLocation' })
        if (typeof result === 'string') {
          handle.fail(JSON.parse(result), { resolve, reject })
        } else {
          handle.success(result, { resolve, reject })
        }
      }
    })
  }

  setLocMarkerIcon = temporarilyNotSupport('setLocMarkerIcon')

  moveToLocation (option: Taro.MapContext.MoveToLocationOption): Promise<TaroGeneral.CallbackResult> {
    return new Promise((resolve, reject) => {
      const name = 'moveToLocation'
      const isValid = shouldBeObject(option).flag
      if (!isValid) {
        const res = { errMsg: `${name}:fail invalid params` }
        return reject(res)
      }
      const { success, fail, complete, latitude, longitude } = option
      const handle = new MethodHandler({ name, success, fail, complete })
      if (this.nativeMapContextId === 'undefined') {
        const res = { errMsg: `${name}:fail native map controller was not found` }
        reject(res)
      } else {
        // @ts-ignore
        const result = window.JSBridge && window.JSBridge.callMapContextFunction({ latitude, longitude },
          { instanceId: this.nativeMapContextId, callType: 'get', funcName: 'moveToLocation' })
        if (typeof result === 'string') {
          handle.fail(JSON.parse(result), { resolve, reject })
        } else {
          handle.success({ errMsg: `${name}:ok` }, { resolve, reject })
        }
      }
    })
  }

  translateMarker = temporarilyNotSupport('translateMarker')

  moveAlong = temporarilyNotSupport('moveAlong')

  includePoints = temporarilyNotSupport('includePoints')

  getRegion (_option?: Taro.MapContext.GetRegionOption): Promise<Taro.MapContext.GetRegionSuccessCallbackResult> {
    return Promise.reject(new Error('暂不支持此方法'))
  }

  getRotate (_option?: Taro.MapContext.GetRotateOption): Promise<Taro.MapContext.GetRotateSuccessCallbackResult> {
    return Promise.reject(new Error('暂不支持此方法'))
  }

  getSkew (_option?: Taro.MapContext.GetSkewOption): Promise<Taro.MapContext.GetSkewSuccessCallbackResult> {
    return Promise.reject(new Error('暂不支持此方法'))
  }

  getScale (_option?: Taro.MapContext.GetScaleOption): Promise<Taro.MapContext.GetScaleSuccessCallbackResult> {
    return Promise.reject(new Error('暂不支持此方法'))
  }

  setCenterOffset = temporarilyNotSupport('setCenterOffset')

  removeCustomLayer = temporarilyNotSupport('removeCustomLayer')

  addCustomLayer = temporarilyNotSupport('addCustomLayer')

  addGroundOverlay = temporarilyNotSupport('addGroundOverlay')

  addVisualLayer = temporarilyNotSupport('addVisualLayer')

  removeVisualLayer = temporarilyNotSupport('removeVisualLayer')

  addArc = temporarilyNotSupport('addArc')

  removeArc = temporarilyNotSupport('removeArc')

  setBoundary = temporarilyNotSupport('setBoundary')

  updateGroundOverlay = temporarilyNotSupport('updateGroundOverlay')

  removeGroundOverlay = temporarilyNotSupport('removeGroundOverlay')

  toScreenLocation = temporarilyNotSupport('toScreenLocation')

  fromScreenLocation = temporarilyNotSupport('fromScreenLocation')

  openMapApp = temporarilyNotSupport('openMapApp')

  addMarkers = temporarilyNotSupport('addMarkers')

  removeMarkers = temporarilyNotSupport('removeMarkers')

  initMarkerCluster = temporarilyNotSupport('initMarkerCluster')

  on = temporarilyNotSupport('on')
}