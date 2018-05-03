import { processDynamicComponents } from './create-page'

export function updateComponent (component, update) {
  const props = component.props
  let state = component.getState()
  if (component._createData) {
    state = component._createData(state)
  }
  state.__data && (state.__data.$path = component.$path)
  const prevProps = component.prevProps || props
  const prevState = component.prevState || state
  component.props = prevProps
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
    for (let k in component.$props) {
      const childProps = component.$props[k].call(component)
      const subComponent = component.$$components[k]
      const newChildProps = Object.assign(subComponent.props, childProps)
      component._disable = true
      if (subComponent.componentWillReceiveProps) {
        subComponent.componentWillReceiveProps(newChildProps)
      }
      component._disable = false
      subComponent.props = newChildProps
      updateComponent(subComponent, false)
    }
    const propsCopy = {}
    Object.keys(component.props).forEach(item => {
      if (typeof component.props[item] !== 'function') {
        propsCopy[item] = component.props[item]
      }
    })
    Object.assign(component.$data, component.state, propsCopy)
    if (component.componentDidUpdate) {
      component.componentDidUpdate(prevProps, prevState)
    }
    doUpdate(component, update)
  }
  component.prevProps = component.props
  component.prevState = component.state
}

function doUpdate (component, update) {
  const $data = component.$root ? component.$root.$data : component.$data
  if (update) {
    processDynamicComponents(component.$root || component)
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
