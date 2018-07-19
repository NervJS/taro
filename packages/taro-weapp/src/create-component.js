import { isEmptyObject, getPrototypeChain } from './util'
import { updateComponent } from './lifecycle'
const eventPreffix = '__event_'
const privatePropValName = '__triggerObserer'
const anonymousFnNamePreffix = 'func__'

function bindProperties (weappComponentConf, ComponentClass) {
  weappComponentConf.properties = ComponentClass.properties || {}
  // 拦截props的更新，插入生命周期
  // 调用小程序setData或会造成性能消耗
  weappComponentConf.properties[privatePropValName] = {
    type: null,
    observer: function (newState) {
      if (!this.$component || !this.$component.__isAttached) return
      const nextProps = filterProps(ComponentClass.properties, ComponentClass.defaultProps, this.data)
      this.$component.props = nextProps
      updateComponent(this.$component, true, 'observer')
    }
  }
}

function processEvent (eventHandlerName, component, obj) {
  if (obj[eventHandlerName]) return

  obj[eventHandlerName] = function (event) {
    if (event) {
      event.preventDefault = function () {}
      event.stopPropagation = function () {}
      Object.assign(event.target, event.detail)
      Object.assign(event.currentTarget, event.detail)
    }

    let scope = this.$component
    const isCustomEvt = event.detail && event.detail.__isCustomEvt === true
    const isAnonymousFn = eventHandlerName.indexOf(anonymousFnNamePreffix) > -1
    let realArgs = []

    if (!isCustomEvt) {
      const dataset = event.currentTarget.dataset
      const bindArgs = {}
      const eventHandlerNameLower = eventHandlerName.toLocaleLowerCase()
      Object.keys(dataset).forEach(key => {
        let keyLower = key.toLocaleLowerCase()
        if (keyLower.indexOf('event') === 0) {
          // 小程序属性里中划线后跟一个下划线会解析成不同的结果
          keyLower = keyLower.replace(/event\-?/, '')
          keyLower = keyLower.toLocaleLowerCase()
          if (keyLower.indexOf(eventHandlerNameLower) >= 0) {
            const argName = keyLower.replace(eventHandlerNameLower, '')
            bindArgs[argName] = dataset[key]
          }
        }
      })
      if (!isEmptyObject(bindArgs)) {
        if (!isAnonymousFn) {
          if (bindArgs['so'] !== 'this') {
            scope = bindArgs['so']
          }
          delete bindArgs['so']
          realArgs = Object.keys(bindArgs)
            .sort()
            .map(key => bindArgs[key])
          realArgs.push(event)
        } else {
          let _scope = null
          if (bindArgs['so'] !== 'this') {
            _scope = bindArgs['so']
          }
          delete bindArgs['so']
          realArgs = Object.keys(bindArgs)
            .sort()
            .map(key => bindArgs[key])
          realArgs = [_scope].concat(realArgs)
        }
      }
    } else {
      realArgs = event.detail.__arguments || []
      if (!isAnonymousFn && realArgs.length > 0) {
        realArgs[0] && (scope = realArgs[0])
        realArgs.shift()
      }
    }
    // 如果是匿名函数，scope指向自己，并且将传入的scope作为第一个参数传递下去

    if (realArgs.length > 0) {
      component[eventHandlerName].apply(scope, realArgs)
    } else if (!isCustomEvt) {
      component[eventHandlerName].call(scope, event)
    } else {
      component[eventHandlerName].call(scope)
    }
  }
}

function bindEvents (weappComponentConf, taroComponent, events) {
  weappComponentConf.methods = weappComponentConf.methods || {}

  events.forEach(name => {
    processEvent(name, taroComponent, weappComponentConf.methods)
  })
}

function filterProps (properties, defaultProps = {}, weappComponentData) {
  let res = {}
  Object.getOwnPropertyNames(properties).forEach(name => {
    if (name !== privatePropValName) {
      res[name] = name in weappComponentData ? weappComponentData[name] : defaultProps[name]
    }
  })
  return res
}

function componentTrigger (component, key) {
  if (key === 'componentWillUnmount') {
    component._dirty = true
    component._disable = true
  }
  component[key] && typeof component[key] === 'function' && component[key]()
  if (key === 'componentWillMount') {
    component._dirty = false
    component._disable = false
  }
}

function createComponent (ComponentClass, isPage) {
  const component = new ComponentClass()
  const weappComponentConf = {
    data: {
      _componentProps: 1
    },

    attached () {
      const props = filterProps(ComponentClass.properties, ComponentClass.defaultProps, this.data)
      this.$component = new ComponentClass(props)
      this.$component._init(this)
      // attached之后才可以setData,
      // attached之前，小程序组件初始化时仍然会触发observer，__isAttached为否的时候放弃处理observer
      this.$component.__isAttached = true
      componentTrigger(this.$component, 'componentWillMount')
    },
    ready () {
      // 页面Ready的时候setData更新，并通过observer触发子组件更新
      // 小程序组件ready，但是数据并没有ready，需要通过updateComponent来初始化数据，setData完成之后才是真正意义上的组件ready
      if (isPage) {
        updateComponent(this.$component, true, 'attached', this.$component.__isPage)
      }
    },
    detached () {
      componentTrigger(this.$component, 'componentWillUnmount')
    },
    onHide () {
      componentTrigger(this.$component, 'componentDidHide')
    }
  }
  if (isPage) {
    weappComponentConf['onLoad'] = weappComponentConf['attached']
    weappComponentConf['onReady'] = weappComponentConf['ready']
    weappComponentConf['onUnload'] = weappComponentConf['detached']
    weappComponentConf['onShow'] = function () {
      componentTrigger(this.$component, 'componentDidShow')
    }
    weappComponentConf['onHide'] = function () {
      componentTrigger(this.$component, 'componentDidHide')
    }
  }
  bindProperties(weappComponentConf, ComponentClass)
  ComponentClass['$$events'] && bindEvents(weappComponentConf, component, ComponentClass['$$events'])
  return weappComponentConf
}

export default createComponent
