import { useState } from '@tarojs/taro'

import {
  PropTypes,
  onError,
  getStore,
  setStore,
  observer,
  isUsingStaticRendering,
  useStaticRendering,
  useLocalStore as originUseLocalStore,
  useAsObservableSource as originUseAsObservableSource
} from '@tarojs/mobx-common'

import { inject } from './inject'

class Provider {}

function useLocalStore (initializer, current) {
  return originUseLocalStore(initializer, current, useState)
}

function useAsObservableSource (current) {
  return originUseAsObservableSource(current, useState)
}

export default {
  PropTypes,
  onError,
  getStore,
  setStore,
  inject,
  observer,
  Provider,
  useLocalStore,
  useAsObservableSource,
  isUsingStaticRendering,
  useStaticRendering
}

export {
  PropTypes,
  onError,
  getStore,
  setStore,
  inject,
  observer,
  Provider,
  useLocalStore,
  useAsObservableSource,
  isUsingStaticRendering,
  useStaticRendering
}
