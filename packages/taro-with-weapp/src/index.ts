import {
  Component,
  ComponentLifecycle,
  internal_safe_set as safeSet
} from '@tarojs/taro'
import isEqual from 'lodash.isequal'

type WeappLifeCycle = () => void
type Observer = (newProps, oldProps, changePath: string) => void

interface ObserverProperties {
  name: string,
  observer: string | Observer
}

interface WeappComponent<P, S> extends Component<P, S> {
  created?: WeappLifeCycle
  ready?: WeappLifeCycle
  detached?: WeappLifeCycle
  attached?: WeappLifeCycle
  moved?: WeappLifeCycle,
  globalData?: any,
  setData: Function
  _observeProps?: ObserverProperties[]
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

function isFunction (o): o is Function {
  return typeof o === 'function'
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

    componentWillReceiveProps (nextProps) {
      if (Array.isArray(this._observeProps)) {
        this._observeProps.forEach(({ name: key, observer }) => {
          const prop = this.props[key]
          const nextProp = nextProps[key]
          // 小程序是深比较不同之后才 trigger observer
          if (!isEqual(prop, nextProp)) {
            if (typeof observer === 'string') {
              const ob = this[observer]
              if (isFunction(ob)) {
                ob.call(this, nextProp, prop, key)
              }
            } else if (isFunction(observer)) {
              observer.call(this, nextProp, prop, key)
            }
          }
        })
      }
      this.executeComponentFunc(super.componentWillReceiveProps)
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
