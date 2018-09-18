import { isEmptyObject, noop } from './util'
import { updateComponent } from './lifecycle'
import { cacheDataGet, cacheDataHas } from './data-cache'
const privatePropValName = '__triggerObserer'
const anonymousFnNamePreffix = 'func__'
const componentFnReg = /^__fn_/
const routerParamsPrivateKey = '__key_'
const pageExtraFns = ['onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap']

function bindProperties (weappComponentConf, ComponentClass, isPage) {
  weappComponentConf.properties = ComponentClass.properties || {}
  const defaultProps = ComponentClass.defaultProps || {}
  for (const key in defaultProps) {
    if (defaultProps.hasOwnProperty(key)) {
      weappComponentConf.properties[key] = null
    }
  }
  if (isPage) {
    weappComponentConf.properties[routerParamsPrivateKey] = null
    const defaultParams = ComponentClass.defaultParams || {}
    for (const key in defaultParams) {
      if (defaultParams.hasOwnProperty(key)) {
        weappComponentConf.properties[key] = null
      }
    }
  }
  // 拦截props的更新，插入生命周期
  // 调用小程序setData或会造成性能消耗
  weappComponentConf.properties[privatePropValName] = {
    type: null,
    observer: function () {
      if (!this.$component || !this.$component.__isReady) return
      const nextProps = filterProps(ComponentClass.properties, ComponentClass.defaultProps, this.$component.props, this.data)
      this.$component.props = nextProps
      this.$component._unsafeCallUpdate = true
      updateComponent(this.$component)
      this.$component._unsafeCallUpdate = false
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
      Object.assign(event.target, event.detail)
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
    const eventHandlerNameLower = eventHandlerName.toLocaleLowerCase()
    Object.keys(dataset).forEach(key => {
      let keyLower = key.toLocaleLowerCase()
      if (/^e/.test(keyLower)) {
        // 小程序属性里中划线后跟一个下划线会解析成不同的结果
        keyLower = keyLower.replace(/^e/, '')
        keyLower = keyLower.toLocaleLowerCase()
        if (keyLower.indexOf(eventHandlerNameLower) >= 0) {
          const argName = keyLower.replace(eventHandlerNameLower, '')
          bindArgs[argName] = dataset[key]
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
        } else {
          isScopeBinded = true
        }
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
        } else {
          isScopeBinded = false
        }
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
      realArgs = [callScope || _scope, ...datasetArgs, ...detailArgs, event]
    }
    scope[eventHandlerName].apply(callScope, realArgs)
  }
}

function bindEvents (weappComponentConf, events, isPage) {
  weappComponentConf.methods = weappComponentConf.methods || {}
  const target = weappComponentConf.methods
  events.forEach(name => {
    processEvent(name, target)
  })
}

function filterProps (properties, defaultProps = {}, componentProps = {}, weappComponentData) {
  let newProps = Object.assign({}, componentProps)
  for (const propName in properties) {
    if (propName === privatePropValName) {
      continue
    }
    if (typeof componentProps[propName] === 'function') {
      newProps[propName] = componentProps[propName]
    } else if (propName in weappComponentData &&
      (properties[propName] !== null || weappComponentData[propName] !== null)) {
      newProps[propName] = weappComponentData[propName]
    }
    if (componentFnReg.test(propName)) {
      if (weappComponentData[propName] === true) {
        const fnName = propName.replace(componentFnReg, '')
        newProps[fnName] = noop
      }
      delete newProps[propName]
    }
  }
  if (!isEmptyObject(defaultProps)) {
    for (const propName in defaultProps) {
      if (newProps[propName] === undefined) {
        newProps[propName] = defaultProps[propName]
      }
    }
  }
  return newProps
}

function filterParams (data, defaultParams = {}) {
  let res = {}
  for (const paramName in defaultParams) {
    res[paramName] = paramName in data ? data[paramName] : defaultParams[paramName]
  }
  return res
}

export function componentTrigger (component, key, args) {
  args = args || []
  if (key === 'componentWillMount') {
    if (component['$$refs'] && component['$$refs'].length > 0) {
      let refs = {}
      component['$$refs'].forEach(ref => {
        let target
        if (ref.type === 'component') {
          target = component.$scope.selectComponent(`#${ref.id}`)
          target = target.$component || target
          if ('refName' in ref && ref['refName']) {
            refs[ref.refName] = target
          } else if ('fn' in ref && typeof ref['fn'] === 'function') {
            ref['fn'].call(component, target)
          }
        }
      })
      component.refs = Object.assign({}, component.refs || {}, refs)
    }
  }
  if (key === 'componentDidMount') {
    if (component['$$refs'] && component['$$refs'].length > 0) {
      let refs = {}
      component['$$refs'].forEach(ref => {
        let target
        const query = wx.createSelectorQuery().in(component.$scope)
        if (ref.type === 'dom') {
          target = query.select(`#${ref.id}`)
          if ('refName' in ref && ref['refName']) {
            refs[ref.refName] = target
          } else if ('fn' in ref && typeof ref['fn'] === 'function') {
            ref['fn'].call(component, target)
          }
        }
      })
      component.refs = Object.assign({}, component.refs || {}, refs)
    }
  }
  if (key === 'componentDidMount') {
    if (component['$$refs'] && component['$$refs'].length > 0) {
      let refs = {}
      component['$$refs'].forEach(ref => {
        let target
        const query = wx.createSelectorQuery().in(component.$scope)
        if (ref.type === 'component') {
          target = component.$scope.selectComponent(`#${ref.id}`)
          target = target.$component || target
        } else {
          target = query.select(`#${ref.id}`)
        }
        if ('refName' in ref && ref['refName']) {
          refs[ref.refName] = target
        } else if ('fn' in ref && typeof ref['fn'] === 'function') {
          ref['fn'].call(component, target)
        }
      })
      component.refs = refs
    }
  }
  if (key === 'componentWillUnmount') {
    component._dirty = true
    component._disable = true
    component.$router = {
      params: {}
    }
    component._pendingStates = []
    component._pendingCallbacks = []
  }
  component[key] && typeof component[key] === 'function' && component[key].call(component, ...args)
  if (key === 'componentWillMount') {
    component._dirty = false
    component._disable = false
    component.state = component.getState()
  }
}

function initComponent (ComponentClass, isPage) {
  if (this.$component.__isReady) return
  // ready之后才可以setData,
  // ready之前，小程序组件初始化时仍然会触发observer，__isReady为否的时候放弃处理observer
  this.$component.__isReady = true
  // 页面Ready的时候setData更新，此时并未didMount,触发observer但不会触发子组件更新
  // 小程序组件ready，但是数据并没有ready，需要通过updateComponent来初始化数据，setData完成之后才是真正意义上的组件ready
  // 动态组件执行改造函数副本的时,在初始化数据前计算好props
  if (!isPage) {
    const nextProps = filterProps(ComponentClass.properties, ComponentClass.defaultProps, this.$component.props, this.data)
    this.$component.props = nextProps
  }
  updateComponent(this.$component)
}

function createComponent (ComponentClass, isPage) {
  let initData = {
    _componentProps: 1
  }
  const componentProps = filterProps({}, ComponentClass.defaultProps)
  const componentInstance = new ComponentClass(componentProps)
  componentInstance._constructor && componentInstance._constructor(componentProps)
  try {
    componentInstance.state = componentInstance._createData() || componentInstance.state
  } catch (err) {
    console.warn(`[Taro warn] 请给组件提供一个 \`defaultProps\` 以提高初次渲染性能！`)
    console.warn(err)
  }
  initData = Object.assign({}, initData, componentInstance.props, componentInstance.state)

  const weappComponentConf = {
    data: initData,
    created (options = {}) {
      this.$component = new ComponentClass()
      this.$component._init(this)
      this.$component.render = this.$component._createData
      this.$component.__propTypes = ComponentClass.propTypes
      Object.assign(this.$component.$router.params, options)
    },
    attached () {
      let hasParamsCache
      if (isPage) {
        let params = {}
        hasParamsCache = cacheDataHas(this.data[routerParamsPrivateKey])
        if (hasParamsCache) {
          params = Object.assign({}, ComponentClass.defaultParams, cacheDataGet(this.data[routerParamsPrivateKey], true))
        } else {
          // 直接启动，非内部跳转
          params = filterParams(this.data, ComponentClass.defaultParams)
        }
        Object.assign(this.$component.$router.params, params)
      }
      if (!isPage || hasParamsCache || ComponentClass.defaultParams) {
        initComponent.apply(this, [ComponentClass, isPage])
      }
    },
    ready () {
      if (!isPage && !this.$component.__mounted) {
        this.$component.__mounted = true
        componentTrigger(this.$component, 'componentDidMount')
      }
    },
    detached () {
      componentTrigger(this.$component, 'componentWillUnmount')
    }
  }
  if (isPage) {
    weappComponentConf.methods = weappComponentConf.methods || {}
    weappComponentConf.methods['onLoad'] = function (options = {}) {
      if (this.$component.__isReady) return
      Object.assign(this.$component.$router.params, options)
      initComponent.apply(this, [ComponentClass, isPage])
    }
    weappComponentConf.methods['onReady'] = function () {
      this.$component.__mounted = true
      componentTrigger(this.$component, 'componentDidMount')
    }
    weappComponentConf.methods['onShow'] = function () {
      componentTrigger(this.$component, 'componentDidShow')
    }
    weappComponentConf.methods['onHide'] = function () {
      componentTrigger(this.$component, 'componentDidHide')
    }
    pageExtraFns.forEach(fn => {
      if (componentInstance[fn] && typeof componentInstance[fn] === 'function') {
        weappComponentConf.methods[fn] = function () {
          const component = this.$component
          if (component[fn] && typeof component[fn] === 'function') {
            return component[fn].call(component, ...arguments)
          }
        }
      }
    })
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
