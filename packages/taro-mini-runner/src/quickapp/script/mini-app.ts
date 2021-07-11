import type { AppInstance } from '@tarojs/runtime'

export function App (config: AppInstance) {
  const {
    onLaunch,
    mount,
    unmount,
    onPageNotFound,
    taroGlobalData,

    componentDidShow,
    componentDidHide,
    onShow,
    onHide
  } = config

  return {
    onCreate: onLaunch,
    onPageNotFound,
    onError: null,
    onDestroy: null,
    onRequest: null,
    onHide,
    onShow,
    mount,
    unmount,
    taroGlobalData,
    componentDidShow,
    componentDidHide
  }
}
