import {
  internal_safe_get as safeGet,
  internal_safe_set as safeSet
} from '@tarojs/taro'
import { updateComponent } from './lifecycle'
import { isEmptyObject, getPrototypeChain } from './util'

const eventPreffix = '__event_'
const rootScopeKey = '__root_'
const componentPath = 'componentPath'
const scopeMap = {}
const pageExtraFns = ['onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap']

function processEvent (pagePath, eventHandlerName, obj) {
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
    const theComponent = scopeMap[pagePath][dataset[componentPath] || rootScopeKey]
    let scope = theComponent
    const bindArgs = {}
    const componentClassName = dataset['componentClass']
    const newEventHandlerNameCopy = componentClassName ? newEventHandlerName.replace(`${componentClassName}__`, '') : newEventHandlerName
    const newEventHandlerNameLower = newEventHandlerNameCopy.toLocaleLowerCase()
    Object.keys(dataset).forEach(key => {
      const keyLower = key.toLocaleLowerCase()
      if (keyLower[0] === 'e' && keyLower.indexOf(`e${newEventHandlerNameLower}`) === 0) {
        const argName = keyLower.replace(`e${newEventHandlerNameLower}`, '')
        bindArgs[argName] = dataset[key]
      }
    })
    if (!isEmptyObject(bindArgs)) {
      if (bindArgs['so'] !== 'this') {
        scope = bindArgs['so']
      }
      delete bindArgs['so']
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
        scope = scopeMap[pagePath][dataset[componentPath] || rootScopeKey]
      }
      theComponent[eventHandlerName].call(scope, event)
    }
  }
}
function initPage (weappPageConf, page, options) {
  const pagePath = options.path
  scopeMap[pagePath] = scopeMap[pagePath] || {}
  function recurrenceComponent (weappPageConf, component, path) {
    component.$path = path || ''
    component.props.$path = component.$path
    if (path) {
      scopeMap[pagePath][path] = component
    } else {
      scopeMap[pagePath][rootScopeKey] = component
    }
    if (!isEmptyObject(component.$components)) {
      Object.getOwnPropertyNames(component.$components).forEach(function (name) {
        const _class = component.$components[name]
        const comPath = `${component.$path}$$${name}`
        let _props = (component.$props || {})[name] || {}
        let props = typeof _props === 'function' ? _props.call(component) : _props
        props = transformPropsForComponent(props, _class.defaultProps, _class.propTypes)
        const child = new _class(props)
        component.$$components[name] = child

        recurrenceComponent(weappPageConf, child, comPath)
      })
    }
    for (const k in component) {
      if (k.indexOf(eventPreffix) >= 0) {
        page[k.replace(eventPreffix, '')] = component[k]
        processEvent(pagePath, k, weappPageConf)
      }
    }
    const prototypeChain = getPrototypeChain(component)
    prototypeChain.forEach(item => {
      Object.getOwnPropertyNames(item).forEach(fn => {
        if (fn.indexOf(eventPreffix) >= 0) {
          page[fn.replace(eventPreffix, '')] = component[fn]
          processEvent(pagePath, fn, weappPageConf)
        }
      })
    })

    return weappPageConf
  }
  return recurrenceComponent(weappPageConf, page)
}

