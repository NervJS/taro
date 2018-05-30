import Nerv from 'nervjs'

class Component extends Nerv.Component {
  constructor () {
    super(...arguments)
  }
  get $app () {
    if (!this.vnode) return {}
    if (!this._$app) this._$app = getApp(this)
    return this._$app
  }

  set $app (app) {
    console.warn('Please try not to set $app.')
  }
}

/**
 * 往上遍历直到找到根节点
 * @param  {Nerv Component} component 当前的组件实例
 * @return {Nerv Component}           根节点实例
 */
function getApp (component) {
  const vnode = component.vnode

  if (!vnode) return {}
  if (vnode._owner) return getApp(vnode._owner)

  return component
}

export default Component
