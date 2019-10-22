import camelCase from 'lodash/camelCase'
import { Current, eventCenter } from '@tarojs/taro'

import { isEmptyObject, addLeadingSlash, isArray, isFunction } from './util'
import { cacheDataGet, cacheDataHas, cacheDataSet } from './data-cache'
import { mountComponent } from './lifecycle'
import appGlobal from './global'
import propsManager from './propsManager'

const anonymousFnNamePreffix = 'funPrivate'
const routerParamsPrivateKey = '__key_'
const preloadPrivateKey = 'quick$PriPreload'
const PRELOAD_DATA_KEY = 'preload'
const COMP_ID = 'compid'
const preloadInitedComponent = 'quick$PriPreloadComponent'
const pageExtraFns = ['onBackPress', 'onMenuPress', 'onRefresh']

function bindProperties (componentConf, ComponentClass, isPage) {
  componentConf.properties = ComponentClass.properties || {}
  const defaultProps = ComponentClass.defaultProps || {}
  for (const key in defaultProps) {
    if (defaultProps.hasOwnProperty(key)) {
      componentConf.properties[key] = {
        type: null,
        value: defaultProps[key]
      }
    }
  }
  if (isPage) {
    componentConf.properties[routerParamsPrivateKey] = {
      type: null,
      value: null
    }
    componentConf.properties[preloadPrivateKey] = {
      type: null,
      value: null
    }
    const defaultParams = ComponentClass.defaultParams || {}
    for (const key in defaultParams) {
      if (defaultParams.hasOwnProperty(key)) {
        componentConf.properties[key] = {
          type: null,
          value: null
        }
      }
    }
  }
  componentConf.props = []
  Object.keys(componentConf.properties).forEach(item => {
    componentConf.props.push(item.toLocaleLowerCase())
  })
  componentConf.props.push(COMP_ID)
  componentConf.onCompidChange = function () {
    initComponent.apply(this, [ComponentClass, isPage])
  }
}

export function filterProps (defaultProps = {}, propsFromPropsManager = {}, curAllProps = {}, extraProps) {
  let newProps = Object.assign({}, curAllProps, propsFromPropsManager)

  if (!isEmptyObject(defaultProps)) {
    for (const propName in defaultProps) {
      if (newProps[propName] === undefined) {
        newProps[propName] = defaultProps[propName]
      }
    }
  }

  if (extraProps) {
    newProps = Object.assign({}, newProps, extraProps)
  }

  Object.keys(newProps).forEach(propName => {
    const camelizePropName = camelCase(propName)
    if (camelizePropName !== propName) {
      Object.defineProperty(newProps, camelizePropName, {
        get () {
          return newProps[propName]
        }
      })
    }
  })
  return newProps
}

