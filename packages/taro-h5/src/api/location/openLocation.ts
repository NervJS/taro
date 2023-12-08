
import './style.scss'

import Taro from '@tarojs/api'
import { shouldBeObject } from 'src/utils'

import { MethodHandler } from '../../utils/handler'

let container: HTMLDivElement | null = null
function createContainer (options: Taro.openLocation.Option) {
  // @ts-ignore
  const systemBarHeight = window.systemBarHeight ? window.systemBarHeight : 0
  const key = LOCATION_APIKEY
  const { longitude, latitude, name, address } = options
  if (!container) {
    const html = `
      <div class='taro_choose_location'>
        <div style='height:${systemBarHeight}px; width:100%; background-color:transparent;'></div>
        <div class='taro_choose_location_bar'>
          <div class='taro_choose_location_back'></div>
          <p class='taro_choose_location_title'>位置</p>
        </div>
        <iframe id='map-iframe' class='taro_choose_location_frame' frameborder='0' src="https://apis.map.qq.com/tools/poimarker?key=${key}&referer=myapp&type=0&marker=coord:${latitude},${longitude};title:${name};addr:${address}" />
      </div>
      `
    container = document.createElement('div')
    container.innerHTML = html
  }
  const main: HTMLDivElement = container.querySelector('.taro_choose_location') as HTMLDivElement

  function show () {
    main.style.top = '0'
  }

  function hide () {
    main.style.top = '100%'
    remove()
  }

  function remove () {
    container?.remove()
    container = null
  }

  container.querySelector('.taro_choose_location_back')?.addEventListener('click', hide)

  return {
    show,
    container,
  }
}

/**
 * 使用微信内置地图查看位置(暂不支持scale入参)
 * 
 * @canUse openLocation
 * @__object [latitude, longitude, address, name]
 */
export const openLocation: typeof Taro.openLocation = (options) => {
  const name = 'openLocation'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const {
    success,
    fail,
    complete
  } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise((resolve, reject) => {
    const dispalyLoc = createContainer(options)
    document.body.appendChild(dispalyLoc.container)
    dispalyLoc.show()
    document.querySelector('iframe')?.addEventListener('load', function () {
      handle.success({}, { resolve, reject })
    })
    document.querySelector('iframe')?.addEventListener('error', function () {
      handle.fail({}, { resolve, reject })
    })
  })
}
