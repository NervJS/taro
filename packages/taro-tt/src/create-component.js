import { getCurrentPageUrl } from '@tarojs/utils'
import { commitAttachRef, detachAllRef, Current, eventCenter } from '@tarojs/taro'
import { isEmptyObject, isFunction, isArray } from './util'
import { mountComponent, updateComponent } from './lifecycle'
import { cacheDataSet, cacheDataGet, cacheDataHas } from './data-cache'
import propsManager from './propsManager'
import nextTick from './next-tick'

const anonymousFnNamePreffix = 'funPrivate'
const preloadPrivateKey = '__preload_'
const preloadInitedComponent = '$preloadComponent'
const PRELOAD_DATA_KEY = 'preload'
const pageExtraFns = ['onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap']

function bindProperties (weappComponentConf, ComponentClass, isPage) {
  weappComponentConf.properties = {}
  if (isPage) {
    weappComponentConf.properties[preloadPrivateKey] = {
      type: null,
      value: null
    }
  }
  weappComponentConf.properties.compid = {
    type: null,
    value: null,
    observer (newVal, oldVal) {
      // 头条基础库1.38.2后，太早 setData $taroCompReady 为 true 时，setData 虽然成功，但 slot 会不显示。
      // 因此不在 observer 里 initComponent，在组件 attached 时 initComponent 吧。
      // initComponent.apply(this, [ComponentClass, isPage])
      if (oldVal && oldVal !== newVal) {
        const { extraProps } = this.data
        const component = this.$component
        propsManager.observers[newVal] = {
          component,
          ComponentClass: component.constructor
        }
        const nextProps = filterProps(component.constructor.defaultProps, propsManager.map[newVal], component.props, extraProps || null)
        this.$component.props = nextProps
        nextTick(() => {
          this.$component._unsafeCallUpdate = true
          updateComponent(this.$component)
          this.$component._unsafeCallUpdate = false
        })
      }
    }
  }
}

function bindBehaviors (weappComponentConf, ComponentClass) {
  if (ComponentClass.behaviors) {
    weappComponentConf.behaviors = ComponentClass.behaviors
  }
}

function bindStaticOptions (weappComponentConf, ComponentClass) {
  if (ComponentClass.options) {
    weappComponentConf.options = ComponentClass.options
  }
}

function bindStaticFns (weappComponentConf, ComponentClass) {
  for (const key in ComponentClass) {
    typeof ComponentClass[key] === 'function' && (weappComponentConf[key] = ComponentClass[key])
  }
  // 低版本 IOS 下部分属性不能直接访问
  Object.getOwnPropertyNames(ComponentClass).forEach(key => {
    const excludes = ['arguments', 'caller', 'length', 'name', 'prototype']
    if (excludes.indexOf(key) < 0) {
      typeof ComponentClass[key] === 'function' && (weappComponentConf[key] = ComponentClass[key])
    }
  })
}

function processEvent (eventHandlerName, obj) {
  if (obj[eventHandlerName]) return

  obj[eventHandlerName] = function (event) {
    if (event) {
      event.preventDefault = function () {}
      event.stopPropagation = function () {}
      event.currentTarget = event.currentTarget || event.target || {}
      if (event.target) {
        Object.assign(event.target, event.detail)
      }
      Object.assign(event.currentTarget, event.detail)
    }

    const scope = this.$component
    let callScope = scope
    const isAnonymousFn = eventHandlerName.indexOf(anonymousFnNamePreffix) > -1
    let realArgs = []
    let detailArgs = []
    let datasetArgs = []
    let isScopeBinded = false
    // 解析从dataset中传过来的参数
    const dataset = event.currentTarget.dataset || {}
    const bindArgs = {}
    const eventType = event.type ? event.type.toLocaleLowerCase() : null

    if (event.detail && event.detail.__detail) Object.assign(dataset, event.detail.__detail)

    Object.keys(dataset).forEach(key => {
      let keyLower = key.toLocaleLowerCase()
      if (/^e/.test(keyLower)) {
        // 小程序属性里中划线后跟一个下划线会解析成不同的结果
        keyLower = keyLower.replace(/^e/, '')
        if (keyLower.indexOf(eventType) >= 0) {
          const argName = keyLower.replace(eventType, '')
          if (/^(a[a-z]|so)$/.test(argName)) {
            bindArgs[argName] = dataset[key]
          }
        }
      }
    })
    // 如果是通过triggerEvent触发,并且带有参数
    if (event.detail && event.detail.__arguments && event.detail.__arguments.length > 0) {
      detailArgs = event.detail.__arguments
    }
    // 普通的事件（非匿名函数），会直接call
    if (!isAnonymousFn) {
      if ('so' in bindArgs) {
        if (bindArgs['so'] !== 'this') {
          callScope = bindArgs['so']
        }
        isScopeBinded = true
        delete bindArgs['so']
      }
      if (detailArgs.length > 0) {
        !isScopeBinded && detailArgs[0] && (callScope = detailArgs[0])
        detailArgs.shift()
      }
      if (!isEmptyObject(bindArgs)) {
        datasetArgs = Object.keys(bindArgs)
          .sort()
          .map(key => bindArgs[key])
      }
      realArgs = [...datasetArgs, ...detailArgs, event]
    } else {
      // 匿名函数，会将scope作为第一个参数
      let _scope = null
      if ('so' in bindArgs) {
        if (bindArgs['so'] !== 'this') {
          _scope = bindArgs['so']
        }
        isScopeBinded = true
        delete bindArgs['so']
      }
      if (detailArgs.length > 0) {
        !isScopeBinded && detailArgs[0] && (callScope = detailArgs[0])
        detailArgs.shift()
      }
      if (!isEmptyObject(bindArgs)) {
        datasetArgs = Object.keys(bindArgs)
          .sort()
          .map(key => bindArgs[key])
      }
      realArgs = [_scope, ...datasetArgs, ...detailArgs, event]
    }
    return scope[eventHandlerName].apply(callScope, realArgs)
  }
}

