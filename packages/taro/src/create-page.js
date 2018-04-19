import { isEmptyObject, getPrototypeChain } from './util'

const eventPreffix = '__event_'
const rootScopeKey = '__root_'
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
      const theComponent = scopeMap[dataset['__component_path'] || rootScopeKey]
      let scope = theComponent
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
        if (dataset['__component_path']) {
          scope = scopeMap[dataset['__component_path'] || rootScopeKey]
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
  if (key === 'componentDidMount') {
    component._dirty = false
    component._disable = false
  } else if (key === 'componentDidUnmount') {
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
    },
    onReady () {
      componentTrigger(page, 'componentDidMount')
    },
    onUnload () {
      componentTrigger(page, 'componentDidUnmount')
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
  return Object.assign(weappPageConfEvents, {
    data: page.$data
  })
}

export default createPage
