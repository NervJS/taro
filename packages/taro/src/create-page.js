import { isEmptyObject, getPrototypeChain } from './util'

const eventPreffix = '__event_'
const rootScopeKey = '__root_'
const componentPath = 'componentPath'
const pageExtraFns = ['onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap']
function initPage (weappPageConf, page) {
  const scopeMap = {}
  function processEvent (eventHandlerName, obj, page) {
    let newEventHandlerName = eventHandlerName.replace(eventPreffix, '')
    if (obj[newEventHandlerName]) {
      return
    }
    obj[newEventHandlerName] = function (event) {
      if (event) {
        event.preventDefault = function () {}
        event.stopPropagation = function () {}
        Object.assign(event.target, event.detail)
        Object.assign(event.currentTarget, event.detail)
      }
      const dataset = event.currentTarget.dataset
      const theComponent = scopeMap[dataset[componentPath] || rootScopeKey]
      let scope = theComponent
      const bindArgs = {}
      Object.keys(dataset).forEach(key => {
        const newEventHandlerNameLower = newEventHandlerName.toLocaleLowerCase()
        const keyLower = key.toLocaleLowerCase()
        if (keyLower.indexOf('event') >= 0 &&
          keyLower.indexOf(newEventHandlerNameLower) >= 0) {
          const argName = keyLower.replace(`event${newEventHandlerNameLower}`, '')
          bindArgs[argName] = dataset[key]
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
        const newHandler = () => {
          return theComponent[eventHandlerName].apply(scope, realArgs)
        }
        newHandler()
      } else {
        if (dataset[componentPath]) {
          scope = scopeMap[dataset[componentPath] || rootScopeKey]
        }
        theComponent[eventHandlerName].call(scope, event)
      }
    }
  }

  function recurrenceComponent (weappPageConf, component, path) {
    component.$path = path || ''
    component.props.$path = component.$path
    if (path) {
      scopeMap[path] = component
    } else {
      scopeMap[rootScopeKey] = component
    }
    !isEmptyObject(component.$components) &&
      Object.getOwnPropertyNames(component.$components).forEach(function (name) {
        const _class = component.$components[name]
        const comPath = `${component.$path}$$${name}`
        let _props = (component.$props || {})[name] || {}
        let props =
          typeof _props === 'function' ? _props.call(component) : _props

        const child = new _class(props)
        component.$$components[name] = child

        recurrenceComponent(weappPageConf, child, comPath)
      })
    for (const k in component) {
      if (k.indexOf(eventPreffix) >= 0) {
        processEvent(k, weappPageConf, component)
      }
    }
    const prototypeChain = getPrototypeChain(component)
    prototypeChain.forEach(item => {
      Object.getOwnPropertyNames(item).forEach(fn => {
        if (fn.indexOf(eventPreffix) >= 0) {
          processEvent(fn, weappPageConf, component)
        }
      })
    })

    return weappPageConf
  }
  return recurrenceComponent(weappPageConf, page)
}

function componentTrigger (component, key) {
  if (key === 'componentWillUnmount') {
    component._dirty = true
    component._disable = true
  }
  Object.getOwnPropertyNames(component.$$components || {}).forEach(name => {
    componentTrigger(component.$$components[name], key)
  })
  component[key] && typeof component[key] === 'function' && component[key]()
}

function createPage (PageClass) {
  const page = new PageClass()
  page.$isComponent = false
  const weappPageConf = {
    onLoad (options) {
      page._init(this)
      page.$router = {
        params: options
      }
      componentTrigger(page, 'componentWillMount')
      page._dirty = false
      page._disable = false
    },
    onReady () {
      componentTrigger(page, 'componentDidMount')
    },
    onShow () {
      componentTrigger(page, 'componentDidShow')
    },
    onHide () {
      componentTrigger(page, 'componentDidHide')
    },
    onUnload () {
      componentTrigger(page, 'componentWillUnmount')
    },
    _setData (data, cb, isRoot) {
      if (isRoot) {
        this.setData(data, () => {
          cb && cb()
        })
      }
    }
  }
  let weappPageConfEvents = initPage(weappPageConf, page)
  page._initData()
  pageExtraFns.forEach(fn => {
    if (typeof page[fn] === 'function') {
      weappPageConf[fn] = page[fn].bind(page)
    }
  })
  return Object.assign(weappPageConfEvents, {
    data: page.$data
  })
}

export default createPage