function bindEvents (weappComponentConf, events, isPage) {
  weappComponentConf.methods = weappComponentConf.methods || {}
  const target = isPage ? weappComponentConf : weappComponentConf.methods
  events.forEach(name => {
    processEvent(name, target)
  })
}

export function filterProps (defaultProps = {}, propsFromPropsManager = {}, curAllProps = {}) {
  let newProps = Object.assign({}, curAllProps, propsFromPropsManager)

  if (!isEmptyObject(defaultProps)) {
    for (const propName in defaultProps) {
      if (newProps[propName] === undefined) {
        newProps[propName] = defaultProps[propName]
      }
    }
  }
  return newProps
}

export function componentTrigger (component, key, args) {
  args = args || []

  if (key === 'componentDidMount') {
    if (component['$$hasLoopRef']) {
      Current.current = component
      Current.index = 0
      component._disableEffect = true
      component._createData(component.state, component.props, true)
      component._disableEffect = false
      Current.current = null
    }

    if (component['$$refs'] && component['$$refs'].length > 0) {
      let refs = {}
      const refComponents = []
      component['$$refs'].forEach(ref => {
        refComponents.push(new Promise((resolve, reject) => {
          const query = tt.createSelectorQuery().in(component.$scope)
          if (ref.type === 'component') {
            component.$scope.selectComponent(`#${ref.id}`, target => {
              resolve({
                target: target ? target.$component || target : null,
                ref
              })
            })
          } else {
            resolve({
              target: query.select(`#${ref.id}`),
              ref
            })
          }
        }))
      })
      Promise.all(refComponents)
        .then(targets => {
          targets.forEach(({ ref, target }) => {
            commitAttachRef(ref, target, component, refs, true)
            ref.target = target
          })
          component.refs = Object.assign({}, component.refs || {}, refs)
          // 此处执行componentDidMount
          component[key] && typeof component[key] === 'function' && component[key](...args)
        })
        .catch(err => {
          console.error(err)
          component[key] && typeof component[key] === 'function' && component[key](...args)
        })
        // 此处跳过执行componentDidMount，在refComponents完成后再次执行
      return
    }
  }

  if (key === 'componentWillUnmount') {
    const compid = component.$scope.data.compid
    if (compid) propsManager.delete(compid)
  }

  component[key] && typeof component[key] === 'function' && component[key](...args)
  if (key === 'componentWillUnmount') {
    component._dirty = true
    component._disable = true
    component.$router = {
      params: {},
      path: ''
    }
    component._pendingStates = []
    component._pendingCallbacks = []
    // refs
    detachAllRef(component)
  }
  if (key === 'componentWillMount') {
    component._dirty = false
    component._disable = false
    component.state = component.getState()
  }
}

let hasPageInited = false

