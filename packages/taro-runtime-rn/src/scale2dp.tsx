import { Dimensions, StatusBar, Platform, StyleSheet } from 'react-native'
import { isFunction, isObject, mapValues } from 'lodash'

// 一般app 只有竖屏模式，所以可以只获取一次 width
const deviceWidthDp = Dimensions.get('window').width
const deviceHeightDp = Dimensions.get('window').height
const uiWidthPx = 375

export function scalePx2dp (uiElementPx) {
  return uiElementPx * deviceWidthDp / uiWidthPx
}

type Style = Parameters<typeof StyleSheet.create>[0];

// TODO: 将计算值的过程延迟到每次访问 `style.classname` 时, 每次 render 时会重新计算
export function createStyleSheet<T extends Style, K extends keyof Style> (styles: T): T {
  // 包含 viewPortUnit 的样式
  const hasViewPortUnitStyles: {
    [P in K]?: T[P]
  } = {}
  const noViewPortUnitStyles: {
    [P in K]?: T[P]
  } = {}

  Object.entries(styles).forEach(([prop, style]) => {
    if (isObject(style) && Object.values(style).some(isFunction)) {
      hasViewPortUnitStyles[prop] = style
    } else {
      noViewPortUnitStyles[prop] = style
    }
  })
  const _styles = StyleSheet.create(noViewPortUnitStyles as {[P in K]: T[P]})

  Object.keys(hasViewPortUnitStyles).forEach(key => {
    Object.defineProperty(_styles, key, {
      get () {
        return mapValues(hasViewPortUnitStyles[key], (value) => isFunction(value) ? value() : value)
      },
      enumerable: true
    })
  })

  return _styles as T
}

/**
 * TODO: 问题
 * 1. 高度在 onlayout / statusBar render 时被设置，初始化获取的值可能为空
 * 2. 高度被设置后，需要下次触发 render 函数才会生效
 * 3. 依赖了私有的状态，不规范的做法
 */
export const sizes = {
  get deviceHeightDp () {
    return deviceHeightDp + this.statusBarHeight - this.headerHeight - this.tabBarHeight
  },
  get statusBarHeight () {
    if (Platform.OS === 'ios') {
      return 0
    }
    // _currentValues 依赖 StatusBar 的生命周期，第一次可能无法获取到
    // @ts-ignore
    return StatusBar._currentValues?.translucent ? StatusBar.currentHeight : 0
  },
  get headerHeight () {
    // const headderHeight = useHeaderHeight()
    // return headderHeight
    return 0
  },
  get tabBarHeight () {
    // const tabBarHeight = useBottomTabBarHeight()
    // return tabBarHeight
    return 0
  }
}

// 依赖动态值，返回函数，避免在初始化时完成计算
export function scaleVu2dp (uiElementPx, unit) {
  return () => {
    if (unit === 'vh') return uiElementPx * sizes.deviceHeightDp / 100
    if (unit === 'vmax') return uiElementPx * Math.max(deviceWidthDp, sizes.deviceHeightDp) / 100
    if (unit === 'vmin') return uiElementPx * Math.min(deviceWidthDp, sizes.deviceHeightDp) / 100
    return uiElementPx * deviceWidthDp / 100
  }
}
