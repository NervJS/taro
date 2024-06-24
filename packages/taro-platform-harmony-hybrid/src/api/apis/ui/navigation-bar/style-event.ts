import Taro from '@tarojs/api'

import native from '../../NativeApi'

/**
 * 导航条与Web层叠布局，导航条可见情况下Web页面顶部空出一定高度的留白
 */
export function loadNavigationStyle () {
  if (window === undefined) {
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

/**
 * 监听导航栏设置、进入/退出全屏事件，更改导航栏样式以及显示/隐藏胶囊按钮
 */
export function registerNavigationStyleHandler () {
  if (window !== undefined) {
    // @ts-ignore
    window.currentNavigation = {}
  }

  Taro.eventCenter.on('__taroSetNavigationStyle', (style, textStyle, backgroundColor) => {
    if (window !== undefined) {
      native.setNavigationStyle({ style: style, textStyle: textStyle, backgroundColor: backgroundColor })
      // @ts-ignore
      Object.assign(window.currentNavigation, {
        style,
        textStyle,
        backgroundColor,
      })
      // @ts-ignore
      const { originCapsuleVisible } = window
      if (originCapsuleVisible !== undefined) {
        native.setCapsuleState({ visible: originCapsuleVisible })
      }
    }
  })

  Taro.eventCenter.on('__taroEnterFullScreen', () => {
    native.setNavigationStyle({ style: 'custom', textStyle: 'black', backgroundColor: '#000000' })
    // @ts-ignore
    if (window.originCapsuleVisible === undefined) {
      // @ts-ignore
      window.originCapsuleVisible = native.getCapsuleState().visible
    }
    native.setCapsuleState({ visible: false })
  })

  Taro.eventCenter.on('__taroExitFullScreen', () => {
    // @ts-ignore
    const { style, textStyle, backgroundColor } = window.currentNavigation
    native.setNavigationStyle({ style: style, textStyle: textStyle, backgroundColor: backgroundColor })
    // @ts-ignore
    const { originCapsuleVisible } = window
    if (originCapsuleVisible !== undefined) {
      native.setCapsuleState({ visible: originCapsuleVisible })
    }
  })
}
