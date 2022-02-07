import Taro from '@tarojs/api'
import { MethodHandler } from '../utils/handler'
import './style.css'

function createLocationChooser (handler, key = LOCATION_APIKEY) {
  const html = `
<div class='taro_choose_location'>
  <div class='taro_choose_location_bar'>
    <div class='taro_choose_location_back'></div>
    <p class='taro_choose_location_title'>位置</p>
    <button class='taro_choose_location_submit'>完成</button>
  </div>
  <iframe class='taro_choose_location_frame' frameborder='0' src='https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=${key}&referer=myapp'></iframe>
</div>
`
  const container = document.createElement('div')
  container.innerHTML = html
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
    container.remove()
    window.removeEventListener('popstate', back)
  }

  container.querySelector('.taro_choose_location_back')?.addEventListener('click', back)
  container.querySelector('.taro_choose_location_submit')?.addEventListener('click', submit)

  window.addEventListener('popstate', back)

  return {
    show,
    remove,
    container
  }
}

/**
 * 打开地图选择位置。
 */
export const chooseLocation: typeof Taro.chooseLocation = ({ success, fail, complete } = {}) => {
  const key = LOCATION_APIKEY
  const handle = new MethodHandler({ name: 'chooseLocation', success, fail, complete })
  return new Promise((resolve, reject) => {
    const chooseLocation: Partial<Taro.chooseLocation.SuccessCallbackResult> = {}
    if (!key) {
      console.warn('chooseLocation api 依赖腾讯地图定位api，需要在 defineConstants 中配置 LOCATION_APIKEY')
      return handle.fail({
        errMsg: 'LOCATION_APIKEY needed'
      }, reject)
    }

    const onMessage = event => {
      // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
      const loc = event.data

      // 防止其他应用也会向该页面 post 信息，需判断 module 是否为'locationPicker'
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
        return handle.fail(res, reject)
      } else {
        if (chooseLocation.latitude && chooseLocation.longitude) {
          return handle.success(chooseLocation, resolve)
        } else {
          return handle.fail({}, reject)
        }
      }
    }, key)

    document.body.appendChild(chooser.container)

    window.addEventListener('message', onMessage, false)
    chooser.show()
  })
}
