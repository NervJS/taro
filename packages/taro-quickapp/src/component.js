import {
  internal_safe_get as safeGet
} from '@tarojs/taro'
import { enqueueRender } from './render-queue'
import { updateComponent } from './lifecycle'

export default class BaseComponent {
  // _createData的时候生成，小程序中通过data.__createData访问
  __computed = {}
  // this.props,小程序中通过data.__props访问
  __props = {}
  __isReady = false
  // 会在componentDidMount后置为true
  __mounted = false
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

  // 会被匿名函数调用
  __triggerPropsFn (key, args) {
    const keyChain = key.split('.')
    const reduxFnPrefix = '__event_'
    const reduxFnName = reduxFnPrefix + keyChain.shift()
    // redux标识过的方法，直接调用
    if (reduxFnName in this) {
      const scope = args.shift()
      let fn
      if (keyChain.length > 0) {
        fn = safeGet(this[reduxFnName], keyChain.join('.'))
      } else {
        fn = this[reduxFnName]
      }
      fn.apply(scope, args)
    } else {
      // 普通的
      const keyLower = key.toLocaleLowerCase()
      const payload = {
        __isCustomEvt: true,
        __arguments: args
      }
      const detail = {}
      if (this.$scope._externalBinding) {
        const tempalateAttr = this.$scope._externalBinding.template.attr
        Object.keys(tempalateAttr).forEach(item => {
          if (/^data/.test(item)) {
            detail[item.replace(/^data/, '')] = tempalateAttr[item]
          }
        })
      }

      if (Object.keys(detail).length) {
        payload.__detail = detail
      }
      this.$scope.$emit(keyLower.replace(/^on/, ''), payload)
    }
  }
}
