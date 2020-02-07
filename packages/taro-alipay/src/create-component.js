import { getCurrentPageUrl } from '@tarojs/utils'
import { commitAttachRef, detachAllRef, Current, eventCenter } from '@tarojs/taro'
import { isEmptyObject, isFunction, isArray } from './util'
import { mountComponent, updateComponent } from './lifecycle'
import { cacheDataSet, cacheDataGet, cacheDataHas } from './data-cache'

const anonymousFnNamePreffix = 'funPrivate'
const COLLECT_CHILDS = 'onTaroCollectChilds'
const preloadPrivateKey = '__preload_'
const PRELOAD_DATA_KEY = 'preload'
const preloadInitedComponent = '$preloadComponent'
const pageExtraFns = ['onTitleClick', 'onOptionMenuClick', 'onPageScroll', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onTabItemTap']

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

function isToBeEvent (event) {
  if (!event || typeof event !== 'object' || (!event.timeStamp && !event.target)) {
    return false
  }
  return true
}

function processEventTarget (ev) {
  const event = Object.assign({}, ev)
  const { currentTarget, detail, target } = event

  if (currentTarget && currentTarget.pageX && currentTarget.pageY) {
    currentTarget.x = currentTarget.pageX
    currentTarget.y = currentTarget.pageY
  }
  if (detail && detail.pageX && detail.pageY) {
    detail.x = detail.pageX
    detail.y = detail.pageY
  }
  if (target && target.pageX && target.pageY) {
    target.x = target.pageX
    target.y = target.pageY
  }
  return event
}

function processEvent (eventHandlerName, obj) {
  if (obj[eventHandlerName]) return

  obj[eventHandlerName] = function (event) {
    const scope = this.$component
    let callScope = scope
    if (!isToBeEvent(event)) {
      return scope[eventHandlerName].apply(callScope, arguments)
    } else {
      // 将支付宝的 event 事件对象的字段，对齐微信小程序的
      event = processEventTarget(event)
    }
    event.preventDefault = function () {}
    event.stopPropagation = function () {}
    event.currentTarget = event.currentTarget || event.target || {}
    if (event.target) {
      Object.assign(event.target, event.detail)
    }
    Object.assign(event.currentTarget, event.detail)
    const isAnonymousFn = eventHandlerName.indexOf(anonymousFnNamePreffix) > -1
    let realArgs = []
    let datasetArgs = []
    let isScopeBinded = false
    // 解析从dataset中传过来的参数
    const dataset = event.currentTarget.dataset || {}
    const bindArgs = {}
    const eventType = event.type.toLocaleLowerCase()
    Object.keys(dataset).forEach(key => {
      let keyLower = key.toLocaleLowerCase()
      if (/^e/.test(keyLower)) {
        // 小程序属性里中划线后跟一个下划线会解析成不同的结果
        keyLower = keyLower.replace(/^e/, '')
        keyLower = keyLower.replace(/^on/, '').toLocaleLowerCase()
        if (keyLower.indexOf(eventType) >= 0) {
          const argName = keyLower.replace(eventType, '')
          if (/^(a[a-z]|so)$/.test(argName)) {
            bindArgs[argName] = dataset[key]
          }
        }
      }
    })
    // 普通的事件（非匿名函数），会直接call
    if (!isAnonymousFn) {
      if ('so' in bindArgs) {
        if (bindArgs['so'] !== 'this') {
          callScope = bindArgs['so']
        }
        isScopeBinded = true
        delete bindArgs['so']
      }
      if (!isEmptyObject(bindArgs)) {
        datasetArgs = Object.keys(bindArgs)
          .sort()
          .map(key => bindArgs[key])
      }
      realArgs = [...datasetArgs, event]
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
      if (!isEmptyObject(bindArgs)) {
        datasetArgs = Object.keys(bindArgs)
          .sort()
          .map(key => bindArgs[key])
      }
      realArgs = [_scope, ...datasetArgs, event]
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
    if (component['$$refs'] && component['$$refs'].length > 0) {
      let refs = {}
      component['$$refs'].forEach(ref => {
        let target
        if (ref.type === 'component') {
          const childs = component.$childs || {}
          target = childs[ref.id] || null
        } else {
          const query = my.createSelectorQuery().in(component.$scope)
          target = query.select(`#${ref.id}`)
        }
        commitAttachRef(ref, target, component, refs, true)
        ref.target = target
      })
      component.refs = Object.assign({}, component.refs || {}, refs)
    }
  }

  if (key === 'componentWillUnmount') {
    if (component.$scope.props) {
      const compid = component.$scope.props.compid
      if (compid) my.propsManager.delete(compid)
    }
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
    // refs
    detachAllRef(component)
    const scope = component.$scope
    if (component.$scope.$page &&
      typeof component.props[COLLECT_CHILDS] === 'function' &&
      typeof scope.props.id === 'string'
    ) {
      component.props[COLLECT_CHILDS](null, scope.props.id)
    }
  }
}

function initComponent (isPage) {
  if (this.$component.__isReady) return

  this.$component.__isReady = true

  mountComponent(this.$component)
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
    data: initData
  }
  if (isPage) {
    Object.assign(weappComponentConf, {
      onLoad (options = {}) {
        if (cacheDataHas(preloadInitedComponent)) {
          this.$component = cacheDataGet(preloadInitedComponent, true)
          this.$component.$componentType = 'PAGE'
        } else {
          this.$component = new ComponentClass({}, isPage)
        }
        this.$component._init(this)
        this.$component.render = this.$component._createData
        this.$component.__propTypes = ComponentClass.propTypes
        if (cacheDataHas(PRELOAD_DATA_KEY)) {
          const data = cacheDataGet(PRELOAD_DATA_KEY, true)
          this.$component.$router.preload = data
        }

        // merge App router params
        const app = getApp()
        if (
          app.$router &&
          app.$router.params &&
          app.$router.params.query &&
          Object.keys(app.$router.params.query).length &&
          getCurrentPages().length === 1
        ) {
          Object.assign(this.$component.$router.params, options, app.$router.params.query)
        } else {
          Object.assign(this.$component.$router.params, options)
        }
        this.$component.$router.path = getCurrentPageUrl()

        // preload
        if (cacheDataHas(options[preloadPrivateKey])) {
          this.$component.$preloadData = cacheDataGet(options[preloadPrivateKey], true)
        } else {
          this.$component.$preloadData = null
        }

        initComponent.apply(this, [isPage])
      },

      onUnload () {
        componentTrigger(this.$component, 'componentWillUnmount')
        const component = this.$component
        const events = component.$$renderPropsEvents

        component.hooks.forEach((hook) => {
          if (isFunction(hook.cleanup)) {
            hook.cleanup()
          }
        })

        if (isArray(events)) {
          events.forEach(e => eventCenter.off(e))
        }
      },

      onShow () {
        this.$component && this.$component.__mounted && componentTrigger(this.$component, 'componentDidShow')
      },

      onHide () {
        componentTrigger(this.$component, 'componentDidHide')
      }
    })
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
    ComponentClass.$$componentPath && cacheDataSet(ComponentClass.$$componentPath, ComponentClass)
  } else {
    Object.assign(weappComponentConf, {
      didMount () {
        const compid = this.props.compid
        const props = filterProps(ComponentClass.defaultProps, my.propsManager.map[compid], {})

        this.$component = new ComponentClass(props, isPage)
        this.$component._init(this)
        this.$component.render = this.$component._createData
        this.$component.__propTypes = ComponentClass.propTypes

        if (compid) {
          my.propsManager.observers[compid] = {
            component: this.$component,
            ComponentClass
          }
        }

        initComponent.apply(this, [isPage])
      },

      didUpdate (prevProps, prevData) {
        // 父组件每次更新，其渲染渲染的子自定义组件每次会生成不同的 compid
        // 但组件 didmount 中的 this.props.compid 只会是第一次 setData 的
        // 因此要对自组件 didmount 前父组件多次 setData 的情况进行兜底
        const previd = prevProps.compid
        const compid = this.props.compid
        if (
          previd &&
          compid &&
          previd !== compid &&
          !my.propsManager.map[previd] &&
          my.propsManager.map[compid] &&
          !my.propsManager.observers[compid]
        ) {
          my.propsManager.observers[compid] = {
            component: this.$component,
            ComponentClass: ComponentClass
          };
          var nextProps = filterProps(ComponentClass.defaultProps, my.propsManager.map[compid], this.$component.props);
          this.$component.props = nextProps;
          updateComponent(this.$component);
        }
      },

      didUnmount () {
        const component = this.$component
        componentTrigger(component, 'componentWillUnmount')
        component.hooks.forEach((hook) => {
          if (isFunction(hook.cleanup)) {
            hook.cleanup()
          }
        })
      }
    })
  }
  bindStaticFns(weappComponentConf, ComponentClass)
  ComponentClass['$$events'] && bindEvents(weappComponentConf, ComponentClass['$$events'], isPage)
  return weappComponentConf
}

export default createComponent
