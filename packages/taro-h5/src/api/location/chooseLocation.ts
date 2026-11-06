import './style.scss'

import Taro from '@tarojs/api'
import queryString from 'query-string'

import { MethodHandler } from '../../utils/handler'

function isValidCoordinates (latitude: unknown, longitude: unknown) {
  return typeof latitude === 'number' && latitude >= -90 && latitude <= 90 &&
    typeof longitude === 'number' && longitude >= -180 && longitude <= 180
}

function createLocationChooser (handler, key = LOCATION_APIKEY, mapOpt: Taro.chooseLocation.Option['mapOpts'] = {}) {
  const { latitude, longitude, ...opts } = mapOpt
  const query = {
    key,
    type: 1,
    coord: isValidCoordinates(latitude, longitude) ? `${latitude},${longitude}` : undefined,
    referer: 'myapp',
    ...opts
  }
  const html = `
<div class='taro_choose_location'>
  <div class='taro_choose_location_bar'>
    <div class='taro_choose_location_back'></div>
    <p class='taro_choose_location_title'>位置</p>
    <button class='taro_choose_location_submit'>完成</button>
  </div>
  <iframe class='taro_choose_location_frame' frameborder='0' src="https://apis.map.qq.com/tools/locpicker?${queryString.stringify(query, { arrayFormat: 'comma', skipNull: true })}" />
</div>
`
  const container = document.createElement('div')
  container.innerHTML = html
  const main: HTMLDivElement = container.querySelector('.taro_choose_location') as HTMLDivElement
  const frame = container.querySelector('.taro_choose_location_frame') as HTMLIFrameElement | null
  const backButton = container.querySelector('.taro_choose_location_back')
  const submitButton = container.querySelector('.taro_choose_location_submit')
  // 结束后选择器还会停留 300ms 再移除，期间的返回/完成不应再次通知调用方
  let settled = false
  let detached = false
  let showTimer: ReturnType<typeof setTimeout> | undefined

  function show () {
    showTimer = setTimeout(() => {
      main.style.top = '0'
    })
  }

  function hide () {
    main.style.top = '100%'
  }

  function detachListeners () {
    if (detached) return
    detached = true
    backButton?.removeEventListener('click', back)
    submitButton?.removeEventListener('click', submit)
    window.removeEventListener('popstate', back)
  }

  function settle (res?: { errMsg: string }) {
    if (settled) return
    settled = true
    detachListeners()
    hide()
    handler(res)
  }

  function back () {
    settle({ errMsg: 'cancel' })
  }

  function submit () {
    settle()
  }

  function remove () {
    if (showTimer !== undefined) {
      clearTimeout(showTimer)
      showTimer = undefined
    }
    detachListeners()
    container.remove()
  }

  backButton?.addEventListener('click', back)
  submitButton?.addEventListener('click', submit)

  window.addEventListener('popstate', back)

  return {
    show,
    remove,
    container,
    frame,
  }
}

/**
 * 打开地图选择位置。
 */
export const chooseLocation: typeof Taro.chooseLocation = ({ success, fail, complete, mapOpts } = {}) => {
  const handle = new MethodHandler({ name: 'chooseLocation', success, fail, complete })
  return new Promise((resolve, reject) => {
    const chooseLocation: Partial<Taro.chooseLocation.SuccessCallbackResult> = {}
    if (typeof LOCATION_APIKEY === 'undefined') {
      console.warn('chooseLocation api 依赖腾讯地图定位api，需要在 defineConstants 中配置 LOCATION_APIKEY')
      return handle.fail({
        errMsg: 'LOCATION_APIKEY needed'
      }, { resolve, reject })
    }

    const key = LOCATION_APIKEY

    // 本次调用自己的选点 iframe，createLocationChooser 返回后立即赋值
    let frame: HTMLIFrameElement | null = null

    const onMessage = event => {
      // 页面上可能同时存在多个选点 iframe：并发调用，或上一次调用正处于
      // 延迟移除的窗口期。只认本次调用自己的 iframe，否则各调用之间会串号。
      if (!frame || event.source !== frame.contentWindow) return

      // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
      const loc = event.data

      // 防止其他应用也会向该页面 post 信息，需判断 module 是否为 'locationPicker'
      if (!loc || loc.module !== 'locationPicker') return

      chooseLocation.name = loc.poiname
      chooseLocation.address = loc.poiaddress
      chooseLocation.latitude = loc.latlng.lat
      chooseLocation.longitude = loc.latlng.lng
    }

    const chooser = createLocationChooser(res => {
      window.removeEventListener('message', onMessage, false)
      setTimeout(() => {
        chooser.remove()
      }, 300)
      if (res) {
        return handle.fail(res, { resolve, reject })
      } else {
        if (isValidCoordinates(chooseLocation.latitude, chooseLocation.longitude)) {
          return handle.success(chooseLocation, { resolve, reject })
        } else {
          return handle.fail({}, { resolve, reject })
        }
      }
    }, key, mapOpts)

    frame = chooser.frame

    document.body.appendChild(chooser.container)

    window.addEventListener('message', onMessage, false)
    chooser.show()
  })
}
