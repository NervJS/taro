import { Component } from '@tarojs/taro-h5'
import { createElement, Children } from 'nervjs'
import { createProvider, inject as originInject } from '@tarojs/mobx-common'

export function inject () {
  return originInject(...arguments, { Component, createElement })
}

export const Provider = createProvider(Component, Children)

export { observer } from '@tarojs/mobx-common'
