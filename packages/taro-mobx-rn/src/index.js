import { createStoreInjector } from './inject'
import { observer as originObserver, inject as originInject } from '@tarojs/mobx-common'

export function inject () {
  return originInject(...arguments, createStoreInjector)
}

export function observer (Component) {
  return originObserver(Component, 'render')
}

export { onError } from '@tarojs/mobx-common'
export { default as Provider } from './Provider'