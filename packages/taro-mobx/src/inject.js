import { mapStoreToProps, generateDisplayName } from '@tarojs/mobx-common'

export function createStoreInjector (grabStoresFn, injectNames, Component) {
  class Injector extends Component {
    static isMobxInjector = true
    static displayName = generateDisplayName(Component, injectNames)
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
  target._createData = function () {
    Object.assign(this.props, mapStoreToProps(grabStoresFn, this.props))
    return originCreateData.call(this)
  }
  return Injector
}