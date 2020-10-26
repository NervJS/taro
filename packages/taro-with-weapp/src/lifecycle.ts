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
  [TaroLifeCycles.WillMount]: ['created', 'onLoad', 'onLanuch'],
  [TaroLifeCycles.DidMount]: ['onReady', 'ready', 'attached'],
  [TaroLifeCycles.DidShow]: ['onShow'],
  [TaroLifeCycles.DidHide]: ['onHide'],
  [TaroLifeCycles.WillUnmount]: ['detached', 'onUnload']
}

export const lifecycles = new Set<string>()

for (const key in lifecycleMap) {
  const lifecycle = lifecycleMap[key]
  lifecycle.forEach(l => lifecycles.add(l))
}
