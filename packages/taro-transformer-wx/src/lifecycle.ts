export enum Lifecycle {
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
}

export const PageLifecycle = {
  [Lifecycle.componentDidMount]: 'onLaunch',
  [Lifecycle.componentWillMount]: 'onLoad',
  [Lifecycle.componentWillUnmount]: 'onUnload',
  [Lifecycle.componentDidShow]: 'onShow',
  [Lifecycle.componentDidHide]: 'onHide',
}

export const ComponentLifeCycle = {
  [Lifecycle.componentWillMount]: 'created',
  [Lifecycle.componentDidAttached]: 'attached',
  [Lifecycle.componentDidMount]: 'ready',
  [Lifecycle.componentDidMoved]: 'moved',
  [Lifecycle.componentWillUnmount]: 'detached',
}
