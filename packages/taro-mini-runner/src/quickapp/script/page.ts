import type { PageInstance } from '@tarojs/runtime'
import { setData } from './utils'

export function Page (config: PageInstance) {
  const {
    data,
    path,
    // options,
    onPullDownRefresh,
    onReachBottom,
    onPageScroll,
    // onShareAppMessage,
    // onResize,
    // onTabItemTap,
    // onTitleClick,
    // onOptionMenuClick,
    // onPopMenuClick,
    onReady,
    // onPullIntercept,
    // onShareTimeline,
    // onAddToFavorites,
    // eh,
    onLoad,
    onUnload,

    // componentDidShow,
    // componentDidHide,
    onShow,
    onHide
  } = config

  return {
    path,
    private: data,
    onInit: onLoad,
    onReady: onReady,
    onShow: onShow,
    onHide: onHide,
    onDestroy: onUnload,
    onBackPress: null,
    onMenuPress: null,
    onRefresh: null,
    onConfigurationChanged: null,
    onReachTop: onPullDownRefresh,
    onReachBottom: onReachBottom,
    onPageScroll: onPageScroll,

    setData
  }
}
