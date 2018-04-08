import { isEmptyObject } from './util'

const eventPreffix = '__event_'
const rootScopeKey = '__root_'
const scopeMap = {}
function processEvent(eventHandlerName, obj, page) {
  let newEventHandlerName = eventHandlerName.replace(eventPreffix, '')
  obj[newEventHandlerName] = function(event) {
    if (event) {
      event.preventDefault = function() {}
      event.stopPropagation = function() {}
      Object.assign(event.target, event.detail)
      Object.assign(event.currentTarget, event.detail)
    }
    const dataset = event.currentTarget.dataset
    let scope = this
    const bindArgs = {}
    Object.keys(dataset).forEach(key => {
      const newEventHandlerNameLower = newEventHandlerName.toLocaleLowerCase()
      if (
        key.indexOf(eventPreffix) >= 0 &&
        key.indexOf(newEventHandlerNameLower) >= 0
      ) {
        const argName = key.replace(
          `${eventPreffix}${newEventHandlerNameLower}_`,
          ''
        )

        bindArgs[argName] = dataset[key]
      }
    })
    if (!isEmptyObject(bindArgs)) {
      if (bindArgs['scope'] !== 'this') {
        scope = bindArgs['scope']
      } else {
        if (dataset['__component_path']) {
          scope = scopeMap[dataset['__component_path'] || rootScopeKey]
        }
      }
      delete bindArgs['scope']
      const realArgs = Object.keys(bindArgs)
        .sort()
        .map(key => bindArgs[key])

      realArgs.push(event)
      const newHandler = () => {
        return page[eventHandlerName].apply(scope, realArgs)
      }
      newHandler()
    } else {
      if (dataset['__component_path']) {
        scope = scopeMap[dataset['__component_path'] || rootScopeKey]
      }
      page[eventHandlerName].call(scope, event)
    }
  }.bind(page)
}

function recurrenceComponent(weappPageConf, component, path) {
  component.$path = path || ''
  component.props.$path = component.$path
  if (path) {
    scopeMap[path] = component
  } else {
    scopeMap[rootScopeKey] = component
  }
  !isEmptyObject(component.$components) &&
    Object.getOwnPropertyNames(component.$components).forEach(function(name) {
      const _class = component.$components[name]
      const comPath = `${component.$path}$$${name}`
      let _props = (component.$props || {})[name] || {}
      let props = typeof _props === 'function' ? _props.call(component) : _props

      const child = new _class(props)
      component.$$components[name] = child

      recurrenceComponent(weappPageConf, child, comPath)
    })
  for (const k in component) {
    if (k.indexOf(eventPreffix) >= 0) {
      processEvent(k, weappPageConf, component)
    }
  }
  Object.getOwnPropertyNames(component.constructor.prototype).forEach(function(
    fn
  ) {
    if (fn.indexOf(eventPreffix) >= 0) {
      processEvent(fn, weappPageConf, component)
    }
  })

  return weappPageConf
}
function createPage(pageClass) {
  const page = new pageClass()
  page.$isComponent = false
  const stateList = []
  const weappPageConf = {
    stateList: [],
    onLoad(options) {
      page._init(this)
      page.$router = {
        params: options
      }
      if (page.componentWillMount) {
        page.componentWillMount()
      }
    },
    onReady() {
      if (page.componentDidMount) {
        page.componentDidMount()
      }
    },
    onUnload() {
      if (page.componentDidUnmount) {
        page.componentDidUnmount()
      }
    },
    _setData(data, cb, isRoot) {
      this.stateList.push({
        data: data,
        cb: cb
      })

      if (isRoot) {
        let stateListTmp = this.stateList
        this.stateList = []
        this.setData(data, function() {
          stateListTmp.forEach(function(state) {
            state.cb && typeof state.cb === 'function' && state.cb()
          })
        })
      }
    }
  }
  let weappPageConfEvents = recurrenceComponent(weappPageConf, page)
  page._initData()
  return Object.assign(weappPageConfEvents, {
    data: page.$data
  })
}

export default createPage
