import { createStoreInjector } from './inject'
import { onError, getStore, setStore, observer as originObserver, inject as originInject } from '@tarojs/mobx-common'

class Provider {}

function observer (Component) {
  return originObserver(Component, '_createData')
}

function inject () {
  return originInject(...arguments, createStoreInjector)
}

export default {
  onError,
  getStore,
  setStore,
  observer,
  inject,
  Provider
}

export {
  onError,
  getStore,
  setStore,
  observer,
  inject,
  Provider
}