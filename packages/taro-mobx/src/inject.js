import { mapStoreToProps, getInjectName, inject as originInject } from '@tarojs/mobx-common'

function createStoreInjector (grabStoresFn, injectNames, Component) {
  class Injector extends Component {
    static isMobxInjector = true
    static displayName = getInjectName(Component, injectNames)
    constructor (props, isPage) {
      super(Object.assign(...arguments, mapStoreToProps(grabStoresFn, props)), isPage)
    }

    componentWillMount () {
      Object.assign(this.props, mapStoreToProps(grabStoresFn, this.props))
      if (typeof super.componentWillMount === 'function') {
        super.componentWillMount()
      }
    }
  }
  const target = Injector.prototype
  const originCreateData = target._createData
  target._createData = function (...args) {
    Object.assign(this.props, mapStoreToProps(grabStoresFn, this.props))
    return originCreateData.call(this, null, null, args[2])
  }
  return Injector
}

export function inject () {
  return originInject(...arguments, createStoreInjector)
}
