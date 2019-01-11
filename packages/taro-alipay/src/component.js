import { enqueueRender } from './render-queue'
import { updateComponent } from './lifecycle'
import { getObjChainValue } from './util'
import { cacheDataSet, cacheDataGet } from './data-cache'
// #组件state对应小程序组件data
// #私有的__componentProps更新用于触发子组件中对应obsever，生命周期componentWillReciveProps,componentShouldUpdate在这里处理
// #父组件传过来的props放到data.__props中供模板使用，这么做的目的是模拟reciveProps生命周期
// 执行顺序：组件setState -> 组件_createData() -> 对应的小程序组件setData（组件更新）-> 子组件的__componentProps.observer执行
//          -> 触发子组件componentWillReciveProps，更新子组件props,componentShouldUpdate -> 子组件_createData -> 子组件setData

const PRELOAD_DATA_KEY = 'preload'

class BaseComponent {
  // _createData的时候生成，小程序中通过data.__createData访问
  __computed = {}
  // this.props,小程序中通过data.__props访问
  __props = {}
  __isReady = false
  // 会在componentDidMount后置为true
  __mounted = false
  nextProps = {}
  _dirty = true
  _disable = true
  _pendingStates = []
  _pendingCallbacks = []
  $componentType = ''
  $router = {
    params: {},
    path: ''
  }

  constructor (props = {}, isPage) {
    this.state = {}
    this.props = {}
    this.$componentType = isPage ? 'PAGE' : 'COMPONENT'
    this.isTaroComponent = this.$componentType && this.$router && this._pendingStates
  }
  _constructor (props) {
    this.props = props || {}
  }
  _init (scope) {
    this.$scope = scope
  }
  setState (state, callback) {
    if (state) {
      (this._pendingStates = this._pendingStates || []).push(state)
    }
    if (typeof callback === 'function') {
      (this._pendingCallbacks = this._pendingCallbacks || []).push(callback)
    }
    if (!this._disable) {
      enqueueRender(this)
    }
  }

  getState () {
    const { _pendingStates, state, props } = this
    const stateClone = Object.assign({}, state)
    delete stateClone.__data
    if (!_pendingStates.length) {
      return stateClone
    }
    const queue = _pendingStates.concat()
    this._pendingStates.length = 0
    queue.forEach((nextState) => {
      if (typeof nextState === 'function') {
        nextState = nextState.call(this, stateClone, props)
      }
      Object.assign(stateClone, nextState)
    })
    return stateClone
  }

  forceUpdate (callback) {
    if (typeof callback === 'function') {
      (this._pendingCallbacks = this._pendingCallbacks || []).push(callback)
    }
    updateComponent(this)
  }

  $preload (key, value) {
    const preloadData = cacheDataGet(PRELOAD_DATA_KEY) || {}
    if (typeof key === 'object') {
      for (const k in key) {
        preloadData[k] = key[k]
      }
    } else {
      preloadData[key] = value
    }
    cacheDataSet(PRELOAD_DATA_KEY, preloadData)
  }

  __triggerPropsFn (key, args) {
    let eventBindArgs = []

    const argsMap = {}
    const prefix = `data-e-${key}-`
    for (const k in this.props) {
      if (k.indexOf(prefix) > -1) argsMap[k.replace(prefix, '').replace('-', '')] = this.props[k]
    }

    argsMap['so'] && delete argsMap['so']

    eventBindArgs = Object.keys(argsMap)
      .sort()
      .map(argName => argsMap[argName])

    const fn = getObjChainValue(this.props, key)
    typeof fn === 'function' && fn(...eventBindArgs, ...args)
  }
}

export default BaseComponent
