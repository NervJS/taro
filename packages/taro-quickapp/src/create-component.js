import { isEmptyObject, queryToJson } from './util'
import { cacheDataGet, cacheDataHas } from './data-cache'
import { updateComponent } from './lifecycle'

const privatePropValName = '__triggerObserer'
const componentFnReg = /^__fn_/
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
    } else if (propName in componentData) {
      newProps[propName] = componentData[propName]
    }
    if (componentFnReg.test(propName)) {
      if (componentData[propName] === true) {
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
  return newProps
}

function bindEvents (componentConf, componentInstance, events) {
  events.forEach(name => {
    if (componentInstance[name]) {
      componentConf[name] = componentInstance[name]
    }
  })
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
      if (isPage) {
        if (cacheDataHas(PRELOAD_DATA_KEY)) {
          const data = cacheDataGet(PRELOAD_DATA_KEY, true)
          this.$component.$router.preload = data
        }
        // this.$component.$router.path = getCurrentPageUrl()
        initComponent.apply(this, [ComponentClass, isPage])
      }
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
  ComponentClass['$$events'] && bindEvents(componentConf, componentInstance, ComponentClass['$$events'])
  return componentConf
}
