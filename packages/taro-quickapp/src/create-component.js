import { isEmptyObject, queryToJson } from './util'
import { cacheDataGet, cacheDataHas } from './data-cache'
import { updateComponent } from './lifecycle'
import camelCase from 'lodash/camelCase'

const privatePropValName = 'privatetriggerobserer'
const anonymousFnNamePreffix = 'funPrivate'
const componentFnReg = /^prv-fn-/
const PRELOAD_DATA_KEY = 'preload'
const pageExtraFns = ['onBackPress', 'onMenuPress']

function filterProps (properties, defaultProps = {}, componentProps = {}, componentData) {
  let newProps = Object.assign({}, componentProps)
  for (const propName in properties) {
    if (propName === privatePropValName) {
      continue
    }
    if (typeof componentProps[propName] === 'function') {
      newProps[propName] = componentProps[propName]
    } else if (componentData && propName in componentData) {
      newProps[propName] = componentData[propName]
    }
    if (componentFnReg.test(propName)) {
      if (componentData && componentData[propName] === true) {
        const fnName = propName.replace(componentFnReg, '')
        newProps[fnName] = noop
      }
      delete newProps[propName]
    }
  }
  if (!isEmptyObject(defaultProps)) {
    for (const propName in defaultProps) {
      if (newProps[propName] === undefined || newProps[propName] === null) {
        newProps[propName] = defaultProps[propName]
      }
    }
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
        },
        stopPropagation: {
          value: () => {}
        },
        preventDefault: {
          value: () => {}
        }
      })
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
    const attr = vm ? vm._externalBinding.template.attr : currentTarget._attr
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

function bindProperties (componentConf, ComponentClass) {
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
  componentConf.props = []
  Object.keys(componentConf.properties).forEach(item => {
    componentConf.props.push(item.toLocaleLowerCase())
  })
  componentConf.props.push(privatePropValName)
  componentConf.onPrivatePropChange = function () {
    if (!this.$component || !this.$component.__isReady) return
    const nextProps = filterProps(ComponentClass.properties, ComponentClass.defaultProps, this.$component.props, this)
    this.$component.props = nextProps
    this.$component._unsafeCallUpdate = true
    updateComponent(this.$component)
    this.$component._unsafeCallUpdate = false
  }
}

function getPageUrlParams (url) {
  const queryStr = url.replace(/^.*\?&?/, '')
  const params = queryToJson(queryStr)
  return params
}

let hasPageInited = false

function initComponent (ComponentClass, isPage) {
  if (this.$component.__isReady) return
  this.$component.__isReady = true
  if (isPage && !hasPageInited) {
    hasPageInited = true
  }
  if (hasPageInited && !isPage) {
    const nextProps = filterProps(ComponentClass.properties, ComponentClass.defaultProps, this.$component.props, this)
    this.$component.props = nextProps
  }
  if (hasPageInited || isPage) {
    updateComponent(this.$component)
  }
}

export function componentTrigger (component, key, args) {
  args = args || []

  component[key] && typeof component[key] === 'function' && component[key].call(component, ...args)
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
  const componentProps = filterProps(ComponentClass.properties, ComponentClass.defaultProps)
  const componentInstance = new ComponentClass(componentProps)
  componentInstance._constructor && componentInstance._constructor(componentProps)
  try {
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
      this.$component = new ComponentClass({}, isPage)
      this.$component._init(this)
      this.$component.render = this.$component._createData
      this.$component.__propTypes = ComponentClass.propTypes
      Object.assign(this.$component.$router.params, getPageUrlParams(this.$page.uri))
      this.$app.pageInstaceMap = this.$app.pageInstaceMap || {}
      this.$app.pageInstaceMap[isPage] = this.$component
      if (isPage) {
        if (cacheDataHas(PRELOAD_DATA_KEY)) {
          const data = cacheDataGet(PRELOAD_DATA_KEY, true)
          this.$component.$router.preload = data
        }
        // this.$component.$router.path = getCurrentPageUrl()
        initComponent.apply(this, [ComponentClass, isPage])
      }
      // 监听数据变化
      this.$watch(privatePropValName, 'onPrivatePropChange')
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
  }
  bindStaticFns(componentConf, ComponentClass)
  bindProperties(componentConf, ComponentClass)
  ComponentClass['$$events'] && bindEvents(componentConf, ComponentClass['$$events'])
  return componentConf
}
