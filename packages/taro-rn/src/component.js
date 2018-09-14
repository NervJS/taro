import React from 'react'

/**
 * @description 组件的基类，注入 $router 等
 */
class Component extends React.Component {
  constructor (props, context) {
    super(props, context)
    if (props.navigation) {
      this.$router = props.navigation.state.params || {}
    }
  }

  get $app () {
    if (!this._reactInternalFiber) return {}
    if (!this._$app) this._$app = getApp(this)
    return this._$app
  }

  set $app (app) {
    console.warn('Please try not to set $app.')
  }
}

/**
 * 往上遍历直到找到根节点
 * @param  {React Component} component 当前的组件实例
 * @return {React Component}           根节点实例
 */
function getApp (component) {
  if (component.constructor.name) {
    return component
  } else {
    const vnode = component._reactInternalFiber
    if (!vnode) return {}
    if (vnode._debugOwner) return getApp(vnode._debugOwner.stateNode)
    return component
  }
}

export default Component
