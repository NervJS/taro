import {
  internal_safe_get as safeGet,
  internal_safe_set as safeSet
} from '@tarojs/taro'
import * as PropTypes from 'prop-types'

import { processDynamicComponents } from './create-page'

const DEV = typeof process === 'undefined' ||
  !process.env ||
  process.env.NODE_ENV !== 'production'

export function updateComponent (component, update, isFirst) {
  const { props, propTypes, type } = component
  if (DEV && propTypes) {
    const displayName = type.name || type.toString().match(/^function\s*([^\s(]+)/)[1]
    PropTypes.checkPropTypes(propTypes, props, 'prop', displayName)
  }
  const prevProps = component.prevProps || props
  component.props = prevProps
  if (component._unsafeCallUpdate === true && component.componentWillReceiveProps) {
    component._disable = true
    component.componentWillReceiveProps(props)
    component._disable = false
  }
  let state = component.getState()
  if (component._createData) {
    state = component._createData(state, props)
  }
  state.__data && (state.__data.$path = component.$path)
  const prevState = component.prevState || state
  let skip = false
  if (!isFirst) {
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
  if (!skip) {
    const propsCopy = {}
    Object.keys(component.props).forEach(item => {
      if (typeof component.props[item] !== 'function') {
        propsCopy[item] = component.props[item]
      }
    })
    Object.assign(component.$data, component.state, propsCopy)
    if (component.componentDidUpdate && !isFirst) {
      component.componentDidUpdate(prevProps, prevState)
    }
    doUpdate(component, update)
  }
  component.prevProps = component.props
  component.prevState = component.state
}

function doUpdate (component, update) {
  const $root = component.$root ? component.$root : component
  let $data = $root.$data
  if (update) {
    processDynamicComponents($root)
    $data = Object.assign($data, $root.state, $root._dyState || {})
  }
  if ($root.$usedState && $root.$usedState.length) {
    const data = {}
    $root.$usedState.forEach(key => {
      const value = safeGet($data, key)
      safeSet(data, key, value)
    })
    $data = data
  }
  component.$scope._setData(
    { ...$data },
    function () {
      if (component._pendingCallbacks) {
        while (component._pendingCallbacks.length) {
          component._pendingCallbacks.pop().call(component)
        }
      }
    },
    update
  )
}
