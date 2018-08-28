import { shallowEqual } from '@tarojs/utils'

import { getStore } from '../utils/store'
import { mergeObjects, isObject } from '../utils'

function isEqual (a, b) {
  const typeA = typeof a
  const typeB = typeof b
  if (typeA !== typeB) {
    return false
  }
  if (typeA === 'object') {
    return shallowEqual(a, b)
  }
  return a === b
}

export default function connect (mapStateToProps, mapDispatchToProps) {
  const store = getStore()
  const dispatch = store.dispatch
  const initMapDispatch = typeof mapDispatchToProps === 'function' ? mapDispatchToProps(dispatch) : {}
  initMapDispatch.dispatch = dispatch

  const stateListener = function () {
    let isChanged = false
    const newMapState = mapStateToProps(store.getState())
    Object.keys(newMapState).forEach(key => {
      let val = newMapState[key]
      if (isObject(val) && isObject(initMapDispatch[key])) {
        val = mergeObjects(val, initMapDispatch[key])
      }
      if (!isEqual(this.props[key], val)) {
        this.prevProps = Object.assign({}, this.props)
        this.props[key] = val
        isChanged = true
      }
    })
    if (isChanged) {
      this._unsafeCallUpdate = true
      this.setState({}, () => {
        delete this._unsafeCallUpdate
      })
    }
  }

  return function connectComponent (Component) {
    let unSubscribe = null
    return class Connect extends Component {
      constructor () {
        super(Object.assign(...arguments, mergeObjects(mapStateToProps(store.getState()), initMapDispatch)))
        Object.keys(initMapDispatch).forEach(key => {
          this[`__event_${key}`] = initMapDispatch[key]
        })
      }

      componentWillMount () {
        const store = getStore()
        Object.assign(this.props, mergeObjects(mapStateToProps(store.getState()), initMapDispatch))
        unSubscribe = store.subscribe(stateListener.bind(this))
        if (super.componentWillMount) {
          super.componentWillMount()
        }
      }

      componentWillUnmount () {
        if (super.componentWillUnmount) {
          super.componentWillUnmount()
        }
        if (unSubscribe) {
          unSubscribe()
        }
        unSubscribe = null
      }
    }
  }
}
