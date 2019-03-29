import Taro from '@tarojs/taro-h5'
import classNames from 'classnames'
import Nerv from 'nervjs'

import hoverable from '../../utils/hoverable'

import './navigator.css'

/* eslint-disable prefer-promise-reject-errors */

/*
 *target  String  self  在哪个目标上发生跳转，默认当前小程序，可选值self/miniProgram
 *url  String  当前小程序内的跳转链接
 *open-type  String  navigate  跳转方式
 *delta  Number  当 open-type 为 'navigateBack' 时有效，表示回退的层数
 *app-id  String  当target="miniProgram"时有效，要打开的小程序 appId
 *path  String  当target="miniProgram"时有效，打开的页面路径，如果为空则打开首页
 *extra-data  Object  当target="miniProgram"时有效，需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。详情
  version  version  release  当target="miniProgram"时有效，要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版），仅在当前小程序为开发版或体验版时此参数有效；如果当前小程序是 *式版，则打开的小程序必定是正式版。
 *bindsuccess  String  当target="miniProgram"时有效，跳转小程序成功
 *bindfail  String  当target="miniProgram"时有效，跳转小程序失败
 *bindcomplete  String  当target="miniProgram"时有效，跳转小程序完成
 *aria-label  String  无障碍访问，（属性）元素的额外描述
 */

/**
 * TODO: 参数还需要进一步细化对齐
 * Navigator组件
 * https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html
 **/

class Navigator extends Taro.Component {
  static defaultProps = {
    target: 'self',
    url: null,
    openType: 'navigate',
    delta: null,
    appId: null,
    path: null,
    extraData: {},
    version: 'release',
    bindSuccess: null,
    bindFail: null,
    bindComplete: null,
    isHover: false
  }
  onClick = () => {
    const { openType, bindSuccess, bindFail, bindComplete } = this.props
    let promise
    switch (openType) {
      case 'navigate':
        promise = Taro.navigateTo({
          url: this.props.url
        })
        break
      case 'redirect':
        promise = Taro.redirectTo({
          url: this.props.url
        })
        break
      case 'switchTab':
        promise = Taro.switchTab({
          url: this.props.url
        })
        break
      case 'reLaunch':
        promise = Taro.reLaunch({
          url: this.props.url
        })
        break
      case 'navigateBack':
        promise = Taro.navigateBack({
          delta: this.props.delta
        })
        break
      case 'exit':
        promise = Promise.reject({
          errMsg: `navigator:fail 暂不支持"openType: exit"`
        })
        break
    }
    if (promise) {
      promise.then(res => {
        bindSuccess && bindSuccess(res)
      }).catch(res => {
        bindFail && bindFail(res)
      }).finally(res => {
        bindComplete && bindComplete(res)
      })
    }
  }
  render () {
    const { isHover, hoverClass, onTouchStart, onTouchEnd } = this.props
    return (
      <div
        className={classNames({
          [hoverClass]: isHover
        })}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={this.onClick}>
        {this.props.children}
      </div>
    )
  }
}

export default hoverable({
  hoverClass: 'navigator-hover',
  hoverStopPropergation: false,
  hoverStartTime: 50,
  hoverStayTime: 600
})(Navigator)
