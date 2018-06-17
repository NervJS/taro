import {Children, Component} from 'nervjs'

import * as PropTypes from './propTypes'

const specialReactKeys = {children: true, key: true, ref: true}

class Provider extends Component {
  static contextTypes = {
    mobxStores: PropTypes.objectOrObservableObject
  };

  static childContextTypes = {
    mobxStores: PropTypes.objectOrObservableObject.isRequired
  };

  constructor (props, context) {
    super(props, context)
    this.state = props || {}
  }

  render () {
    return Children.only(this.props.children)
  }

  getChildContext () {
    const stores = {}
    // inherit stores
    const baseStores = this.context.mobxStores
    if (baseStores) {
      for (let key in baseStores) {
        stores[key] = baseStores[key]
      }
    }
    // add own stores
    for (let key in this.state) {
      if (!specialReactKeys[key] && key !== 'suppressChangedStoreWarning') { stores[key] = this.props[key] }
    }
    return {
      mobxStores: stores
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!nextProps) return null
    if (!prevState) return nextProps

    // Maybe this warning is too aggressive?
    if (Object.keys(nextProps).length !== Object.keys(prevState).length) {
      console.warn(
        'MobX Provider: The set of provided stores has changed. Please avoid changing stores as the change might not propagate to all children'
      )
    }
    if (!nextProps.suppressChangedStoreWarning) {
      for (let key in nextProps) {
        if (!specialReactKeys[key] && prevState[key] !== nextProps[key]) {
          console.warn(
            "MobX Provider: Provided store '" +
              key +
              "' has changed. Please avoid replacing stores as the change might not propagate to all children"
          )
        }
      }
    }

    return nextProps
  }
}

export default Provider
