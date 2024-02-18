import Taro from '@tarojs/api'
import { history } from '@tarojs/router'
import { isFunction, PLATFORM_TYPE } from '@tarojs/shared'
import { toByteArray } from 'base64-js'

import {
  getApp,
  getCurrentInstance,
  getCurrentPages,
  initLaunchOptions,
  navigateBack,
  navigateTo,
  nextTick,
  redirectTo,
  reLaunch,
  switchTab
} from './index'
import { permanentlyNotSupport } from './utils'

// @ts-ignore
window.base64ToArrayBuffer = (base64: string) => toByteArray(base64).buffer

const {
  Behavior,
  getEnv,
  ENV_TYPE,
  Link,
  interceptors,
  interceptorify,
  Current,
  options,
  eventCenter,
  Events,
  preload
} = Taro as any

const taro: typeof Taro = {
  // @ts-ignore
  Behavior,
  getEnv,
  ENV_TYPE,
  Link,
  interceptors,
  interceptorify,
  Current,
  getCurrentInstance,
  options,
  nextTick,
  eventCenter,
  Events,
  preload,
  history,
  navigateBack,
  navigateTo,
  reLaunch,
  redirectTo,
  getCurrentPages,
  switchTab
}

export const requirePlugin = permanentlyNotSupport('requirePlugin')

function getConfig (): Record<string, any> {
  if (this?.pxTransformConfig) return this.pxTransformConfig
  return ((taro as any).config ||= {})
}

const defaultDesignWidth = 750
const defaultDesignRatio: TaroGeneral.TDeviceRatio = {
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2
}
const defaultBaseFontSize = 20
const defaultUnitPrecision = 5
const defaultTargetUnit = 'rem'

const initPxTransform = function ({
  designWidth = defaultDesignWidth,
  deviceRatio = defaultDesignRatio,
  baseFontSize = defaultBaseFontSize,
  unitPrecision = defaultUnitPrecision,
  targetUnit = defaultTargetUnit
}) {
  const config = getConfig.call(this)
  config.designWidth = designWidth
  config.deviceRatio = deviceRatio
  config.baseFontSize = baseFontSize
  config.targetUnit = targetUnit
  config.unitPrecision = unitPrecision
}

const pxTransform = function (size = 0) {
  const config = getConfig.call(this)
  const baseFontSize = config.baseFontSize || defaultBaseFontSize
  const deviceRatio = config.deviceRatio || defaultDesignRatio
  const designWidth = (((input = 0) => isFunction(config.designWidth)
    ? config.designWidth(input)
    : config.designWidth))(size)
  if (!(designWidth in config.deviceRatio)) {
    throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
  }
  const targetUnit = config.targetUnit || defaultTargetUnit
  const unitPrecision = config.unitPrecision || defaultUnitPrecision
  const formatSize = ~~size
  let rootValue = 1 / deviceRatio[designWidth]
  switch (targetUnit) {
    case 'vw':
      rootValue = designWidth / 100
      break
    case 'px':
      rootValue *= 2
      break
    default:
      // rem
      rootValue *= baseFontSize * 2
  }
  let val: number | string = formatSize / rootValue
  if (unitPrecision >= 0 && unitPrecision <= 100) {
    // Number(val): 0.50000 => 0.5
    val = Number(val.toFixed(unitPrecision))
  }
  return val + targetUnit
}

/**
 * 判断能否使用WebP格式
 * 
 * @canUse canIUseWebp
 */
const canIUseWebp = function () {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

const getAppInfo = function () {
  const config = getConfig.call(this)
  return {
    platform: process.env.TARO_PLATFORM || PLATFORM_TYPE.WEB,
    taroVersion: process.env.TARO_VERSION || 'unknown',
    designWidth: config.designWidth,
  }
}

// 同步小程序启动时的参数
Taro.eventCenter.once('__taroRouterLaunch', initLaunchOptions)

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.currentNavigation = {}
}

