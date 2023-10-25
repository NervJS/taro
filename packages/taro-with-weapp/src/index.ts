import { Func, getCurrentInstance } from '@tarojs/runtime'
import { ComponentLifecycle, createIntersectionObserver, createMediaQueryObserver,createSelectorQuery, eventCenter, nextTick } from '@tarojs/taro'

import { clone } from './clone'
import { diff } from './diff'
import { appOptions, lifecycleMap, lifecycles, TaroLifeCycles, uniquePageLifecycle } from './lifecycle'
import { bind, flattenBehaviors, isEqual, nonsupport, report, safeGet, safeSet } from './utils'

type Observer = (newProps, oldProps, changePath: string) => void

interface ObserverProperties {
  name: string
  observer: string | Observer
}

interface ComponentClass<P = Record<string, any>, S = Record<string, any>> extends ComponentLifecycle<P, S> {
  new (props: P)
  externalClasses: Record<string, unknown>
  defaultProps?: Partial<P>
  _observeProps?: ObserverProperties[]
  observers?: Record<string, Func>
}

interface WxOptions {
  methods?: Record<string, Func>
  properties?: Record<string, Record<string, unknown> | Func>
  props?: Record<string, unknown>
  data?: Record<string, unknown>
  observers?: Record<string, Func>
  lifetimes?: Record<string, Func>
  behaviors?: any[]
}

function defineGetter (component, key: string, getter: string) {
  Object.defineProperty(component, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      if (getter === 'props') {
        return component.props
      }
      return {
        ...component.state,
        ...component.props
      }
    }
  })
}

function isFunction (o): o is Func {
  return typeof o === 'function'
}    

