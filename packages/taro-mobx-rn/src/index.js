import { useState } from '@tarojs/taro-rn'

import {
  PropTypes,
  onError,
  isUsingStaticRendering,
  useStaticRendering,
  useLocalStore as originUseLocalStore,
  useAsObservableSource as originUseAsObservableSource
} from '@tarojs/mobx-common'

import Provider from './Provider'
import { inject } from './inject'
import { observer } from './observer'

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
