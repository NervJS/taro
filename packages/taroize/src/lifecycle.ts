const enum Lifecycle {
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
  componentWillReceiveProps = 'componentWillReceiveProps'
}

export const PageLifecycle = new Map<string, string>()
PageLifecycle.set('onLoad', Lifecycle.componentWillMount)
PageLifecycle.set('onShow', Lifecycle.componentDidShow)
PageLifecycle.set('onReady', Lifecycle.componentDidMount)
PageLifecycle.set('onHide', Lifecycle.componentDidHide)
PageLifecycle.set('onUnload', Lifecycle.componentWillUnmount)

export const ComponentLifeCycle = new Map<string, string>()
ComponentLifeCycle.set('created', Lifecycle.componentWillMount)
ComponentLifeCycle.set('created', Lifecycle.componentWillMount)
ComponentLifeCycle.set('created', Lifecycle.componentWillMount)
ComponentLifeCycle.set('created', Lifecycle.componentWillMount)
ComponentLifeCycle.set('created', Lifecycle.componentWillMount)