function initComponent (ComponentClass, isPage) {
  if (!this.$component || this.$component.__isReady) return
  // ready之后才可以setData,
  // ready之前，小程序组件初始化时仍然会触发observer，__isReady为否的时候放弃处理observer
  this.$component.__isReady = true

  if (isPage && !hasPageInited) {
    hasPageInited = true
  }
  // 页面Ready的时候setData更新，此时并未didMount,触发observer但不会触发子组件更新
  // 小程序组件ready，但是数据并没有ready，需要通过updateComponent来初始化数据，setData完成之后才是真正意义上的组件ready
  // 动态组件执行改造函数副本的时,在初始化数据前计算好props
  if (hasPageInited && !isPage) {
    const compid = this.data.compid
    if (compid) {
      propsManager.observers[compid] = {
        component: this.$component,
        ComponentClass
      }
    }
    const nextProps = filterProps(ComponentClass.defaultProps, propsManager.map[compid], this.$component.props)
    this.$component.props = nextProps
  }
  if (hasPageInited || isPage) {
    mountComponent(this.$component)
  }
}

function createComponent (ComponentClass, isPage) {
  let initData = {}
  const componentProps = filterProps(ComponentClass.defaultProps)
  const componentInstance = new ComponentClass(componentProps)
  componentInstance._constructor && componentInstance._constructor(componentProps)
  try {
    Current.current = componentInstance
    Current.index = 0
    componentInstance.state = componentInstance._createData() || componentInstance.state
  } catch (err) {
    if (isPage) {
      console.warn(`[Taro warn] 请给页面提供初始 \`state\` 以提高初次渲染性能！`)
    } else {
      console.warn(`[Taro warn] 请给组件提供一个 \`defaultProps\` 以提高初次渲染性能！`)
    }
    console.warn(err)
  }
  initData = Object.assign({}, initData, componentInstance.props, componentInstance.state)

  const weappComponentConf = {
    data: initData,
    created (options = {}) {
      isPage && (hasPageInited = false)
      if (isPage && cacheDataHas(preloadInitedComponent)) {
        this.$component = cacheDataGet(preloadInitedComponent, true)
        this.$component.$componentType = 'PAGE'
      } else {
        this.$component = new ComponentClass({}, isPage)
      }
      this.$component._init(this)
      this.$component.render = this.$component._createData
      this.$component.__propTypes = ComponentClass.propTypes
      if (isPage) {
        if (cacheDataHas(PRELOAD_DATA_KEY)) {
          const data = cacheDataGet(PRELOAD_DATA_KEY, true)
          this.$component.$router.preload = data
        }
        Object.assign(this.$component.$router.params, options)
        if (cacheDataHas(options[preloadPrivateKey])) {
          this.$component.$preloadData = cacheDataGet(options[preloadPrivateKey], true)
        } else {
          this.$component.$preloadData = {}
        }
        this.$component.$router.path = getCurrentPageUrl()
        initComponent.apply(this, [ComponentClass, isPage])
      }
    },
    attached () {
      initComponent.apply(this, [ComponentClass, isPage])
    },
    ready () {
      if (!this.$component.__mounted) {
        this.$component.__mounted = true
        componentTrigger(this.$component, 'componentDidMount')
      }
    },
    detached () {
      const component = this.$component
      componentTrigger(component, 'componentWillUnmount')
      component.hooks.forEach((hook) => {
        if (isFunction(hook.cleanup)) {
          hook.cleanup()
        }
      })
      const events = component.$$renderPropsEvents
      if (isArray(events)) {
        events.forEach(e => eventCenter.off(e))
      }
    }
  }
  if (isPage) {
    weappComponentConf['onLoad'] = weappComponentConf['created']
    weappComponentConf['onReady'] = weappComponentConf['ready']
    weappComponentConf['onUnload'] = weappComponentConf['detached']
    weappComponentConf['onShow'] = function () {
      componentTrigger(this.$component, 'componentDidShow')
    }
    weappComponentConf['onHide'] = function () {
      componentTrigger(this.$component, 'componentDidHide')
    }
    pageExtraFns.forEach(fn => {
      if (componentInstance[fn] && typeof componentInstance[fn] === 'function') {
        weappComponentConf[fn] = function () {
          const component = this.$component
          if (component && component[fn] && typeof component[fn] === 'function') {
            return component[fn](...arguments)
          }
        }
      }
    })
    globPageRegistPath && cacheDataSet(globPageRegistPath, ComponentClass)
  }
  bindProperties(weappComponentConf, ComponentClass, isPage)
  bindBehaviors(weappComponentConf, ComponentClass)
  bindStaticFns(weappComponentConf, ComponentClass)
  bindStaticOptions(weappComponentConf, ComponentClass)
  ComponentClass['$$events'] && bindEvents(weappComponentConf, ComponentClass['$$events'], isPage)
  if (ComponentClass['externalClasses'] && ComponentClass['externalClasses'].length) {
    weappComponentConf['externalClasses'] = ComponentClass['externalClasses']
  }
  return weappComponentConf
}

export default createComponent
