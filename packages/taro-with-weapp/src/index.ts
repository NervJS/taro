import Taro, { Component, ComponentLifecycle, internal_safe_set as safeSet } from '@tarojs/taro'

type WeappLifeCycle = () => void

interface WeappComponent<P, S> extends Component<P, S> {
  created?: WeappLifeCycle
  ready?: WeappLifeCycle
  detached?: WeappLifeCycle
  attached?: WeappLifeCycle
  moved?: WeappLifeCycle,
  globalData?: any,
  setData: Function
}

interface ComponentClass<P = {}, S = {}> extends ComponentLifecycle<P, S> {
  new (props: P): WeappComponent<P, S>
}

function defineGetter (component: Component, key: string, getter: string) {
  Object.defineProperty(component, key, {
    enumerable: true,
    configurable: true,
    get: () => component[getter]
  })
}

export default function withWeapp (componentType: string) {
  const isComponent = componentType === 'Component'

  return (ConnectComponent: ComponentClass) => class BaseComponent<_ = {}, S = {}> extends ConnectComponent {
    constructor (props) {
      super(props)
      defineGetter(this, 'data', 'state')
      if (isComponent) {
        defineGetter(this, 'properties', 'props')
      }
    }

    private safeExecute = (func?: Function, ...arg) => {
      if (func) func.apply(this, arg)
    }

    private executeComponentFunc = (func?: Function, ...args) => {
      if (isComponent) {
        this.safeExecute(func, args)
      }
    }

    setData = (obj: S) => {
      const state = Object.assign({}, this.state)
      Object.keys(obj).forEach(key => {
        safeSet(state, key, obj[key])
      })
      this.setState(state)
    }

    componentWillMount () {
      this.executeComponentFunc(this.created)
      this.safeExecute(super.componentWillMount)
    }

    componentDidMount () {
      this.executeComponentFunc(this.attached)
      this.safeExecute(super.componentDidMount)
      this.executeComponentFunc(this.ready)
    }

    componentWillUnmount () {
      this.safeExecute(super.componentWillUnmount)
      this.executeComponentFunc(this.detached)
    }

  }
}
