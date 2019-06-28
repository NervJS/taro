import { useState } from '@tarojs/taro-h5'

import {
  PropTypes,
  onError,
  observer,
  isUsingStaticRendering,
  useStaticRendering,
  useLocalStore as originUseLocalStore,
  useAsObservableSource as originUseAsObservableSource
} from '@tarojs/mobx-common'

import Provider from './Provider'
import { inject } from './inject'

function useLocalStore (initializer, current) {
  return originUseLocalStore(initializer, current, useState)
}

function useAsObservableSource (current) {
  return originUseAsObservableSource(current, useState)
}

export default {
  PropTypes,
  onError,
  observer,
  inject,
  Provider,
  useLocalStore,
  useAsObservableSource,
  isUsingStaticRendering,
  useStaticRendering
}

export {
  PropTypes,
  onError,
  observer,
  inject,
  Provider,
  useLocalStore,
  useAsObservableSource,
  isUsingStaticRendering,
  useStaticRendering
}
