import {
  internal_safe_get as safeGet,
  internal_safe_set as safeSet
} from '@tarojs/taro'
import { componentTrigger } from './create-component'
const privatePropKeyName = '_triggerObserer'
export function updateComponent (component) {
  const { props } = component
  const prevProps = component.prevProps || props
  component.props = prevProps
  if (component.__mounted && component._unsafeCallUpdate === true && component.componentWillReceiveProps) {
    component._disable = true
    component.componentWillReceiveProps(props)
    component._disable = false
  }
  // 在willMount前执行构造函数的副本
  if (!component.__mounted) {
    component._constructor && component._constructor(props)
  }
  let state = component.getState()

  const prevState = component.prevState || state

  let skip = false
  if (component.__mounted) {
    if (typeof component.shouldComponentUpdate === 'function' &&
      component.shouldComponentUpdate(props, state) === false) {
      skip = true
    } else if (typeof component.componentWillUpdate === 'function') {
      component.componentWillUpdate(props, state)
    }
  }
  component.props = props
  component.state = state
  component._dirty = false
  if (!component.__mounted) {
    componentTrigger(component, 'componentWillMount')
  }
  if (!skip) {
    if (component.__mounted && typeof component.componentDidUpdate === 'function') {
      component.componentDidUpdate(prevProps, prevState)
    }
    doUpdate(component)
  }
  component.prevProps = component.props
  component.prevState = component.state
}

function doUpdate (component) {
  const { state, props = {} } = component
  let data = state || {}
  if (component._createData) {
    data = component._createData(state, props)
  }
  let privatePropKeyVal = component.$scope.data[privatePropKeyName] || false

  data = Object.assign({}, props, data)
  if (component.$usedState && component.$usedState.length) {
    const _data = {}
    component.$usedState.forEach(key => {
      const val = safeGet(data, key)
      typeof val !== 'undefined' && safeSet(_data, key, val)
    })
    data = _data
  }
  // 改变这个私有的props用来触发(observer)子组件的更新
  data[privatePropKeyName] = !privatePropKeyVal

  component.$scope.setData(data, function () {
    if (component._pendingCallbacks) {
      while (component._pendingCallbacks.length) {
        component._pendingCallbacks.pop().call(component)
      }
    }
    if (!component.__mounted) {
      component.__mounted = true
      if (typeof component.componentDidMount === 'function') {
        component.componentDidMount()
      }
    }
  })
}
