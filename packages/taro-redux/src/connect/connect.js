import { getStore } from '../utils/store'

export default function connect (mapStateToProps, mapDispatchToProps) {
  const store = getStore()
  const dispatch = store.dispatch
  const initMapDispatch = typeof mapDispatchToProps === 'function' ? mapDispatchToProps(dispatch) : {}

  const stateListener = function () {
    let isChanged = false
    const newMapState = mapStateToProps(store.getState())
    Object.keys(newMapState).forEach(key => {
      const val = newMapState[key]
      if (this.props[key] !== val) {
        this.props[key] = val
        isChanged = true
      }
    })
    if (isChanged) {
      this.setState({})
    }
  }

  return function connectComponent (Component) {
    let unSubscribe = null
    return class Connect extends Component {
      constructor () {
        super(Object.assign(...arguments, mapStateToProps(store.getState()), initMapDispatch))
        Object.keys(initMapDispatch).forEach(key => {
          this[`__event_${key}`] = initMapDispatch[key]
        })
      }

      componentWillMount () {
        const store = getStore()
        Object.assign(this.props, mapStateToProps(store.getState()), initMapDispatch)
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
