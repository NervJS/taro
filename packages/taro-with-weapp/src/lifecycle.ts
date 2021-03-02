interface LifecycleMap {
  [key: string]: string[]
}

export enum TaroLifeCycles {
  WillMount = 'componentWillMount',
  DidMount = 'componentDidMount',
  DidShow = 'componentDidShow',
  DidHide = 'componentDidHide',
  WillUnmount = 'componentWillUnmount'
}

export const lifecycleMap: LifecycleMap = {
  [TaroLifeCycles.WillMount]: ['created'],
  [TaroLifeCycles.DidMount]: ['attached'],
  [TaroLifeCycles.DidShow]: ['onShow'],
  [TaroLifeCycles.DidHide]: ['onHide'],
  [TaroLifeCycles.WillUnmount]: ['detached', 'onUnload']
}

export const lifecycles = new Set<string>(['ready'])

for (const key in lifecycleMap) {
  const lifecycle = lifecycleMap[key]
  lifecycle.forEach(l => lifecycles.add(l))
}

export const uniquePageLifecycle = [
  'onPullDownRefresh',
  'onReachBottom',
  'onShareAppMessage',
  'onShareTimeline',
  'onAddToFavorites',
  'onPageScroll',
  'onResize',
  'onTabItemTap'
]

export const appOptions = [
  'onLaunch',
  'onShow',
  'onHide',
  'onError',
  'onPageNotFound',
  'onUnhandledRejection',
  'onThemeChange'
]
