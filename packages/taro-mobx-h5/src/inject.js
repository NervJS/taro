import { createElement } from 'nervjs'
import { mapStoreToProps, getInjectName, inject as originInject } from '@tarojs/mobx-common'

function createStoreInjector (grabStoresFn, injectNames, sourceComponent) {
  class Injector extends sourceComponent {
    static isMobxInjector = true
    static config = sourceComponent.config || {}
    static displayName = getInjectName(sourceComponent, injectNames)

    render () {
      const originProps = mapStoreToProps(grabStoresFn, this.props)
      return createElement(sourceComponent, {
        ...originProps,
        ref: ref => {
          originProps.ref && originProps.ref(ref)
        }
      })
    }
  }

  return Injector
}

export function inject () {
  return originInject(...arguments, createStoreInjector)
}
