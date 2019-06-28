import { useState } from '@tarojs/taro-rn'

import {
  onError,
  observer,
  isUsingStaticRendering,
  useStaticRendering,
  useLocalStore as originUseLocalStore,
  useAsObservableSource as originUseAsObservableSource,
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
  onError,
  observer,
  inject,
  Provider,
  useLocalStore,
  useAsObservableSource,
  isUsingStaticRendering,
  useStaticRendering
}