function processEvent (eventHandlerName, obj) {
  if (obj[eventHandlerName]) return

  obj[eventHandlerName] = function (event) {
    if (event) {
      const currentTarget = event.currentTarget
      const target = event.target
      Object.defineProperties(event, {
        target: {
          configurable: true,
          get () {
            return Object.assign(target || {}, event.detail)
          }
        },
        currentTarget: {
          configurable: true,
          get () {
            return Object.assign(currentTarget || target || {}, event.detail)
          }
        }
      })
      if (!event.stopPropagation) {
        Object.defineProperty(event, 'stopPropagation', {
          value: () => {}
        })
      }
      if (!event.preventDefault) {
        Object.defineProperty(event, 'preventDefault', {
          value: () => {}
        })
      }
    }

    const scope = this.$component
    let callScope = scope
    const isAnonymousFn = eventHandlerName.indexOf(anonymousFnNamePreffix) > -1
    let realArgs = []
    let detailArgs = []
    let datasetArgs = []
    let isScopeBinded = false
    // 解析从dataset中传过来的参数
    const dataset = {}
    const currentTarget = event.currentTarget
    const vm = currentTarget._vm || (currentTarget._target ? currentTarget._target._vm : null)
    const attr = vm ? vm._externalBinding.template.attr : (currentTarget._attr || currentTarget.attr)
    if (attr) {
      Object.keys(attr).forEach(key => {
        if (/^data/.test(key)) {
          const item = attr[key]
          dataset[key.replace(/^data/, '')] = typeof item === 'function' ? item() : item
        }
      })
    }

    const bindArgs = {}
    const eventType = `on${event.type}`.toLocaleLowerCase()

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

function bindEvents (componentConf, events) {
  events.forEach(name => {
    processEvent(name, componentConf)
  })
}

function bindStaticFns (componentConf, ComponentClass) {
  for (const key in ComponentClass) {
    typeof ComponentClass[key] === 'function' && (componentConf[key] = ComponentClass[key])
  }
  // 低版本 IOS 下部分属性不能直接访问
  Object.getOwnPropertyNames(ComponentClass).forEach(key => {
    const excludes = ['arguments', 'caller', 'length', 'name', 'prototype']
    if (excludes.indexOf(key) < 0) {
      typeof ComponentClass[key] === 'function' && (componentConf[key] = ComponentClass[key])
    }
  })
}

function getPageUrlParams (url) {
  const taroRouterParamsCache = appGlobal.taroRouterParamsCache
  let params = {}
  if (taroRouterParamsCache && url) {
    url = addLeadingSlash(url)
    params = taroRouterParamsCache[url] || {}
    delete taroRouterParamsCache[url]
  }
  return params
}

let hasPageInited = false

function initComponent (ComponentClass, isPage) {
  if (!this.$component || this.$component.__isReady) return
  this.$component.__isReady = true

  if (isPage && !hasPageInited) {
    hasPageInited = true
  }
  if (hasPageInited && !isPage) {
    const compid = this.compid
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
  }
  if (key === 'componentWillUnmount') {
    const compid = component.$scope.compid
    if (compid) propsManager.delete(compid)
  }

  component[key] && typeof component[key] === 'function' && component[key](...args)
  if (key === 'componentWillMount') {
    component._dirty = false
    component._disable = false
    component.state = component.getState()
  }
  if (key === 'componentWillUnmount') {
    component._dirty = true
    component._disable = true
    component.$router = {
      params: {},
      path: ''
    }
    component._pendingStates = []
    component._pendingCallbacks = []
  }
}

export default function createComponent (ComponentClass, isPage) {
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
  const componentConf = {
    data: initData,
    onInit () {
      isPage && (hasPageInited = false)
      if (isPage && cacheDataHas(preloadInitedComponent)) {
        this.$component = cacheDataGet(preloadInitedComponent, true)
      } else {
        this.$component = new ComponentClass({}, isPage)
      }
      this.$component._init(this)
      this.$component.render = this.$component._createData
      this.$component.__propTypes = ComponentClass.propTypes
      if (isPage) {
        this.$component.$componentType = 'PAGE'
        if (cacheDataHas(PRELOAD_DATA_KEY)) {
          const data = cacheDataGet(PRELOAD_DATA_KEY, true)
          this.$component.$router.preload = data
        }
        const options = getPageUrlParams(isPage)
        Object.assign(this.$component.$router.params, options)
        this.$app.pageInstaceMap = this.$app.pageInstaceMap || {}
        this.$app.pageInstaceMap[isPage] = this.$component
        if (cacheDataHas(options[preloadPrivateKey])) {
          this.$component.$preloadData = cacheDataGet(options[preloadPrivateKey], true)
        } else {
          this.$component.$preloadData = {}
        }
        // this.$component.$router.path = getCurrentPageUrl()
        initComponent.apply(this, [ComponentClass, isPage])
      }
      // 监听数据变化
      this.$watch(COMP_ID, 'onCompidChange')
    },

    onReady () {
      if (!isPage) {
        initComponent.apply(this, [ComponentClass, isPage])
      }
      const component = this.$component
      if (!component.__mounted) {
        component.__mounted = true
        componentTrigger(component, 'componentDidMount')
      }
    },

    onDestroy () {
      componentTrigger(this.$component, 'componentWillUnmount')
      const component = this.$component
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
    componentConf['onShow'] = function () {
      componentTrigger(this.$component, 'componentDidShow')
    }
    componentConf['onHide'] = function () {
      componentTrigger(this.$component, 'componentDidHide')
    }
    pageExtraFns.forEach(fn => {
      if (componentInstance[fn] && typeof componentInstance[fn] === 'function') {
        componentConf[fn] = function () {
          const component = this.$component
          if (component[fn] && typeof component[fn] === 'function') {
            return component[fn](...arguments)
          }
        }
      }
    })
    addLeadingSlash(isPage) && cacheDataSet(addLeadingSlash(isPage), ComponentClass)
  }
  bindStaticFns(componentConf, ComponentClass)
  bindProperties(componentConf, ComponentClass, isPage)
  ComponentClass['privateTaroEvent'] && bindEvents(componentConf, ComponentClass['privateTaroEvent'])
  return componentConf
}
