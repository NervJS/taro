import { mapStoreToProps, getInjectName, inject as originInject } from '@tarojs/mobx-common'

function createStoreInjector (grabStoresFn, injectNames, Component) {
  class Injector extends Component {
    static isMobxInjector = true
    static displayName = getInjectName(Component, injectNames)
    constructor (props, isPage) {
      super(Object.assign(...arguments, mapStoreToProps(grabStoresFn, props)), isPage)
    }

    _constructor () {
      Object.assign(this.props, mapStoreToProps(grabStoresFn, this.props))
      super._constructor && super._constructor(this.props)
    }
  }
  return Injector
}

export function inject () {
  return originInject(...arguments, createStoreInjector)
}
