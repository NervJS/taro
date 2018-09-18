import {
  internal_safe_get as safeGet,
  internal_safe_set as safeSet
} from '@tarojs/taro'
import PropTypes from 'prop-types'
import { componentTrigger } from './create-component'
import { shakeFnFromObject, isEmptyObject, diffObjToPath } from './util'

const isDEV = typeof process === 'undefined' ||
  !process.env ||
  process.env.NODE_ENV !== 'production'

const privatePropKeyName = '_triggerObserer'
export function updateComponent (component) {
  const { props, __propTypes } = component
  if (isDEV && __propTypes) {
    const componentName = component.constructor.name || component.constructor.toString().match(/^function\s*([^\s(]+)/)[1]
    PropTypes.checkPropTypes(__propTypes, props, 'prop', componentName)
  }
  const prevProps = component.prevProps || props
  component.props = prevProps
  if (component.__mounted && component._unsafeCallUpdate === true && component.componentWillReceiveProps) {
    component._disable = true
    component.componentWillReceiveProps(props)
    component._disable = false
  }
  // 在willMount前执行构造函数的副本
  if (!component.__componentWillMountTriggered) {
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
  if (!component.__componentWillMountTriggered) {
    component.__componentWillMountTriggered = true
    componentTrigger(component, 'componentWillMount')
  }
  if (!skip) {
    doUpdate(component, prevProps, prevState)
  }
  component.prevProps = component.props
  component.prevState = component.state
}

function doUpdate (component, prevProps, prevState) {
  const { state, props = {} } = component
  let data = state || {}
  if (component._createData) {
    // 返回null或undefined则保持不变
    data = component._createData(state, props) || data
  }
  let privatePropKeyVal = component.$scope.data[privatePropKeyName] || false

  data = Object.assign({}, props, data)
  if (component.$usedState && component.$usedState.length) {
    const _data = {}
    component.$usedState.forEach(key => {
      let val = safeGet(data, key)
      if (typeof val === 'undefined') {
        return
      }
      if (typeof val === 'object') {
        val = shakeFnFromObject(val)
        if (!isEmptyObject(val)) {
          safeSet(_data, key, val)
        }
      } else {
        safeSet(_data, key, val)
      }
    })
    data = _data
  }
  // 改变这个私有的props用来触发(observer)子组件的更新
  data[privatePropKeyName] = !privatePropKeyVal
  const dataDiff = diffObjToPath(data, component.$scope.data)
  component.$scope.setData(dataDiff, function () {
    if (component.__mounted && typeof component.componentDidUpdate === 'function') {
      component.componentDidUpdate(prevProps, prevState)
    }
    if (component._pendingCallbacks) {
      while (component._pendingCallbacks.length) {
        component._pendingCallbacks.pop().call(component)
      }
    }
  })
}
