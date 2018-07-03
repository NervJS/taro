import shallowEqual from './shallow-equal'
import { objClone } from './util'
const privatePropKeyName = '_triggerObserer'
export function updateComponent (component) {
  const { props } = component
  const prevProps = component.prevProps || props
  component.props = prevProps
  if (component.componentWillReceiveProps) {
    component._disable = true
    component.componentWillReceiveProps(props)
    component._disable = false
  }
  const state = component.getState()
  const prevState = component.prevState || state

  let skip = false
  if (typeof component.shouldComponentUpdate === 'function' &&
    component.shouldComponentUpdate(props, state) === false) {
    skip = true
  } else if (typeof component.componentWillUpdate === 'function') {
    component.componentWillUpdate(props, state)
  }
  component.props = props
  component.state = state
  component._dirty = false

  if (!skip) {
    if (component.componentDidUpdate) {
      component.componentDidUpdate(prevProps, prevState)
    }
    doUpdate(component)
  }
  component.prevProps = component.props
  component.prevState = component.state
}

function doUpdate (component) {
  if (component._createData) {
    component._createData(component.state, component.props)
  }
  const {state, __computed = {}, props = {}} = component

  let privatePropKeyVal = component.$scope.data[privatePropKeyName] || false
  let data = { __computed }
  // privatePropKeyVal更新用于触发子组件obsever
  if (!shallowEqual(component.$scope.data.__state, state)) {
    data['__state'] = objClone(state)
  }
  if (!shallowEqual(component.$scope.data.__computed, __computed)) {
    data['__computed'] = objClone(__computed)
  }
  if (!shallowEqual(component.$scope.data.__props, props)) {
    data['__props'] = objClone(props)
  }
  data[privatePropKeyName] = !privatePropKeyVal

  component.$scope.setData(data, function () {
    if (component._pendingCallbacks) {
      while (component._pendingCallbacks.length) {
        component._pendingCallbacks.pop().call(component)
      }
    }
  })
}
