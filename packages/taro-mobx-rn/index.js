import { Component } from '@tarojs/taro-rn'
import { createElement } from 'react'
import { inject as originInject } from '@tarojs/mobx-common'

export function inject () {
  return originInject(...arguments, { Component, createElement })
}

export { observer } from '@tarojs/mobx-common'

export { default as Provider } from './Provider'