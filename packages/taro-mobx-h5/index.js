import { configure } from 'mobx'
import { Component } from '@tarojs/taro-h5'
import { createElement, Children, unstable_batchedUpdates as rdBatched } from 'nervjs'
import { createProvider, inject as originInject } from '@tarojs/mobx-common'

if (typeof rdBatched === 'function') {
  configure({ reactionScheduler: rdBatched })
}

export function inject() {
  return originInject(...arguments, { Component, createElement })
}

export const Provider = createProvider(Component, Children)

export { observer, propTypes, PropTypes } from '@tarojs/mobx-common'
