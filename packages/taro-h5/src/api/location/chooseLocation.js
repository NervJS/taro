/* global LOCATION_APIKEY */
import Taro from '../../taro'
import Nerv from 'nervjs'

import './style.css'

/** @type {LocationChooser} */
let locationChooser

class LocationChooser extends Taro.Component {
  constructor (props, context) {
    super(props, context)
    locationChooser = this
    window.addEventListener('popstate', this.onBack)
  }

  componentWillUnmount () {
    window.removeEventListener('popstate', this.onBack)
  }

  getWrapRef = ref => {
    if (ref) this.wrapRef = ref
  }
  show = () => {
    setTimeout(() => {
      this.wrapRef.style.top = '0'
    })
  }
  hide = () => {
    this.wrapRef.style.top = '100%'
  }
  onBack = () => {
    this.props.handler({ errMsg: 'chooseLOcation:fail cancel' })
    this.hide()
  }
  onSubmit = () => {
    this.props.handler()
    this.hide()
  }
  render () {
    return Nerv.createPortal(
      <div className='taro_chooselocation' ref={this.getWrapRef}>
        <div className='taro_chooselocation_bar'>
          <div className='taro_chooselocation_back' onClick={this.onBack} />
          <p className='taro_chooselocation_title'>位置</p>
          <button className='taro_chooselocation_submit' onClick={this.onSubmit}>完成</button>
        </div>
        <iframe className='taro_chooselocation_frame' frameborder='0' src={`https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=${LOCATION_APIKEY}&referer=myapp`} />
      </div>,
      document.body
    )
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
    const div = document.createElement('div')
    const choosenLocation = {}
    const onSuccess = res => {
      success && success(res)
      complete && complete()
      resolve(res)
    }
    const onError = res => {
      fail && fail(res)
      complete && complete()
      reject(res)
    }

    if (!LOCATION_APIKEY) {
      const errMsg = `chooseLocation:fail LOCATION_APIKEY needed`
      console.warn('chooseLocation api 依赖腾讯地图定位api，需要在defineConstants中配置LOCATION_APIKEY')
      return onError({ errMsg })
    }

    Nerv.render(<LocationChooser handler={res => {
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
        Nerv.unmountComponentAtNode(div)
      }, 300)
    }} />, div)

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
    locationChooser.show()
  })
}

export default chooseLocation
