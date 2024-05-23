import Taro from '@tarojs/api'
import queryString from 'query-string'

import native from '../NativeApi'
import { shouldBeObject } from '../utils'
import { MethodHandler } from '../utils/handler'

let container: HTMLDivElement | null = null
function createLocationChooser (handler, mapOpt: Taro.chooseLocation.Option['mapOpts'] = {}) {
  // @ts-ignore
  const systemBarHeight = window.systemBarHeight ? window.systemBarHeight : 0
  const { key = LOCATION_APIKEY, referer = 'myapp', ...opts } = mapOpt
  const query = {
    key,
    type: 1,
    referer,
    ...opts,
  }
  if (!container) {
    const html = `
<div class='taro_choose_location'>
  <div style='height:${systemBarHeight}px; width:100%; background-color:transparent;'></div>
  <div class='taro_choose_location_bar'>
    <div class='taro_choose_location_back'></div>
    <p class='taro_choose_location_title'>位置</p>
    <button class='taro_choose_location_submit'>完成</button>
  </div>
  <iframe id='map-iframe' class='taro_choose_location_frame' frameborder='0' src="https://apis.map.qq.com/tools/locpicker?${queryString.stringify(
    query,
    { arrayFormat: 'comma', skipNull: true }
  )}"/>
</div>
`
    container = document.createElement('div')
    container.innerHTML = html
  }
  const main: HTMLDivElement = container.querySelector('.taro_choose_location') as HTMLDivElement

  function show () {
    setTimeout(() => {
      main.style.top = '0'
    })
  }

  function hide () {
    main.style.top = '100%'
  }

  function back () {
    hide()
    handler({ errMsg: 'cancel' })
  }

  function submit () {
    hide()
    handler()
  }

  function remove () {
    container?.remove()
    container = null
    window.removeEventListener('popstate', back)
  }

  container.querySelector('.taro_choose_location_back')?.addEventListener('click', back)
  container.querySelector('.taro_choose_location_submit')?.addEventListener('click', submit)

  window.addEventListener('popstate', back)

  return {
    show,
    remove,
    container,
  }
}

/**
 * 打开地图选择位置。
 *
 * @canUse chooseLocation
 * @__object [latitude, longitude]
 * @__success [address, latitude, longitude, name]
 */
export const chooseLocation: typeof Taro.chooseLocation = (options = {}) => {
  const name = 'chooseLocation'
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `openLocation:fail ${isObject.msg}` }
    return Promise.reject(res)
  }
  const {
    latitude,
    longitude,
    success,
    fail,
    complete
  } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise<Taro.chooseLocation.SuccessCallbackResult>((resolve, reject) => {
    native.chooseLocation({
      latitude,
      longitude,
      success: (res: any) => {
        const result: Taro.chooseLocation.SuccessCallbackResult = {
          address: res.address,
          latitude: res.location.latitude,
          longitude: res.location.longitude,
          name: res.name,
          errMsg: `${name}:ok`
        }
        handle.success(result, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      }
    })
  })
}
