/* eslint-disable prefer-promise-reject-errors */
import { Current, container, SERVICE_IDENTIFIER, IHooks, TaroElement } from '@tarojs/runtime'

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
  const runtimeHooks = container.get<IHooks>(SERVICE_IDENTIFIER.Hooks)

  if (inst) {
    const find = runtimeHooks.getDOMNode
    if (typeof find === 'function') {
      return find(inst)
    }
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

export function temporarilyNotSupport (apiName) {
  return () => {
    const errMsg = `暂时不支持 API ${apiName}`
    if (process.env.NODE_ENV !== 'production') {
      console.error(errMsg)
      return Promise.reject({
        errMsg
      })
    } else {
      console.warn(errMsg)
      return Promise.resolve({
        errMsg
      })
    }
  }
}

export function weixinCorpSupport (apiName) {
  return () => {
    const errMsg = `h5端当前仅在微信公众号JS-SDK环境下支持此 API ${apiName}`
    if (process.env.NODE_ENV !== 'production') {
      console.error(errMsg)
      return Promise.reject({
        errMsg
      })
    } else {
      console.warn(errMsg)
      return Promise.resolve({
        errMsg
      })
    }
  }
}

export function permanentlyNotSupport (apiName) {
  return () => {
    const errMsg = `不支持 API ${apiName}`
    if (process.env.NODE_ENV !== 'production') {
      console.error(errMsg)
      return Promise.reject({
        errMsg
      })
    } else {
      console.warn(errMsg)
      return Promise.resolve({
        errMsg
      })
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
  return (options: Partial<TOptions> = {}): Promise<TResult> => {
    // @ts-ignore
    const targetApi = window?.wx?.[name]
    const opts = formatOptions(Object.assign({}, defaultOptions, options))
    if (typeof targetApi === 'function') {
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
    } else if (typeof standardMethod === 'function') {
      return standardMethod(opts)
    } else {
      return notSupported() as Promise<TResult>
    }
  }
}

export * from './animation'
export * from './lodash'
export * from './valid'
