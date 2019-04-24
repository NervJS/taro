import { createStoreInjector } from './inject'
import { getStore, setStore, observer as originObserver, inject as originInject } from '@tarojs/mobx-common'

class Provider {}

function observer (Component) {
  return originObserver(Component, '_createData')
}

function inject () {
  return originInject(...arguments, createStoreInjector)
}

export default {
  getStore,
  setStore,
  observer,
  inject,
  Provider
}

export {
  getStore,
  setStore,
  observer,
  inject,
  Provider
}