// 更新导航栏状态
Taro.eventCenter.on('__taroSetNavigationStyle', (style, textStyle, backgroundColor) => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.native?.setNavigationStyle?.(style, textStyle, backgroundColor)
    // @ts-ignore
    Object.assign(window.currentNavigation, {
      style,
      textStyle,
      backgroundColor,
    })
    // @ts-ignore
    if (typeof window.originCapsuleState !== 'undefined') {
      // @ts-ignore
      window.native?.setCapsuleState?.(window.originCapsuleState)
    }
  }
})

// 进入全屏时隐藏导航栏和胶囊按钮
eventCenter.on('__taroEnterFullScreen', () => {
  // @ts-ignore
  window.native?.setNavigationStyle?.('custom', 'black', '#000000')
  // @ts-ignore
  if (typeof window.originCapsuleState === 'undefined') {
    // @ts-ignore
    window.originCapsuleState = window.native?.getCapsuleState().visible
  }
  // @ts-ignore
  window.native?.setCapsuleState?.(false)
})

// 退出全屏时恢复导航栏和胶囊按钮
eventCenter.on('__taroExitFullScreen', () => {
  // @ts-ignore
  const { style, textStyle, backgroundColor } = window.currentNavigation
  // @ts-ignore
  window.native?.setNavigationStyle?.(style, textStyle, backgroundColor)
  // @ts-ignore
  if (typeof window.originCapsuleState !== 'undefined') {
    // @ts-ignore
    window.native?.setCapsuleState?.(window.originCapsuleState)
  }
})

// 根据是否有导航栏设置页面样式
function loadNavigationSytle () {
  if (typeof window === 'undefined') {
    return
  }
  // @ts-ignore
  const naviHeight = window.navigationHeight ? window.navigationHeight : 0
  const css = `
.taro_router .taro_page.taro_navigation_page {
  padding-top: ${naviHeight}px;
}

.taro-tabbar__container .taro_page.taro_navigation_page {
  max-height: calc(100vh - ${naviHeight}px);
}

.taro-tabbar__container .taro_page.taro_tabbar_page.taro_navigation_page {
  max-height: calc(100vh - 50px - ${naviHeight}px);
}`

  const style = document.createElement('style')
  style.innerHTML = css
  document.getElementsByTagName('head')[0].appendChild(style)
}

loadNavigationSytle()

// 设置位置选择样式
function loadChooseLocationStyle () {
  const css = `
.taro_choose_location {
  display: flex;
  position: fixed;
  top: 100%;
  z-index: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #fff;
  transition: ease top 0.3s;
}
.taro_choose_location_bar {
  display: flex;
  flex: 0 60px;
  height: 60px;
  background-color: #ededed;
  color: #090909;
  align-items: center;
}
.taro_choose_location_back {
  position: relative;
  flex: 0 40px;
  margin-left: 10px;
  width: 25px;
  height: 30px;
}
.taro_choose_location_back::before {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  border: solid 15px;
  border-color: transparent #090909 transparent transparent;
  width: 0;
  height: 0;
  content: "";
}
.taro_choose_location_back::after {
  display: block;
  position: absolute;
  left: 3px;
  top: 0;
  border: solid 15px;
  border-color: transparent #ededed transparent transparent;
  width: 0;
  height: 0;
  content: "";
}
.taro_choose_location_title {
  flex: 1;
  padding-left: 30px;
  line-height: 60px;
}
.taro_choose_location_submit {
  margin-right: 25px;
  padding: 0;
  border: none;
  width: 75px;
  height: 40px;
  background-color: #08bf62;
  line-height: 40px;
  font-size: 20px;
  color: #fff;
}
.taro_choose_location_frame {
  flex: 1;
}
`

  const style = document.createElement('style')
  style.innerHTML = css
  document.getElementsByTagName('head')[0].appendChild(style)
}

loadChooseLocationStyle()


taro.getApp = getApp
taro.pxTransform = pxTransform
taro.initPxTransform = initPxTransform
taro.canIUseWebp = canIUseWebp

export default taro

/**
 * 跳转预加载 API
 * 
 * @canUse preload
 */
export {
  Behavior,
  canIUseWebp,
  Current,
  ENV_TYPE,
  eventCenter,
  Events,
  getAppInfo,
  getEnv,
  history,
  initPxTransform,
  interceptorify,
  interceptors,
  Link,
  options,
  preload,
  pxTransform,
}