export default function withWeapp (weappConf: WxOptions, isApp = false) {
  if (typeof weappConf === 'object' && Object.keys(weappConf).length === 0) {
    report('withWeapp 请传入“App/页面/组件“的配置对象。如果原生写法使用了基类，请将基类组合后的配置对象传入，详情请参考文档。')
  }
  return (ConnectComponent: ComponentClass<any, any>) => {
    const behaviorMap = new Map<string, any[]>([
      ['properties', []],
      ['data', []],
      ['methods', []],
      ['created', []],
      ['attached', []],
      ['ready', []],
      ['detached', []],
      ['lifetimes', []]
    ])
    const behaviorProperties = {}
    if (weappConf.behaviors?.length) {
      const { behaviors } = weappConf
      behaviors.forEach(behavior => flattenBehaviors(behavior, behaviorMap))

      const propertiesList = behaviorMap.get('properties')!
      if (propertiesList.length) {
        propertiesList.forEach(property => {
          Object.assign(behaviorProperties, property)
        })
        Object.keys(behaviorProperties).forEach(propName => {
          const propValue = behaviorProperties[propName]
          if (!weappConf.properties) {
            weappConf.properties = {}
          }
          if (!weappConf.properties.hasOwnProperty(propName)) {
            if (propValue && typeof propValue === 'object' && propValue.value) {
              propValue.value = clone(propValue.value)
            }
            weappConf.properties[propName] = propValue
          }
        })
      }
    }

    class BaseComponent<P = Record<string, any>, S extends Record<string, any> = Record<string, any>> extends ConnectComponent {
      private _observeProps: ObserverProperties[] = []

      // mixins 可以多次调用生命周期
      private willMounts: Func[] = []

      private didMounts: Func[] = []

      private didHides: Func[] = []

      private didShows: Func[] = []

      private willUnmounts: Func[] = []

      private eventDestroyList: Func[] = []

      private current: any = getCurrentInstance()

      public observers?: Record<string, Func>

      public taroGlobalData: Record<any, any> = Object.create(null)

      public data: any

      constructor (props) {
        super(props)
        this.state = this.state || {}
        this.init(weappConf)
        defineGetter(this, 'data', 'state')
        defineGetter(this, 'properties', 'props')
      }

      private initProps (props: any) {
        for (const propKey in props) {
          if (props.hasOwnProperty(propKey)) {
            const propValue = props[propKey]
            // propValue 可能是 null, 构造函数, 对象
            if (propValue && !isFunction(propValue)) {
              if (propValue.observer) {
                this._observeProps.push({
                  name: propKey,
                  observer: propValue.observer
                })
              }
            }
          }
        }
      }

      private init (options: WxOptions) {
        // 处理 Behaviors
        if (options.behaviors?.length) {
          for (const [key, list] of behaviorMap.entries()) {
            switch (key) {
              case 'created':
              case 'attached':
              case 'detached':
              case 'ready':
                list.forEach(fn => this.initLifeCycles(key, fn))
                break
            }
          }
        }

        for (const confKey in options) {
          // 不支持的属性
          if (nonsupport.has(confKey)) {
            const advise = nonsupport.get(confKey)
            report(advise)
          }

          const confValue = options[confKey]

          switch (confKey) {
            case 'behaviors':
              break
            case 'data': {
              if (isApp) {
                this[confKey] = confValue
                if (!appOptions.includes(confKey)) {
                  this.defineProperty(this.taroGlobalData, confKey, this)
                }
              } else {
                this.state = {
                  ...confValue,
                  ...this.state
                }
              }
              break
            }
            case 'properties':
              this.initProps(Object.assign(behaviorProperties, confValue))
              break
            case 'methods':
              for (const key in confValue) {
                const method = confValue[key]
                this[key] = bind(method, this)
              }
              break
            case 'lifetimes':
              for (const key in confValue) {
                this.initLifeCycles(key, confValue[key])
              }
              break
            case 'pageLifetimes':
              for (const key in confValue) {
                const cb = confValue[key]
                switch (key) {
                  case 'show': {
                    this.initLifeCycleListener('show', cb)
                    break
                  }
                  case 'hide': {
                    this.initLifeCycleListener('hide', cb)
                    break
                  }
                  case 'resize': {
                    report('不支持组件所在页面的生命周期 pageLifetimes.resize。')
                    break
                  }
                }
              }
              break
            default:
              if (lifecycles.has(confKey)) {
                // 优先使用 lifetimes 中定义的生命周期
                if (options.lifetimes?.[confKey]) {
                  break
                }

                const lifecycle = options[confKey]
                this.initLifeCycles(confKey, lifecycle)
              } else if (isFunction(confValue)) {
                this[confKey] = bind(confValue, this)

                if (isApp && !appOptions.includes(confKey)) {
                  this.defineProperty(this.taroGlobalData, confKey, this)
                }

                // 原生页面和 Taro 页面中共计只能定义一次的生命周期
                if (uniquePageLifecycle.includes(confKey) && ConnectComponent.prototype[confKey]) {
                  report(`生命周期 ${confKey} 已在原生部分进行定义，React 部分的定义将不会被执行。`)
                }
              } else {
                this[confKey] = confValue

                if (isApp && !appOptions.includes(confKey)) {
                  this.defineProperty(this.taroGlobalData, confKey, this)
                }
              }

              break
          }
        }

        // 处理 Behaviors
        if (options.behaviors?.length) {
          const behaviorData = {}
          const methods = {}
          for (const [key, list] of behaviorMap.entries()) {
            switch (key) {
              case 'data':
                [...list, this.state].forEach((dataObject, index) => {
                  Object.keys(dataObject).forEach(dataKey => {
                    const value = dataObject[dataKey]
                    const preValue = behaviorData[dataKey]
                    const valueType = typeof value
                    const preValueType = typeof preValue
                    if (valueType === 'object') {
                      if (!value) {
                        behaviorData[dataKey] = value
                      } else if (preValueType !== 'object' || !preValueType || Array.isArray(value)) {
                        behaviorData[dataKey] = index === list.length ? value : clone(value)
                      } else {
                        const newVal = Object.assign({}, preValue, value)
                        behaviorData[dataKey] = index === list.length ? newVal : clone(newVal)
                      }
                    } else {
                      behaviorData[dataKey] = value
                    }
                  })
                })
                this.state = behaviorData
                break
              case 'methods':
                list.forEach(methodsObject => {
                  Object.assign(methods, methodsObject)
                })
                Object.keys(methods).forEach(methodName => {
                  if (!this[methodName]) {
                    const method = methods[methodName]
                    this[methodName] = bind(method, this)
                  }
                })
                break
              case 'lifetimes':
                list.forEach(lifetimesObject => {
                  for (const key in lifetimesObject) {
                    this.initLifeCycles(key, lifetimesObject[key])
                  }
                })
                break
              default:
                break
            }
          }
        }
      }

      private initLifeCycles (lifecycleName: string, lifecycle: Func) {
        // 不支持的生命周期
        if (nonsupport.has(lifecycleName)) {
          const advise = nonsupport.get(lifecycleName)
          return report(advise)
        }

        if (lifecycleName === 'ready') {
          // 如果组件是延时渲染的，页面 onReady 的事件已经 emit 了，因此使用 componentDidMount + nextTick 模拟
          if (this.current.page.onReady.called) {
            this.didMounts.push(function (...args: unknown[]) {
              nextTick(() => {
                if (isFunction(lifecycle)) {
                  lifecycle.apply(this, args)
                }
              })
            })
          } else {
            this.initLifeCycleListener('ready', lifecycle)
          }
        } else {
          for (const lifecycleKey in lifecycleMap) {
            const cycleNames = lifecycleMap[lifecycleKey]
            if (cycleNames.indexOf(lifecycleName) !== -1) {
              switch (lifecycleKey) {
                case TaroLifeCycles.DidHide:
                  this.didHides.push(lifecycle)
                  break
                case TaroLifeCycles.DidMount:
                  this.didMounts.push(lifecycle)
                  break
                case TaroLifeCycles.DidShow:
                  this.didShows.push(lifecycle)
                  break
                case TaroLifeCycles.WillMount:
                  this.willMounts.push(lifecycle)
                  break
                case TaroLifeCycles.WillUnmount:
                  this.willUnmounts.push(lifecycle)
                  break
                default:
                  break
              }
            }
          }
        }

        // mixins 不会覆盖已经设置的生命周期，加入到 this 是为了形如 this.created() 的调用
        if (!isFunction(this[lifecycleName])) {
          this[lifecycleName] = lifecycle
        }
      }

      private safeExecute = (func?: Func, ...args: unknown[]) => {
        if (isFunction(func)) func.apply(this, args)
      }

      private initLifeCycleListener (name: string, cb: (...args: any[]) => void) {
        // 组件的 ready、show、hide 需要利用页面事件触发
        const { router } = this.current
        const lifecycleName = `on${name[0].toUpperCase()}${name.slice(1)}`
        cb = cb.bind(this)
        router?.[lifecycleName] && eventCenter.on(router[lifecycleName], cb)
        // unMount 时需要取消事件监听
        this.eventDestroyList.push(() => eventCenter.off(router[lifecycleName], cb))
      }

      private executeLifeCycles (funcs: Func[], ...args: unknown[]) {
        for (let i = 0; i < funcs.length; i++) {
          const func = funcs[i]
          this.safeExecute(func, ...args)
        }
      }

      private triggerPropertiesObservers (prevProps, nextProps) {
        this._observeProps.forEach(({ name: key, observer }) => {
          const prop = prevProps?.[key]
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

      private triggerObservers (current, prev) {
        const observers = this.observers
        if (observers == null) {
          return
        }

        if (Object.keys(observers).length === 0) {
          return
        }

        const result = diff(current, prev)
        const resultKeys = Object.keys(result)
        if (resultKeys.length === 0) {
          return
        }

        for (const observerKey in observers) {
          if (/\*\*/.test(observerKey)) {
            report('数据监听器 observers 不支持使用通配符 **。')
            continue
          }

          const keys = observerKey.split(',').map(k => k.trim())
          let isModified = false

          for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            for (let j = 0; j < resultKeys.length; j++) {
              const resultKey = resultKeys[j]
              if (
                resultKey.startsWith(key) ||
                (key.startsWith(resultKey) && key.endsWith(']'))
              ) {
                isModified = true
              }
            }
          }
          if (isModified) {
            observers[observerKey].apply(this, keys.map(key => safeGet(current, key)))
          }
        }
      }

      private defineProperty (target, key, data) {
        Object.defineProperty(target, key, {
          configurable: true,
          enumerable: true,
          set (value) {
            data[key] = value
          },
          get () {
            return data[key]
          }
        })
      }

      public privateStopNoop (...args) {
        let e
        let fn
        if (args.length === 2) {
          fn = args[0]
          e = args[1]
        } else if (args.length === 1) {
          e = args[0]
        }
        if (e.type === 'touchmove') {
          report('catchtouchmove 转换后只能停止回调函数的冒泡，不能阻止滚动穿透。如要阻止滚动穿透，可以手动给编译后的 View 组件加上 catchMove 属性')
        }
        e.stopPropagation()
        isFunction(fn) && fn(e)
      }

      // ================ React 生命周期 ================

      public componentWillMount () {
        this.safeExecute(super.componentWillMount)
        this.executeLifeCycles(this.willMounts, this.current.router || {})
        this.triggerObservers(this.data, BaseComponent.defaultProps)
        this.triggerPropertiesObservers(BaseComponent.defaultProps, this.props)
      }

      public componentDidMount () {
        this.safeExecute(super.componentDidMount)
        this.executeLifeCycles(this.didMounts)
      }

      public componentWillUnmount () {
        this.eventDestroyList.forEach(fn => fn())
        this.safeExecute(super.componentWillUnmount)
        this.executeLifeCycles(this.willUnmounts)
      }

      public componentDidHide () {
        this.safeExecute(super.componentDidHide)
        this.executeLifeCycles(this.didHides)
      }

      public componentDidShow () {
        this.safeExecute(super.componentDidShow, this.current.router || {})
        this.executeLifeCycles(this.didShows, this.current.router || {})
      }

      public componentWillReceiveProps (nextProps: P) {
        this.triggerObservers(nextProps, this.props)
        this.triggerPropertiesObservers(this.props, nextProps)
        this.safeExecute(super.componentWillReceiveProps)
      }

      // ================ 小程序 App, Page, Component 实例属性与方法 ================

      get is () {
        return this.current.page.is
      }

      get id () {
        return this.current.page.id
      }

      get dataset () {
        return this.current.page.dataset
      }

      public setData = (obj: S, callback?: () => void) => {
        let oldState
        if (this.observers && Object.keys(Object.keys(this.observers))) {
          oldState = clone(this.state)
        }
        Object.keys(obj).forEach(key => {
          safeSet(this.state, key, obj[key])
        })
        this.setState(this.state, () => {
          this.triggerObservers(this.state, oldState)
          if (callback) {
            callback.call(this)
          }
        })
      }

      public triggerEvent = (eventName: string, detail, options) => {
        if (options) {
          report('triggerEvent 不支持事件选项。')
        }

        // eventName support kebab case
        if (eventName.match(/[a-z]+-[a-z]+/g)) {
          eventName = eventName.replace(/-[a-z]/g, function (match) {
            return match[1].toUpperCase()
          })
        }

        const props = this.props
        const dataset = {}
        for (const key in props) {
          if (!key.startsWith('data-')) continue
          dataset[key.replace(/^data-/, '')] = props[key]
        }

        const func = props[`on${eventName[0].toUpperCase()}${eventName.slice(1)}`]
        if (isFunction(func)) {
          func.call(this, {
            type: eventName,
            detail,
            target: {
              id: props.id || '',
              dataset
            },
            currentTarget: {
              id: props.id || '',
              dataset
            }
          })
        }
      }

      private componentMethodsProxy (method: string) {
        return (...args: any[]) => {
          const page = this.current.page
          if (page?.[method]) {
            return page[method](...args)
          } else if (method === 'createSelectorQuery') {
            return createSelectorQuery()
          } else if (method === 'createIntersectionObserver') {
            // @ts-ignore
            return createIntersectionObserver(...args)
          } else if (method === 'createMediaQueryObserver') {
            return createMediaQueryObserver()
          } else {
            console.error(`page 下没有 ${method} 方法`)
          }
        }
      }

      public hasBehavior = this.componentMethodsProxy('hasBehavior')
      public createSelectorQuery = this.componentMethodsProxy('createSelectorQuery')
      public createIntersectionObserver = this.componentMethodsProxy('createIntersectionObserver')
      public createMediaQueryObserver = this.componentMethodsProxy('createMediaQueryObserver')
      public getRelationNodes = this.componentMethodsProxy('getRelationNodes')
      public getTabBar = this.componentMethodsProxy('getTabBar')
      public getPageId = this.componentMethodsProxy('getPageId')
      public animate = this.componentMethodsProxy('animate')
      public clearAnimation = this.componentMethodsProxy('clearAnimation')
      public setUpdatePerformanceListener = this.componentMethodsProxy('setUpdatePerformanceListener')

      public selectComponent () {
        report(nonsupport.get('selectComponent'))
      }

      public selectAllComponents () {
        report(nonsupport.get('selectAllComponents'))
      }

      public selectOwnerComponent () {
        report(nonsupport.get('selectOwnerComponent'))
      }

      public groupSetData () {
        report(nonsupport.get('groupSetData'))
      }
    }

    const props = weappConf.properties

    if (props) {
      for (const propKey in props) {
        const propValue = props[propKey]
        if (propValue != null && !isFunction(propValue)) {
          if (propValue.value !== undefined) { // 如果是 null 也赋值到 defaultProps
            BaseComponent.defaultProps = {
              [propKey]: propValue.value,
              ...BaseComponent.defaultProps
            }
          }
        }
      }
    }

    const staticOptions = ['externalClasses', 'relations', 'options']

    staticOptions.forEach(option => {
      const value = weappConf[option]
      if (value != null) {
        BaseComponent[option] = value
      }
    })

    return BaseComponent
  }
}

export * from './convert-tools'