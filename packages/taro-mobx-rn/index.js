import { configure } from 'mobx'
import { Component } from '@tarojs/taro-rn'
import { Children, createElement } from 'react'
import { unstable_batchedUpdates as rdBatched } from 'react-native'
import { createProvider, inject as originInject } from '@tarojs/mobx-common'

if (typeof rdBatched === 'function') {
  configure({ reactionScheduler: rdBatched })
}

export function inject() {
  return originInject(...arguments, { Component, createElement })
}

export const Provider = createProvider(Component, Children)

export { observer, propTypes, PropTypes } from '@tarojs/mobx-common'
