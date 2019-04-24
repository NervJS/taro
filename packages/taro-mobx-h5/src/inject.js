import { createElement } from 'nervjs'
import { Component } from '@tarojs/taro-h5'
import { mapStoreToProps, generateDisplayName } from '@tarojs/mobx-common'

export function createStoreInjector (grabStoresFn, injectNames, sourceComponent) {
  class Injector extends Component {
    static isMobxInjector = true
    static config = sourceComponent.config || {}
    static displayName = generateDisplayName(sourceComponent, injectNames)

    render () {
      return createElement(sourceComponent, mapStoreToProps(grabStoresFn, this.props))
    }

    componentDidShow () {
      const { componentDidShow } = sourceComponent.prototype
      if (typeof componentDidShow === 'function') {
        componentDidShow()
      }
    }

    componentDidHide () {
      const { componentDidHide } = sourceComponent.prototype
      if (typeof componentDidHide === 'function') {
        componentDidHide()
      }
    }
  }

  return Injector
}
