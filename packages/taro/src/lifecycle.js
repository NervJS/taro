export function updateComponent (component, update) {
  component._createData && component._createData()
  const props = component.props
  const state = component.getState()
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
    Object.assign(component.$data, component.state, component.props)
    if (component.componentDidUpdate) {
      component.componentDidUpdate(prevProps, prevState)
    }
    doUpdate(component, update)
  }
  component.prevProps = component.props
  component.prevState = component.state
}

function doUpdate (component, update) {
  component.$scope._setData(
    { ...component.$root.$data },
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