export function processDynamicComponents (page, weappPageConf, updateFromComponent, isFirst) {
  const pagePath = page.path
  scopeMap[pagePath] = scopeMap[pagePath] || {}
  function recursiveDynamicComponents (component) {
    if (component.$dynamicComponents && !isEmptyObject(component.$dynamicComponents)) {
      component.$$dynamicComponents = component.$$dynamicComponents || {}
      Object.getOwnPropertyNames(component.$dynamicComponents).forEach(name => {
        const dynamicComponetFn = component.$dynamicComponents[name]
        const loopRes = dynamicComponetFn()
        const stateName = loopRes.stateName
        const loopComponents = loopRes.loopComponents
        const oldStateData = safeGet(component.state, stateName)
        let stateData
        if (Array.isArray(oldStateData)) {
          stateData = oldStateData.slice(0)
        } else {
          stateData = Object.assign({}, oldStateData)
        }
        component._dyState = component._dyState || {}
        safeSet(component._dyState, stateName, stateData)
        recurrence(loopComponents, stateData, -1)
        function recurrence (loopComponents, stateData, level) {
          loopComponents.forEach((item, loopId) => {
            if (Array.isArray(item)) {
              recurrence(item, stateData[loopId], loopId)
              return
            }
            const _class = item.path
            const components = item.components
            const children = item.children
            const subscript = item.subscript
            stateData = subscript ? safeGet(stateData, subscript) : stateData
            if (!stateData) {
              return
            }
            if (components && components.length) {
              components.forEach(function (item, index) {
                const comPath = `${item.body.$path}_${index}`
                let child
                Object.getOwnPropertyNames(component.$$dynamicComponents).forEach(c => {
                  if (c === comPath) {
                    child = component.$$dynamicComponents[c]
                  }
                })
                const props = transformPropsForComponent(item.body, _class.defaultProps)
                if (!child) {
                  child = new _class(props)
                  try {
                    child.state = child._createData()
                  } catch (err) {
                    console.error(err)
                  }
                  child.$path = comPath
                  child.props.$path = comPath
                  child._init(component.$scope)
                  child._initData(component.$root || component, component)
                  componentTrigger(child, 'componentWillMount')
                  componentTrigger(child, 'componentDidMount')
                } else {
                  const isUpdateFromParent = typeof updateFromComponent === 'undefined' ||
                    !updateFromComponent.$isComponent ||
                    updateFromComponent.$components.hasOwnProperty(child.constructor.name)
                  props.$path = comPath
                  child.$path = comPath
                  child.props.$path = comPath
                  child.prevProps = child.prevProps || child.props
                  child.props = Object.assign({}, child.props, props)
                  child._init(component.$scope)
                  child._initData(component.$root || component, component)
                  if (isUpdateFromParent && !isFirst) {
                    child._unsafeCallUpdate = true
                    updateComponent(child, false)
                    child._unsafeCallUpdate = false
                  }
                }
                recursiveDynamicComponents(child)
                if (stateData) {
                  stateData[index] = Object.assign({}, child.props, { ...stateData[index] }, Object.assign({}, child.state, child._dyState || {}))
                }
                component.$$dynamicComponents[comPath] = child
                scopeMap[pagePath][comPath] = child
                if (weappPageConf) {
                  for (const k in child) {
                    if (k.indexOf(eventPreffix) >= 0) {
                      processEvent(pagePath, k, weappPageConf)
                    }
                  }
                  const prototypeChain = getPrototypeChain(child)
                  prototypeChain.forEach(item => {
                    Object.getOwnPropertyNames(item).forEach(fn => {
                      if (fn.indexOf(eventPreffix) >= 0) {
                        processEvent(pagePath, fn, weappPageConf)
                      }
                    })
                  })
                }
                if (item.children && item.children.length) {
                  recurrence(item.children, stateData[index], `${index}_${level}`)
                }
              })
            }
            if (children && children.length) {
              recurrence(children, stateData, level)
            }
          })
        }
      })
    }
  }
  recursiveDynamicComponents(page)
}

function componentTrigger (component, key) {
  if (key === 'componentWillUnmount') {
    component._dirty = true
    component._disable = true
    component.$components = {}
    component.$$components = {}
    component.$$dynamicComponents = {}
    component.$router = {
      params: {}
    }
    component._pendingStates = []
    component._pendingCallbacks = []
  }
  component[key] && typeof component[key] === 'function' && component[key]()
  if (key === 'componentWillMount') {
    if (component.$isComponent) {
      component.$router.params = component.$root.$router.params
    }
    component._dirty = false
    component._disable = false
    component.state = component.getState()
    if (!component.$isComponent) {
      updateComponent(component, true, true)
    }
  }
}

function transformPropsForComponent (props, defaultProps, propTypes) {
  const newProps = {}
  for (const propName in props) {
    const propValue = props[propName]
    newProps[propName] = propValue
  }
  if (defaultProps) {
    for (const propName in defaultProps) {
      if (newProps[propName] === undefined) {
        newProps[propName] = defaultProps[propName]
      }
    }
  }
  if (propTypes) {
    for (const propName in propTypes) {
      if (newProps[propName] === undefined) {
        newProps[propName] = propTypes[propName]
      }
    }
  }
  return newProps
}

function createPage (PageClass, options) {
  const pageProps = transformPropsForComponent({}, PageClass.defaultProps, PageClass.propTypes)
  const page = new PageClass(pageProps)
  try {
    page.state = page._createData()
  } catch (err) {
    console.error(err)
  }
  const initPageInfo = {
    props: Object.assign({}, page.props),
    state: Object.assign({}, page.state)
  }
  page.$isComponent = false
  page.path = options.path
  const weappPageConf = {
    onLoad (options) {
      page._init(this)
      processDynamicComponents(page, weappPageConf)
      page._initData()
      page.$router.params = options
      componentTrigger(page, 'componentWillMount')
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
      page.state = initPageInfo.state
      page.props = initPageInfo.props
      componentTrigger(page, 'componentWillUnmount')
    },
    _setData (data, cb, isRoot) {
      if (isRoot) {
        const filterData = {}
        for (let k in data) {
          if (typeof data[k] !== 'undefined') {
            filterData[k] = data[k]
          }
        }
        this.setData(filterData, () => {
          cb && cb()
        })
      }
    }
  }
  let weappPageConfEvents = initPage(weappPageConf, page, options)
  page._initData()
  pageExtraFns.forEach(fn => {
    if (typeof page[fn] === 'function') {
      weappPageConf[fn] = page[fn].bind(page)
    }
  })
  const data = {}
  if (page.$usedState && page.$usedState.length) {
    page.$usedState.forEach(key => {
      const value = safeGet(page.$data, key)
      safeSet(data, key, value)
    })
  }
  return Object.assign(weappPageConfEvents, {
    data
  })
}

export default createPage
