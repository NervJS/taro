import { getStore } from '../utils/store'

export function connect (mapStateToProps, mapDispatchToProps) {
  const store = getStore()
  const state = store.getState()
  const dispatch = store.dispatch
  const initMapState = mapStateToProps(state)
  const initMapDispatch = mapDispatchToProps(dispatch)

  const stateListener = function () {
    let isChanged = false
    const newMapState = mapStateToProps(store.getState())
    Object.keys(newMapState).forEach(key => {
      const val = newMapState[key]
      if (this.props[key] !== val) {
        this.props[key] = key
        isChanged = true
      }
    })
    if (isChanged) {
      this.props = Object.assign(this.props, newMapState)
      this.setState({})
    }
  }

  return function connectComponent (Component) {
    let unSubscribe = null
    return class Connect extends Component {
      constructor () {
        super(...arguments)
        this.props = Object.assign(this.props, initMapState)
        Object.keys(initMapDispatch).forEach(key => {
          this[`__event_${key}`] = initMapDispatch[key]
        })
      }

      componentWillMount () {
        const store = getStore()
        unSubscribe = store.subscribe(stateListener.bind(this))
        super.componentWillMount()
      }

      componentWillUnmount () {
        if (unSubscribe) {
          unSubscribe()
        }
        unSubscribe = null
        super.componentWillUnmount()
      }
    }
  }
}
