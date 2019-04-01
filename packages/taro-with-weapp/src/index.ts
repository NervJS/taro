import { Component, ComponentLifecycle, getEnv, internal_safe_set as safeSet } from '@tarojs/taro'
import isEqual from 'lodash/isEqual'

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
  onLoad?: WeappLifeCycle,
  onShow?: WeappLifeCycle,
  onReady?: WeappLifeCycle,
  onHide?: WeappLifeCycle,
  onUnload?: WeappLifeCycle,
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
    get: () => {
      if (getter === 'props') {
        return component.props
      }
      return {
        ...component.props,
        ...component.state
      }
    }
  })
}

function isFunction (o): o is Function {
  return typeof o === 'function'
}

export default function withWeapp (componentType: string, weappConf?: Object) {
  const isComponent = componentType === 'Component'

  return (ConnectComponent: ComponentClass) => {
    class BaseComponent<_ = {}, S = {}> extends ConnectComponent {
      constructor (props) {
        super(props)
        defineGetter(this, 'data', 'state')
        if (isComponent) {
          defineGetter(this, 'properties', 'props')
        }
      }

      private safeExecute = (func?: Function, ...arg: any[]) => {
        if (func) func.apply(this, arg)
      }

      private executeComponentFunc = (func?: Function, ...args: any[]) => {
        if (isComponent) {
          this.safeExecute(func, args)
        }
      }

      setData = (obj: S) => {
        const state = Object.assign({}, this.state)
        Object.keys(obj).forEach(key => {
          safeSet(state, key, obj[key])
        })
        Object.assign(this.state, state)
        this.setState(state)
      }

      triggerEvent = (eventName: string, ...args: any[]) => {
        if (typeof eventName !== 'string') {
          throw new Error('triggerEvent 第一个参数必须是字符串')
        }
        const fullEventName = `on${eventName}`
        if (getEnv() === 'WEB') {
          const func = this.props[`on${eventName[0].slice(0, 1)}${eventName.slice(1)}`]
          if (typeof func === 'function') {
            func(...args)
          }
        } else {
          this.$scope.triggerEvent(fullEventName.toLowerCase(), ...args)
        }
      }

      componentWillReceiveProps (nextProps: _) {
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
        this.safeExecute(this.onLoad)
        if (super.componentWillMount) {
          super.componentWillMount.call(this, this.$router.params || {})
        }
      }

      componentDidHide () {
        this.safeExecute(this.onHide)
        this.safeExecute(super.componentDidHide)
      }

      componentDidShow () {
        this.safeExecute(this.onShow)
        this.safeExecute(super.componentDidShow)
      }

      componentDidMount () {
        this.executeComponentFunc(this.attached)
        this.safeExecute(super.componentDidMount)
        this.executeComponentFunc(this.ready)
        this.safeExecute(this.onReady)
      }

      componentWillUnmount () {
        this.safeExecute(super.componentWillUnmount)
        this.safeExecute(this.onUnload)
        this.executeComponentFunc(this.detached)
      }
    }

    if (weappConf) {
      for (const confKey in weappConf) {
        if (weappConf.hasOwnProperty(confKey)) {
          const confValue = weappConf[confKey]
          if (confKey === 'data') {
            BaseComponent.prototype.state = confValue
          } else if (confKey === 'properties') {
            for (const propKey in confValue) {
              if (confValue.hasOwnProperty(propKey)) {
                const propValue = confValue[propKey]
                if (typeof propValue !== 'function') {
                  if (propValue.value) {
                    (BaseComponent as any).defaultProps = {
                      [propKey]: propValue.value
                    }
                  }
                  if (propValue.observer) {
                    if (!BaseComponent.prototype._observeProps) {
                      BaseComponent.prototype._observeProps = []
                    }
                    BaseComponent.prototype._observeProps.push({
                      name: propKey,
                      observer: propValue.observer
                    })
                  }
                }
              }
            }
          } else {
            BaseComponent.prototype[confKey] = confValue
          }
        }
      }
    }
    return BaseComponent
  }
}
