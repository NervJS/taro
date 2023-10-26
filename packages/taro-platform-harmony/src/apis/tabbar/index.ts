// eslint-disable-next-line import/no-duplicates
import { Current } from '@tarojs/runtime'
// eslint-disable-next-line import/no-duplicates
import { eventCenter } from '@tarojs/runtime/dist/runtime.esm'

import { callAsyncFail, callAsyncSuccess } from '../utils'

import type Taro from '@tarojs/taro'

type SetTabBarStyle = typeof Taro.setTabBarStyle
type SetTabBarItem = typeof Taro.setTabBarItem

interface ShowTabBar {
  type: 'show'
  fn: typeof Taro.showTabBar
}

interface HideTabBar {
  type: 'hide'
  fn: typeof Taro.hideTabBar
}

type ToggleAPIs = ShowTabBar | HideTabBar

const toggleTabBar = function<T extends ToggleAPIs['type']> (type: T): Extract<ToggleAPIs, {type: T}>['fn'] {
  return function (options) {
    return new Promise((resolve, reject) => {
      const taro = (Current as any).taro
      const page = taro.getCurrentInstance().page
      const currentData = page._data?.taroTabBar || page.__tabBar
      const res = { errMsg: `${type}TabBar:ok` }
      const error = { errMsg: `${type}TabBar:fail not TabBar page` }

      if (!currentData) {
        callAsyncFail(reject, error, options)
      } else {
        const isShow = type === 'show'
        const event = isShow ? '__taroShowTabBar' : '__taroHideTabBar'
        eventCenter.trigger(event, {
          animation: options?.animation,
        })
        page.$set('isShowTaroTabBar', isShow)
        callAsyncSuccess(resolve, res, options)
      }
    })
  }
}

export const showTabBar = toggleTabBar('show')

export const hideTabBar = toggleTabBar('hide')

export const setTabBarStyle: SetTabBarStyle = function (options = {}) {
  return new Promise((resolve, reject) => {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page
    const currentData = page._data?.taroTabBar || page.__tabBar
    const res = { errMsg: 'setTabBarStyle:ok' }
    const error = { errMsg: 'setTabBarStyle:fail not TabBar page' }

    if (!currentData) {
      callAsyncFail(reject, error, options)
    } else {
      const data = Object.assign({}, currentData)

      if (options.color) data.color = options.color
      if (options.selectedColor) data.selectedColor = options.selectedColor
      if (options.backgroundColor) data.backgroundColor = options.backgroundColor
      if (options.borderStyle) data.borderStyle = options.borderStyle

      eventCenter.trigger('__taroSetTabBarStyle', data)
      page.$set('taroTabBar', data)
      callAsyncSuccess(resolve, res, options)
    }
  })
}

export const setTabBarItem: SetTabBarItem = function (options) {
  return new Promise((resolve, reject) => {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page
    const currentData = page._data?.taroTabBar || page.__tabBar
    const res = { errMsg: 'setTabBarItem:ok' }
    const error = { errMsg: 'setTabBarItem:fail not TabBar page' }

    if (!currentData) {
      callAsyncFail(reject, error, options)
    } else {
      const index = options.index
      const item = Object.assign({}, currentData.list[index])

      if (options.text) item.text = options.text
      if (options.iconPath) item.iconPath = options.iconPath
      if (options.selectedIconPath) item.selectedIconPath = options.selectedIconPath

      const list = [
        ...currentData.list.slice(0, index),
        item,
        ...currentData.list.slice(index + 1)
      ]
      const data = Object.assign({}, currentData, { list })

      eventCenter.trigger('__taroSetTabBarItem', data)
      page.$set('taroTabBar', data)
      callAsyncSuccess(resolve, res, options)
    }
  })
}

export function showTabBarRedDot (options) {
  const res = { errMsg: 'showTabBarRedDot:ok' }
  return new Promise((resolve) => {
    eventCenter.trigger('__taroShowTabBarRedDotHandler', {
      index: options?.index || 0,
    })
    callAsyncSuccess(resolve, res, options)
  })
}

export function hideTabBarRedDot (options) {
  const res = { errMsg: 'hideTabBarRedDot:ok' }
  return new Promise((resolve) => {
    eventCenter.trigger('__taroHideTabBarRedDotHandler', {
      index: options?.index || 0,
    })
    callAsyncSuccess(resolve, res, options)
  })
}

export function setTabBarBadge (options) {
  const res = { errMsg: 'setTabBarBadge:ok' }
  return new Promise((resolve) => {
    eventCenter.trigger('__taroSetTabBarBadge', {
      index: options?.index || 0,
      text: options?.text || '',
    })
    callAsyncSuccess(resolve, res, options)
  })
}

export function removeTabBarBadge (options) {
  const res = { errMsg: 'removeTabBarBadge:ok' }
  return new Promise((resolve) => {
    eventCenter.trigger('__taroRemoveTabBarBadge', {
      index: options?.index || 0,
    })
    callAsyncSuccess(resolve, res, options)
  })
}
