import './style.scss'

import Taro from '@tarojs/api'
import { stringify } from 'query-string'

import { MethodHandler } from '../../utils/handler'

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
        <iframe id='map-iframe' class='taro_choose_location_frame' frameborder='0' src="https://apis.map.qq.com/tools/locpicker?${stringify(query,{ arrayFormat: 'comma', skipNull: true })}"/>
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
 */
export const chooseLocation: typeof Taro.chooseLocation = ({ success, fail, complete, mapOpts } = {}) => {
  const handle = new MethodHandler({ name: 'chooseLocation', success, fail, complete })
  return new Promise((resolve, reject) => {
    const chooseLocation: Partial<Taro.chooseLocation.SuccessCallbackResult> = {}
    const onMessage = (event) => {
      // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
      const loc = event.data

      // 防止其他应用也会向该页面 post 信息，需判断 module 是否为'locationPicker'
      if (!loc || loc.module !== 'locationPicker') return

      chooseLocation.name = loc.poiname
      chooseLocation.address = loc.poiaddress
      chooseLocation.latitude = loc.latlng.lat
      chooseLocation.longitude = loc.latlng.lng
    }

    const chooser = createLocationChooser(
      (res) => {
        window.removeEventListener('message', onMessage, false)
        setTimeout(() => {
          chooser.remove()
        }, 300)
        if (res) {
          return handle.fail(res, { resolve, reject })
        } else {
          if (chooseLocation.latitude && chooseLocation.longitude) {
            return handle.success(chooseLocation, { resolve, reject })
          } else {
            return handle.fail({}, { resolve, reject })
          }
        }
      },
      mapOpts
    )

    document.body.appendChild(chooser.container)

    window.addEventListener('message', onMessage, false)
    chooser.show()
  })
}
