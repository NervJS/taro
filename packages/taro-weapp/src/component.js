import { enqueueRender } from './render-queue'

// #组件state对应小程序组件data
// #私有的__componentProps更新用于触发子组件中对应obsever，生命周期componentWillReciveProps,componentShouldUpdate在这里处理
// #父组件传过来的props放到data.__props中供模板使用，这么做的目的是模拟reciveProps生命周期
// 执行顺序：组件setState -> 组件_createData() -> 对应的小程序组件setData（组件更新）-> 子组件的__componentProps.observer执行
//          -> 触发子组件componentWillReciveProps，更新子组件props,componentShouldUpdate -> 子组件_createData -> 子组件setData

class BaseComponent {
  // _createData的时候生成，小程序中通过data.__createData访问
  __computed = {}
  // this.props,小程序中通过data.__props访问
  __props = {}
  __isAttached = false
  // 会在componentDidMount后置为true
  __mounted = false
  nextProps = {}
  _dirty = true
  _disable = true
  _pendingStates = []
  _pendingCallbacks = []

  constructor (props) {
    this.state = {}
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
}

export default BaseComponent
