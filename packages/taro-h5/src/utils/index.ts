/* eslint-disable prefer-promise-reject-errors */
import Taro from '@tarojs/api'
import { getCurrentPage, getHomePage } from '@tarojs/router/dist/utils'
import { Current, hooks, TaroElement } from '@tarojs/runtime'
import { isFunction } from '@tarojs/shared'

import { MethodHandler } from './handler'

export function shouldBeObject (target: unknown) {
  if (target && typeof target === 'object') return { flag: true }
  return {
    flag: false,
    msg: getParameterError({
      correct: 'Object',
      wrong: target
    })
  }
}

export function findDOM (inst?): TaroElement | HTMLElement | undefined {
  if (inst && hooks.isExist('getDOMNode')) {
    return hooks.call('getDOMNode', inst)
  }

  const page = Current.page
  const path = page?.path
  const msg = '没有找到已经加载了的页面，请在页面加载完成后时候此 API。'
  if (path == null) {
    throw new Error(msg)
  }

  const el = document.getElementById(path)
  if (el == null) {
    throw new Error('在已加载页面中没有找到对应的容器元素。')
  }

  return el
}

interface IParameterErrorParam {
  name?: string
  para?: string
  correct?: string
  wrong?: unknown
}
export function getParameterError ({ name = '', para, correct, wrong }: IParameterErrorParam) {
  const parameter = para ? `parameter.${para}` : 'parameter'
  const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong)
  if (name) {
    return `${name}:fail parameter error: ${parameter} should be ${correct} instead of ${errorType}`
  } else {
    return `parameter error: ${parameter} should be ${correct} instead of ${errorType}`
  }
}

function upperCaseFirstLetter (string) {
  if (typeof string !== 'string') return string
  string = string.replace(/^./, match => match.toUpperCase())
  return string
}

export function inlineStyle (style) {
  let res = ''
  for (const attr in style) res += `${attr}: ${style[attr]};`
  if (res.indexOf('display: flex;') >= 0) res += 'display: -webkit-box;display: -webkit-flex;'
  res = res.replace(/transform:(.+?);/g, (s, $1) => `${s}-webkit-transform:${$1};`)
  res = res.replace(/flex-direction:(.+?);/g, (s, $1) => `${s}-webkit-flex-direction:${$1};`)
  return res
}

export function setTransform (el, val) {
  el.style.webkitTransform = val
  el.style.transform = val
}

export function serializeParams (params) {
  if (!params) {
    return ''
  }
  return Object.keys(params)
    .map(key => (
      `${encodeURIComponent(key)}=${typeof (params[key]) === 'object'
        ? encodeURIComponent(JSON.stringify(params[key]))
        : encodeURIComponent(params[key])}`))
    .join('&')
}

export function temporarilyNotSupport (name = '') {
  return (option = {}, ...args) => {
    const { success, fail, complete } = option as any
    const handle = new MethodHandler({ name, success, fail, complete })
    const errMsg = '暂时不支持 API'
    Taro.eventCenter.trigger('__taroNotSupport', {
      name,
      args: [option, ...args],
      type: 'method',
      category: 'temporarily',
    })
    if (process.env.NODE_ENV === 'production') {
      console.warn(errMsg)
      return handle.success({ errMsg })
    } else {
      return handle.fail({ errMsg })
    }
  }
}

export function weixinCorpSupport (name: string) {
  return (option = {}, ...args) => {
    const { success, fail, complete } = option as any
    const handle = new MethodHandler({ name, success, fail, complete })
    const errMsg = 'h5 端当前仅在微信公众号 JS-SDK 环境下支持此 API'
    Taro.eventCenter.trigger('__taroNotSupport', {
      name,
      args: [option, ...args],
      type: 'method',
      category: 'weixin_corp',
    })
    if (process.env.NODE_ENV === 'production') {
      console.warn(errMsg)
      return handle.success({ errMsg })
    } else {
      return handle.fail({ errMsg })
    }
  }
}

export function permanentlyNotSupport (name = '') {
  return (option = {}, ...args: any[]) => {
    const { success, fail, complete } = option as any
    const handle = new MethodHandler({ name, success, fail, complete })
    const errMsg = '不支持 API'
    Taro.eventCenter.trigger('__taroNotSupport', {
      name,
      args: [option, ...args],
      type: 'method',
      category: 'permanently',
    })
    if (process.env.NODE_ENV === 'production') {
      console.warn(errMsg)
      return handle.success({ errMsg })
    } else {
      return handle.fail({ errMsg })
    }
  }
}

interface IProcessOpenApi<TOptions = Record<string, unknown>, TResult extends TaroGeneral.CallbackResult = any> {
  name: string
  defaultOptions?: TOptions
  standardMethod?: (opts: TOptions) => Promise<TResult>
  formatOptions?: (opts: TOptions) => TOptions
  formatResult?: (res: TResult) => TResult
}

export function processOpenApi<TOptions = Record<string, unknown>, TResult extends TaroGeneral.CallbackResult = any> ({
  name,
  defaultOptions,
  standardMethod,
  formatOptions = options => options,
  formatResult = res => res
}: IProcessOpenApi<TOptions, TResult>) {
  const notSupported = weixinCorpSupport(name)
  return (options: Partial<TOptions> = {}, ...args: any[]): Promise<TResult> => {
    // @ts-ignore
    const targetApi = window?.wx?.[name]
    const opts = formatOptions(Object.assign({}, defaultOptions, options))
    if (isFunction(targetApi)) {
      return new Promise<TResult>((resolve, reject) => {
        ['fail', 'success', 'complete'].forEach(k => {
          opts[k] = preRef => {
            const res = formatResult(preRef)
            options[k] && options[k](res)
            if (k === 'success') {
              resolve(res)
            } else if (k === 'fail') {
              reject(res)
            }
          }
          return targetApi(opts)
        })
      })
    } else if (isFunction(standardMethod)) {
      return standardMethod(opts)
    } else {
      return notSupported(options, ...args) as Promise<TResult>
    }
  }
}

/**
 * 获取当前页面路径
 * @returns
 */
export function getCurrentPath (): string {
  const appConfig = (window as any).__taroAppConfig || {}
  const routePath = getCurrentPage(appConfig.router?.mode, appConfig.router?.basename)
  const homePath = getHomePage(appConfig.routes?.[0]?.path, appConfig.router?.basename, appConfig.router?.customRoutes, appConfig.entryPagePath)

  /**
   * createPageConfig 时根据 stack 的长度来设置 stamp 以保证页面 path 的唯一，此函数是在 createPageConfig 之前调用，预先设置 stamp=1
   * url 上没有指定应用的启动页面时使用 homePath
   */
  return `${routePath === '/' ? homePath : routePath}?stamp=1`
}

export * from './animation'
export * from './lodash'
export * from './valid'
