import Nerv from 'nervjs'

class Component extends Nerv.Component {
  get $router () {
    if (this.props.__router) {
      return this.props.__router.location
    }
  }
  set $router (args) {
    console.warn('Property "$router" is read-only.')
  }

  get $app () {
    if (!this.vnode) return {}
    if (!this._$app) this._$app = getApp(this)
    return this._$app
  }

  set $app (app) {
    console.warn('Property "$app" is read-only.')
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
