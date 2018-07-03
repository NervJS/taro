import { isEmptyObject, getPrototypeChain } from './util'
import { updateComponent } from './lifecycle'
const eventPreffix = '__event_'

const privatePropValName = '__triggerObserer'

function bindProperties (weappComponentConf, ComponentClass) {
  weappComponentConf.properties = ComponentClass.properties || {}
  // 拦截props的更新，插入生命周期
  // 调用小程序setData或会造成性能消耗
  weappComponentConf.properties[privatePropValName] = {
    type: null,
    observer: function (newState) {
      if (!this.$component.__isAttached) return
      const nextProps = filterProps(ComponentClass.properties, ComponentClass.defaultProps, this.data)
      this.$component.props = nextProps
      updateComponent(this.$component, true, 'observer')
    }
  }
}

function processEvent (eventHandlerName, component, obj) {
  if (eventHandlerName.indexOf(eventHandlerName) === -1) return
  let originEventHandlerName = eventHandlerName.replace(eventPreffix, '')
  if (obj[originEventHandlerName]) return

  obj[originEventHandlerName] = function (event) {
    if (event) {
      event.preventDefault = function () {}
      event.stopPropagation = function () {}
      Object.assign(event.target, event.detail)
      Object.assign(event.currentTarget, event.detail)
    }
    const dataset = event.currentTarget.dataset

    let scope = this.$component
    const bindArgs = {}
    const componentClassName = dataset['componentClass']
    const originEventHandlerNameLower = originEventHandlerName.toLocaleLowerCase()
    Object.keys(dataset).forEach(key => {
      let keyLower = key.toLocaleLowerCase()
      if (keyLower.indexOf('event') === 0) {
        keyLower = keyLower.replace('event', '')
        keyLower = componentClassName ? `${componentClassName}__${keyLower}` : keyLower
        keyLower = keyLower.toLocaleLowerCase()
        if (keyLower.indexOf(originEventHandlerNameLower) >= 0) {
          const argName = keyLower.replace(originEventHandlerNameLower, '')
          bindArgs[argName] = dataset[key]
        }
      }
    })
    if (!isEmptyObject(bindArgs)) {
      if (bindArgs['scope'] !== 'this') {
        scope = bindArgs['scope']
      }
      delete bindArgs['scope']
      const realArgs = Object.keys(bindArgs)
        .sort()
        .map(key => bindArgs[key])

      realArgs.push(event)
      component[eventHandlerName].apply(scope, realArgs)
    } else {
      component[eventHandlerName].call(scope, event)
    }
  }
}

function bindEvents (weappComponentConf, taroComponent) {
  weappComponentConf.methods = weappComponentConf.methods || {}

  Object.getOwnPropertyNames(taroComponent).forEach(name => {
    processEvent(name, taroComponent, weappComponentConf.methods)
  })

  const prototypeChain = getPrototypeChain(taroComponent)
  prototypeChain.forEach(item => {
    Object.getOwnPropertyNames(item).forEach(name => {
      processEvent(name, taroComponent, weappComponentConf.methods)
    })
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
  bindEvents(weappComponentConf, component)
  return weappComponentConf
}

export default createComponent
