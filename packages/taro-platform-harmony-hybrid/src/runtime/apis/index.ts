import definition from '@tarojs/plugin-platform-harmony-hybrid/dist/definition.json'
import isMatchWith from 'lodash-es/isMatchWith'
import setWith from 'lodash-es/setWith'
import { initLaunchOptions } from 'src/api/apis'
import native from 'src/api/apis/NativeApi'
import { invertColor } from 'src/api/apis/utils/colorConvert'

import Taro from './taro'

export * from './taro'
export * from './taro-h5'

let list: Record<string, unknown> | null = null
export function canIUse (scheme = '') {
  /** Note: 此处方法仅作适配使用，用于避免 babel 无法识别的情况，比如通过变量传递的 scheme 等等
   * 同时，此处的 scheme 不包括在编译时写入的 hooks 等方法，故而不支持相关判断
   */
  if (list === null) {
    list = {
      ...definition.apis,
      ...definition.components,
      // canIUse: '*'
    } as Exclude<typeof list, null>
  }
  if (!scheme) return false
  const o = setWith({}, scheme, true, Object)
  return isMatchWith(list, o, (a, b) => {
    if (a === '*' || b === true) return true
  })
}

export default Taro

// 同步小程序启动时的参数
Taro.eventCenter.once('__taroRouterLaunch', initLaunchOptions)

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.currentNavigation = {}
}


// 更新导航栏状态
Taro.eventCenter.on('__taroSetNavigationStyle', (style, textStyle, backgroundColor) => {
  if (typeof window !== 'undefined') {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // 当前处于深色模式，对textStyle和backgroundColor进行反转
      textStyle = textStyle === 'black' ? 'white' : 'black'
      backgroundColor = invertColor(backgroundColor)
    }
    native.setNavigationStyle({ style, textStyle, backgroundColor })
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
Taro.eventCenter.on('__taroEnterFullScreen', () => {
  native.setNavigationStyle({
    style: 'custom',
    textStyle: 'black',
    backgroundColor: '#000000',
  })
  // @ts-ignore
  if (typeof window.originCapsuleState === 'undefined') {
    // @ts-ignore
    window.originCapsuleState = window.native?.getCapsuleState().visible
  }
  // @ts-ignore
  window.native?.setCapsuleState?.(false)
})


// 退出全屏时恢复导航栏和胶囊按钮
Taro.eventCenter.on('__taroExitFullScreen', () => {
  // @ts-ignore
  const { style, textStyle, backgroundColor } = window.currentNavigation
  native.setNavigationStyle({ style, textStyle, backgroundColor })
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
