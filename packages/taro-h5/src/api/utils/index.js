/* eslint-disable prefer-promise-reject-errors */
import { Current, CurrentReconciler } from '@tarojs/runtime'

function shouleBeObject (target) {
  if (target && typeof target === 'object') return { res: true }
  return {
    res: false,
    msg: getParameterError({
      correct: 'Object',
      wrong: target
    })
  }
}

export function findDOM (inst) {
  if (inst) {
    const find = CurrentReconciler.findDOMNode
    if (typeof find === 'function') {
      return find(inst)
    }
  }

  const page = Current.page
  const path = page.path
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

function getParameterError ({ name = '', para, correct, wrong }) {
  const parameter = para ? `parameter.${para}` : 'parameter'
  const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong)
  return `${name}:fail parameter error: ${parameter} should be ${correct} instead of ${errorType}`
}

function upperCaseFirstLetter (string) {
  if (typeof string !== 'string') return string
  string = string.replace(/^./, match => match.toUpperCase())
  return string
}

function inlineStyle (style) {
  let res = ''
  for (const attr in style) res += `${attr}: ${style[attr]};`
  if (res.indexOf('display: flex;') >= 0) res += 'display: -webkit-box;display: -webkit-flex;'
  res = res.replace(/transform:(.+?);/g, (s, $1) => `${s}-webkit-transform:${$1};`)
  res = res.replace(/flex-direction:(.+?);/g, (s, $1) => `${s}-webkit-flex-direction:${$1};`)
  return res
}

function setTransform (el, val) {
  el.style.webkitTransform = val
  el.style.transform = val
}

function isFunction (obj) {
  return typeof obj === 'function'
}

function successHandler (success, complete) {
  return function (res) {
    isFunction(success) && success(res)
    isFunction(complete) && complete(res)
    return Promise.resolve(res)
  }
}

function errorHandler (fail, complete) {
  return function (res) {
    isFunction(fail) && fail(res)
    isFunction(complete) && complete(res)
    return Promise.reject(res)
  }
}

function serializeParams (params) {
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

function temporarilyNotSupport (apiName) {
  return () => {
    const errMsg = `暂时不支持 API ${apiName}`
    console.error(errMsg)
    return Promise.reject({
      errMsg
    })
  }
}

function weixinCorpSupport (apiName) {
  return () => {
    const errMsg = `h5端仅在微信公众号中支持 API ${apiName}`
    console.error(errMsg)
    return Promise.reject({
      errMsg
    })
  }
}

function permanentlyNotSupport (apiName) {
  return () => {
    const errMsg = `不支持 API ${apiName}`
    console.error(errMsg)
    return Promise.reject({
      errMsg
    })
  }
}

const VALID_COLOR_REG = /^#[0-9a-fA-F]{6}$/

const isValidColor = (color) => {
  return VALID_COLOR_REG.test(color)
}

const createCallbackManager = () => {
  const callbacks = []

  /**
   * 添加回调
   * @param {{ callback: function, ctx: any } | function} opt
   */
  const add = (opt) => {
    callbacks.push(opt)
  }

  /**
   * 移除回调
   * @param {{ callback: function, ctx: any } | function} opt
   */
  const remove = (opt) => {
    let pos = -1
    callbacks.forEach((callback, k) => {
      if (callback === opt) {
        pos = k
      }
    })
    if (pos > -1) {
      callbacks.splice(pos, 1)
    }
  }

  /**
   * 获取回调函数数量
   * @return {number}
   */
  const count = () => callbacks.length

  /**
   * 触发回调
   * @param  {...any} args 回调的调用参数
   */
  const trigger = (...args) => {
    callbacks.forEach(opt => {
      if (typeof opt === 'function') {
        opt(...args)
      } else {
        const { callback, ctx } = opt
        callback.call(ctx, ...args)
      }
    })
  }

  return {
    add,
    remove,
    count,
    trigger
  }
}

function processOpenapi (apiName, defaultOptions, formatResult = res => res, formatParams = options => options) {
  if (!window.wx) {
    return weixinCorpSupport(apiName)
  }
  return options => {
    options = options || {}
    const obj = Object.assign({}, defaultOptions, options)
    const p = new Promise((resolve, reject) => {
      ['fail', 'success', 'complete'].forEach(k => {
        obj[k] = oriRes => {
          const res = formatResult(oriRes)
          options[k] && options[k](res)
          if (k === 'success') {
            resolve(res)
          } else if (k === 'fail') {
            reject(res)
          }
        }
      })
      wx[apiName](formatParams(obj))
    })
    return p
  }
}

/**
 * ease-in-out的函数
 * @param {number} t 0-1的数字
 */
const easeInOut = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

const getTimingFunc = (easeFunc, frameCnt) => {
  return x => {
    if (frameCnt <= 1) {
      return easeFunc(1)
    }
    const t = x / (frameCnt - 1)
    return easeFunc(t)
  }
}

export {
  shouleBeObject,
  getParameterError,
  inlineStyle,
  setTransform,
  successHandler,
  errorHandler,
  serializeParams,
  temporarilyNotSupport,
  weixinCorpSupport,
  permanentlyNotSupport,
  isValidColor,
  isFunction,
  createCallbackManager,
  processOpenapi,
  easeInOut,
  getTimingFunc
}
