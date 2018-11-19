import { isEmptyObject, noop } from './util'
import { updateComponent } from './lifecycle'
const anonymousFnNamePreffix = 'funPrivate'
const componentFnReg = /^__fn_/
const pageExtraFns = ['onTitleClick', 'onOptionMenuClick', 'onPageScroll', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage']

function bindProperties (weappComponentConf, ComponentClass) {
  weappComponentConf.properties = ComponentClass.properties || {}
  const defaultProps = ComponentClass.defaultProps || {}
  for (const key in defaultProps) {
    if (defaultProps.hasOwnProperty(key)) {
      weappComponentConf.properties[key] = {
        type: null,
        value: null
      }
    }
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
    // 普通的事件（非匿名函数），会直接call
    if (!isAnonymousFn) {
      if ('so' in bindArgs) {
        if (bindArgs['so'] !== 'this') {
          callScope = bindArgs['so']
        }
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
      if ('so' in bindArgs) {
        delete bindArgs['so']
      }
      if (!isEmptyObject(bindArgs)) {
        datasetArgs = Object.keys(bindArgs)
          .sort()
          .map(key => bindArgs[key])
      }
      realArgs = [...datasetArgs, event]
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

function filterProps (defaultProps = {}, componentProps = {}, weappComponentData) {
  const properties = weappComponentData || {}
  let newProps = Object.assign({}, componentProps)

  for (const propName in properties) {
    if (typeof componentProps[propName] === 'function') {
      newProps[propName] = componentProps[propName]
    } else if (weappComponentData[propName] !== null) {
      newProps[propName] = weappComponentData[propName]
    }
    if (componentFnReg.test(propName)) {
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
        const query = my.createSelectorQuery().in(component.$scope)
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
        const query = my.createSelectorQuery().in(component.$scope)
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

let hasPageInited = false

function initComponent (ComponentClass, isPage) {
  if (this.$component.__isReady) return

  this.$component.__isReady = true

  if (isPage && !hasPageInited) {
    hasPageInited = true
  }
  // 页面Ready的时候setData更新，此时并未didMount,触发observer但不会触发子组件更新
  // 小程序组件ready，但是数据并没有ready，需要通过updateComponent来初始化数据，setData完成之后才是真正意义上的组件ready
  // 动态组件执行改造函数副本的时,在初始化数据前计算好props
  if (hasPageInited && !isPage) {
    const nextProps = filterProps(ComponentClass.defaultProps, this.$component.props, this.props)
    this.$component.props = nextProps
  }
  if (hasPageInited || isPage) {
    updateComponent(this.$component)
  }
}

function createComponent (ComponentClass, isPage) {
  let initData = {
    _componentProps: 1
  }
  const componentProps = filterProps(ComponentClass.defaultProps)
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

  const weappComponentConf = {
    data: initData
  }
  if (isPage) {
    Object.assign(weappComponentConf, {
      onLoad (options = {}) {
        hasPageInited = false
        this.$component = new ComponentClass()
        this.$component._init(this)
        this.$component.render = this.$component._createData
        this.$component.__propTypes = ComponentClass.propTypes
        Object.assign(this.$component.$router.params, options)
        initComponent.apply(this, [ComponentClass, isPage])
      },

      onUnload () {
        componentTrigger(this.$component, 'componentWillUnmount')
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
          if (component[fn] && typeof component[fn] === 'function') {
            return component[fn].call(component, ...arguments)
          }
        }
      }
    })
  } else {
    Object.assign(weappComponentConf, {
      didMount () {
        this.$component = new ComponentClass()
        this.$component._init(this)
        this.$component.render = this.$component._createData
        this.$component.__propTypes = ComponentClass.propTypes
        initComponent.apply(this, [ComponentClass, isPage])
      },

      didUpdate () {
        if (!this.$component || !this.$component.__isReady) return
        const nextProps = filterProps(ComponentClass.defaultProps, this.$component.props, this.props)
        this.$component.props = nextProps
        this.$component._unsafeCallUpdate = true
        updateComponent(this.$component)
        this.$component._unsafeCallUpdate = false
      },

      didUnmount () {
        componentTrigger(this.$component, 'componentWillUnmount')
      }
    })
  }
  bindProperties(weappComponentConf, ComponentClass)
  bindStaticFns(weappComponentConf, ComponentClass)
  ComponentClass['$$events'] && bindEvents(weappComponentConf, ComponentClass['$$events'], isPage)
  return weappComponentConf
}

export default createComponent
