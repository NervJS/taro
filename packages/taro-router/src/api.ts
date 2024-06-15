import { addLeadingSlash } from '@tarojs/runtime'
import { EventChannel } from '@tarojs/shared'
import Taro from '@tarojs/taro'
import { parsePath } from 'history'

import { history, prependBasename } from './history'
import { RouterConfig } from './router'
import stacks from './router/stack'
import { routesAlias } from './utils'

import type { Path } from 'history'
import type { NavigateBackOption, NavigateOption, Option } from '../types/api'

type MethodName = 'navigateTo' | 'navigateBack' | 'switchTab' | 'redirectTo' | 'reLaunch'

const routeEvtChannel = EventChannel.routeChannel

function processNavigateUrl (option: Option): Partial<Path> {
  const pathPieces = parsePath(option.url)
  // 处理相对路径
  if (pathPieces.pathname?.includes('./')) {
    const parts = routesAlias.getOrigin(history.location.pathname).split('/')
    parts.pop()
    pathPieces.pathname.split('/').forEach((item) => {
      if (item === '.') return
      item === '..' ? parts.pop() : parts.push(item)
    })
    pathPieces.pathname = parts.join('/')
  }
  // 确保是 / 开头的路径
  pathPieces.pathname = addLeadingSlash(pathPieces.pathname)
  // 处理自定义路由
  pathPieces.pathname = routesAlias.getAlias(addLeadingSlash(pathPieces.pathname))
  // 处理 basename
  pathPieces.pathname = prependBasename(pathPieces.pathname)
  // hack fix history v5 bug: https://github.com/remix-run/history/issues/814
  if (!pathPieces.search) pathPieces.search = ''
  return pathPieces
}

async function navigate (option: Option | NavigateBackOption, method: MethodName) {
  return new Promise<TaroGeneral.CallbackResult>((resolve, reject) => {
    stacks.method = method
    const { success, complete, fail } = option
    const unListen = history.listen(() => {
      const res: any = { errMsg: `${method}:ok` }
      if (method === 'navigateTo') {
        res.eventChannel = routeEvtChannel
        routeEvtChannel.addEvents((option as NavigateOption).events)
      }
      success?.(res)
      complete?.(res)
      resolve(res)
      unListen()
    })

    try {
      if ('url' in option) {
        const pathPieces = processNavigateUrl(option)
        const state = { timestamp: Date.now() }
        if (method === 'navigateTo') {
          // Note: 由于 spa 会针对弱网情况下，短时间内多次跳转同一个页面跳转加了锁，后续如果有用户反馈返回无效，那可能是这个问题
          history.push(pathPieces, state)
        } else if (method === 'redirectTo' || method === 'switchTab') {
          history.replace(pathPieces, state)
        } else if (method === 'reLaunch') {
          stacks.delta = stacks.length
          history.replace(pathPieces, state)
        }
      } else if (method === 'navigateBack') {
        stacks.delta = option.delta
        if (stacks.length > option.delta) {
          history.go(-option.delta)
        } else {
          history.go(1 - stacks.length)
        }
      }
    } catch (error) {
      const res = { errMsg: `${method}:fail ${error.message || error}` }
      fail?.(res)
      complete?.(res)
      if (fail || complete) {
        return resolve(res)
      } else {
        return reject(res)
      }
    }
  })
}

export function navigateTo (option: Taro.navigateTo.Option): ReturnType<typeof Taro.navigateTo> {
  return navigate(option, 'navigateTo')
}

export function redirectTo (option: Taro.redirectTo.Option): ReturnType<typeof Taro.redirectTo> {
  return navigate(option, 'redirectTo')
}

export function navigateBack (option: Taro.navigateBack.Option = { delta: 1 }): ReturnType<typeof Taro.navigateBack> {
  if (!option.delta || option.delta < 1) {
    option.delta = 1
  }
  return navigate(option as NavigateBackOption, 'navigateBack')
}

export function switchTab (option: Taro.switchTab.Option): ReturnType<typeof Taro.switchTab> {
  return navigate(option, 'switchTab')
}

export function reLaunch (option: Taro.reLaunch.Option): ReturnType<typeof Taro.reLaunch> {
  return navigate(option, 'reLaunch')
}

export function getCurrentPages (): Taro.Page[] {
  if (process.env.NODE_ENV !== 'production' && RouterConfig.mode === 'multi') {
    console.warn('多页面路由模式不支持使用 getCurrentPages 方法！')
  }
  const pages = stacks.get()
  return pages.map(e => ({ ...e, route: e.path?.replace(/\?.*/g, '') || '' }))
}
