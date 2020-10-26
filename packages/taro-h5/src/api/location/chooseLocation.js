import './style.css'

function createLocaltionChooser (handler) {
  const html = `
<div class='taro_chooselocation'>
  <div class='taro_chooselocation_bar'>
    <div class='taro_chooselocation_back'></div>
    <p class='taro_chooselocation_title'>位置</p>
    <button class='taro_chooselocation_submit'>完成</button>
  </div>
  <iframe class='taro_chooselocation_frame' frameborder='0' src='https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=${LOCATION_APIKEY}&referer=myapp'></iframe>
</div>
`
  const container = document.createElement('div')
  container.innerHTML = html
  const main = container.querySelector('.taro_chooselocation')

  function show () {
    setTimeout(() => {
      main.style.top = '0'
    })
  }

  function hide () {
    main.style.top = '100%'
  }

  function back () {
    handler({ errMsg: 'chooseLOcation:fail cancel' })
    hide()
  }

  function submit () {
    handler()
    hide()
  }

  function remove () {
    container.remove()
    window.removeEventListener('popstate', back)
  }

  container.querySelector('.taro_chooselocation_back').addEventListener('click', back)
  container.querySelector('.taro_chooselocation_submit').addEventListener('click', submit)

  window.addEventListener('popstate', back)

  return {
    show,
    remove,
    container
  }
}

/**
 * @typedef {Object} OriginalLocationObject
 * @property {string} module
 * @property {{ lat: number, lng: number }} latlng
 * @property {string} poiaddress
 * @property {string} poiname
 * @property {string} cityname
 */

/**
 * @typedef {Object} LocationObject
 * @property {string} errMsg 信息
 * @property {string} name 位置名称
 * @property {string} address 详细地址
 * @property {string} latitude 纬度，浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系
 * @property {string} longitude 经度，浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系
 */

/**
 * 打开地图选择位置。
 * @param {Object} object 参数
 * @param {(obj: LocationObject) => void} [object.success] 接口调用成功的回调函数
 * @param {Function} [object.fail] 接口调用失败的回调函数
 * @param {Function} [object.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
const chooseLocation = ({ success, fail, complete } = {}) => {
  return new Promise((resolve, reject) => {
    const choosenLocation = {}
    const onSuccess = res => {
      success && success(res)
      complete && complete(res)
      resolve(res)
    }
    const onError = res => {
      fail && fail(res)
      complete && complete(res)
      reject(res)
    }

    // eslint-disable-next-line
    if (!LOCATION_APIKEY) {
      const errMsg = 'chooseLocation:fail LOCATION_APIKEY needed'
      console.warn('chooseLocation api 依赖腾讯地图定位api，需要在defineConstants中配置LOCATION_APIKEY')
      return onError({ errMsg })
    }

    const chooser = createLocaltionChooser(res => {
      if (res) {
        onError(res)
      } else {
        if (choosenLocation.latitude && choosenLocation.longitude) {
          onSuccess({
            errMsg: 'chooseLocation:ok',
            ...choosenLocation
          })
        } else {
          onError({
            errMsg: 'chooseLocation:fail'
          })
        }
      }
      window.removeEventListener('message', onMessage, false)
      setTimeout(() => {
        chooser.remove()
      }, 300)
    })

    document.body.appendChild(chooser.container)

    const onMessage = event => {
      // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
      /** @type {OriginalLocationObject} */
      const loc = event.data

      // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
      if (!loc || loc.module !== 'locationPicker') return

      choosenLocation.name = loc.poiname
      choosenLocation.address = loc.poiaddress
      choosenLocation.latitude = loc.latlng.lat
      choosenLocation.longitude = loc.latlng.lng
    }
    window.addEventListener('message', onMessage, false)
    chooser.show()
  })
}

export default chooseLocation
