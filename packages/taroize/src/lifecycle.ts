export const enum Lifecycle {
  constructor = 'constructor',
  componentWillMount = 'componentWillMount',
  componentDidMount = 'componentDidMount',
  componentWillUpdate = 'componentWillUpdate',
  componentDidUpdate = 'componentDidUpdate',
  componentWillUnmount = 'componentWillUnmount',
  componentDidCatch = 'componentDidCatch',
  componentDidShow = 'componentDidShow',
  componentDidHide = 'componentDidHide',
  componentDidAttached = 'componentDidAttached',
  componentDidMoved = 'componentDidMoved',
  shouldComponentUpdate = 'shouldComponentUpdate',
  componentWillReceiveProps = 'componentWillReceiveProps',
  componentDidCatchError = 'componentDidCatchError'
}

export const PageLifecycle = new Map<string, string>()

PageLifecycle.set('onLoad', Lifecycle.componentWillMount)
PageLifecycle.set('onShow', Lifecycle.componentDidShow)
PageLifecycle.set('onReady', Lifecycle.componentDidMount)
PageLifecycle.set('onHide', Lifecycle.componentDidHide)
PageLifecycle.set('onUnload', Lifecycle.componentWillUnmount)
PageLifecycle.set('onError', Lifecycle.componentDidCatchError)
PageLifecycle.set('onLaunch', Lifecycle.componentWillMount)
