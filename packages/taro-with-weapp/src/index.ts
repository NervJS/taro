import { Component, ComponentLifecycle, eventCenter } from '@tarojs/taro'
import { getCurrentInstance } from '@tarojs/runtime'
import { lifecycles, lifecycleMap, TaroLifeCycles, uniquePageLifecycle } from './lifecycle'
import { bind, isEqual, safeGet, safeSet, report, unsupport } from './utils'
import { diff } from './diff'
import { clone } from './clone'

type Observer = (newProps, oldProps, changePath: string) => void

interface ObserverProperties {
  name: string,
  observer: string | Observer
}

interface ComponentClass<P = {}, S = {}> extends ComponentLifecycle<P, S> {
  new (props: P): Component<P, S>
  externalClasses: Record<string, unknown>
  defaultProps?: Partial<P>
  _observeProps?: ObserverProperties[]
  observers?: Record<string, Function>
}

interface WxOptions {
  methods?: {
    [key: string]: Function;
  }
  properties?: Record<string, Record<string, unknown> | Function>
  props?: Record<string, unknown>
  data?: Record<string, unknown>,
  observers?: Record<string, Function>
  lifetimes?: Record<string, Function>
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
        ...component.state,
        ...component.props
      }
    }
  })
}

function isFunction (o): o is Function {
  return typeof o === 'function'
}

export default function withWeapp (weappConf: WxOptions) {
  if (typeof weappConf === 'object' && Object.keys(weappConf).length === 0) {
    report('withWeapp 请传入“App/页面/组件“的配置对象。如果原生写法使用了基类，请将基类组合后的配置对象传入，详情请参考文档。')
  }
  return (ConnectComponent: ComponentClass<any, any>) => {
    class BaseComponent<P = {}, S = {}> extends ConnectComponent {
      private _observeProps: ObserverProperties[] = []

      // mixins 可以多次调用生命周期
      private willMounts: Function[] = []

      private didMounts: Function[] = []

      private didHides: Function[] = []

      private didShows: Function[] = []

      private willUnmounts: Function[] = []

      private eventDistoryList: Function[] = []

      private current = getCurrentInstance()

      public observers?: Record<string, Function>

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
        for (const confKey in options) {
          // 不支持的属性
          if (unsupport.has(confKey)) {
            const advise = unsupport.get(confKey)
            report(advise)
          }

          const confValue = options[confKey]

          switch (confKey) {
            case 'data': {
              this.state = {
                ...confValue,
                ...this.state
              }
              break
            }
            case 'properties':
              this.initProps(confValue)
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

                // 原生页面和 Taro 页面中共计只能定义一次的生命周期
                if (uniquePageLifecycle.includes(confKey) && ConnectComponent.prototype[confKey]) {
                  report(`生命周期 ${confKey} 已在原生部分进行定义，React 部分的定义将不会被执行。`)
                }
              } else {
                this[confKey] = confValue
              }

              break
          }
        }
      }

      private initLifeCycles (lifecycleName: string, lifecycle: (...args: any[]) => any) {
        // 不支持的生命周期
        if (unsupport.has(lifecycleName)) {
          const advise = unsupport.get(lifecycleName)
          return report(advise)
        }

        if (lifecycleName === 'ready') {
          return this.initLifeCycleListener('ready', lifecycle)
        }

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

        // mixins 不会覆盖已经设置的生命周期，加入到 this 是为了形如 this.created() 的调用
        if (!isFunction(this[lifecycleName])) {
          this[lifecycleName] = lifecycle
        }
      }

      private safeExecute = (func?: Function, ...args: unknown[]) => {
        if (isFunction(func)) func.apply(this, args)
      }

      private initLifeCycleListener (name: string, cb: (...args: any[]) => void) {
        // 组件的 ready、show、hide 需要利用页面事件触发
        const { router } = this.current
        const lifecycleName = `on${name[0].toUpperCase()}${name.slice(1)}`
        cb = cb.bind(this)
        router?.[lifecycleName] && eventCenter.on(router[lifecycleName], cb)
        // unMount 时需要取消事件监听
        this.eventDistoryList.push(() => eventCenter.off(router[lifecycleName], cb))
      }

      private executeLifeCycles (funcs: Function[], ...args: unknown[]) {
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
        this.eventDistoryList.forEach(fn => fn())
        this.safeExecute(super.componentWillUnmount)
        this.executeLifeCycles(this.willUnmounts)
      }

      public componentDidHide () {
        this.safeExecute(super.componentDidHide)
        this.executeLifeCycles(this.didHides)
      }

      public componentDidShow () {
        this.safeExecute(super.componentDidShow)
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
            page[method](...args)
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
        report(unsupport.get('selectComponent'))
      }

      public selectAllComponents () {
        report(unsupport.get('selectAllComponents'))
      }

      public selectOwnerComponent () {
        report(unsupport.get('selectOwnerComponent'))
      }

      public groupSetData () {
        report(unsupport.get('groupSetData'))
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
